import React, { useEffect, useRef } from 'react';
import { useThemeContext } from '../context/ThemeContext';
import { RgbBox } from './RgbBox';
import { Sparkles, ExternalLink } from 'lucide-react';

interface AdBannerProps {
  type: 'top' | 'middle' | 'bottom';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, className = '' }) => {
  const { adsterra, handleAdClick } = useThemeContext();
  const containerRef = useRef<HTMLDivElement>(null);

  if (!adsterra.enabled) return null;

  const adCode =
    type === 'top'
      ? adsterra.bannerTopCode
      : type === 'middle'
      ? adsterra.bannerMiddleCode
      : adsterra.bannerBottomCode;

  useEffect(() => {
    if (!adCode || !containerRef.current) return;

    // If custom HTML / script code is provided by admin
    const container = containerRef.current;
    container.innerHTML = '';

    // Create an iframe to safely isolate and execute Adsterra script codes
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = type === 'top' ? '65px' : '90px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';

    container.appendChild(iframe);

    try {
      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; overflow: hidden; font-family: sans-serif; }
              </style>
            </head>
            <body>
              ${adCode}
            </body>
          </html>
        `);
        doc.close();
      }
    } catch (e) {
      console.warn('Adsterra render error in iframe:', e);
    }
  }, [adCode, type]);

  // If custom code is set, show the container
  if (adCode && adCode.trim().length > 0) {
    return (
      <RgbBox borderWidth={2} rounded="rounded-xl" className={`my-3 overflow-hidden ${className}`}>
        <div ref={containerRef} className="w-full flex items-center justify-center p-1 bg-slate-950 min-h-[60px]" />
      </RgbBox>
    );
  }

  // Fallback demo banner that also promotes the direct link or informs admin
  return (
    <RgbBox borderWidth={2} rounded="rounded-xl" className={`my-3 ${className}`}>
      <div
        onClick={() => {
          handleAdClick();
          if (adsterra.directLinkUrl) {
            window.open(adsterra.directLinkUrl, '_blank', 'noopener,noreferrer');
          }
        }}
        className="w-full py-2.5 px-3 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 flex items-center justify-between cursor-pointer select-none group"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
            AD
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <span>অ্যাড স্টেরা স্পনসরড ব্যানার</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-[10px] text-slate-400">
              অ্যাডমিন প্যানেল থেকে আপনার নিজস্ব Adsterra কোড বসাতে পারেন
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-pink-400 group-hover:text-pink-300 bg-pink-500/10 px-2.5 py-1 rounded-md border border-pink-500/20 shrink-0">
          <span>দেখুন</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </RgbBox>
  );
};
