'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/auth-context';
import GrungeGlyph from '@/components/ui/GrungeGlyph';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-md mx-auto min-h-[85vh] flex flex-col justify-center select-none font-mono">
      <div className="bg-[#0E0E0E] text-[#F4F1EA] border-2 border-[#E50914] shadow-[8px_8px_0px_0px_#E50914] p-6 sm:p-8 space-y-6 stencil-cut">
        
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#E50914] hover:text-white uppercase font-bold"
        >
          <GrungeGlyph name="arrow-left" className="w-3.5 h-3.5" />
          <span>BACK TO LOGIN</span>
        </Link>

        <div className="space-y-1">
          <span className="text-[10px] text-[#E50914] uppercase tracking-widest font-black block">
            CREDENTIAL RECOVERY
          </span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-white">
            RESET PASSWORD
          </h1>
          <p className="text-xs text-neutral-400 font-sans">
            Enter your registered email address to receive a confidential password recovery link.
          </p>

        </div>

        {error && (
          <div className="p-3 border border-[#E50914] bg-red-950/50 text-[#FF6B6B] text-xs flex items-center gap-2">
            <GrungeGlyph name="alert" className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-5 border border-emerald-500 bg-emerald-950/40 text-emerald-200 space-y-3 text-center stencil-cut">
            <GrungeGlyph name="check" className="w-8 h-8 text-emerald-400 mx-auto" />
            <h2 className="font-heading font-black text-base">EMAIL SENT</h2>
            <p className="text-xs font-sans">
              If an account is associated with <strong>{email}</strong>, a password reset link has been sent to your email.
            </p>
            <Link
              href="/auth/login"
              className="inline-block mt-2 px-4 py-2 bg-[#E50914] text-white text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors"
            >
              RETURN TO LOGIN
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase text-[11px] text-neutral-400 mb-1 font-bold">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 bg-[#141414] border border-neutral-700 focus:border-[#E50914] text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E50914] hover:bg-white hover:text-black text-white font-heading font-black text-sm uppercase tracking-wider transition-all border border-[#E50914] shadow-[4px_4px_0px_0px_#000000] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <GrungeGlyph name="arrow-right" className="w-4 h-4" />
              <span>{loading ? 'SENDING LINK...' : 'SEND RESET LINK'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
