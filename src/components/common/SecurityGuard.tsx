'use client';

import React, { useEffect } from 'react';

/**
 * SecurityGuard Component
 * Implements hardened, synchronous anti-screenshot, anti-recording, and anti-inspection defenses:
 * 1. Synchronously toggles the `screen-shield-active` class on <html> on window blur, visibility change, and PrintScreen.
 * 2. Catches `keyup` (which is when Chromium on Windows dispatches PrintScreen) and wipes the clipboard.
 * 3. Catches `keydown` for DevTools (F12, Ctrl+Shift+I/J/C), View-Source (Ctrl+U), Print (Ctrl+P), and Save (Ctrl+S).
 * 4. Disables right-click context menu and element dragging.
 * 5. Periodically checks for open DevTools consoles.
 */
export const SecurityGuard: React.FC = () => {
  useEffect(() => {
    let shieldTimer: ReturnType<typeof setTimeout> | null = null;

    const wipeClipboard = () => {
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(
            '⚠️ Protected Content: Screenshots and screen recordings are strictly restricted on this scientific study.'
          ).catch(() => {});
        }
      } catch {}
    };

    const activateShield = (durationMs?: number) => {
      document.documentElement.classList.add('screen-shield-active');
      if (shieldTimer) {
        clearTimeout(shieldTimer);
        shieldTimer = null;
      }
      if (durationMs) {
        shieldTimer = setTimeout(() => {
          if (document.hasFocus() && !document.hidden) {
            document.documentElement.classList.remove('screen-shield-active');
          }
        }, durationMs);
      }
    };

    const deactivateShield = () => {
      if (shieldTimer) {
        clearTimeout(shieldTimer);
        shieldTimer = null;
      }
      document.documentElement.classList.remove('screen-shield-active');
    };

    // 1. Right-Click Context Menu prevention
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Drag & Drop prevention
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 3. KeyUp: Crucial for PrintScreen in Chromium/Windows
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        activateShield(2500);
        wipeClipboard();
      }
    };

    // 4. KeyDown: Developer Tools, Print, Save, View-Source
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // PrintScreen / Snapshot
      if (key === 'PrintScreen' || key === 'Snapshot') {
        e.preventDefault();
        activateShield(2500);
        wipeClipboard();
        return false;
      }

      // Windows + Shift + S or Mac Cmd + Shift + 3/4/5
      if ((ctrlOrMeta || e.metaKey) && shift && (key === 'S' || key === 's' || key === '3' || key === '4' || key === '5')) {
        activateShield(2500);
        wipeClipboard();
      }

      // F12 -> DevTools
      if (key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Ctrl/Cmd + Shift + I/J/C -> DevTools
      if (ctrlOrMeta && shift && (key === 'I' || key === 'i' || key === 'J' || key === 'j' || key === 'C' || key === 'c')) {
        e.preventDefault();
        return false;
      }

      // Ctrl/Cmd + U -> View Source
      if (ctrlOrMeta && (key === 'u' || key === 'U')) {
        e.preventDefault();
        return false;
      }

      // Ctrl/Cmd + S -> Save Page
      if (ctrlOrMeta && (key === 's' || key === 'S')) {
        e.preventDefault();
        return false;
      }

      // Ctrl/Cmd + P -> Print / PDF Export
      if (ctrlOrMeta && (key === 'p' || key === 'P')) {
        e.preventDefault();
        activateShield(2000);
        return false;
      }
    };

    // 5. Window Blur (Fires instantly when Snipping Tool, screen grabbers, or other windows open)
    const handleBlur = () => {
      activateShield();
    };

    // 6. Window Focus (Restores view when returning to the survey)
    const handleFocus = () => {
      deactivateShield();
    };

    // 7. Visibility Change (Tab switch / minimize)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        activateShield();
      } else {
        deactivateShield();
      }
    };

    // 8. Periodic DevTools check
    const devToolsInterval = setInterval(() => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > 160 || heightDiff > 160) {
        try {
          console.clear();
        } catch {}
      }
    }, 1500);

    // Attach listeners with capture phase for maximum responsiveness
    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(devToolsInterval);
      if (shieldTimer) clearTimeout(shieldTimer);
    };
  }, []);

  return (
    <div
      id="security-blur-shield"
      aria-hidden="true"
      className="fixed inset-0 z-999999 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-3xl text-white select-none p-6"
    >
      <div className="max-w-md text-center flex flex-col items-center gap-3.5">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-3xl border border-orange-500/40 shadow-xl shadow-orange-500/10 animate-pulse">
          🔒
        </div>
        <p className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Protected Content • محتوى محمي
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          Screenshots and screen recordings are restricted to protect the confidentiality of this scientific orthodontic study. Click anywhere on the page to resume.
          <br />
          تم تقييد التقاط الشاشة وتسجيلها لحماية سرية هذا البحث العلمي في طب تقويم الأسنان. اضغط في أي مكان داخل النافذة للمتابعة.
        </p>
      </div>
    </div>
  );
};
