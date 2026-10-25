import React from 'react';
import { VideoItem } from '../types/app';
import { RgbBox } from './RgbBox';
import { Play, Lock, Eye, Clock, Crown, Sparkles } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';

interface VideoCardProps {
  video: VideoItem;
  categoryName?: string;
  onPlay: (video: VideoItem) => void;
  onUnlockRequest: (video: VideoItem) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  categoryName,
  onPlay,
  onUnlockRequest,
}) => {
  const { unlockedVideos, hasVipPass, triggerHaptic, handleAdClick } = useThemeContext();

  const isUnlocked = !video.isPremium || hasVipPass || unlockedVideos.includes(video.id);

  const handleClick = () => {
    triggerHaptic('medium');
    handleAdClick();
    if (isUnlocked) {
      onPlay(video);
    } else {
      onUnlockRequest(video);
    }
  };

  return (
    <RgbBox
      hoverScale={true}
      borderWidth={2}
      rounded="rounded-2xl"
      className="w-full transition-all duration-300"
      highlight={video.isPremium && !isUnlocked}
    >
      <div className="flex flex-col overflow-hidden bg-slate-900/95 text-left group">
        {/* Strictly 16:9 Aspect Ratio Thumbnail Box */}
        <div
          onClick={handleClick}
          className="relative w-full aspect-video bg-slate-950 overflow-hidden cursor-pointer select-none"
        >
          {/* 16:9 Thumbnail image with resilient fallback */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Resilient SVG styled fallback
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22640%22%20height%3D%22360%22%20viewBox%3D%220%200%20640%20360%22%3E%3Crect%20fill%3D%22%230f172a%22%20width%3D%22640%22%20height%3D%22360%22%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20text-anchor%3D%22middle%22%20x%3D%22320%22%20y%3D%22180%22%3E16%3A9%20HD%20Video%3C%2Ftext%3E%3C%2Fsvg%3E';
            }}
          />

          {/* Gradient Dark Scrim for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            {video.isPremium ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 font-bold text-xs shadow-lg backdrop-blur-sm">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>ভিআইপি কন্টেন্ট</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/80 text-white font-medium text-[11px] backdrop-blur-sm">
                <span>ফ্রি দেখুন</span>
              </div>
            )}

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 text-slate-200 text-xs font-mono tabular-nums backdrop-blur-sm border border-white/10">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{video.duration}</span>
            </div>
          </div>

          {/* Center Play or Lock Trigger */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isUnlocked ? (
              <div className="w-12 h-12 rounded-full bg-pink-600/90 hover:bg-pink-500 text-white flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 border-2 border-white/20">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950/85 border border-amber-500/40 text-amber-400 backdrop-blur-md shadow-2xl group-hover:border-amber-400 transition-all">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-xs font-bold tracking-wide text-amber-300 flex items-center gap-1">
                  <span>পিন দিয়ে আনলক করুন</span>
                  <Sparkles className="w-3 h-3" />
                </span>
              </div>
            )}
          </div>

          {/* Bottom Metas (Views & Category) */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs text-slate-300 pointer-events-none">
            {categoryName && (
              <span className="text-slate-300 font-medium text-[11px] bg-slate-900/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                {categoryName}
              </span>
            )}
            <div className="flex items-center gap-1 text-[11px] text-slate-300 bg-black/60 px-2 py-0.5 rounded border border-white/10 ml-auto tabular-nums">
              <Eye className="w-3 h-3 text-slate-400" />
              <span>{video.views.toLocaleString('bn-BD')} বার দেখা হয়েছে</span>
            </div>
          </div>
        </div>

        {/* Video Info Section */}
        <div className="p-3.5 flex flex-col gap-1.5">
          <h3
            onClick={handleClick}
            className="text-sm font-bold text-slate-100 line-clamp-2 hover:text-pink-400 transition-colors cursor-pointer"
          >
            {video.title}
          </h3>

          {video.description && (
            <p className="text-xs text-slate-400 line-clamp-1">
              {video.description}
            </p>
          )}

          {/* Action Button Row */}
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
            {isUnlocked ? (
              <button
                onClick={handleClick}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>ভিডিওটি প্লে করুন (16:9 HD)</span>
              </button>
            ) : (
              <button
                onClick={handleClick}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>ভিআইপি পিন কোড দিন (আনলক)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </RgbBox>
  );
};
