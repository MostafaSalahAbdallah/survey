'use client';

import React from 'react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';
import { CheckCircle2, Award, FileCheck } from 'lucide-react';

interface ThankYouProps {
  language: Language;
  submissionId: string;
}

export const ThankYou: React.FC<ThankYouProps> = ({
  language,
  submissionId,
}) => {
  const thanksTitle = getTranslation('thanksTitle', language);
  const thanksBody = getTranslation('thanksBody', language);
  const submissionIdLabel = getTranslation('submissionId', language);

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-500 text-center">
      <div className="bg-[#fff8f5] rounded-3xl p-8 sm:p-12 border border-[#f4d0c1] shadow-xl flex flex-col items-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center text-black mb-6 shadow-xs">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5] text-black" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-900 text-xs font-semibold tracking-wide uppercase mb-3 border border-slate-300 shadow-xs">
          <Award className="w-3.5 h-3.5 text-black" />
          {language === 'ar' ? 'دراسة تقييم الابتسامة — د. محمود نحمده' : 'Dr. Mahmoud Nehmedo Frontal Smile Study'}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
          {thanksTitle}
        </h2>

        <p className="text-base text-slate-600 max-w-lg mx-auto leading-relaxed mb-8">
          {thanksBody}
        </p>

        {/* Verification Card */}
        <div className="w-full bg-white/90 rounded-2xl p-4 border border-[#f4d0c1] text-left sm:text-center flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-slate-700 text-xs font-medium">
            <FileCheck className="w-4 h-4 text-black" />
            <span>{submissionIdLabel}:</span>
          </div>
          <code className="px-3 py-1 bg-white rounded-lg border border-slate-300 font-mono text-xs font-bold text-slate-900 tracking-wider">
            {submissionId}
          </code>
        </div>

        <div className="mt-8 pt-6 border-t border-[#f4d0c1]/60 text-xs text-slate-500">
          You may now safely close this window. Thank you for advancing orthodontic science.
        </div>
      </div>
    </div>
  );
};
