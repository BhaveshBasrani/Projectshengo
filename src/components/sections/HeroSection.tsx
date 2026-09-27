'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import HalftoneFlow from '@/components/ui/HalftoneFlow';
import { MorphingText } from '@/components/ui/MorphingText';

interface HeroSectionProps {
  teamFormUrl: string;
}

export default function HeroSection({ teamFormUrl }: HeroSectionProps) {
  const tickerItems = (
    <div className="flex items-center space-x-6 sm:space-x-8 px-4 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#EDEDED] font-black whitespace-nowrap">
      <span className="text-[#E50914] drop-shadow-[1px_1px_0px_#000000]">[+] DISMANTLING GENDER-BASED VIOLENCE</span>
      <span>/</span>
      <span>EXTENDING SUPPORT TO SURVIVOR SAFE HOUSES</span>
      <span>/</span>
      <span className="text-[#E50914] drop-shadow-[1px_1px_0px_#000000]">[+] SAHODAYA WOMEN'S HELP HOME PARTNER</span>
      <span>/</span>
      <span>OVER ₹2,00,000 RAISED &amp; CONTRIBUTED</span>
      <span>/</span>
      <span className="text-[#E50914] drop-shadow-[1px_1px_0px_#000000]">[+] BATTLE OF THE BANDS (BOTB 1.0 &amp; 2.0)</span>
      <span>/</span>
      <span>50+ TEAM &amp; 100+ VOLUNTEERS</span>
      <span>/</span>
      <span className="text-[#E50914] drop-shadow-[1px_1px_0px_#000000]">[+] SARVA NIRBHAYA FOUNDATION (SEC. 8)</span>
      <span>/</span>
    </div>
  );

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-between pt-28 sm:pt-32 pb-0 overflow-hidden border-b-2 border-[#EDEDED] select-none bg-[#090909]">

      {/* Ambient Japanese Punk Posters Backdrop */}
      <div 
        className="absolute inset-0 z-0 opacity-15 mix-blend-screen pointer-events-none bg-cover bg-center filter grayscale-[30%] contrast-125"
        style={{ backgroundImage: `url('/assets/punk-bg-posters.png')` }}
      />

      {/* Atmospheric Halftone Stars Radial Vignette */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] z-0 opacity-20 pointer-events-none bg-contain bg-no-repeat [mask-image:radial-gradient(circle_at_top_right,black_30%,transparent_70%)]"
        style={{ backgroundImage: `url('/assets/punk-bg-stars.jpg')` }}
      />

      {/* Customized Punk Red Halftone Fluid Flow WebGL Canvas */}
      <HalftoneFlow
        className="z-0"
        opacity={0.28}
        speed={0.35}
        gridSize={6.5}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10 px-4 sm:px-6 md:px-8 mt-4 sm:my-auto py-4">

        {/* Top Status Badges */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
          <span className="punk-stamp text-[10px] sm:text-xs bg-[#E50914] text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_currentColor] tracking-widest font-black">
            HYDERABAD&apos;S LEADING STUDENT NGO
          </span>
          <span className="text-[10px] sm:text-xs text-neutral-400 font-mono font-bold tracking-wider">
            EST. APRIL 29, 2025 • HYDERABAD, INDIA
          </span>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Main Typography & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <h1 className="sr-only">
              Raise your voice where theirs was silenced. Stand with those who survived.
            </h1>

            {/* Morphing Headline with Natural Dynamic Spacer so it never overlaps */}
            <div className="relative w-full">
              {/* Invisible flow spacer holding natural height on any screen width */}
              <div
                className="invisible pointer-events-none select-none font-heading font-extrabold text-3xl sm:text-5xl lg:text-[3.5rem] tracking-tight leading-[1.14] pb-1 sm:pb-2"
                aria-hidden="true"
              >
                Raise your voice where theirs was silenced.
              </div>

              {/* Absolute active morphing container fitting exactly into the spacer */}
              <div className="absolute inset-0 top-0 left-0 w-full h-full">
                <MorphingText
                  texts={[
                    "Raise your voice where theirs was silenced.",
                    "Stand with those who survived.",
                  ]}
                  className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-[3.5rem] tracking-tight text-white leading-[1.14]"
                  cooldown={2.8}
                  morph={1.2}
                />
              </div>
            </div>

            <p className="font-sans text-sm sm:text-base md:text-lg text-neutral-300 max-w-xl leading-relaxed animate-fade-in-up delay-200 pt-2 sm:pt-4">
              Violence injects itself into the lives of survivors even after the incident itself has long passed, impacting their very ability to rebuild their lives. Project S.H.E., Hyderabad&apos;s leading student NGO, works to dismantle this systemic gender-based violence as well as extend support to survivor safe houses.
            </p>

            {/* Quick Action CTA Buttons with Pinned Punk Stickers */}
            <div className="relative pt-3 flex items-center gap-3 sm:gap-4 flex-wrap text-xs font-bold uppercase tracking-wider animate-fade-in-up delay-300">
              <a
                href={teamFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 py-3 bg-[#E50914] text-white hover:bg-white hover:text-black border-2 border-white shadow-[4px_4px_0px_0px_#E50914] hover:shadow-[2px_2px_0px_0px_#E50914] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2 min-h-[44px] hover-lift"
              >
                <span>JOIN OUR TEAM</span>
                <GrungeGlyph name="external" className="w-3.5 h-3.5 text-white group-hover:text-black transition-colors" />
              </a>

              <Link
                href="/#donate"
                className="group px-6 py-3 bg-[#111111] text-[#EDEDED] hover:bg-[#E50914] hover:text-white border-2 border-[#333333] hover:border-white shadow-[4px_4px_0px_0px_#222222] hover:shadow-[2px_2px_0px_0px_#E50914] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2 min-h-[44px] hover-lift"
              >
                <span>DONATE (UPI)</span>
                <GrungeGlyph name="heart" className="w-3.5 h-3.5 text-[#E50914] group-hover:text-white transition-colors" />
              </Link>

              <Link
                href="/#mission"
                className="group px-5 py-3 border-2 border-neutral-800 hover:border-[#E50914] hover:bg-[#150505] text-neutral-300 hover:text-white transition-all flex items-center gap-2 min-h-[44px] hover-lift"
              >
                <span>OUR STORY &amp; PILLARS</span>
                <GrungeGlyph name="arrow-down" className="w-3.5 h-3.5 text-[#E50914] group-hover:translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* S.H.E. Emblem Seal with Unclipped Brutalist Industrial Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end py-4">
            <div className="relative group w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem]">

              {/* Outer Unclipped Brutalist Box */}
              <div className="w-full h-full border-4 border-[#E50914] shadow-[10px_10px_0px_0px_#E50914] bg-[#0A0A0A] p-4 sm:p-5 relative transition-transform duration-200 group-hover:scale-[1.02] flex items-center justify-center">

                {/* Industrial Corner Marks */}
                <span className="absolute top-2 left-2 text-[10px] font-mono font-black text-[#E50914] select-none opacity-80">
                  +
                </span>
                <span className="absolute top-2 right-2 text-[10px] font-mono font-black text-[#E50914] select-none opacity-80">
                  +
                </span>
                <span className="absolute bottom-2 left-2 text-[10px] font-mono font-black text-[#E50914] select-none opacity-80">
                  +
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono font-black text-[#E50914] select-none opacity-80">
                  +
                </span>

                {/* Internal Ambient Radial Red Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.18)_0%,transparent_70%)] pointer-events-none" />

                {/* S.H.E. Lady Justice Emblem Image */}
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/logo-clean.png"
                    alt="Project S.H.E. Seal - Lady Justice"
                    fill
                    className="object-contain drop-shadow-[0_0_24px_rgba(229,9,20,0.45)]"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </div>
              </div>

              {/* Status Badges - Unclipped & Full Text */}
              <div className="absolute -top-3.5 left-3 sm:left-4 bg-[#E50914] text-white font-mono text-[10px] sm:text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000000] z-30 tracking-wider">
                EST. APRIL 2025
              </div>
              <div className="absolute -bottom-3.5 right-3 sm:right-4 bg-white text-black font-mono text-[10px] sm:text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#E50914] z-30 tracking-wider">
                100% NON-PROFIT
              </div>

              {/* Authentic Punk Rock Red Warlock Guitar Accent */}
              <div className="hidden sm:block absolute -left-12 -bottom-16 w-32 h-64 sm:w-36 sm:h-72 -rotate-12 pointer-events-none select-none z-20 drop-shadow-[0_10px_25px_rgba(229,9,20,0.5)]">
                <Image
                  src="/assets/punk-warlock-guitar.png"
                  alt="Punk Electric Guitar"
                  fill
                  sizes="(max-width: 768px) 120px, 160px"
                  className="object-contain"
                />
              </div>

              {/* Comic Starburst Action Badge */}
              <div className="absolute -top-10 -right-8 w-20 h-20 sm:w-24 sm:h-24 rotate-12 pointer-events-none select-none z-30 drop-shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                <Image
                  src="/assets/punk-starburst.png"
                  alt="Action Starburst"
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Full-Bleed Continuous Edge-to-Edge Marquee Ticker with Hazard Stripes - Reaches Page Borders on Any Device */}
      <div className="w-full mt-6 sm:mt-8 border-y-2 border-x-0 sm:border-y-4 border-[#E50914] bg-[#080808] select-none overflow-hidden shrink-0 z-10">
        {/* Top Hazard Rail */}
        <div className="w-full h-2 sm:h-2.5 bg-hazard-stripes" />

        {/* Marquee Content Rail */}
        <div className="py-2.5 sm:py-3.5 flex overflow-hidden">
          <div className="flex shrink-0 min-w-full items-center justify-around animate-marquee">
            {tickerItems}
          </div>
          <div className="flex shrink-0 min-w-full items-center justify-around animate-marquee" aria-hidden="true">
            {tickerItems}
          </div>
        </div>

        {/* Bottom Hazard Rail */}
        <div className="w-full h-2 sm:h-2.5 bg-hazard-stripes" />
      </div>

    </section>
  );
}



