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
      <span className="text-[#E50914] drop-shadow-[1px_1px_0px_#000000]">[+] COMBATING GENDER-BASED VIOLENCE</span>
      <span>/</span>
      <span>SHIFTING SOCIETAL MINDSETS</span>
      <span>/</span>
      <span className="text-[#E50914] drop-shadow-[1px_1px_0px_#000000]">[+] 100% COMMUNITY FUNDRAISING</span>
      <span>/</span>
      <span>SURVIVOR REHABILITATION</span>
      <span>/</span>
      <span className="text-[#E50914] drop-shadow-[1px_1px_0px_#000000]">[+] SAYODHYA WOMEN'S HELP HOME PARTNER</span>
      <span>/</span>
      <span>OVER ₹2,00,000 RAISED</span>
      <span>/</span>
      <span className="text-[#E50914] drop-shadow-[1px_1px_0px_#000000]">[+] 50+ CORE TEAM &amp; 100+ VOLUNTEERS</span>
      <span>/</span>
    </div>
  );

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-between pt-24 sm:pt-28 md:pt-24 pb-0 overflow-hidden border-b-2 border-[#EDEDED] select-none bg-[#090909]">
      
      {/* Customized Punk Red Halftone Fluid Flow WebGL Canvas */}
      <HalftoneFlow
        className="z-0"
        opacity={0.32}
        speed={0.35}
        gridSize={6.5}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10 px-4 sm:px-6 md:px-8 mt-4 sm:my-auto py-4">
        
        {/* Top Status Badges */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <span className="punk-stamp text-[10px] sm:text-xs bg-[#E50914] text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_currentColor] tracking-widest font-black">
            NON-PROFIT ORGANISATION
          </span>
          <span className="text-[10px] sm:text-xs text-neutral-400 font-mono font-bold tracking-wider">
            HYDERABAD, INDIA
          </span>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Typography & CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <h1 className="font-heading font-black text-[2.5rem] leading-[0.9] tracking-tight sm:text-5xl md:text-6xl lg:text-[5.25rem] lg:tracking-tighter lg:leading-[0.93] text-[#EDEDED] flex flex-col items-start">
              <span className="block drop-shadow-[2px_2px_0px_#E50914] sm:drop-shadow-[3px_3px_0px_#E50914] animate-fade-in-up">RESIST ABUSE.</span>
              <MorphingText
                texts={["RECLAIM POWER.", "DEMAND JUSTICE.", "DEFEND SURVIVORS."]}
                className="text-[#E50914] underline decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8 drop-shadow-[2px_2px_0px_#000000] sm:drop-shadow-[3px_3px_0px_#000000] h-10 sm:h-14 md:h-16 lg:h-[5.25rem] mt-2 sm:mt-4"
              />
            </h1>

            <p className="font-sans text-xs sm:text-sm md:text-base text-neutral-300 max-w-xl leading-relaxed animate-fade-in-up delay-200">
              Fighting gender-based violence and changing society's mindset. Project S.H.E. is a youth-led NGO that gives 100% of all raised funds directly to verified survivor safehouses.
            </p>

            {/* Quick Action CTA Buttons */}
            <div className="pt-2 flex items-center gap-3 sm:gap-4 flex-wrap font-mono text-xs font-black uppercase animate-fade-in-up delay-300">
              <a
                href={teamFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-5 sm:px-6 py-2.5 sm:py-3 bg-[#E50914] text-white hover:bg-white hover:text-black border-2 border-white shadow-[4px_4px_0px_0px_#E50914] hover:shadow-[2px_2px_0px_0px_#E50914] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 tracking-wider min-h-[44px] hover-lift glow-on-hover"
              >
                <span>JOIN OUR TEAM</span>
                <GrungeGlyph name="external" className="w-3.5 h-3.5 text-white group-hover:text-black transition-colors" />
              </a>

              <Link
                href="/#donate"
                className="group px-5 sm:px-6 py-2.5 sm:py-3 bg-[#111111] text-[#EDEDED] hover:bg-[#E50914] hover:text-white border-2 border-[#333333] hover:border-white shadow-[4px_4px_0px_0px_#222222] hover:shadow-[2px_2px_0px_0px_#E50914] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 tracking-wider min-h-[44px] hover-lift glow-on-hover"
              >
                <span>DONATE (QR CODE)</span>
                <GrungeGlyph name="heart" className="w-3.5 h-3.5 text-[#E50914] group-hover:text-white transition-colors" />
              </Link>

              <Link
                href="/#mission"
                className="group px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-[#222222] hover:border-[#E50914] hover:bg-[#E50914] text-neutral-300 hover:text-white transition-all tracking-wider flex items-center gap-1.5 min-h-[44px] hover-lift glow-on-hover"
              >
                <span>OUR STORY &amp; MISSION</span>
                <GrungeGlyph name="arrow-down" className="w-3.5 h-3.5 text-[#E50914] group-hover:text-white group-hover:translate-y-0.5 transition-all" />
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
                  />
                </div>
              </div>

              {/* Status Badges - Unclipped & Full Text */}
              <div className="absolute -top-3.5 left-3 sm:left-4 bg-[#E50914] text-white font-mono text-[10px] sm:text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000000] z-30 tracking-wider">
                EST. APRIL 2025
              </div>
              <div className="absolute -bottom-3.5 right-3 sm:right-4 bg-white text-black font-mono text-[10px] sm:text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#E50914] z-30 tracking-wider">
                100% NON-PROFIT
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



