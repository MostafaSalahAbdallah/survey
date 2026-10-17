'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface ZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoSrc: string | null;
  photoAlt?: string;
  language: Language;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({
  isOpen,
  onClose,
  photoSrc,
  photoAlt = 'Smile Photo',
  language,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !photoSrc) return null;

  const closeText = getTranslation('close', language);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged photo view"
    >
      <div
        className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 p-2 sm:p-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeText}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-full h-[65vh] sm:h-[75vh] flex items-center justify-center">
          <Image
            src={photoSrc}
            alt={photoAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-contain"
            priority
          />
        </div>

        <div className="text-center py-2 text-xs text-slate-400">
          {photoAlt} • {closeText} (Esc)
        </div>
      </div>
    </div>
  );
};
