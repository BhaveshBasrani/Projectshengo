'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import { useAuth } from '@/lib/firebase/auth-context';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const { user, profile } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || user?.displayName || '');
  const [role, setRole] = useState('Community Ally');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('Please provide a display name.');
      return;
    }
    if (reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName.trim(),
          role_or_relation: role.trim(),
          rating,
          review_text: reviewText.trim(),
          user_id: user?.uid || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setReviewText('');
    onClose();
  };

  return createPortal(
    <div
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-[#0E0E0E] text-[#F4F1EA] border-2 border-[#E50914] shadow-[8px_8px_0px_0px_#E50914] p-6 relative my-auto stencil-cut">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 border border-[#333333] hover:border-[#E50914] hover:bg-[#E50914] hover:text-white transition-all"
        >
          <GrungeGlyph name="close" className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="font-mono text-xs text-[#E50914] uppercase tracking-widest block mb-1">
            COMMUNITY REVIEWS
          </span>
          <h3 className="font-heading text-2xl font-black uppercase tracking-tight">
            WRITE A REVIEW
          </h3>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Your review will be checked by our team before appearing publicly.
          </p>
        </div>

        {success ? (
          <div className="p-5 border-2 border-emerald-500 bg-emerald-950/40 text-emerald-200 space-y-3 text-center stencil-cut">
            <GrungeGlyph name="check" className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-heading font-black text-lg">THANK YOU!</h4>
            <p className="text-xs font-sans text-emerald-300 leading-relaxed">
              We received your review. Our team will read it and publish it to the website shortly.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 px-5 py-2 bg-[#E50914] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
            >
              CLOSE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {error && (
              <div className="p-3 border border-[#E50914] bg-red-950/50 text-[#FF6B6B] flex items-center gap-2">
                <GrungeGlyph name="alert" className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block uppercase text-[11px] text-[#888888] mb-1 font-bold">
                Your Chosen Display Name *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Priya K. or Anonymous Ally"
                className="w-full p-2.5 bg-[#141414] border border-[#333333] focus:border-[#E50914] text-white outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-[11px] text-[#888888] mb-1 font-bold">
                Your Connection to Project S.H.E.
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 bg-[#141414] border border-[#333333] focus:border-[#E50914] text-white outline-none"
              >
                <option value="Survivor">Survivor</option>
                <option value="Volunteer / Advocate">Volunteer / Advocate</option>
                <option value="Battle of the Bands Supporter">Battle of the Bands Supporter</option>
                <option value="Workshop / Event Attendee">Workshop / Event Attendee</option>
                <option value="Community Ally">Community Ally</option>
                <option value="Donor & Supporter">Donor &amp; Supporter</option>
              </select>
            </div>

            <div>
              <label className="block uppercase text-[11px] text-[#888888] mb-1 font-bold">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-[#E50914] hover:scale-110 transition-transform"
                  >
                    <GrungeGlyph
                      name={star <= rating ? 'star' : 'star-outline'}
                      className={`w-6 h-6 ${star <= rating ? 'text-[#E50914]' : 'text-neutral-600'}`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-sm text-[#E50914]">{rating} / 5</span>
              </div>
            </div>

            <div>
              <label className="block uppercase text-[11px] text-[#888888] mb-1 font-bold">
                Your Review / Testimonial *
              </label>
              <textarea
                required
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with Project S.H.E. and how our community supported or inspired you..."
                className="w-full p-2.5 bg-[#141414] border border-[#333333] focus:border-[#E50914] text-white outline-none resize-none"
              />
            </div>

            <div className="p-3 bg-[#141414] border border-[#222222] text-[10px] text-[#888888] leading-relaxed flex items-start gap-2">
              <GrungeGlyph name="shield" className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
              <span><strong>Safety Guarantee:</strong> Your email and private account credentials are never made public. Only your chosen display name and testimonial text will appear after administrator approval.</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#E50914] hover:bg-white hover:text-black text-white font-heading font-black text-sm uppercase tracking-wider transition-all border border-[#E50914] shadow-[4px_4px_0px_0px_#000000] disabled:opacity-50"
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
