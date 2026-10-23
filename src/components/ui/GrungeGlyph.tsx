'use client';

import React from 'react';
import {
  RiStarFill,
  RiStarHalfFill,
  RiStarLine,
  RiHeartFill,
  RiHeartLine,
  RiMenuLine,
  RiCloseLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiShieldCheckFill,
  RiMailLine,
  RiMessage3Line,
  RiCalendarLine,
  RiNotification3Line,
  RiFileCopyLine,
  RiLockFill,
  RiDoubleQuotesL,
  RiUser3Fill,
  RiLogoutBoxRLine,
  RiTimeLine,
  RiShareForwardLine,
  RiDeleteBin6Line,
  RiSendPlaneFill,
  RiMegaphoneFill,
  RiHome4Line,
  RiPhoneLine,
  RiMapPin2Line,
  RiInstagramLine,
  RiTeamLine,
  RiSettings4Line,
  RiAddLine,
  RiEdit2Line,
  RiUploadCloud2Line,
  RiRefreshLine,
  RiLoader4Line,
  RiEyeLine,
  RiKey2Line,
  RiSearchLine,
  RiPulseLine,
  RiUserUnfollowLine,
  RiSave3Line,
  RiArchiveLine,
  RiFileTextLine,
  RiToggleLine,
  RiToggleFill,
  RiPushpin2Fill,
  RiPlayFill,
  RiPauseFill,
  RiHeadphoneFill,
  RiDiscFill,
  RiSparklingFill,
  RiChat3Fill,
} from 'react-icons/ri';
import {
  HiArrowRight,
  HiArrowLeft,
  HiArrowDown,
  HiArrowUp,
  HiArrowTopRightOnSquare,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown,
} from 'react-icons/hi2';
import { FaSkull, FaFire, FaBolt, FaThumbtack, FaLock, FaBullhorn } from 'react-icons/fa6';

export type GlyphName =
  | 'star'
  | 'star-half'
  | 'star-outline'
  | 'heart'
  | 'heart-outline'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-down'
  | 'arrow-up'
  | 'external'
  | 'menu'
  | 'close'
  | 'check'
  | 'alert'
  | 'shield'
  | 'mail'
  | 'message'
  | 'chat'
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
  | 'toggle-right'
  | 'pin'
  | 'play'
  | 'pause'
  | 'headphones'
  | 'disc'
  | 'sparkle'
  | 'skull'
  | 'fire'
  | 'bolt';

interface GrungeGlyphProps {
  name: GlyphName;
  className?: string;
  size?: number | string;
}

/**
 * Project S.H.E. Cyber-Punk & Grunge Glyph System
 * Powered by Remix Icons & FontAwesome 6 (zero Lucide, zero emojis).
 */
