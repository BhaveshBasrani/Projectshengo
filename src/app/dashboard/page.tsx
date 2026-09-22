'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import Image from 'next/image';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import PunkLoader from '@/components/ui/PunkLoader';
import { PublicReview, SuggestionFeedback, SiteConfig } from '@/lib/types';
import ReviewModal from '@/components/ui/ReviewModal';
import FeedbackModal from '@/components/ui/FeedbackModal';

export default function UserDashboard() {
  const router = useRouter();
  const { user, profile, loading, logout, updateAccountName, toggleEmailSubscription } = useAuth();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [myReviews, setMyReviews] = useState<PublicReview[]>([]);
  const [myFeedback, setMyFeedback] = useState<SuggestionFeedback[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      setNewName(profile?.display_name || user.displayName || '');
      fetchData();
    }
  }, [user, loading, router, profile]);

  const fetchData = async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      // Fetch site config
      const cfgRes = await fetch('/api/config');
      if (cfgRes.ok) {
        const cfgData = await cfgRes.json();
        setConfig(cfgData.config);
      }

      // Fetch user's own submitted reviews
      const revRes = await fetch(`/api/reviews?userId=${encodeURIComponent(user.uid)}`);
      if (revRes.ok) {
        const revData = await revRes.json();
        setMyReviews(revData.reviews || []);
      }

      // Fetch user's own submitted feedback
      const fbRes = await fetch(`/api/feedback?userId=${encodeURIComponent(user.uid)}`);
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        setMyFeedback(fbData.feedback || []);
      }
    } catch (e) {
      console.warn('Dashboard data fetch error:', e);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    await updateAccountName(newName.trim());
    setEditingName(false);
  };

  const handleToggleSubscription = async () => {
    const nextState = !profile?.email_subscribed;
    await toggleEmailSubscription(nextState);
  };

  if (loading || (!user && loading)) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center font-mono">
        <PunkLoader
          label="LOADING DASHBOARD"
          sublabel="PLEASE WAIT A MOMENT"
          size="full"
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen select-none font-mono">
      
      {/* Top Banner Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-neutral-800 relative">
        <div className="zine-tape absolute -top-4 left-6 z-10 hidden sm:block" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#E50914] uppercase tracking-widest font-black">
              [MEMBER DASHBOARD]
            </span>
            <span className="px-2 py-0.5 bg-neutral-900 text-[10px] text-emerald-400 border border-emerald-900 font-bold stencil-cut">
              AUTHENTICATED
            </span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight text-white flex items-center gap-3">
            <span>WELCOME, {profile?.display_name || user.displayName || user.email?.split('@')[0]}</span>
            <GrungeGlyph name="star" className="w-5 h-5 text-[#E50914] shrink-0 inline-block animate-pulse" />
          </h1>
          <p className="text-xs text-neutral-400">
            Account ID: <span className="font-mono text-neutral-300 bg-neutral-900 px-1.5 py-0.5 border border-neutral-800">{user.uid}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setReviewModalOpen(true)}
            className="px-4 py-2.5 bg-[#E50914] text-white hover:bg-white hover:text-black text-xs font-bold uppercase transition-all shadow-[3px_3px_0px_0px_#000000] flex items-center gap-1.5 stencil-cut border border-[#E50914]"
          >
            <GrungeGlyph name="star" className="w-3.5 h-3.5" />
            <span>SUBMIT REVIEW</span>
          </button>
          <button
            type="button"
            onClick={() => setFeedbackModalOpen(true)}
            className="px-4 py-2.5 bg-[#141414] border border-neutral-700 hover:border-[#E50914] text-white text-xs font-bold uppercase transition-all flex items-center gap-1.5 stencil-cut"
          >
            <GrungeGlyph name="message" className="w-3.5 h-3.5 text-[#E50914]" />
            <span>SEND SUGGESTION</span>
          </button>
          <button
            type="button"
            onClick={() => logout()}
            className="p-2.5 border border-neutral-700 hover:bg-[#E50914] hover:border-[#E50914] hover:text-white transition-all text-xs stencil-cut text-neutral-400 hover:text-white"
            title="Sign Out"
          >
            <GrungeGlyph name="logout" className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Account Profile & Preferences */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Profile Card */}
          <div className="p-6 bg-[#0E0E0E] border-2 border-neutral-800 text-[#F4F1EA] shadow-[6px_6px_0px_0px_#000000] space-y-4 relative overflow-hidden stencil-cut">
            {/* Real Extracted Tribal Lily Watermark */}
            <div className="absolute -top-10 -right-10 w-36 h-56 opacity-15 pointer-events-none z-0 rotate-12">
              <Image
                src="/assets/punk-lily-clean.png"
                alt="Tribal Lily"
                width={144}
                height={224}
                className="object-contain"
              />
            </div>

            {/* Permitted Polly Stars Watermark */}
            <div className="absolute -bottom-8 -right-8 w-44 h-44 opacity-10 pointer-events-none z-0">
              <Image
                src="/assets/punk-polly-stars-clean.png"
                alt="Polly Stars Watermark"
                width={176}
                height={176}
                className="object-contain"
              />
            </div>

            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 relative z-10">
              <span className="font-heading font-black text-sm uppercase text-[#E50914] tracking-wider flex items-center gap-2">
                <GrungeGlyph name="user" className="w-4 h-4 text-[#E50914]" />
                <span>MY PROFILE</span>
              </span>
              <span className="text-[10px] text-neutral-500 uppercase font-mono">
                VERIFIED USER
              </span>
            </div>

            <div className="space-y-3 text-xs relative z-10">
              <div>
                <label className="text-[10px] text-neutral-500 uppercase block font-bold">
                  Display Name
                </label>
                {editingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="p-2 bg-[#141414] border border-[#E50914] text-white outline-none flex-1 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="px-3 py-2 bg-[#E50914] text-white font-bold text-xs stencil-cut"
                    >
                      SAVE
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingName(false)}
                      className="px-2 py-2 border border-neutral-700 text-neutral-400 text-xs"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1 bg-[#141414] p-2 border border-neutral-800">
                    <span className="text-white font-bold text-sm">
                      {profile?.display_name || user.displayName || 'No display name'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingName(true)}
                      className="text-neutral-400 hover:text-[#E50914] p-1 transition-colors"
                      title="Edit Display Name"
                    >
                      <GrungeGlyph name="edit" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-neutral-500 uppercase block font-bold">
                  Email Address
                </label>
                <div className="flex items-center gap-2 mt-1 text-neutral-300 bg-[#141414] p-2 border border-neutral-800">
                  <GrungeGlyph name="mail" className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-500 uppercase block font-bold">
                  Member Since
                </label>
                <div className="flex items-center gap-2 mt-1 text-neutral-400 text-[11px] bg-[#141414] p-2 border border-neutral-800">
                  <GrungeGlyph name="calendar" className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription Toggle */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between relative z-10">
              <div>
                <span className="text-xs font-bold text-white block">Email Newsletter</span>
                <span className="text-[10px] text-neutral-500">
                  {profile?.email_subscribed ? 'Subscribed to NGO news' : 'Unsubscribed'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleSubscription}
                className="text-[#E50914] hover:scale-105 transition-transform"
                title="Toggle subscription"
              >
                {profile?.email_subscribed ? (
                  <GrungeGlyph name="toggle-right" className="w-8 h-8 text-[#E50914]" />
                ) : (
                  <GrungeGlyph name="toggle-left" className="w-8 h-8 text-neutral-600" />
                )}
              </button>
            </div>
          </div>

          {/* External Google Forms Access Hub */}
          <div className="p-6 bg-[#0E0E0E] border-2 border-neutral-800 text-[#F4F1EA] shadow-[6px_6px_0px_0px_#000000] space-y-4 relative stencil-cut">
            {/* Pinned Polly Barbed Star Sticker */}
            <div className="absolute -top-3 -right-3 w-14 h-20 pointer-events-none z-20">
              <div className="zine-tape absolute -top-2 left-1 z-10 scale-50" />
              <Image
                src="/assets/punk-polly-stars-clean.png"
                alt="Polly Star"
                width={56}
                height={80}
                className="object-contain drop-shadow-[0_0_6px_rgba(229,9,20,0.5)] rotate-6"
              />
            </div>

            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="font-heading font-black text-sm uppercase text-[#E50914] tracking-wider flex items-center gap-2">
                <GrungeGlyph name="file" className="w-4 h-4 text-[#E50914]" />
                <span>EXTERNAL FORMS</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">GOOGLE FORMS</span>
            </div>

            <div className="p-3 bg-[#141414] border border-neutral-800 text-[10px] text-neutral-400 leading-relaxed font-sans">
              <strong className="text-white">Note:</strong> Team applications, art submissions, and personal stories open directly in Google Forms.
            </div>

            <div className="space-y-2.5">
              <a
                href={config?.google_form_team_app || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#141414] hover:bg-[#1A1A1A] border border-neutral-700 hover:border-[#E50914] flex items-center justify-between text-xs transition-colors group stencil-cut relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-10 relative shrink-0">
                    <Image
                      src="/assets/punk-guitar-sticker-clean.png"
                      alt="Electric Guitar"
                      fill
                      sizes="28px"
                      className="object-contain -rotate-12 group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-white block group-hover:text-[#E50914]">
                      Main Team Application
                    </span>
                    <span className="text-[10px] text-neutral-500 font-sans">Volunteer &amp; Core Staff</span>
                  </div>
                </div>
                <GrungeGlyph name="external" className="w-4 h-4 text-neutral-400 group-hover:text-[#E50914]" />
              </a>

              <a
                href={config?.google_form_artwork_poetry || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#141414] hover:bg-[#1A1A1A] border border-neutral-700 hover:border-[#E50914] flex items-center justify-between text-xs transition-colors group stencil-cut relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 relative shrink-0">
                    <Image
                      src="/assets/punk-vinyl-clean.png"
                      alt="Vinyl Record"
                      fill
                      sizes="28px"
                      className="object-contain group-hover:rotate-45 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-white block group-hover:text-[#E50914]">
                      Artwork &amp; Poetry Submissions
                    </span>
                    <span className="text-[10px] text-neutral-500 font-sans">Creative Resistance</span>
                  </div>
                </div>
                <GrungeGlyph name="external" className="w-4 h-4 text-neutral-400 group-hover:text-[#E50914]" />
              </a>

              <a
                href={config?.google_form_anonymous_confessions || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#141414] hover:bg-[#1A1A1A] border border-neutral-700 hover:border-[#E50914] flex items-center justify-between text-xs transition-colors group stencil-cut relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 relative shrink-0">
                    <Image
                      src="/assets/punk-red-spiral-star-clean.png"
                      alt="Red Spiral Star"
                      fill
                      sizes="28px"
                      className="object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-white block group-hover:text-[#E50914]">
                      Anonymous Confessions Vault
                    </span>
                    <span className="text-[10px] text-neutral-500 font-sans">Untracked Safe Space</span>
                  </div>
                </div>
                <GrungeGlyph name="external" className="w-4 h-4 text-neutral-400 group-hover:text-[#E50914]" />
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: User's Native Website Activity */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* User's Submitted Reviews & Status */}
          <div className="p-6 bg-[#0E0E0E] border-2 border-neutral-800 text-[#F4F1EA] shadow-[6px_6px_0px_0px_#000000] space-y-4 stencil-cut">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="font-heading font-black text-sm uppercase text-[#E50914] tracking-wider flex items-center gap-2">
                <GrungeGlyph name="star" className="w-4 h-4 text-[#E50914]" />
                <span>MY PUBLIC REVIEWS ({myReviews.length})</span>
              </span>
              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="text-[11px] text-[#E50914] hover:underline font-bold"
              >
                + WRITE NEW
              </button>
            </div>

            {myReviews.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-neutral-800 text-xs text-neutral-500">
                You have not submitted any public reviews yet.
              </div>
            ) : (
              <div className="space-y-3">
                {myReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-[#141414] border border-neutral-800 space-y-2 text-xs stencil-cut"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <GrungeGlyph
                            key={i}
                            name={i < rev.rating ? 'star' : 'star-outline'}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'text-[#E50914]' : 'text-neutral-700'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                          rev.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : rev.status === 'pending'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : rev.status === 'archived'
                            ? 'bg-neutral-800 text-neutral-300 border border-neutral-600'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {rev.status === 'approved' && '[STATUS: APPROVED & PUBLIC]'}
                        {rev.status === 'pending' && '[STATUS: PENDING ADMIN REVIEW]'}
                        {rev.status === 'archived' && '[STATUS: ARCHIVED]'}
                        {rev.status === 'rejected' && '[STATUS: REJECTED]'}
                      </span>
                    </div>

                    <p className="text-neutral-300 italic text-[11px] leading-relaxed font-sans">
                      &ldquo;{rev.review_text}&rdquo;
                    </p>

                    <div className="text-[10px] text-neutral-500 flex items-center justify-between pt-1">
                      <span>Author: {rev.display_name}</span>
                      <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User's Submitted Suggestions / Feedback */}
          <div className="p-6 bg-[#0E0E0E] border-2 border-neutral-800 text-[#F4F1EA] shadow-[6px_6px_0px_0px_#000000] space-y-4 stencil-cut">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="font-heading font-black text-sm uppercase text-[#E50914] tracking-wider flex items-center gap-2">
                <GrungeGlyph name="message" className="w-4 h-4 text-[#E50914]" />
                <span>MY PRIVATE FEEDBACK &amp; SUGGESTIONS ({myFeedback.length})</span>
              </span>
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(true)}
                className="text-[11px] text-[#E50914] hover:underline font-bold"
              >
                + NEW MESSAGE
              </button>
            </div>

            {myFeedback.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-neutral-800 text-xs text-neutral-500">
                You have not submitted any suggestions or feedback yet.
              </div>
            ) : (
              <div className="space-y-3">
                {myFeedback.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 bg-[#141414] border border-neutral-800 space-y-2 text-xs stencil-cut"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-[#1C1C1C] text-[#E50914] text-[9px] font-bold uppercase border border-neutral-700">
                        {fb.type}
                      </span>
                      <span className="px-2 py-0.5 text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase">
                        STATUS: {fb.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-xs">{fb.subject}</h4>
                    <p className="text-neutral-400 text-[11px] leading-relaxed font-sans">{fb.message}</p>

                    <div className="text-[10px] text-neutral-500 text-right pt-1 font-mono">
                      Submitted on {new Date(fb.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSuccess={fetchData}
      />

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />

    </div>
  );
}
