'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Synthesizes a cinematic sub-bass impact boom and harmonic swell
 * using pure Web Audio API without requiring any external audio files.
 */
function playCinematicBoom() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Sub-bass impact oscillator
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 1.4);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.8, now + 0.06);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 2.9);

    // Red distortion harmonics
    const distOsc = ctx.createOscillator();
    const distGain = ctx.createGain();
    distOsc.type = 'sawtooth';
    distOsc.frequency.setValueAtTime(80, now);
    distOsc.frequency.exponentialRampToValueAtTime(35, now + 1.2);

    distGain.gain.setValueAtTime(0.001, now);
    distGain.gain.linearRampToValueAtTime(0.12, now + 0.08);
    distGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    distOsc.connect(distGain);
    distGain.connect(ctx.destination);
    distOsc.start(now);
    distOsc.stop(now + 2.1);

    // Ethereal high harmonic shimmer
    const highOsc = ctx.createOscillator();
    const highGain = ctx.createGain();
    highOsc.type = 'triangle';
    highOsc.frequency.setValueAtTime(440, now);
    highOsc.frequency.exponentialRampToValueAtTime(220, now + 2.5);

    highGain.gain.setValueAtTime(0.001, now);
    highGain.gain.linearRampToValueAtTime(0.2, now + 0.3);
    highGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

    highOsc.connect(highGain);
    highGain.connect(ctx.destination);
    highOsc.start(now + 0.05);
    highOsc.stop(now + 3.3);
  } catch {
    // Autoplay restrictions or unsupported; safe fallback
  }
}

/**
 * Executes the full-screen cinematic sequence matching the Resolve MUN
 * Easter Egg architecture, styled in crimson red with "PROJECT S.H.E."
 */
