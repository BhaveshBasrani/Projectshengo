'use client';

import React, { useState, useEffect } from 'react';
import GrungeGlyph from '@/components/ui/GrungeGlyph';

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if dismissed or already subscribed
    const dismissed = localStorage.getItem('projectshe_newsletter_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4500);
      return () => clearTimeout(timer);
    }

    // Listen for custom trigger event so any button (e.g. footer/nav) can re-open it
    const handleTrigger = () => setIsOpen(true);
    window.addEventListener('open-newsletter-modal', handleTrigger);
    return () => window.removeEventListener('open-newsletter-modal', handleTrigger);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('projectshe_newsletter_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'center_popup_modal' }),
      });

      if (res.ok) {
        setSuccess(true);
        localStorage.setItem('projectshe_newsletter_dismissed', 'true');
        setTimeout(() => {
          setIsOpen(false);
        }, 2200);
      } else {
        const data = await res.json();
        setError(data?.error || 'Subscription failed. Please try again.');
      }
    } catch {
      setError('Network communication failed. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 select-none"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0E0E0E] text-[#F4F1EA] border-2 border-[#E50914] shadow-[10px_10px_0px_0px_#E50914] p-8 md:p-10 font-mono transition-all duration-300 animate-in zoom-in-95 stencil-cut"
      >
        {/* Decorative corner accents */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#E50914]" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#E50914]" />

        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
        >
          <GrungeGlyph name="close" className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-950/60 border border-[#E50914] text-[#E50914] mx-auto animate-bounce">
              <GrungeGlyph name="check" className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-black text-2xl uppercase tracking-wider text-white">
                YOU&apos;RE ON THE LIST!
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                Thank you for subscribing. We will send our updates straight to your inbox.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
              <span className="text-[10px] text-[#E50914] uppercase tracking-widest font-black">
                PROJECT S.H.E. // NEWSLETTER
              </span>
            </div>

            {/* Headline & Body */}
            <div className="space-y-2">
              <h2 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-tighter text-white leading-none">
                STAY INFORMED
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Get our latest stories, advocacy briefs, and community announcements directly in your inbox. No spam, ever.
              </p>
            </div>

            {error && (
              <div className="p-2.5 bg-red-950/40 border border-[#E50914] text-[#FF6B6B] text-[11px] flex items-center gap-2">
                <GrungeGlyph name="alert" className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                  <GrungeGlyph name="mail" className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3.5 bg-[#141414] border border-neutral-700 focus:border-[#E50914] text-white text-xs placeholder:text-neutral-600 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#E50914] hover:bg-white hover:text-black text-white font-heading font-black text-xs uppercase tracking-widest transition-all border border-[#E50914] shadow-[4px_4px_0px_0px_#000000] disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                <span>{loading ? 'SUBSCRIBING...' : 'SUBSCRIBE TO NEWSLETTER'}</span>
                <GrungeGlyph name="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Footer dismissal link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors font-mono hover:underline"
              >
                I&apos;ll browse the site first →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
