'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReviewModal from '@/components/ui/ReviewModal';
import { PublicReview } from '@/lib/types';
import { HiArrowRight } from 'react-icons/hi2';

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

      {/* Subtle Atmospheric Red Radial Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse,rgba(230,25,43,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      </div>

      {/* Header Bar */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 border-b border-[#222222] pb-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="font-mono text-xs text-[#E6192B] uppercase tracking-widest font-bold">
              // COMMUNITY EXPERIENCES
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl uppercase tracking-tight text-white leading-none">
            COMMUNITY REVIEWS
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#D1D5DB] max-w-xl leading-relaxed">
            Read what volunteers, event attendees, and supporters say about Project S.H.E.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center md:justify-end gap-3 flex-wrap">
          <Link
            href="/reviews"
            className="group px-4 py-2.5 bg-[#141414] hover:bg-[#E6192B] text-[#D1D5DB] hover:text-white border border-neutral-800 hover:border-[#E6192B] transition-all flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider min-h-[42px] rounded-md hover-lift"
          >
            <span>VIEW ALL REVIEWS</span>
            <HiArrowRight className="w-4 h-4 text-[#E6192B] group-hover:text-white transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-[#E6192B] text-white hover:bg-white hover:text-black border border-transparent text-xs font-mono font-bold uppercase tracking-wider min-h-[42px] transition-all rounded-md hover-lift"
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
              <div key={i} className="p-5 bg-[#0E0E0E] border border-neutral-800/80 animate-pulse min-h-[160px] space-y-3 rounded-md">
                <div className="h-4 bg-neutral-800 w-1/3 rounded-sm" />
                <div className="h-3 bg-neutral-800 w-full rounded-sm" />
                <div className="h-3 bg-neutral-800 w-2/3 rounded-sm" />
              </div>
            ))}
          </div>
        ) : topReviews.length === 0 ? (
          <div className="p-8 bg-[#0E0E0E] border border-neutral-800/80 text-center space-y-3 max-w-lg mx-auto rounded-md">
            <p className="text-white font-mono font-bold text-sm uppercase">NO REVIEWS YET</p>
            <p className="text-xs text-[#D1D5DB] font-sans">
              No reviews have been published yet. Be the first to share your experience with Project S.H.E.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-[#E6192B] text-white hover:bg-white hover:text-black font-mono font-bold text-xs uppercase transition-all rounded-md border border-transparent"
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
                  className="p-6 bg-[#0E0E0E] text-[#EDEDED] border border-neutral-800/80 hover:border-[#E6192B]/50 flex flex-col justify-between space-y-4 transition-all relative group rounded-md overflow-hidden cursor-pointer"
                  title="Click to view full review and enlarge"
                >
                  <div className="space-y-3 relative z-10">
                    {/* Rating Bar + Rank */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 font-mono text-xs text-[#E6192B] font-bold">
                        <span>★</span>
                        <span>{rev.rating || 5}.0</span>
                        <span className="text-neutral-500 text-[10px] ml-1">/ 5.0</span>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-400 border border-neutral-800 px-1.5 py-0.5 font-bold uppercase tracking-wider rounded-sm">
                        #{idx + 1} TOP RATED
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed font-sans italic line-clamp-3">
                      &ldquo;{rev.review_text}&rdquo;
                    </p>

                    <div className="text-[10px] font-mono text-[#E6192B] font-bold flex items-center gap-1.5 pt-1 uppercase tracking-wider group-hover:text-white transition-colors">
                      <span>READ FULL REVIEW</span>
                      <HiArrowRight className="w-3 h-3 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs relative z-10">
                    <div className="min-w-0 pr-2">
                      <span className="font-heading font-bold text-white uppercase tracking-tight block text-xs truncate">
                        {rev.display_name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 block truncate">
                        {rev.role_or_relation || 'Community Voice'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleLike(rev.id, e)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 border transition-all text-[11px] font-mono font-bold shrink-0 rounded-md ${
                        hasLiked
                          ? 'border-[#E6192B] bg-[#220707] text-[#E6192B]'
                          : 'border-neutral-800 bg-[#121212] text-[#D1D5DB] hover:border-[#E6192B] hover:text-white'
                      }`}
                      title="Like this review"
                    >
                      <span className="text-[#E6192B]">♥</span>
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
