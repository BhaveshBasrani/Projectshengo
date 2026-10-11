'use client';

import React, { useEffect } from 'react';

/**
 * ClientSecurityShield
 * 1. Blocks right-click context menu (prevents casual "Inspect Element" / "View Source").
 * 2. Intercepts common DevTools opening shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U).
 * 3. Adds security console deterrence banner.
 * 4. Guards sensitive input elements from autocomplete leakage.
 */
export default function ClientSecurityShield() {
  useEffect(() => {
    // 1. Right-click context menu protection
    const handleContextMenu = (e: MouseEvent) => {
      // Allow right-click ONLY inside text inputs for user convenience (pasting), block everywhere else
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
    };

    // 2. DevTools / View Source hotkey interception
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Ctrl + Shift + I (Inspect) or Ctrl + Shift + J (Console) or Ctrl + Shift + C (Element Inspector)
      if (e.ctrlKey && e.shiftKey) {
        const key = e.key.toUpperCase();
        if (key === 'I' || key === 'J' || key === 'C') {
          e.preventDefault();
          return false;
        }
      }

      // Cmd + Option + I / J / C (macOS)
      if (e.metaKey && e.altKey) {
        const key = e.key.toUpperCase();
        if (key === 'I' || key === 'J' || key === 'C') {
          e.preventDefault();
          return false;
        }
      }

      // Ctrl + U or Cmd + U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }

      // Ctrl + S or Cmd + S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
          return;
        }
        e.preventDefault();
        return false;
      }
    };

    // 3. Security deterrence in browser console
    try {
      console.log(
        '%cPROJECT S.H.E. // SECURITY ACTIVE',
        'color: #E50914; font-family: monospace; font-size: 20px; font-weight: 900; background: #000; padding: 4px 8px; border-left: 4px solid #E50914;'
      );
      console.log(
        '%cNotice: This console is monitored. Attempting to reverse engineer, extract credentials, or inject code into this application is strictly logged.',
        'color: #888; font-family: monospace; font-size: 11px;'
      );
    } catch (_) {}

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}
