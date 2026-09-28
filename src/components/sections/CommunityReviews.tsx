'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import ReviewModal from '@/components/ui/ReviewModal';
import { PublicReview } from '@/lib/types';

export default function CommunityReviews() {
  const router = useRouter();
  const [topReviews, setTopReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTopReviews();
  }, []);

  const fetchTopReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews?sort=likes');
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        // Take top 3 for the landing page glimpse
        setTopReviews(data.reviews.slice(0, 3));
      }
    } catch {
      // Graceful error fallback
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedReviews[id]) return;

    setLikedReviews((prev) => ({ ...prev, [id]: true }));
    setTopReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r))
    );

    try {
      await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'like' }),
      });
    } catch (err) {
      console.warn('Like failed:', err);
    }
  };

  return (
    <section id="reviews" className="scroll-mt-28 sm:scroll-mt-36 pt-24 sm:pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto select-none relative">
      
      {/* Immersive Dark-Punk Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-screen"
          style={{ backgroundImage: `url('/assets/punk-bg-stars.jpg')` }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse,rgba(229,9,20,0.1)_0%,transparent_70%)] blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#080808_90%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />
      </div>

      {/* Subtle Corner Punk Wire */}
      <div className="absolute -bottom-8 -left-8 w-44 h-44 opacity-[0.08] pointer-events-none select-none z-0 hidden sm:block">
        <Image
          src="/assets/punk-barbed-wire.png"
          alt="*"
          fill
          sizes="176px"
          className="object-contain -rotate-45"
        />
      </div>

      {/* Header Bar */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 border-b border-neutral-900 pb-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
            <span className="text-xs text-[#E50914] uppercase tracking-widest font-bold flex items-center gap-1.5">
              <GrungeGlyph name="star" className="w-3.5 h-3.5 text-[#E50914]" /> COMMUNITY EXPERIENCES
            </span>
            <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-white leading-none">
            COMMUNITY REVIEWS
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
            Read what volunteers, event attendees, and supporters say about Project S.H.E.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center md:justify-end gap-3 flex-wrap">
          <Link
            href="/reviews"
            className="group px-4 py-2.5 bg-[#141414] hover:bg-[#E50914] text-neutral-200 hover:text-white border border-neutral-800 hover:border-[#E50914] transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider min-h-[42px] hover-lift"
          >
            <span>VIEW ALL REVIEWS</span>
            <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5 text-[#E50914] group-hover:text-white transition-colors" />
          </Link>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#E50914] text-white hover:bg-white hover:text-black border-2 border-white shadow-[2px_2px_0px_0px_#000000] text-xs font-bold uppercase tracking-wider min-h-[42px] transition-all hover-lift"
          >
            <span>WRITE A REVIEW</span>
          </button>
        </div>
      </div>

      {/* Top 3 Glimpse Cards */}
      <div className="relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 bg-[#0E0E0E] border border-neutral-900 animate-pulse min-h-[160px] space-y-3">
                <div className="h-4 bg-neutral-800 w-1/3 rounded" />
                <div className="h-3 bg-neutral-800 w-full rounded" />
                <div className="h-3 bg-neutral-800 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : topReviews.length === 0 ? (
          <div className="p-8 bg-[#0E0E0E] border-2 border-dashed border-neutral-800 text-center space-y-3 max-w-lg mx-auto stencil-cut">
            <p className="text-white font-bold text-sm uppercase">NO REVIEWS YET</p>
            <p className="text-xs text-neutral-400 font-sans">
              No reviews have been published yet. Be the first to share your experience with Project S.H.E.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-[#E50914] text-white hover:bg-white hover:text-black font-bold text-xs uppercase transition-all shadow-[2px_2px_0px_0px_#000000]"
            >
              WRITE A REVIEW
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topReviews.map((rev, idx) => {
              const hasLiked = likedReviews[rev.id];

              return (
                <div
                  key={rev.id}
                  onClick={() => router.push(`/reviews?selected=${rev.id}`)}
                  className="p-5 bg-[#0E0E0E] text-[#F4F1EA] border border-neutral-800 hover:border-[#E50914] shadow-[4px_4px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#E50914] flex flex-col justify-between space-y-4 transition-all relative group stencil-cut overflow-hidden cursor-pointer"
                  title="Click to view full review and enlarge"
                >
                  {/* Subtle Corner Star Seal */}
                  <div className="absolute -right-3 -bottom-3 w-20 h-20 opacity-10 pointer-events-none select-none group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src="/assets/punk-red-spiral-star-clean.png"
                      alt="Star"
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </div>

                  <div className="space-y-3 relative z-10">
                    {/* Stars + Role Tag + Rank */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-[#E50914]">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <GrungeGlyph key={i} name="star" className="w-3.5 h-3.5 fill-current text-[#E50914]" />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-wider">
                        #{idx + 1} TOP RATED
                      </span>
                    </div>

                    {/* Strict Line-Clamp-3 so long paragraphs never break layout */}
                    <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans italic line-clamp-3">
                      &ldquo;{rev.review_text}&rdquo;
                    </p>

                    <div className="text-[10px] text-[#E50914] font-bold group-hover:underline flex items-center gap-1 pt-1">
                      <span>READ FULL REVIEW</span>
                      <span>→</span>
                    </div>
                  </div>

                  {/* Footer Bar: Reviewer + Like Counter */}
                  <div className="pt-3 border-t border-neutral-900 flex items-center justify-between text-xs relative z-10">
                    <div className="min-w-0 pr-2">
                      <span className="font-heading font-bold text-white uppercase tracking-tight block text-xs truncate">
                        {rev.display_name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 block truncate">
                        {rev.role_or_relation || 'Community Voice'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleLike(rev.id, e)}
                      className={`inline-flex items-center gap-1 px-2 py-1 border transition-all text-[11px] font-mono font-bold shrink-0 ${
                        hasLiked
                          ? 'border-[#E50914] bg-[#220707] text-[#E50914]'
                          : 'border-neutral-800 bg-[#121212] text-neutral-400 hover:border-[#E50914] hover:text-white'
                      }`}
                      title="Like this review"
                    >
                      <GrungeGlyph
                        name="heart"
                        className={`w-3 h-3 ${hasLiked ? 'text-[#E50914] fill-current' : 'text-neutral-500'}`}
                      />
                      <span>{rev.likes || 0}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchTopReviews()}
      />
    </section>
  );
}
