'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import { SiteUpdate, parseBulletinPayload, ParsedBulletin } from '@/lib/types';

interface BulletinBoardProps {
  updates: SiteUpdate[];
}

export default function BulletinBoard({ updates }: BulletinBoardProps) {
  const [selectedUpdate, setSelectedUpdate] = useState<SiteUpdate | null>(null);

  // If empty, supply a default community dispatch so the board is always aesthetic
  const displayUpdates = updates.length > 0 ? updates : [
    {
      id: 'welcome-bulletin',
      title: 'COMMUNITY DISPATCH & NOTICE BOARD',
      content: JSON.stringify({
        body: 'Welcome to the Project S.H.E. Community Bulletin. All urgent notices, upcoming workshops, legal clinic dates, and announcements are pinned right here.',
        card_style: 'zine',
        image_url: '/assets/headphones-sticker.png',
        is_banner: true,
        doodle_icon: 'star',
      }),
      category: 'Announcement',
      status: 'published' as const,
      created_at: new Date().toISOString(),
    },
  ];

  return (
    <section id="bulletin-board" className="scroll-mt-24 py-16 px-3.5 sm:px-6 max-w-7xl mx-auto select-none relative">
      
      {/* Header Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#E50914] text-sm leading-none font-black">★</span>
            <span className="font-mono text-xs text-[#E50914] uppercase tracking-widest font-black">
              LIVE DISPATCHES &amp; ALERTS
            </span>
            <span className="text-[#E50914] text-sm leading-none font-black">★</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tight text-white mt-1">
            COMMUNITY BULLETIN BOARD
          </h2>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Real-time updates, announcements, survivor safehouse dispatches &amp; workshops.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
          <span className="w-2 h-2 bg-emerald-500 inline-block shadow-[0_0_6px_#10B981]" />
          <span>{displayUpdates.length} ACTIVE {displayUpdates.length === 1 ? 'POST' : 'POSTS'} PINNED</span>
        </div>
      </div>

      {/* The Rectangular Space with Star Grid Gridlines */}
      <div className="relative border-4 border-neutral-800 bg-[#070707] shadow-[8px_8px_0px_0px_#E50914] overflow-hidden">
        
        {/* Star Grid Canvas Pattern */}
        <div className="absolute inset-0 bg-star-gridlines opacity-90 pointer-events-none" />

        {/* Ambient Crimson Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_95%)] pointer-events-none" />

        {/* Framing Hazard Corner Accents */}
        <div className="absolute top-0 left-0 w-16 h-4 bg-hazard-stripes opacity-90 z-20" />
        <div className="absolute top-0 right-0 w-16 h-4 bg-hazard-stripes opacity-90 z-20" />
        <div className="absolute bottom-0 left-0 w-16 h-4 bg-hazard-stripes opacity-90 z-20" />
        <div className="absolute bottom-0 right-0 w-16 h-4 bg-hazard-stripes opacity-90 z-20" />

        {/* Floating Punk Stickers / Doodles on Canvas Perimeter */}
        <div className="hidden lg:block absolute top-4 right-10 w-28 h-28 opacity-30 pointer-events-none select-none z-10 rotate-12">
          <Image
            src="/assets/discoball-sticker.png"
            alt="Disco Ball Sticker"
            fill
            className="object-contain drop-shadow-[0_0_12px_rgba(229,9,20,0.5)]"
          />
        </div>
        <div className="hidden lg:block absolute bottom-6 left-8 w-24 h-24 opacity-25 pointer-events-none select-none z-10 -rotate-12">
          <Image
            src="/assets/headphones-sticker.png"
            alt="Headphones Sticker"
            fill
            className="object-contain drop-shadow-[0_0_12px_rgba(229,9,20,0.5)]"
          />
        </div>

        {/* Inner Content Grid */}
        <div className="relative z-10 p-5 sm:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {displayUpdates.map((update, idx) => {
            const parsed: ParsedBulletin = parseBulletinPayload(update);
            return (
              <div
                key={update.id || idx}
                onClick={() => setSelectedUpdate(update)}
                className="cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* RENDER BY CUSTOMIZABLE CARD STYLE */}

                {/* 1. POLAROID STYLE */}
                {parsed.card_style === 'polaroid' && (
                  <div className="bg-[#EDEDED] text-black p-3 sm:p-4 shadow-[6px_6px_0px_#000000] rotate-[-1deg] group-hover:rotate-0 transition-transform relative">
                    {/* Washi Tape on top */}
                    <div className="zine-tape absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 opacity-90 z-20" />

                    {/* Image Area */}
                    <div className="relative w-full h-44 sm:h-48 bg-[#181818] overflow-hidden border border-neutral-300 mb-3 flex items-center justify-center">
                      {parsed.image_url ? (
                        <Image
                          src={parsed.image_url}
                          alt={update.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-neutral-400">
                          <GrungeGlyph name="star" className="w-8 h-8 text-[#E50914]" />
                          <span className="font-mono text-[10px] uppercase">PROJECT S.H.E.</span>
                        </div>
                      )}

                      {/* Category Badge on Photo */}
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#E50914] text-white font-mono text-[9px] font-black uppercase">
                        {update.category}
                      </span>
                    </div>

                    {/* Polaroid Handwritten Caption */}
                    <div className="space-y-1.5 font-sans">
                      <h3 className="font-heading font-black text-sm uppercase tracking-tight text-black line-clamp-1">
                        {update.title}
                      </h3>
                      <p className="font-mono text-xs text-neutral-700 line-clamp-2 leading-relaxed">
                        {parsed.body}
                      </p>
                      <div className="pt-2 border-t border-neutral-300 flex items-center justify-between font-mono text-[10px] text-neutral-500">
                        <span>{new Date(update.created_at).toLocaleDateString()}</span>
                        <span className="text-[#E50914] font-bold group-hover:underline">READ NOTE →</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. BRUTALIST STAMP ANNOUNCEMENT STYLE */}
                {parsed.card_style === 'stamp' && (
                  <div className="bg-[#120606] border-2 border-[#E50914] p-5 shadow-[6px_6px_0px_#E50914] relative text-white space-y-3">
                    {/* Stamp Mark */}
                    <div className="absolute top-3 right-3 border border-[#E50914] text-[#E50914] px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider rotate-3">
                      ★ STAMPED
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#E50914] text-white font-mono text-[9px] font-bold uppercase">
                        {update.category}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500">
                        {new Date(update.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-base uppercase text-white tracking-tight leading-snug">
                      {update.title}
                    </h3>

                    {parsed.image_url && (
                      <div className="relative w-full h-32 bg-black border border-neutral-800 overflow-hidden">
                        <Image
                          src={parsed.image_url}
                          alt={update.title}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    )}

                    <p className="font-sans text-xs text-neutral-300 leading-relaxed line-clamp-3">
                      {parsed.body}
                    </p>

                    <div className="pt-3 border-t border-red-950/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400 text-[10px]">CLICK TO EXPAND</span>
                      <span className="text-[#E50914] font-bold">VIEW DETAILS →</span>
                    </div>
                  </div>
                )}

                {/* 3. PUNK DOODLE STYLE */}
                {parsed.card_style === 'doodle' && (
                  <div className="bg-[#0C0C0C] border-2 border-dashed border-neutral-600 hover:border-[#E50914] p-5 shadow-[5px_5px_0px_#000000] relative text-white space-y-3 rotate-[1deg] group-hover:rotate-0 transition-transform">
                    {/* Doodle Star on top right */}
                    <span className="absolute -top-3 -right-2 text-[#E50914] text-xl font-black rotate-12">
                      ★
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-neutral-800 text-white font-mono text-[9px] font-bold uppercase border border-neutral-700">
                        {update.category}
                      </span>
                      <span className="text-neutral-500 font-mono text-[10px]">
                        {new Date(update.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-base uppercase tracking-tight text-white">
                      {update.title}
                    </h3>

                    {parsed.image_url && (
                      <div className="relative w-full h-36 bg-[#141414] border border-dashed border-neutral-700 overflow-hidden">
                        <Image
                          src={parsed.image_url}
                          alt={update.title}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    )}

                    <p className="font-mono text-xs text-neutral-300 leading-relaxed line-clamp-3">
                      {parsed.body}
                    </p>

                    <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-400">
                      <span>DOODLE BOARD</span>
                      <span className="text-[#E50914] font-bold">EXPAND NOTE →</span>
                    </div>
                  </div>
                )}

                {/* 4. DEFAULT ZINE NOTE STYLE */}
                {(parsed.card_style === 'zine' || !parsed.card_style) && (
                  <div className="bg-[#121212] border-2 border-neutral-800 hover:border-[#E50914] p-5 shadow-[6px_6px_0px_#000000] relative text-white space-y-3 transition-colors">
                    {/* Tape on Top-Left Corner */}
                    <div className="zine-tape absolute -top-2.5 -left-2 w-16 rotate-[-6deg] z-20" />

                    <div className="flex items-center justify-between pt-1">
                      <span className="px-2 py-0.5 bg-[#E50914] text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                        {update.category}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500">
                        {new Date(update.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-base uppercase tracking-tight text-white leading-tight">
                      {update.title}
                    </h3>

                    {parsed.image_url && (
                      <div className="relative w-full h-36 bg-black border border-neutral-800 overflow-hidden">
                        <Image
                          src={parsed.image_url}
                          alt={update.title}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <p className="font-sans text-xs text-neutral-300 leading-relaxed line-clamp-3">
                      {parsed.body}
                    </p>

                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between font-mono text-xs">
                      <span className="text-neutral-500 text-[10px]">PINNED NOTE</span>
                      <span className="text-[#E50914] font-bold flex items-center gap-1 group-hover:underline">
                        <span>READ DISPATCH</span>
                        <GrungeGlyph name="arrow-right" className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

      {/* DETAIL MODAL POPUP WHEN CLICKED */}
      {selectedUpdate && (() => {
        const parsedModal = parseBulletinPayload(selectedUpdate);
        return (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none"
            onClick={() => setSelectedUpdate(null)}
          >
            <div
              className="bg-[#101010] border-2 border-[#E50914] max-w-lg w-full p-6 sm:p-8 shadow-[8px_8px_0px_#000000] text-white space-y-5 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedUpdate(null)}
                className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-white"
              >
                <GrungeGlyph name="close" className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#E50914] text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  {selectedUpdate.category}
                </span>
                <span className="text-neutral-500 font-mono text-xs">
                  {new Date(selectedUpdate.created_at).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-tight text-white">
                {selectedUpdate.title}
              </h3>

              {parsedModal.image_url && (
                <div className="relative w-full h-56 bg-black border border-neutral-800 overflow-hidden">
                  <Image
                    src={parsedModal.image_url}
                    alt={selectedUpdate.title}
                    fill
                    className="object-contain p-3"
                  />
                </div>
              )}

              <p className="font-sans text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
                {parsedModal.body}
              </p>

              {parsedModal.link_url && (
                <div className="pt-4 border-t border-neutral-800">
                  <a
                    href={parsedModal.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#E50914] hover:bg-white text-white hover:text-black font-mono text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000000]"
                  >
                    <span>{parsedModal.link_text || 'VISIT OFFICIAL LINK'}</span>
                    <GrungeGlyph name="external" className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })()}

    </section>
  );
}
