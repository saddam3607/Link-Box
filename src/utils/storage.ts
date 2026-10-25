import {
  AppConfig,
  CategoryItem,
  PaymentConfig,
  PinItem,
  VideoItem,
  AdsterraConfig,
  RgbTheme,
  RgbSpeed,
  RgbGlow
} from '../types/app';
import {
  DEFAULT_ADSTERRA,
  DEFAULT_CATEGORIES,
  DEFAULT_CONFIG,
  DEFAULT_PAYMENT,
  DEFAULT_PINS,
  DEFAULT_VIDEOS
} from '../data/initialData';

const STORAGE_KEYS = {
  VIDEOS: 'tg_app_videos_v1',
  CATEGORIES: 'tg_app_categories_v1',
  PINS: 'tg_app_pins_v1',
  PAYMENT: 'tg_app_payment_v1',
  ADSTERRA: 'tg_app_adsterra_v1',
  CONFIG: 'tg_app_config_v1',
  UNLOCKED_VIDEOS: 'tg_app_unlocked_videos_v1',
  HAS_VIP: 'tg_app_has_vip_v1',
  FAVORITES: 'tg_app_favorites_v1',
};

// Safe JSON parse with fallback
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

export const Storage = {
  // Videos
  getVideos: (): VideoItem[] => getStored<VideoItem[]>(STORAGE_KEYS.VIDEOS, DEFAULT_VIDEOS),
  setVideos: (videos: VideoItem[]) => setStored(STORAGE_KEYS.VIDEOS, videos),

  // Categories
  getCategories: (): CategoryItem[] => getStored<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES),
  setCategories: (categories: CategoryItem[]) => setStored(STORAGE_KEYS.CATEGORIES, categories),

  // PINs
  getPins: (): PinItem[] => getStored<PinItem[]>(STORAGE_KEYS.PINS, DEFAULT_PINS),
  setPins: (pins: PinItem[]) => setStored(STORAGE_KEYS.PINS, pins),

  // Payment Config
  getPayment: (): PaymentConfig => getStored<PaymentConfig>(STORAGE_KEYS.PAYMENT, DEFAULT_PAYMENT),
  setPayment: (payment: PaymentConfig) => setStored(STORAGE_KEYS.PAYMENT, payment),

  // Adsterra Config
  getAdsterra: (): AdsterraConfig => getStored<AdsterraConfig>(STORAGE_KEYS.ADSTERRA, DEFAULT_ADSTERRA),
  setAdsterra: (adsterra: AdsterraConfig) => setStored(STORAGE_KEYS.ADSTERRA, adsterra),

  // App Config
  getConfig: (): AppConfig => getStored<AppConfig>(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG),
  setConfig: (config: AppConfig) => setStored(STORAGE_KEYS.CONFIG, config),

  // User Unlocked status
  getUnlockedVideos: (): string[] => getStored<string[]>(STORAGE_KEYS.UNLOCKED_VIDEOS, []),
  unlockVideo: (videoId: string) => {
    const current = Storage.getUnlockedVideos();
    if (!current.includes(videoId)) {
      const updated = [...current, videoId];
      setStored(STORAGE_KEYS.UNLOCKED_VIDEOS, updated);
      return updated;
    }
    return current;
  },

  hasVipPass: (): boolean => getStored<boolean>(STORAGE_KEYS.HAS_VIP, false),
  setVipPass: (status: boolean) => setStored(STORAGE_KEYS.HAS_VIP, status),

  // Verify PIN
  verifyAndUsePin: (inputPin: string, videoId?: string): { success: boolean; message: string; isAllAccess?: boolean } => {
    const trimmed = inputPin.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: 'দয়া করে পিন নাম্বারটি সঠিকভাবে লিখুন।' };
    }

    const pins = Storage.getPins();
    const pinIndex = pins.findIndex(p => p.pin.toUpperCase() === trimmed);

    if (pinIndex === -1) {
      return { success: false, message: 'ভুল পিন নাম্বার! দয়া করে সঠিক পিন দিন বা অ্যাডমিন থেকে পিন নিন।' };
    }

    const matchedPin = pins[pinIndex];

    if (matchedPin.isUsed && matchedPin.type !== 'all_access') {
      return { success: false, message: 'এই পিনটি ইতিমধ্যে ব্যবহার করা হয়ে গেছে! নতুন পিন সংগ্রহ করুন।' };
    }

    // Mark as used if not a permanent all-access master pin
    if (matchedPin.type !== 'all_access') {
      pins[pinIndex] = {
        ...matchedPin,
        isUsed: true,
        usedAt: new Date().toISOString(),
      };
      Storage.setPins(pins);
    }

    if (matchedPin.type === 'all_access') {
      Storage.setVipPass(true);
      return { success: true, message: 'অভিনন্দন! আপনার ফুল ভিআইপি এক্সেস সক্রিয় হয়েছে!', isAllAccess: true };
    } else {
      if (videoId) {
        Storage.unlockVideo(videoId);
      }
      return { success: true, message: 'অভিনন্দন! ভিডিওটি সফলভাবে আনলক হয়েছে!', isAllAccess: false };
    }
  },

  // Export all data
  exportBackup: () => {
    const backup = {
      videos: Storage.getVideos(),
      categories: Storage.getCategories(),
      pins: Storage.getPins(),
      payment: Storage.getPayment(),
      adsterra: Storage.getAdsterra(),
      config: Storage.getConfig(),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import backup data
  importBackup: (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.videos) Storage.setVideos(data.videos);
      if (data.categories) Storage.setCategories(data.categories);
      if (data.pins) Storage.setPins(data.pins);
      if (data.payment) Storage.setPayment(data.payment);
      if (data.adsterra) Storage.setAdsterra(data.adsterra);
      if (data.config) Storage.setConfig(data.config);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  // Reset to default
  resetDefaults: () => {
    Storage.setVideos(DEFAULT_VIDEOS);
    Storage.setCategories(DEFAULT_CATEGORIES);
    Storage.setPins(DEFAULT_PINS);
    Storage.setPayment(DEFAULT_PAYMENT);
    Storage.setAdsterra(DEFAULT_ADSTERRA);
    Storage.setConfig(DEFAULT_CONFIG);
    setStored(STORAGE_KEYS.UNLOCKED_VIDEOS, []);
    setStored(STORAGE_KEYS.HAS_VIP, false);
  }
};

// Helper for RGB theme gradients
export const RGB_GRADIENTS: Record<RgbTheme, string> = {
  rainbow: 'conic-gradient(from 0deg, #ff0055, #ff5500, #ffee00, #00ff66, #00ffff, #0066ff, #aa00ff, #ff00aa, #ff0055)',
  cyberpunk: 'conic-gradient(from 0deg, #00f3ff, #ff0077, #7000ff, #00f3ff, #ff0077, #00f3ff)',
  gold_ruby: 'conic-gradient(from 0deg, #eab308, #ef4444, #f59e0b, #b91c1c, #fbbf24, #eab308)',
  matrix: 'conic-gradient(from 0deg, #10b981, #06b6d4, #22c55e, #14b8a6, #34d399, #10b981)',
  fire_ice: 'conic-gradient(from 0deg, #ef4444, #3b82f6, #f97316, #06b6d4, #ef4444)',
  custom: 'conic-gradient(from 0deg, #ec4899, #8b5cf6, #3b82f6, #06b6d4, #ec4899)',
};

export const RGB_SPEEDS: Record<RgbSpeed, string> = {
  fast: '1.8s',
  normal: '4s',
  slow: '7s',
};

export const RGB_BLURS: Record<RgbGlow, { blur: string; opacity: string }> = {
  soft: { blur: '2px', opacity: '0.7' },
  medium: { blur: '4px', opacity: '0.9' },
  high: { blur: '8px', opacity: '1.0' },
};
