import React, { createContext, useContext, useEffect, useState } from 'react';
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
  Storage,
  RGB_GRADIENTS,
  RGB_SPEEDS,
  RGB_BLURS
} from '../utils/storage';

interface ThemeContextType {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  categories: CategoryItem[];
  setCategories: (cats: CategoryItem[]) => void;
  videos: VideoItem[];
  setVideos: (vids: VideoItem[]) => void;
  pins: PinItem[];
  setPins: (pins: PinItem[]) => void;
  payment: PaymentConfig;
  setPayment: (pay: PaymentConfig) => void;
  adsterra: AdsterraConfig;
  setAdsterra: (ad: AdsterraConfig) => void;
  unlockedVideos: string[];
  hasVipPass: boolean;
  unlockVideo: (id: string) => void;
  setVipPass: (status: boolean) => void;
  verifyPin: (pin: string, videoId?: string) => { success: boolean; message: string; isAllAccess?: boolean };
  // Visual RGB calculated values
  currentRgbGradient: string;
  currentRgbSpeed: string;
  currentRgbBlur: string;
  currentRgbOpacity: string;
  // Mobile / View Mode Toggle
  isMobile916View: boolean;
  setIsMobile916View: (val: boolean) => void;
  // Adsterra ad click handler
  handleAdClick: () => void;
  // Haptic feedback for Telegram WebApp
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
  refreshAll: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<AppConfig>(Storage.getConfig());
  const [categories, setCategoriesState] = useState<CategoryItem[]>(Storage.getCategories());
  const [videos, setVideosState] = useState<VideoItem[]>(Storage.getVideos());
  const [pins, setPinsState] = useState<PinItem[]>(Storage.getPins());
  const [payment, setPaymentState] = useState<PaymentConfig>(Storage.getPayment());
  const [adsterra, setAdsterraState] = useState<AdsterraConfig>(Storage.getAdsterra());
  const [unlockedVideos, setUnlockedVideos] = useState<string[]>(Storage.getUnlockedVideos());
  const [hasVipPass, setHasVipPassState] = useState<boolean>(Storage.hasVipPass());
  const [isMobile916View, setIsMobile916View] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);

  // Initialize Telegram WebApp SDK if available
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as unknown as { Telegram?: { WebApp?: { ready: () => void; expand: () => void } } }).Telegram?.WebApp) {
      try {
        const tg = (window as unknown as { Telegram: { WebApp: { ready: () => void; expand: () => void } } }).Telegram.WebApp;
        tg.ready();
        tg.expand();
      } catch {
        // Ignore outside Telegram
      }
    }
  }, []);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    try {
      const tg = (window as unknown as {
        Telegram?: {
          WebApp?: {
            HapticFeedback?: {
              impactOccurred: (style: string) => void;
              notificationOccurred: (type: string) => void;
            };
          };
        };
      })?.Telegram?.WebApp?.HapticFeedback;

      if (tg) {
        if (type === 'success' || type === 'error') {
          tg.notificationOccurred(type);
        } else {
          tg.impactOccurred(type);
        }
      } else if (navigator.vibrate) {
        navigator.vibrate(type === 'error' ? [50, 50, 50] : 30);
      }
    } catch {
      // Fallback safe
    }
  };

  const handleAdClick = () => {
    if (!adsterra.enabled || !adsterra.directLinkUrl || !adsterra.popunderEnabled) return;
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount % (adsterra.clickFrequency || 2) === 0) {
      try {
        window.open(adsterra.directLinkUrl, '_blank', 'noopener,noreferrer');
      } catch {
        // Blocked popup safe
      }
    }
  };

  const updateConfig = (newCfg: Partial<AppConfig>) => {
    const updated = { ...config, ...newCfg };
    setConfigState(updated);
    Storage.setConfig(updated);
  };

  const setCategories = (cats: CategoryItem[]) => {
    setCategoriesState(cats);
    Storage.setCategories(cats);
  };

  const setVideos = (vids: VideoItem[]) => {
    setVideosState(vids);
    Storage.setVideos(vids);
  };

  const setPins = (p: PinItem[]) => {
    setPinsState(p);
    Storage.setPins(p);
  };

  const setPayment = (pay: PaymentConfig) => {
    setPaymentState(pay);
    Storage.setPayment(pay);
  };

  const setAdsterra = (ad: AdsterraConfig) => {
    setAdsterraState(ad);
    Storage.setAdsterra(ad);
  };

  const unlockVideo = (id: string) => {
    const updated = Storage.unlockVideo(id);
    setUnlockedVideos(updated);
  };

  const setVipPass = (status: boolean) => {
    Storage.setVipPass(status);
    setHasVipPassState(status);
  };

  const verifyPin = (pin: string, videoId?: string) => {
    const res = Storage.verifyAndUsePin(pin, videoId);
    if (res.success) {
      if (res.isAllAccess) {
        setHasVipPassState(true);
      }
      if (videoId) {
        setUnlockedVideos(Storage.getUnlockedVideos());
      }
      setPinsState(Storage.getPins());
    }
    return res;
  };

  const refreshAll = () => {
    setConfigState(Storage.getConfig());
    setCategoriesState(Storage.getCategories());
    setVideosState(Storage.getVideos());
    setPinsState(Storage.getPins());
    setPaymentState(Storage.getPayment());
    setAdsterraState(Storage.getAdsterra());
    setUnlockedVideos(Storage.getUnlockedVideos());
    setHasVipPassState(Storage.hasVipPass());
  };

  const currentRgbGradient = RGB_GRADIENTS[config.rgbTheme] || RGB_GRADIENTS.rainbow;
  const currentRgbSpeed = RGB_SPEEDS[config.rgbSpeed] || '4s';
  const blurSettings = RGB_BLURS[config.rgbGlow] || RGB_BLURS.high;

  return (
    <ThemeContext.Provider
      value={{
        config,
        updateConfig,
        categories,
        setCategories,
        videos,
        setVideos,
        pins,
        setPins,
        payment,
        setPayment,
        adsterra,
        setAdsterra,
        unlockedVideos,
        hasVipPass,
        unlockVideo,
        setVipPass,
        verifyPin,
        currentRgbGradient,
        currentRgbSpeed,
        currentRgbBlur: blurSettings.blur,
        currentRgbOpacity: blurSettings.opacity,
        isMobile916View,
        setIsMobile916View,
        handleAdClick,
        triggerHaptic,
        refreshAll,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return ctx;
};
