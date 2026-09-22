'use client';

import React from 'react';
import Image from 'next/image';

interface PunkLoaderProps {
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

/**
 * Proper, Sleek Brutalist Loader for Project S.H.E.
 * Clean, fast, high-contrast, non-AI, zero gimmick clutter.
 */
export default function PunkLoader({
  label = 'Loading...',
  sublabel,
  size = 'md',
  className = '',
}: PunkLoaderProps) {
  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-2 font-mono text-xs font-bold text-white ${className}`}>
        <span className="w-3.5 h-3.5 relative inline-block animate-spin [animation-duration:2s]">
          <Image
            src="/assets/punk-red-spiral-star-clean.png"
            alt="*"
            fill
            sizes="14px"
            className="object-contain"
          />
        </span>
        <span>{label}</span>
      </span>
    );
  }

  const isFull = size === 'full';

  return (
    <div
      className={`font-mono select-none flex flex-col items-center justify-center ${
        isFull
          ? 'min-h-[60vh] w-full px-4 py-16'
          : 'p-6 bg-[#0E0E0E] border-2 border-neutral-800 text-[#F4F1EA] shadow-[6px_6px_0px_0px_#000000]'
      } ${className}`}
    >
      <div className="flex flex-col items-center space-y-4 max-w-xs text-center">
        
        {/* Clean Rotating Punk Star Core */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 animate-spin [animation-duration:3s]">
          <Image
            src="/assets/punk-red-spiral-star-clean.png"
            alt="Loading"
            fill
            sizes="56px"
            className="object-contain drop-shadow-[0_0_8px_rgba(229,9,20,0.6)]"
            priority
          />
        </div>

        {/* Brand & Loading Label */}
        <div className="space-y-1">
          <span className="font-heading font-black text-sm uppercase tracking-widest text-[#E50914] block">
            PROJECT S.H.E.
          </span>
          <p className="font-mono text-xs text-neutral-300 font-bold">
            {label}
          </p>
          {sublabel && (
            <p className="font-sans text-[11px] text-neutral-500">
              {sublabel}
            </p>
          )}
        </div>

        {/* Dynamic White Progress Loader */}
        <div className="w-40 h-1 bg-neutral-900 border border-neutral-800 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-[#EDEDED] shadow-[0_0_10px_#ffffff] animate-[loader-slide_1.5s_ease-in-out_infinite] w-1/2" />
        </div>

      </div>
    </div>
  );
}
