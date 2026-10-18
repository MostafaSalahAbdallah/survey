'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
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
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isGrabbing, setIsGrabbing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Mutable refs to track state without closure staleness
  const scaleRef = useRef(1);
  const positionRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const startDragPos = useRef({ x: 0, y: 0, startPosX: 0, startPosY: 0 });
  const activePointers = useRef<Map<number, { clientX: number; clientY: number }>>(new Map());
  const pinchStartDist = useRef(0);
  const pinchStartScale = useRef(1);
  const lastTapTime = useRef(0);

  // Sync scaleRef and positionRef with state
  useEffect(() => {
    scaleRef.current = scale;
    positionRef.current = position;
  }, [scale, position]);

  // Apply transform directly to DOM for instant 60fps pan/zoom response
  const applyTransform = useCallback((x: number, y: number, s: number, animated = false) => {
    if (innerRef.current) {
      innerRef.current.style.transition = animated ? 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)' : 'none';
      innerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
    }
  }, []);

  // Clamp pan position so user cannot lose the photo off screen, but allow generous roaming
  const clampAndSet = useCallback((targetX: number, targetY: number, targetScale: number, animated = false) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Generous pan boundaries: at scale 1, locked to center; at scale > 1, allow full roaming
    const maxPanX = Math.max(0, (rect.width * (targetScale - 0.75)) / 2 + 60);
    const maxPanY = Math.max(0, (rect.height * (targetScale - 0.75)) / 2 + 60);

    const clampedX = Math.min(maxPanX, Math.max(-maxPanX, targetX));
    const clampedY = Math.min(maxPanY, Math.max(-maxPanY, targetY));

    positionRef.current = { x: clampedX, y: clampedY };
    setPosition({ x: clampedX, y: clampedY });
    applyTransform(clampedX, clampedY, targetScale, animated);
  }, [applyTransform]);

  // Reset zoom & pan to default 1x
  const resetZoom = useCallback(() => {
    scaleRef.current = 1;
    positionRef.current = { x: 0, y: 0 };
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsGrabbing(false);
    isDraggingRef.current = false;
    applyTransform(0, 0, 1, true);
  }, [applyTransform]);

  // Reset when opening or changing photo
  useEffect(() => {
    if (isOpen) {
      resetZoom();
    }
  }, [isOpen, photoSrc, resetZoom]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // -------------------------------------------------------------
  // Pointer Events: Handles BOTH Mouse Dragging (Hand cursor) & Touch
  // -------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();

    // Set pointer capture so dragging works even if cursor moves fast or leaves container
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}

    activePointers.current.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });

    // Double-tap / double-click detector to toggle 2.5x zoom
    const now = Date.now();
    if (activePointers.current.size === 1 && now - lastTapTime.current < 300) {
      lastTapTime.current = 0;
      if (scaleRef.current > 1.2) {
        resetZoom();
      } else {
        const nextScale = 2.5;
        scaleRef.current = nextScale;
        setScale(nextScale);
        clampAndSet(0, 0, nextScale, true);
      }
      return;
    }
    lastTapTime.current = now;

    // Single pointer: Start Hand Drag (pan up, down, left, right)
    if (activePointers.current.size === 1) {
      isDraggingRef.current = true;
      setIsGrabbing(true);
      startDragPos.current = {
        x: e.clientX,
        y: e.clientY,
        startPosX: positionRef.current.x,
        startPosY: positionRef.current.y,
      };
    } else if (activePointers.current.size === 2) {
      // Two pointers: Start pinch-to-zoom
      isDraggingRef.current = false;
      setIsGrabbing(false);
      const pts = Array.from(activePointers.current.values());
      pinchStartDist.current = Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
      pinchStartScale.current = scaleRef.current;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activePointers.current.has(e.pointerId)) return;
    activePointers.current.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });

    // Two-finger pinch to zoom
    if (activePointers.current.size === 2) {
      const pts = Array.from(activePointers.current.values());
      const currentDist = Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
      if (pinchStartDist.current > 0) {
        const ratio = currentDist / pinchStartDist.current;
        const nextScale = Math.min(5, Math.max(1, pinchStartScale.current * ratio));
        scaleRef.current = nextScale;
        setScale(nextScale);
        clampAndSet(positionRef.current.x, positionRef.current.y, nextScale, false);
      }
      return;
    }

    // One finger or Mouse Drag: Move the photo up, down, left, right!
    if (activePointers.current.size === 1 && isDraggingRef.current) {
      const dx = e.clientX - startDragPos.current.x;
      const dy = e.clientY - startDragPos.current.y;
      const targetX = startDragPos.current.startPosX + dx;
      const targetY = startDragPos.current.startPosY + dy;
      clampAndSet(targetX, targetY, scaleRef.current, false);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointers.current.delete(e.pointerId);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (activePointers.current.size === 0) {
      isDraggingRef.current = false;
      setIsGrabbing(false);
      // If scale is near 1, smoothly snap back to 1x center
      if (scaleRef.current <= 1.05) {
        resetZoom();
      }
    } else if (activePointers.current.size === 1) {
      // One pointer remaining after a pinch: seamlessly resume panning
      const remaining = Array.from(activePointers.current.values())[0];
      isDraggingRef.current = true;
      setIsGrabbing(true);
      startDragPos.current = {
        x: remaining.clientX,
        y: remaining.clientY,
        startPosX: positionRef.current.x,
        startPosY: positionRef.current.y,
      };
    }
  };

  // -------------------------------------------------------------
  // Desktop Wheel Zoom
  // -------------------------------------------------------------
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 0.35 : -0.35;
    const nextScale = Math.min(5, Math.max(1, scaleRef.current + delta));
    scaleRef.current = nextScale;
    setScale(nextScale);

    if (nextScale <= 1.02) {
      resetZoom();
    } else {
      clampAndSet(positionRef.current.x, positionRef.current.y, nextScale, true);
    }
  };

  // Button Zoom Handlers
  const handleZoomIn = () => {
    const nextScale = Math.min(5, scaleRef.current + 0.6);
    scaleRef.current = nextScale;
    setScale(nextScale);
    clampAndSet(positionRef.current.x, positionRef.current.y, nextScale, true);
  };

  const handleZoomOut = () => {
    const nextScale = Math.max(1, scaleRef.current - 0.6);
    scaleRef.current = nextScale;
    setScale(nextScale);
    if (nextScale <= 1.02) {
      resetZoom();
    } else {
      clampAndSet(positionRef.current.x, positionRef.current.y, nextScale, true);
    }
  };

  if (!isOpen || !photoSrc) return null;

  const closeText = getTranslation('close', language);
  const isRTL = language === 'ar';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200 select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged photo view"
    >
      <div
        className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 p-3 sm:p-5 animate-in zoom-in-95 duration-200 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls Toolbar */}
        <div className="w-full flex items-center justify-between mb-2 px-1 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white/90 bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">
              {scale.toFixed(1)}x
            </span>
            {scale > 1.05 && (
              <button
                type="button"
                onClick={resetZoom}
                className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg border border-white/15 transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRTL ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Zoom In Button */}
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/15 active:scale-95"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {/* Zoom Out Button */}
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/15 active:scale-95 disabled:opacity-40"
              disabled={scale <= 1.02}
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={closeText}
              className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer border border-red-500/30 active:scale-95 ml-1"
              title={closeText}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zoomable Image Container with Active Hand Grab / Grabbing */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'none' }}
          className={`relative w-full h-[65vh] sm:h-[72vh] flex items-center justify-center overflow-hidden bg-black/40 rounded-2xl border border-white/5 select-none ${
            isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          title={isRTL ? 'اسحب باليد لتحريك الصورة' : 'Click and drag to pan photo'}
        >
          <div
            ref={innerRef}
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            }}
            className="relative w-full h-full flex items-center justify-center will-change-transform pointer-events-none select-none"
          >
            <Image
              src={photoSrc}
              alt={photoAlt}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-contain pointer-events-none select-none"
              priority
              draggable={false}
            />
          </div>
        </div>

        {/* Bottom Helper Bar */}
        <div className="w-full flex items-center justify-between pt-2.5 px-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-300">
            <Move className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {isRTL
                ? 'اسحب باليد لتحريك الصورة (أعلى/أسفل/يمين/يسار) · استخدم إصبعين للتكبير'
                : 'Drag with hand to pan (up/down/left/right) · Pinch with 2 fingers to zoom'}
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] text-slate-400">
            {closeText} (Esc)
          </span>
        </div>
      </div>
    </div>
  );
};
