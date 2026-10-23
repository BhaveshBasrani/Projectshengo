'use client';

import React from 'react';
import { SiteConfig } from '@/lib/types';
import { HiArrowUpRight } from 'react-icons/hi2';

interface GoogleFormsHubProps {
  config: SiteConfig;
}

export default function GoogleFormsHub({ config }: GoogleFormsHubProps) {
  const forms = [
    {
      id: 'team',
      num: '01',
      title: '1. Join our main team or contribute through volunteering',
      description:
        'We are always looking for individuals who are passionate about women’s empowerment and survivor rehabilitation to join our core team. You can also contribute as a volunteer by supporting our events, outreach campaigns, and media and advocacy initiatives.',
      url: config.google_form_team_app,
      badge: 'CORE & VOLUNTEERS',
      actionText: 'APPLY TO JOIN US',
    },
    {
      id: 'art',
      num: '02',
      title: '2. Creative submissions',
      description:
        'Creative expression is vital to bringing any cause to life—be it through art, writing, design, or any other medium. Project S.H.E welcomes every expression of your artistic voice that reflects the values of equality and justice.',
      url: config.google_form_artwork_poetry,
      badge: 'ARTISTIC VOICE',
      actionText: 'SUBMIT CREATIVE WORK',
    },
    {
      id: 'confessions',
      num: '03',
      title: '3. Share your story',
      description:
        'We believe every survivor deserves to tell their story in the way they choose—without dilution, dramatisation, or censorship. Whatever you are willing to share about a particular incident or experience, we are here to listen and to share it with the world on your terms.',
      url: config.google_form_anonymous_confessions,
      badge: 'ON YOUR TERMS',
      actionText: 'SHARE YOUR STORY',
    },
  ];

  return (
    <section id="external-forms" className="scroll-mt-28 sm:scroll-mt-36 pt-28 sm:pt-36 pb-20 px-4 sm:px-6 max-w-7xl mx-auto select-none relative">

      {/* Subtle Atmospheric Red Radial Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse,rgba(230,25,43,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      </div>

      {/* Header */}
      <div className="mb-12 space-y-2 text-center sm:text-left relative z-10">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <span className="font-mono text-xs text-[#E6192B] uppercase tracking-widest font-bold">
            // GET INVOLVED
          </span>
        </div>
        <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-none">
          HOW TO GET INVOLVED?
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#A3A3A3] max-w-2xl leading-relaxed">
          Join our core team or volunteer, submit your creative work, or share your story with us.
        </p>
      </div>

      {/* Cards Grid - 3 Symmetrical Brutalist Cards with 1px #333333 Borders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10 items-stretch">
        {forms.map((form) => (
          <div
            key={form.id}
            className="p-6 sm:p-8 bg-[#0E0E0E] border border-[#333333] hover:border-[#E6192B]/50 flex flex-col justify-between relative group overflow-hidden rounded-sm transition-all duration-200"
          >
            {/* Massive Faint Typographic Watermark Tucked in Bottom Right */}
            <div className="watermark-outline absolute right-4 bottom-2 text-8xl sm:text-9xl pointer-events-none select-none font-space font-bold opacity-20 group-hover:opacity-30 transition-opacity leading-none">
              {form.num}
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#E6192B] uppercase tracking-widest font-bold">
                  PROGRAM {form.num}
                </span>
                <span className="font-mono text-[9px] font-bold text-[#A3A3A3] border border-[#333333] px-2 py-0.5 uppercase tracking-wider rounded-sm">
                  {form.badge}
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight leading-snug break-words">
                {form.title}
              </h3>

              <p className="font-sans text-sm sm:text-[15px] text-[#A3A3A3] leading-[1.7] font-normal">
                {form.description}
              </p>
            </div>

            <div className="pt-6 mt-8 border-t border-[#262626] relative z-10">
              <a
                href={form.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-transparent text-white hover:text-[#E6192B] border border-[#333333] hover:border-[#E6192B] font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-2 min-h-[44px] rounded-sm group/btn"
              >
                <span>{form.actionText}</span>
                <HiArrowUpRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Minimalist Bottom Notice - Clean Centered Line Separated by 1px Divider */}
      <div className="mt-12 pt-8 border-t border-[#333333] text-center relative z-10">
        <p className="font-mono text-xs sm:text-[13px] text-[#A3A3A3] tracking-wide leading-relaxed max-w-2xl mx-auto">
          All applications and stories open directly in Google Forms to ensure direct, unmediated delivery to the team.
        </p>
      </div>

    </section>
  );
}
