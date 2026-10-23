'use client';

import { useEffect } from 'react';

export function ThemeInitializer({ defaultTheme }: { defaultTheme: 'dark' | 'light' }) {
  useEffect(() => {
    const applyTheme = (theme: 'dark' | 'light') => {
      if (typeof document === 'undefined') return;
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
      document.documentElement.setAttribute('data-theme', theme);
      try {
        localStorage.setItem('project-she-server-default', defaultTheme);
        localStorage.setItem('project-she-theme', theme);
      } catch {}
      window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
    };

    // Pattern learned from Salus:
    // If the server default changed in the Admin Panel, immediately force synchronize
    // this device to the admin's chosen default theme!
    try {
      const prevServerDefault = localStorage.getItem('project-she-server-default');
      if (prevServerDefault !== defaultTheme) {
        applyTheme(defaultTheme);
      } else {
        const currentStored = localStorage.getItem('project-she-theme');
        if (currentStored === 'light' || currentStored === 'dark') {
          applyTheme(currentStored);
        } else {
          applyTheme(defaultTheme);
        }
      }
    } catch {
      applyTheme(defaultTheme);
    }

    // Real-time synchronization: When returning to tab or on window focus,
    // verify if admin changed the system default theme from another tab/device.
    const syncFresh = async () => {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.settings?.default_theme) {
            const freshDefault = data.settings.default_theme;
            const currentStoredDefault = localStorage.getItem('project-she-server-default');
            if (currentStoredDefault !== freshDefault) {
              applyTheme(freshDefault);
            }
          }
        }
      } catch {}
    };

    window.addEventListener('focus', syncFresh);
    return () => window.removeEventListener('focus', syncFresh);
  }, [defaultTheme]);

  return null;
}

export default ThemeInitializer;
