'use client';

import React from 'react';
import { Language } from '@/lib/types';
import { Languages, Sparkles } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <div className="bg-[#fff8f5] rounded-3xl shadow-2xl border border-[#f4d0c1] max-w-md w-full overflow-hidden p-6 sm:p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="mx-auto w-16 h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-black mb-5 shadow-xs">
          <Languages className="w-8 h-8 text-black" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-semibold tracking-wide uppercase mb-3 border border-slate-300 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          Frontal Smile Assessment Study
        </div>

        <h2
          id="language-modal-title"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2"
        >
          Select Language / اختر لغتك
        </h2>

        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Please select your preferred language to begin the survey.
          <br />
          <span className="font-arabic text-slate-500">
            يرجى اختيار اللغة المفضلة للبدء بالاستبيان.
          </span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onSelectLanguage('en')}
            className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-slate-200 hover:border-black bg-white hover:bg-slate-50 transition-all duration-200 shadow-xs hover:shadow-md active:scale-98 cursor-pointer"
          >
            <span className="text-xl font-bold text-slate-900 group-hover:text-black">
              English
            </span>
            <span className="text-xs text-slate-500 mt-1">Start in English</span>
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-black transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => onSelectLanguage('ar')}
            className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-slate-200 hover:border-black bg-white hover:bg-slate-50 transition-all duration-200 shadow-xs hover:shadow-md active:scale-98 cursor-pointer"
          >
            <span className="text-2xl font-bold text-slate-900 group-hover:text-black font-arabic">
              عربي
            </span>
            <span className="text-xs text-slate-500 mt-1 font-arabic">
              ابدأ باللغة العربية
            </span>
            <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-black transition-colors" />
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-[#f4d0c1]/60 text-xs text-slate-500">
          All responses are strictly confidential and used for scientific research.
        </div>
      </div>
    </div>
  );
};
