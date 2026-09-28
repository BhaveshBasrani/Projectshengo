import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import BulletinBoard from '@/components/sections/BulletinBoard';
import { getPublishedUpdates } from '@/lib/data/store';

export const metadata: Metadata = {
  title: 'Community Bulletin Board & Forum | Project S.H.E.',
  description:
    'Interactive community bulletin board and discussion forum for survivor safehouse resources, workshops, events, and announcements.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BulletinPage() {
  const updates = await getPublishedUpdates();

  return (
    <div className="pt-28 sm:pt-36 pb-20 min-h-screen page-fluid-enter">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-neutral-400 hover:text-white transition-colors py-2 px-3.5 bg-[#121212] border border-neutral-800 hover:border-[#E50914] shadow-[3px_3px_0px_#000000] hover-lift"
        >
          <GrungeGlyph name="arrow-left" className="w-3.5 h-3.5 text-[#E50914]" />
          <span>RETURN TO HOMEPAGE</span>
        </Link>
      </div>

      {/* Main Interactive Star-Grid Bulletin Board */}
      <BulletinBoard updates={updates} />
    </div>
  );
}
