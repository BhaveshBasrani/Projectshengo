'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import BrushCensor from '@/components/ui/BrushCensor';

export default function MissionPillars() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewAll, setViewAll] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 6500; // 6.5 seconds per slide
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      id: 0,
      part: 'PART 01',
      title: 'HOW IT STARTED',
      subtitle: 'August 2024 • The RG Kar Case',
      badge: 'THE STORY',
      render: () => (
        <div className="space-y-4 text-neutral-200 font-sans text-sm sm:text-base md:text-lg leading-relaxed animate-fade-in-up">
          <p className="text-white text-base sm:text-lg font-semibold">
            Hi, I’m <span className="text-[#E50914] font-bold">Sanskriti Mohan</span>, the founder of Project S.H.E. We’re an NGO based in Hyderabad, India, and I want to share the story of how this organisation came to be.
          </p>
          <p className="text-neutral-300">
            In August 2024, a case shook India. <strong className="text-white font-bold">The RG Kar case</strong> involved the{' '}
            <BrushCensor tilt={-1}>rape</BrushCensor> of a young doctor on campus during her 48-hour shift. This atrocity sparked nationwide outrage, causing thousands of people to talk about it online.
          </p>
          <p className="text-neutral-300">
            The story was horrifying, and I was completely overcome by anger, grief and horror. What disturbed me the most, though, wasn’t just the case itself, but the way people spoke about it, online as well as in interviews.
          </p>
        </div>
      ),
    },
    {
      id: 1,
      part: 'PART 02',
      title: 'THE STATEMENTS',
      subtitle: 'Street Interviews & Public Reactions',
      badge: 'REACTIONS',
      render: () => (
        <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed animate-fade-in-up">
          <p className="text-neutral-300 text-sm sm:text-base font-medium">
            That pushed me to look deeper, into similar cases and street interviews, and these are some of the statements I came across:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              { text: 'Why was she out so late at night?', censor: null },
              { text: 'She must have done something to deserve it.', censor: null },
              { text: 'What was she wearing?', censor: null },
              { text: 'Who allows their daughter to roam so freely?', censor: null },
              {
                custom: (
                  <>
                    &ldquo;Both parties play a role in <BrushCensor tilt={1}>rape</BrushCensor>&rdquo;
                  </>
                ),
              },
              { text: 'She should just lie down and enjoy it', censor: null },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#121212] border border-neutral-800 hover:border-[#E50914] text-neutral-200 flex items-start gap-3 transition-colors shadow-sm"
              >
                <GrungeGlyph name="star" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                <span className="italic font-medium text-xs sm:text-sm text-neutral-100">
                  {item.custom ? item.custom : `“${item.text}”`}
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 2,
      part: 'PART 03',
      title: 'THE FACTS & NUMBERS',
      subtitle: 'Realities Women Face Every Day',
      badge: 'THE FACTS',
      render: () => (
        <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed animate-fade-in-up">
          <p className="text-neutral-300">
            It absolutely appalled me to see that, despite numerous claims of development, <strong className="text-white">this mindset still prevails throughout India</strong>. I was unable to ignore this, and after doing some more research, I came across some more horrifying statistics:
          </p>
          <div className="space-y-2.5 pt-1 text-xs sm:text-sm">
            <div className="p-3 bg-[#140808] border-l-4 border-[#E50914] border-y border-r border-neutral-800 flex items-start gap-3">
              <GrungeGlyph name="star" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-heading text-sm sm:text-base tracking-tight">
                  87 <BrushCensor tilt={-1}>rape</BrushCensor> cases occur daily throughout India
                </strong>
                <span className="text-neutral-400 text-xs">
                  National Crime Records Bureau (NCRB)
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#140808] border-l-4 border-[#E50914] border-y border-r border-neutral-800 flex items-start gap-3">
              <GrungeGlyph name="star" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-heading text-sm sm:text-base tracking-tight">
                  Over 370 million girls and women globally were <BrushCensor tilt={1}>raped</BrushCensor> or{' '}
                  <BrushCensor tilt={-0.5}>sexually assaulted</BrushCensor> before the age of 18
                </strong>
                <span className="text-neutral-400 text-xs">UNICEF</span>
              </div>
            </div>

            <div className="p-3 bg-[#140808] border-l-4 border-[#E50914] border-y border-r border-neutral-800 flex items-start gap-3">
              <GrungeGlyph name="star" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-heading text-sm sm:text-base tracking-tight">
                  840 million women have endured either partner violence or non-partner{' '}
                  <BrushCensor tilt={1}>sexual violence</BrushCensor> in their lives
                </strong>
                <span className="text-neutral-400 text-xs">That’s nearly 1 in 3 women alive today (Down To Earth)</span>
              </div>
            </div>

            <div className="p-3 bg-[#140808] border-l-4 border-[#E50914] border-y border-r border-neutral-800 flex items-start gap-3">
              <GrungeGlyph name="star" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-heading text-sm sm:text-base tracking-tight">
                  Approximately 94.6% of reported <BrushCensor tilt={-1}>rapes</BrushCensor> in India are committed by someone known to the victim
                </strong>
                <span className="text-neutral-400 text-xs">Family members, friends, neighbours (National Crime Records Bureau)</span>
              </div>
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
      badge: 'OUR START',
      render: () => (
        <div className="space-y-4 text-neutral-200 font-sans text-sm sm:text-base md:text-lg leading-relaxed animate-fade-in-up">
          <p className="text-neutral-300">
            I decided it was time to address an issue that was occurring on such a large scale. I couldn’t just keep reading about these cases in the paper every day and turn the page as if nothing was happening.
          </p>
          <div className="p-4 sm:p-5 bg-[#140909] border-l-4 border-[#E50914] border-y border-r border-neutral-800 text-white font-medium text-sm sm:text-base leading-relaxed">
            &ldquo;While some grow up internalising ideas that excuse or minimise <BrushCensor tilt={1}>violence</BrushCensor>, others are forced to live constantly aware of their vulnerability to it. Both are products of the same system.&rdquo;
          </div>
          <p className="text-white font-semibold pt-1">
            I started this organisation with a small team on <strong className="text-[#E50914] font-bold">29 April 2025</strong>, and the impact we’ve made since then has been tremendous. We’re now a team of <strong className="text-white">over 50 people</strong>, with <strong className="text-white">100 volunteers</strong> supporting us.
          </p>
        </div>
      ),
    },
  ];

  // Auto-slide loop and progress bar
  useEffect(() => {
    if (viewAll || !isPlaying || isHovered) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const intervalTime = 50; // update progress every 50ms
    const step = (intervalTime / SLIDE_DURATION) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveSlide((s) => (s + 1) % slides.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [viewAll, isPlaying, isHovered, slides.length]);

  const goToSlide = (idx: number) => {
    setActiveSlide(idx);
    setProgress(0);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  return (
    <section id="mission" className="scroll-mt-28 sm:scroll-mt-36 pt-24 sm:pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto select-none">

      {/* SECTION 1: FOUNDER'S NOTE & ORIGIN STORY */}
      <div className="mb-20">

        {/* Header Badges & View Switcher */}
        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 bg-[#E50914] text-white text-[11px] font-bold uppercase tracking-wider">
              FOUNDING STORY
            </span>
            <span className="text-xs text-neutral-400 font-semibold tracking-wide">
              HYDERABAD, INDIA • EST. 29 APRIL 2025
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewAll(!viewAll)}
              className="text-xs font-semibold text-neutral-300 hover:text-white px-3 py-1.5 bg-[#141414] border border-neutral-800 hover:border-neutral-600 transition-all flex items-center gap-1.5"
            >
              {viewAll ? '← View Slide Deck' : 'Read All 4 Chapters →'}
            </button>
          </div>
        </div>

        {/* Founder's Story Interactive Card */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative bg-[#0C0C0C] border border-neutral-800 hover:border-neutral-700 transition-all shadow-[0_0_50px_rgba(229,9,20,0.08)] overflow-hidden"
        >
          {/* Ambient Abstract Expressionist Paint Canvas Texture */}
          <div 
            className="absolute inset-0 z-0 opacity-12 mix-blend-color-dodge pointer-events-none bg-cover bg-center"
            style={{ backgroundImage: `url('/assets/punk-bg-abstract.jpg')` }}
          />

          {/* Top Auto-Progress Bar (active during slide mode) */}
          {!viewAll && (
            <div className="w-full h-1 bg-neutral-900 relative overflow-hidden z-10">
              <div
                className="h-full bg-gradient-to-r from-[#E50914] to-red-500 transition-[width] ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Permitted Punk Watermark Accent */}
          <div className="absolute -right-4 -bottom-6 w-52 h-72 opacity-15 pointer-events-none select-none rotate-12 z-0">
            <Image
              src="/assets/punk-lily-clean.png"
              alt="Project S.H.E."
              fill
              className="object-contain object-right"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>



          {/* Authentic Red Barbed Wire Vertical Accent */}
          <div className="hidden md:block absolute -right-3 top-8 w-8 h-80 opacity-60 pointer-events-none select-none z-20">
            <Image
              src="/assets/punk-barbed-wire.png"
              alt="Barbed Wire Strand"
              fill
              className="object-contain"
              sizes="32px"
            />
          </div>

          <div className="p-6 sm:p-10 relative z-10 space-y-6">

            {/* Header: Title + Slide Nav Pills */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    Founder&apos;s Note
                  </span>
                </div>
              </div>

              {/* Slide controls & play/pause toggle */}
              {!viewAll && (
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                    className="px-2.5 py-1.5 bg-[#161616] hover:bg-[#222222] border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors font-mono flex items-center gap-1.5"
                    title={isPlaying ? 'Pause auto-advance' : 'Resume auto-advance'}
                  >
                    {isPlaying ? (
                      <>
                        <GrungeGlyph name="pause" className="w-2.5 h-2.5" />
                        <span>PAUSE</span>
                      </>
                    ) : (
                      <>
                        <GrungeGlyph name="play" className="w-2.5 h-2.5" />
                        <span>AUTO</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                    className="p-2 bg-[#161616] hover:bg-[#222222] border border-neutral-800 hover:border-[#E50914] text-white transition-colors"
                  >
                    <GrungeGlyph name="arrow-left" className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-xs font-mono font-bold px-2.5 py-1.5 bg-[#161616] border border-neutral-800 text-neutral-200">
                    0{activeSlide + 1} / 0{slides.length}
                  </span>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next Slide"
                    className="p-2 bg-[#161616] hover:bg-[#222222] border border-neutral-800 hover:border-[#E50914] text-white transition-colors"
                  >
                    <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Chapter Step Selectors */}
            {!viewAll && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`p-3 text-left transition-all border ${activeSlide === idx
                        ? 'bg-[#180909] border-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.2)]'
                        : 'bg-[#111111] border-neutral-800/80 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1">
                      <span className={activeSlide === idx ? 'text-[#E50914] font-bold' : 'text-neutral-500'}>
                        {s.part}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-black/60 text-neutral-400">
                        {s.badge}
                      </span>
                    </div>
                    <div className="font-heading font-bold text-xs sm:text-sm text-neutral-100 truncate">
                      {s.title}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Story Reader Content Area */}
            {viewAll ? (
              /* All 4 Parts Stacked for Readability */
              <div className="space-y-8 pt-2">
                {slides.map((s) => (
                  <div key={s.id} className="p-6 bg-[#111111] border border-neutral-800 space-y-3 relative">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#E50914] text-white text-[10px] font-bold uppercase tracking-wider">
                        {s.part}
                      </span>
                      <span className="text-xs font-semibold text-neutral-300">
                        {s.subtitle}
                      </span>
                    </div>
                    {s.render()}
                  </div>
                ))}
              </div>
            ) : (
              /* Single Animated Slide View with Keyframe Transition */
              <div
                key={activeSlide}
                className="p-5 sm:p-7 bg-[#101010] border border-neutral-800/80 min-h-[220px] flex flex-col justify-between space-y-5 animate-fade-in-up"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-[#E50914] text-white text-[10px] font-bold uppercase tracking-wider">
                      {slides[activeSlide].part} • {slides[activeSlide].title}
                    </span>
                    <span className="text-xs font-medium text-neutral-400">
                      {slides[activeSlide].subtitle}
                    </span>
                    {isHovered && isPlaying && (
                      <span className="ml-auto text-[10px] font-mono text-neutral-500">
                        (Paused on hover)
                      </span>
                    )}
                  </div>

                  {slides[activeSlide].render()}
                </div>

                {/* Footer Controls inside card */}
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="text-neutral-400 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <GrungeGlyph name="arrow-left" className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => goToSlide(i)}
                        className={`h-1.5 transition-all rounded-full ${activeSlide === i ? 'w-6 bg-[#E50914]' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                          }`}
                        aria-label={`Jump to slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={nextSlide}
                    className="text-neutral-400 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <span>Next</span>
                    <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5 text-[#E50914]" />
                  </button>
                </div>
              </div>
            )}

            {/* Author Attribution Footer */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="text-white font-bold tracking-wide uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-[#E50914] inline-block" />
                <span>— Sanskriti Mohan, Founder &amp; Lead Director</span>
              </div>
              <div className="text-neutral-400 font-medium">
                Project S.H.E. (Support • Help • Empower) • Hyderabad, India
              </div>
            </div>

          </div>
        </div>

        {/* Scale & Impact Metrics Grid - Sleek, Human & Impactful */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-6 bg-[#0E0E0E] border border-neutral-800 hover:border-neutral-700 transition-colors relative overflow-hidden">
            <div className="flex items-center justify-between text-[#E50914] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">CORE TEAM</span>
              <GrungeGlyph name="user" className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white block">
              50+
            </span>
            <span className="text-xs text-neutral-400 mt-1 block">
              Dedicated members driving our mission
            </span>
          </div>

          <div className="p-6 bg-[#0E0E0E] border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between text-[#E50914] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">VOLUNTEER FORCE</span>
              <GrungeGlyph name="star" className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white block">
              100+
            </span>
            <span className="text-xs text-neutral-400 mt-1 block">
              Grassroots volunteers actively supporting
            </span>
          </div>

          <div className="p-6 bg-[#0E0E0E] border border-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.15)] transition-colors">
            <div className="flex items-center justify-between text-[#E50914] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">FUNDS MOBILIZED</span>
              <span className="text-sm font-bold text-[#E50914]">₹</span>
            </div>
            <span className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white block truncate">
              ₹2,00,000+
            </span>
            <span className="text-xs text-neutral-400 mt-1 block">
              Contributed towards survivor care
            </span>
          </div>

          <div className="p-6 bg-[#0E0E0E] border border-neutral-800 hover:border-neutral-700 transition-colors relative">
            <div className="flex items-center justify-between text-[#E50914] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">FLAGSHIP INITIATIVES</span>
              <GrungeGlyph name="bell" className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white block">
              2 Editions
            </span>
            <span className="text-xs text-neutral-400 mt-1 block">
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
            <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
            <span className="text-xs text-[#E50914] uppercase tracking-widest font-bold">
              OUR CORE FRAMEWORK
            </span>
            <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-none">
            OUR THREE OPERATIONAL PILLARS
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
            Our organisation is based on three operational pillars: fundraising, direct support for survivors, and advocacy and dialogue.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Pillar 01: Fundraising (4 Cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-[#0E0E0E] border border-neutral-800 hover:border-[#E50914] flex flex-col justify-between transition-all relative group overflow-hidden">
            {/* Battle of the Bands Headphones & Stars Watermark */}
            <div className="absolute -right-3 -bottom-3 w-48 h-48 opacity-25 group-hover:opacity-50 group-hover:rotate-6 transition-all duration-300 pointer-events-none select-none">
              <Image
                src="/assets/headphones-sticker.png"
                alt="Headphones & Red Stars"
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
                  PILLAR 1 • MOBILISATION
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
                  <span>Two editions of Battle of the Bands (BOTB)</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-neutral-300">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>Wholesome bake sales &amp; community fundraisers</span>
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
                <span>JOIN OUR EFFORT</span>
                <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5 text-[#E50914]" />
              </Link>
            </div>
          </div>

          {/* Pillar 02: Direct Support for Survivors (4 Cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-[#120707] border-2 border-[#E50914] shadow-[0_0_30px_rgba(229,9,20,0.15)] flex flex-col justify-between relative group overflow-hidden">
            {/* Permitted Red Spiral Star Watermark */}
            <div className="absolute -right-4 -bottom-4 w-56 h-56 opacity-20 pointer-events-none select-none group-hover:scale-105 transition-transform duration-500">
              <Image
                src="/assets/punk-red-spiral-star-clean.png"
                alt="Punk Spiral Star"
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
                  DIRECT SHELTERS
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#E50914] uppercase tracking-widest font-bold block">
                  PILLAR 2 • SURVIVOR CARE
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
                  <span>Day-care centre for children of domestic abuse survivors</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-neutral-200">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>Direct partnership with Sahodaya Women’s Help Home</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-neutral-200">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>Infrastructure aid to Sahodaya, Ammani, Snehalaya &amp; NIEPID</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-red-950/80 relative z-10">
              <Link
                href="/#donate"
                className="w-full py-3 bg-[#E50914] hover:bg-white text-white hover:text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>SUPPORT SURVIVORS DIRECTLY</span>
                <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 03: Advocacy and Dialogue (4 Cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-[#0E0E0E] border border-neutral-800 hover:border-[#E50914] flex flex-col justify-between transition-all relative group overflow-hidden">

            {/* Authentic Halftone Megaphone in Star Badge Watermark */}
            <div className="absolute -right-3 -bottom-3 w-48 h-48 opacity-25 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none select-none">
              <Image
                src="/assets/punk-megaphone-star.png"
                alt="Megaphone in Star Badge"
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
                  PILLAR 3 • DIALOGUE &amp; EDUCATION
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
                  <span>Articles examining misogyny in the media</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-neutral-300">
                  <GrungeGlyph name="check" className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                  <span>Case posts on violence faced by women &amp; children</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-900 relative z-10">
              <Link
                href="/blog"
                className="text-xs font-semibold text-neutral-400 group-hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>READ ADVOCACY JOURNAL</span>
                <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5 text-[#E50914]" />
              </Link>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
