'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GrungeGlyph from '@/components/ui/GrungeGlyph';

export default function BrutalFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#080808] text-[#F4F1EA] dark:bg-[#080808] dark:text-[#F4F1EA] border-t-2 border-[#E50914] relative overflow-hidden select-none font-mono">
      {/* Red highlight top accent bar */}
      <div className="w-full h-1 bg-[#E50914]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 border-2 border-[#E50914] shrink-0 bg-black">
                <Image
                  src="/assets/logo.png"
                  alt="Project S.H.E."
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-heading font-black text-xl text-[#E50914] tracking-tight block">
                  PROJECT S.H.E.
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                  SUPPORT • HELP • EMPOWER
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-md font-sans">
              Combating gender-based violence, shifting societal mindsets, and raising critical financial aid for survivor rehabilitation and trusted safehomes.
            </p>

            {/* Emergency Helpline Box */}
            <div className="p-3.5 bg-[#121212] border border-[#E50914] shadow-[3px_3px_0px_0px_#E50914] text-xs space-y-1.5 max-w-md stencil-cut">
              <span className="text-[10px] font-bold text-[#E50914] uppercase tracking-widest flex items-center gap-1.5">
                <GrungeGlyph name="phone" className="w-3.5 h-3.5" /> 24/7 NATIONAL HELPLINES
              </span>
              <p className="text-neutral-200 text-[11px] leading-tight">
                National Women Helpline: <strong>1091 / 181</strong>
              </p>
              <p className="text-neutral-200 text-[11px] leading-tight">
                Direct Contact: <strong>+91 98765 43210</strong>
              </p>
            </div>

            {/* Social & Contact */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <a
                href="https://instagram.com/projectshe.ngo"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-2 border border-neutral-700 hover:border-[#E50914] hover:bg-[#E50914] hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold hover-lift"
                aria-label="Instagram"
              >
                <GrungeGlyph name="instagram" className="w-4 h-4 text-[#E50914] group-hover:text-white transition-colors" />
                <span>@projectshe.ngo</span>
              </a>
              <a
                href="mailto:projectshe.ngo@gmail.com"
                className="group p-2 border border-neutral-700 hover:border-[#E50914] hover:bg-[#E50914] hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold hover-lift"
                aria-label="Email"
              >
                <GrungeGlyph name="mail" className="w-4 h-4 text-[#E50914] group-hover:text-white transition-colors" />
                <span>projectshe.ngo@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 text-xs">
            {/* Quick Links */}
            <div className="space-y-3">
              <span className="font-heading font-black text-sm text-[#E50914] uppercase tracking-wider block">
                WHAT WE DO
              </span>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <Link href="/#mission" className="hover:text-white transition-colors">
                    Community Fundraising
                  </Link>
                </li>
                <li>
                  <Link href="/#mission" className="hover:text-white transition-colors">
                    Direct Survivor Support
                  </Link>
                </li>
                <li>
                  <Link href="/#mission" className="hover:text-white transition-colors">
                    Mindset Shift
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Articles &amp; Stories
                  </Link>
                </li>
                <li>
                  <Link href="/#updates" className="hover:text-white transition-colors">
                    Latest Updates
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get Involved */}
            <div className="space-y-3">
              <span className="font-heading font-black text-sm text-[#E50914] uppercase tracking-wider block">
                GET INVOLVED
              </span>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <Link href="/#external-forms" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>Join Our Team</span>
                    <GrungeGlyph name="external" className="w-3 h-3 text-[#E50914]" />
                  </Link>
                </li>
                <li>
                  <Link href="/#external-forms" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>Share Your Art</span>
                    <GrungeGlyph name="external" className="w-3 h-3 text-[#E50914]" />
                  </Link>
                </li>
                <li>
                  <Link href="/#external-forms" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>Share Your Story</span>
                    <GrungeGlyph name="external" className="w-3 h-3 text-[#E50914]" />
                  </Link>
                </li>
                <li>
                  <Link href="/#donate" className="hover:text-white transition-colors">
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
                    className="hover:text-white transition-colors text-left text-[#E50914] font-bold flex items-center gap-1"
                  >
                    <span>Newsletter</span>
                    <span className="text-xs">→</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Location & Impact */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="font-heading font-black text-sm text-[#E50914] uppercase tracking-wider block">
              LOCATION
            </span>
            <div className="p-3 bg-[#121212] border border-neutral-800 space-y-1.5 text-neutral-300 stencil-cut relative overflow-hidden">
              <div className="absolute -right-2 -bottom-4 w-20 h-28 opacity-25 pointer-events-none">
                <Image
                  src="/assets/punk-lily-clean.png"
                  alt="Punk tribal lily"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                <GrungeGlyph name="map-pin" className="w-3.5 h-3.5 text-[#E50914]" /> Headquarters
              </span>
              <p className="text-[11px] leading-relaxed text-white font-bold">
                Project S.H.E., Hyderabad, Telangana, India.
              </p>
            </div>

            <div className="p-3 bg-[#121212] border border-neutral-800 space-y-1 text-[11px] text-neutral-400 stencil-cut">
              <div className="flex items-center gap-1.5 text-[#E50914] font-bold">
                <GrungeGlyph name="shield" className="w-3.5 h-3.5" />
                <span>100% DIRECT SUPPORT</span>
              </div>
              <p className="text-[10px] leading-relaxed">
                Registered non-profit. 100% of gathered funds route directly to verified safehouses like Sayodhya Women&apos;s Help Home.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-10 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className="text-[11px]">
              © {new Date().getFullYear()} PROJECT S.H.E. NGO.
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1 px-2.5 py-1 bg-[#141414] border border-neutral-700 hover:border-[#E50914] hover:bg-[#E50914] text-[11px] font-bold text-white transition-all hover-lift"
              aria-label="Back to top"
            >
              <GrungeGlyph name="arrow-up" className="w-3 h-3 text-[#E50914] group-hover:text-white transition-colors" />
              <span>TOP</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest hidden sm:flex">
              <span>SUPPORT</span>
              <span>-</span>
              <span>HELP</span>
              <span>-</span>
              <span>EMPOWER</span>
            </div>
          </div>
        </div>

      </div>

      {/* Brutalist Text Watermark */}
      <div className="w-full overflow-hidden flex justify-center items-end mt-2 pointer-events-none select-none">
        <span className="font-heading font-black text-[13.5vw] leading-[0.72] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-800/80 to-transparent whitespace-nowrap">
          PROJECT S.H.E.
        </span>
      </div>
    </footer>
  );
}
