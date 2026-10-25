import { AppConfig, CategoryItem, PaymentConfig, PinItem, VideoItem, AdsterraConfig } from '../types/app';

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'cat_trending', name: '🔥 ট্রেন্ডিং ভিডিও', icon: 'Flame', color: '#f97316' },
  { id: 'cat_movie', name: '🎬 মুভি ও ড্রামা', icon: 'Film', color: '#06b6d4' },
  { id: 'cat_vip', name: '💎 প্রিমিয়াম ভিআইপি', icon: 'Crown', color: '#eab308' },
  { id: 'cat_shorts', name: '⚡ ভাইরাল ক্লিপস', icon: 'Zap', color: '#ec4899' },
];

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'সাইবার সিটি থ্রিলার - দ্য লাস্ট রান (HD 1080p)',
    description: 'রাতের নিয়ন শহরের অ্যাকশন প্যাকড মেগা থ্রিলার। চমৎকার ভিজ্যুয়াল ও মিউজিক।',
    category: 'cat_movie',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: '/src/assets/images/thumb_action_movie_1792919311965.jpg',
    duration: '12:14',
    views: 45290,
    isPremium: false,
    addedAt: '2026-03-20',
  },
  {
    id: 'vid-2',
    title: 'ভিআইপি এক্সক্লুসিভ লাউঞ্জ পার্টি ও সেলিব্রেটি শো (4K Ultra)',
    description: 'শুধুমাত্র ভিআইপি মেম্বারদের জন্য বিশেষ আনকাট কালেকশন। দেখতে পিন নম্বর দিয়ে আনলক করুন।',
    category: 'cat_vip',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: '/src/assets/images/thumb_vip_exclusive_1792919310204.jpg',
    duration: '18:45',
    views: 89120,
    isPremium: true,
    addedAt: '2026-03-22',
  },
  {
    id: 'vid-3',
    title: 'মেগা ইডিএম নিয়ন নাইট কনসার্ট লাইভ স্ট্রিমিং',
    description: 'বিশ্বখ্যাত ডিজে এবং লেজার লাইট শো-এর অভূতপূর্ব ভাইরাল লাইভ পরিবেশনা।',
    category: 'cat_trending',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: '/src/assets/images/thumb_trending_viral_1792919312242.jpg',
    duration: '09:56',
    views: 124300,
    isPremium: false,
    addedAt: '2026-03-23',
  },
  {
    id: 'vid-4',
    title: 'ইমোশনাল নাইট ড্রামা - শহরের শেষ চিঠি (ভিআইপি পর্ব)',
    description: 'হৃদয়স্পর্শী শর্ট ড্রামা সিরিজ। প্রিমিয়াম পিন দিয়ে সম্পূর্ণ এইচডি কোয়ালিটিতে দেখুন।',
    category: 'cat_shorts',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/src/assets/images/thumb_short_drama_1792919312897.jpg',
    duration: '15:20',
    views: 67800,
    isPremium: true,
    addedAt: '2026-03-24',
  },
];

export const DEFAULT_PINS: PinItem[] = [
  { pin: '789456', createdAt: '2026-03-24', isUsed: false, type: 'all_access', customerNote: 'ডেমো ভিআইপি পিন ১' },
  { pin: '112233', createdAt: '2026-03-24', isUsed: false, type: 'all_access', customerNote: 'ডেমো ভিআইপি পিন ২' },
  { pin: '889900', createdAt: '2026-03-24', isUsed: false, type: 'all_access', customerNote: 'বিকাশ পেমেন্ট পিন' },
  { pin: 'VIP2026', createdAt: '2026-03-24', isUsed: false, type: 'all_access', customerNote: 'লাইফটাইম ভিআইপি পাস' },
];

export const DEFAULT_PAYMENT: PaymentConfig = {
  bkashNumber: '01700-000000',
  bkashType: 'Personal',
  nagadNumber: '01800-000000',
  nagadType: 'Personal',
  rocketNumber: '01900-000000',
  rocketType: 'Personal',
  binanceAddress: 'TQjXz...Trc20ExampleAddress99xXyZ',
  binanceNetwork: 'USDT (TRC20)',
  binancePayId: '839201948',
  priceBDT: 100,
  priceUSD: 1,
  adminTelegram: 'smloverboy420',
  instructionBn: 'যেকোনো মাধ্যমে পেমেন্ট সম্পন্ন করে ট্রানজেকশন আইডি বা স্ক্রিনশট আমাদের টেলিগ্রাম অ্যাডমিনের কাছে পাঠিয়ে সাথে সাথে আনলক পিন নাম্বার সংগ্রহ করুন।',
};

export const DEFAULT_ADSTERRA: AdsterraConfig = {
  enabled: true,
  bannerTopCode: '',
  bannerMiddleCode: '',
  bannerBottomCode: '',
  directLinkUrl: 'https://www.profitablecpmrate.com/sample_direct_link',
  popunderEnabled: true,
  clickFrequency: 2,
};

export const DEFAULT_CONFIG: AppConfig = {
  appName: 'টেলিগ্রাম মিনি ভিডিও অ্যাপ',
  appSubtitle: 'HD কোয়ালিটি ভিডিও ও প্রিমিয়াম এক্সক্লুসিভ কন্টেন্ট',
  announcementText: '🔥 বিশেষ অফার: বিকাশ/নগদে মাত্র ১০০ টাকায় লাইফটাইম ভিআইপি পিন নিয়ে সকল ভিডিও আনলক করুন!',
  adminPassword: '1234',
  rgbTheme: 'rainbow',
  rgbSpeed: 'normal',
  rgbGlow: 'high',
  themeMode: 'dark',
};
