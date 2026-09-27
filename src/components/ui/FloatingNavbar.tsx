'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/firebase/auth-context';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import { PublicReview } from '@/lib/types';
import ReviewModal from './ReviewModal';
import FeedbackModal from './FeedbackModal';

export default function FloatingNavbar() {
  const { user, isAdmin, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [latestReview, setLatestReview] = useState<PublicReview | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user's latest review status whenever user is logged in
  useEffect(() => {
    if (user?.uid) {
      fetch(`/api/reviews?userId=${encodeURIComponent(user.uid)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.reviews && data.reviews.length > 0) {
            setLatestReview(data.reviews[0]);
          } else {
            setLatestReview(null);
          }
        })
        .catch(() => {});
    } else {
      setLatestReview(null);
    }
  }, [user]);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#navbar-user-profile')) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [profileDropdownOpen]);

  const navLinks = [
    { label: 'ABOUT', href: '/#mission' },
    { label: 'GET INVOLVED', href: '/#external-forms' },
    { label: 'DONATE', href: '/#donate' },
    { label: 'REVIEWS', href: '/reviews' },
    { label: 'STORIES', href: '/blog' },
  ];

  // Compute initials fallback from displayName or email
  const getInitials = () => {
    if (!user) return 'U';
    const source = user.displayName || user.email || 'User';
    const clean = source.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <>
      <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 max-w-7xl mx-auto select-none">
        <nav className="w-full transition-all duration-200 border-2 bg-[#0A0A0A]/95 border-[#E50914] shadow-[4px_4px_0px_0px_#E50914] text-[#EDEDED] px-3.5 sm:px-4 py-2.5 backdrop-blur-md flex items-center justify-between relative overflow-hidden">
          {/* Authentic Crimson Grunge Background Texture */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-30 mix-blend-screen"
            style={{ backgroundImage: `url('/assets/punk-navbar-grunge.jpg')` }}
          />
          {/* Contrast scrim so nav buttons and typography remain crisp */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/85 via-black/75 to-black/85 pointer-events-none" />

          {/* Brand Logo & Tag */}
          <Link href="/" className="flex items-center gap-2.5 group min-h-[44px] relative z-10">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 border-2 border-current overflow-hidden shrink-0 bg-black">
              <Image
                src="/assets/logo.png"
                alt="Project S.H.E. Logo"
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-sm sm:text-lg tracking-tight leading-none text-[#E50914]">
                  PROJECT S.H.E.
                </span>
                <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 relative inline-block animate-spin [animation-duration:16s] pointer-events-none">
                  <Image
                    src="/assets/punk-red-spiral-star-clean.png"
                    alt="*"
                    fill
                    sizes="14px"
                    className="object-contain"
                  />
                </span>
              </div>
              <span className="hidden sm:block font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-400 group-hover:text-current transition-colors">
                SUPPORT • HELP • EMPOWER
              </span>
            </div>
          </Link>

          {/* Desktop Nav Anchors */}
          <div className="hidden lg:flex items-center gap-5 font-mono text-xs font-bold tracking-wider relative z-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-[#E50914] hover:drop-shadow-[0_0_8px_rgba(229,9,20,0.6)] transition-all relative py-1 hover:underline underline-offset-4 decoration-2 decoration-[#E50914] min-h-[44px] flex items-center hover-lift"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-2.5 relative z-10">
            {/* Quick Action: Suggestion / Feedback */}
            {/* Quick Action: Suggestion / Feedback */}
            <button
              type="button"
              onClick={() => setFeedbackModalOpen(true)}
              className="group hidden sm:inline-flex items-center gap-1.5 px-3 py-2 border border-current text-[11px] font-mono font-bold hover:bg-[#E50914] hover:text-white hover:border-[#E50914] transition-all min-h-[40px] hover-lift"
              title="Send Suggestion or Feedback"
            >
              <GrungeGlyph name="message" className="w-3.5 h-3.5 text-[#E50914] group-hover:text-white transition-colors" />
              <span className="hidden xl:inline">FEEDBACK</span>
            </button>

            {/* Quick Action: Submit Review */}
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="group hidden md:inline-flex items-center gap-1.5 px-3 py-2 border border-current text-[11px] font-mono font-bold hover:bg-[#E50914] hover:text-white hover:border-[#E50914] transition-all min-h-[40px] hover-lift"
              title="Submit a Public Review"
            >
              <GrungeGlyph name="star" className="w-3.5 h-3.5 text-amber-400 group-hover:text-white transition-colors" />
              <span className="hidden xl:inline">REVIEW</span>
            </button>

            {/* Authentication Gateway with Hydration Safety */}
            {mounted && user ? (
              <div id="navbar-user-profile" className="relative">
                {/* Profile Trigger Button */}
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 border-2 border-[#222222] hover:border-[#E50914] transition-all bg-[#141414] min-h-[44px] hover-lift"
                  title={user.displayName || user.email || 'User Account'}
                  aria-expanded={profileDropdownOpen}
                >
                  {user.photoURL && !imageError ? (
                    <div className="relative w-8 h-8 overflow-hidden bg-black shrink-0 border border-neutral-700">
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || 'User Profile'}
                        fill
                        className="object-cover"
                        onError={() => setImageError(true)}
                        sizes="32px"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-[#E50914] text-white font-mono text-xs font-black flex items-center justify-center border border-black shadow-[1px_1px_0px_0px_#000000] shrink-0 select-none">
                      {getInitials()}
                    </div>
                  )}

                  <span className="hidden md:inline font-mono text-[11px] font-bold text-white max-w-[90px] truncate px-1">
                    {user.displayName?.split(' ')[0] || 'ACCOUNT'}
                  </span>
                  <GrungeGlyph name="chevron-down" className="w-3 h-3 text-[#888888]" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#0E0E0E] border-2 border-[#E50914] shadow-[6px_6px_0px_0px_#E50914] p-3 font-mono text-xs z-50 animate-fadeIn">
                    <div className="pb-2 mb-2 border-b border-neutral-800">
                      <p className="font-bold text-white truncate">
                        {user.displayName || 'Community Member'}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                    </div>

                    {/* Live Review Status Tracker */}
                    {latestReview && (
                      <div className="p-2 bg-[#141414] border border-neutral-800 space-y-1 mb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-neutral-400 font-bold uppercase">REVIEW STATUS</span>
                          <span
                            className={`px-1.5 py-0.2 text-[8px] font-black uppercase ${
                              latestReview.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : latestReview.status === 'pending'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : latestReview.status === 'archived'
                                ? 'bg-neutral-800 text-neutral-300 border border-neutral-600'
                                : 'bg-red-950 text-red-400 border border-red-800'
                            }`}
                          >
                            {latestReview.status === 'approved' && 'APPROVED'}
                            {latestReview.status === 'pending' && 'IN REVIEW'}
                            {latestReview.status === 'archived' && 'ARCHIVED'}
                            {latestReview.status === 'rejected' && 'REJECTED'}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-300 italic truncate">
                          &ldquo;{latestReview.review_text}&rdquo;
                        </p>
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="text-[9px] text-[#E50914] hover:underline font-bold block pt-0.5"
                        >
                          View in Dashboard →
                        </Link>
                      </div>
                    )}

                    <div className="space-y-1">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="group flex items-center gap-2 p-2 hover:bg-[#E50914] hover:text-white transition-colors text-white font-bold"
                        >
                          <GrungeGlyph name="shield" className="w-4 h-4 text-[#E50914] group-hover:text-white transition-colors" />
                          <span>ADMIN PANEL</span>
                        </Link>
                      )}

                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="group flex items-center gap-2 p-2 hover:bg-[#E50914] hover:text-white transition-colors text-neutral-200 hover:text-white"
                      >
                        <GrungeGlyph name="user" className="w-4 h-4 text-[#E50914] group-hover:text-white transition-colors" />
                        <span>MY DASHBOARD</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="group w-full flex items-center gap-2 p-2 hover:bg-[#E50914] hover:text-white transition-colors text-neutral-400 hover:text-white text-left"
                      >
                        <GrungeGlyph name="logout" className="w-4 h-4 group-hover:text-white transition-colors" />
                        <span>LOGOUT</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : mounted ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/auth/login"
                  className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-[#E50914] text-white border-2 border-white shadow-[2px_2px_0px_0px_#000000] font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider hover:bg-white hover:text-black hover:border-black transition-all min-h-[36px] sm:min-h-[44px] flex items-center hover-lift"
                >
                  SIGN IN
                </Link>
              </div>
            ) : (
              <div className="w-20 h-10 bg-[#141414] border border-neutral-800" />
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 border-2 border-current hover:bg-[#E50914] hover:text-white transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle Mobile Navigation"
            >
              {mobileMenuOpen ? <GrungeGlyph name="close" className="w-5 h-5" /> : <GrungeGlyph name="menu" className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 border-2 bg-[#0E0E0E] border-[#E50914] shadow-[4px_4px_0px_0px_#E50914] text-white font-mono text-xs space-y-3 animate-fadeIn">
            <div className="flex flex-col space-y-1 border-b border-neutral-800 pb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-2 hover:bg-[#E50914] hover:text-white font-bold transition-colors min-h-[44px] flex items-center"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setFeedbackModalOpen(true);
                }}
                className="group p-2.5 border border-current flex items-center justify-center gap-1.5 font-bold hover:bg-[#E50914] hover:text-white min-h-[44px] transition-all"
              >
                <GrungeGlyph name="message" className="w-3.5 h-3.5 text-[#E50914] group-hover:text-white transition-colors" />
                <span>FEEDBACK</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setReviewModalOpen(true);
                }}
                className="group p-2.5 border border-current flex items-center justify-center gap-1.5 font-bold hover:bg-[#E50914] hover:text-white min-h-[44px] transition-all"
              >
                <GrungeGlyph name="star" className="w-3.5 h-3.5 text-amber-400 group-hover:text-white transition-colors" />
                <span>REVIEW</span>
              </button>
            </div>

            {mounted && user ? (
              <div className="pt-2 border-t border-neutral-800 flex flex-col gap-2">
                <Link
                  href={isAdmin ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-[#E50914] text-white text-center font-bold min-h-[44px] flex items-center justify-center"
                >
                  {isAdmin ? 'ADMIN PANEL' : 'MY DASHBOARD'}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 border border-current text-center font-bold min-h-[44px] flex items-center justify-center"
                >
                  LOGOUT
                </button>
              </div>
            ) : mounted ? (
              <div className="pt-2 border-t border-neutral-800 grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 bg-[#E50914] text-white text-center font-bold min-h-[44px] flex items-center justify-center"
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 border border-current text-center font-bold min-h-[44px] flex items-center justify-center"
                >
                  REGISTER
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </header>

      {/* Review Submission Modal */}
      <ReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} />

      {/* Feedback Submission Modal */}
      <FeedbackModal isOpen={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} />
    </>
  );
}

