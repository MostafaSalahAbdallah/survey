'use client';

import React from 'react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';
import { Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PageTimerBannerProps {
  timeLeft: number;
  totalDuration: number;
  isTimerActive: boolean;
  isTimerComplete: boolean;
  language: Language;
}

export const PageTimerBanner: React.FC<PageTimerBannerProps> = ({
  timeLeft,
  totalDuration,
  isTimerActive,
  isTimerComplete,
  language,
}) => {
  if (totalDuration === 0) return null;

  const isRTL = language === 'ar';
  const progressPercent = Math.min(
    100,
    Math.round(((totalDuration - timeLeft) / totalDuration) * 100)
  );

  return (
    <div
      className={`w-full rounded-2xl border transition-all duration-300 p-4 sm:p-4.5 ${
        isTimerActive
          ? 'bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-amber-50/90 border-amber-300/80 shadow-xs'
          : 'bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-emerald-50/90 border-emerald-300/80 shadow-xs'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Icon and Status Text */}
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
              isTimerActive
                ? 'bg-white border-amber-300 text-amber-700 shadow-xs'
                : 'bg-white border-emerald-300 text-emerald-700 shadow-xs'
            }`}
          >
            {isTimerActive ? (
              <Clock className="w-5 h-5 animate-pulse text-amber-600" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm sm:text-base font-extrabold ${
                  isTimerActive ? 'text-amber-950' : 'text-emerald-950'
                }`}
              >
                {isTimerActive
                  ? getTranslation('timerActive', language, { seconds: timeLeft })
                  : getTranslation('timerComplete', language)}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {isTimerActive
                ? getTranslation('timerHint', language)
                : getTranslation('completeRequiredMessage', language)}
            </p>
          </div>
        </div>

        {/* Right: Big Seconds Counter / Status Badge */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-amber-200/50">
          {isTimerActive ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 shadow-xs">
              <span className="text-xs text-amber-800 font-semibold">
                {isRTL ? 'متبقي' : 'Remaining'}
              </span>
              <span className="font-mono text-base font-black text-amber-900 min-w-[28px] text-center">
                {timeLeft}s
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100/90 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{isRTL ? 'جاهز للمتابعة' : 'Unlocked'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Track */}
      {isTimerActive && (
        <div
          className={`mt-3 h-2 w-full bg-amber-200/60 rounded-full overflow-hidden flex ${
            isRTL ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000 ease-linear shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};
