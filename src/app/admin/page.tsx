'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import {
  PublicReview,
  SuggestionFeedback,
  SiteUpdate,
  SiteSettings,
  GalleryItem,
  VisitorLog,
  TeamAccessLog,
  DEFAULT_SITE_SETTINGS,
} from '@/lib/types';
import {
  HiCheck,
  HiXMark,
  HiTrash,
  HiPlus,
  HiArrowTopRightOnSquare,
  HiArrowRightOnRectangle,
  HiEye,
  HiEyeSlash,
  HiPencilSquare,
  HiShieldExclamation,
  HiUserGroup,
  HiBars3,
  HiChevronLeft,
  HiChevronRight,
  HiMagnifyingGlass,
  HiArrowPath,
  HiChatBubbleBottomCenterText,
  HiMegaphone,
  HiInbox,
  HiPhoto,
  HiSun,
  HiMoon,
  HiQrCode,
} from 'react-icons/hi2';

export default function TeamHubPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<
    'site_text' | 'gallery' | 'insights' | 'reviews' | 'notices' | 'messages'
  >('site_text');

  // Theme detection & preview
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const isL =
        document.documentElement.getAttribute('data-theme') === 'light' ||
        document.documentElement.classList.contains('light');
      setIsLight(isL);
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });
    window.addEventListener('theme-changed', checkTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener('theme-changed', checkTheme);
    };
  }, []);

  const togglePreviewTheme = (newTheme: 'dark' | 'light') => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('project-she-theme', newTheme);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: newTheme } }));
    setIsLight(newTheme === 'light');
  };

  // Mobile sidebar toggle
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Authentication states
  const [adminSecret, setAdminSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [keyInput, setKeyInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showKeyText, setShowKeyText] = useState(false);

  // Data states - populated with safe defaults
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [feedback, setFeedback] = useState<SuggestionFeedback[]>([]);
  const [updates, setUpdates] = useState<SiteUpdate[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);
  const [teamAccessLogs, setTeamAccessLogs] = useState<TeamAccessLog[]>([]);
  const [registeredUsersCount, setRegisteredUsersCount] = useState<number>(0);

  // Site Text & Links state (initialized directly with DEFAULT_SITE_SETTINGS)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ ...DEFAULT_SITE_SETTINGS });
  const [savingSettings, setSavingSettings] = useState(false);

  // Gallery state
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<'ALL' | 'BOTB 2.0'>('ALL');
  const [gallerySearchQuery, setGallerySearchQuery] = useState('');
  const [galleryPage, setGalleryPage] = useState(1);
  const photosPerPage = 36;

  // Add Photo form state
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [newPhotoSrc, setNewPhotoSrc] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<'BOTB 2.0'>('BOTB 2.0');
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);

  // General loading & notice
  const [loadingData, setLoadingData] = useState(false);
  const [clearingWaste, setClearingWaste] = useState(false);
  const [statusNotice, setStatusNotice] = useState('');

  // Review tab filter
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  // New Notice form states
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('Announcement');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeLinkUrl, setNewNoticeLinkUrl] = useState('');
  const [newNoticeLinkText, setNewNoticeLinkText] = useState('Read Details');
  const [isSubmittingNotice, setIsSubmittingNotice] = useState(false);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(''), 4000);
  };

  // --- PASSKEY AUTHENTICATION ---
  useEffect(() => {
    const saved = sessionStorage.getItem('she_team_passkey');
    if (saved) {
      setAdminSecret(saved);
      verifySecret(saved);
    } else {
      setAuthChecking(false);
    }
  }, []);

  const verifySecret = async (secretToTest: string) => {
    setAuthChecking(true);
    setLoginError('');
    try {
      const trimmedKey = secretToTest.trim();
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': trimmedKey,
        },
        body: JSON.stringify({
          secret: trimmedKey,
          password: trimmedKey,
          passkey: trimmedKey,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAdminSecret(secretToTest.trim());
        sessionStorage.setItem('she_team_passkey', secretToTest.trim());
        loadAllData(secretToTest.trim());
      } else {
        setIsAuthenticated(false);
        sessionStorage.removeItem('she_team_passkey');
        setLoginError(data.error || 'Invalid passkey. Access denied.');
      }
    } catch {
      setLoginError('Unable to connect to verification server.');
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    verifySecret(keyInput.trim());
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('she_team_passkey');
    setAdminSecret('');
    setIsAuthenticated(false);
    setKeyInput('');
    if (user) logout();
  };

  const getHeaders = (token?: string) => ({
    'Content-Type': 'application/json',
    'x-admin-secret': token || adminSecret,
    Authorization: `Bearer ${token || adminSecret}`,
  });

  // --- LOAD ALL DATA ---
  const loadAllData = async (token?: string) => {
    const activeKey = token || adminSecret;
    if (!activeKey) return;
    setLoadingData(true);

    try {
      const [
        settingsRes,
        galleryRes,
        insightsRes,
        reviewsRes,
        updatesRes,
        feedbackRes,
        usersRes,
      ] = await Promise.allSettled([
        fetch('/api/admin/settings', { headers: getHeaders(activeKey) }),
        fetch('/api/admin/gallery', { headers: getHeaders(activeKey) }),
        fetch('/api/admin/insights', { headers: getHeaders(activeKey) }),
        fetch('/api/admin/reviews', { headers: getHeaders(activeKey) }),
        fetch('/api/admin/updates', { headers: getHeaders(activeKey) }),
        fetch('/api/admin/feedback', { headers: getHeaders(activeKey) }),
        fetch('/api/admin/users', { headers: getHeaders(activeKey) }),
      ]);

      if (settingsRes.status === 'fulfilled' && settingsRes.value.ok) {
        const data = await settingsRes.value.json();
        if (data.settings) {
          setSiteSettings((prev) => ({ ...prev, ...data.settings }));
        }
      }

      if (galleryRes.status === 'fulfilled' && galleryRes.value.ok) {
        const data = await galleryRes.value.json();
        if (Array.isArray(data.items)) {
          setGalleryItems(data.items);
        }
      }

      if (insightsRes.status === 'fulfilled' && insightsRes.value.ok) {
        const data = await insightsRes.value.json();
        if (Array.isArray(data.visitors)) setVisitorLogs(data.visitors);
        if (Array.isArray(data.accessLogs)) setTeamAccessLogs(data.accessLogs);
      }

      if (reviewsRes.status === 'fulfilled' && reviewsRes.value.ok) {
        const data = await reviewsRes.value.json();
        if (Array.isArray(data.reviews)) setReviews(data.reviews);
      }

      if (updatesRes.status === 'fulfilled' && updatesRes.value.ok) {
        const data = await updatesRes.value.json();
        if (Array.isArray(data.updates)) setUpdates(data.updates);
      }

      if (feedbackRes.status === 'fulfilled' && feedbackRes.value.ok) {
        const data = await feedbackRes.value.json();
        if (Array.isArray(data.feedback)) setFeedback(data.feedback);
      }

      if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
        const data = await usersRes.value.json();
        if (Array.isArray(data.users)) setRegisteredUsersCount(data.users.length);
      }
    } catch (e) {
      console.warn('Error loading team data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  // --- ACTIONS: IMMEDIATE DEFAULT THEME (SALUS PATTERN) ---
  const handleSetDefaultTheme = async (theme: 'dark' | 'light') => {
    setSiteSettings((prev) => ({ ...prev, default_theme: theme }));
    togglePreviewTheme(theme);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ default_theme: theme }),
      });
      if (res.ok) {
        localStorage.setItem('project-she-server-default', theme);
        localStorage.setItem('project-she-theme', theme);
        showNotice(`System default theme set to: "${theme.toUpperCase()}" (Live across all devices)`);
      } else {
        showNotice('Theme preview updated. Click "Save Live Changes" to sync.');
      }
    } catch {
      showNotice('Theme preview updated. Click "Save Live Changes" to sync.');
    }
  };

  // --- ACTIONS: SITE TEXT & LINKS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(siteSettings),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSiteSettings((prev) => ({ ...prev, ...data.settings }));
          if (data.settings.default_theme) {
            localStorage.setItem('project-she-server-default', data.settings.default_theme);
            localStorage.setItem('project-she-theme', data.settings.default_theme);
            document.documentElement.setAttribute('data-theme', data.settings.default_theme);
            window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: data.settings.default_theme } }));
          }
        }
        showNotice('Website changes saved live for all visitors.');
      } else {
        showNotice('Unable to save changes. Please try again.');
      }
    } catch {
      showNotice('Connection error while saving site content.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm('Restore all site text, pillars, and contacts to default NGO values?')) {
      setSiteSettings({ ...DEFAULT_SITE_SETTINGS });
      showNotice('Default values restored in editor. Click "Save Live Changes" to apply.');
    }
  };

  // --- ACTIONS: PICTURES & GALLERY ---
  const handleAddPhotograph = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoSrc.trim()) {
      showNotice('Please provide a photo URL or image path.');
      return;
    }

    setIsAddingPhoto(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          src: newPhotoSrc.trim(),
          title: newPhotoTitle.trim() || 'Community Event Photograph',
          category: newPhotoCategory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.item) {
          setGalleryItems((prev) => [data.item, ...prev]);
        }
        setNewPhotoSrc('');
        setNewPhotoTitle('');
        setShowAddPhoto(false);
        showNotice('Photograph added to gallery.');
      } else {
        showNotice('Unable to add photograph.');
      }
    } catch {
      showNotice('Connection error while adding photo.');
    } finally {
      setIsAddingPhoto(false);
    }
  };

  const handleDeletePhotograph = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this photograph from the gallery?')) return;

    try {
      const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (res.ok) {
        setGalleryItems((prev) => prev.filter((item) => item.id !== id));
        showNotice('Photograph permanently removed from all devices.');
      } else {
        showNotice('Unable to delete photograph.');
      }
    } catch {
      showNotice('Connection error while removing photograph.');
    }
  };

  // Filtered & Paginated Gallery Photos
  const filteredGalleryPhotos = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesCategory =
        galleryCategoryFilter === 'ALL' || item.category === galleryCategoryFilter;
      const matchesSearch =
        !gallerySearchQuery.trim() ||
        (item.title && item.title.toLowerCase().includes(gallerySearchQuery.toLowerCase())) ||
        (item.src && item.src.toLowerCase().includes(gallerySearchQuery.toLowerCase())) ||
        (item.id && item.id.toLowerCase().includes(gallerySearchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [galleryItems, galleryCategoryFilter, gallerySearchQuery]);

  const totalGalleryPages = Math.max(1, Math.ceil(filteredGalleryPhotos.length / photosPerPage));
  const paginatedPhotos = useMemo(() => {
    const start = (galleryPage - 1) * photosPerPage;
    return filteredGalleryPhotos.slice(start, start + photosPerPage);
  }, [filteredGalleryPhotos, galleryPage, photosPerPage]);

  // --- ACTIONS: CLEAR WASTE LOGS ---
  const handleClearWasteData = async (target: 'visitors' | 'access' | 'all') => {
    const message =
      target === 'all'
        ? 'Clear all visitor activity and security access logs?'
        : target === 'visitors'
        ? 'Clear all visitor browsing records?'
        : 'Clear all security and team access logs?';

    if (!confirm(message)) return;

    setClearingWaste(true);
    try {
      const res = await fetch(`/api/admin/insights?target=${target}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (res.ok) {
        if (target === 'visitors' || target === 'all') {
          setVisitorLogs([]);
        }
        if (target === 'access' || target === 'all') {
          setTeamAccessLogs([]);
        }
        showNotice('Activity logs successfully cleared.');
      } else {
        showNotice('Unable to clear activity logs.');
      }
    } catch {
      showNotice('Connection error while clearing logs.');
    } finally {
      setClearingWaste(false);
    }
  };

  // --- ACTIONS: REVIEWS ---
  const handleUpdateReviewStatus = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        showNotice(newStatus === 'approved' ? 'Review approved and published live.' : 'Review hidden from live site.');
      } else {
        showNotice('Unable to update review status.');
      }
    } catch {
      showNotice('Connection error while updating review.');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;

    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        showNotice('Review permanently deleted.');
      } else {
        showNotice('Unable to delete review.');
      }
    } catch {
      showNotice('Connection error while deleting review.');
    }
  };

  // --- ACTIONS: NOTICE BOARD ---
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) {
      showNotice('Please write a headline and message for the announcement.');
      return;
    }

    setIsSubmittingNotice(true);
    try {
      const payload = {
        title: newNoticeTitle.trim(),
        category: newNoticeCategory,
        content: newNoticeContent.trim(),
        link_url: newNoticeLinkUrl.trim() || undefined,
        link_text: newNoticeLinkText.trim() || undefined,
        is_banner: true,
        status: 'published',
      };

      const res = await fetch('/api/admin/updates', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.update) {
          setUpdates((prev) => [data.update, ...prev]);
        }
        setNewNoticeTitle('');
        setNewNoticeContent('');
        setNewNoticeLinkUrl('');
        showNotice('Announcement published to live notice board.');
      } else {
        showNotice('Unable to publish announcement.');
      }
    } catch {
      showNotice('Connection error while publishing announcement.');
    } finally {
      setIsSubmittingNotice(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const res = await fetch(`/api/admin/updates?id=${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        setUpdates((prev) => prev.filter((u) => u.id !== id));
        showNotice('Announcement deleted.');
      } else {
        showNotice('Unable to delete announcement.');
      }
    } catch {
      showNotice('Connection error while deleting announcement.');
    }
  };

  // --- ACTIONS: MESSAGES ---
  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to remove this message?')) return;

    try {
      const res = await fetch(`/api/admin/feedback?id=${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        setFeedback((prev) => prev.filter((f) => f.id !== id));
        showNotice('Message removed.');
      } else {
        showNotice('Unable to remove message.');
      }
    } catch {
      showNotice('Connection error while removing message.');
    }
  };

  const handleMarkMessageRead = async (id: string) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ id, status: 'reviewed' }),
      });
      if (res.ok) {
        setFeedback((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: 'reviewed' } : f))
        );
        showNotice('Message marked as read.');
      } else {
        showNotice('Unable to update message.');
      }
    } catch {
      showNotice('Connection error while updating message.');
    }
  };

  // --- SCREEN 1: CLEAN VERIFYING SPINNER ---
  if (authChecking || (isAuthenticated && loadingData && galleryItems.length === 0)) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-6 select-none transition-colors ${
          isLight ? 'bg-[#EFECE6] text-[#111111]' : 'bg-[#080808] text-white'
        }`}
      >
        <div
          className={`w-9 h-9 border-2 animate-spin mb-4 ${
            isLight
              ? 'border-neutral-300 border-t-[#E6192B]'
              : 'border-neutral-800 border-t-[#E6192B]'
          }`}
          style={{ borderRadius: '0px' }}
        />
        <p className="font-heading font-black text-sm uppercase tracking-wider">
          PROJECT S.H.E.
        </p>
        <p
          className={`font-sans text-xs mt-1 ${
            isLight ? 'text-neutral-600' : 'text-neutral-400'
          }`}
        >
          Loading team access hub...
        </p>
      </div>
    );
  }

  // --- SCREEN 2: TEAM ACCESS LOGIN ---
  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex flex-col justify-center items-center px-4 py-16 selection:bg-[#E6192B] selection:text-white select-none transition-colors ${
          isLight ? 'bg-[#EFECE6] text-[#111111]' : 'bg-[#090909] text-white'
        }`}
      >
        <div
          className={`w-full max-w-md p-8 sm:p-10 space-y-6 shadow-xl border ${
            isLight
              ? 'bg-[#FFFFFF] border-[#D4CFC4]'
              : 'bg-[#111111] border-neutral-800'
          }`}
          style={{ borderRadius: '0px' }}
        >
          <div className="space-y-2 text-center">
            <span className="font-mono text-xs text-[#E6192B] uppercase tracking-widest font-bold">
              PROJECT S.H.E.
            </span>
            <h1
              className={`font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight ${
                isLight ? 'text-[#111111]' : 'text-white'
              }`}
            >
              Team Access
            </h1>
            <p
              className={`font-sans text-xs leading-relaxed ${
                isLight ? 'text-neutral-600' : 'text-neutral-400'
              }`}
            >
              Enter the team passkey to manage site content, photographs, reviews, and community insights.
            </p>
          </div>

          {loginError && (
            <div
              className={`p-3 border text-xs font-sans ${
                isLight
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : 'bg-red-950/40 border-red-800 text-red-200'
              }`}
              style={{ borderRadius: '0px' }}
            >
              {loginError}
            </div>
          )}

          <form onSubmit={handleKeySubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                className={`block font-mono text-[11px] uppercase tracking-wider ${
                  isLight ? 'text-[#111111] font-bold' : 'text-neutral-300'
                }`}
              >
                Passkey
              </label>
              <div className="relative">
                <input
                  type={showKeyText ? 'text' : 'password'}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Enter passkey..."
                  className={`w-full px-3.5 py-2.5 font-mono text-xs focus:outline-none focus:border-[#E6192B] transition-colors border ${
                    isLight
                      ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111] placeholder-neutral-400'
                      : 'bg-[#090909] border-neutral-700 text-white placeholder-neutral-500'
                  }`}
                  style={{ borderRadius: '0px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKeyText(!showKeyText)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isLight
                      ? 'text-neutral-500 hover:text-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {showKeyText ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#E6192B] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-150"
              style={{ borderRadius: '0px' }}
            >
              Enter Team Hub
            </button>
          </form>

          <div
            className={`pt-4 border-t text-center ${
              isLight ? 'border-[#EAE5DB]' : 'border-neutral-800'
            }`}
          >
            <Link
              href="/"
              className={`font-mono text-xs transition-colors ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-500 hover:text-white'
              }`}
            >
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'pending') return r.status === 'pending';
    if (reviewFilter === 'approved') return r.status === 'approved';
    return true;
  });

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const unreadMessagesCount = feedback.filter((f) => f.status === 'new').length;

  const navMenuItems = [
    {
      id: 'site_text' as const,
      label: 'Site Content & Editor',
      icon: HiPencilSquare,
      badge: null,
    },
    {
      id: 'gallery' as const,
      label: 'Pictures & Gallery',
      icon: HiPhoto,
      badge: galleryItems.length.toString(),
    },
    {
      id: 'insights' as const,
      label: 'Visitor Insights',
      icon: HiUserGroup,
      badge: null,
    },
    {
      id: 'reviews' as const,
      label: 'Community Reviews',
      icon: HiChatBubbleBottomCenterText,
      badge: pendingCount > 0 ? `${pendingCount} new` : null,
      badgeColor: 'bg-[#E6192B] text-white',
    },
    {
      id: 'notices' as const,
      label: 'Notice Board',
      icon: HiMegaphone,
      badge: updates.length > 0 ? updates.length.toString() : null,
    },
    {
      id: 'messages' as const,
      label: 'Messages',
      icon: HiInbox,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} new` : null,
      badgeColor: 'bg-[#E6192B] text-white',
    },
  ];

  // Active visitors calculation (seen in last 15 mins)
  const activeOnlineCount = visitorLogs.filter((v) => {
    const diffMin = (Date.now() - new Date(v.last_online).getTime()) / (1000 * 60);
    return diffMin <= 15;
  }).length;

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row selection:bg-[#E6192B] selection:text-white select-none transition-colors ${
        isLight ? 'bg-[#EFECE6] text-[#111111]' : 'bg-[#080808] text-[#EDEDED]'
      }`}
    >
      {/* ============================================================== */}
      {/* MOBILE TOP BAR */}
      {/* ============================================================== */}
      <div
        className={`md:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-40 ${
          isLight
            ? 'bg-[#FFFFFF] border-[#D4CFC4]'
            : 'bg-[#0F0F0F] border-neutral-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#E6192B]" />
          <span
            className={`font-heading font-black text-sm tracking-tight ${
              isLight ? 'text-[#111111]' : 'text-white'
            }`}
          >
            PROJECT S.H.E.
          </span>
          <span className="font-mono text-[10px] bg-[#E6192B] text-white px-1.5 py-0.5 uppercase font-bold">
            Hub
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => togglePreviewTheme(isLight ? 'dark' : 'light')}
            className={`p-1.5 border text-xs font-mono flex items-center gap-1 ${
              isLight
                ? 'bg-[#F2EFE9] border-[#C5BFB2] text-[#111111]'
                : 'bg-neutral-900 border-neutral-700 text-white'
            }`}
            title="Toggle theme preview"
          >
            {isLight ? <HiMoon className="w-4 h-4" /> : <HiSun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className={`p-1.5 border ${
              isLight
                ? 'bg-[#F2EFE9] border-[#C5BFB2] text-[#111111]'
                : 'bg-neutral-900 border-neutral-700 text-white'
            }`}
          >
            <HiBars3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* LEFT SIDEBAR */}
      {/* ============================================================== */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 border-r flex flex-col justify-between z-50 transition-all duration-200 ${
          isLight
            ? 'bg-[#FFFFFF] border-[#D4CFC4] text-[#111111]'
            : 'bg-[#0C0C0C] border-neutral-800 text-[#EDEDED]'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ borderRadius: '0px' }}
      >
        {/* Sidebar Header */}
        <div
          className={`p-5 border-b ${
            isLight ? 'border-[#EAE5DB]' : 'border-neutral-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="w-2.5 h-2.5 bg-[#E6192B] shrink-0" />
              <div>
                <span
                  className={`font-heading font-black text-base tracking-tight block transition-colors ${
                    isLight ? 'text-[#111111] group-hover:text-[#E6192B]' : 'text-white group-hover:text-[#E6192B]'
                  }`}
                >
                  PROJECT S.H.E.
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-widest block font-bold ${
                    isLight ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                >
                  TEAM HUB
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className={`md:hidden ${
                isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between font-mono text-[11px] ${
              isLight ? 'border-[#EAE5DB] text-neutral-600' : 'border-neutral-800 text-neutral-400'
            }`}
          >
            <button
              onClick={() => {
                const next = isLight ? 'dark' : 'light';
                togglePreviewTheme(next);
                setSiteSettings((prev) => ({ ...prev, default_theme: next }));
              }}
              className={`flex items-center gap-1.5 px-2 py-1 border transition-colors ${
                isLight
                  ? 'border-[#D4CFC4] bg-[#FAF8F5] text-neutral-800 hover:bg-[#EFECE6]'
                  : 'border-neutral-800 bg-[#141414] text-neutral-300 hover:text-white'
              }`}
              style={{ borderRadius: '0px' }}
              title="Toggle preview theme for testing"
            >
              {isLight ? (
                <>
                  <HiMoon className="w-3.5 h-3.5 text-[#E6192B]" />
                  <span>DARK PREVIEW</span>
                </>
              ) : (
                <>
                  <HiSun className="w-3.5 h-3.5 text-amber-400" />
                  <span>LIGHT PREVIEW</span>
                </>
              )}
            </button>

            <button
              onClick={() => loadAllData()}
              disabled={loadingData}
              className={`flex items-center gap-1 px-2 py-1 border transition-colors disabled:opacity-50 ${
                isLight
                  ? 'border-[#D4CFC4] bg-[#FAF8F5] text-neutral-800 hover:bg-[#EFECE6]'
                  : 'border-neutral-800 bg-[#141414] text-neutral-300 hover:text-white'
              }`}
              style={{ borderRadius: '0px' }}
              title="Refresh all data"
            >
              <HiArrowPath className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin text-[#E6192B]' : ''}`} />
              <span>{loadingData ? 'SYNC' : 'REFRESH'}</span>
            </button>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 border text-left font-mono text-xs uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#E6192B] border-[#E6192B] text-white font-bold shadow-md'
                    : isLight
                    ? 'bg-transparent border-transparent hover:border-[#D4CFC4] hover:bg-[#F2EFE9] text-neutral-700 hover:text-black'
                    : 'bg-transparent border-transparent hover:border-neutral-800 hover:bg-[#141414] text-neutral-400 hover:text-white'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isLight ? 'text-neutral-600' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 font-bold uppercase ${
                      item.badgeColor ||
                      (isActive
                        ? 'bg-black text-white'
                        : isLight
                        ? 'bg-[#EAE5DB] text-neutral-800'
                        : 'bg-neutral-800 text-neutral-300')
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div
          className={`p-4 border-t space-y-2 ${
            isLight
              ? 'bg-[#FAF8F5] border-[#EAE5DB]'
              : 'bg-[#090909] border-neutral-800'
          }`}
        >
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2.5 px-3 border font-mono text-xs uppercase tracking-wider flex items-center justify-between transition-colors ${
              isLight
                ? 'bg-white border-[#D4CFC4] hover:bg-[#EFECE6] text-neutral-800'
                : 'bg-[#121212] border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            style={{ borderRadius: '0px' }}
          >
            <span>Public Website</span>
            <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSignOut}
            className={`w-full py-2.5 px-3 border font-mono text-xs uppercase tracking-wider flex items-center justify-between transition-colors ${
              isLight
                ? 'bg-white border-[#D4CFC4] hover:border-red-600 hover:bg-red-50 text-neutral-700 hover:text-red-700'
                : 'bg-[#121212] border-neutral-800 hover:border-red-800 hover:bg-red-950/40 text-neutral-400 hover:text-red-300'
            }`}
            style={{ borderRadius: '0px' }}
          >
            <span>Sign Out</span>
            <HiArrowRightOnRectangle className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================================== */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-6xl w-full mx-auto space-y-8 overflow-y-auto">
        {/* Floating Status Notice */}
        {statusNotice && (
          <div
            className={`fixed bottom-6 right-6 z-[99999] px-5 py-3.5 font-mono text-xs font-bold border-2 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 select-none ${
              isLight
                ? 'border-[#111111] shadow-[4px_4px_0px_0px_#111111]'
                : 'border-[#E6192B] shadow-[4px_4px_0px_0px_#E6192B]'
            }`}
            style={{
              borderRadius: '0px',
              backgroundColor: isLight ? '#FFFFFF' : '#111111',
              color: isLight ? '#111111' : '#FFFFFF',
              borderColor: isLight ? '#111111' : '#E6192B',
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#E6192B] shrink-0 inline-block animate-pulse"
              style={{ backgroundColor: '#E6192B' }}
            />
            <span
              className="font-mono text-xs font-bold tracking-tight"
              style={{ color: isLight ? '#111111' : '#FFFFFF' }}
            >
              {statusNotice}
            </span>
            <button
              onClick={() => setStatusNotice('')}
              className="ml-2 text-neutral-400 hover:text-[#E6192B] transition-colors"
              title="Dismiss notice"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 1: SITE CONTENT & MINI WEBSITE EDITOR */}
        {/* ============================================================== */}
        {activeTab === 'site_text' && (
          <div className="space-y-6">
            <div
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
                isLight ? 'border-[#D4CFC4]' : 'border-neutral-800'
              }`}
            >
              <div>
                <h2
                  className={`font-heading font-black text-2xl uppercase tracking-tight ${
                    isLight ? 'text-[#111111]' : 'text-white'
                  }`}
                >
                  Site Content &amp; Editor
                </h2>
                <p
                  className={`font-sans text-xs mt-1 ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  Manage the default website theme, payment QR, hero copy, three core pillars, and external forms without code.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRestoreDefaults}
                className={`self-start sm:self-auto px-3.5 py-1.5 border font-mono text-xs uppercase transition-colors ${
                  isLight
                    ? 'border-[#C5BFB2] bg-[#FAF8F5] hover:bg-[#EAE5DB] text-neutral-800'
                    : 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white'
                }`}
                style={{ borderRadius: '0px' }}
              >
                Restore NGO Defaults
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              {/* BLOCK 1: GLOBAL SITE THEME */}
              <div
                className={`p-6 border space-y-4 shadow-sm ${
                  isLight
                    ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                    : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <div className="border-b pb-3 flex items-center justify-between border-neutral-800/30">
                  <div>
                    <h3
                      className={`font-heading font-black text-base uppercase tracking-wider ${
                        isLight ? 'text-[#111111]' : 'text-white'
                      }`}
                    >
                      Default Website Theme
                    </h3>
                    <p
                      className={`font-sans text-xs mt-0.5 ${
                        isLight ? 'text-neutral-600' : 'text-neutral-400'
                      }`}
                    >
                      Controls the initial theme visitors see when opening the website on any phone or laptop.
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#E6192B] uppercase font-bold">
                    {siteSettings.default_theme === 'light' ? 'LIGHT THEME DEFAULT' : 'DARK THEME DEFAULT'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSetDefaultTheme('dark')}
                    className={`p-4 border text-left font-mono transition-all flex items-center justify-between ${
                      (siteSettings.default_theme || 'dark') === 'dark'
                        ? isLight
                          ? 'border-[#E6192B] bg-[#E6192B]/10 text-[#111111]'
                          : 'border-[#E6192B] bg-[#E6192B]/10 text-white'
                        : isLight
                        ? 'border-[#D4CFC4] bg-[#FAF8F5] text-neutral-700 hover:border-black'
                        : 'border-neutral-800 bg-[#0A0A0A] text-neutral-400 hover:border-neutral-700'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="flex items-center gap-3">
                      <HiMoon className="w-5 h-5 text-[#E6192B]" />
                      <div>
                        <div
                          className={`font-bold text-xs uppercase ${
                            isLight ? 'text-[#111111]' : 'text-white'
                          }`}
                        >
                          Dark Brutalist Theme
                        </div>
                        <div
                          className={`text-[11px] ${
                            isLight ? 'text-neutral-600' : 'text-neutral-400'
                          }`}
                        >
                          Rich charcoal canvas, high-contrast imagery
                        </div>
                      </div>
                    </div>
                    {(siteSettings.default_theme || 'dark') === 'dark' && (
                      <HiCheck className="w-5 h-5 text-[#E6192B]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetDefaultTheme('light')}
                    className={`p-4 border text-left font-mono transition-all flex items-center justify-between ${
                      siteSettings.default_theme === 'light'
                        ? 'border-[#E6192B] bg-[#E6192B]/10 text-[#111111]'
                        : isLight
                        ? 'border-[#D4CFC4] bg-[#FAF8F5] text-neutral-700 hover:border-black'
                        : 'border-neutral-800 bg-[#0A0A0A] text-neutral-400 hover:border-neutral-700'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="flex items-center gap-3">
                      <HiSun className="w-5 h-5 text-amber-500" />
                      <div>
                        <div
                          className={`font-bold text-xs uppercase ${
                            isLight ? 'text-[#111111]' : 'text-white'
                          }`}
                        >
                          Light Editorial Theme
                        </div>
                        <div
                          className={`text-[11px] ${
                            isLight ? 'text-neutral-600' : 'text-neutral-400'
                          }`}
                        >
                          Warm newsprint grain, clean editorial look
                        </div>
                      </div>
                    </div>
                    {siteSettings.default_theme === 'light' && (
                      <HiCheck className="w-5 h-5 text-[#E6192B]" />
                    )}
                  </button>
                </div>
              </div>

              {/* BLOCK 2: TICKER & HERO SECTION */}
              <div
                className={`p-6 border space-y-6 shadow-sm ${
                  isLight
                    ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                    : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <div className="border-b pb-3 border-neutral-800/30">
                  <h3
                    className={`font-heading font-black text-base uppercase tracking-wider ${
                      isLight ? 'text-[#111111]' : 'text-white'
                    }`}
                  >
                    Hero Section &amp; Top Ticker
                  </h3>
                  <p
                    className={`font-sans text-xs mt-0.5 ${
                      isLight ? 'text-neutral-600' : 'text-neutral-400'
                    }`}
                  >
                    The first impressions visitors see at the top of the homepage.
                  </p>
                </div>

                {/* Marquee / Ticker Text */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs text-[#E6192B] uppercase tracking-wider font-bold">
                    Continuous Live Ticker Statement
                  </label>
                  <textarea
                    rows={3}
                    value={siteSettings.marquee_text}
                    onChange={(e) =>
                      setSiteSettings((prev) => ({ ...prev, marquee_text: e.target.value }))
                    }
                    placeholder="Enter continuous ticker separated by ✦ symbols..."
                    className={`w-full px-3.5 py-2.5 font-mono text-xs focus:outline-none focus:border-[#E6192B] transition-colors border ${
                      isLight
                        ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111] placeholder-neutral-400'
                        : 'bg-[#090909] border-neutral-700 text-white placeholder-neutral-500'
                    }`}
                    style={{ borderRadius: '0px' }}
                    required
                  />
                  <p
                    className={`font-sans text-[11px] ${
                      isLight ? 'text-neutral-500' : 'text-neutral-400'
                    }`}
                  >
                    Streams across the top red ribbon. Separate announcements with ✦ symbols.
                  </p>
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      className={`block font-mono text-[11px] uppercase tracking-wider font-bold ${
                        isLight ? 'text-[#111111]' : 'text-neutral-300'
                      }`}
                    >
                      Hero Top Badge
                    </label>
                    <input
                      type="text"
                      value={siteSettings.hero_badge || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, hero_badge: e.target.value }))
                      }
                      placeholder="e.g. HYDERABAD'S LEADING STUDENT NGO"
                      className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className={`block font-mono text-[11px] uppercase tracking-wider font-bold ${
                        isLight ? 'text-[#111111]' : 'text-neutral-300'
                      }`}
                    >
                      Hero Sub-badge / Foundation Tag
                    </label>
                    <input
                      type="text"
                      value={siteSettings.hero_subbadge || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, hero_subbadge: e.target.value }))
                      }
                      placeholder="e.g. SARVA NIRBHAYA FOUNDATION • HYDERABAD, INDIA"
                      className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>
                </div>

                {/* Hero Rotating Headline Phrases */}
                <div className="space-y-3 p-3.5 bg-black/20 dark:bg-black/40 border border-[#E6192B]/30 rounded-none">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label
                      className={`block font-mono text-xs uppercase tracking-wider font-bold ${
                        isLight ? 'text-[#111111]' : 'text-neutral-200'
                      }`}
                    >
                      Hero Switching Headline (Alternating Phrases)
                    </label>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#E6192B]/15 text-[#E6192B] border border-[#E6192B]/30 uppercase tracking-widest font-bold">
                      Smooth Transition • No Blink
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                    The hero headline smoothly switches between these phrases every few seconds without blinking. Enter different phrases in the boxes below:
                  </p>

                  {/* Phrase 1 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-[#E6192B]">PHRASE 1 (PRIMARY)</span>
                      <span className="text-neutral-500 text-[10px]">REQUIRED</span>
                    </div>
                    <input
                      type="text"
                      value={siteSettings.hero_headline || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, hero_headline: e.target.value }))
                      }
                      placeholder="e.g. RAISE YOUR VOICE WHERE THEIRS WAS SILENCED."
                      className={`w-full px-3.5 py-2.5 font-sans text-xs focus:outline-none focus:border-[#E6192B] transition-colors border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                      required
                    />
                  </div>

                  {/* Phrase 2 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-[#E6192B]">PHRASE 2 (SWITCHES WITH PHRASE 1)</span>
                      <span className="text-neutral-500 text-[10px]">RECOMMENDED</span>
                    </div>
                    <input
                      type="text"
                      value={siteSettings.hero_headline_2 || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, hero_headline_2: e.target.value }))
                      }
                      placeholder="e.g. STAND WITH THOSE WHO SURVIVED."
                      className={`w-full px-3.5 py-2.5 font-sans text-xs focus:outline-none focus:border-[#E6192B] transition-colors border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>

                  {/* Phrase 3 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-neutral-400">PHRASE 3 (OPTIONAL EXTRA ROTATION)</span>
                      <span className="text-neutral-500 text-[10px]">OPTIONAL</span>
                    </div>
                    <input
                      type="text"
                      value={siteSettings.hero_headline_3 || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, hero_headline_3: e.target.value }))
                      }
                      placeholder="e.g. SUPPORT. HELP. EMPOWER."
                      className={`w-full px-3.5 py-2.5 font-sans text-xs focus:outline-none focus:border-[#E6192B] transition-colors border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>

                  {/* Visual Preview Flow */}
                  <div className="pt-1.5 flex items-center gap-2 text-[10px] font-mono text-neutral-400 overflow-x-auto">
                    <span className="text-[#E6192B] font-bold">CYCLE:</span>
                    <span className="px-1.5 py-0.5 bg-black/30 border border-neutral-800 text-neutral-300 truncate max-w-[160px]">
                      {siteSettings.hero_headline || 'Phrase 1'}
                    </span>
                    <span>⇄</span>
                    <span className="px-1.5 py-0.5 bg-black/30 border border-neutral-800 text-neutral-300 truncate max-w-[160px]">
                      {siteSettings.hero_headline_2 || 'Phrase 2'}
                    </span>
                    {siteSettings.hero_headline_3 && (
                      <>
                        <span>⇄</span>
                        <span className="px-1.5 py-0.5 bg-black/30 border border-neutral-800 text-neutral-300 truncate max-w-[160px]">
                          {siteSettings.hero_headline_3}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Hero Mission Description */}
                <div className="space-y-2">
                  <label
                    className={`block font-mono text-xs uppercase tracking-wider font-bold ${
                      isLight ? 'text-[#111111]' : 'text-neutral-300'
                    }`}
                  >
                    Hero NGO Mission Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={siteSettings.hero_description || ''}
                    onChange={(e) =>
                      setSiteSettings((prev) => ({ ...prev, hero_description: e.target.value }))
                    }
                    placeholder="Violence injects itself into the lives of survivors..."
                    className={`w-full px-3.5 py-2.5 font-sans text-xs focus:outline-none focus:border-[#E6192B] transition-colors border ${
                      isLight
                        ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                        : 'bg-[#090909] border-neutral-700 text-white'
                    }`}
                    style={{ borderRadius: '0px' }}
                  />
                </div>
              </div>

              {/* BLOCK 3: FOUNDER STORY & THREE PILLARS */}
              <div
                className={`p-6 border space-y-6 shadow-sm ${
                  isLight
                    ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                    : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <div className="border-b pb-3 border-neutral-800/30">
                  <h3
                    className={`font-heading font-black text-base uppercase tracking-wider ${
                      isLight ? 'text-[#111111]' : 'text-white'
                    }`}
                  >
                    Founder&apos;s Story &amp; Three Pillars
                  </h3>
                  <p
                    className={`font-sans text-xs mt-0.5 ${
                      isLight ? 'text-neutral-600' : 'text-neutral-400'
                    }`}
                  >
                    Edit the founder opening quote and the titles/descriptions of each core NGO pillar.
                  </p>
                </div>

                {/* Founder Statement */}
                <div className="space-y-2">
                  <label
                    className={`block font-mono text-xs uppercase tracking-wider font-bold ${
                      isLight ? 'text-[#111111]' : 'text-neutral-300'
                    }`}
                  >
                    Founder Sanskriti Mohan Opening Statement
                  </label>
                  <textarea
                    rows={2}
                    value={siteSettings.about_statement || ''}
                    onChange={(e) =>
                      setSiteSettings((prev) => ({ ...prev, about_statement: e.target.value }))
                    }
                    placeholder="Hi, I’m Sanskriti Mohan, founder of Project S.H.E..."
                    className={`w-full px-3.5 py-2.5 font-sans text-xs focus:outline-none focus:border-[#E6192B] transition-colors border ${
                      isLight
                        ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                        : 'bg-[#090909] border-neutral-700 text-white'
                    }`}
                    style={{ borderRadius: '0px' }}
                  />
                </div>

                {/* Pillar 1 */}
                <div
                  className={`p-4 border space-y-3 ${
                    isLight ? 'bg-[#FAF8F5] border-[#E0DCD3]' : 'bg-[#0D0D0D] border-neutral-800'
                  }`}
                  style={{ borderRadius: '0px' }}
                >
                  <span className="font-mono text-xs text-[#E6192B] font-bold block uppercase">
                    Pillar 01 (Mobilisation &amp; Care)
                  </span>
                  <div className="space-y-1">
                    <label
                      className={`block font-mono text-[11px] uppercase ${
                        isLight ? 'text-neutral-700 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      value={siteSettings.pillar_1_title || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, pillar_1_title: e.target.value }))
                      }
                      placeholder="1. Fundraising"
                      className={`w-full px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-white border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      className={`block font-mono text-[11px] uppercase ${
                        isLight ? 'text-neutral-700 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={siteSettings.pillar_1_desc || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, pillar_1_desc: e.target.value }))
                      }
                      placeholder="Pillar 1 description..."
                      className={`w-full px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-white border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>
                </div>

                {/* Pillar 2 */}
                <div
                  className={`p-4 border space-y-3 ${
                    isLight ? 'bg-[#FAF8F5] border-[#E0DCD3]' : 'bg-[#0D0D0D] border-neutral-800'
                  }`}
                  style={{ borderRadius: '0px' }}
                >
                  <span className="font-mono text-xs text-[#E6192B] font-bold block uppercase">
                    Pillar 02 (Survivor Shelters)
                  </span>
                  <div className="space-y-1">
                    <label
                      className={`block font-mono text-[11px] uppercase ${
                        isLight ? 'text-neutral-700 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      value={siteSettings.pillar_2_title || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, pillar_2_title: e.target.value }))
                      }
                      placeholder="2. Direct support for survivors."
                      className={`w-full px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-white border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      className={`block font-mono text-[11px] uppercase ${
                        isLight ? 'text-neutral-700 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={siteSettings.pillar_2_desc || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, pillar_2_desc: e.target.value }))
                      }
                      placeholder="Pillar 2 description..."
                      className={`w-full px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-white border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>
                </div>

                {/* Pillar 3 */}
                <div
                  className={`p-4 border space-y-3 ${
                    isLight ? 'bg-[#FAF8F5] border-[#E0DCD3]' : 'bg-[#0D0D0D] border-neutral-800'
                  }`}
                  style={{ borderRadius: '0px' }}
                >
                  <span className="font-mono text-xs text-[#E6192B] font-bold block uppercase">
                    Pillar 03 (Advocacy &amp; Dialogue)
                  </span>
                  <div className="space-y-1">
                    <label
                      className={`block font-mono text-[11px] uppercase ${
                        isLight ? 'text-neutral-700 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      value={siteSettings.pillar_3_title || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, pillar_3_title: e.target.value }))
                      }
                      placeholder="3. Advocacy and dialogue."
                      className={`w-full px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-white border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      className={`block font-mono text-[11px] uppercase ${
                        isLight ? 'text-neutral-700 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={siteSettings.pillar_3_desc || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, pillar_3_desc: e.target.value }))
                      }
                      placeholder="Pillar 3 description..."
                      className={`w-full px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-white border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>
                </div>
              </div>

              {/* BLOCK 4: DONATION SECTION & PAYMENT QR CODE */}
              <div
                className={`p-6 border space-y-6 shadow-sm ${
                  isLight
                    ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                    : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <div className="border-b pb-3 border-neutral-800/30">
                  <h3
                    className={`font-heading font-black text-base uppercase tracking-wider ${
                      isLight ? 'text-[#111111]' : 'text-white'
                    }`}
                  >
                    Donation &amp; Payment QR Code
                  </h3>
                  <p
                    className={`font-sans text-xs mt-0.5 ${
                      isLight ? 'text-neutral-600' : 'text-neutral-400'
                    }`}
                  >
                    Change your official donation QR code, UPI address, and instructions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      className={`block font-mono text-[11px] uppercase tracking-wider font-bold ${
                        isLight ? 'text-[#111111]' : 'text-neutral-300'
                      }`}
                    >
                      Donation Section Headline
                    </label>
                    <input
                      type="text"
                      value={siteSettings.donation_headline || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, donation_headline: e.target.value }))
                      }
                      placeholder="DONATE THROUGH UPI"
                      className={`w-full px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className={`block font-mono text-[11px] uppercase tracking-wider font-bold ${
                        isLight ? 'text-[#111111]' : 'text-neutral-300'
                      }`}
                    >
                      Official Donation UPI ID
                    </label>
                    <input
                      type="text"
                      value={siteSettings.donation_upi_id || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, donation_upi_id: e.target.value }))
                      }
                      placeholder="shailajalakshmisarao1974-2@okicici"
                      className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    className={`block font-mono text-[11px] uppercase tracking-wider font-bold ${
                      isLight ? 'text-[#111111]' : 'text-neutral-300'
                    }`}
                  >
                    Donation Subtext / Contribution Note
                  </label>
                  <textarea
                    rows={2}
                    value={siteSettings.donation_subtext || ''}
                    onChange={(e) =>
                      setSiteSettings((prev) => ({ ...prev, donation_subtext: e.target.value }))
                    }
                    placeholder="Convenient, safe, and designed to ensure your contribution reaches those who need it most."
                    className={`w-full px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                      isLight
                        ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                        : 'bg-[#090909] border-neutral-700 text-white'
                    }`}
                    style={{ borderRadius: '0px' }}
                  />
                </div>

                {/* QR Code URL and Live Preview Box */}
                <div className="space-y-3 pt-2">
                  <label
                    className={`block font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 ${
                      isLight ? 'text-[#111111]' : 'text-neutral-300'
                    }`}
                  >
                    <HiQrCode className="w-4 h-4 text-[#E6192B]" />
                    <span>Payment QR Image URL / Path</span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        value={siteSettings.donation_qr_url || ''}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({ ...prev, donation_qr_url: e.target.value }))
                        }
                        placeholder="/assets/donation-qr.png or https://..."
                        className={`w-full px-3.5 py-2.5 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                          isLight
                            ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                            : 'bg-[#090909] border-neutral-700 text-white'
                        }`}
                        style={{ borderRadius: '0px' }}
                      />
                      <p
                        className={`font-sans text-[11px] ${
                          isLight ? 'text-neutral-500' : 'text-neutral-400'
                        }`}
                      >
                        Enter any public image URL or local asset path (default: <code className="font-mono">/assets/qr-code.svg</code>).
                      </p>
                    </div>

                    {/* Live Visual Preview Container */}
                    <div
                      className={`w-36 h-36 border p-2 flex flex-col items-center justify-center shrink-0 text-center ${
                        isLight ? 'bg-white border-[#C5BFB2]' : 'bg-[#090909] border-neutral-700'
                      }`}
                      style={{ borderRadius: '0px' }}
                    >
                      {siteSettings.donation_qr_url ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-white p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={siteSettings.donation_qr_url}
                            alt="Live QR Preview"
                            className="max-w-full max-h-full object-contain"
                            style={{ imageRendering: 'pixelated' }}
                          />
                        </div>
                      ) : (
                        <span className="font-mono text-[10px] text-neutral-400">
                          No QR Specified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* BLOCK 5: GOOGLE ACTION FORMS */}
              <div
                className={`p-6 border space-y-6 shadow-sm ${
                  isLight
                    ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                    : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <div className="border-b pb-3 border-neutral-800/30">
                  <h3
                    className={`font-heading font-black text-base uppercase tracking-wider ${
                      isLight ? 'text-[#111111]' : 'text-white'
                    }`}
                  >
                    Community Google Action Forms
                  </h3>
                  <p
                    className={`font-sans text-xs mt-0.5 ${
                      isLight ? 'text-neutral-600' : 'text-neutral-400'
                    }`}
                  >
                    Links for volunteer recruitments, creative submissions, and safe confessions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      className={`block font-mono text-[11px] uppercase ${
                        isLight ? 'text-[#111111] font-bold' : 'text-neutral-300'
                      }`}
                    >
                      1. Join Team Form URL
                    </label>
                    <input
                      type="url"
                      value={siteSettings.google_form_team_app}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({
                          ...prev,
                          google_form_team_app: e.target.value,
                        }))
                      }
                      placeholder="https://docs.google.com/forms/..."
                      className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className={`block font-mono text-[11px] uppercase ${
                        isLight ? 'text-[#111111] font-bold' : 'text-neutral-300'
                      }`}
                    >
                      2. Artwork &amp; Poetry Form URL
                    </label>
                    <input
                      type="url"
                      value={siteSettings.google_form_artwork_poetry}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({
                          ...prev,
                          google_form_artwork_poetry: e.target.value,
                        }))
                      }
                      placeholder="https://docs.google.com/forms/..."
                      className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className={`block font-mono text-[11px] uppercase ${
                        isLight ? 'text-[#111111] font-bold' : 'text-neutral-300'
                      }`}
                    >
                      3. Anonymous Confessions Form URL
                    </label>
                    <input
                      type="url"
                      value={siteSettings.google_form_anonymous_confessions}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({
                          ...prev,
                          google_form_anonymous_confessions: e.target.value,
                        }))
                      }
                      placeholder="https://docs.google.com/forms/..."
                      className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* BLOCK 6: CONTACTS, QUOTES & SOCIAL */}
              <div
                className={`p-6 border space-y-6 shadow-sm ${
                  isLight
                    ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                    : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <div className="border-b pb-3 border-neutral-800/30">
                  <h3
                    className={`font-heading font-black text-base uppercase tracking-wider ${
                      isLight ? 'text-[#111111]' : 'text-white'
                    }`}
                  >
                    Helplines, Quotes &amp; Contacts
                  </h3>
                  <p
                    className={`font-sans text-xs mt-0.5 ${
                      isLight ? 'text-neutral-600' : 'text-neutral-400'
                    }`}
                  >
                    Emergency contacts, footer editorial quote, and social channels.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      className={`block font-mono text-[11px] uppercase tracking-wider font-bold ${
                        isLight ? 'text-[#111111]' : 'text-neutral-300'
                      }`}
                    >
                      24/7 National Emergency Helplines
                    </label>
                    <input
                      type="text"
                      value={siteSettings.emergency_helpline || ''}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, emergency_helpline: e.target.value }))
                      }
                      placeholder="Women Helpline: 1091 | Domestic Abuse: 181 | Direct Desk: +91 98765 43210"
                      className={`w-full px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className={`block font-mono text-[11px] uppercase tracking-wider font-bold ${
                        isLight ? 'text-[#111111]' : 'text-neutral-300'
                      }`}
                    >
                      Footer Editorial Quote
                    </label>
                    <textarea
                      rows={2}
                      value={siteSettings.footer_quote}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({ ...prev, footer_quote: e.target.value }))
                      }
                      placeholder="Challenging the violence women face..."
                      className={`w-full px-3.5 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        className={`block font-mono text-[11px] uppercase ${
                          isLight ? 'text-[#111111] font-bold' : 'text-neutral-300'
                        }`}
                      >
                        Official Contact Email
                      </label>
                      <input
                        type="email"
                        value={siteSettings.contact_email || ''}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({ ...prev, contact_email: e.target.value }))
                        }
                        placeholder="projectshe.ngo@gmail.com"
                        className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                          isLight
                            ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                            : 'bg-[#090909] border-neutral-700 text-white'
                        }`}
                        style={{ borderRadius: '0px' }}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        className={`block font-mono text-[11px] uppercase ${
                          isLight ? 'text-[#111111] font-bold' : 'text-neutral-300'
                        }`}
                      >
                        Instagram Profile URL
                      </label>
                      <input
                        type="url"
                        value={siteSettings.instagram_url || ''}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({ ...prev, instagram_url: e.target.value }))
                        }
                        placeholder="https://instagram.com/projectshe.ngo"
                        className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                          isLight
                            ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                            : 'bg-[#090909] border-neutral-700 text-white'
                        }`}
                        style={{ borderRadius: '0px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SAVE ACTION BAR */}
              <div
                className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-4 shadow-2xl z-20 ${
                  isLight
                    ? 'bg-[#FFFFFF] border-[#C5BFB2]'
                    : 'bg-[#111111] border-neutral-700'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <span
                  className={`font-mono text-xs ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  {siteSettings.updated_at
                    ? `Last updated: ${new Date(siteSettings.updated_at).toLocaleString()}`
                    : 'Ready to publish'}
                </span>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-8 py-3 bg-[#E6192B] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                  style={{ borderRadius: '0px' }}
                >
                  {savingSettings ? 'Saving Live Changes...' : 'Save Live Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 2: PICTURES & GALLERY ARCHIVE */}
        {/* ============================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
                isLight ? 'border-[#D4CFC4]' : 'border-neutral-800'
              }`}
            >
              <div>
                <h2
                  className={`font-heading font-black text-2xl uppercase tracking-tight ${
                    isLight ? 'text-[#111111]' : 'text-white'
                  }`}
                >
                  Pictures &amp; Gallery Archive
                </h2>
                <p
                  className={`font-sans text-xs mt-1 ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  Managing all {galleryItems.length} photographs in the archive. Deleting a photograph permanently removes it across all devices and phones.
                </p>
              </div>

              <button
                onClick={() => setShowAddPhoto(!showAddPhoto)}
                className="flex items-center gap-2 px-4 py-2 bg-[#E6192B] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                style={{ borderRadius: '0px' }}
              >
                {showAddPhoto ? <HiXMark className="w-4 h-4" /> : <HiPlus className="w-4 h-4" />}
                <span>{showAddPhoto ? 'Cancel' : 'Add Photograph'}</span>
              </button>
            </div>

            {/* Add Photo Form */}
            {showAddPhoto && (
              <form
                onSubmit={handleAddPhotograph}
                className={`p-6 border space-y-4 ${
                  isLight
                    ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                    : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <h3
                  className={`font-heading font-bold text-sm uppercase tracking-wider ${
                    isLight ? 'text-[#111111]' : 'text-white'
                  }`}
                >
                  Add New Photograph to Chronicles
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label
                      className={`block font-mono text-xs uppercase ${
                        isLight ? 'text-neutral-700 font-bold' : 'text-neutral-300'
                      }`}
                    >
                      Image URL or Public Path
                    </label>
                    <input
                      type="text"
                      value={newPhotoSrc}
                      onChange={(e) => setNewPhotoSrc(e.target.value)}
                      placeholder="/gallery/photo.webp or https://..."
                      className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      className={`block font-mono text-xs uppercase ${
                        isLight ? 'text-neutral-700 font-bold' : 'text-neutral-300'
                      }`}
                    >
                      Collection / Event
                    </label>
                    <select
                      value={newPhotoCategory}
                      onChange={(e) =>
                        setNewPhotoCategory(e.target.value as 'BOTB 2.0')
                      }
                      className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                        isLight
                          ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                          : 'bg-[#090909] border-neutral-700 text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    >
                      <option value="BOTB 2.0">BOTB 2.0</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    className={`block font-mono text-xs uppercase ${
                      isLight ? 'text-neutral-700 font-bold' : 'text-neutral-300'
                    }`}
                  >
                    Event / Caption
                  </label>
                  <input
                    type="text"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    placeholder="e.g. Battle of the Bands 2.0 — Live Performance"
                    className={`w-full px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                      isLight
                        ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                        : 'bg-[#090909] border-neutral-700 text-white'
                    }`}
                    style={{ borderRadius: '0px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAddingPhoto}
                  className="px-5 py-2 bg-[#E6192B] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
                  style={{ borderRadius: '0px' }}
                >
                  <HiPlus className="w-4 h-4" />
                  <span>{isAddingPhoto ? 'Adding...' : 'Add Photograph'}</span>
                </button>
              </form>
            )}

            {/* Filter and Search Bar */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border ${
                isLight
                  ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                  : 'bg-[#111111] border-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {(['ALL', 'BOTB 2.0'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setGalleryCategoryFilter(cat);
                      setGalleryPage(1);
                    }}
                    className={`font-mono text-xs uppercase px-3 py-1.5 border transition-all ${
                      galleryCategoryFilter === cat
                        ? 'border-[#E6192B] bg-[#E6192B] text-white font-bold'
                        : isLight
                        ? 'border-[#C5BFB2] bg-[#FAF8F5] text-neutral-700 hover:text-black hover:border-black'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  value={gallerySearchQuery}
                  onChange={(e) => {
                    setGallerySearchQuery(e.target.value);
                    setGalleryPage(1);
                  }}
                  placeholder="Search photographs..."
                  className={`w-full pl-8 pr-3 py-1.5 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                    isLight
                      ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                      : 'bg-[#090909] border-neutral-700 text-white'
                  }`}
                  style={{ borderRadius: '0px' }}
                />
              </div>
            </div>

            {/* Gallery Images Grid */}
            {filteredGalleryPhotos.length === 0 ? (
              <div
                className={`p-12 text-center border space-y-2 ${
                  isLight
                    ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                    : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <p className="font-mono text-xs text-[#E6192B] uppercase tracking-widest font-bold">
                  No Photographs Found
                </p>
                <p
                  className={`font-sans text-sm ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  No photographs match the current filter or search criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {paginatedPhotos.map((item) => (
                    <div
                      key={item.id}
                      className={`group relative aspect-square border overflow-hidden ${
                        isLight ? 'bg-neutral-100 border-[#D4CFC4]' : 'bg-neutral-900 border-neutral-800'
                      }`}
                      style={{ borderRadius: '0px' }}
                    >
                      <Image
                        src={item.src}
                        alt={item.title || 'Gallery photograph'}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Gradient Overlay & Delete Action */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <span className="font-mono text-[9px] text-white/90 bg-black/80 px-1.5 py-0.5 self-start">
                          {item.category || 'BOTB 2.0'}
                        </span>

                        <button
                          onClick={() => handleDeletePhotograph(item.id)}
                          className="self-end p-2 bg-[#E6192B] hover:bg-black text-white transition-colors"
                          title="Delete photo permanently across all devices"
                          style={{ borderRadius: '0px' }}
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border font-mono text-xs ${
                    isLight
                      ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                      : 'bg-[#111111] border-neutral-800'
                  }`}
                >
                  <span className={isLight ? 'text-neutral-600' : 'text-neutral-400'}>
                    Showing {(galleryPage - 1) * photosPerPage + 1}–
                    {Math.min(galleryPage * photosPerPage, filteredGalleryPhotos.length)} of{' '}
                    {filteredGalleryPhotos.length} photographs
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGalleryPage((p) => Math.max(1, p - 1))}
                      disabled={galleryPage === 1}
                      className={`px-3 py-1.5 border disabled:opacity-40 flex items-center gap-1 ${
                        isLight
                          ? 'border-[#C5BFB2] bg-[#FAF8F5] text-neutral-800 hover:bg-[#EAE5DB]'
                          : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    >
                      <HiChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>

                    <span
                      className={`px-3 py-1.5 border font-bold ${
                        isLight
                          ? 'border-[#C5BFB2] text-[#111111] bg-white'
                          : 'border-neutral-800 text-white bg-[#090909]'
                      }`}
                    >
                      Page {galleryPage} of {totalGalleryPages}
                    </span>

                    <button
                      onClick={() => setGalleryPage((p) => Math.min(totalGalleryPages, p + 1))}
                      disabled={galleryPage === totalGalleryPages}
                      className={`px-3 py-1.5 border disabled:opacity-40 flex items-center gap-1 ${
                        isLight
                          ? 'border-[#C5BFB2] bg-[#FAF8F5] text-neutral-800 hover:bg-[#EAE5DB]'
                          : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white'
                      }`}
                      style={{ borderRadius: '0px' }}
                    >
                      <span>Next</span>
                      <HiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 3: VISITOR INSIGHTS & WASTE DATA CLEANUP */}
        {/* ============================================================== */}
        {activeTab === 'insights' && (
          <div className="space-y-8">
            {/* Header and Clear Waste Info Action Bar */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
                isLight ? 'border-[#D4CFC4]' : 'border-neutral-800'
              }`}
            >
              <div>
                <h2
                  className={`font-heading font-black text-2xl uppercase tracking-tight ${
                    isLight ? 'text-[#111111]' : 'text-white'
                  }`}
                >
                  Visitor Insights &amp; Access Logs
                </h2>
                <p
                  className={`font-sans text-xs mt-1 ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  Active community presence, security access log, and waste records cleanup.
                </p>
              </div>

              {/* Clear Waste Info Group */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleClearWasteData('visitors')}
                  disabled={clearingWaste}
                  className={`px-3 py-1.5 border font-mono text-[11px] uppercase transition-colors ${
                    isLight
                      ? 'border-[#C5BFB2] bg-[#FAF8F5] hover:bg-neutral-200 text-neutral-800'
                      : 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
                  }`}
                  style={{ borderRadius: '0px' }}
                >
                  Clear Visitor Logs
                </button>

                <button
                  type="button"
                  onClick={() => handleClearWasteData('access')}
                  disabled={clearingWaste}
                  className={`px-3 py-1.5 border font-mono text-[11px] uppercase transition-colors ${
                    isLight
                      ? 'border-[#C5BFB2] bg-[#FAF8F5] hover:bg-neutral-200 text-neutral-800'
                      : 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
                  }`}
                  style={{ borderRadius: '0px' }}
                >
                  Clear Security Logs
                </button>

                <button
                  type="button"
                  onClick={() => handleClearWasteData('all')}
                  disabled={clearingWaste}
                  className="px-3.5 py-1.5 bg-[#E6192B] hover:bg-black text-white font-mono text-[11px] font-bold uppercase transition-colors"
                  style={{ borderRadius: '0px' }}
                >
                  Clear All Waste Info
                </button>
              </div>
            </div>

            {/* Four Summary Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className={`p-4 border ${
                  isLight ? 'bg-[#FFFFFF] border-[#D4CFC4]' : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <div
                  className={`font-mono text-[11px] uppercase ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  Active Online Now
                </div>
                <div className="font-heading font-black text-3xl text-emerald-500 mt-1">
                  {Math.max(1, activeOnlineCount)}
                </div>
                <div className="font-sans text-[10px] text-neutral-500 mt-0.5">
                  Visitors seen in last 15 mins
                </div>
              </div>

              <div
                className={`p-4 border ${
                  isLight ? 'bg-[#FFFFFF] border-[#D4CFC4]' : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <div
                  className={`font-mono text-[11px] uppercase ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  Registered Users
                </div>
                <div
                  className={`font-heading font-black text-3xl mt-1 ${
                    isLight ? 'text-[#111111]' : 'text-white'
                  }`}
                >
                  {registeredUsersCount || (user ? 1 : 0)}
                </div>
                <div className="font-sans text-[10px] text-neutral-500 mt-0.5">
                  Verified member accounts
                </div>
              </div>

              <div
                className={`p-4 border ${
                  isLight ? 'bg-[#FFFFFF] border-[#D4CFC4]' : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <div
                  className={`font-mono text-[11px] uppercase ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  Visits Recorded
                </div>
                <div
                  className={`font-heading font-black text-3xl mt-1 ${
                    isLight ? 'text-[#111111]' : 'text-white'
                  }`}
                >
                  {visitorLogs.length}
                </div>
                <div className="font-sans text-[10px] text-neutral-500 mt-0.5">
                  Recent browsing sessions
                </div>
              </div>

              <div
                className={`p-4 border ${
                  isLight ? 'bg-[#FFFFFF] border-[#D4CFC4]' : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <div
                  className={`font-mono text-[11px] uppercase ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  Security Attempts
                </div>
                <div className="font-heading font-black text-3xl text-[#E6192B] mt-1">
                  {teamAccessLogs.length}
                </div>
                <div className="font-sans text-[10px] text-neutral-500 mt-0.5">
                  Team access authentications
                </div>
              </div>
            </div>

            {/* Table 1: Recent Community Activity */}
            <div className="space-y-3">
              <h3
                className={`font-heading font-bold text-lg uppercase tracking-tight ${
                  isLight ? 'text-[#111111]' : 'text-white'
                }`}
              >
                Recent Community Activity
              </h3>

              <div
                className={`overflow-x-auto border ${
                  isLight ? 'bg-[#FFFFFF] border-[#D4CFC4]' : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <table className="w-full text-left font-mono text-xs">
                  <thead
                    className={`border-b uppercase text-[11px] ${
                      isLight
                        ? 'bg-[#F4EFE5] border-[#D4CFC4] text-neutral-700'
                        : 'bg-[#161616] border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <tr>
                      <th className="px-4 py-3">Visitor / Region</th>
                      <th className="px-4 py-3">Last Active</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y font-sans ${
                      isLight
                        ? 'divide-[#EAE5DB] text-neutral-800'
                        : 'divide-neutral-800 text-neutral-300'
                    }`}
                  >
                    {visitorLogs.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-neutral-500 font-mono text-xs">
                          No recent visitor activity recorded.
                        </td>
                      </tr>
                    ) : (
                      visitorLogs.map((log) => (
                        <tr
                          key={log.id}
                          className={`transition-colors ${
                            isLight ? 'hover:bg-neutral-50' : 'hover:bg-neutral-900/60'
                          }`}
                        >
                          <td className="px-4 py-3 font-mono text-xs">
                            <div className={isLight ? 'text-black font-bold' : 'text-white'}>
                              {log.visitor_id}
                            </div>
                            <div className="text-[11px] text-neutral-500 font-sans">{log.location}</div>
                          </td>
                          <td
                            className={`px-4 py-3 font-mono text-xs ${
                              isLight ? 'text-neutral-600' : 'text-neutral-400'
                            }`}
                          >
                            {new Date(log.last_online).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-[#E6192B] font-bold">
                            {log.action}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Team Access Security Log */}
            <div
              className={`space-y-3 pt-4 border-t ${
                isLight ? 'border-[#D4CFC4]' : 'border-neutral-800'
              }`}
            >
              <h3
                className={`font-heading font-bold text-lg uppercase tracking-tight flex items-center gap-2 ${
                  isLight ? 'text-[#111111]' : 'text-white'
                }`}
              >
                <HiShieldExclamation className="w-5 h-5 text-[#E6192B]" />
                <span>Team Access Security Log</span>
              </h3>

              <div
                className={`overflow-x-auto border ${
                  isLight ? 'bg-[#FFFFFF] border-[#D4CFC4]' : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <table className="w-full text-left font-mono text-xs">
                  <thead
                    className={`border-b uppercase text-[11px] ${
                      isLight
                        ? 'bg-[#F4EFE5] border-[#D4CFC4] text-neutral-700'
                        : 'bg-[#161616] border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <tr>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Attempted From</th>
                      <th className="px-4 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y font-sans ${
                      isLight
                        ? 'divide-[#EAE5DB] text-neutral-800'
                        : 'divide-neutral-800 text-neutral-300'
                    }`}
                  >
                    {teamAccessLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-neutral-500 font-mono text-xs">
                          No access events logged.
                        </td>
                      </tr>
                    ) : (
                      teamAccessLogs.map((log) => (
                        <tr
                          key={log.id}
                          className={`transition-colors ${
                            isLight ? 'hover:bg-neutral-50' : 'hover:bg-neutral-900/60'
                          }`}
                        >
                          <td
                            className={`px-4 py-3 font-mono text-xs ${
                              isLight ? 'text-neutral-600' : 'text-neutral-400'
                            }`}
                          >
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">
                            <span
                              className={`px-2 py-0.5 uppercase tracking-wider font-bold text-[10px] ${
                                log.status === 'successful'
                                  ? isLight
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-emerald-950/70 border border-emerald-600 text-emerald-400'
                                  : isLight
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : 'bg-red-950/70 border border-red-700 text-red-300'
                              }`}
                              style={{ borderRadius: '0px' }}
                            >
                              {log.status === 'successful'
                                ? 'Successful'
                                : 'Passkey Mismatch'}
                            </span>
                          </td>
                          <td
                            className={`px-4 py-3 font-mono text-xs ${
                              isLight ? 'text-neutral-700' : 'text-neutral-300'
                            }`}
                          >
                            {log.attempted_from || 'Local Client'}
                          </td>
                          <td
                            className={`px-4 py-3 font-sans text-xs ${
                              isLight ? 'text-neutral-600' : 'text-neutral-400'
                            }`}
                          >
                            {log.reason || (log.status === 'successful' ? 'Verified passkey' : 'Passkey mismatch')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 4: COMMUNITY REVIEWS */}
        {/* ============================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
                isLight ? 'border-[#D4CFC4]' : 'border-neutral-800'
              }`}
            >
              <div>
                <h2
                  className={`font-heading font-black text-2xl uppercase tracking-tight ${
                    isLight ? 'text-[#111111]' : 'text-white'
                  }`}
                >
                  Community Reviews
                </h2>
                <p
                  className={`font-sans text-xs mt-1 ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  Decide which community reviews and experiences are displayed on the public website.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                {(['all', 'pending', 'approved'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setReviewFilter(st)}
                    className={`font-mono text-xs uppercase px-3 py-1.5 border transition-all ${
                      reviewFilter === st
                        ? 'border-[#E6192B] bg-[#E6192B] text-white font-bold'
                        : isLight
                        ? 'border-[#C5BFB2] bg-[#FAF8F5] text-neutral-700 hover:text-black hover:border-black'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredReviews.length === 0 ? (
              <div
                className={`p-12 text-center border space-y-2 ${
                  isLight
                    ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                    : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <p className="font-mono text-xs text-[#E6192B] uppercase tracking-widest font-bold">
                  No Reviews Found
                </p>
                <p
                  className={`font-sans text-sm ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  No community reviews match the selected filter.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-6 border space-y-4 shadow-sm ${
                      isLight
                        ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                        : 'bg-[#111111] border-neutral-800'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-neutral-800/30">
                      <div>
                        <span
                          className={`font-heading font-bold text-base ${
                            isLight ? 'text-[#111111]' : 'text-white'
                          }`}
                        >
                          {rev.display_name}
                        </span>
                        <div
                          className={`font-mono text-[11px] ${
                            isLight ? 'text-neutral-500' : 'text-neutral-400'
                          }`}
                        >
                          {rev.role_or_relation || 'Community Member'} •{' '}
                          {new Date(rev.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 uppercase font-bold ${
                            rev.status === 'approved'
                              ? 'bg-emerald-600 text-white'
                              : rev.status === 'pending'
                              ? 'bg-amber-600 text-white'
                              : 'bg-red-700 text-white'
                          }`}
                          style={{ borderRadius: '0px' }}
                        >
                          {rev.status}
                        </span>

                        <div className="flex text-amber-400 text-xs">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p
                      className={`font-sans text-sm leading-relaxed ${
                        isLight ? 'text-neutral-800' : 'text-neutral-200'
                      }`}
                    >
                      &ldquo;{rev.review_text}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateReviewStatus(rev.id, 'approved')}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase font-bold flex items-center gap-1.5"
                            style={{ borderRadius: '0px' }}
                          >
                            <HiCheck className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                        )}

                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateReviewStatus(rev.id, 'rejected')}
                            className={`px-3.5 py-1.5 border font-mono text-xs uppercase flex items-center gap-1.5 ${
                              isLight
                                ? 'border-[#C5BFB2] bg-[#FAF8F5] hover:bg-neutral-200 text-neutral-800'
                                : 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
                            }`}
                            style={{ borderRadius: '0px' }}
                          >
                            <HiEyeSlash className="w-4 h-4" />
                            <span>Hide</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className={`p-1.5 border hover:border-red-600 hover:bg-red-50 text-neutral-500 hover:text-red-600 ${
                          isLight ? 'border-[#D4CFC4]' : 'border-neutral-800'
                        }`}
                        title="Delete permanently"
                        style={{ borderRadius: '0px' }}
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 5: NOTICE BOARD / ANNOUNCEMENTS */}
        {/* ============================================================== */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            <div
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
                isLight ? 'border-[#D4CFC4]' : 'border-neutral-800'
              }`}
            >
              <div>
                <h2
                  className={`font-heading font-black text-2xl uppercase tracking-tight ${
                    isLight ? 'text-[#111111]' : 'text-white'
                  }`}
                >
                  Notice Board &amp; Announcements
                </h2>
                <p
                  className={`font-sans text-xs mt-1 ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  Publish live announcements, volunteer notices, and event banners.
                </p>
              </div>
            </div>

            {/* Create Announcement Form */}
            <form
              onSubmit={handleCreateNotice}
              className={`p-6 border space-y-4 shadow-sm ${
                isLight
                  ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                  : 'bg-[#111111] border-neutral-800'
              }`}
              style={{ borderRadius: '0px' }}
            >
              <h3
                className={`font-heading font-bold text-sm uppercase tracking-wider ${
                  isLight ? 'text-[#111111]' : 'text-white'
                }`}
              >
                Publish New Announcement
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label
                    className={`block font-mono text-xs uppercase ${
                      isLight ? 'text-neutral-700 font-bold' : 'text-neutral-300'
                    }`}
                  >
                    Headline
                  </label>
                  <input
                    type="text"
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="e.g. BOTB 2.0 Audition Results Announced"
                    className={`w-full px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                      isLight
                        ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                        : 'bg-[#090909] border-neutral-700 text-white'
                    }`}
                    style={{ borderRadius: '0px' }}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label
                    className={`block font-mono text-xs uppercase ${
                      isLight ? 'text-neutral-700 font-bold' : 'text-neutral-300'
                    }`}
                  >
                    Category
                  </label>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value)}
                    className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                      isLight
                        ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                        : 'bg-[#090909] border-neutral-700 text-white'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Event">Event</option>
                    <option value="Volunteering">Volunteering</option>
                    <option value="Fundraiser">Fundraiser</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  className={`block font-mono text-xs uppercase ${
                    isLight ? 'text-neutral-700 font-bold' : 'text-neutral-300'
                  }`}
                >
                  Announcement Message
                </label>
                <textarea
                  rows={3}
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  placeholder="Details about the event, location, timings, or instructions..."
                  className={`w-full px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#E6192B] border ${
                    isLight
                      ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                      : 'bg-[#090909] border-neutral-700 text-white'
                  }`}
                  style={{ borderRadius: '0px' }}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    className={`block font-mono text-[11px] uppercase ${
                      isLight ? 'text-neutral-700 font-bold' : 'text-neutral-400'
                    }`}
                  >
                    Optional Button Link
                  </label>
                  <input
                    type="url"
                    value={newNoticeLinkUrl}
                    onChange={(e) => setNewNoticeLinkUrl(e.target.value)}
                    placeholder="https://..."
                    className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                      isLight
                        ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                        : 'bg-[#090909] border-neutral-700 text-white'
                    }`}
                    style={{ borderRadius: '0px' }}
                  />
                </div>

                <div className="space-y-1">
                  <label
                    className={`block font-mono text-[11px] uppercase ${
                      isLight ? 'text-neutral-700 font-bold' : 'text-neutral-400'
                    }`}
                  >
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={newNoticeLinkText}
                    onChange={(e) => setNewNoticeLinkText(e.target.value)}
                    placeholder="Read Details"
                    className={`w-full px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#E6192B] border ${
                      isLight
                        ? 'bg-[#FAF8F5] border-[#C5BFB2] text-[#111111]'
                        : 'bg-[#090909] border-neutral-700 text-white'
                    }`}
                    style={{ borderRadius: '0px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingNotice}
                className="px-6 py-2.5 bg-[#E6192B] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                style={{ borderRadius: '0px' }}
              >
                {isSubmittingNotice ? 'Publishing...' : 'Publish Announcement'}
              </button>
            </form>

            {/* List of Published Notices */}
            <div className="space-y-3">
              <h3
                className={`font-heading font-bold text-sm uppercase tracking-wider ${
                  isLight ? 'text-[#111111]' : 'text-white'
                }`}
              >
                Published Notices ({updates.length})
              </h3>

              {updates.length === 0 ? (
                <div
                  className={`p-8 text-center border ${
                    isLight ? 'bg-white border-[#D4CFC4]' : 'bg-[#111111] border-neutral-800'
                  }`}
                  style={{ borderRadius: '0px' }}
                >
                  <p className="font-mono text-xs text-neutral-400">
                    No announcements published yet.
                  </p>
                </div>
              ) : (
                updates.map((up) => (
                  <div
                    key={up.id}
                    className={`p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                      isLight
                        ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                        : 'bg-[#111111] border-neutral-800'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-[#E6192B] text-white px-2 py-0.5 uppercase font-bold">
                          {up.category}
                        </span>
                        <span
                          className={`font-heading font-bold text-base ${
                            isLight ? 'text-[#111111]' : 'text-white'
                          }`}
                        >
                          {up.title}
                        </span>
                      </div>
                      <p
                        className={`font-sans text-xs ${
                          isLight ? 'text-neutral-700' : 'text-neutral-300'
                        }`}
                      >
                        {up.content}
                      </p>
                      <span className="font-mono text-[10px] text-neutral-400 block pt-1">
                        Published {new Date(up.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteNotice(up.id)}
                      className={`p-2 border hover:border-red-600 hover:bg-red-50 text-neutral-500 hover:text-red-600 shrink-0 ${
                        isLight ? 'border-[#D4CFC4]' : 'border-neutral-800'
                      }`}
                      title="Delete announcement"
                      style={{ borderRadius: '0px' }}
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 6: COMMUNITY MESSAGES */}
        {/* ============================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
                isLight ? 'border-[#D4CFC4]' : 'border-neutral-800'
              }`}
            >
              <div>
                <h2
                  className={`font-heading font-black text-2xl uppercase tracking-tight ${
                    isLight ? 'text-[#111111]' : 'text-white'
                  }`}
                >
                  Community Messages
                </h2>
                <p
                  className={`font-sans text-xs mt-1 ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  Direct confessions, inquiries, and suggestions sent through the website forms.
                </p>
              </div>
            </div>

            {feedback.length === 0 ? (
              <div
                className={`p-12 text-center border space-y-2 ${
                  isLight
                    ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                    : 'bg-[#111111] border-neutral-800'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <p className="font-mono text-xs text-[#E6192B] uppercase tracking-widest font-bold">
                  No Messages Found
                </p>
                <p
                  className={`font-sans text-sm ${
                    isLight ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  No community inquiries or feedback have been submitted yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedback.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 border space-y-3 shadow-sm ${
                      isLight
                        ? 'bg-[#FFFFFF] border-[#D4CFC4]'
                        : 'bg-[#111111] border-neutral-800'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-neutral-800/30">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 uppercase font-bold ${
                            msg.status === 'new'
                              ? 'bg-[#E6192B] text-white'
                              : 'bg-neutral-600 text-white'
                          }`}
                          style={{ borderRadius: '0px' }}
                        >
                          {msg.status === 'new' ? 'Unread' : 'Reviewed'}
                        </span>
                        <span
                          className={`font-heading font-bold text-sm ${
                            isLight ? 'text-[#111111]' : 'text-white'
                          }`}
                        >
                          {msg.subject || (msg.type === 'feedback' ? 'Community Feedback' : 'Suggestion')}
                        </span>
                      </div>

                      <span className="font-mono text-[11px] text-neutral-400">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p
                      className={`font-sans text-sm leading-relaxed whitespace-pre-wrap ${
                        isLight ? 'text-neutral-800' : 'text-neutral-200'
                      }`}
                    >
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      {msg.email ? (
                        <a
                          href={`mailto:${msg.email}`}
                          className="font-mono text-xs text-[#E6192B] hover:underline"
                        >
                          Reply to: {msg.email}
                        </a>
                      ) : (
                        <span className="font-mono text-xs text-neutral-400">
                          Anonymous submission
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        {msg.status === 'new' && (
                          <button
                            onClick={() => handleMarkMessageRead(msg.id)}
                            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs uppercase"
                            style={{ borderRadius: '0px' }}
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className={`p-1.5 border hover:border-red-600 hover:bg-red-50 text-neutral-500 hover:text-red-600 ${
                            isLight ? 'border-[#D4CFC4]' : 'border-neutral-800'
                          }`}
                          title="Delete message"
                          style={{ borderRadius: '0px' }}
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
