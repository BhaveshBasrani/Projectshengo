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
            r="10"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeOpacity="0.25"
          />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
          : 'p-6 sm:p-8'
      } ${className}`}
    >
      <div className="punk-loader-card p-8 sm:p-10 bg-[#0E0E0E] border border-[#333333] rounded-sm flex flex-col items-center space-y-5 max-w-sm w-full text-center relative z-10 transition-all">
        
        {/* Minimalist Emblem with subtle crimson breathing glow */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="punk-loader-glow absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(230,25,43,0.3)_0%,transparent_70%)] pointer-events-none" />
          <div className="relative w-12 h-12">
            <Image
              src="/assets/logo-clean.png"
              alt="Project S.H.E."
              fill
              sizes="48px"
              className="object-contain drop-shadow-[0_0_12px_rgba(230,25,43,0.4)]"
              priority
            />
          </div>
        </div>

        {/* Minimalist Label & Progress Percentage */}
        <div className="space-y-1.5 w-full">
          <div className="flex items-center justify-center gap-2">
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-white punk-loader-title">
              {label || 'PROJECT S.H.E.'}
            </span>
            <span className="text-[10px] font-mono text-[#E6192B]">•</span>
            <span className="font-mono text-xs font-semibold text-neutral-400 punk-loader-percent">
              {percent}%
            </span>
          </div>

          {sublabel && (
            <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider punk-loader-sublabel">
              {sublabel}
            </p>
          )}
        </div>

        {/* Hairline sleek progress bar */}
        <div className="w-full max-w-[200px] h-[3px] bg-[#222222] punk-loader-track overflow-hidden relative rounded-full">
          <div
            className="h-full bg-gradient-to-r from-red-700 via-[#E6192B] to-red-500 transition-all duration-200 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-500 punk-loader-tagline">
          SUPPORT • HELP • EMPOWER
        </span>
      </div>
    </div>
  );
}
