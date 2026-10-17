'use client';

import React from 'react';
import { Language, SurveyMeta } from '@/lib/types';
import { ShieldCheck } from 'lucide-react';
import { DentalIcon } from '@/components/common/DentalIcon';

interface HeaderProps {
  meta: SurveyMeta;
  language: Language;
}

export const Header: React.FC<HeaderProps> = ({ meta, language }) => {
  const title = meta.title[language] || meta.title.en;
  const subtitle = meta.subtitle?.[language] || meta.subtitle?.en;

  return (
    <header className="w-full bg-[#ffe5d9]/95 border-b border-[#f4d0c1] sticky top-0 z-30 shadow-xs backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-black shadow-xs shrink-0">
            <DentalIcon className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-600 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-900 text-xs font-semibold border border-slate-300 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            <span className="uppercase text-[11px] font-mono tracking-wider">
              {language === 'ar' ? 'عربي' : 'EN'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
