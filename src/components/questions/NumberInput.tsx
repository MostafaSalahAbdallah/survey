'use client';

import React from 'react';
import { NumberQuestion, Language } from '@/lib/types';
import { Minus, Plus } from 'lucide-react';

interface NumberInputProps {
  question: NumberQuestion;
  value: number | string | undefined;
  onChange: (value: number | '') => void;
  language: Language;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  question,
  value,
  onChange,
  language,
}) => {
  const min = question.min !== undefined ? question.min : 0;
  const max = question.max !== undefined ? question.max : 100;
  const placeholder = question.placeholder?.[language] || question.placeholder?.en || '';

  const numValue = value === '' || value === undefined ? '' : Number(value);

  const handleIncrement = () => {
    const current = typeof numValue === 'number' && !isNaN(numValue) ? numValue : min;
    if (current < max) {
      onChange(current + 1);
    }
  };

  const handleDecrement = () => {
    const current = typeof numValue === 'number' && !isNaN(numValue) ? numValue : min;
    if (current > min) {
      onChange(current - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange('');
      return;
    }
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      if (parsed < min) onChange(min);
      else if (parsed > max) onChange(max);
      else onChange(parsed);
    }
  };

  return (
    <div className="flex items-center gap-3 max-w-xs">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={typeof numValue === 'number' && numValue <= min}
        aria-label="Decrease"
        className="w-12 h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-black transition-colors shadow-xs active:scale-95 cursor-pointer"
      >
        <Minus className="w-5 h-5 text-black" />
      </button>

      <input
        type="number"
        id={`input-${question.id}`}
        min={min}
        max={max}
        value={numValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-24 h-12 text-center text-lg font-bold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:border-black focus:ring-3 focus:ring-slate-200 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={typeof numValue === 'number' && numValue >= max}
        aria-label="Increase"
        className="w-12 h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-black transition-colors shadow-xs active:scale-95 cursor-pointer"
      >
        <Plus className="w-5 h-5 text-black" />
      </button>

      <span className="text-xs text-slate-500 font-medium">
        ({min} - {max})
      </span>
    </div>
  );
};
