'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface PunkLoaderProps {
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

/**
 * Ultra-minimalist, sleek loader inspired by Resolve MUN.
 * Clean brand emblem, subtle red glow, hairline progress indicator.
 */
export default function PunkLoader({
  label,
  sublabel,
  size = 'md',
  className = '',
}: PunkLoaderProps) {
  const [percent, setPercent] = useState(18);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 98) return 98;
        const jump = Math.floor(Math.random() * 9) + 4;
        return Math.min(prev + jump, 98);
      });
    }, 180);

    return () => clearInterval(progressInterval);
  }, []);

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-2 font-mono text-xs text-neutral-300 ${className}`}>
        <svg
          className="w-3.5 h-3.5 animate-spin text-current shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth="2.75"
            strokeOpacity="0.25"
          />
          <path
            d="M12 2.5 A 9.5 9.5 0 0 1 21.5 12"
            stroke="currentColor"
            strokeWidth="2.75"
            strokeLinecap="round"
          />
        </svg>
        <span>{label || 'Loading...'}</span>
      </span>
    );
  }

  const isFull = size === 'full';

  return (
    <div
      className={`select-none flex flex-col items-center justify-center font-sans ${
        isFull
          ? 'min-h-[70vh] w-full px-4 py-16'
          : 'p-8 bg-[#080808] border border-neutral-900 text-neutral-200'
      } ${className}`}
    >
      <div className="flex flex-col items-center space-y-5 max-w-xs text-center relative z-10">
        
        {/* Minimalist Emblem with subtle crimson breathing glow */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(229,9,20,0.35)_0%,transparent_70%)] pointer-events-none" />
          <div className="relative w-12 h-12">
            <Image
              src="/assets/logo-clean.png"
              alt="Project S.H.E."
              fill
              sizes="48px"
              className="object-contain drop-shadow-[0_0_12px_rgba(229,9,20,0.5)]"
              priority
            />
          </div>
        </div>

        {/* Minimalist Label & Progress Percentage */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-white">
              {label || 'PROJECT S.H.E.'}
            </span>
            <span className="text-[10px] font-mono text-neutral-600">•</span>
            <span className="font-mono text-xs font-semibold text-neutral-400">
              {percent}%
            </span>
          </div>

          {sublabel && (
            <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
              {sublabel}
            </p>
          )}
        </div>

        {/* Hairline sleek progress bar */}
        <div className="w-44 h-[2px] bg-neutral-900 overflow-hidden relative rounded-full">
          <div
            className="h-full bg-gradient-to-r from-red-700 via-[#E50914] to-red-500 transition-all duration-200 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-600">
          SUPPORT • HELP • EMPOWER
        </span>
      </div>
    </div>
  );
}
