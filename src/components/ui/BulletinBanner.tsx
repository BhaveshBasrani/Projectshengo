'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import { SiteUpdate, parseBulletinPayload } from '@/lib/types';

interface BulletinBannerProps {
  updates?: SiteUpdate[];
}

export default function BulletinBanner({ updates: initialUpdates }: BulletinBannerProps) {
  const pathname = usePathname();
  const [updates, setUpdates] = useState<SiteUpdate[]>(initialUpdates || []);
  const [dismissed, setDismissed] = useState(false);

  // Check dismissal state in session storage
  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem('she_bulletin_dismissed');
      if (isDismissed === 'true') {
        setDismissed(true);
      }
    } catch (e) {}
  }, []);

  // Fetch updates if none provided
  useEffect(() => {
    if (!initialUpdates || initialUpdates.length === 0) {
      fetch('/api/admin/updates')
        .then((res) => res.json())
        .then((data) => {
          if (data.updates && Array.isArray(data.updates)) {
            setUpdates(data.updates);
          }
        })
        .catch(() => {});
    }
  }, [initialUpdates]);

  // Find the latest bulletin that is marked as banner
  const bannerUpdate = updates.find((u) => {
    const parsed = parseBulletinPayload(u);
    return parsed.is_banner !== false;
  }) || updates[0];

  const isVisible = Boolean(bannerUpdate && !dismissed && pathname !== '/bulletin');

  // Broadcast visibility to FloatingNavbar so it adjusts top position smoothly
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('bulletin-banner-state', { detail: { visible: isVisible } })
      );
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('she_bulletin_dismissed', 'true');
    } catch (e) {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('bulletin-banner-state', { detail: { visible: false } })
      );
    }
  };

  if (!isVisible || !bannerUpdate) return null;

  const parsed = parseBulletinPayload(bannerUpdate);

  return (
    <div
      role="banner"
      aria-label="Community Announcement Banner"
      className="fixed top-0 left-0 right-0 z-[60] bg-[#0A0A0A] border-b-2 border-[#E50914] text-white banner-glow select-none animate-fadeIn transition-transform duration-300"
    >
      {/* Animated Top Hazard Stripes Pinstripe */}
      <div className="h-1 w-full bg-hazard-stripes opacity-90" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-10 sm:h-11 flex items-center justify-between gap-2.5 sm:gap-4 font-mono text-xs">
        
        {/* Left: Indicator, Thumbnail & Headline */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
          {/* Glowing Red Punk Badge */}
          <span className="shrink-0 px-2 sm:px-2.5 py-0.5 bg-[#E50914] text-white font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-white/20 shadow-[2px_2px_0px_#000000] flex items-center gap-1.5">
            <span className="text-white text-[11px] leading-none animate-pulse">★</span>
            <span className="hidden xs:inline">BULLETIN • </span>
            <span>{bannerUpdate.category.toUpperCase()}</span>
          </span>

          {/* Sticker or Thumbnail */}
          {parsed.image_url && (
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 shrink-0 hidden sm:block">
              <Image
                src={parsed.image_url}
                alt="Bulletin Icon"
                fill
                className="object-contain drop-shadow-[0_0_8px_rgba(229,9,20,0.7)]"
              />
            </div>
          )}

          {/* Headline & Body Text */}
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <Link
              href="/bulletin"
              className="font-heading font-black text-xs sm:text-sm text-white hover:text-[#E50914] uppercase tracking-tight shrink-0 truncate transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            >
              {bannerUpdate.title}
            </Link>
            <span className="text-neutral-500 font-mono text-[10px] hidden md:inline">•</span>
            <span className="font-sans text-neutral-300 text-xs hidden md:inline truncate max-w-sm lg:max-w-md">
              {parsed.body}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* External Action CTA if provided */}
          {parsed.link_url && (
            <a
              href={parsed.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-white hover:bg-neutral-200 text-black font-mono text-[10px] font-black uppercase tracking-wider transition-colors hidden sm:flex items-center gap-1"
            >
              <span>{parsed.link_text || 'VISIT LINK'}</span>
              <GrungeGlyph name="external" className="w-3 h-3 text-black" />
            </a>
          )}

          {/* Dedicated Community Board Link */}
          <Link
            href="/bulletin"
            className="px-2.5 sm:px-3 py-1 bg-[#E50914] hover:bg-white text-white hover:text-black font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 shrink-0 border border-white/20 shadow-[2px_2px_0px_#000000]"
          >
            <span>COMMUNITY BOARD</span>
            <GrungeGlyph name="arrow-right" className="w-3 h-3" />
          </Link>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 text-neutral-400 hover:text-white transition-colors ml-1"
            title="Dismiss Announcement Banner"
            aria-label="Dismiss Announcement"
          >
            <GrungeGlyph name="close" className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
