import React, { useState } from 'react';
import { useThemeContext } from '../context/ThemeContext';
import { RgbBox } from './RgbBox';
import { VideoItem, CategoryItem, PinItem, RgbTheme, RgbSpeed, RgbGlow } from '../types/app';
import { Storage } from '../utils/storage';
import {
  Film,
  FolderPlus,
  KeyRound,
  CreditCard,
  Tv,
  Palette,
  Database,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Smartphone,
  Eye,
  Crown,
  Share2,
  Save,
  AlertCircle
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const {
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
    isMobile916View,
    setIsMobile916View,
    triggerHaptic,
    refreshAll,
  } = useThemeContext();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Tab in Admin
  const [activeTab, setActiveTab] = useState<'videos' | 'categories' | 'pins' | 'payment' | 'ads' | 'design' | 'backup'>('videos');

  // Video Form State
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoCategory, setVideoCategory] = useState(categories[0]?.id || 'cat_movie');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoThumb, setVideoThumb] = useState('');
  const [videoDuration, setVideoDuration] = useState('10:00');
  const [videoViews, setVideoViews] = useState(1000);
  const [videoIsPremium, setVideoIsPremium] = useState(false);
  const [videoSaveMsg, setVideoSaveMsg] = useState('');

  // PIN Form State
  const [newPinCode, setNewPinCode] = useState('');
  const [newPinType, setNewPinType] = useState<'all_access' | 'single_video'>('all_access');
  const [newPinNote, setNewPinNote] = useState('');
  const [copiedPin, setCopiedPin] = useState<string | null>(null);

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // General feedback message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    if (passwordInput === config.adminPassword || passwordInput === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
      triggerHaptic('success');
    } else {
      setAuthError('ভুল পাসওয়ার্ড! ডিফল্ট পাসওয়ার্ড 1234');
      triggerHaptic('error');
    }
  };

  // Video Management Handlers
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');

    if (!videoTitle.trim()) {
      showToast('দয়া করে ভিডিওর শিরোনাম দিন');
      return;
    }

    const newVideo: VideoItem = {
      id: editingVideoId || `vid-${Date.now()}`,
      title: videoTitle.trim(),
      description: videoDesc.trim(),
      category: videoCategory,
      videoUrl: videoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnailUrl: videoThumb.trim() || '/src/assets/images/thumb_action_movie_1792919311965.jpg',
      duration: videoDuration.trim() || '10:00',
      views: Number(videoViews) || 0,
      isPremium: videoIsPremium,
      addedAt: new Date().toISOString().split('T')[0],
    };

    if (editingVideoId) {
      setVideos(videos.map(v => v.id === editingVideoId ? newVideo : v));
      showToast('ভিডিওটি সফলভাবে আপডেট হয়েছে!');
    } else {
      setVideos([newVideo, ...videos]);
      showToast('নতুন ভিডিও যোগ করা হয়েছে!');
    }

    // Reset Form
    resetVideoForm();
  };

  const resetVideoForm = () => {
    setEditingVideoId(null);
    setVideoTitle('');
    setVideoDesc('');
    setVideoUrl('');
    setVideoThumb('');
    setVideoDuration('10:00');
    setVideoViews(1000);
    setVideoIsPremium(false);
  };

  const handleEditVideo = (v: VideoItem) => {
    setEditingVideoId(v.id);
    setVideoTitle(v.title);
    setVideoDesc(v.description || '');
    setVideoCategory(v.category);
    setVideoUrl(v.videoUrl);
    setVideoThumb(v.thumbnailUrl);
    setVideoDuration(v.duration);
    setVideoViews(v.views);
    setVideoIsPremium(v.isPremium);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত এই ভিডিওটি মুছে ফেলতে চান?')) {
      triggerHaptic('medium');
      setVideos(videos.filter(v => v.id !== id));
      showToast('ভিডিওটি ডিলিট করা হয়েছে');
    }
  };

  // PIN Handlers
  const generateRandomPin = () => {
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    setNewPinCode(random);
  };

  const handleCreatePin = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    const code = newPinCode.trim().toUpperCase();
    if (!code) {
      showToast('দয়া করে পিন কোড লিখুন বা জেনারেট করুন');
      return;
    }

    if (pins.some(p => p.pin.toUpperCase() === code)) {
      showToast('এই পিনটি ইতিমধ্যে বিদ্যমান!');
      return;
    }

    const newPin: PinItem = {
      pin: code,
      createdAt: new Date().toISOString().split('T')[0],
      isUsed: false,
      type: newPinType,
      customerNote: newPinNote.trim() || undefined,
    };

    setPins([newPin, ...pins]);
    setNewPinCode('');
    setNewPinNote('');
    showToast(`পিন "${code}" সফলভাবে তৈরি হয়েছে!`);
  };

  const handleDeletePin = (pinStr: string) => {
    triggerHaptic('medium');
    setPins(pins.filter(p => p.pin !== pinStr));
    showToast('পিন ডিলিট করা হয়েছে');
  };

  const handleCopyPin = (code: string) => {
    triggerHaptic('light');
    navigator.clipboard.writeText(code);
    setCopiedPin(code);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  // Category Handlers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    if (editingCategoryId) {
      setCategories(categories.map(c => c.id === editingCategoryId ? { ...c, name: newCategoryName.trim() } : c));
      setEditingCategoryId(null);
      showToast('ক্যাটাগরি আপডেট করা হয়েছে');
    } else {
      const newCat: CategoryItem = {
        id: `cat_${Date.now()}`,
        name: newCategoryName.trim(),
        icon: 'Flame',
      };
      setCategories([...categories, newCat]);
      showToast('নতুন ক্যাটাগরি তৈরি হয়েছে');
    }
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id: string) => {
    if (categories.length <= 1) {
      showToast('কমপক্ষে ১টি ক্যাটাগরি থাকা আবশ্যক');
      return;
    }
    if (confirm('এই ক্যাটাগরিটি মুছে ফেলতে চান?')) {
      setCategories(categories.filter(c => c.id !== id));
      showToast('ক্যাটাগরি ডিলিট করা হয়েছে');
    }
  };

  // JSON Backup export
  const handleExportBackup = () => {
    const json = Storage.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telegram_app_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('ব্যাকআপ ফাইল ডাউনলোড সম্পন্ন হয়েছে!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && Storage.importBackup(content)) {
        refreshAll();
        showToast('ব্যাকআপ সফলভাবে ইমপোর্ট করা হয়েছে!');
      } else {
        showToast('ব্যাকআপ ফাইলটি ত্রুটিপূর্ণ!');
      }
    };
    reader.readAsText(file);
  };

  // If not logged in, show Password prompt
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <div className="w-full max-w-sm">
          <RgbBox borderWidth={3} rounded="rounded-2xl" highlight={true}>
            <div className="p-6 bg-slate-950 rounded-[calc(1rem-3px)] text-center flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 mx-auto flex items-center justify-center shadow-lg">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-100">অ্যাডমিন প্যানেল প্রবেশ</h3>
                <p className="text-xs text-slate-400 mt-1">সমস্ত নিয়ন্ত্রণ করার জন্য পাসওয়ার্ড প্রদান করুন</p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <input
                  type="password"
                  placeholder="পাসওয়ার্ড লিখুন (ডিফল্ট: 1234)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-center tracking-widest focus:outline-none focus:border-pink-500 text-sm font-mono"
                  autoFocus
                />

                {authError && (
                  <p className="text-xs text-rose-400 font-medium">{authError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  লগইন করুন
                </button>
              </form>

              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-slate-200 mt-1"
              >
                ফিরে যান
              </button>
            </div>
          </RgbBox>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 text-slate-100 backdrop-blur-md">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Admin Navigation Bar with Rotating RGB Border */}
        <RgbBox borderWidth={2} rounded="rounded-2xl">
          <div className="p-3 sm:p-4 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-amber-500 text-white flex items-center justify-center font-black shadow-md">
                AD
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                  <span>মাস্টার অ্যাডমিন কন্ট্রোল</span>
                  <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30">
                    A to Z
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400">অ্যাপের সমস্ত সেটিংস ও কন্টেন্ট নিয়ন্ত্রণ করুন</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* 9:16 Telegram Mobile View Mode Toggle */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setIsMobile916View(!isMobile916View);
                  showToast(isMobile916View ? 'ফুলস্ক্রিন ভিউ মোড' : '৯:১৬ টেলিগ্রাম মোবাইল মোড সক্রিয়');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isMobile916View
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="৯:১৬ টেলিগ্রাম মিনি অ্যাপ ফ্রেম সাইজ প্রিভিউ করুন"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isMobile916View ? '৯:১৬ অন' : '৯:১৬ অফ'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
              >
                অ্যাপে ফিরুন
              </button>
            </div>
          </div>
        </RgbBox>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'videos', label: 'ভিডিও ম্যানেজমেন্ট', icon: Film },
            { id: 'categories', label: 'ক্যাটাগরি কন্ট্রোল (৪টি)', icon: FolderPlus },
            { id: 'pins', label: 'ভিআইপি পিন কোড', icon: KeyRound },
            { id: 'payment', label: 'বিকাশ/নগদ/বাইনান্স', icon: CreditCard },
            { id: 'ads', label: 'অ্যাড স্টেরা বিজ্ঞাপন', icon: Tv },
            { id: 'design', label: 'আরজিবি ও নাম পরিবর্তন', icon: Palette },
            { id: 'backup', label: 'ব্যাকআপ ও রিস্টোর', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  active
                    ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: VIDEOS MANAGEMENT */}
        {activeTab === 'videos' && (
          <div className="flex flex-col gap-4">
            {/* Add / Edit Video Form with RGB lighting */}
            <RgbBox borderWidth={2} rounded="rounded-2xl">
              <div className="p-4 sm:p-5 bg-slate-900 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h2 className="text-sm font-bold text-pink-400 flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    <span>{editingVideoId ? 'ভিডিও এডিট করুন' : 'নতুন ভিডিও যুক্ত করুন (16:9)'}</span>
                  </h2>
                  {editingVideoId && (
                    <button
                      onClick={resetVideoForm}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ক্যান্সেল
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveVideo} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">ভিডিওর শিরোনাম (Title) *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: অ্যাকশন থ্রিলার দ্য লাস্ট রান (HD)"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">ক্যাটাগরি নির্বাচন করুন</label>
                    <select
                      value={videoCategory}
                      onChange={(e) => setVideoCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-pink-500"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">ভিডিও দৈর্ঘ্য (যেমন: 14:30)</label>
                    <input
                      type="text"
                      placeholder="12:00"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      ভিডিও স্ট্রিম লিঙ্ক / 16:9 Video URL (Direct MP4, WebM বা YouTube Embed)
                    </label>
                    <input
                      type="text"
                      placeholder="https://.../video.mp4 অথবা https://youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      16:9 থাম্বনেইল ছবি লিঙ্ক (Thumbnail URL)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://.../image.jpg"
                        value={videoThumb}
                        onChange={(e) => setVideoThumb(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-pink-500 font-mono"
                      />
                    </div>
                    {/* Quick Preset Thumbnails */}
                    <div className="mt-2 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400">
                      <span className="shrink-0">রেডিমেড থাম্বস:</span>
                      <button
                        type="button"
                        onClick={() => setVideoThumb('/src/assets/images/thumb_action_movie_1792919311965.jpg')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0"
                      >
                        অ্যাকশন
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoThumb('/src/assets/images/thumb_vip_exclusive_1792919310204.jpg')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0"
                      >
                        ভিআইপি
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoThumb('/src/assets/images/thumb_trending_viral_1792919312242.jpg')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0"
                      >
                        ট্রেন্ডিং
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoThumb('/src/assets/images/thumb_short_drama_1792919312897.jpg')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0"
                      >
                        ড্রামা
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">বর্ণনা (ঐচ্ছিক)</label>
                    <textarea
                      rows={2}
                      placeholder="ভিডিও সম্পর্কে ছোট বিবরণ লিখুন"
                      value={videoDesc}
                      onChange={(e) => setVideoDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  {/* Premium Switch */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <input
                      type="checkbox"
                      id="premium-toggle"
                      checked={videoIsPremium}
                      onChange={(e) => setVideoIsPremium(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700 cursor-pointer"
                    />
                    <label htmlFor="premium-toggle" className="text-xs font-bold text-amber-400 cursor-pointer flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 fill-amber-400" />
                      <span>প্রিমিয়াম ভিআইপি ভিডিও (দেখতে পিন কোড লাগবে)</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-300">ভিউ সংখ্যা:</label>
                    <input
                      type="number"
                      value={videoViews}
                      onChange={(e) => setVideoViews(Number(e.target.value))}
                      className="w-24 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono"
                    />
                  </div>

                  <div className="md:col-span-2 mt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingVideoId ? 'পরিবর্তন সংরক্ষণ করুন' : 'ভিডিও সেভ করুন'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </RgbBox>

            {/* Existing Videos List */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">বর্তমান ভিডিও তালিকা ({videos.length}টি):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videos.map(v => (
                <RgbBox key={v.id} borderWidth={2} rounded="rounded-xl">
                  <div className="p-3 bg-slate-900 flex gap-3 items-center">
                    <div className="relative w-24 aspect-video bg-black rounded-lg overflow-hidden shrink-0">
                      <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                      {v.isPremium && (
                        <div className="absolute top-1 left-1 p-0.5 rounded bg-amber-500 text-slate-950">
                          <Crown className="w-2.5 h-2.5 fill-slate-950" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-xs font-bold text-slate-100 truncate">{v.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {categories.find(c => c.id === v.category)?.name || 'ক্যাটাগরি'} · {v.duration} · {v.isPremium ? 'VIP' : 'ফ্রি'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEditVideo(v)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="এডিট"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(v.id)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-rose-100"
                        title="ডিলিট"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </RgbBox>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES CONTROL */}
        {activeTab === 'categories' && (
          <div className="flex flex-col gap-4">
            <RgbBox borderWidth={2} rounded="rounded-2xl">
              <div className="p-4 sm:p-5 bg-slate-900 flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h2 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <FolderPlus className="w-4 h-4" />
                    <span>ক্যাটাগরি কন্ট্রোল (ডিফল্ট ৪টি ক্যাটাগরি ও নতুন ক্যাটাগরি)</span>
                  </h2>
                </div>

                <form onSubmit={handleAddCategory} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ক্যাটাগরির নাম লিখুন (যেমন: 🔥 মেগা সুপারহিট)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingCategoryId ? 'আপডেট' : 'যুক্ত করুন'}</span>
                  </button>
                </form>

                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-400">সক্রিয় ক্যাটাগরি সমূহ:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categories.map((c, index) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-200">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategoryId(c.id);
                              setNewCategoryName(c.name);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(c.id)}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RgbBox>
          </div>
        )}

        {/* TAB 3: PIN MANAGEMENT */}
        {activeTab === 'pins' && (
          <div className="flex flex-col gap-4">
            <RgbBox borderWidth={2} rounded="rounded-2xl">
              <div className="p-4 sm:p-5 bg-slate-900 flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <KeyRound className="w-4 h-4" />
                    <span>নতুন ভিআইপি পিন কোড তৈরি করুন</span>
                  </h2>
                </div>

                <form onSubmit={handleCreatePin} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">পিন কোড (যেমন: 789456)</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="৬ ডিজিটের পিন"
                        value={newPinCode}
                        onChange={(e) => setNewPinCode(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={generateRandomPin}
                        className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium shrink-0"
                        title="অটো জেনারেট"
                      >
                        র‍্যান্ডম
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">কাস্টমার নোট (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      placeholder="যেমন: বিকাশ 017... পেমেন্ট"
                      value={newPinNote}
                      onChange={(e) => setNewPinNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>পিন তৈরি করুন</span>
                    </button>
                  </div>
                </form>

                {/* PINs List */}
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">সকল পিনের তালিকা ({pins.length}টি):</span>
                  </div>

                  <div className="divide-y divide-slate-800 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                    {pins.map(p => (
                      <div key={p.pin} className="p-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-extrabold text-sm text-amber-300 tracking-wider">
                            {p.pin}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.isUsed ? 'bg-slate-800 text-slate-400' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}>
                            {p.isUsed ? 'ব্যবহৃত' : 'সক্রিয় (আনলকযোগ্য)'}
                          </span>
                          {p.customerNote && (
                            <span className="text-slate-400 text-[11px] truncate hidden sm:inline">
                              ({p.customerNote})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyPin(p.pin)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1"
                          >
                            {copiedPin === p.pin ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedPin === p.pin ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePin(p.pin)}
                            className="p-1 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RgbBox>
          </div>
        )}

        {/* TAB 4: PAYMENT SETTINGS (bKash, Nagad, Rocket, Binance) */}
        {activeTab === 'payment' && (
          <div className="flex flex-col gap-4">
            <RgbBox borderWidth={2} rounded="rounded-2xl">
              <div className="p-4 sm:p-5 bg-slate-900 flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h2 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>পেমেন্ট গেটওয়ে সেটিংস (বিকাশ, নগদ, রকেট, বাইনান্স)</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* bKash */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-pink-900/40 flex flex-col gap-2">
                    <span className="text-xs font-bold text-pink-400">বিকাশ (bKash) কনফিগারেশন:</span>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">বিকাশ নাম্বার</label>
                      <input
                        type="text"
                        value={payment.bkashNumber}
                        onChange={(e) => setPayment({ ...payment, bkashNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">অ্যাকাউন্টের ধরন</label>
                      <select
                        value={payment.bkashType}
                        onChange={(e) => setPayment({ ...payment, bkashType: e.target.value as 'Personal' | 'Merchant' })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                      >
                        <option value="Personal">Personal (পার্সোনাল)</option>
                        <option value="Merchant">Merchant (মার্চেন্ট)</option>
                        <option value="Agent">Agent (এজেন্ট)</option>
                      </select>
                    </div>
                  </div>

                  {/* Nagad */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-orange-900/40 flex flex-col gap-2">
                    <span className="text-xs font-bold text-orange-400">নগদ (Nagad) কনফিগারেশন:</span>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">নগদ নাম্বার</label>
                      <input
                        type="text"
                        value={payment.nagadNumber}
                        onChange={(e) => setPayment({ ...payment, nagadNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">অ্যাকাউন্টের ধরন</label>
                      <select
                        value={payment.nagadType}
                        onChange={(e) => setPayment({ ...payment, nagadType: e.target.value as 'Personal' | 'Merchant' })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                      >
                        <option value="Personal">Personal (পার্সোনাল)</option>
                        <option value="Merchant">Merchant (মার্চেন্ট)</option>
                      </select>
                    </div>
                  </div>

                  {/* Rocket */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-900/40 flex flex-col gap-2">
                    <span className="text-xs font-bold text-purple-400">রকেট (Rocket) কনফিগারেশন:</span>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">রকেট নাম্বার</label>
                      <input
                        type="text"
                        value={payment.rocketNumber}
                        onChange={(e) => setPayment({ ...payment, rocketNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">অ্যাকাউন্টের ধরন</label>
                      <select
                        value={payment.rocketType}
                        onChange={(e) => setPayment({ ...payment, rocketType: e.target.value as 'Personal' | 'Agent' })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                      >
                        <option value="Personal">Personal (পার্সোনাল)</option>
                        <option value="Agent">Agent (এজেন্ট)</option>
                      </select>
                    </div>
                  </div>

                  {/* Binance */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-yellow-900/40 flex flex-col gap-2">
                    <span className="text-xs font-bold text-yellow-400">বাইনান্স (Binance USDT) কনফিগারেশন:</span>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">USDT ডিপোজিট অ্যাড্রেস</label>
                      <input
                        type="text"
                        value={payment.binanceAddress}
                        onChange={(e) => setPayment({ ...payment, binanceAddress: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">নেটওয়ার্ক</label>
                        <input
                          type="text"
                          value={payment.binanceNetwork}
                          onChange={(e) => setPayment({ ...payment, binanceNetwork: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">বাইনান্স পে আইডি</label>
                        <input
                          type="text"
                          value={payment.binancePayId}
                          onChange={(e) => setPayment({ ...payment, binancePayId: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Price & Telegram Contact */}
                  <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">ভিআইপি ফি (টাকায়):</label>
                      <input
                        type="number"
                        value={payment.priceBDT}
                        onChange={(e) => setPayment({ ...payment, priceBDT: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">ভিআইপি ফি (ডলারে):</label>
                      <input
                        type="number"
                        value={payment.priceUSD}
                        onChange={(e) => setPayment({ ...payment, priceUSD: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">টেলিগ্রাম অ্যাডমিন ইউজারনেম:</label>
                      <input
                        type="text"
                        value={payment.adminTelegram}
                        onChange={(e) => setPayment({ ...payment, adminTelegram: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
                      />
                    </div>
                  </div>

                  {/* Instructions text */}
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">পেমেন্ট নির্দেশিকা টেক্সট (বাংলায়):</label>
                    <textarea
                      rows={2}
                      value={payment.instructionBn}
                      onChange={(e) => setPayment({ ...payment, instructionBn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('success');
                    showToast('পেমেন্ট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>পেমেন্ট সেটিংস সংরক্ষণ করুন</span>
                </button>
              </div>
            </RgbBox>
          </div>
        )}

        {/* TAB 5: ADSTERRA ADS SETTINGS */}
        {activeTab === 'ads' && (
          <div className="flex flex-col gap-4">
            <RgbBox borderWidth={2} rounded="rounded-2xl">
              <div className="p-4 sm:p-5 bg-slate-900 flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <Tv className="w-4 h-4" />
                    <span>অ্যাড স্টেরা (Adsterra) বিজ্ঞাপন ইন্টিগ্রেশন</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="ads-toggle"
                      checked={adsterra.enabled}
                      onChange={(e) => setAdsterra({ ...adsterra, enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                    />
                    <label htmlFor="ads-toggle" className="text-xs text-slate-300 cursor-pointer">
                      বিজ্ঞাপন চালু রাখুন
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Adsterra Direct Link (স্মার্টলিঙ্ক / ডিরেক্ট লিঙ্ক URL):
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.profitablecpmrate.com/..."
                      value={adsterra.directLinkUrl}
                      onChange={(e) => setAdsterra({ ...adsterra, directLinkUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">ভিডিও ক্লিক বা ব্যানার ক্লিকে এই লিঙ্ক ওপেন হবে।</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="popunder-toggle"
                        checked={adsterra.popunderEnabled}
                        onChange={(e) => setAdsterra({ ...adsterra, popunderEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                      />
                      <label htmlFor="popunder-toggle" className="text-xs text-slate-200 cursor-pointer font-medium">
                        ক্লিকে ডিরেক্ট লিঙ্ক পপআপ চালু
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-400">কত ক্লিক পর পর:</label>
                      <select
                        value={adsterra.clickFrequency}
                        onChange={(e) => setAdsterra({ ...adsterra, clickFrequency: Number(e.target.value) })}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-100"
                      >
                        <option value={1}>প্রতি ক্লিকে</option>
                        <option value={2}>প্রতি ২য় ক্লিকে</option>
                        <option value={3}>প্রতি ৩য় ক্লিকে</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      টপ ব্যানার স্ক্রিপ্ট / HTML কোড (Top Banner Code):
                    </label>
                    <textarea
                      rows={3}
                      placeholder="<script type='text/javascript' src='//...'></script>"
                      value={adsterra.bannerTopCode}
                      onChange={(e) => setAdsterra({ ...adsterra, bannerTopCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      ভিডিও ফিড বা মিডল ব্যানার কোড (In-feed / Middle Banner Code):
                    </label>
                    <textarea
                      rows={3}
                      placeholder="<script type='text/javascript' src='//...'></script>"
                      value={adsterra.bannerMiddleCode}
                      onChange={(e) => setAdsterra({ ...adsterra, bannerMiddleCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      বটম ফ্লোটিং ব্যানার কোড (Bottom Banner Code):
                    </label>
                    <textarea
                      rows={3}
                      placeholder="<script type='text/javascript' src='//...'></script>"
                      value={adsterra.bannerBottomCode}
                      onChange={(e) => setAdsterra({ ...adsterra, bannerBottomCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('success');
                    showToast('অ্যাড স্টেরা বিজ্ঞাপন সেটিংস সেভ করা হয়েছে!');
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>অ্যাড সেটিংস সংরক্ষণ করুন</span>
                </button>
              </div>
            </RgbBox>
          </div>
        )}

        {/* TAB 6: DESIGN, RGB & APP NAME */}
        {activeTab === 'design' && (
          <div className="flex flex-col gap-4">
            <RgbBox borderWidth={2} rounded="rounded-2xl">
              <div className="p-4 sm:p-5 bg-slate-900 flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h2 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span>অ্যাপের নাম, নোটিশ এবং আরজিবি লাইটিং কন্ট্রোল (A to Z)</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">অ্যাপের নাম (Title):</label>
                    <input
                      type="text"
                      value={config.appName}
                      onChange={(e) => updateConfig({ appName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">অ্যাপের সাবটাইটেল (Subtitle):</label>
                    <input
                      type="text"
                      value={config.appSubtitle}
                      onChange={(e) => updateConfig({ appSubtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">উপরে চলমান নোটিশ / অফার টেক্সট:</label>
                    <input
                      type="text"
                      value={config.announcementText}
                      onChange={(e) => updateConfig({ announcementText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">অ্যাডমিন পাসওয়ার্ড পরিবর্তন করুন:</label>
                    <input
                      type="text"
                      value={config.adminPassword}
                      onChange={(e) => updateConfig({ adminPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">RGB লাইটিং ঘোরার স্পিড:</label>
                    <select
                      value={config.rgbSpeed}
                      onChange={(e) => updateConfig({ rgbSpeed: e.target.value as RgbSpeed })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                    >
                      <option value="fast">দ্রুত (Fast 1.8s)</option>
                      <option value="normal">সাধারণ (Normal 4.0s)</option>
                      <option value="slow">ধীর ও প্রিমিয়াম (Slow 7.0s)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-2">
                      ঘূর্ণায়মান RGB কালার থিম নির্বাচন করুন:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { id: 'rainbow', name: 'রেইনবো নিয়ন', colors: 'from-pink-500 via-green-400 to-blue-500' },
                        { id: 'cyberpunk', name: 'সাইবারপাঙ্ক', colors: 'from-cyan-400 via-purple-500 to-pink-500' },
                        { id: 'gold_ruby', name: 'গোল্ড ও রুবি VIP', colors: 'from-yellow-400 via-amber-500 to-red-600' },
                        { id: 'matrix', name: 'ম্যাট্রিক্স গ্রিন', colors: 'from-emerald-400 via-teal-500 to-cyan-400' },
                        { id: 'fire_ice', name: 'ফায়ার & আইস', colors: 'from-red-500 via-orange-400 to-blue-500' },
                      ].map(themeItem => (
                        <button
                          key={themeItem.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic('light');
                            updateConfig({ rgbTheme: themeItem.id as RgbTheme });
                          }}
                          className={`p-2.5 rounded-xl border text-left flex flex-col gap-1.5 transition-all ${
                            config.rgbTheme === themeItem.id
                              ? 'border-pink-500 bg-pink-500/10 shadow-lg'
                              : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                          }`}
                        >
                          <div className={`h-2.5 rounded-full bg-gradient-to-r ${themeItem.colors}`} />
                          <span className="text-[11px] font-bold text-slate-200 truncate">{themeItem.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">RGB গ্লো তীব্রতা (Glow Intensity):</label>
                    <select
                      value={config.rgbGlow}
                      onChange={(e) => updateConfig({ rgbGlow: e.target.value as RgbGlow })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                    >
                      <option value="soft">সফট গ্লো (Soft)</option>
                      <option value="medium">মিডিয়াম গ্লো (Medium)</option>
                      <option value="high">আল্ট্রা নিয়ন গ্লো (High Neon)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('success');
                    showToast('ডিজাইন ও আরজিবি সেটিংস সংরক্ষিত হয়েছে!');
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md mt-2"
                >
                  <Save className="w-4 h-4" />
                  <span>সবকিছু সেভ করুন</span>
                </button>
              </div>
            </RgbBox>
          </div>
        )}

        {/* TAB 7: BACKUP & RESTORE */}
        {activeTab === 'backup' && (
          <div className="flex flex-col gap-4">
            <RgbBox borderWidth={2} rounded="rounded-2xl">
              <div className="p-4 sm:p-5 bg-slate-900 flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h2 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span>ব্যাকআপ, রিস্টোর ও রিসেট (Netlify রেডি)</span>
                  </h2>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  আপনার তৈরি করা সমস্ত ভিডিও, পিন নম্বর, ক্যাটাগরি, পেমেন্ট অ্যাকাউন্ট এবং বিজ্ঞাপন সেটিংস একটি JSON ফাইলে
                  ডাউনলোড করে রাখতে পারেন এবং পরবর্তীতে এক ক্লিকে রিস্টোর করতে পারেন।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-left flex flex-col gap-1 transition-all group"
                  >
                    <span className="text-xs font-bold text-sky-400 group-hover:underline flex items-center gap-1.5">
                      <Save className="w-4 h-4" />
                      <span>সম্পূর্ণ ডাটা ব্যাকআপ ডাউনলোড (JSON)</span>
                    </span>
                    <span className="text-[11px] text-slate-400">সকল ভিডিও ও পিন কম্পিউটার/ফোনে সেভ রাখুন</span>
                  </button>

                  <label className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left flex flex-col gap-1 transition-all cursor-pointer group">
                    <span className="text-xs font-bold text-emerald-400 group-hover:underline flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4" />
                      <span>ব্যাকআপ ফাইল রিস্টোর করুন</span>
                    </span>
                    <span className="text-[11px] text-slate-400">পূর্বে সেভ করা JSON ফাইল আপলোড করুন</span>
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                  <div className="text-xs text-rose-400">
                    ফ্যাক্টরি ডিফল্টে রিসেট করতে চাইলে:
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('সতর্কতা: সমস্ত কাস্টম ভিডিও ও পিন মুছে ডিফল্ট ডাটা ফিরে আসবে। নিশ্চিত?')) {
                        Storage.resetDefaults();
                        refreshAll();
                        showToast('ফ্যাক্টরি ডিফল্টে রিসেট সম্পন্ন হয়েছে!');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold transition-colors"
                  >
                    ডিফল্ট রিসেট
                  </button>
                </div>
              </div>
            </RgbBox>
          </div>
        )}
      </div>
    </div>
  );
};
