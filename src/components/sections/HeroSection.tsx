'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiHeart } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import HalftoneFlow from '@/components/ui/HalftoneFlow';

interface HeroSectionProps {
  teamFormUrl: string;
  marqueeText?: string;
  headlineText?: string;
  headlineText2?: string;
  headlineText3?: string;
  heroBadge?: string;
  heroSubbadge?: string;
  heroDescription?: string;
}

export default function HeroSection({
  teamFormUrl,
  marqueeText,
  headlineText,
  headlineText2,
  headlineText3,
  heroBadge,
  heroSubbadge,
  heroDescription,
}: HeroSectionProps) {
  // Collect headline phrases cleanly for smooth switching
  const phrases = React.useMemo(() => {
    const list: string[] = [];
    if (headlineText && headlineText.trim()) list.push(headlineText.trim());
    if (headlineText2 && headlineText2.trim()) list.push(headlineText2.trim());
    if (headlineText3 && headlineText3.trim()) list.push(headlineText3.trim());

    // Fallback/Migration: If only one phrase was entered but it contains full sentences separated by periods
    if (list.length === 1 && list[0].includes('.')) {
      const parts = list[0]
        .split(/(?<=\.)\s+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 3);
      if (parts.length > 1) {
        return parts;
      }
    }

    if (list.length > 0) return list;

    return [
      'RAISE YOUR VOICE WHERE THEIRS WAS SILENCED.',
      'STAND WITH THOSE WHO SURVIVED.',
    ];
  }, [headlineText, headlineText2, headlineText3]);

  const [phraseIndex, setPhraseIndex] = React.useState(0);

  React.useEffect(() => {
    if (phrases.length <= 1) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [phrases.length]);

  const longestPhrase = phrases.reduce(
    (max, cur) => (cur.length > max.length ? cur : max),
    phrases[0]
  );

  const customSegments = marqueeText
    ? marqueeText
        .split('✦')
        .map((s) => s.trim())
        .filter(Boolean)
    : null;

  const tickerItems = (
    <div suppressHydrationWarning className="flex items-center px-4 font-mono font-medium text-[11px] sm:text-xs uppercase tracking-widest text-[#FDFCF7] whitespace-nowrap">
      {customSegments && customSegments.length > 0 ? (
        customSegments.map((seg, i) => (
          <React.Fragment key={i}>
            <span>{seg}</span>
            <span className="text-[#FDFCF7]/60 px-5 sm:px-7 select-none text-xs font-normal">✦</span>
          </React.Fragment>
        ))
      ) : (
        <>
          <span>CHALLENGING THE VIOLENCE WOMEN FACE, RESHAPING THE MINDS THAT PERMIT IT</span>
          <span className="text-[#FDFCF7]/60 px-5 sm:px-7 select-none text-xs font-normal">✦</span>

          <span>TURNING SOLIDARITY INTO DIGNITY AND TANGIBLE CHANGE</span>
          <span className="text-[#FDFCF7]/60 px-5 sm:px-7 select-none text-xs font-normal">✦</span>

          <span>₹2,00,000+ RAISED &amp; DELIVERED TOWARDS SURVIVOR CARE</span>
          <span className="text-[#FDFCF7]/60 px-5 sm:px-7 select-none text-xs font-normal">✦</span>

          <span>SARVA NIRBHAYA FOUNDATION • SECTION 8 NGO</span>
          <span className="text-[#FDFCF7]/60 px-5 sm:px-7 select-none text-xs font-normal">✦</span>

          <span>BATTLE OF THE BANDS (BOTB 1.0 &amp; 2.0)</span>
          <span className="text-[#FDFCF7]/60 px-5 sm:px-7 select-none text-xs font-normal">✦</span>

          <span>SAHODAYA WOMEN&apos;S HELP HOME PARTNERSHIP</span>
          <span className="text-[#FDFCF7]/60 px-5 sm:px-7 select-none text-xs font-normal">✦</span>

          <span>DISMANTLING GENDER-BASED VIOLENCE • HYDERABAD, INDIA</span>
          <span className="text-[#FDFCF7]/60 px-5 sm:px-7 select-none text-xs font-normal">✦</span>
        </>
      )}
    </div>
  );

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-between pt-32 sm:pt-36 pb-0 overflow-hidden border-b border-[#333333] select-none bg-[#090909]">

      {/* Ambient Subtle Grayscale Grain Backdrop */}
      <div
        className="absolute inset-0 z-0 opacity-10 mix-blend-screen pointer-events-none bg-cover bg-center filter grayscale contrast-125"
        style={{ backgroundImage: `url('/assets/punk-bg-posters.png')` }}
      />

      {/* Atmospheric Radial Vignette */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] z-0 opacity-[0.03] pointer-events-none bg-contain bg-no-repeat [mask-image:radial-gradient(circle_at_top_right,black_30%,transparent_70%)]"
        style={{ backgroundImage: `url('/assets/punk-bg-stars.jpg')` }}
      />

      {/* Fluid Halftone Red Ambient Canvas */}
      <HalftoneFlow
        className="z-0"
        opacity={0.22}
        speed={0.3}
        gridSize={6.5}
      />

      {/* UK Newspaper Broadsheet Protest Banner (Light Theme Signature Element) */}
      <div className="uk-newspaper-banner absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <Image
          src="/assets/protest-collage.png"
          alt="UK Newspaper Protest Collage"
          fill
          priority
          sizes="100vw"
          className="uk-newspaper-image object-cover object-center"
        />
        {/* Fine Rotary Press Halftone Print Screening */}
        <div className="uk-newspaper-screen" />
        {/* Contrast Scrim for Typographic Legibility */}
        <div className="uk-newspaper-scrim" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 px-4 sm:px-6 md:px-8 mt-4 sm:my-auto py-4">

        {/* Top Status Badges */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
          <span className="text-[10px] sm:text-xs bg-[#E6192B] text-white px-2.5 py-1 tracking-widest font-mono font-bold uppercase rounded-sm border border-red-500/30">
            {heroBadge || "HYDERABAD'S LEADING STUDENT NGO"}
          </span>
          <span className="text-[10px] sm:text-xs text-[#D1D5DB] font-mono tracking-wider">
            {heroSubbadge || "SARVA NIRBHAYA FOUNDATION • HYDERABAD, INDIA"}
          </span>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Main Typography & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <h1 className="sr-only">
              {phrases.join(' ')}
            </h1>

            {/* Smooth Non-Blinking Editorial Headline Switcher */}
            <div className="relative w-full overflow-hidden">
              {/* Invisible layout spacer to reserve full height and prevent jumps */}
              <div
                className="invisible pointer-events-none select-none font-heading font-black text-3xl sm:text-5xl lg:text-[3.5rem] tracking-tight leading-[1.08] uppercase pb-1 sm:pb-2"
                aria-hidden="true"
              >
                {longestPhrase}
              </div>

              {/* Absolute active transitioning headline */}
              <div className="absolute inset-0 top-0 left-0 w-full h-full flex items-start">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phraseIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="font-heading font-black text-3xl sm:text-5xl lg:text-[3.5rem] tracking-tight text-white dark:text-white leading-[1.08] uppercase select-text"
                  >
                    {phrases[phraseIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <p className="font-sans text-sm sm:text-base md:text-lg text-[#D1D5DB] max-w-xl leading-relaxed animate-fade-in-up delay-200 pt-2 sm:pt-4">
              {heroDescription || "Violence injects itself into the lives of survivors even after the incident itself has long passed, impacting their very ability to rebuild their lives. Project S.H.E., Hyderabad's leading student NGO, works to dismantle this systemic gender-based violence as well as extend support to survivor safe houses."}
            </p>

            {/* Rearranged CTA Buttons: Primary Donate (with sleek minimal icon), Secondary Team, Tertiary Pillars */}
            <div className="relative pt-3 flex items-center gap-3 sm:gap-4 flex-wrap text-xs font-mono font-bold uppercase tracking-wider animate-fade-in-up delay-300">
              <Link
                href="/#donate"
                className="group px-6 py-3 bg-[#E6192B] hover:bg-[#d01424] text-white border border-[#E6192B] shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000] transition-all flex items-center gap-2.5 min-h-[44px] rounded-sm hover-lift"
              >
                {/* Minimalist Heart Icon on Primary Action */}
                <HiHeart className="w-4 h-4 text-white transition-transform duration-200 group-hover:scale-110" />
                <span>DONATE (UPI)</span>
              </Link>

              <a
                href={teamFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 py-3 bg-[#FAF8F3] dark:bg-[#141414] text-[#0A0A0A] dark:text-white hover:bg-[#E6192B] dark:hover:bg-[#E6192B] hover:text-white dark:hover:text-white border border-[#0A0A0A] dark:border-neutral-700 hover:border-[#E6192B] dark:hover:border-[#E6192B] shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000] transition-all flex items-center gap-2 min-h-[44px] rounded-sm hover-lift"
              >
                <span>JOIN OUR TEAM</span>
              </a>

              <Link
                href="/#mission"
                className="group px-5 py-3 border border-neutral-400 dark:border-neutral-800 hover:border-[#0A0A0A] dark:hover:border-neutral-500 bg-transparent text-[#262626] dark:text-[#D1D5DB] hover:text-[#0A0A0A] dark:hover:text-white transition-all flex items-center gap-2 min-h-[44px] rounded-sm hover-lift"
              >
                <span>THREE PILLARS</span>
              </Link>
            </div>
          </div>

          {/* S.H.E. Emblem Seal - Completely removed on mobile, displayed cleanly on desktop */}
          <div className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end py-4">
            <div className="relative group w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem]">

              {/* Outer Clean Box - Softly Rounded Rectangle with Thin Border */}
              <div className="w-full h-full border border-neutral-800 hover:border-[#E6192B]/60 bg-[#0E0E0E] p-4 sm:p-5 relative transition-all duration-300 group-hover:scale-[1.01] flex items-center justify-center rounded-sm">

                {/* Internal Ambient Radial Red Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,25,43,0.12)_0%,transparent_70%)] pointer-events-none rounded-sm" />

                {/* S.H.E. Lady Justice Emblem Image */}
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/logo-clean.png"
                    alt="Project S.H.E. Seal - Lady Justice"
                    fill
                    className="object-contain drop-shadow-[0_0_24px_rgba(230,25,43,0.3)]"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </div>
              </div>

              {/* Status Badge - Crisp Rectangle with Bare Minimum Soft Edges */}
              <div className="absolute -top-3 left-3 sm:left-4 bg-[#E6192B] text-white font-mono text-[10px] sm:text-xs font-bold uppercase px-2.5 py-1 border border-red-400/40 z-30 tracking-wider rounded-sm">
                SECTION 8 NGO
              </div>

              {/* RETAINED HERO ELEMENT: Red Warlock Electric Guitar */}
              <div className="hidden sm:block absolute -left-12 -bottom-16 w-32 h-64 sm:w-36 sm:h-72 -rotate-12 pointer-events-none select-none z-20 drop-shadow-[0_10px_25px_rgba(230,25,43,0.45)]">
                <Image
                  src="/assets/punk-warlock-guitar.png"
                  alt="Punk Electric Guitar"
                  fill
                  sizes="(max-width: 768px) 120px, 160px"
                  className="object-contain"
                />
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Pure Soft Red Marquee Ticker (Refined, minimal, zero pink) */}
      <div suppressHydrationWarning className="w-full mt-6 sm:mt-10 bg-[#800C16] border-y border-[#9C111F] text-[#FDFCF7] select-none overflow-hidden shrink-0 z-10 group/marquee">
        {/* Marquee Content Rail with Hover Pause */}
        <div suppressHydrationWarning className="py-2.5 sm:py-3 flex overflow-hidden group-hover/marquee:[&_.animate-marquee]:[animation-play-state:paused]">
          <div className="flex shrink-0 min-w-full items-center justify-around animate-marquee">
            {tickerItems}
          </div>
          <div className="flex shrink-0 min-w-full items-center justify-around animate-marquee" aria-hidden="true">
            {tickerItems}
          </div>
        </div>
      </div>

    </section>
  );
}



