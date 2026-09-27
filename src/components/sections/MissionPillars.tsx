'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GrungeGlyph from '@/components/ui/GrungeGlyph';

export default function MissionPillars() {
  return (
    <section id="mission" className="scroll-mt-28 sm:scroll-mt-36 pt-24 sm:pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto select-none">
      
      {/* Header */}
      <div className="mb-12 sm:mb-16 text-center sm:text-left space-y-3">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
          <span className="text-xs text-[#E50914] uppercase tracking-widest font-bold">
            HOW WE WORK
          </span>
          <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
        </div>
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-none">
          OUR THREE OPERATIONAL PILLARS
        </h2>
        <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
          Our organisation is based on three operational pillars: raising funds, providing direct support for survivors, and creating advocacy and dialogue.
        </p>
      </div>

      {/* Verified Real Highlights Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="p-5 sm:p-6 bg-[#0E0E0E] border border-neutral-800 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-[#E50914] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">FUNDS RAISED</span>
            <span className="text-sm font-bold text-[#E50914]">₹</span>
          </div>
          <span className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white block truncate">
            ₹2,00,000+
          </span>
          <span className="text-xs text-neutral-400 mt-1 block">
            Contributed to survivor care and rehabilitation
          </span>
        </div>

        <div className="p-5 sm:p-6 bg-[#0E0E0E] border border-neutral-800 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-[#E50914] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">DIRECT SUPPORT</span>
            <GrungeGlyph name="home" className="w-4 h-4" />
          </div>
          <span className="font-heading font-extrabold text-xl sm:text-2xl text-white block">
            Day-Care Centre
          </span>
          <span className="text-xs text-neutral-400 mt-1 block">
            With Sahodaya Women’s Help Home
          </span>
        </div>

        <div className="p-5 sm:p-6 bg-[#0E0E0E] border border-neutral-800 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-[#E50914] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">FLAGSHIP EVENTS</span>
            <GrungeGlyph name="bell" className="w-4 h-4" />
          </div>
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white block">
            BOTB 1.0 &amp; 2.0
          </span>
          <span className="text-xs text-neutral-400 mt-1 block">
            Battle of the Bands community fundraisers
          </span>
        </div>

        <div className="p-5 sm:p-6 bg-[#0E0E0E] border border-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.12)] transition-colors">
          <div className="flex items-center justify-between text-[#E50914] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">OFFICIAL STATUS</span>
            <GrungeGlyph name="shield" className="w-4 h-4" />
          </div>
          <span className="font-heading font-extrabold text-xl sm:text-2xl text-white block">
            Section 8 NGO
          </span>
          <span className="text-xs text-neutral-400 mt-1 block">
            Sarva Nirbhaya Foundation
          </span>
        </div>
      </div>

      {/* The Three Pillars Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Pillar 01: Fundraising */}
        <div className="lg:col-span-4 p-6 sm:p-8 bg-[#0E0E0E] border border-neutral-800 hover:border-[#E50914] flex flex-col justify-between transition-all relative group overflow-hidden stencil-cut">
          {/* Watermark */}
          <div className="absolute -right-2 -bottom-2 w-48 h-80 opacity-20 group-hover:opacity-35 group-hover:rotate-6 transition-all duration-300 pointer-events-none select-none">
            <Image
              src="/assets/punk-warlock-guitar.png"
              alt="Battle of the Bands Guitar"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="absolute top-2 right-4 font-heading font-black text-6xl text-neutral-800/20 select-none pointer-events-none group-hover:text-[#E50914]/20 transition-colors">
            01
          </div>

          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 border border-[#E50914] bg-black flex items-center justify-center text-[#E50914]">
              <GrungeGlyph name="heart" className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] text-[#E50914] uppercase tracking-widest font-bold block">
                PILLAR 1
              </span>
              <h3 className="font-heading font-extrabold text-xl uppercase tracking-tight text-white mt-0.5">
                FUNDRAISING
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              Whether through enigmatic events like the two editions of Battle of the Bands, or through wholesome bake sales and community fundraisers, Project S.H.E. has remained committed to mobilising community support through both monetary contributions and meaningful presence. Through these events and endeavours, we have raised and contributed more than Rs. 2,00,000 towards survivor care and rehabilitation.
            </p>

            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <div className="flex items-start gap-2 text-xs text-neutral-300">
                <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                <span>Battle of the Bands (BOTB 1.0 &amp; 2.0)</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-neutral-300">
                <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                <span>Bake sales and community fundraisers</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-neutral-300">
                <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                <span>Over Rs. 2,00,000 raised for survivor care</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-neutral-900 relative z-10">
            <Link
              href="/#external-forms"
              className="text-xs font-semibold text-neutral-400 group-hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <span>GET INVOLVED</span>
              <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5 text-[#E50914]" />
            </Link>
          </div>
        </div>

        {/* Pillar 02: Direct Support for Survivors */}
        <div className="lg:col-span-4 p-6 sm:p-8 bg-[#120707] border-2 border-[#E50914] shadow-[0_0_30px_rgba(229,9,20,0.15)] flex flex-col justify-between relative group overflow-hidden stencil-cut">
          {/* Watermark */}
          <div className="absolute -right-4 -bottom-4 w-56 h-56 opacity-20 pointer-events-none select-none group-hover:scale-105 transition-transform duration-500">
            <Image
              src="/assets/punk-red-spiral-star-clean.png"
              alt="Star"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="absolute top-2 right-4 font-heading font-black text-6xl text-[#E50914]/20 select-none pointer-events-none">
            02
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 border border-white bg-[#E50914] flex items-center justify-center text-white">
                <GrungeGlyph name="home" className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-0.5 bg-[#E50914] text-white text-[10px] font-bold uppercase tracking-wider">
                SAFE HOUSES &amp; CARE
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#E50914] uppercase tracking-widest font-bold block">
                PILLAR 2
              </span>
              <h3 className="font-heading font-extrabold text-xl uppercase tracking-tight text-white mt-0.5">
                DIRECT SUPPORT FOR SURVIVORS
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans font-medium">
              Our partnership with Sahodaya Women’s Help Home has contributed towards the establishment of a day-care centre for the children of domestic violence survivors—a nurturing space for them while their mothers work towards rebuilding their lives. More recently, funds raised through BOTB 2.0 were contributed to Sahodaya, Ammani Foundation, Snehalaya, and NIEPID, and helped support improvements in infrastructure and essential services across communities facing marginalisation.
            </p>

            <div className="pt-3 border-t border-red-950/60 space-y-2">
              <div className="flex items-start gap-2 text-xs text-neutral-200">
                <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                <span>Day-care centre for children of domestic violence survivors</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-neutral-200">
                <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                <span>Partnership with Sahodaya Women’s Help Home</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-neutral-200">
                <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                <span>Support to Sahodaya, Ammani, Snehalaya, and NIEPID</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-red-950/80 relative z-10">
            <Link
              href="/#donate"
              className="w-full py-3 bg-[#E50914] hover:bg-white text-white hover:text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>DONATE VIA UPI</span>
              <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Pillar 03: Advocacy and Dialogue */}
        <div className="lg:col-span-4 p-6 sm:p-8 bg-[#0E0E0E] border border-neutral-800 hover:border-[#E50914] flex flex-col justify-between transition-all relative group overflow-hidden stencil-cut">
          {/* Watermark */}
          <div className="absolute -right-3 -bottom-3 w-48 h-48 opacity-20 group-hover:opacity-35 transition-opacity duration-300 pointer-events-none select-none">
            <Image
              src="/assets/punk-megaphone-star.png"
              alt="Megaphone"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="absolute top-2 right-4 font-heading font-black text-6xl text-neutral-800/20 select-none pointer-events-none group-hover:text-[#E50914]/20 transition-colors">
            03
          </div>

          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 border border-[#E50914] bg-black flex items-center justify-center text-[#E50914]">
              <GrungeGlyph name="megaphone" className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] text-[#E50914] uppercase tracking-widest font-bold block">
                PILLAR 3
              </span>
              <h3 className="font-heading font-extrabold text-xl uppercase tracking-tight text-white mt-0.5">
                ADVOCACY AND DIALOGUE
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              Our dedicated team of writers and designers brings forward an expansive range of topics, from articles examining issues such as misogyny in the media to case posts that shed light on the violence faced by women and children. Our goal has always been to turn community support into tangible change—channelling that collective engagement towards advocacy and awareness-building.
            </p>

            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <div className="flex items-start gap-2 text-xs text-neutral-300">
                <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                <span>Dedicated team of writers and designers</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-neutral-300">
                <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                <span>Articles examining issues like media misogyny</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-neutral-300">
                <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                <span>Case posts shedding light on violence faced by women &amp; children</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-neutral-900 relative z-10">
            <Link
              href="/blog"
              className="text-xs font-semibold text-neutral-400 group-hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <span>READ ARTICLES</span>
              <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5 text-[#E50914]" />
            </Link>
          </div>
        </div>

      </div>

    </section>
  );
}
