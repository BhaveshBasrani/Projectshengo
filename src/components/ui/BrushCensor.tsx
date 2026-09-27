'use client';

import React from 'react';

interface BrushCensorProps {
  children: React.ReactNode;
  className?: string;
  tilt?: number; // degrees of tilt, e.g. -0.5 to 1.5
}

/**
 * BrushCensor renders a sensitive word with a thin, authentic
 * red dry-brush strike-through line across its center, ensuring the word
 * remains clearly legible while visually struck off with high impact.
 */
export default function BrushCensor({
  children,
  className = '',
  tilt = -0.5,
}: BrushCensorProps) {
  return (
    <span
      className={`relative inline-block px-1 align-baseline whitespace-nowrap select-none ${className}`}
      title="Campaign struck-through term"
    >
      {/* Base text - Crisp, fully visible and readable */}
      <span className="relative z-10 text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {children}
      </span>

      {/* Thin red dry-brush strike-through line across the center */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-1.5 -right-2 top-[55%] -translate-y-1/2 h-[3.5px] sm:h-[4.5px] z-20 block"
        style={{
          transform: `translateY(-50%) rotate(${tilt}deg) scaleX(1.12)`,
          backgroundImage: "url('/assets/red-brush-stroke.svg')",
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.95,
          filter: 'drop-shadow(0 0 1.5px rgba(229,9,20,0.6))',
        }}
      />
    </span>
  );
}
