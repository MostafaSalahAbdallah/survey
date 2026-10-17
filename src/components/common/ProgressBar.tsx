'use client';

import React from 'react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface ProgressBarProps {
  currentPageIndex: number;
  totalPages: number;
  language: Language;
  hidden?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentPageIndex,
  totalPages,
  language,
  hidden = false,
}) => {
  if (hidden) return null;

  const currentPage = currentPageIndex + 1;
  const progressPercent = Math.min(
    100,
    Math.round((currentPage / totalPages) * 100)
  );

  const pageOfText = getTranslation('pageOf', language, {
    current: currentPage,
    total: totalPages,
  });

  const isRTL = language === 'ar';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffe5d9]/95 backdrop-blur-md border-t border-[#f4d0c1] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] transition-all duration-300"
      role="progressbar"
      aria-valuenow={progressPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Survey Progress"
    >
      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
          <span className="tracking-wide">{pageOfText}</span>
          <span className="font-mono text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-slate-300 shadow-xs">
            {progressPercent}%
          </span>
        </div>

        {/* Progress track */}
        <div
          className={`h-2.5 w-full bg-[#f4d0c1]/70 rounded-full overflow-hidden flex ${
            isRTL ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className="h-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-500 rounded-full transition-all duration-500 ease-out shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
