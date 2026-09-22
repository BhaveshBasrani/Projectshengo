'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import GrungeGlyph from '@/components/ui/GrungeGlyph';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, sendMagicLink } = useAuth();
  const [authMode, setAuthMode] = useState<'magic-link' | 'password'>('magic-link');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      if (email.toLowerCase() === 'admin@projectshe.org') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await sendMagicLink(email);
      setMagicLinkSent(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send sign-in link. Please try again.');
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
        
        {/* Header */}
        <div className="space-y-1 text-center">
          <span className="text-[10px] text-[#E50914] uppercase tracking-widest font-black block">
            ACCOUNT ACCESS
          </span>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tight text-white">
            SIGN IN
          </h1>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Welcome back. Choose how you would like to sign in below.
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="grid grid-cols-2 p-1 bg-[#141414] border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => { setAuthMode('magic-link'); setError(''); }}
            className={`py-2 text-center font-bold transition-colors flex items-center justify-center gap-1.5 ${
              authMode === 'magic-link'
                ? 'bg-[#E50914] text-white shadow-[2px_2px_0px_0px_#000000]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <GrungeGlyph name="mail" className="w-3.5 h-3.5" />
            <span>Email Link</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('password'); setError(''); }}
            className={`py-2 text-center font-bold transition-colors flex items-center justify-center gap-1.5 ${
              authMode === 'password'
                ? 'bg-[#E50914] text-white shadow-[2px_2px_0px_0px_#000000]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <GrungeGlyph name="lock" className="w-3.5 h-3.5" />
            <span>Password</span>
          </button>
        </div>

        {error && (
          <div className="p-3 border border-[#E50914] bg-red-950/50 text-[#FF6B6B] text-xs flex items-center gap-2">
            <GrungeGlyph name="alert" className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Method 1: Magic Link Form */}
        {authMode === 'magic-link' && (
          <div>
            {magicLinkSent ? (
              <div className="p-4 border border-emerald-500 bg-emerald-950/40 text-emerald-200 text-xs space-y-3 text-center stencil-cut">
                <GrungeGlyph name="check" className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-sm uppercase">Sign-in Link Sent!</h3>
                  <p className="text-[11px] text-emerald-300 font-sans leading-relaxed">
                    We sent a login link to <strong>{email}</strong>. Open your email and click the link to log in directly without a password.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMagicLinkSent(false)}
                  className="text-[10px] text-neutral-400 hover:text-white underline"
                >
                  Send to a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMagicLink} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase text-[11px] text-neutral-400 mb-1 font-bold">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full p-3 bg-[#141414] border border-neutral-700 focus:border-[#E50914] text-white outline-none"
                  />
                  <span className="text-[10px] text-neutral-500 block mt-1">
                    No password needed. We will email you an instant sign-in link.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#E50914] hover:bg-white hover:text-black text-white font-heading font-black text-xs uppercase tracking-wider transition-all border border-[#E50914] shadow-[4px_4px_0px_0px_#000000] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <GrungeGlyph name="mail" className="w-4 h-4" />
                  <span>{loading ? 'SENDING LINK...' : 'SEND MAGIC SIGN-IN LINK'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Method 2: Traditional Password Form */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
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
                className="w-full p-3 bg-[#141414] border border-neutral-700 focus:border-[#E50914] text-white outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="uppercase text-[11px] text-neutral-400 font-bold">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[10px] text-[#E50914] hover:underline"
                >
                  FORGOT PASSWORD?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-[#141414] border border-neutral-700 focus:border-[#E50914] text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E50914] hover:bg-white hover:text-black text-white font-heading font-black text-xs uppercase tracking-wider transition-all border border-[#E50914] shadow-[4px_4px_0px_0px_#000000] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <GrungeGlyph name="arrow-right" className="w-4 h-4" />
              <span>{loading ? 'SIGNING IN...' : 'SIGN IN WITH PASSWORD'}</span>
            </button>
          </form>
        )}

        {/* Google OAuth Provider */}
        <div className="relative flex items-center justify-center my-2">
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
          Don&apos;t have an account yet?{' '}
          <Link href="/auth/register" className="text-[#E50914] font-bold underline">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}
