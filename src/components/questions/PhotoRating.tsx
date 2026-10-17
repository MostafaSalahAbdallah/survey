'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PhotoRatingQuestion, Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';
import { ZoomModal } from '@/components/common/ZoomModal';
import { Maximize2 } from 'lucide-react';

interface PhotoRatingProps {
  question: PhotoRatingQuestion;
  value: number | undefined;
  onChange: (value: number) => void;
  language: Language;
}

export const PhotoRating: React.FC<PhotoRatingProps> = ({
  question,
  value,
  onChange,
  language,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const isRTL = language === 'ar';

  // Generate scale options [10, 20, ..., 100]
  const scaleValues: number[] = [];
  for (let v = question.min; v <= question.max; v += question.step) {
    scaleValues.push(v);
  }

  const leastText = getTranslation('leastAttractive', language);
  const mostText = getTranslation('mostAttractive', language);
  const zoomText = getTranslation('zoom', language);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Photo Container */}
      <div className="relative w-full max-w-xl h-60 sm:h-72 md:h-80 bg-[#fff8f5] rounded-2xl overflow-hidden border border-[#f4d0c1] shadow-xs mb-5 group">
        <Image
          src={question.photo.src}
          alt={`Smile photo ${question.photo.id}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 600px, 800px"
          className="object-contain p-2"
          priority
        />

        {/* Magnifier zoom button */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          aria-label={zoomText}
          title={zoomText}
          className="absolute top-3 right-3 p-2 rounded-xl bg-white/95 hover:bg-white text-black shadow-md backdrop-blur-xs transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-slate-300"
        >
          <Maximize2 className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Rating Scale: RTL for Arabic (10 on right to 100 on left), LTR for English */}
      <div className="w-full max-w-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Scale Endpoint Labels */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2 px-1">
          <span className="text-slate-600 font-mono">{leastText}</span>
          <span className="text-[#F97316] font-mono font-bold">{mostText}</span>
        </div>

        {/* 10 Scale Buttons */}
        <div
          role="radiogroup"
          aria-label={`Rating scale for ${question.photo.id}`}
          className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2"
        >
          {scaleValues.map((score) => {
            const isSelected = value === score;

            return (
              <button
                key={score}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChange(score)}
                className={`relative flex items-center justify-center h-12 sm:h-14 rounded-xl font-bold font-mono text-sm sm:text-base transition-all duration-200 cursor-pointer min-w-[44px] ${
                  isSelected
                    ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/30 scale-105 ring-2 ring-[#F97316] ring-offset-2 z-10'
                    : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-[#F97316] hover:bg-orange-50/60 hover:text-[#F97316]'
                }`}
              >
                {score}
              </button>
            );
          })}
        </div>
      </div>

      {/* Zoom Lightbox */}
      <ZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        photoSrc={question.photo.src}
        photoAlt={`Smile photo ${question.photo.id}`}
        language={language}
      />
    </div>
  );
};