export function triggerCinematicSHE() {
  if (typeof document === 'undefined') return;

  // Prevent multiple overlapping overlays
  const existing = document.querySelector('.she-event-overlay');
  if (existing) existing.remove();

  playCinematicBoom();

  // --- STRICT VIEWPORT-LOCKED OVERLAY ---
  const overlay = document.createElement('div');
  overlay.className = 'she-event-overlay';

  // Attach to documentElement to guarantee top-level viewport coordinate system
  document.documentElement.appendChild(overlay);

  // Background radial red glow with heavy backdrop blur
  const bg = document.createElement('div');
  bg.className = 'she-event-bg';
  overlay.appendChild(bg);

  // Center Content Container
  const content = document.createElement('div');
  content.style.position = 'relative';
  content.style.zIndex = '15';
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.alignItems = 'center';
  content.style.justifyContent = 'center';
  content.style.textAlign = 'center';
  content.style.padding = '0 1rem';
  content.style.maxWidth = '92vw';
  content.style.boxSizing = 'border-box';
  overlay.appendChild(content);

  // Main S.H.E. Emblem
  const emblem = document.createElement('img');
  emblem.src = '/assets/logo-clean.png';
  emblem.alt = 'Project S.H.E.';
  emblem.style.width = 'clamp(70px, 12vw, 130px)';
  emblem.style.height = 'clamp(70px, 12vw, 130px)';
  emblem.style.objectFit = 'contain';
  emblem.style.filter = 'drop-shadow(0 0 35px rgba(229, 9, 20, 0.9))';
  emblem.style.opacity = '0';
  emblem.style.transform = 'scale(0.8)';
  content.appendChild(emblem);

  // Main Cinematic Headline: "PROJECT S.H.E."
  const text = document.createElement('h1');
  text.className = 'she-event-text';
  text.textContent = 'PROJECT S.H.E.';
  content.appendChild(text);

  // Subtext: "SARVA NIRBHAYA FOUNDATION"
  const subtext = document.createElement('p');
  subtext.className = 'she-event-subtext';
  subtext.textContent = 'SARVA NIRBHAYA FOUNDATION • HYDERABAD';
  content.appendChild(subtext);

  // Cinematic Red Scanlines (strictly centered with vertical sweep)
  for (let i = 0; i < 3; i++) {
    const line = document.createElement('div');
    line.className = 'she-event-line';
    line.style.position = 'absolute';
    line.style.top = '50%';
    line.style.left = '0';
    line.style.marginTop = `${(i - 1) * 22}px`;
    overlay.appendChild(line);

    line.animate(
      [
        { transform: 'translateY(-28vh) scaleX(0.4)', opacity: 0 },
        { transform: 'translateY(0) scaleX(1)', opacity: 0.95, offset: 0.5 },
        { transform: 'translateY(28vh) scaleX(0.4)', opacity: 0 },
      ],
      {
        duration: 2500,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        delay: i * 200,
      }
    );
  }

  // Core Animations (5 seconds duration)
  bg.animate(
    [
      { opacity: 0, backdropFilter: 'blur(0px) contrast(1)' },
      { opacity: 1, backdropFilter: 'blur(16px) contrast(1.3)', offset: 0.1 },
      { opacity: 1, backdropFilter: 'blur(16px) contrast(1.3)', offset: 0.85 },
      { opacity: 0, backdropFilter: 'blur(0px) contrast(1)' },
    ],
    { duration: 5000 }
  );

  emblem.animate(
    [
      { opacity: 0, transform: 'scale(0.6) translateY(20px)' },
      { opacity: 1, transform: 'scale(1.05) translateY(0)', offset: 0.15 },
      { opacity: 1, transform: 'scale(1) translateY(0)', offset: 0.8 },
      { opacity: 0, transform: 'scale(1.15) translateY(-20px)' },
    ],
    { duration: 5000, easing: 'cubic-bezier(0.19, 1, 0.22, 1)' }
  );

  text.animate(
    [
      { opacity: 0, transform: 'scale(0.85)', filter: 'blur(25px)', letterSpacing: 'clamp(0.4rem, 2vw, 1.5rem)' },
      { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)', letterSpacing: 'clamp(0.15rem, 1.2vw, 0.8rem)', offset: 0.15 },
      { opacity: 1, transform: 'scale(1.02)', filter: 'blur(0px)', letterSpacing: 'clamp(0.15rem, 1.1vw, 0.75rem)', offset: 0.8 },
      { opacity: 0, transform: 'scale(1.1)', filter: 'blur(40px)', letterSpacing: 'clamp(0.1rem, 0.6vw, 0.4rem)' },
    ],
    { duration: 5000, easing: 'cubic-bezier(0.19, 1, 0.22, 1)' }
  );

  subtext.animate(
    [
      { opacity: 0, transform: 'translateY(15px)' },
      { opacity: 1, transform: 'translateY(0)', offset: 0.2 },
      { opacity: 1, transform: 'translateY(0)', offset: 0.8 },
      { opacity: 0, transform: 'translateY(-15px)' },
    ],
    { duration: 5000, easing: 'ease-out' }
  );

  // 60 Velocity particles - luminous red streaks
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'she-event-particle';
    p.style.position = 'absolute';
    const left = Math.random() * 100;
    const delay = Math.random() * 1500;
    p.style.left = `${left}%`;
    p.style.top = '-15%';
    overlay.appendChild(p);

    p.animate(
      [
        { transform: 'translateY(0) scaleY(1)', opacity: 0 },
        { transform: 'translateY(115vh) scaleY(4.5)', opacity: 0.9 },
      ],
      {
        duration: 1000 + Math.random() * 1000,
        easing: 'linear',
        delay,
      }
    );
  }

  // Cleanup after 5.2s
  const cleanupTimeout = setTimeout(() => {
    overlay.remove();
  }, 5200);

  // Filter Flash - Cinematic Red-Shifted Transition
  document.body.animate(
    [
      { filter: 'brightness(1) saturate(1)' },
      { filter: 'brightness(1.9) saturate(2.2) contrast(1.4) drop-shadow(0 0 40px #e50914)', offset: 0.1 },
      { filter: 'brightness(1.4) saturate(1.4) contrast(1.2)', offset: 0.8 },
      { filter: 'brightness(1) saturate(1)' },
    ],
    { duration: 5000 }
  );

  // Dismiss on click or Escape
  const dismissHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      clearTimeout(cleanupTimeout);
      overlay.remove();
      window.removeEventListener('keydown', dismissHandler);
    }
  };
  window.addEventListener('keydown', dismissHandler);

  overlay.style.pointerEvents = 'auto';
  overlay.style.cursor = 'pointer';
  overlay.onclick = () => {
    clearTimeout(cleanupTimeout);
    overlay.remove();
    window.removeEventListener('keydown', dismissHandler);
  };
}

export default function CinematicEasterEgg() {
  const sheBufferRef = useRef<string>('');

  useEffect(() => {
    // Expose globally for testing or console access
    if (typeof window !== 'undefined') {
      (window as any).triggerCinematicSHE = triggerCinematicSHE;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return;

      // Ignore keystrokes when typing inside inputs, textareas, or contenteditables
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Sequential detection of "s" -> "h" -> "e" (identical to Resolve MUN logic)
      if ('she'.includes(key)) {
        const expected = 'she'[sheBufferRef.current.length];
        if (key === expected) {
          sheBufferRef.current += key;
          if (sheBufferRef.current === 'she') {
            triggerCinematicSHE();
            sheBufferRef.current = '';
          }
        } else {
          sheBufferRef.current = key === 's' ? 's' : '';
        }
      } else {
        sheBufferRef.current = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}
