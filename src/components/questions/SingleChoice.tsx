'use client';

import React from 'react';
import { SingleChoiceQuestion, Language } from '@/lib/types';
import { Check } from 'lucide-react';

interface SingleChoiceProps {
  question: SingleChoiceQuestion;
  value: string;
  onChange: (value: string) => void;
  language: Language;
}

export const SingleChoice: React.FC<SingleChoiceProps> = ({
  question,
  value,
  onChange,
  language,
}) => {
  return (
    <div
      role="radiogroup"
      aria-label={question.label?.[language] || question.id}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
    >
      {question.options.map((option) => {
        const isSelected = value === option.value;
        const labelText = option.label[language] || option.label.en;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={`group relative flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer min-h-[52px] ${
              isSelected
                ? 'border-slate-900 bg-white text-slate-950 font-bold shadow-xs ring-1 ring-slate-900/20'
                : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50 text-slate-800'
            }`}
          >
            <span className="text-sm sm:text-base leading-snug">{labelText}</span>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white group-hover:border-slate-500'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>
        );
      })}
    </div>
  );
};
