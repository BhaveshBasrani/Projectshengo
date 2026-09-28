'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import { SiteUpdate, parseBulletinPayload } from '@/lib/types';

interface BulletinBannerProps {
  updates: SiteUpdate[];
}

export default function BulletinBanner({ updates }: BulletinBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem('she_bulletin_dismissed');
      if (isDismissed === 'true') {
        setDismissed(true);
      }
    } catch (e) {}
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('she_bulletin_dismissed', 'true');
    } catch (e) {}
  };

  // Find the latest bulletin that is marked for banner
  const bannerUpdate = updates.find((u) => {
    const parsed = parseBulletinPayload(u);
    return parsed.is_banner !== false;
  }) || updates[0];

  if (!bannerUpdate || dismissed) return null;

  const parsed = parseBulletinPayload(bannerUpdate);

  return (
    <div className="relative z-40 bg-[#0E0606] border-b-2 border-[#E50914] text-white overflow-hidden shadow-[0_4px_24px_rgba(229,9,20,0.35)] select-none">
      {/* Animated Hazard Edge Tape */}
      <div className="h-1 w-full bg-hazard-stripes opacity-80" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        
        {/* Left: Indicator & Headline */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          {/* Badge */}
          <span className="shrink-0 px-2 py-0.5 bg-[#E50914] text-white font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-white/20 shadow-[2px_2px_0px_#000000] flex items-center gap-1">
            <span className="text-white text-[10px] leading-none">★</span>
            <span>BULLETIN • {bannerUpdate.category.toUpperCase()}</span>
          </span>

          {/* Optional Thumbnail or Sticker */}
          {parsed.image_url && (
            <div className="relative w-5 h-5 shrink-0 hidden sm:block">
              <Image
                src={parsed.image_url}
                alt="Bulletin Icon"
                fill
                className="object-contain drop-shadow-[0_0_6px_rgba(229,9,20,0.6)]"
              />
            </div>
          )}

          {/* Headline & Body Text */}
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <span className="font-heading font-black text-xs sm:text-sm text-white uppercase tracking-tight shrink-0 truncate">
              {bannerUpdate.title}
            </span>
            <span className="text-neutral-500 font-mono text-[10px] hidden md:inline">•</span>
            <span className="font-sans text-neutral-300 text-xs hidden md:inline truncate max-w-md">
              {parsed.body}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {/* External Action CTA if provided */}
          {parsed.link_url && (
            <a
              href={parsed.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-white hover:bg-neutral-200 text-black font-mono text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
            >
              <span>{parsed.link_text || 'VIEW LINK'}</span>
              <GrungeGlyph name="external" className="w-3 h-3 text-black" />
            </a>
          )}

          {/* Jump to Visual Bulletin Board */}
          <a
            href="#bulletin-board"
            className="px-3 py-1 bg-neutral-900 hover:bg-[#E50914] text-neutral-200 hover:text-white border border-neutral-700 hover:border-[#E50914] font-mono text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            <span>BULLETIN BOARD</span>
            <GrungeGlyph name="arrow-down" className="w-3 h-3" />
          </a>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            title="Dismiss Banner"
          >
            <GrungeGlyph name="close" className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