export default function GrungeGlyph({ name, className = 'w-4 h-4', size }: GrungeGlyphProps) {
  const sizeStyle = size ? { width: size, height: size } : undefined;

  switch (name) {
    case 'star':
      return <RiStarFill className={className} style={sizeStyle} />;
    case 'star-half':
      return <RiStarHalfFill className={className} style={sizeStyle} />;
    case 'star-outline':
      return <RiStarLine className={className} style={sizeStyle} />;
    case 'heart':
      return <RiHeartFill className={className} style={sizeStyle} />;
    case 'heart-outline':
      return <RiHeartLine className={className} style={sizeStyle} />;
    case 'arrow-right':
      return <HiArrowRight className={className} style={sizeStyle} />;
    case 'arrow-left':
      return <HiArrowLeft className={className} style={sizeStyle} />;
    case 'arrow-down':
      return <HiArrowDown className={className} style={sizeStyle} />;
    case 'arrow-up':
      return <HiArrowUp className={className} style={sizeStyle} />;
    case 'external':
      return <HiArrowTopRightOnSquare className={className} style={sizeStyle} />;
    case 'menu':
      return <RiMenuLine className={className} style={sizeStyle} />;
    case 'close':
      return <RiCloseLine className={className} style={sizeStyle} />;
    case 'check':
      return <RiCheckLine className={className} style={sizeStyle} />;
    case 'alert':
      return <RiErrorWarningLine className={className} style={sizeStyle} />;
    case 'shield':
      return <RiShieldCheckFill className={className} style={sizeStyle} />;
    case 'mail':
      return <RiMailLine className={className} style={sizeStyle} />;
    case 'message':
    case 'chat':
      return <RiChat3Fill className={className} style={sizeStyle} />;
    case 'calendar':
      return <RiCalendarLine className={className} style={sizeStyle} />;
    case 'bell':
      return <RiNotification3Line className={className} style={sizeStyle} />;
    case 'chevron-left':
      return <HiChevronLeft className={className} style={sizeStyle} />;
    case 'chevron-right':
      return <HiChevronRight className={className} style={sizeStyle} />;
    case 'chevron-down':
      return <HiChevronDown className={className} style={sizeStyle} />;
    case 'copy':
      return <RiFileCopyLine className={className} style={sizeStyle} />;
    case 'lock':
      return <RiLockFill className={className} style={sizeStyle} />;
    case 'quote':
      return <RiDoubleQuotesL className={className} style={sizeStyle} />;
    case 'user':
      return <RiUser3Fill className={className} style={sizeStyle} />;
    case 'logout':
      return <RiLogoutBoxRLine className={className} style={sizeStyle} />;
    case 'clock':
      return <RiTimeLine className={className} style={sizeStyle} />;
    case 'share':
      return <RiShareForwardLine className={className} style={sizeStyle} />;
    case 'trash':
      return <RiDeleteBin6Line className={className} style={sizeStyle} />;
    case 'send':
      return <RiSendPlaneFill className={className} style={sizeStyle} />;
    case 'megaphone':
      return <RiMegaphoneFill className={className} style={sizeStyle} />;
    case 'home':
      return <RiHome4Line className={className} style={sizeStyle} />;
    case 'phone':
      return <RiPhoneLine className={className} style={sizeStyle} />;
    case 'map-pin':
      return <RiMapPin2Line className={className} style={sizeStyle} />;
    case 'instagram':
      return <RiInstagramLine className={className} style={sizeStyle} />;
    case 'users':
      return <RiTeamLine className={className} style={sizeStyle} />;
    case 'settings':
      return <RiSettings4Line className={className} style={sizeStyle} />;
    case 'plus':
      return <RiAddLine className={className} style={sizeStyle} />;
    case 'edit':
      return <RiEdit2Line className={className} style={sizeStyle} />;
    case 'upload':
      return <RiUploadCloud2Line className={className} style={sizeStyle} />;
    case 'refresh':
      return <RiRefreshLine className={className} style={sizeStyle} />;
    case 'loader':
    case 'spinner':
      return <RiLoader4Line className={`animate-spin ${className}`} style={sizeStyle} />;
    case 'eye':
      return <RiEyeLine className={className} style={sizeStyle} />;
    case 'key':
      return <RiKey2Line className={className} style={sizeStyle} />;
    case 'search':
      return <RiSearchLine className={className} style={sizeStyle} />;
    case 'activity':
      return <RiPulseLine className={className} style={sizeStyle} />;
    case 'user-x':
      return <RiUserUnfollowLine className={className} style={sizeStyle} />;
    case 'save':
      return <RiSave3Line className={className} style={sizeStyle} />;
    case 'archive':
      return <RiArchiveLine className={className} style={sizeStyle} />;
    case 'file':
      return <RiFileTextLine className={className} style={sizeStyle} />;
    case 'toggle-left':
      return <RiToggleLine className={className} style={sizeStyle} />;
    case 'toggle-right':
      return <RiToggleFill className={className} style={sizeStyle} />;
    case 'pin':
      return <RiPushpin2Fill className={className} style={sizeStyle} />;
    case 'play':
      return <RiPlayFill className={className} style={sizeStyle} />;
    case 'pause':
      return <RiPauseFill className={className} style={sizeStyle} />;
    case 'headphones':
      return <RiHeadphoneFill className={className} style={sizeStyle} />;
    case 'disc':
      return <RiDiscFill className={className} style={sizeStyle} />;
    case 'sparkle':
      return <RiSparklingFill className={className} style={sizeStyle} />;
    case 'skull':
      return <FaSkull className={className} style={sizeStyle} />;
    case 'fire':
      return <FaFire className={className} style={sizeStyle} />;
    case 'bolt':
      return <FaBolt className={className} style={sizeStyle} />;

    // Custom SVG stencil art
    case 'barbed-wire':
      return (
        <svg
          viewBox="0 0 48 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          style={sizeStyle}
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0" y1="8" x2="48" y2="8" strokeWidth="2.5" />
          <path d="M12 4L16 12M16 4L12 12" strokeWidth="2" strokeLinecap="square" />
          <path d="M32 4L36 12M36 4L32 12" strokeWidth="2" strokeLinecap="square" />
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
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="12" cy="7" r="2" />
          <path
            d="M9 11C6 9 4 6 3 2M15 11C18 9 20 6 21 2M9 13C6 15 3 19 2 22M15 13C18 15 21 19 22 22"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    default:
      return null;
  }
}
