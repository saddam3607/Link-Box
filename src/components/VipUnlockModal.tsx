import React, { useState } from 'react';
import { VideoItem } from '../types/app';
import { RgbBox } from './RgbBox';
import { useThemeContext } from '../context/ThemeContext';
import confetti from 'canvas-confetti';
import {
  X,
  Lock,
  KeyRound,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Sparkles,
  Crown,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface VipUnlockModalProps {
  targetVideo?: VideoItem | null;
  onClose: () => void;
  onUnlocked: () => void;
}

export const VipUnlockModal: React.FC<VipUnlockModalProps> = ({
  targetVideo,
  onClose,
  onUnlocked,
}) => {
  const { payment, verifyPin, triggerHaptic } = useThemeContext();
  const [pinInput, setPinInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'binance'>('bkash');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    triggerHaptic('light');
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');

    const result = verifyPin(pinInput, targetVideo?.id);
    if (result.success) {
      triggerHaptic('success');
      setStatusMessage({ type: 'success', text: result.message });

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }

      setTimeout(() => {
        onUnlocked();
        onClose();
      }, 1500);
    } else {
      triggerHaptic('error');
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const cleanTelegramUser = payment.adminTelegram.replace('@', '').replace('https://t.me/', '');
  const telegramMessage = encodeURIComponent(
    `হ্যালো অ্যাডমিন! আমি ${selectedMethod.toUpperCase()}-এ পেমেন্ট সম্পন্ন করেছি। আমার ${targetVideo ? `"${targetVideo.title}" ভিডিও` : 'ভিআইপি মেম্বারশিপ'}-এর আনলক পিন নাম্বারটি দিন।`
  );
  const telegramUrl = `https://t.me/${cleanTelegramUser}?text=${telegramMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto no-scrollbar">
        <RgbBox borderWidth={3} rounded="rounded-2xl" highlight={true}>
          <div className="bg-slate-950 p-4 sm:p-5 rounded-[calc(1rem-3px)] text-left flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Crown className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                    <span>ভিআইপি আনলক ও পেমেন্ট</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {targetVideo ? `"${targetVideo.title.substring(0, 32)}..." আনলক করতে পিন দিন` : 'আনলিমিটেড ভিডিও দেখার জন্য পিন ব্যবহার করুন'}
                  </p>
                </div>
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

            {/* STEP 1: If user already has PIN -> Enter PIN */}
            <RgbBox borderWidth={2} rounded="rounded-xl" className="w-full">
              <div className="p-3.5 bg-slate-900 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="pin-input" className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>আপনার কাছে কি পিন নাম্বার আছে?</span>
                  </label>
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    তাৎক্ষণিক আনলক
                  </span>
                </div>

                <form onSubmit={handlePinSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="pin-input"
                      type="text"
                      placeholder="এখানে পিন নাম্বার লিখুন (যেমন: 789456)"
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        if (statusMessage) setStatusMessage(null);
                      }}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono tracking-wider text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>আনলক</span>
                  </button>
                </form>

                {/* Status Alert */}
                {statusMessage && (
                  <div
                    className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                      statusMessage.type === 'success'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-700'
                    }`}
                  >
                    {statusMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{statusMessage.text}</span>
                  </div>
                )}
              </div>
            </RgbBox>

            {/* STEP 2: How to get PIN via Payment (bKash, Nagad, Rocket, Binance) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-pink-500" />
                  <span>পিন না থাকলে পেমেন্ট করে পিন সংগ্রহ করুন:</span>
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800">
                  ফি: ৳{payment.priceBDT} / ${payment.priceUSD}
                </span>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedMethod('bkash');
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center ${
                    selectedMethod === 'bkash'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  বিকাশ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedMethod('nagad');
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center ${
                    selectedMethod === 'nagad'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  নগদ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedMethod('rocket');
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center ${
                    selectedMethod === 'rocket'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  রকেট
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedMethod('binance');
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center ${
                    selectedMethod === 'binance'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  বাইনান্স
                </button>
              </div>

              {/* Payment Method Details Box */}
              <RgbBox borderWidth={2} rounded="rounded-xl" className="w-full">
                <div className="p-3.5 bg-slate-900 flex flex-col gap-3">
                  {selectedMethod === 'bkash' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-pink-400">বিকাশ ({payment.bkashType}) নাম্বার:</span>
                        <span className="text-[11px] text-slate-400">Send Money / ক্যাশ ইন</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-700">
                        <span className="font-mono font-bold text-sm text-slate-100 tracking-wider">
                          {payment.bkashNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(payment.bkashNumber, 'bkash')}
                          className="px-2.5 py-1 rounded-lg bg-pink-600/30 hover:bg-pink-600 text-pink-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-all"
                        >
                          {copiedField === 'bkash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'bkash' ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'nagad' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-orange-400">নগদ ({payment.nagadType}) নাম্বার:</span>
                        <span className="text-[11px] text-slate-400">Send Money</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-700">
                        <span className="font-mono font-bold text-sm text-slate-100 tracking-wider">
                          {payment.nagadNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(payment.nagadNumber, 'nagad')}
                          className="px-2.5 py-1 rounded-lg bg-orange-600/30 hover:bg-orange-600 text-orange-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-all"
                        >
                          {copiedField === 'nagad' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'nagad' ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'rocket' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-purple-400">রকেট ({payment.rocketType}) নাম্বার:</span>
                        <span className="text-[11px] text-slate-400">Send Money</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-700">
                        <span className="font-mono font-bold text-sm text-slate-100 tracking-wider">
                          {payment.rocketNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(payment.rocketNumber, 'rocket')}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-all"
                        >
                          {copiedField === 'rocket' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'rocket' ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'binance' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-yellow-400">বাইনান্স USDT ({payment.binanceNetwork}):</span>
                        <span className="text-[11px] text-slate-400">Pay ID: {payment.binancePayId}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-700">
                        <span className="font-mono font-bold text-xs text-slate-100 truncate pr-2 max-w-[220px]">
                          {payment.binanceAddress}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(payment.binanceAddress, 'binance')}
                          className="px-2.5 py-1 rounded-lg bg-yellow-500/20 hover:bg-yellow-500 text-yellow-300 hover:text-slate-950 text-xs font-medium flex items-center gap-1 transition-all shrink-0"
                        >
                          {copiedField === 'binance' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'binance' ? 'কপি হয়েছে' : 'অ্যাড্রেস কপি'}</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                        <span>বাইনান্স পে আইডি (Pay ID): <strong className="text-slate-200">{payment.binancePayId}</strong></span>
                        <button
                          type="button"
                          onClick={() => handleCopy(payment.binancePayId, 'payid')}
                          className="text-amber-400 hover:underline"
                        >
                          {copiedField === 'payid' ? 'কপি হয়েছে' : 'পে আইডি কপি'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment Instructions */}
                  <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <p className="font-medium text-slate-300 flex items-center gap-1 mb-1">
                      <HelpCircle className="w-3 h-3 text-pink-400" />
                      <span>পেমেন্ট নির্দেশিকা:</span>
                    </p>
                    {payment.instructionBn}
                  </div>
                </div>
              </RgbBox>

              {/* Direct Telegram Admin Chat Button */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic('medium')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>পিন পেতে টেলিগ্রাম অ্যাডমিনকে মেসেজ দিন (@{cleanTelegramUser})</span>
              </a>
            </div>
          </div>
        </RgbBox>
      </div>
    </div>
  );
};
