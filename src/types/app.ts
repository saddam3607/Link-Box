export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  videoUrl: string; // Direct mp4, webm, or embed URL (16:9)
  thumbnailUrl: string; // 16:9 thumbnail
  duration: string;
  views: number;
  isPremium: boolean;
  addedAt: string;
  isCustomUrl?: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

export interface PinItem {
  pin: string;
  createdAt: string;
  isUsed: boolean;
  usedAt?: string;
  type: 'all_access' | 'single_video'; // all_access unlocks all VIP, or single
  videoId?: string;
  customerNote?: string;
}

export interface PaymentConfig {
  bkashNumber: string;
  bkashType: 'Personal' | 'Merchant' | 'Agent';
  nagadNumber: string;
  nagadType: 'Personal' | 'Merchant';
  rocketNumber: string;
  rocketType: 'Personal' | 'Agent';
  binanceAddress: string;
  binanceNetwork: string; // e.g., 'USDT (TRC20)' or 'USDT (BEP20)'
  binancePayId: string;
  priceBDT: number;
  priceUSD: number;
  adminTelegram: string; // e.g. "smloverboy420" or full URL
  instructionBn: string;
}

export interface AdsterraConfig {
  enabled: boolean;
  bannerTopCode: string;
  bannerMiddleCode: string;
  bannerBottomCode: string;
  directLinkUrl: string;
  popunderEnabled: boolean;
  clickFrequency: number; // e.g. open link every X clicks
}

export type RgbTheme = 'rainbow' | 'cyberpunk' | 'gold_ruby' | 'matrix' | 'fire_ice' | 'custom';
export type RgbSpeed = 'fast' | 'normal' | 'slow';
export type RgbGlow = 'soft' | 'medium' | 'high';

export interface AppConfig {
  appName: string;
  appSubtitle: string;
  announcementText: string;
  adminPassword: string;
  rgbTheme: RgbTheme;
  rgbSpeed: RgbSpeed;
  rgbGlow: RgbGlow;
  customRgbColors?: string[];
  themeMode: 'dark';
}
