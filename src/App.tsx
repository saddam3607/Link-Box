import React, { useState, useMemo } from 'react';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { RgbBox } from './components/RgbBox';
import { VideoCard } from './components/VideoCard';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { VipUnlockModal } from './components/VipUnlockModal';
import { AdminPanel } from './components/AdminPanel';
import { AdBanner } from './components/AdBanner';
import { VideoItem } from './types/app';
import {
  Sparkles,
  Crown,
  Search,
  Settings,
  ShieldCheck,
  Flame,
  Smartphone,
  Maximize2,
  Tv,
  HelpCircle,
  KeyRound
} from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    config,
    categories,
    videos,
    hasVipPass,
    isMobile916View,
    setIsMobile916View,
    triggerHaptic,
    handleAdClick,
  } = useThemeContext();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [unlockTargetVideo, setUnlockTargetVideo] = useState<VideoItem | null>(null);
  const [showVipModal, setShowVipModal] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const matchCategory = selectedCategory === 'all' || v.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [videos, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start antialiased font-sans selection:bg-pink-600 selection:text-white">
      {/* 9:16 Mobile Telegram Wrapper or Fullscreen Responsive Mode */}
      <div
        className={`w-full transition-all duration-300 flex flex-col min-h-screen ${
          isMobile916View
            ? 'max-w-[430px] my-0 sm:my-4 rounded-none sm:rounded-[2.5rem] shadow-[0_0_50px_rgba(236,72,153,0.25)] border-0 sm:border-8 sm:border-slate-800 overflow-hidden bg-slate-950'
            : 'max-w-4xl mx-auto'
        }`}
      >
        {/* Top Floating Control Bar for Telegram / 9:16 Mode */}
        <div className="w-full bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-300">টেলিগ্রাম মিনি অ্যাপ (লাইভ)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsMobile916View(!isMobile916View);
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="মোবাইল ৯:১৬ এবং ফুলস্ক্রিন প্রিভিউ সুইচ করুন"
            >
              <Smartphone className="w-3 h-3 text-amber-400" />
              <span>{isMobile916View ? '৯:১৬ সক্রিয়' : 'ফুলস্ক্রিন মোড'}</span>
            </button>
          </div>
        </div>

        {/* Main App Content Container */}
        <div className="p-3 sm:p-4 flex flex-col gap-3 flex-1 pb-20">
          {/* Header Bar with Rotating RGB Border */}
          <RgbBox borderWidth={2} rounded="rounded-2xl">
            <header className="p-3 sm:p-4 bg-slate-900/95 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 text-white flex items-center justify-center font-black shadow-lg shadow-pink-500/20 shrink-0">
                  <Tv className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    <span>{config.appName}</span>
                    <Sparkles className="w-4 h-4 text-pink-400" />
                  </h1>
                  <p className="text-[11px] text-slate-400 font-medium truncate max-w-[190px] sm:max-w-none">
                    {config.appSubtitle}
                  </p>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* VIP Button */}
                <button
                  onClick={() => {
                    triggerHaptic('medium');
                    setShowVipModal(true);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                    hasVipPass
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 shadow-amber-500/30'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden xs:inline">{hasVipPass ? 'ভিআইপি মেম্বার' : 'ভিআইপি পিন নিন'}</span>
                  <span className="xs:hidden">{hasVipPass ? 'VIP' : 'পিন'}</span>
                </button>

                {/* Admin Button */}
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setShowAdminPanel(true);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 active:scale-95"
                  title="অ্যাডমিন কন্ট্রোল প্যানেল"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </header>
          </RgbBox>

          {/* Announcement Marquee Bar with Rotating RGB Lighting */}
          {config.announcementText && (
            <RgbBox borderWidth={2} rounded="rounded-xl">
              <div className="py-2 px-3 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 flex items-center gap-2 overflow-hidden">
                <span className="px-1.5 py-0.5 rounded bg-pink-500 text-white font-bold text-[10px] shrink-0">
                  বিজ্ঞপ্তি
                </span>
                <div className="text-xs text-amber-200 font-semibold truncate animate-pulse flex-1 text-left">
                  {config.announcementText}
                </div>
              </div>
            </RgbBox>
          )}

          {/* Top Adsterra Ad Banner Placement */}
          <AdBanner type="top" />

          {/* Search Bar with Rotating RGB Border */}
          <RgbBox borderWidth={2} rounded="rounded-xl">
            <div className="p-2 bg-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 ml-1.5 shrink-0" />
              <input
                type="text"
                placeholder="ভিডিও খুঁজুন (শিরোনাম বা বিবরণ দিয়ে)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-white px-2"
                >
                  ক্লিয়ার
                </button>
              )}
            </div>
          </RgbBox>

          {/* 4 Default Categories & All Filter - Enclosed in Rotating RGB Tabs */}
          <div className="flex flex-col gap-1.5 text-left">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-pink-500" />
                <span>ক্যাটাগরি নির্বাচন করুন</span>
              </span>
              <span>{filteredVideos.length}টি ভিডিও পাওয়া গেছে</span>
            </div>

            {/* Category Tabs Scroll */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {/* All Category Pill */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedCategory('all');
                }}
                className="shrink-0"
              >
                <RgbBox
                  borderWidth={2}
                  rounded="rounded-xl"
                  highlight={selectedCategory === 'all'}
                >
                  <div
                    className={`px-3.5 py-2 text-xs font-bold transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                        : 'bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    সব ভিডিও ({videos.length})
                  </div>
                </RgbBox>
              </button>

              {/* Configured 4 Default Categories */}
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = videos.filter(v => v.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedCategory(cat.id);
                    }}
                    className="shrink-0"
                  >
                    <RgbBox
                      borderWidth={2}
                      rounded="rounded-xl"
                      highlight={isSelected}
                    >
                      <div
                        className={`px-3 py-2 text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white'
                            : 'bg-slate-900 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] opacity-75 font-mono">({count})</span>
                      </div>
                    </RgbBox>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Video Grid - Every Box Has Rotating RGB Lighting and 16:9 Ratio */}
          {filteredVideos.length === 0 ? (
            <RgbBox borderWidth={2} rounded="rounded-2xl" className="my-8">
              <div className="p-8 bg-slate-900 text-center flex flex-col items-center justify-center gap-3">
                <Tv className="w-12 h-12 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-300">কোনো ভিডিও পাওয়া যায়নি!</h3>
                <p className="text-xs text-slate-400">
                  অন্য কোনো ক্যাটাগরি বেছে নিন অথবা অ্যাডমিন প্যানেল থেকে নতুন ভিডিও যুক্ত করুন।
                </p>
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold"
                >
                  ভিডিও যোগ করুন
                </button>
              </div>
            </RgbBox>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
              {filteredVideos.map((video, idx) => (
                <React.Fragment key={video.id}>
                  <VideoCard
                    video={video}
                    categoryName={categories.find(c => c.id === video.category)?.name}
                    onPlay={(v) => setPlayingVideo(v)}
                    onUnlockRequest={(v) => {
                      setUnlockTargetVideo(v);
                      setShowVipModal(true);
                    }}
                  />
                  {/* Insert middle in-feed banner after 2nd video */}
                  {idx === 1 && (
                    <div className="col-span-1 sm:col-span-2">
                      <AdBanner type="middle" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Bottom Adsterra Ad Banner */}
          <AdBanner type="bottom" />

          {/* Quick VIP Unlock Banner with Rotating RGB Border */}
          {!hasVipPass && (
            <RgbBox borderWidth={2} rounded="rounded-2xl" highlight={true}>
              <div
                onClick={() => {
                  triggerHaptic('medium');
                  handleAdClick();
                  setShowVipModal(true);
                }}
                className="p-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 flex items-center justify-between cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center gap-1.5">
                      <span>আনলিমিটেড প্রিমিয়াম ভিডিও দেখতে চান?</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      বিকাশ, নগদ, রকেট বা বাইনান্সে পেমেন্ট করে তাৎক্ষণিক পিন নাম্বার পান
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shrink-0 group-hover:scale-105 transition-transform shadow-md">
                  পিন নিন
                </div>
              </div>
            </RgbBox>
          )}

          {/* Footer with Info */}
          <footer className="mt-4 pt-4 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col gap-1.5">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>নিরাপদ টেলিগ্রাম মিনি অ্যাপ আর্কিটেকচার</span>
              <span>·</span>
              <button
                onClick={() => setShowAdminPanel(true)}
                className="text-pink-400 hover:underline font-semibold"
              >
                অ্যাডমিন প্যানেল
              </button>
            </div>
            <p className="text-[10px] text-slate-600">
              সবগুলো বক্স ৩৬০ ডিগ্রি আরজিবি লাইটিং ঘুরতে থাকবে · ১৬:৯ ভিডিও ফরম্যাট · নেটলিফাই সাপোর্টেড
            </p>
          </footer>
        </div>

        {/* Video Player Modal (16:9 Ratio) */}
        {playingVideo && (
          <VideoPlayerModal
            video={playingVideo}
            onClose={() => setPlayingVideo(null)}
          />
        )}

        {/* VIP Unlock / PIN & Payment Modal (bKash, Nagad, Rocket, Binance) */}
        {showVipModal && (
          <VipUnlockModal
            targetVideo={unlockTargetVideo}
            onClose={() => {
              setShowVipModal(false);
              setUnlockTargetVideo(null);
            }}
            onUnlocked={() => {
              if (unlockTargetVideo) {
                setPlayingVideo(unlockTargetVideo);
              }
            }}
          />
        )}

        {/* Full A-to-Z Admin Panel Modal */}
        {showAdminPanel && (
          <AdminPanel onClose={() => setShowAdminPanel(false)} />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
