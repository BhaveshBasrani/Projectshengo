'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import PunkLoader from '@/components/ui/PunkLoader';

export default function VerifyAuthPage() {
  const router = useRouter();
  const { user, verifyMagicLink, resendVerificationEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [isProcessingLink, setIsProcessingLink] = useState(false);
  const [needsEmailInput, setNeedsEmailInput] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Check if the current URL is a Firebase magic sign-in link
    if (typeof window !== 'undefined') {
      const href = window.location.href;
      if (href.includes('apiKey=') && (href.includes('mode=signIn') || href.includes('oobCode='))) {
        setIsProcessingLink(true);
        const storedEmail = window.localStorage.getItem('emailForSignIn');
        if (storedEmail) {
          completeSignIn(storedEmail, href);
        } else {
          setNeedsEmailInput(true);
          setIsProcessingLink(false);
        }
      }
    }
  }, []);

  const completeSignIn = async (targetEmail: string, href?: string) => {
    setError('');
    setIsProcessingLink(true);
    try {
      await verifyMagicLink(targetEmail, href);
      setStatusMessage('Signed in successfully! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'The sign-in link is invalid or has already been used.');
      setNeedsEmailInput(true);
    } finally {
      setIsProcessingLink(false);
    }
  };

  const handleManualEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    completeSignIn(email);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    try {
      await resendVerificationEmail();
      setStatusMessage('A new verification email has been sent. Please check your inbox.');
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Unable to resend verification email right now.');
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-md mx-auto min-h-[85vh] flex flex-col justify-center select-none font-mono relative">
      {/* Decorative Polly Barbed Star Stamp pinned top right */}
      <div className="absolute -top-4 -right-4 w-20 h-28 pointer-events-none z-20 hidden sm:block">
        <div className="zine-tape absolute -top-3 left-2 z-10 scale-75" />
        <Image
          src="/assets/punk-polly-stars-clean.png"
          alt="Barbed Polly Star"
          width={80}
          height={110}
          priority
          style={{ width: 'auto', height: 'auto' }}
          className="object-contain drop-shadow-[0_0_8px_rgba(229,9,20,0.6)] rotate-12"
        />
      </div>

      <div className="bg-[#0E0E0E] text-[#F4F1EA] border-2 border-[#E50914] shadow-[8px_8px_0px_0px_#E50914] p-6 sm:p-8 space-y-6 relative stencil-cut">
        <div className="zine-tape absolute -top-3 left-8 z-10" />

        {/* Header Badge */}
        <div className="space-y-1 text-center">
          <span className="text-[10px] text-[#E50914] uppercase tracking-widest font-black block">
            EMAIL VERIFICATION
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
            {needsEmailInput ? 'CONFIRM YOUR EMAIL' : isProcessingLink ? 'VERIFYING LINK...' : 'CHECK YOUR INBOX'}
          </h1>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            {needsEmailInput
              ? 'Please confirm the email address you used to request your sign-in link.'
              : isProcessingLink
              ? 'Signing you in via your login link...'
              : 'We sent a sign-in link to your email. Click the link in the email to continue.'}
          </p>
        </div>

        {error && (
          <div className="p-3 border border-[#E50914] bg-red-950/50 text-[#FF6B6B] text-xs flex items-center gap-2">
            <GrungeGlyph name="alert" className="w-4 h-4 shrink-0 text-[#E50914]" />
            <span>{error}</span>
          </div>
        )}

        {statusMessage && (
          <div className="p-3 border border-emerald-500 bg-emerald-950/50 text-emerald-200 text-xs flex items-center gap-2">
            <GrungeGlyph name="check" className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Case 1: Processing Link Loading State */}
        {isProcessingLink && (
          <div className="py-4">
            <PunkLoader
              label="SIGNING IN"
              sublabel="CHECKING LINK..."
              size="md"
            />
          </div>
        )}

        {/* Case 2: User opened magic link on a different device and needs to enter email */}
        {needsEmailInput && (
          <form onSubmit={handleManualEmailSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase text-[11px] text-neutral-400 mb-1 font-bold">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 bg-[#141414] border border-neutral-700 focus:border-[#E50914] text-white outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#E50914] hover:bg-white hover:text-black text-white font-heading font-black text-xs uppercase tracking-wider transition-all border border-[#E50914] flex items-center justify-center gap-2 stencil-cut"
            >
              <span>COMPLETE SIGN IN</span>
              <GrungeGlyph name="arrow-right" className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Case 3: Registration email confirmation prompt */}
        {!isProcessingLink && !needsEmailInput && (
          <div className="space-y-4">
            <div className="p-4 bg-[#141414] border border-neutral-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <GrungeGlyph name="mail" className="w-4 h-4 text-[#E50914]" />
                <span>Next steps:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-[11px] leading-relaxed">
                <li>Check your email inbox.</li>
                <li>Look for an email from <strong>Project S.H.E.</strong></li>
                <li>Click the link in the email to sign in.</li>
              </ol>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="group w-full py-3 bg-transparent hover:bg-neutral-900 text-white font-mono text-xs font-bold uppercase tracking-wider border border-neutral-700 hover:border-neutral-500 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <GrungeGlyph
                  name="loader"
                  className={`w-3.5 h-3.5 ${
                    resendCooldown > 0
                      ? 'animate-spin text-[#E50914]'
                      : 'text-neutral-400 group-hover:text-white group-hover:rotate-180 transition-transform duration-500'
                  }`}
                />
                <span>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}
                </span>
              </button>

              <Link
                href="/dashboard"
                className="w-full py-3 bg-[#E50914] hover:bg-white hover:text-black text-white font-heading font-black text-xs uppercase tracking-wider transition-all border border-[#E50914] flex items-center justify-center gap-2 stencil-cut"
              >
                <span>Go to Dashboard</span>
                <GrungeGlyph name="arrow-right" className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400">
          Prefer password authentication?{' '}
          <Link href="/auth/login" className="text-[#E50914] font-bold hover:underline">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}
