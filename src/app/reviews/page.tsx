'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import ReviewModal from '@/components/ui/ReviewModal';
import { PublicReview } from '@/lib/types';

function ReviewsArchiveContent() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('selected') || searchParams.get('highlight');

  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PublicReview | null>(null);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle URL selection & auto-enlarge
  useEffect(() => {
    if (selectedId && reviews.length > 0) {
      const match = reviews.find((r) => r.id === selectedId);
      if (match) {
        setSelectedReview(match);
      }
    }
  }, [selectedId, reviews]);

  // Handle Escape key to close enlarged modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedReview(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews?sort=stars');
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch {
      // Graceful error fallback
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (likedReviews[id]) return; // already liked in this session

    // Optimistic UI update
    setLikedReviews((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r))
    );
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview((prev) => (prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null));
    }

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
    <div className="pt-24 sm:pt-28 pb-20 px-3.5 sm:px-6 max-w-7xl mx-auto min-h-screen select-none font-mono relative">
      
      {/* Background Ambience Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.05] mix-blend-screen"
          style={{ backgroundImage: `url('/assets/punk-bg-stars.jpg')` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#080808_85%)]" />
      </div>

      {/* Header */}
      <div className="mb-10 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 border-b-2 border-neutral-900 pb-6 sm:pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GrungeGlyph name="barbed-wire" className="w-5 sm:w-6 h-3 text-[#E50914]" />
            <span className="text-[11px] sm:text-xs text-[#E50914] uppercase tracking-widest font-black">
              COMMUNITY EXPERIENCES
            </span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none">
            COMMUNITY REVIEWS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans leading-relaxed">
            Read real reviews and feedback from volunteers, event attendees, and supporters across Hyderabad.
          </p>
        </div>

        {/* Action Button: Submit Review */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="group px-5 sm:px-6 py-3 bg-[#E50914] text-white hover:bg-white hover:text-black border-2 border-white shadow-[4px_4px_0px_0px_#E50914] hover:shadow-[2px_2px_0px_0px_#E50914] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider min-h-[44px] shrink-0 hover-lift stencil-cut"
        >
          <GrungeGlyph name="star" className="w-4 h-4 text-white group-hover:text-black transition-colors" />
          <span>WRITE A REVIEW</span>
        </button>
      </div>

      {/* Star Filter Tabs & Count */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-1.5 text-xs flex-wrap w-full sm:w-auto">
          <span className="text-[10px] sm:text-[11px] text-neutral-500 uppercase mr-1 sm:mr-2 font-bold">STARS:</span>
          {(['all', 5, 4, 3] as const).map((filterVal) => (
            <button
              key={String(filterVal)}
              type="button"
              onClick={() => setStarFilter(filterVal)}
              className={`px-3 py-1.5 uppercase font-bold text-[11px] sm:text-xs border transition-all ${
                starFilter === filterVal
                  ? 'border-[#E50914] bg-[#E50914] text-white shadow-[2px_2px_0px_0px_#000000]'
                  : 'border-neutral-800 bg-[#121212] text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {filterVal === 'all' ? 'ALL' : `${filterVal} STARS`}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-neutral-400 font-mono">
          <span>
            {reviews.filter((r) => starFilter === 'all' || r.rating === starFilter).length} REVIEWS
          </span>
        </div>
      </div>

      {/* Grid of Reviews */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 relative z-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-[#0E0E0E] border-2 border-neutral-900 animate-pulse min-h-[200px] space-y-4 stencil-cut">
              <div className="h-4 bg-neutral-800 w-1/3 rounded" />
              <div className="h-3 bg-neutral-800 w-3/4 rounded" />
              <div className="h-3 bg-neutral-800 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : reviews.filter((r) => starFilter === 'all' || r.rating === starFilter).length === 0 ? (
        <div className="p-12 sm:p-16 text-center border-2 border-dashed border-neutral-800 text-xs text-neutral-500 relative z-10 max-w-xl mx-auto space-y-4 stencil-cut">
          <div className="w-12 h-12 mx-auto border border-[#E50914] bg-black flex items-center justify-center text-[#E50914]">
            <GrungeGlyph name="star" className="w-6 h-6" />
          </div>
          <p className="text-white font-bold text-sm uppercase">NO REVIEWS YET</p>
          <p className="font-sans text-neutral-400">
            No reviews have been published yet. Be the first to share your experience with Project S.H.E.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-[#E50914] text-white hover:bg-white hover:text-black font-bold text-xs uppercase transition-all shadow-[2px_2px_0px_0px_#000000]"
          >
            WRITE A REVIEW
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 relative z-10">
          {reviews
            .filter((r) => starFilter === 'all' || r.rating === starFilter)
            .map((rev) => {
            const hasLiked = likedReviews[rev.id];

            return (
              <article
                key={rev.id}
                id={`rev-${rev.id}`}
                onClick={() => setSelectedReview(rev)}
                className="p-5 sm:p-6 bg-[#0E0E0E] text-[#F4F1EA] border-2 border-[#262626] hover:border-[#E50914] shadow-[4px_4px_0px_0px_#111111] hover:shadow-[6px_6px_0px_0px_#E50914] flex flex-col justify-between space-y-4 transition-all group stencil-cut relative overflow-hidden cursor-pointer"
                title="Tap to enlarge and read full testimonial"
              >
                {/* Subtle Punk Watermark */}
                <div className="absolute -right-3 -bottom-3 w-28 sm:w-32 h-28 sm:h-32 opacity-10 pointer-events-none select-none group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/assets/punk-red-spiral-star-clean.png"
                    alt="Star"
                    fill
                    sizes="128px"
                    className="object-contain"
                  />
                </div>

                <div className="space-y-3 relative z-10">
                  {/* Top Bar: Stars + Role Badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-[#E50914]">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <GrungeGlyph key={i} name="star" className="w-3.5 h-3.5 fill-current text-[#E50914]" />
                      ))}
                    </div>
                    <span className="px-2 py-0.5 bg-[#161616] text-neutral-300 border border-neutral-800 text-[10px] font-mono font-semibold uppercase tracking-wider">
                      {rev.role_or_relation || 'Community Voice'}
                    </span>
                  </div>

                  {/* Review Text clamped for clean overview */}
                  <div>
                    <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans italic line-clamp-4">
                      &ldquo;{rev.review_text}&rdquo;
                    </p>
                    <div className="text-[11px] text-[#E50914] font-bold group-hover:underline flex items-center gap-1 pt-1.5">
                      <span>READ FULL REVIEW</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Author + Like Button */}
                <div className="pt-3.5 border-t border-neutral-900 flex items-center justify-between text-xs relative z-10">
                  <div>
                    <span className="font-heading font-bold text-white uppercase tracking-tight block text-sm">
                      {rev.display_name}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {new Date(rev.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={(e) => handleLike(rev.id, e)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 border transition-all text-xs font-mono font-bold shrink-0 ${
                      hasLiked
                        ? 'border-[#E50914] bg-[#220707] text-[#E50914]'
                        : 'border-neutral-800 bg-[#121212] text-neutral-400 hover:border-[#E50914] hover:text-white'
                    }`}
                    title="Like this review"
                  >
                    <GrungeGlyph
                      name="heart"
                      className={`w-3.5 h-3.5 transition-colors ${hasLiked ? 'text-[#E50914] fill-current' : 'text-neutral-500'}`}
                    />
                    <span>{rev.likes || 0}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Enlarged Review Focus Modal */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedReview(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-xl max-h-[88vh] overflow-y-auto bg-[#0E0E0E] text-[#EDEDED] border-2 border-[#E50914] shadow-[8px_8px_0px_0px_#E50914] p-5 sm:p-8 stencil-cut space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner Masking Tape */}
            <div className="zine-tape absolute -top-3 left-6 z-10 scale-75" />

            {/* Header with Stars, Date & Close */}
            <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[#E50914]">
                  {[...Array(selectedReview.rating || 5)].map((_, i) => (
                    <GrungeGlyph key={i} name="star" className="w-4 h-4 fill-current text-[#E50914]" />
                  ))}
                  <span className="ml-2 text-xs font-bold text-white uppercase font-mono">
                    {selectedReview.rating || 5}/5 STARS
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-xs text-neutral-300 font-bold uppercase font-heading">
                    {selectedReview.role_or_relation || 'Community Voice'}
                  </span>
                  <span className="text-[10px] text-neutral-600 font-mono">•</span>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {new Date(selectedReview.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-2.5 py-1 border border-neutral-700 hover:border-[#E50914] text-neutral-400 hover:text-white text-xs font-bold uppercase transition-colors shrink-0 stencil-cut"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Full Testimonial Text */}
            <div className="space-y-4 py-1">
              <p className="text-sm sm:text-base text-neutral-100 font-sans leading-relaxed whitespace-pre-line italic">
                &ldquo;{selectedReview.review_text}&rdquo;
              </p>
            </div>

            {/* Footer Bar */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs flex-wrap gap-3">
              <div>
                <span className="font-heading font-black text-sm sm:text-base text-white uppercase block">
                  {selectedReview.display_name}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <GrungeGlyph name="shield" className="w-3 h-3" /> COMMUNITY REVIEW
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleLike(selectedReview.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 border transition-all text-xs font-mono font-bold shrink-0 ${
                  likedReviews[selectedReview.id]
                    ? 'border-[#E50914] bg-[#220707] text-[#E50914]'
                    : 'border-neutral-700 bg-[#141414] text-neutral-300 hover:border-[#E50914] hover:text-white'
                }`}
              >
                <GrungeGlyph
                  name="heart"
                  className={`w-3.5 h-3.5 ${likedReviews[selectedReview.id] ? 'text-[#E50914] fill-current' : 'text-neutral-400'}`}
                />
                <span>{selectedReview.likes || 0} LIKES</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchReviews()}
      />
    </div>
  );
}

export default function ReviewsArchivePage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen text-center font-mono text-xs text-neutral-500">
        LOADING REVIEWS...
      </div>
    }>
      <ReviewsArchiveContent />
    </Suspense>
  );
}
