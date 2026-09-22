'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GrungeGlyph from '@/components/ui/GrungeGlyph';

export default function MissionPillars() {
  return (
    <section id="mission" className="scroll-mt-32 py-20 px-4 sm:px-6 max-w-7xl mx-auto select-none font-mono">
      
      {/* SECTION 1: FOUNDER'S NOTE & ORIGIN STORY */}
      <div className="mb-20">
        
        {/* Header Badges */}
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="punk-stamp text-xs bg-[#E50914] text-white border-black">
            FOUNDING STORY
          </span>
          <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
            HYDERABAD • EST. APRIL 29, 2025
          </span>
        </div>

        {/* Founder's Note Card with Zine Masking Tape */}
        <div className="p-6 sm:p-10 bg-[#0E0E0E] border-2 border-[#E50914] shadow-[8px_8px_0px_0px_#E50914] relative stencil-cut overflow-hidden">
          {/* Authentic Zine Masking Tape on Corner */}
          <div className="zine-tape absolute -top-2.5 -left-4 w-28 -rotate-6 z-20" />
          <div className="zine-tape absolute -bottom-2.5 -right-4 w-28 rotate-3 z-20" />

          {/* Permitted Punk Tribal Lily Accent Watermark */}
          <div className="absolute -right-2 -bottom-4 w-48 h-72 opacity-20 pointer-events-none select-none rotate-12">
            <Image
              src="/assets/punk-lily-clean.png"
              alt="Punk Tribal Lily"
              fill
              className="object-contain object-right"
            />
          </div>

          <div className="flex items-start gap-4 sm:gap-6 relative z-10">
            <div className="relative shrink-0 hidden sm:block">
              <div className="p-3 bg-black border-2 border-[#E50914] text-[#E50914]">
                <GrungeGlyph name="quote" className="w-8 h-8" />
              </div>
              <div className="absolute -top-3 -right-3 w-7 h-7 animate-spin [animation-duration:14s] pointer-events-none">
                <Image
                  src="/assets/punk-red-spiral-star-clean.png"
                  alt="Punk Star"
                  fill
                  sizes="28px"
                  className="object-contain"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tight text-white block">
                  FOUNDER&apos;S NOTE
                </span>
              </div>

              <p className="font-sans text-sm sm:text-base md:text-lg text-neutral-200 leading-relaxed italic border-l-2 sm:border-l-0 pl-3 sm:pl-0 border-[#E50914]">
                &ldquo;Founded by Sanskriti Mohan on April 29, 2025, in Hyderabad. Project S.H.E. was born out of the anger and grief following the August 2024 RG Kar case. The catalyst wasn&apos;t just the atrocity itself, but the disturbing victim-blaming mindset that followed.&rdquo;
              </p>

              <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-white font-black tracking-wider uppercase">
                  — SANSKRITI MOHAN, FOUNDER &amp; LEAD DIRECTOR
                </div>
                <div className="text-neutral-500 font-bold">
                  PROJECT S.H.E. (SUPPORT • HELP • EMPOWER)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scale & Impact Metrics Grid - Gritty Raw Monospace Readout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-5 bg-[#0E0E0E] border-2 border-neutral-800 hover:border-[#E50914] shadow-[4px_4px_0px_0px_#000000] transition-colors relative">
            <div className="flex items-center justify-between text-[#E50914] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">CORE LEADERSHIP</span>
              <GrungeGlyph name="user" className="w-4 h-4" />
            </div>
            <span className="font-heading font-black text-3xl sm:text-4xl text-white block">
              50+
            </span>
            <span className="text-[11px] text-neutral-400 font-sans mt-1 block">
              Core team members driving operations
            </span>
          </div>

          <div className="p-5 bg-[#0E0E0E] border-2 border-neutral-800 hover:border-[#E50914] shadow-[4px_4px_0px_0px_#000000] transition-colors">
            <div className="flex items-center justify-between text-[#E50914] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">VOLUNTEER FORCE</span>
              <GrungeGlyph name="star" className="w-4 h-4" />
            </div>
            <span className="font-heading font-black text-3xl sm:text-4xl text-white block">
              100+
            </span>
            <span className="text-[11px] text-neutral-400 font-sans mt-1 block">
              Dedicated grassroots volunteers
            </span>
          </div>

          <div className="p-5 bg-[#0E0E0E] border-2 border-[#E50914] shadow-[4px_4px_0px_0px_#E50914] transition-colors relative overflow-hidden">
            <div className="flex items-center justify-between text-[#E50914] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">FUNDS MOBILIZED</span>
              <span className="font-mono text-sm font-black text-[#E50914]">₹</span>
            </div>
            <span className="font-heading font-black text-3xl sm:text-4xl text-white block">
              ₹2,00,000+
            </span>
            <span className="text-[11px] text-neutral-400 font-sans mt-1 block">
              Raised for survivor rehabilitation
            </span>
          </div>

          <div className="p-5 bg-[#0E0E0E] border-2 border-neutral-800 hover:border-[#E50914] shadow-[4px_4px_0px_0px_#000000] transition-colors">
            <div className="flex items-center justify-between text-[#E50914] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">EVENT TURNOUT</span>
              <GrungeGlyph name="bell" className="w-4 h-4" />
            </div>
            <span className="font-heading font-black text-3xl sm:text-4xl text-white block">
              600+
            </span>
            <span className="text-[11px] text-neutral-400 font-sans mt-1 block">
              Supporters at Battle of the Bands
            </span>
          </div>
        </div>

      </div>

      {/* SECTION 2: THE THREE OPERATIONAL PILLARS (Anti-slop Asymmetric layout) */}
      <div>
        {/* Header */}
        <div className="mb-12 text-center sm:text-left space-y-2">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
            <span className="font-mono text-xs text-[#E50914] uppercase tracking-widest font-black">
              OUR CORE FRAMEWORK
            </span>
            <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            THREE OPERATIONAL PILLARS
          </h2>
          <p className="font-sans text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
            Project S.H.E. turns awareness into action through youth-led events, funding safehouses, and changing mindsets.
          </p>
        </div>

        {/* Pillars Grid - Asymmetric Visual Hierarchy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Pillar 01: Community Fundraising (4 Cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-[#0E0E0E] text-[#F4F1EA] border-2 border-neutral-800 hover:border-[#E50914] shadow-[6px_6px_0px_0px_#000000] flex flex-col justify-between transition-all relative group overflow-hidden">
            {/* Permitted Red Electric Guitar Sticker Watermark */}
            <div className="absolute -right-2 -bottom-2 w-52 h-80 opacity-30 group-hover:opacity-50 group-hover:rotate-6 transition-all duration-300 pointer-events-none select-none">
              <Image
                src="/assets/punk-guitar-sticker-clean.png"
                alt="Punk Guitar"
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute top-2 right-4 font-heading font-black text-6xl text-neutral-800/30 select-none pointer-events-none group-hover:text-[#E50914]/20 transition-colors">
              01
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 border-2 border-[#E50914] bg-black flex items-center justify-center text-[#E50914]">
                <GrungeGlyph name="heart" className="w-6 h-6" />
              </div>

              <div>
                <span className="font-mono text-[10px] text-[#E50914] uppercase tracking-widest font-bold block">
                  GRASSROOTS MOBILIZATION
                </span>
                <h3 className="font-heading font-black text-xl uppercase tracking-tight text-white">
                  COMMUNITY FUNDRAISING
                </h3>
              </div>

              <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                Organizing youth events like bake sales and our 'Battle of the Bands' (which drew 600+ people) to raise money for survivors.
              </p>

              <div className="pt-3 border-t border-neutral-800 space-y-2">
                <div className="flex items-start gap-2 font-mono text-[11px] text-neutral-300">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>Flagship &ldquo;Battle of the Bands&rdquo; (600+ attendees)</span>
                </div>
                <div className="flex items-start gap-2 font-mono text-[11px] text-neutral-300">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>Youth-led bake sales &amp; campus initiatives</span>
                </div>
                <div className="flex items-start gap-2 font-mono text-[11px] text-neutral-300">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>Over ₹2,00,000 mobilized for survivor care</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-900 relative z-10">
              <Link
                href="/#external-forms"
                className="font-mono text-xs font-bold text-neutral-400 group-hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>JOIN OUR EFFORT</span>
                <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5 text-[#E50914]" />
              </Link>
            </div>
          </div>

          {/* Pillar 02: Direct Survivor Support (Dominant Featured Centerpiece - 4 Cols with special stamp) */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-[#120505] text-[#F4F1EA] border-2 border-[#E50914] shadow-[8px_8px_0px_0px_#E50914] flex flex-col justify-between relative group overflow-hidden stencil-cut">
            {/* Pinned Masking Tape */}
            <div className="zine-tape absolute -top-3 right-6 w-24 rotate-3 z-20" />

            {/* Permitted Red Spiral Star Watermark */}
            <div className="absolute -right-4 -bottom-4 w-56 h-56 opacity-25 pointer-events-none select-none group-hover:scale-105 transition-transform duration-500">
              <Image
                src="/assets/punk-red-spiral-star-clean.png"
                alt="Punk Spiral Star"
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute top-2 right-4 font-heading font-black text-6xl text-[#E50914]/20 select-none pointer-events-none">
              02
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 border-2 border-white bg-[#E50914] flex items-center justify-center text-white shadow-[2px_2px_0px_#000000]">
                  <GrungeGlyph name="home" className="w-6 h-6" />
                </div>
                <span className="px-2 py-0.5 bg-[#E50914] text-white font-mono text-[9px] font-black uppercase tracking-wider border border-black">
                  100% ROUTED
                </span>
              </div>

              <div>
                <span className="font-mono text-[10px] text-[#E50914] uppercase tracking-widest font-bold block">
                  SAFEHOUSE RELIEF • SAYODHYA PARTNER
                </span>
                <h3 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-tight text-white">
                  DIRECT SURVIVOR SUPPORT
                </h3>
              </div>

              <p className="font-sans text-xs text-neutral-200 leading-relaxed font-medium">
                Routing 100% of gathered funds directly to established safehouses, including the Sayodhya Women’s Help Home, providing immediate food, shelter, and trauma recovery.
              </p>

              <div className="pt-3 border-t border-red-950/60 space-y-2">
                <div className="flex items-start gap-2 font-mono text-[11px] text-neutral-200">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span><strong>100%</strong> of gathered funds routed to verified safehouses</span>
                </div>
                <div className="flex items-start gap-2 font-mono text-[11px] text-neutral-200">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>Direct partnership with Sayodhya Women’s Help Home</span>
                </div>
                <div className="flex items-start gap-2 font-mono text-[11px] text-neutral-200">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>Essential food, emergency shelter, and trauma recovery</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-red-950/80 relative z-10">
              <Link
                href="/#donate"
                className="w-full py-2.5 bg-[#E50914] hover:bg-white text-white hover:text-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-black shadow-[2px_2px_0px_#000000]"
              >
                <span>SUPPORT SURVIVORS DIRECTLY</span>
                <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 03: Mindset Shift (4 Cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-[#0E0E0E] text-[#F4F1EA] border-2 border-neutral-800 hover:border-[#E50914] shadow-[6px_6px_0px_0px_#000000] flex flex-col justify-between transition-all relative group overflow-hidden">
            {/* Permitted Hand-Drawn Polly Barbed Stars Watermark */}
            <div className="absolute -right-2 -bottom-2 w-52 h-64 opacity-25 group-hover:opacity-45 transition-opacity duration-300 pointer-events-none select-none">
              <Image
                src="/assets/punk-polly-stars-clean.png"
                alt="Polly Barbed Stars"
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute top-2 right-4 font-heading font-black text-6xl text-neutral-800/30 select-none pointer-events-none group-hover:text-[#E50914]/20 transition-colors">
              03
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 border-2 border-[#E50914] bg-black flex items-center justify-center text-[#E50914]">
                <GrungeGlyph name="megaphone" className="w-6 h-6" />
              </div>

              <div>
                <span className="font-mono text-[10px] text-[#E50914] uppercase tracking-widest font-bold block">
                  EDUCATION &amp; ADVOCACY
                </span>
                <h3 className="font-heading font-black text-xl uppercase tracking-tight text-white">
                  MINDSET SHIFT
                </h3>
              </div>

              <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                Challenging victim-blaming culture and educating the public to clear dangerous misconceptions surrounding sexual violence through open dialogues and awareness.
              </p>

              <div className="pt-3 border-t border-neutral-800 space-y-2">
                <div className="flex items-start gap-2 font-mono text-[11px] text-neutral-300">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>Dismantling toxic victim-blaming narratives</span>
                </div>
                <div className="flex items-start gap-2 font-mono text-[11px] text-neutral-300">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>Community awareness campaigns &amp; youth dialogues</span>
                </div>
                <div className="flex items-start gap-2 font-mono text-[11px] text-neutral-300">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>Clearing systemic misconceptions around gender violence</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-900 relative z-10">
              <Link
                href="/blog"
                className="font-mono text-xs font-bold text-neutral-400 group-hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>READ ADVOCACY BRIEFS</span>
                <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5 text-[#E50914]" />
              </Link>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
