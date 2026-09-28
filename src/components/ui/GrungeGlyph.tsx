'use client';

import React from 'react';

export type GlyphName =
  | 'star'
  | 'star-half'
  | 'star-outline'
  | 'heart'
  | 'heart-outline'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-down'
  | 'external'
  | 'menu'
  | 'close'
  | 'check'
  | 'alert'
  | 'shield'
  | 'mail'
  | 'message'
  | 'calendar'
  | 'bell'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'copy'
  | 'lock'
  | 'quote'
  | 'user'
  | 'logout'
  | 'clock'
  | 'share'
  | 'trash'
  | 'send'
  | 'megaphone'
  | 'home'
  | 'phone'
  | 'map-pin'
  | 'instagram'
  | 'arrow-up'
  | 'barbed-wire'
  | 'spider-mark'
  | 'users'
  | 'settings'
  | 'plus'
  | 'edit'
  | 'upload'
  | 'refresh'
  | 'loader'
  | 'spinner'
  | 'eye'
  | 'key'
  | 'search'
  | 'activity'
  | 'user-x'
  | 'save'
  | 'archive'
  | 'file'
  | 'toggle-left'
  | 'toggle-right';

interface GrungeGlyphProps {
  name: GlyphName;
  className?: string;
  size?: number | string;
}

/**
 * Project S.H.E. Bespoke Cyber-Grunge Glyph System
 * Replaces generic Lucide icons with sharp, brutalist, Y2K punk stencil glyphs.
 */
