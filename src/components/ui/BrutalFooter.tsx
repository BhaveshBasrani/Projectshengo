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
    <footer className="w-full bg-[#080808] text-[#F4F1EA] dark:bg-[#080808] dark:text-[#F4F1EA] border-t-2 border-[#E50914] relative overflow-hidden select-none">
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
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

            <p className="text-xs text-neutral-300 leading-relaxed max-w-md font-sans">
              &ldquo;Challenging the violence women face, reshaping the minds that permit it, and turning solidarity into dignity and tangible change.&rdquo;
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
                    Fundraising
                  </Link>
                </li>
                <li>
                  <Link href="/#mission" className="hover:text-white transition-colors">
                    Direct Survivor Support
                  </Link>
                </li>
                <li>
                  <Link href="/#mission" className="hover:text-white transition-colors">
                    Advocacy &amp; Dialogue
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Articles &amp; Stories
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                <GrungeGlyph name="map-pin" className="w-3.5 h-3.5 text-[#E50914]" /> Headquarters
              </span>
              <p className="text-[11px] leading-relaxed text-white font-bold">
                Project S.H.E., Hyderabad, Telangana, India.
              </p>
            </div>

            <div className="p-3 bg-[#121212] border border-neutral-800 space-y-1.5 text-[11px] text-neutral-300 stencil-cut">
              <div className="flex items-center gap-1.5 text-[#E50914] font-bold">
                <GrungeGlyph name="shield" className="w-3.5 h-3.5" />
                <span>SARVA NIRBHAYA FOUNDATION</span>
              </div>
              <p className="text-[10px] leading-relaxed text-neutral-400">
                Registered Section 8 company under Companies Act, 2013 • Inc. 19 May 2026, Ministry of Corporate Affairs, Govt. of India.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Tagline & Bar */}
        <div className="pt-6 mt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p className="text-neutral-300 font-sans text-xs sm:text-sm font-medium italic border-l-2 border-[#E50914] pl-3 max-w-2xl">
            Hyderabad&apos;s leading student NGO mobilizing grassroots action, supporting survivor safe houses, and dismantling systemic gender-based violence. </p>.

          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <span className="text-[11px]">
              © {new Date().getFullYear()} PROJECT S.H.E.
            </span>

            <span className="text-[11px] text-neutral-600">•</span>

            <span className="text-[11px] text-neutral-400">
              Powered by <span className="text-white font-semibold tracking-wide"> Rendervoid</span>
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1 px-2.5 py-1 bg-[#141414] border border-neutral-700 hover:border-[#E50914] hover:bg-[#E50914] text-[11px] font-bold text-white transition-all hover-lift ml-1"
              aria-label="Back to top"
            >
              <GrungeGlyph name="arrow-up" className="w-3 h-3 text-[#E50914] group-hover:text-white transition-colors" />
              <span>TOP</span>
            </button>
          </div>
        </div>

      </div>

      {/* Brutalist Text Watermark - Large Edge-to-Edge & Centered Across All Screens */}
      <div className="w-full overflow-hidden flex justify-center items-end mt-2 pointer-events-none select-none text-center">
        <span className="font-heading font-black text-center w-full block uppercase text-[13.6vw] leading-[0.72] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-800/85 via-neutral-800/40 to-transparent whitespace-nowrap m-0 p-0">
          PROJECT S.H.E.
        </span>
      </div>
    </footer>
  );
}
