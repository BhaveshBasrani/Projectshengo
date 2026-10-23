'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import { PublicReview } from '@/lib/types';
import ReviewModal from './ReviewModal';
import FeedbackModal from './FeedbackModal';

export default function FloatingNavbar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [hasTopBanner, setHasTopBanner] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [latestReview, setLatestReview] = useState<PublicReview | null>(null);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined' && (window as any).__she_banner_showing !== undefined) {
      setHasTopBanner(Boolean((window as any).__she_banner_showing));
    }

    const handleBannerState = (e: any) => {
      setHasTopBanner(Boolean(e.detail?.visible));
    };
    window.addEventListener('bulletin-banner-state', handleBannerState);
    return () => window.removeEventListener('bulletin-banner-state', handleBannerState);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
        .catch(() => { });
    } else {
      setLatestReview(null);
    }
  }, [user]);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);



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
    { label: 'GALLERY', href: '/gallery' },
    { label: 'BULLETIN', href: '/bulletin' },
    { label: 'GET INVOLVED', href: '/#external-forms' },
    { label: 'DONATE', href: '/#donate' },
    { label: 'REVIEWS', href: '/reviews' },
    { label: 'STORIES', href: '/blog' },
  ];

  if (pathname?.startsWith('/admin')) {
    return null;
  }

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

  const isDocked = hasTopBanner && !isScrolled && pathname === '/';

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 select-none transition-all duration-300 ease-out ${isDocked
            ? 'top-[44px] sm:top-[48px] w-full px-0 max-w-none bg-[#0A0A0A]/95 backdrop-blur-md border-b border-neutral-800/80 shadow-md'
            : 'top-3 sm:top-4 px-3 sm:px-6 max-w-7xl mx-auto bg-transparent border-none shadow-none'
          }`}
      >
        <nav
          className={`w-full transition-all duration-300 flex items-center justify-between relative ${isDocked
              ? 'max-w-7xl mx-auto px-3.5 sm:px-6 py-2 text-[#EDEDED] bg-transparent border-0 shadow-none'
              : 'rounded-sm border border-white/25 sm:border-white/30 bg-[#0A0A0A]/95 text-[#EDEDED] px-3.5 sm:px-4 py-2.5 backdrop-blur-md shadow-lg shadow-black/40'
            }`}
        >
          {/* Grunge background textures - clipped to nav bounds */}
          <div className="navbar-grunge-scrim absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-sm">
            {/* Authentic Crimson Grunge Background Texture */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
              style={{ backgroundImage: `url('/assets/punk-navbar-grunge.jpg')` }}
            />
            {/* Contrast scrim so nav buttons and typography remain crisp */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/85" />
          </div>

          {/* Brand Logo & Tag */}
          <Link href="/" className="flex items-center gap-2.5 group min-h-[44px] relative z-10">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 border border-neutral-700 rounded-sm overflow-hidden shrink-0 bg-black">
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
                <span className="font-heading font-black text-sm sm:text-lg tracking-tight leading-none text-[#E6192B]">
                  PROJECT S.H.E.
                </span>
              </div>
              <span className="hidden sm:block font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#D1D5DB] group-hover:text-current transition-colors">
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

          {/* Right Action Buttons & Auth */}
          <div className="flex items-center gap-2 sm:gap-2.5 relative z-10">
            {/* When user is authenticated: show text-only buttons & user profile with dropdown */}
            {mounted && user ? (
              <>
                {/* Quick Action: Suggestion / Feedback (Text only, no icon, signed-in only) */}
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(true)}
                  className="hidden sm:inline-flex items-center px-3 py-2 border border-neutral-800 rounded-sm text-[11px] font-mono font-bold hover:bg-[#E50914] hover:text-white hover:border-[#E50914] transition-all min-h-[40px] hover-lift text-neutral-300"
                  title="Send Suggestion or Feedback"
                >
                  FEEDBACK
                </button>

                {/* Quick Action: Submit Review (Text only, no icon, signed-in only) */}
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(true)}
                  className="hidden md:inline-flex items-center px-3 py-2 border border-neutral-800 rounded-sm text-[11px] font-mono font-bold hover:bg-[#E50914] hover:text-white hover:border-[#E50914] transition-all min-h-[40px] hover-lift text-neutral-300"
                  title="Submit a Public Review"
                >
                  REVIEW
                </button>

                {/* Profile Trigger Button */}
                <div id="navbar-user-profile" className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 border border-neutral-800 rounded-sm hover:border-white/40 transition-all bg-[#141414] min-h-[40px] hover-lift"
                    title={user.displayName || user.email || 'User Account'}
                    aria-expanded={profileDropdownOpen}
                  >
                    {user.photoURL && !imageError ? (
                      <div className="relative w-7 h-7 overflow-hidden bg-black shrink-0 border border-neutral-700 rounded-sm">
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || 'User Profile'}
                          fill
                          className="object-cover"
                          onError={() => setImageError(true)}
                          sizes="28px"
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 bg-[#E50914] text-white font-mono text-xs font-black flex items-center justify-center rounded-sm shrink-0 select-none">
                        {getInitials()}
                      </div>
                    )}

                    <span className="hidden md:inline font-mono text-[11px] font-bold text-white max-w-[100px] truncate px-1">
                      {user.displayName?.split(' ')[0] || 'ACCOUNT'}
                    </span>
                    <GrungeGlyph name="chevron-down" className="w-3 h-3 text-[#888888]" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#0E0E0E] border border-white/20 rounded-sm shadow-2xl p-3 font-mono text-xs z-50 animate-fadeIn">
                      {/* User Info Header with Name & Email */}
                      <div className="pb-2.5 mb-2.5 border-b border-neutral-800">
                        <div className="text-[9px] text-[#E6192B] font-bold uppercase tracking-widest mb-0.5">SIGNED IN AS</div>
                        <p className="font-bold text-white truncate text-sm">
                          {user.displayName || 'Community Member'}
                        </p>
                        <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                      </div>

                      {/* Quick Actions in Dropdown: Write a review & send feedback */}
                      <div className="space-y-1 pb-2 mb-2 border-b border-neutral-800">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setReviewModalOpen(true);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-sm hover:bg-[#E50914] hover:text-white transition-colors text-neutral-200 text-left font-bold"
                        >
                          <span>WRITE A REVIEW</span>
                          <span className="text-[10px] text-[#E50914] group-hover:text-white">★</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setFeedbackModalOpen(true);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-sm hover:bg-[#E50914] hover:text-white transition-colors text-neutral-200 text-left font-bold"
                        >
                          <span>SEND FEEDBACK</span>
                          <span className="text-[10px] text-neutral-400">DIRECT</span>
                        </button>
                      </div>

                      {/* Live Review Status Tracker */}
                      {latestReview && (
                        <div className="p-2 bg-[#141414] border border-neutral-800 rounded-sm space-y-1 mb-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-neutral-400 font-bold uppercase">REVIEW STATUS</span>
                            <span
                              className={`px-1.5 py-0.5 text-[8px] font-black uppercase rounded-sm ${latestReview.status === 'approved'
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
                            className="flex items-center justify-between p-2 rounded-sm hover:bg-[#E50914] hover:text-white transition-colors text-white font-bold"
                          >
                            <span>ADMIN PANEL</span>
                            <span className="text-[9px] text-red-400">SECURE</span>
                          </Link>
                        )}

                        <Link
                          href="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between p-2 rounded-sm hover:bg-[#E50914] hover:text-white transition-colors text-neutral-200 hover:text-white font-bold"
                        >
                          <span>MY DASHBOARD</span>
                          <span>→</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-sm hover:bg-[#E50914] hover:text-white transition-colors text-neutral-400 hover:text-white text-left font-bold"
                        >
                          <span>LOGOUT</span>
                          <span>⎋</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : mounted ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/auth/login"
                  className="px-3.5 py-2 bg-[#E6192B] text-white border border-transparent font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:bg-[#121212] hover:text-white transition-all min-h-[40px] flex items-center hover-lift rounded-sm"
                >
                  SIGN IN
                </Link>
              </div>
            ) : (
              <div className="w-20 h-10 bg-[#141414] border border-neutral-800 rounded-sm" />
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 border border-neutral-800 rounded-sm hover:bg-[#E6192B] hover:text-white transition-all min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Toggle Mobile Navigation"
            >
              {mobileMenuOpen ? <GrungeGlyph name="close" className="w-5 h-5" /> : <GrungeGlyph name="menu" className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden mt-2 p-4 border border-white/20 rounded-sm bg-[#0E0E0E] shadow-2xl text-white font-mono text-xs space-y-3 animate-fadeIn ${isDocked ? 'mx-3 sm:mx-6 mb-3' : ''
              }`}
          >
            <div className="flex flex-col space-y-1 border-b border-neutral-800 pb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-2 hover:bg-[#E6192B] hover:text-white font-bold transition-colors min-h-[44px] flex items-center rounded-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {mounted && user ? (
              <>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setFeedbackModalOpen(true);
                    }}
                    className="p-2.5 border border-neutral-800 rounded-sm flex items-center justify-center font-bold hover:bg-[#E6192B] hover:text-white min-h-[44px] transition-all text-neutral-300"
                  >
                    FEEDBACK
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setReviewModalOpen(true);
                    }}
                    className="p-2.5 border border-neutral-800 rounded-sm flex items-center justify-center font-bold hover:bg-[#E6192B] hover:text-white min-h-[44px] transition-all text-neutral-300"
                  >
                    REVIEW
                  </button>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex flex-col gap-2">
                  <div className="px-2 py-1 text-[10px] text-neutral-400 truncate">
                    Signed in as: <span className="text-white font-bold">{user.displayName || user.email}</span>
                  </div>
                  <Link
                    href={isAdmin ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-[#E6192B] text-white text-center font-bold min-h-[44px] flex items-center justify-center rounded-sm"
                  >
                    {isAdmin ? 'ADMIN PANEL' : 'MY DASHBOARD'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 border border-neutral-800 hover:bg-[#E6192B] hover:text-white text-center font-bold min-h-[44px] flex items-center justify-center rounded-sm transition-colors"
                  >
                    LOGOUT
                  </button>
                </div>
              </>
            ) : mounted ? (
              <div className="pt-2 border-t border-neutral-800 grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 bg-[#E6192B] text-white text-center font-bold min-h-[44px] flex items-center justify-center rounded-sm"
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 border border-neutral-800 hover:border-white text-center font-bold min-h-[44px] flex items-center justify-center rounded-sm transition-colors"
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

