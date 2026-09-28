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
      title: 'JOIN OUR MAIN TEAM OR VOLUNTEER',
      subtitle: 'WOMEN’S EMPOWERMENT & REHABILITATION',
      glyphName: 'user' as const,
      description:
        'We are always looking for individuals who are passionate about women’s empowerment and survivor rehabilitation to join our core team. You can also contribute as a volunteer by supporting our events, outreach campaigns, and media and advocacy initiatives.',
      url: config.google_form_team_app,
      badge: 'CORE & VOLUNTEERS',
      actionText: 'APPLY TO JOIN US',
      themeBorder: 'border-neutral-800 hover:border-[#E50914]',
      assetSrc: '/assets/headphones-sticker.png',
      assetClass: 'w-36 h-36 sm:w-44 sm:h-44 -bottom-3 -right-3 opacity-30 group-hover:opacity-60 -rotate-12 transition-all duration-300 pointer-events-none select-none',
    },
    {
      id: 'art',
      title: 'CREATIVE SUBMISSIONS',
      subtitle: 'ART, WRITING, DESIGN & MORE',
      glyphName: 'quote' as const,
      description:
        'Creative expression is vital to bringing any cause to life—be it through art, writing, design, or any other medium. Project S.H.E welcomes every expression of your artistic voice that reflects the values of equality and justice.',
      url: config.google_form_artwork_poetry,
      badge: 'ARTISTIC VOICE',
      actionText: 'SUBMIT CREATIVE WORK',
      themeBorder: 'border-neutral-800 hover:border-[#E50914]',
      assetSrc: '/assets/discoball-sticker.png',
      assetClass: 'w-36 h-36 sm:w-44 sm:h-44 -bottom-3 -right-3 opacity-30 group-hover:opacity-60 -rotate-6 transition-all duration-300 pointer-events-none select-none',
    },
    {
      id: 'confessions',
      title: 'SHARE YOUR STORY',
      subtitle: 'WITHOUT DILUTION OR CENSORSHIP',
      glyphName: 'heart' as const,
      description:
        'We believe every survivor deserves to tell their story in the way they choose—without dilution, dramatisation, or censorship. Whatever you are willing to share about a particular incident or experience, we are here to listen and to share it with the world on your terms.',
      url: config.google_form_anonymous_confessions,
      badge: 'ON YOUR TERMS',
      actionText: 'SHARE YOUR STORY',
      themeBorder: 'border-[#E50914]',
      assetSrc: '/assets/punk-red-spiral-star-clean.png',
      assetClass: 'w-36 h-36 sm:w-44 sm:h-44 -bottom-3 -right-3 opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none select-none',
    },
  ];

  return (
    <section id="external-forms" className="scroll-mt-28 sm:scroll-mt-36 pt-28 sm:pt-36 pb-20 px-4 sm:px-6 max-w-7xl mx-auto select-none relative">
      
      {/* Immersive Dark-Punk Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.02] mix-blend-screen"
          style={{ backgroundImage: `url('/assets/punk-bg-stars.jpg')` }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-[radial-gradient(ellipse,rgba(229,9,20,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#080808_90%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />
      </div>

      {/* Header */}
      <div className="mb-14 space-y-2 text-center sm:text-left relative z-10">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
          <span className="text-xs text-[#E50914] uppercase tracking-widest font-bold">
            GET INVOLVED
          </span>
          <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-none">
          HOW TO GET INVOLVED?
        </h2>
        <p className="font-sans text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
          Join our core team or volunteer, submit your creative work, or share your story with us.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
        {forms.map((form, fIdx) => (
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
      <div className="mt-8 p-4 bg-[#181818] border-2 border-neutral-700 font-mono text-xs text-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[4px_4px_0px_#000000] relative z-10">
        <p className="text-xs sm:text-sm font-semibold leading-relaxed flex items-center gap-2.5 text-neutral-200">
          <GrungeGlyph name="shield" className="w-4 h-4 text-[#E50914] shrink-0" />
          <span>All forms open directly in Google Forms so your responses go straight to the team.</span>
        </p>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-black border border-neutral-600 text-neutral-300 shrink-0">
          DIRECT GOOGLE FORMS
        </span>
      </div>

    </section>
  );
}
