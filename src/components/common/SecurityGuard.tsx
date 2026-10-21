'use client';

import React, { useEffect } from 'react';

/**
 * SecurityGuard Component
 *
 * Key insight for reliable screenshot blocking:
 * The shield div must ALWAYS be in the GPU compositor layer.
 * Using display:none removes it from the compositor — adding it back
 * needs a full layout+paint cycle (several ms — too slow on Windows).
 *
 * Instead we keep the shield permanently rendered using:
 *   opacity: 0 + pointer-events: none  →  normal (invisible but composited)
 *   opacity: 1 + pointer-events: all   →  shielded (blocks view instantly)
 *
 * The opacity change is GPU-accelerated and fires in < 1 frame before
 * the OS screen capture buffer is committed to the clipboard.
 */
export const SecurityGuard: React.FC = () => {
  useEffect(() => {
    let shieldTimer: ReturnType<typeof setTimeout> | null = null;

    const shield = document.getElementById('security-blur-shield') as HTMLElement | null;
    const content = document.getElementById('survey-root-content') as HTMLElement | null;

    const showShield = () => {
      if (shield) {
        shield.style.opacity = '1';
        shield.style.pointerEvents = 'all';
      }
      if (content) {
        content.style.filter = 'blur(40px) brightness(0.05)';
        content.style.pointerEvents = 'none';
      }
    };

    const hideShield = (delayMs = 0) => {
      if (shieldTimer) { clearTimeout(shieldTimer); shieldTimer = null; }
      const doHide = () => {
        if (shield) { shield.style.opacity = '0'; shield.style.pointerEvents = 'none'; }
        if (content) { content.style.filter = ''; content.style.pointerEvents = ''; }
      };
      if (delayMs > 0) {
        shieldTimer = setTimeout(() => {
          if (document.hasFocus() && !document.hidden) doHide();
        }, delayMs);
      } else {
        doHide();
      }
    };

    const wipeClipboard = () => {
      try {
        navigator.clipboard?.writeText(
          '⚠️ Protected Content — Screenshots of this scientific orthodontic study are restricted.'
        ).catch(() => {});
      } catch {}
    };

    // Right-click context menu
    const onContextMenu = (e: MouseEvent) => { e.preventDefault(); return false; };

    // Drag prevention
    const onDragStart = (e: DragEvent) => { e.preventDefault(); return false; };

    // keyup — Chromium/Windows ONLY dispatches PrintScreen on keyup, NOT keydown
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        showShield();
        wipeClipboard();
        hideShield(2500);
      }
    };

    // keydown — DevTools, print, save, view-source
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key;
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // Catch PrintScreen on keydown too (Firefox, some other browsers)
      if (k === 'PrintScreen' || k === 'Snapshot') {
        e.preventDefault(); showShield(); wipeClipboard(); hideShield(2500); return false;
      }
      // Win+Shift+S  (Snipping Tool shortcut — activates on some configs via keydown)
      if (ctrl && shift && (k === 'S' || k === 's')) {
        showShield(); wipeClipboard(); hideShield(2500);
      }
      if (k === 'F12') { e.preventDefault(); return false; }
      if (ctrl && shift && /^[ijcIJC]$/.test(k)) { e.preventDefault(); return false; }
      if (ctrl && /^[uU]$/.test(k)) { e.preventDefault(); return false; }
      if (ctrl && /^[sS]$/.test(k)) { e.preventDefault(); return false; }
      if (ctrl && /^[pP]$/.test(k)) { e.preventDefault(); showShield(); hideShield(2000); return false; }
    };

    // Window blur fires the instant Snipping Tool / any screen grabber steals focus
    const onBlur = () => showShield();
    const onFocus = () => hideShield(150);
    const onVisibility = () => { if (document.hidden) showShield(); else hideShield(150); };

    // Click inside shield to dismiss (fallback if focus event doesn't fire)
    const onShieldClick = () => { if (document.hasFocus()) hideShield(); };
    shield?.addEventListener('click', onShieldClick);

    // DevTools dimension probe
    const dtInterval = setInterval(() => {
      if (
        (window.outerWidth - window.innerWidth) > 160 ||
        (window.outerHeight - window.innerHeight) > 160
      ) {
        try { console.clear(); } catch {}
      }
    }, 1500);

    window.addEventListener('contextmenu', onContextMenu, { capture: true });
    window.addEventListener('dragstart', onDragStart, { capture: true });
    window.addEventListener('keydown', onKeyDown, { capture: true });
    window.addEventListener('keyup', onKeyUp, { capture: true });
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('contextmenu', onContextMenu, { capture: true });
      window.removeEventListener('dragstart', onDragStart, { capture: true });
      window.removeEventListener('keydown', onKeyDown, { capture: true });
      window.removeEventListener('keyup', onKeyUp, { capture: true });
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      shield?.removeEventListener('click', onShieldClick);
      clearInterval(dtInterval);
      if (shieldTimer) clearTimeout(shieldTimer);
    };
  }, []);

  return (
    <div
      id="security-blur-shield"
      aria-hidden="true"
      style={{ opacity: 0, pointerEvents: 'none', transition: 'opacity 60ms ease' }}
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-slate-950 text-white select-none p-6"
    >
      <div className="max-w-md text-center flex flex-col items-center gap-3.5">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-3xl border border-orange-500/40 shadow-xl animate-pulse">
          🔒
        </div>
        <p className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Protected Content • محتوى محمي
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          Screenshots and screen recordings are restricted to protect this scientific orthodontic study. Return to the window to resume.
          <br />
          تم تقييد التقاط الشاشة وتسجيلها لحماية سرية هذا البحث العلمي في طب تقويم الأسنان. يرجى العودة إلى نافذة الاستبيان للمتابعة.
        </p>
      </div>
    </div>
  );
};