export default function GrungeGlyph({ name, className = 'w-4 h-4', size }: GrungeGlyphProps) {
  const sizeStyle = size ? { width: size, height: size } : undefined;

  switch (name) {
    case 'star':
      // 4-point cyber razor star
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      );

    case 'star-outline':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
        </svg>
      );

    case 'heart':
      // Solid bold brutalist heart
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );

    case 'arrow-right':
      // Razor angled stencil arrow
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 12H20M14 6L20 12L14 18" />
        </svg>
      );

    case 'arrow-left':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 12H4M10 6L4 12L10 18" />
        </svg>
      );

    case 'arrow-down':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 4V20M6 14L12 20L18 14" />
        </svg>
      );

    case 'external':
      // Angular stencil corner dart [↗]
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 17L17 7M17 7H9M17 7V15" />
        </svg>
      );

    case 'menu':
      // Triple slash barcode brutalist menu
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="5" width="20" height="2.5" />
          <rect x="2" y="11" width="14" height="2.5" />
          <rect x="2" y="17" width="20" height="2.5" />
        </svg>
      );

    case 'close':
      // Razor X
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 5L19 19M19 5L5 19" />
        </svg>
      );

    case 'check':
      // Heavy stencil checkmark
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 13L9 18L20 6" />
        </svg>
      );

    case 'alert':
      // Brutalist hazard triangle with slash exclamation
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L1 21H23L12 2ZM11 8H13V14H11V8ZM11 16H13V18H11V16Z" />
        </svg>
      );

    case 'shield':
      // Cyber crest with gothic cross
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L3 6V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V6L12 2Z" fill="#000000" />
          <path d="M12 7V17M8 11H16" stroke="currentColor" strokeWidth="2" />
        </svg>
      );

    case 'mail':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="4" width="20" height="16" />
          <path d="M2 6L12 14L22 6" />
        </svg>
      );

    case 'message':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 3H22V17H6L2 21V3ZM4 5V15.5L6.5 13H20V5H4Z" />
        </svg>
      );

    case 'calendar':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="4" width="20" height="18" />
          <path d="M2 9H22M8 2V5M16 2V5" strokeWidth="2" />
        </svg>
      );

    case 'bell':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C10.34 2 9 3.34 9 5V5.29C6.71 6.36 5 8.97 5 12V17L3 19V20H21V19L19 17V12C19 8.97 17.29 6.36 15 5.29V5C15 3.34 13.66 2 12 2ZM10 21C10 22.1 10.9 23 12 23C13.1 23 14 22.1 14 21H10Z" />
        </svg>
      );

    case 'chevron-left':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15 19L7 12L15 5" />
        </svg>
      );

    case 'chevron-right':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 5L17 12L9 19" />
        </svg>
      );

    case 'chevron-down':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 9L12 15L18 9" />
        </svg>
      );

    case 'logout':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 21H5C4.4 21 4 20.6 4 20V4C4 3.4 4.4 3 5 3H9" />
          <path d="M16 17L21 12L16 7" />
          <path d="M21 12H9" />
        </svg>
      );

    case 'clock':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7V12L16 14" strokeWidth="2" strokeLinecap="square" />
        </svg>
      );

    case 'share':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
        </svg>
      );

    case 'trash':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 6H21" />
          <path d="M19 6V20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20V6" />
          <path d="M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6" />
          <path d="M10 11V16M14 11V16" />
        </svg>
      );

    case 'send':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      );

    case 'megaphone':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Cone */}
          <path d="M3 10C3 9.45 3.45 9 4 9H6.5L16 4V20L6.5 15H4C3.45 15 3 14.55 3 14V10Z" />
          {/* Handle */}
          <path d="M8 15V20C8 20.55 8.45 21 9 21H10.5C11.05 21 11.5 20.55 11.5 20V15.5L8 15Z" />
          {/* Horn Cap & Sound Wave */}
          <path d="M17.5 7.5C18.3 8.3 19 10 19 12C19 14 18.3 15.7 17.5 16.5V7.5Z" />
          <path d="M21 9C21.6 9.8 22 10.9 22 12C22 13.1 21.6 14.2 21 15V9Z" />
        </svg>
      );

    case 'home':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3L2 12H5V20H10V14H14V20H19V12H22L12 3Z" />
        </svg>
      );

    case 'copy':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="8" y="8" width="13" height="13" />
          <path d="M4 16H3V3H16V4" />
        </svg>
      );

    case 'lock':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17Z" />
        </svg>
      );

    case 'quote':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
        </svg>
      );

    case 'user':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M4 21C4 17 7.5 14 12 14C16.5 14 20 17 20 21" strokeWidth="2.5" />
        </svg>
      );

    case 'phone':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      );

    case 'map-pin':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      );

    case 'instagram':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="3" />
        </svg>
      );

    case 'arrow-up':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 19V5M5 12L12 5L19 12" />
        </svg>
      );

    case 'barbed-wire':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 12H24M7 8L9 16M9 8L7 16M15 8L17 16M17 8L15 16" />
        </svg>
      );

    case 'spider-mark':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2V6M12 18V22M2 12H6M18 12H22M5 5L8 8M16 16L19 19M19 5L16 8M8 16L5 19" stroke="currentColor" strokeWidth="2" />
        </svg>
      );

    case 'users':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="M20 8v6M23 11h-6" />
        </svg>
      );

    case 'settings':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="2" width="20" height="20" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
        </svg>
      );

    case 'plus':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 4v16M4 12h16" />
        </svg>
      );

    case 'edit':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      );

    case 'upload':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      );

    case 'refresh':
    case 'loader':
    case 'spinner':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          style={sizeStyle}
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
      );

    case 'eye':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      );

    case 'key':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="8" cy="15" r="5" />
          <path d="M11.5 11.5L21 2M16 7L18.5 9.5M18.5 4.5L21 7" />
        </svg>
      );

    case 'search':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );

    case 'activity':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );

    case 'user-x':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="18" y1="8" x2="23" y2="13" strokeWidth="2.5" />
          <line x1="23" y1="8" x2="18" y2="13" strokeWidth="2.5" />
        </svg>
      );

    case 'save':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      );

    case 'archive':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="21 8 21 21 3 21 3 8" />
          <rect x="1" y="3" width="22" height="5" />
          <line x1="10" y1="12" x2="14" y2="12" strokeWidth="2.5" />
        </svg>
      );

    case 'file':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );

    case 'toggle-left':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="5" width="22" height="14" rx="7" fill="#141414" />
          <circle cx="8" cy="12" r="4" fill="#666666" />
        </svg>
      );

    case 'toggle-right':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="5" width="22" height="14" rx="7" fill="#E50914" stroke="#E50914" />
          <circle cx="16" cy="12" r="4" fill="#FFFFFF" />
        </svg>
      );

    default:
      return null;
  }
}
