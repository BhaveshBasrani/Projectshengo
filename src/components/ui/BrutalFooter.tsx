'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import { HiMoon, HiSun, HiArrowRight } from 'react-icons/hi2';

export default function BrutalFooter() {
  const pathname = usePathname();
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  const [footerQuote, setFooterQuote] = React.useState(
    'Challenging the violence women face, reshaping the minds that permit it, and turning solidarity into dignity and tangible change.'
  );

  React.useEffect(() => {
    const syncTheme = () => {
      if (typeof document !== 'undefined') {
        const isLight =
          document.documentElement.classList.contains('light') ||
          document.documentElement.getAttribute('data-theme') === 'light';
        setTheme(isLight ? 'light' : 'dark');
      }
    };

    syncTheme();
    window.addEventListener('theme-changed', syncTheme);

    // Fetch dynamic live footer quote
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.footer_quote) {
          setFooterQuote(data.settings.footer_quote);
        }
      })
      .catch(() => {});

    return () => window.removeEventListener('theme-changed', syncTheme);
  }, []);

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    if (newTheme === theme) return;
    setTheme(newTheme);

    const applyThemeChanges = () => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('theme-transitioning');
        if (newTheme === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        }
        try {
          localStorage.setItem('project-she-theme', newTheme);
        } catch (e) {}
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: newTheme } }));

        setTimeout(() => {
          document.documentElement.classList.remove('theme-transitioning');
        }, 450);
      }
    };

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        applyThemeChanges();
      });
    } else {
      applyThemeChanges();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="brutal-footer w-full bg-[#090909] text-[#EDEDED] border-t border-[#222222] relative overflow-hidden select-none transition-colors duration-200">
      {/* Red highlight top accent bar */}
      <div className="w-full h-[2px] bg-[#E6192B]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

          {/* Left Column: Brand & Direct Helpline */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 border border-[#333333] shrink-0 bg-black overflow-hidden rounded-none">
                <Image
                  src="/assets/logo.png"
                  alt="Project S.H.E."
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div>
                <span className="font-heading font-black text-xl text-[#E6192B] tracking-tight block">
                  PROJECT S.H.E.
                </span>
                <span className="footer-subtext text-[10px] text-neutral-400 font-mono uppercase tracking-widest block">
                  SUPPORT • HELP • EMPOWER
                </span>
              </div>
            </div>

            {/* 24/7 National Helplines Box */}
            <div className="footer-card p-4 bg-[#121212] border border-[#2A2A2A] text-xs space-y-2 max-w-md rounded-none transition-colors">
              <span className="text-[10px] font-mono font-bold text-[#E6192B] uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#E6192B] inline-block" />
                <span>24/7 NATIONAL HELPLINES</span>
              </span>
              <p className="text-xs leading-tight font-sans">
                National Women Helpline: <strong className="font-mono">1091 / 181</strong>
              </p>
              <p className="text-xs leading-tight font-sans">
                Direct Emergency Contact: <strong className="font-mono">+91 98765 43210</strong>
              </p>
            </div>

            {/* Social & Contact Buttons */}
            <div className="flex items-center gap-2.5 pt-1 flex-wrap font-mono">
              <a
                href="https://instagram.com/projectshe.ngo"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-btn group px-3 py-2 border border-[#2E2E2E] hover:border-[#E6192B] hover:bg-[#E6192B] hover:text-white transition-all flex items-center gap-2 text-xs font-bold rounded-none"
                aria-label="Instagram"
              >
                <GrungeGlyph name="instagram" className="w-3.5 h-3.5 text-[#E6192B] group-hover:text-white transition-colors" />
                <span>@projectshe.ngo</span>
              </a>
              <a
                href="mailto:projectshe.ngo@gmail.com"
                className="footer-btn group px-3 py-2 border border-[#2E2E2E] hover:border-[#E6192B] hover:bg-[#E6192B] hover:text-white transition-all flex items-center gap-2 text-xs font-bold rounded-none"
                aria-label="Email"
              >
                <GrungeGlyph name="mail" className="w-3.5 h-3.5 text-[#E6192B] group-hover:text-white transition-colors" />
                <span>projectshe.ngo@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Middle Column: Navigation & Community Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 text-xs">
            {/* What We Do */}
            <div className="space-y-3">
              <span className="font-mono text-xs text-[#E6192B] uppercase tracking-widest font-bold block">
                // WHAT WE DO
              </span>
              <ul className="space-y-2.5 font-sans text-xs">
                <li>
                  <Link href="/#mission" className="hover:text-[#E6192B] transition-colors">
                    Fundraising
                  </Link>
                </li>
                <li>
                  <Link href="/#mission" className="hover:text-[#E6192B] transition-colors">
                    Direct Survivor Support
                  </Link>
                </li>
                <li>
                  <Link href="/#mission" className="hover:text-[#E6192B] transition-colors">
                    Advocacy &amp; Dialogue
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-[#E6192B] transition-colors">
                    Visual Archive (Gallery)
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-[#E6192B] transition-colors">
                    Articles &amp; Stories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get Involved */}
            <div className="space-y-3">
              <span className="font-mono text-xs text-[#E6192B] uppercase tracking-widest font-bold block">
                // GET INVOLVED
              </span>
              <ul className="space-y-2.5 font-sans text-xs">
                <li>
                  <Link href="/#external-forms" className="hover:text-[#E6192B] transition-colors flex items-center gap-1">
                    <span>Join Our Team</span>
                    <GrungeGlyph name="external" className="w-3 h-3 text-[#E6192B]" />
                  </Link>
                </li>
                <li>
                  <Link href="/#external-forms" className="hover:text-[#E6192B] transition-colors flex items-center gap-1">
                    <span>Share Your Art</span>
                    <GrungeGlyph name="external" className="w-3 h-3 text-[#E6192B]" />
                  </Link>
                </li>
                <li>
                  <Link href="/#external-forms" className="hover:text-[#E6192B] transition-colors flex items-center gap-1">
                    <span>Share Your Story</span>
                    <GrungeGlyph name="external" className="w-3 h-3 text-[#E6192B]" />
                  </Link>
                </li>
                <li>
                  <Link href="/#donate" className="hover:text-[#E6192B] transition-colors">
                    Donate
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('open-newsletter-modal'));
                      }
                    }}
                    className="hover:text-white transition-colors text-left text-[#E6192B] font-bold flex items-center gap-1.5 font-mono group"
                  >
                    <span>Newsletter</span>
                    <HiArrowRight className="w-3.5 h-3.5 text-[#E6192B] group-hover:text-white transition-transform duration-150 group-hover:translate-x-0.5" />
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Location / Headquarters (Balances the Grid) */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="font-mono text-xs text-[#E6192B] uppercase tracking-widest font-bold block">
              // LOCATION
            </span>
            <div className="footer-card p-4 bg-[#121212] border border-[#262626] space-y-2 rounded-none transition-colors">
              <span className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <GrungeGlyph name="map-pin" className="w-3.5 h-3.5 text-[#E6192B]" />
                <span>HEADQUARTERS</span>
              </span>
              <p className="text-xs leading-relaxed font-bold font-sans">
                Project S.H.E., Hyderabad, Telangana, India.
              </p>
              <p className="footer-subtext text-[11px] leading-relaxed font-sans pt-2 border-t border-[#1F1F1F] footer-divider">
                Central operations hub coordinating community fundraisers, survivor safehouse resources, and youth advocacy across Hyderabad.
              </p>
            </div>
          </div>

        </div>

        {/* Centered Editorial Sign-Off Quote */}
        <div className="pt-10 mt-12 border-t border-[#222222] footer-divider text-center">
          <p className="footer-quote text-[#E5E5E5] font-sans text-xs sm:text-sm md:text-[15px] font-normal italic tracking-wide max-w-3xl mx-auto leading-relaxed">
            &ldquo;{footerQuote}&rdquo;
          </p>
        </div>

        {/* Bottom Bar: Theme Switcher, Copyright, Credits, Back to Top */}
        <div className="pt-6 mt-6 border-t border-[#1C1C1C] footer-divider flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            {/* Theme Changer */}
            <div className="theme-toggle-container relative flex items-center p-1 bg-[#121212] border border-[#2B2B2B] rounded-sm text-[11px] font-mono select-none shadow-sm transition-colors">
              <span className="footer-subtext text-neutral-400 font-bold px-2 text-[10px] uppercase tracking-wider hidden sm:inline">
                THEME:
              </span>
              <div className="theme-toggle-track relative flex items-center bg-[#0A0A0A] p-0.5 rounded-sm border border-[#222222]">
                <button
                  type="button"
                  onClick={() => toggleTheme('dark')}
                  className={`relative z-10 px-3 py-1 font-bold uppercase transition-colors duration-200 flex items-center gap-1.5 rounded-sm ${
                    theme === 'dark' ? 'text-white' : 'theme-toggle-btn-inactive text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="Switch to Dark Theme"
                >
                  {theme === 'dark' && (
                    <motion.div
                      layoutId="theme-active-indicator"
                      className="absolute inset-0 bg-[#E6192B] rounded-sm shadow-[0_0_12px_rgba(230,25,43,0.35)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <HiMoon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-white' : 'text-neutral-400'}`} />
                    <span>DARK</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleTheme('light')}
                  className={`relative z-10 px-3 py-1 font-bold uppercase transition-colors duration-200 flex items-center gap-1.5 rounded-sm ${
                    theme === 'light' ? 'text-white' : 'theme-toggle-btn-inactive text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="Switch to Light Theme"
                >
                  {theme === 'light' && (
                    <motion.div
                      layoutId="theme-active-indicator"
                      className="absolute inset-0 bg-[#E6192B] rounded-sm shadow-[0_0_12px_rgba(230,25,43,0.35)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <HiSun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-white' : 'text-neutral-400'}`} />
                    <span>LIGHT</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="footer-subtext flex items-center gap-2 text-[11px] text-neutral-400">
            <span>© {new Date().getFullYear()} PROJECT S.H.E.</span>
            <span>•</span>
            <span>Powered by <span className="font-semibold tracking-wide">Rendervoid</span></span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="footer-btn group inline-flex items-center gap-1 px-3 py-1 bg-[#141414] border border-[#2E2E2E] hover:border-[#E6192B] hover:bg-[#E6192B] text-[11px] font-bold text-white transition-all rounded-none"
            aria-label="Back to top"
          >
            <GrungeGlyph name="arrow-up" className="w-3 h-3 text-[#E6192B] group-hover:text-white transition-colors" />
            <span>TOP</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
