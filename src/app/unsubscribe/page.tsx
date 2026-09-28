'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import GrungeGlyph from '@/components/ui/GrungeGlyph';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUnsubscribed(true);
      } else {
        setError(data.error || 'Unable to unsubscribe. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#EDEDED] flex flex-col justify-center items-center px-4 py-20 relative select-none">
      {/* Background Punk Grid Texture */}
      <div className="absolute inset-0 bg-punk-grid opacity-30 pointer-events-none" />

      {/* Ambient Crimson Vignette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(229,9,20,0.15),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-[#0E0E0E] border-2 border-[#E50914] shadow-[8px_8px_0px_0px_#E50914] p-6 sm:p-8">
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#E50914] uppercase block">
              // EMAIL PREFERENCES
            </span>
            <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-white mt-1">
              NEWSLETTER
            </h1>
          </div>
          <span className="px-2.5 py-1 bg-[#1A0002] border border-[#E50914] text-[#E50914] font-mono text-[10px] font-bold">
            PROJECT S.H.E.
          </span>
        </div>

        {unsubscribed ? (
          <div className="space-y-5 text-center py-4">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-700 mx-auto flex items-center justify-center text-emerald-400">
              <GrungeGlyph name="check" className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-black text-lg text-white uppercase">
              YOU ARE UNSUBSCRIBED
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              <strong>{email}</strong> has been removed from the Project S.H.E. newsletter mailing list. You will no longer receive routine email broadcasts.
            </p>
            <div className="pt-4 border-t border-neutral-800">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-white text-white hover:text-black font-mono text-xs font-bold uppercase transition-all shadow-[2px_2px_0px_#000000]"
              >
                <span>RETURN TO HOMEPAGE</span>
                <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUnsubscribe} className="space-y-4">
            <p className="text-xs text-neutral-300 leading-relaxed">
              We&apos;re sorry to see you go. Confirm your email address below to unsubscribe from Project S.H.E. email updates.
            </p>

            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-400 font-bold mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-3 bg-[#141414] border border-neutral-700 text-white font-mono text-xs outline-none focus:border-[#E50914]"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E50914] hover:bg-white text-white hover:text-black font-mono text-xs font-black uppercase tracking-wider transition-all shadow-[4px_4px_0px_#000000] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <GrungeGlyph name="loader" className="w-3.5 h-3.5 animate-spin" />
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM UNSUBSCRIBE</span>
                  <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="pt-4 text-center border-t border-neutral-800/80">
              <Link
                href="/"
                className="text-[11px] text-neutral-500 hover:text-neutral-300 font-mono transition-colors"
              >
                ← Return to Project S.H.E. Homepage
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070707] flex items-center justify-center font-mono text-xs text-neutral-500">
          LOADING...
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
