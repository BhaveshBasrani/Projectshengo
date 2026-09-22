'use client';

import React from 'react';
import Image from 'next/image';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import { SiteConfig } from '@/lib/types';

interface GoogleFormsHubProps {
  config: SiteConfig;
}

export default function GoogleFormsHub({ config }: GoogleFormsHubProps) {
  const forms = [
    {
      id: 'team',
      title: 'JOIN OUR TEAM',
      subtitle: 'VOLUNTEERS & COMMUNITY WORKERS',
      glyphName: 'user' as const,
      description:
        'Help us make a real difference. We need volunteers for events, fundraising, outreach, and media.',
      url: config.google_form_team_app,
      badge: 'OPEN APPLICATION',
      actionText: 'APPLY TO JOIN US',
      themeBorder: 'border-neutral-800 hover:border-[#E50914]',
      assetSrc: '/assets/punk-guitar-sticker-clean.png',
      assetClass: 'w-40 h-64 -bottom-4 -right-2 opacity-30 group-hover:opacity-50 -rotate-12',
    },
    {
      id: 'art',
      title: 'ARTWORK & POETRY',
      subtitle: 'CREATIVE EXPRESSION',
      glyphName: 'quote' as const,
      description:
        'Share your journey through art or writing. Selected pieces get featured in our books and exhibitions.',
      url: config.google_form_artwork_poetry,
      badge: 'COMMUNITY VOICES',
      actionText: 'SUBMIT YOUR ART',
      themeBorder: 'border-neutral-800 hover:border-[#E50914]',
      assetSrc: '/assets/punk-vinyl-clean.png',
      assetClass: 'w-44 h-44 -bottom-4 -right-4 opacity-30 group-hover:opacity-50 group-hover:rotate-45 transition-transform duration-700',
    },
    {
      id: 'confessions',
      title: 'SHARE YOUR STORY',
      subtitle: 'COMMUNITY EXPERIENCES',
      glyphName: 'heart' as const,
      description:
        'A safe place to share what you’ve been through or get something off your chest. Completely anonymous.',
      url: config.google_form_anonymous_confessions,
      badge: 'ANONYMOUS',
      actionText: 'SHARE YOUR STORY',
      themeBorder: 'border-[#E50914]',
      assetSrc: '/assets/punk-red-spiral-star-clean.png',
      assetClass: 'w-40 h-40 -bottom-2 -right-2 opacity-30 group-hover:opacity-50 transition-opacity',
    },
  ];

  return (
    <section id="external-forms" className="scroll-mt-28 sm:scroll-mt-36 pt-28 sm:pt-36 pb-20 px-4 sm:px-6 max-w-7xl mx-auto select-none">
      
      {/* Header */}
      <div className="mb-14 space-y-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
          <span className="font-mono text-xs text-[#E50914] uppercase tracking-widest font-black">
            GET INVOLVED
          </span>
          <span className="px-2 py-0.5 bg-neutral-800 text-[10px] font-mono text-neutral-300 border border-neutral-700">
            OFFICIAL GOOGLE FORMS
          </span>
        </div>
        <h2 className="font-heading font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-none">
          WAYS TO PARTICIPATE
        </h2>
        <p className="font-sans text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
          Choose an option below to volunteer with us, share your art, or tell your story safely and anonymously.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {forms.map((form) => (
          <div
            key={form.id}
            className={`p-6 sm:p-8 bg-[#0E0E0E] text-[#F4F1EA] border-2 ${form.themeBorder} shadow-[6px_6px_0px_0px_#000000] fluid-card glow-on-hover flex flex-col justify-between relative group overflow-hidden stencil-cut`}
          >
            {/* Zine Tape on Corner */}
            <div className="zine-tape absolute -top-2.5 right-6 w-20 rotate-3 z-20" />

            {/* Extracted Authentic Punk Asset Watermark */}
            {form.assetSrc && (
              <div className={`absolute pointer-events-none select-none ${form.assetClass}`}>
                <Image
                  src={form.assetSrc}
                  alt={form.title}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
            )}

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 border-2 border-[#E50914] bg-black flex items-center justify-center text-[#E50914] group-hover:bg-[#E50914] group-hover:text-white transition-all duration-300">
                  <GrungeGlyph name={form.glyphName} className="w-6 h-6" />
                </div>
                <span className="font-mono text-[9px] font-bold text-neutral-400 border border-neutral-800 px-2 py-0.5 uppercase tracking-wider">
                  {form.badge}
                </span>
              </div>

              <div>
                <span className="font-mono text-[10px] text-[#E50914] uppercase tracking-widest font-bold block">
                  {form.subtitle}
                </span>
                <h3 className="font-heading font-black text-xl uppercase tracking-tight text-white">
                  {form.title}
                </h3>
              </div>

              <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                {form.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-800 space-y-3 relative z-10">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-500">
                <GrungeGlyph name="shield" className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Opens in Google Forms</span>
              </div>

              <a
                href={form.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn w-full py-3 bg-[#E50914] text-white hover:bg-white hover:text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_currentColor] transition-all flex items-center justify-center gap-2 min-h-[44px] hover-lift"
              >
                <span>{form.actionText}</span>
                <GrungeGlyph name="external" className="w-4 h-4 text-white group-hover/btn:text-black transition-colors" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Notice with Brutalist Stencil */}
      <div className="mt-8 p-4 bg-[#121212] border-2 border-[#222222] font-mono text-xs text-neutral-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-[11px] leading-relaxed flex items-center gap-2">
          <GrungeGlyph name="shield" className="w-4 h-4 text-[#E50914] shrink-0" />
          <span>All forms open directly in Google Forms so your responses go straight to the team.</span>
        </p>
      </div>

    </section>
  );
}
