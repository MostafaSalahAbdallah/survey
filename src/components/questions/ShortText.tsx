'use client';

import React from 'react';
import { ShortTextQuestion, Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface ShortTextProps {
  question: ShortTextQuestion;
  value: string;
  onChange: (value: string) => void;
  language: Language;
}

export const ShortText: React.FC<ShortTextProps> = ({
  question,
  value = '',
  onChange,
  language,
}) => {
  const max = question.maxLength || 30;
  const placeholder = question.placeholder?.[language] || question.placeholder?.en || '';
  const currentLen = (value || '').length;

  const charsText = getTranslation('charsRemaining', language, {
    count: currentLen,
    max,
  });

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          id={`input-${question.id}`}
          minLength={question.minLength}
          maxLength={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-sm sm:text-base rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-black focus:ring-3 focus:ring-slate-200 transition-all duration-200"
          aria-required={question.required}
        />
      </div>

      <div className="mt-1.5 flex justify-end text-xs text-slate-400 font-mono">
        {charsText}
      </div>
    </div>
  );
};
