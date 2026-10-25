import React, { useRef, useEffect } from 'react';
import { VideoItem } from '../types/app';
import { RgbBox } from './RgbBox';
import { X, Eye, Clock, Share2, Sparkles, Volume2, Maximize2 } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';
import { AdBanner } from './AdBanner';

interface VideoPlayerModalProps {
  video: VideoItem;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const { triggerHaptic, handleAdClick, videos, setVideos } = useThemeContext();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Increment views count on play
  useEffect(() => {
    const updated = videos.map(v => {
      if (v.id === video.id) {
        return { ...v, views: v.views + 1 };
      }
      return v;
    });
    setVideos(updated);
  }, [video.id]);

  const isEmbed = video.videoUrl.includes('youtube.com') ||
    video.videoUrl.includes('youtu.be') ||
    video.videoUrl.includes('player.vimeo.com') ||
    video.videoUrl.includes('dailymotion.com') ||
    video.videoUrl.includes('embed');

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const vidId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${vidId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const vidId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${vidId}?autoplay=1`;
    }
    return url;
  };

  const handleShare = () => {
    triggerHaptic('light');
    const text = `🎬 ${video.title}\nআমাদের টেলিগ্রাম মিনি অ্যাপে এখনি দেখুন!`;
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(tgUrl, '_blank');
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto no-scrollbar">
        <RgbBox borderWidth={3} rounded="rounded-2xl" highlight={true}>
          <div className="bg-slate-950 p-3 sm:p-4 rounded-[calc(1rem-3px)] text-left flex flex-col gap-3">
            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 pr-2 overflow-hidden">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-slate-100 truncate">
                  {video.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Strict 16:9 Video Box with Rotating RGB Inner Accent */}
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800">
              {isEmbed ? (
                <iframe
                  src={getEmbedUrl(video.videoUrl)}
                  title={video.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  poster={video.thumbnailUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              )}
            </div>

            {/* Video Meta & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-300">
                  <Eye className="w-3.5 h-3.5 text-pink-400" />
                  <span className="tabular-nums font-semibold">{(video.views + 1).toLocaleString('bn-BD')}</span> ভিউজ
                </span>
                <span className="flex items-center gap-1 text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{video.duration}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-pink-950/60 text-pink-300 border border-pink-800/40 font-semibold text-[10px]">
                  16:9 HD
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isEmbed && (
                  <button
                    onClick={handleFullscreen}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>ফুলস্ক্রিন</span>
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>টেলিগ্রামে শেয়ার</span>
                </button>
              </div>
            </div>

            {/* Video Description */}
            {video.description && (
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {video.description}
              </div>
            )}

            {/* In-Modal Adsterra Ad Banner */}
            <AdBanner type="middle" />
          </div>
        </RgbBox>
      </div>
    </div>
  );
};
