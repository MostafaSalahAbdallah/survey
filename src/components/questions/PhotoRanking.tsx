'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PhotoRankingQuestion, PhotoConfig, Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';
import { ZoomModal } from '@/components/common/ZoomModal';
import { Maximize2, RotateCcw } from 'lucide-react';

interface PhotoRankingProps {
  question: PhotoRankingQuestion;
  value: string[] | undefined; // ordered array of photo IDs: index 0 is rank 1, etc.
  onChange: (value: string[] | null) => void;
  language: Language;
  showMaximizeHelp?: boolean;
}

export const PhotoRanking: React.FC<PhotoRankingProps> = ({
  question,
  value,
  onChange,
  language,
  showMaximizeHelp = false,
}) => {
  const [zoomPhoto, setZoomPhoto] = useState<PhotoConfig | null>(null);

  // Reconstruct ordered array of ranked photo IDs from value
  const rankedIds: string[] = Array.isArray(value) ? value : [];

  // Randomized display photos with session persistence
  const [displayPhotos, setDisplayPhotos] = useState<PhotoConfig[]>(question.photos);

  useEffect(() => {
    // If shuffle is disabled in config, keep original order
    if (question.shuffle === false) {
      setDisplayPhotos(question.photos);
      return;
    }

    try {
      const storageKey = `frontal_smile_shuffle_${question.id}`;
      const saved = typeof window !== 'undefined' ? window.sessionStorage.getItem(storageKey) : null;
      if (saved) {
        const savedIds: string[] = JSON.parse(saved);
        if (Array.isArray(savedIds) && savedIds.length === question.photos.length) {
          const photoMap = new Map(question.photos.map((p) => [p.id, p]));
          if (savedIds.every((id) => photoMap.has(id))) {
            setDisplayPhotos(savedIds.map((id) => photoMap.get(id)!));
            return;
          }
        }
      }

      // If no saved order or mismatch, perform Fisher-Yates shuffle
      const shuffled = [...question.photos];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          storageKey,
          JSON.stringify(shuffled.map((p) => p.id))
        );
      }
      setDisplayPhotos(shuffled);
    } catch {
      setDisplayPhotos(question.photos);
    }
  }, [question.id, question.photos, question.shuffle]);

  const handlePhotoClick = (photoId: string) => {
    const existingIndex = rankedIds.indexOf(photoId);

    let nextRankedIds: string[];
    if (existingIndex >= 0) {
      // Photo is already ranked -> remove it and auto-renumber
      nextRankedIds = rankedIds.filter((id) => id !== photoId);
    } else {
      // Photo is not ranked -> append to ranked list
      if (rankedIds.length >= displayPhotos.length) {
        return; // Already ranked all 4
      }
      nextRankedIds = [...rankedIds, photoId];
    }

    if (nextRankedIds.length === 0) {
      onChange(null);
    } else {
      onChange(nextRankedIds);
    }
  };

  const handleReset = () => {
    onChange(null);
  };

  const rankedCount = rankedIds.length;
  const isComplete = rankedCount === displayPhotos.length;

  const rankedOfCountText = getTranslation('rankedOfCount', language, {
    count: rankedCount,
    total: displayPhotos.length,
  });
  const zoomText = getTranslation('zoom', language);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Live status bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-3 px-1 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full border border-slate-300 bg-white text-slate-900 font-bold shadow-xs transition-colors">
            {rankedOfCountText}
          </span>
          {isComplete && (
            <span className="text-slate-900 hidden sm:inline text-xs font-bold">
              ✓ {language === 'ar' ? 'اكتمل الترتيب' : 'All 4 ranked'}
            </span>
          )}
        </div>

        {rankedCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-slate-700 hover:text-black transition-colors cursor-pointer text-xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5 text-black" />
            <span>{language === 'ar' ? 'إعادة تعيين' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* Photo Grid: Strict 2x2 grid on both mobile and desktop with minimal gaps and maximized photos */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-1 sm:gap-4">
        {displayPhotos.map((photo, index) => {
          const rankIndex = rankedIds.indexOf(photo.id);
          const isRanked = rankIndex >= 0;
          const rankNumber = isRanked ? rankIndex + 1 : null; // 1 to 4

          const ariaLabel = isRanked
            ? `Photo ${index + 1}, ranked ${rankNumber}`
            : `Photo ${index + 1}, click to rank`;

          const photoSrc = photo.src.includes('?')
            ? `${photo.src}&v=crop2`
            : `${photo.src}?v=crop2`;

          return (
            <div
              key={photo.id}
              className={`group relative rounded-lg sm:rounded-2xl overflow-hidden border sm:border-2 transition-all duration-200 bg-[#fff8f5] flex flex-col items-center justify-center aspect-square sm:aspect-16/11 ${
                isRanked
                  ? 'border-slate-900 bg-slate-50/50 shadow-md ring-1 sm:ring-2 ring-slate-900/20'
                  : 'border-slate-300 hover:border-slate-500 hover:shadow-xs'
              }`}
            >
              {/* Main Photo Click Target - ultra compact margins on mobile */}
              <button
                type="button"
                onClick={() => handlePhotoClick(photo.id)}
                aria-label={ariaLabel}
                className="w-full h-full relative cursor-pointer focus:outline-hidden p-0 sm:p-1.5"
              >
                <Image
                  src={photoSrc}
                  alt={`Ranking photo ${photo.id}`}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 50vw, 400px"
                  className="object-contain p-0.5 sm:p-1.5"
                  priority
                />
              </button>

              {/* Rank Badge: ALWAYS Western digits and high contrast */}
              {isRanked ? (
                <div
                  dir="ltr"
                  className="absolute top-1 left-1 sm:top-2.5 sm:left-2.5 z-10 w-6 h-6 sm:w-11 sm:h-11 rounded-md sm:rounded-xl bg-slate-900 text-white font-extrabold font-mono text-xs sm:text-lg flex items-center justify-center shadow-md sm:shadow-lg shadow-black/30 ring-1 sm:ring-2 ring-white pointer-events-none animate-in zoom-in-75 duration-150"
                >
                  {rankNumber}
                </div>
              ) : (
                <div
                  dir="ltr"
                  className="absolute top-1 left-1 sm:top-2.5 sm:left-2.5 z-10 w-5 h-5 sm:w-8 sm:h-8 rounded-md sm:rounded-xl bg-white/90 border border-slate-300 text-slate-500 text-[10px] sm:text-xs font-semibold flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  +
                </div>
              )}

              {/* Zoom Button: Pulsing illustration pill on first photo if showMaximizeHelp is active */}
              {showMaximizeHelp && index === 0 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomPhoto(photo);
                  }}
                  aria-label={zoomText}
                  title={zoomText}
                  className="absolute top-1 right-1 sm:top-2.5 sm:right-2.5 z-10 inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-xl bg-white/95 hover:bg-white text-black shadow-md backdrop-blur-xs transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-slate-300 animate-pulse text-[10px] sm:text-xs font-bold"
                >
                  <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black shrink-0" />
                  <span>{getTranslation('enlargeShort', language)}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomPhoto(photo);
                  }}
                  aria-label={zoomText}
                  title={zoomText}
                  className="absolute top-1 right-1 sm:top-2.5 sm:right-2.5 z-10 p-1 sm:p-2 rounded-md sm:rounded-xl bg-white/95 hover:bg-white text-black shadow-md backdrop-blur-xs transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-slate-300"
                >
                  <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox for zooming */}
      <ZoomModal
        isOpen={Boolean(zoomPhoto)}
        onClose={() => setZoomPhoto(null)}
        photoSrc={
          zoomPhoto
            ? zoomPhoto.src.includes('?')
              ? `${zoomPhoto.src}&v=crop2`
              : `${zoomPhoto.src}?v=crop2`
            : null
        }
        photoAlt={zoomPhoto ? `Smile ${zoomPhoto.id}` : ''}
        language={language}
      />
    </div>
  );
};
