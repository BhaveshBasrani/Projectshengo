'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import GrungeGlyph from '@/components/ui/GrungeGlyph';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscribeUpdates, setSubscribeUpdates] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 letters or numbers.');
      return;
    }

    setLoading(true);
    try {
      const result = await register(email, password, displayName.trim(), subscribeUpdates);
      if (result?.needVerification) {
        router.push('/auth/verify');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err?.message || 'Google sign-in was canceled or failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-md mx-auto min-h-[85vh] flex flex-col justify-center select-none font-mono">
      <div className="bg-[#0E0E0E] text-[#F4F1EA] border-2 border-[#E50914] shadow-[8px_8px_0px_0px_#E50914] p-6 sm:p-8 space-y-6">
        
        <div className="space-y-1 text-center">
          <span className="text-[10px] text-[#E50914] uppercase tracking-widest font-black block">
            JOIN PROJECT S.H.E.
          </span>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tight text-white">
            CREATE ACCOUNT
          </h1>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Create an account to submit reviews, receive resources, and stay connected.
          </p>
        </div>


        {error && (
          <div className="p-3 border border-[#E50914] bg-red-950/50 text-[#FF6B6B] text-xs flex items-center gap-2">
            <GrungeGlyph name="alert" className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase text-[11px] text-neutral-400 mb-1 font-bold">
              Display Name *
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Maya S."
              className="w-full p-3 bg-[#141414] border border-neutral-700 focus:border-[#E50914] text-white outline-none"
            />
          </div>

          <div>
            <label className="block uppercase text-[11px] text-neutral-400 mb-1 font-bold">
              Email Address *
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

          <div>
            <label className="block uppercase text-[11px] text-neutral-400 mb-1 font-bold">
              Password (at least 6 letters) *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-[#141414] border border-neutral-700 focus:border-[#E50914] text-white outline-none"
            />
          </div>

          {/* Email Subscription Option */}
          <div
            onClick={() => setSubscribeUpdates(!subscribeUpdates)}
            className="flex items-start gap-2.5 p-3 bg-[#141414] border border-neutral-800 cursor-pointer hover:border-neutral-600 transition-colors"
          >
            <button type="button" className="text-[#E50914] mt-0.5">
              {subscribeUpdates ? (
                <GrungeGlyph name="check" className="w-4 h-4 text-[#E50914]" />
              ) : (
                <span className="w-4 h-4 border border-neutral-600 inline-block" />
              )}
            </button>
            <div className="text-[11px] leading-tight">
              <span className="text-white font-bold block">Sign up for our newsletter</span>
              <span className="text-neutral-500 text-[10px]">
                Get our updates, events, and stories in your inbox. You can unsubscribe anytime.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E50914] hover:bg-white hover:text-black text-white font-heading font-black text-sm uppercase tracking-wider transition-all border border-[#E50914] shadow-[4px_4px_0px_0px_#000000] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <GrungeGlyph name="arrow-right" className="w-4 h-4" />
            <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
          </button>
        </form>

        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-neutral-800 w-full" />
          <span className="bg-[#0E0E0E] px-3 text-[10px] text-neutral-500 uppercase tracking-widest absolute">
            OR
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 bg-[#141414] hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all border border-neutral-700 hover:border-neutral-500 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#E50914] font-bold underline">
            Sign In
          </Link>
        </div>


      </div>
    </div>
  );
}
