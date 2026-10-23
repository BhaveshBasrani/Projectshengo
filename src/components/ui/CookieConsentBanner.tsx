'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function CookieConsentBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      if (typeof document !== 'undefined') {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setIsLight(currentTheme === 'light');
      }
    };
    checkTheme();

    const handleThemeChange = (e: any) => {
      setIsLight(e.detail?.theme === 'light');
    };
    window.addEventListener('theme-changed', handleThemeChange);

    // Check if user has already made a choice
    const consent = localStorage.getItem('she_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('theme-changed', handleThemeChange);
      };
    }

    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const handleChoice = (accepted: boolean) => {
    localStorage.setItem('she_cookie_consent', accepted ? 'accepted' : 'declined');
    setIsVisible(false);

    // If accepted, track lightweight anonymous visitor presence
    if (accepted) {
      try {
        fetch('/api/insights/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'Browsing Website' }),
        }).catch(() => {});
      } catch {}
    }
  };

  if (pathname?.startsWith('/admin')) return null;
  if (!isVisible) return null;

  return (
    <aside
      role="dialog"
      aria-label="Cookie consent banner"
      className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9999] p-4 sm:p-5 border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
        isLight
          ? 'bg-[#FFFFFF] text-[#111111] border-[#D4D4D8] selection:bg-[#E6192B] selection:text-white'
          : 'bg-[#0E0E0E] text-[#EDEDED] border-neutral-800 selection:bg-[#E6192B] selection:text-white'
      }`}
      style={{
        borderRadius: '0px',
      }}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#E6192B]" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#E6192B] font-bold">
            // PRIVACY NOTICE
          </span>
        </div>

        <p
          className={`font-sans text-xs leading-relaxed font-normal ${
            isLight ? 'text-[#3F3F46]' : 'text-neutral-300'
          }`}
        >
          We use essential cookies to ensure this site functions properly and to understand how our community interacts with it.
        </p>

        <div className="flex items-center gap-2.5 pt-1 font-mono text-xs uppercase tracking-wider font-bold">
          <button
            type="button"
            onClick={() => handleChoice(true)}
            className={`flex-1 py-2 px-4 bg-[#E6192B] border border-[#E6192B] text-white transition-colors duration-150 text-center ${
              isLight ? 'hover:bg-black hover:border-black' : 'hover:bg-white hover:text-black hover:border-white'
            }`}
            style={{ borderRadius: '0px' }}
          >
            Accept
          </button>

          <button
            type="button"
            onClick={() => handleChoice(false)}
            className={`flex-1 py-2 px-4 transition-colors duration-150 text-center border ${
              isLight
                ? 'bg-transparent hover:bg-neutral-100 text-[#18181B] border-[#D4D4D8] hover:border-black'
                : 'bg-transparent hover:bg-neutral-900 text-neutral-400 hover:text-white border-neutral-700 hover:border-neutral-500'
            }`}
            style={{ borderRadius: '0px' }}
          >
            Decline
          </button>
        </div>
      </div>
    </aside>
  );
}
