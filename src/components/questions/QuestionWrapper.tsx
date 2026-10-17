'use client';

import React from 'react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';
import { AlertCircle } from 'lucide-react';

interface QuestionWrapperProps {
  id: string;
  questionNumber?: number;
  label?: string;
  instruction?: string;
  required?: boolean;
  error?: string | null;
  language: Language;
  children: React.ReactNode;
}

export const QuestionWrapper: React.FC<QuestionWrapperProps> = ({
  id,
  questionNumber,
  label,
  instruction,
  required = false,
  error,
  language,
  children,
}) => {
  const requiredMsg = error ? getTranslation(error, language) : null;
  const questionWord = getTranslation('question', language);

  return (
    <div
      id={`question-${id}`}
      className={`scroll-mt-24 rounded-2xl p-4 sm:p-6 transition-all duration-300 border bg-white/95 ${
        error
          ? 'border-red-300 bg-red-50/20 shadow-md shadow-red-500/5 ring-2 ring-red-400/20'
          : 'border-[#f4d0c1] shadow-xs hover:border-slate-400'
      }`}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1.5">
          {questionNumber !== undefined && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-slate-900 border border-slate-300 shadow-xs">
              {questionWord} {questionNumber}
            </span>
          )}
          {required && (
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              * {getTranslation('required', language)}
            </span>
          )}
        </div>

        {label && (
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {label}
          </h2>
        )}

        {instruction && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            {instruction}
          </p>
        )}
      </div>

      <div className="w-full">{children}</div>

      {error && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{requiredMsg}</span>
        </div>
      )}
    </div>
  );
};
