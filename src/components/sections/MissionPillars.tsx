'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi2';
import { SiteSettings } from '@/lib/types';

export default function MissionPillars({ settings }: { settings?: SiteSettings } = {}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewAll, setViewAll] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 0,
      part: 'PART 01',
      title: 'HOW IT STARTED',
      subtitle: 'August 2024 • The RG Kar Case',
      badge: 'THE ORIGIN',
      render: () => (
        <div className="space-y-6 text-[#D1D5DB] font-sans text-sm sm:text-base md:text-lg leading-[1.8]">
          <p className="text-white text-base sm:text-xl font-bold">
            Hi, I’m <span className="text-[#E6192B]">Sanskriti Mohan</span>, the founder of Project S.H.E. We’re an NGO based in Hyderabad, India, and I want to share the story of how this organisation came to be.
          </p>
          <p>
            In August 2024, a case shook India. The RG Kar case involved the rape of a young doctor on campus during her 48-hour shift. This atrocity sparked nationwide outrage, causing thousands of people to talk about it online. What was most disturbing, though, wasn’t just the case itself, but the way people spoke about it, online as well as in interviews.
          </p>
        </div>
      ),
    },
    {
      id: 1,
      part: 'PART 02',
      title: 'THE STATEMENTS',
      subtitle: 'Street Interviews & Public Commentary',
      badge: 'PUBLIC REACTIONS',
      render: () => (
        <div className="space-y-5 font-sans leading-[1.75]">
          <p className="text-[#D1D5DB] text-sm sm:text-base md:text-lg">
            That pushed me to look deeper, into similar cases and street interviews, and these are some of the statements I came across:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {[
              '“Why was she out so late at night?”',
              '“She must have done something to deserve it.”',
              '“What was she wearing?”',
              '“Who allows their daughter to roam so freely?”',
              '“Both parties play a role in rape”',
              '“She should just lie down and enjoy it”',
            ].map((quote, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#080808] border border-[#222222] hover:border-[#E6192B]/50 transition-colors"
              >
                <p className="font-sans italic text-sm sm:text-base text-neutral-200 leading-snug">
                  {quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 2,
      part: 'PART 03',
      title: 'THE STATISTICS',
      subtitle: 'Realities Throughout India & Globally',
      badge: 'HORRIFYING REALITIES',
      render: () => (
        <div className="space-y-5 font-sans leading-[1.75]">
          <p className="text-[#D1D5DB] text-sm sm:text-base md:text-lg">
            It absolutely appalled me to see that, despite numerous claims of development, this mindset still prevails throughout India. I was unable to ignore this, and after doing some more research, I came across some more horrifying statistics:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            <div className="p-4 sm:p-5 bg-[#080808] border-l-2 border-[#E6192B] border-y border-r border-[#222222] space-y-2 flex flex-col justify-between">
              <div>
                <div className="font-heading font-black text-2xl sm:text-3xl text-white">87 / DAY</div>
                <p className="font-sans text-xs sm:text-sm text-[#D1D5DB] leading-relaxed pt-1">
                  87 rape cases occur daily throughout India
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block pt-2 border-t border-[#1C1C1C]">
                National Crime Records Bureau
              </span>
            </div>

            <div className="p-4 sm:p-5 bg-[#080808] border-l-2 border-[#E6192B] border-y border-r border-[#222222] space-y-2 flex flex-col justify-between">
              <div>
                <div className="font-heading font-black text-2xl sm:text-3xl text-white">370M+</div>
                <p className="font-sans text-xs sm:text-sm text-[#D1D5DB] leading-relaxed pt-1">
                  Over 370 million girls and women globally were raped or sexually assaulted before the age of 18.
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block pt-2 border-t border-[#1C1C1C]">
                UNICEF
              </span>
            </div>

            <div className="p-4 sm:p-5 bg-[#080808] border-l-2 border-[#E6192B] border-y border-r border-[#222222] space-y-2 flex flex-col justify-between">
              <div>
                <div className="font-heading font-black text-2xl sm:text-3xl text-white">840 MILLION</div>
                <p className="font-sans text-xs sm:text-sm text-[#D1D5DB] leading-relaxed pt-1">
                  840 million women have endured either partner violence or non-partner sexual violence in their lives; that’s nearly 1 in 3 women alive today.
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block pt-2 border-t border-[#1C1C1C]">
                Down To Earth
              </span>
            </div>

            <div className="p-4 sm:p-5 bg-[#080808] border-l-2 border-[#E6192B] border-y border-r border-[#222222] space-y-2 flex flex-col justify-between sm:col-span-1">
              <div>
                <div className="font-heading font-black text-2xl sm:text-3xl text-white">94.6% KNOWN</div>
                <p className="font-sans text-xs sm:text-sm text-[#D1D5DB] leading-relaxed pt-1">
                  Approximately 94.6% of reported rapes in India are committed by someone known to the victim: family members, friends, neighbours.
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block pt-2 border-t border-[#1C1C1C]">
                National Crime Records Bureau
              </span>
            </div>

            <div className="p-4 sm:p-5 bg-[#080808] border-l-2 border-[#E6192B] border-y border-r border-[#222222] space-y-2 flex flex-col justify-between sm:col-span-2 lg:col-span-2">
              <div>
                <div className="font-heading font-black text-2xl sm:text-3xl text-white">30,000+ ANNUALLY</div>
                <p className="font-sans text-xs sm:text-sm text-[#D1D5DB] leading-relaxed pt-1">
                  Rape in India has consistently stayed above 30,000 reported cases annually for over a decade, except during the pandemic drop.
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block pt-2 border-t border-[#1C1C1C]">
                National Crime Records Bureau
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      part: 'PART 04',
      title: 'STARTING PROJECT S.H.E.',
      subtitle: '29 April 2025 • How We Began',
      badge: 'OUR IMPACT',
      render: () => (
        <div className="space-y-5 text-[#D1D5DB] font-sans text-sm sm:text-base md:text-lg leading-[1.8]">
          <p>
            I decided it was time to address an issue that was occurring on such a large scale. I couldn’t just keep reading about these cases in the paper every day and turn the page as if nothing was happening. While some grow up internalising ideas that excuse or minimise violence, others are forced to live constantly aware of their vulnerability to it. Both are products of the same system.
          </p>
          <p>
            I started this organisation with a small team on 29 April 2025, and the impact we’ve made since then has been tremendous. We’re now a team of over 50 people, with 100 volunteers supporting us.
          </p>
          <p>
            We’ve done several major events, such as bake sales, and a unique fundraiser called Battle of the Bands, where 600 people came to support us and watch. We’ve raised over 2 lakhs in funds, and our funds are donated to organisations such as Sayodhya Women’s Help Home, a home for domestic violence survivors, with the rest stored for more such fundraisers. We’re committed to making change on a large scale, clearing up misconceptions surrounding rape and combating rape worldwide.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      part: 'PART 05',
      title: 'JOIN THE CHANGE',
      subtitle: 'How You Can Make An Impact',
      badge: 'CALL TO ACTION',
      render: () => (
        <div className="space-y-6 text-[#D1D5DB] font-sans text-sm sm:text-base md:text-lg leading-[1.8]">
          <p className="text-white font-bold text-base sm:text-xl">
            Join us on this journey and be part of this change. All you need to do is:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 sm:p-5 bg-[#080808] border border-[#222222] hover:border-[#E6192B]/50 transition-colors flex items-start gap-3.5">
              <span className="font-mono text-[#E6192B] font-bold text-sm shrink-0">01.</span>
              <p className="text-sm sm:text-base text-neutral-200">
                Share our page within your circle.
              </p>
            </div>
            <div className="p-4 sm:p-5 bg-[#080808] border border-[#222222] hover:border-[#E6192B]/50 transition-colors flex items-start gap-3.5">
              <span className="font-mono text-[#E6192B] font-bold text-sm shrink-0">02.</span>
              <p className="text-sm sm:text-base text-neutral-200">
                Donate to our organisation; the funds we gather go directly to supporting survivors.
              </p>
            </div>
            <div className="p-4 sm:p-5 bg-[#080808] border border-[#222222] hover:border-[#E6192B]/50 transition-colors flex items-start gap-3.5">
              <span className="font-mono text-[#E6192B] font-bold text-sm shrink-0">03.</span>
              <p className="text-sm sm:text-base text-neutral-200">
                Be mindful of the mindsets you fall into or see people having around you, and correct those who have misconceptions about rape.
              </p>
            </div>
            <div className="p-4 sm:p-5 bg-[#080808] border border-[#222222] hover:border-[#E6192B]/50 transition-colors flex items-start gap-3.5">
              <span className="font-mono text-[#E6192B] font-bold text-sm shrink-0">04.</span>
              <p className="text-sm sm:text-base text-neutral-200">
                Support other organisations that have the same goal as ours.
              </p>
            </div>
          </div>
          <p className="text-white font-bold text-base sm:text-xl pt-2">
            Together, we can make an impact. Thank you.
          </p>
        </div>
      ),
    },
  ];

  const goToSlide = (idx: number) => {
    if (idx === activeSlide || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide(idx);
      setIsTransitioning(false);
    }, 180);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 180);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 180);
  };

  return (
    <section id="mission" className="scroll-mt-28 sm:scroll-mt-36 pt-20 sm:pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto select-none">

      {/* SECTION 1: FOUNDER'S NOTE & ORIGIN STORY */}
      <div className="mb-20">

        {/* Top Badges & View Switcher */}
        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 bg-[#E6192B] text-white text-[11px] font-mono font-bold uppercase tracking-wider rounded-sm">
              FOUNDING STORY
            </span>
            <span className="text-xs text-[#555555] font-mono tracking-wide">
              HYDERABAD, INDIA • EST. 29 APRIL 2025
            </span>
          </div>

          <button
            type="button"
            onClick={() => setViewAll(!viewAll)}
            className="text-xs font-mono font-bold text-[#D1D5DB] hover:text-white px-3.5 py-1.5 bg-[#121212] border border-[#222222] hover:border-neutral-500 transition-all rounded-sm inline-flex items-center gap-1.5 group"
          >
            {viewAll ? (
              <>
                <HiArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
                <span>View Slide Deck</span>
              </>
            ) : (
              <>
                <span>Read Full Essay</span>
                <HiArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>

        {/* Founder's Story - Editorial Minimalist Container */}
        <div className="founders-note-card bg-[#090909] border border-[#222222] p-6 sm:p-10 md:p-14 space-y-8 rounded-sm">
          {/* Header Title Area */}
          <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
            <h2 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-[#0A0A0A] dark:text-white uppercase tracking-tight leading-none">
              FOUNDER&apos;S NOTE
            </h2>
            {!viewAll && (
              <span className="font-mono text-xs text-neutral-500 dark:text-[#555555] uppercase tracking-wider">
                {slides[activeSlide].subtitle}
              </span>
            )}
          </div>

          {/* High-End Editorial Navigation Tabs */}
          {!viewAll && (
            <div className="flex items-center gap-6 sm:gap-10 border-b border-neutral-300 dark:border-[#222222] pb-px overflow-x-auto scrollbar-none pt-2">
              {slides.map((s, idx) => {
                const isActive = activeSlide === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`py-3 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap relative text-left ${
                      isActive
                        ? 'text-[#0A0A0A] dark:text-white font-bold border-b-2 border-[#E6192B]'
                        : 'text-neutral-500 dark:text-[#666666] hover:text-[#0A0A0A] dark:hover:text-white font-medium border-b-2 border-transparent'
                    }`}
                  >
                    <span className="mr-2 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">0{idx + 1}</span>
                    {s.title}
                  </button>
                );
              })}
            </div>
          )}

          {/* Minimal Slide Content with Fluid Fade Transition */}
          {viewAll ? (
            <div className="space-y-10 pt-2">
              {slides.map((s, idx) => (
                <div key={s.id} className="space-y-4 border-b border-[#222222] pb-8 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[#E6192B] font-mono font-bold text-xs">0{idx + 1} //</span>
                    <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider">{s.title}</h3>
                  </div>
                  {s.render()}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`transition-all duration-200 ease-out min-h-[220px] ${
                isTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
              }`}
            >
              {slides[activeSlide].render()}
            </div>
          )}

          {/* Minimal Footer: Attribution + Prev / Next Controls */}
          <div className="pt-6 border-t border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="text-white font-bold tracking-wide uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#E6192B] inline-block" />
              <span>Sanskriti Mohan, the founder of Project S.H.E.</span>
            </div>

            {!viewAll && (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={prevSlide}
                  disabled={isTransitioning}
                  className="px-3.5 py-1.5 text-xs font-mono text-[#D1D5DB] hover:text-white bg-[#121212] hover:bg-[#1C1C1C] border border-[#262626] transition-all rounded-sm disabled:opacity-50 inline-flex items-center gap-1.5 group"
                >
                  <HiArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
                  <span>PREV</span>
                </button>
                <span className="text-xs font-mono text-[#555555] tracking-widest">
                  0{activeSlide + 1} / 0{slides.length}
                </span>
                <button
                  type="button"
                  onClick={nextSlide}
                  disabled={isTransitioning}
                  className="px-3.5 py-1.5 text-xs font-mono text-white bg-[#E6192B] hover:bg-[#ff1e32] transition-all rounded-sm disabled:opacity-50 inline-flex items-center gap-1.5 group"
                >
                  <span>NEXT</span>
                  <HiArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scale & Impact Metrics Grid - 4-Column Clean Impact Ticker with Soft Corners */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-6 bg-[#0E0E0E] border border-neutral-800/80 hover:border-neutral-700 transition-all rounded-sm">
            <span className="font-mono text-[10px] font-bold text-[#E6192B] uppercase tracking-wider block mb-2">
              CORE TEAM
            </span>
            <span className="font-heading font-bold text-3xl sm:text-4xl text-white block">
              50+
            </span>
            <span className="text-xs text-[#D1D5DB] mt-1 block">
              Dedicated members driving our mission
            </span>
          </div>

          <div className="p-6 bg-[#0E0E0E] border border-neutral-800/80 hover:border-neutral-700 transition-all rounded-sm">
            <span className="font-mono text-[10px] font-bold text-[#E6192B] uppercase tracking-wider block mb-2">
              VOLUNTEER FORCE
            </span>
            <span className="font-heading font-bold text-3xl sm:text-4xl text-white block">
              100+
            </span>
            <span className="text-xs text-[#D1D5DB] mt-1 block">
              Grassroots volunteers actively supporting
            </span>
          </div>

          <div className="p-6 bg-[#120808] border border-[#E6192B]/50 transition-all rounded-sm">
            <span className="font-mono text-[10px] font-bold text-[#E6192B] uppercase tracking-wider block mb-2">
              FUNDS MOBILIZED
            </span>
            <span className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-white block truncate">
              ₹1,00,000+
            </span>
            <span className="text-xs text-[#D1D5DB] mt-1 block">
              Contributed towards survivor care
            </span>
          </div>

          <div className="p-6 bg-[#0E0E0E] border border-neutral-800/80 hover:border-neutral-700 transition-all rounded-sm">
            <span className="font-mono text-[10px] font-bold text-[#E6192B] uppercase tracking-wider block mb-2">
              FLAGSHIP INITIATIVES
            </span>
            <span className="font-heading font-bold text-3xl sm:text-4xl text-white block">
              2 Editions
            </span>
            <span className="text-xs text-[#D1D5DB] mt-1 block">
              Battle of the Bands (BOTB 1.0 &amp; 2.0)
            </span>
          </div>
        </div>

      </div>

      {/* SECTION 2: THE THREE OPERATIONAL PILLARS (Clean, Non-repetitive copy) */}
      <div>
        {/* Header */}
        <div className="mb-12 text-center sm:text-left space-y-2">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="font-mono text-xs text-[#E6192B] uppercase tracking-widest font-bold">
              // OUR CORE FRAMEWORK
            </span>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-none">
            OUR THREE OPERATIONAL PILLARS
          </h2>
          <p className="text-sm sm:text-base text-[#D1D5DB] max-w-2xl leading-relaxed">
            Our organisation is based on three operational pillars: fundraising, direct support for survivors, and advocacy and dialogue.
          </p>
        </div>

        {/* Pillars Grid - Soft Rounded-md Cards with Proper Thin Borders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Pillar 01: Fundraising (4 Cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-[#0E0E0E] border border-[#333333] hover:border-[#E6192B]/50 flex flex-col justify-between transition-all relative group overflow-hidden rounded-sm">
            {/* Faint Typographic Watermark Tucked in Bottom Right */}
            <div className="watermark-outline absolute right-4 bottom-2 text-8xl sm:text-9xl pointer-events-none select-none font-space font-bold opacity-15 group-hover:opacity-25 transition-opacity leading-none">
              01
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#E6192B] uppercase tracking-widest font-bold block">
                  PILLAR 01 // MOBILISATION
                </span>
                <span className="px-2 py-0.5 border border-[#333333] text-[#A3A3A3] text-[9px] font-mono font-bold uppercase tracking-wider rounded-sm">
                  COMMUNITY CARE
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-tight text-white leading-snug">
                {settings?.pillar_1_title || '1. Fundraising'}
              </h3>

              <p className="font-sans text-sm sm:text-[15px] text-[#A3A3A3] leading-[1.75] font-normal">
                {settings?.pillar_1_desc || 'Whether through enigmatic events like the two editions of Battle of the Bands, or through wholesome bake sales and community fundraisers, Project S.H.E. has remained committed to mobilising community support through both monetary contributions and meaningful presence. Through these events and endeavours, we have raised and contributed more than Rs. 1,00,000 towards survivor care and rehabilitation.'}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#262626] relative z-10">
              <Link
                href="/#external-forms"
                className="text-xs font-mono font-bold text-[#D1D5DB] group-hover:text-white flex items-center gap-2 transition-colors uppercase tracking-wider"
              >
                <span>JOIN OUR EFFORT</span>
                <HiArrowRight className="w-3.5 h-3.5 text-[#E6192B] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 02: Direct Support for Survivors (4 Cols) - Active/Hero Card */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-[#120808] border border-[#333333] hover:border-[#E6192B]/60 flex flex-col justify-between relative group overflow-hidden rounded-sm transition-all">
            {/* Faint Typographic Watermark Tucked in Bottom Right */}
            <div className="watermark-outline-red absolute right-4 bottom-2 text-8xl sm:text-9xl pointer-events-none select-none font-space font-bold opacity-20 group-hover:opacity-30 transition-opacity leading-none">
              02
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#E6192B] uppercase tracking-widest font-bold block">
                  PILLAR 02 // SURVIVOR CARE
                </span>
                <span className="px-2 py-0.5 bg-[#E6192B] text-white text-[9px] font-mono font-bold uppercase tracking-wider rounded-sm">
                  DIRECT SHELTERS
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-tight text-white leading-snug">
                {settings?.pillar_2_title || '2. Direct support for survivors.'}
              </h3>

              <p className="font-sans text-sm sm:text-[15px] text-[#A3A3A3] leading-[1.75] font-normal">
                {settings?.pillar_2_desc || 'Our partnership with Sahodaya Women\'s Help Home has contributed towards the establishment of a day-care centre for the children of domestic violence survivors-a nurturing space for them while their mothers work towards rebuilding their lives. More recently, funds raised through BOTB 2.0 were contributed to Sahodaya, Ammani Foundation, Snehalaya, and NIEPID, and helped support improvements in infrastructure and essential services across communities facing marginalisation.'}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-red-950/60 relative z-10">
              <Link
                href="/#donate"
                className="w-full py-3 bg-[#E6192B] hover:bg-white text-white hover:text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-sm border border-red-500/30 group/p2"
              >
                <span>SUPPORT SURVIVORS DIRECTLY</span>
                <HiArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover/p2:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 03: Advocacy and Dialogue (4 Cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-[#0E0E0E] border border-[#333333] hover:border-[#E6192B]/50 flex flex-col justify-between transition-all relative group overflow-hidden rounded-sm">
            {/* Faint Typographic Watermark Tucked in Bottom Right */}
            <div className="watermark-outline absolute right-4 bottom-2 text-8xl sm:text-9xl pointer-events-none select-none font-space font-bold opacity-15 group-hover:opacity-25 transition-opacity leading-none">
              03
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#E6192B] uppercase tracking-widest font-bold block">
                  PILLAR 03 // DIALOGUE &amp; EDUCATION
                </span>
                <span className="px-2 py-0.5 border border-[#333333] text-[#A3A3A3] text-[9px] font-mono font-bold uppercase tracking-wider rounded-sm">
                  ADVOCACY
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-tight text-white leading-snug">
                {settings?.pillar_3_title || '3. Advocacy and dialogue.'}
              </h3>

              <p className="font-sans text-sm sm:text-[15px] text-[#A3A3A3] leading-[1.75] font-normal">
                {settings?.pillar_3_desc || 'Our dedicated team of writers and designers brings forward an expansive range of topics, from articles examining issues such as misogyny in the media to case posts that shed light on the violence faced by women and children. Our goal has always been to turn community support into tangible change- channelling that collective engagement towards advocacy and awareness-building.'}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#262626] relative z-10">
              <Link
                href="/blog"
                className="text-xs font-mono font-bold text-[#D1D5DB] group-hover:text-white flex items-center gap-2 transition-colors uppercase tracking-wider"
              >
                <span>READ ADVOCACY JOURNAL</span>
                <HiArrowRight className="w-3.5 h-3.5 text-[#E6192B] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
