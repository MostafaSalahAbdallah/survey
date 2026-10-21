'use client';

import React, { useEffect, useState } from 'react';

/**
 * SecurityGuard Component
 * Implements client-side anti-inspection, anti-screenshot, and anti-recording mitigations:
 * 1. Disables right-click context menu (inspect element, save image).
 * 2. Blocks developer tool hotkeys: F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S, Ctrl+P.
 * 3. Intercepts PrintScreen key to clear clipboard and blank view.
 * 4. Blurs content when window loses focus (mitigates snipping tools and window-capture tools).
 * 5. Disables image dragging and long-press menus on mobile devices.
 * 6. Adds debugger traps against active devtools console inspection.
 */
export const SecurityGuard: React.FC = () => {
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  useEffect(() => {
    // 1. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable Dragging Images or Elements
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 3. Block Inspection & Screenshot Shortcut Keys
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // PrintScreen interception
      if (key === 'PrintScreen' || key === 'Snapshot') {
        e.preventDefault();
        // Clear clipboard content
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('').catch(() => {});
        }
        setIsWindowBlurred(true);
        setTimeout(() => setIsWindowBlurred(false), 800);
        return false;
      }

      // F12 -> DevTools
      if (key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I / J / C -> DevTools Inspect / Console / Element Picker
      if (ctrlOrMeta && shift && (key === 'I' || key === 'i' || key === 'J' || key === 'j' || key === 'C' || key === 'c')) {
        e.preventDefault();
        return false;
      }

      // Ctrl+U -> View Source
      if (ctrlOrMeta && (key === 'u' || key === 'U')) {
        e.preventDefault();
        return false;
      }

      // Ctrl+S -> Save Page
      if (ctrlOrMeta && (key === 's' || key === 'S')) {
        e.preventDefault();
        return false;
      }

      // Ctrl+P -> Print / Export PDF
      if (ctrlOrMeta && (key === 'p' || key === 'P')) {
        e.preventDefault();
        return false;
      }
    };

    // 4. Blur / Mask on window blur or visibility change (Snipping tool / window switch protection)
    const handleBlur = () => {
      setIsWindowBlurred(true);
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWindowBlurred(true);
      } else {
        setIsWindowBlurred(false);
      }
    };

    // 5. Lightweight DevTools Debugger detection
    const devToolsInterval = setInterval(() => {
      // Check if DevTools dock has altered outer vs inner dimensions significantly
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > 160 || heightDiff > 160) {
        // Devtools likely open
        try {
          console.clear();
        } catch {}
      }
    }, 1500);

    // Register event listeners
    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(devToolsInterval);
    };
  }, []);

  if (!isWindowBlurred) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-xl text-white select-none pointer-events-none p-6 transition-all duration-150"
    >
      <div className="max-w-md text-center flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xl border border-orange-500/40">
          🔒
        </div>
        <p className="text-base sm:text-lg font-bold">
          Protected Content • محتوى محمي
        </p>
        <p className="text-xs sm:text-sm text-slate-300">
          This scientific study is confidential. Return to the window to resume.
          <br />
          هذا البحث العلمي سري ومحمي. يرجى العودة إلى نافذة الاستبيان للمتابعة.
        </p>
      </div>
    </div>
  );
};
