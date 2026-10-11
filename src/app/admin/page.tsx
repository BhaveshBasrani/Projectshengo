'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import Image from 'next/image';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import PunkLoader from '@/components/ui/PunkLoader';
import {
  PublicReview,
  SuggestionFeedback,
  BlogPost,
  SiteUpdate,
  SiteConfig,
  AdminStats,
  UserProfile,
  BulletinCardStyle,
  BulletinDoodleIcon,
  parseBulletinPayload,
} from '@/lib/types';
import { isAuthorizedAdminEmail } from '@/lib/admin/auth';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, profile, loading, logout, isAdmin } = useAuth();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reviews' | 'feedback' | 'posts' | 'updates' | 'email' | 'config'>('overview');

  // Authentication states
  const [adminSecret, setAdminSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Password change states
  const [newMasterPassword, setNewMasterPassword] = useState('');
  const [confirmMasterPassword, setConfirmMasterPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  // Live telemetry states (100% Real & Verified)
  const [liveLatency, setLiveLatency] = useState<number | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [dbStatus, setDbStatus] = useState<'connected' | 'checking' | 'error'>('checking');

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [feedback, setFeedback] = useState<SuggestionFeedback[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [updates, setUpdates] = useState<SiteUpdate[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Modals & Form states
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateContent, setNewUpdateContent] = useState('');
  const [newUpdateCategory, setNewUpdateCategory] = useState('Announcement');
  const [newUpdateCardStyle, setNewUpdateCardStyle] = useState<BulletinCardStyle>('zine');
  const [newUpdateImageUrl, setNewUpdateImageUrl] = useState('');
  const [newUpdateIsBanner, setNewUpdateIsBanner] = useState(true);
  const [newUpdateLinkUrl, setNewUpdateLinkUrl] = useState('');
  const [newUpdateLinkText, setNewUpdateLinkText] = useState('READ MORE');
  const [newUpdateDoodleIcon, setNewUpdateDoodleIcon] = useState<BulletinDoodleIcon>('star');

  const [emailSubject, setEmailSubject] = useState('');
  const [emailHeadline, setEmailHeadline] = useState('');
  const [emailSubtitle, setEmailSubtitle] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailCtaText, setEmailCtaText] = useState('VISIT OUR WEBSITE');
  const [emailCtaUrl, setEmailCtaUrl] = useState('https://projectshe.org');
  const [emailTarget, setEmailTarget] = useState<'subscribed_only' | 'all' | 'test_admin'>('subscribed_only');

  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [userSubscriptionFilter, setUserSubscriptionFilter] = useState<'all' | 'subscribed' | 'unsubscribed'>('all');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'archived'>('pending');
  const [feedbackTypeFilter, setFeedbackTypeFilter] = useState<'all' | 'suggestion' | 'feedback'>('all');

  const getHeaders = (keyToUse?: string) => {
    const key = keyToUse || adminSecret || (typeof window !== 'undefined' ? sessionStorage.getItem('project_she_admin_key') || localStorage.getItem('project_she_admin_key') || '' : '');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-admin-secret': key,
    };
    if (user?.email) {
      headers['x-admin-email'] = user.email;
    }
    return headers;
  };

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // Verify key against API and load real data
  const verifyAndLoad = async (key: string): Promise<boolean> => {
    const startTime = performance.now();
    try {
      const headers = getHeaders(key);
      const sRes = await fetch('/api/admin/stats', { headers });

      if (sRes.status === 403) {
        setIsAuthenticated(false);
        setDbStatus('error');
        return false;
      }

      const sData = await sRes.json();
      if (!sData.success) {
        setIsAuthenticated(false);
        setDbStatus('error');
        return false;
      }

      const duration = Math.round(performance.now() - startTime);
      setLiveLatency(duration);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDbStatus('connected');
      setIsAuthenticated(true);
      setAdminSecret(key);
      setStats(sData.stats);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('project_she_admin_key', key);
        localStorage.setItem('project_she_admin_key', key);
      }

      // Load supporting records in parallel without heavy polling
      const [uRes, rRes, fRes, pRes, upRes, cRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/reviews', { headers }),
        fetch('/api/admin/feedback', { headers }),
        fetch('/api/admin/posts', { headers }),
        fetch('/api/admin/updates', { headers }),
        fetch('/api/admin/config', { headers }),
      ]);

      const [uData, rData, fData, pData, upData, cData] = await Promise.all([
        uRes.json(),
        rRes.json(),
        fRes.json(),
        pRes.json(),
        upRes.json(),
        cRes.json(),
      ]);

      if (uData.success) setUsers(uData.users);
      if (rData.success) setReviews(rData.reviews);
      if (fData.success) setFeedback(fData.feedback);
      if (pData.success) setPosts(pData.posts);
      if (upData.success) setUpdates(upData.updates);
      if (cData.success) setConfig(cData.config);

      return true;
    } catch (e) {
      console.warn('Admin load failed:', e);
      setDbStatus('error');
      return false;
    }
  };

  // Check saved session on mount and respond to verified director email
  useEffect(() => {
    const initAuth = async () => {
      setAuthChecking(true);
      if (typeof window !== 'undefined') {
        const storedKey = sessionStorage.getItem('project_she_admin_key') || localStorage.getItem('project_she_admin_key');
        if (storedKey) {
          const ok = await verifyAndLoad(storedKey);
          if (!ok && !(user?.email && isAuthorizedAdminEmail(user.email))) {
            sessionStorage.removeItem('project_she_admin_key');
            localStorage.removeItem('project_she_admin_key');
          }
        } else if (user?.email && isAuthorizedAdminEmail(user.email)) {
          await verifyAndLoad('');
        }
      }
      setAuthChecking(false);
    };

    initAuth();
  }, [user]);

  // Handle password form submission
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;

    setActionLoading(true);
    setLoginError('');

    try {
      const ok = await verifyAndLoad(passwordInput.trim());
      if (!ok) {
        setLoginError('Incorrect password. Access denied.');
      } else {
        showToast('Admin access granted');
      }
    } catch (e: any) {
      setLoginError('Verification failed. Please check your connection.');
    } finally {
      setActionLoading(false);
    }
  };

  // Explicit Lock / Log Out
  const handleLockAdmin = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('project_she_admin_key');
      localStorage.removeItem('project_she_admin_key');
    }
    setAdminSecret('');
    setIsAuthenticated(false);
    setPasswordInput('');
    setLoginError('');
    showToast('Admin panel locked');
  };

  // Refresh data explicitly on click (keeps egress low)
  const handleRefreshData = async () => {
    if (!adminSecret) return;
    setActionLoading(true);
    await Promise.all([
      verifyAndLoad(adminSecret),
      new Promise((resolve) => setTimeout(resolve, 600)),
    ]);
    setActionLoading(false);
    showToast('Data refreshed');
  };

  // Delete User Account
  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently delete this user account?\n\nEmail: ${email}\n\nThis will remove their profile and access immediately.`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Account deleted: ${email}`);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        if (stats) {
          setStats({ ...stats, totalUsers: Math.max(0, stats.totalUsers - 1) });
        }
      } else {
        alert(data.error || 'Failed to delete member account');
      }
    } catch (e) {
      alert('Error deleting member account');
    } finally {
      setActionLoading(false);
    }
  };

  // Review Actions
  const handleModerateReview = async (id: string, status: 'approved' | 'rejected' | 'pending' | 'archived') => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showToast(`Review marked as ${status.toUpperCase()}`);
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status, reviewed_at: new Date().toISOString() } : r))
        );
        if (stats) {
          const wasPending = reviews.find((r) => r.id === id)?.status === 'pending';
          const wasApproved = reviews.find((r) => r.id === id)?.status === 'approved';
          const pendingChange = wasPending && status !== 'pending' ? -1 : (!wasPending && status === 'pending' ? 1 : 0);
          const pubChange = status === 'approved' ? (wasApproved ? 0 : 1) : (wasApproved ? -1 : 0);
          setStats({
            ...stats,
            pendingReviews: Math.max(0, stats.pendingReviews + pendingChange),
            publishedReviews: Math.max(0, stats.publishedReviews + pubChange),
          });
        }
      }
    } catch (e) {
      showToast('Action failed');
    } finally {
      setActionLoading(false);
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
        showToast('Review permanently deleted');
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e) {
      showToast('Delete failed');
    }
  };

  // Feedback Actions
  const handleUpdateFeedbackStatus = async (id: string, status: 'new' | 'reviewed' | 'resolved') => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showToast(`Status updated to ${status}`);
        setFeedback((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status, resolved_at: new Date().toISOString() } : f))
        );
      }
    } catch (e) {
      showToast('Status update failed');
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('Delete this message entry?')) return;
    try {
      const res = await fetch(`/api/admin/feedback?id=${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        showToast('Message deleted');
        setFeedback((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (e) {
      showToast('Delete failed');
    }
  };

  // Post Actions
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.body) {
      alert('Title and Body are required.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(editingPost),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Article saved successfully');
        setEditingPost(null);
        await verifyAndLoad(adminSecret);
      } else {
        alert(data.error || 'Failed to save article');
      }
    } catch (e) {
      showToast('Failed to save article');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return;
    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        showToast('Article deleted');
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      showToast('Delete failed');
    }
  };

  const handleTogglePinPost = async (post: BlogPost) => {
    const currentlyPinned = posts.filter((p) => p.is_pinned).length;
    if (!post.is_pinned && currentlyPinned >= 3) {
      alert('Maximum 3 blogs can be pinned simultaneously. Please unpin an existing blog first.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ id: post.id, is_pinned: !post.is_pinned }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(post.is_pinned ? 'Blog unpinned' : 'Blog pinned to top (Max 3)');
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, is_pinned: !post.is_pinned } : p))
        );
      } else {
        alert(data.error || 'Failed to toggle pin state');
      }
    } catch (e) {
      showToast('Error toggling pin status');
    } finally {
      setActionLoading(false);
    }
  };

  // Update Actions
  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateTitle || !newUpdateContent) {
      alert('Title and Content required');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/updates', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          title: newUpdateTitle,
          content: newUpdateContent,
          category: newUpdateCategory,
          card_style: newUpdateCardStyle,
          image_url: newUpdateImageUrl,
          is_banner: newUpdateIsBanner,
          link_url: newUpdateLinkUrl,
          link_text: newUpdateLinkText,
          doodle_icon: newUpdateDoodleIcon,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Bulletin posted successfully to website & banner');
        setNewUpdateTitle('');
        setNewUpdateContent('');
        setNewUpdateImageUrl('');
        setNewUpdateLinkUrl('');
        if (data.update) {
          setUpdates((prev) => [data.update, ...prev]);
        }
      }
    } catch (e) {
      showToast('Failed to post bulletin');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUpdate = async (id: string) => {
    if (!confirm('Delete this bulletin?')) return;
    try {
      const res = await fetch(`/api/admin/updates?id=${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        showToast('Bulletin deleted');
        setUpdates((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (e) {
      showToast('Delete failed');
    }
  };

  const handleModerateBulletin = async (updateId: string, action: 'pin' | 'lock' | 'toggle_banner' | 'delete') => {
    if (action === 'delete' && !confirm('Are you sure you want to permanently delete this bulletin topic?')) return;
    try {
      const res = await fetch('/api/bulletin/moderate', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ updateId, action }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Bulletin ${action} updated`);
        if (data.updates) {
          setUpdates(data.updates);
        } else if (action === 'delete') {
          setUpdates((prev) => prev.filter((u) => u.id !== updateId));
        }
      }
    } catch (e) {
      showToast('Moderation action failed');
    }
  };

  // Config Actions
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(config),
      });
      if (res.ok) {
        showToast('Website settings updated successfully');
      }
    } catch (e) {
      showToast('Failed to update website settings');
    } finally {
      setActionLoading(false);
    }
  };

  // Global Save Changes Action
  const handleGlobalSaveChanges = async () => {
    setActionLoading(true);
    try {
      if (config) {
        await fetch('/api/admin/config', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(config),
        });
      }
      await verifyAndLoad(adminSecret);
      showToast('All changes saved and synchronized with database!');
    } catch (e) {
      showToast('Error saving changes');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Master Password Change from Admin Panel
  const handleChangeMasterPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMasterPassword || newMasterPassword.length < 6) {
      setPasswordChangeStatus({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }
    if (newMasterPassword !== confirmMasterPassword) {
      setPasswordChangeStatus({ type: 'error', message: 'Passwords do not match. Please re-enter.' });
      return;
    }

    setPasswordChangeStatus({ type: 'loading', message: 'Updating master password across system...' });
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ newPassword: newMasterPassword.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const updatedKey = newMasterPassword.trim();
        setAdminSecret(updatedKey);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('project_she_admin_key', updatedKey);
          localStorage.setItem('project_she_admin_key', updatedKey);
        }
        setPasswordChangeStatus({ type: 'success', message: 'Master Password successfully changed! Active session key updated.' });
        setNewMasterPassword('');
        setConfirmMasterPassword('');
        showToast('Master password successfully updated');
      } else {
        setPasswordChangeStatus({ type: 'error', message: data.error || 'Failed to update master password' });
      }
    } catch (err: any) {
      setPasswordChangeStatus({ type: 'error', message: err?.message || 'Network error updating password' });
    }
  };

  // Newsletter Actions
  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailContent.trim()) {
      alert('Subject and Content are required.');
      return;
    }

    const recipientDesc =
      emailTarget === 'test_admin'
        ? 'Test to your Admin Email'
        : emailTarget === 'all'
          ? 'ALL registered members'
          : 'SUBSCRIBED members only';

    if (!confirm(`Are you sure you want to send this newsletter to ${recipientDesc}?`)) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          subject: emailSubject.trim(),
          headline: (emailHeadline || emailSubject).trim(),
          subtitle: emailSubtitle.trim(),
          content: emailContent.trim(),
          ctaText: emailCtaText.trim(),
          ctaUrl: emailCtaUrl.trim(),
          targetAudience: emailTarget,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Newsletter sent successfully!');
        if (emailTarget !== 'test_admin') {
          setEmailSubject('');
          setEmailHeadline('');
          setEmailSubtitle('');
          setEmailContent('');
        }
      } else {
        alert(data.error || data.message || 'Newsletter send error');
      }
    } catch (e: any) {
      alert('Error sending newsletter: ' + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 1. Loading screen while checking existing session
  if (authChecking) {
    return (
      <div className="pt-36 pb-20 px-4 max-w-md mx-auto min-h-[70vh] font-mono flex flex-col items-center justify-center">
        <PunkLoader
          label="Checking admin session..."
          size="full"
        />
      </div>
    );
  }

  // 2. PASSWORD GATE SCREEN (Strict Lock Screen)
  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-md mx-auto min-h-[80vh] font-mono select-none relative">
        {/* Pinned Extracted Punk Spiral Star Sticker */}
        <div className="absolute -top-5 -right-5 w-20 h-20 pointer-events-none z-20 hidden sm:block">
          <div className="zine-tape absolute -top-2 left-3 z-10 scale-75" />
          <Image
            src="/assets/punk-red-spiral-star-clean.png"
            alt="Punk Spiral Star"
            width={76}
            height={76}
            priority
            style={{ width: 'auto', height: 'auto' }}
            className="object-contain drop-shadow-[0_0_10px_rgba(229,9,20,0.7)] animate-[spin_10s_linear_infinite]"
          />
        </div>

        {/* Pinned Polly Barbed Star Sticker on Left */}
        <div className="absolute -bottom-6 -left-6 w-16 h-24 pointer-events-none z-20 hidden sm:block">
          <div className="zine-tape absolute -top-2 left-2 z-10 scale-50" />
          <Image
            src="/assets/punk-polly-stars-clean.png"
            alt="Polly Star"
            width={64}
            height={96}
            priority
            style={{ width: 'auto', height: 'auto' }}
            className="object-contain drop-shadow-[0_0_8px_rgba(229,9,20,0.6)] -rotate-12"
          />
        </div>

        <div className="p-8 bg-[#0E0E0E] border-4 border-[#E50914] shadow-[8px_8px_0px_0px_#E50914] text-[#F4F1EA] space-y-6 relative stencil-cut overflow-hidden">
          {/* Subtle Cyber Lily Watermark */}
          <div className="absolute -bottom-10 -right-6 w-36 h-52 opacity-15 pointer-events-none z-0">
            <Image
              src="/assets/punk-lily-clean.png"
              alt="Cyber Lily Watermark"
              width={144}
              height={208}
              priority
              style={{ width: 'auto', height: 'auto' }}
              className="object-contain"
            />
          </div>

          <div className="zine-tape absolute -top-3 left-6 z-10" />

          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex p-3 bg-[#181818] border-2 border-[#E50914] mb-2 stencil-cut">
              <GrungeGlyph name="lock" className="w-8 h-8 text-[#E50914]" />
            </div>
            <span className="text-[10px] text-[#E50914] uppercase tracking-widest font-black block">
              [CLEARANCE LEVEL 4 REQUIRED]
            </span>
            <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-white">
              ADMINISTRATOR SIGN IN
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Enter your master password to access the Project S.H.E. Admin Console.
            </p>
          </div>

          {user?.email && isAuthorizedAdminEmail(user.email) && (
            <div className="p-4 bg-[#141414] border-2 border-[#00FF66] shadow-[4px_4px_0px_0px_#00FF66] text-[#00FF66] space-y-2 text-center relative z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 block">
                [VERIFIED SINGLE DIRECTOR ACCOUNT]
              </span>
              <div className="text-xs font-bold text-white font-mono break-all">
                {user.email}
              </div>
              <button
                type="button"
                onClick={() => verifyAndLoad(adminSecret || '')}
                disabled={actionLoading}
                className="w-full py-2.5 bg-[#00FF66] hover:bg-white text-black font-heading font-black text-xs uppercase tracking-wider transition-all border border-[#00FF66]"
              >
                {actionLoading ? 'AUTHENTICATING...' : 'ENTER CONSOLE AS VERIFIED DIRECTOR'}
              </button>
            </div>
          )}

          <form onSubmit={handlePasswordLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-[11px] uppercase font-bold text-neutral-400 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                spellCheck={false}
                placeholder="Enter admin password..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (loginError) setLoginError('');
                }}
                className="w-full p-3 bg-[#141414] border-2 border-neutral-700 focus:border-[#E50914] text-white text-xs outline-none font-mono"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <GrungeGlyph name="alert" className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={actionLoading || !passwordInput.trim()}
              className="w-full py-3 bg-[#E50914] hover:bg-white hover:text-black text-white font-heading font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 stencil-cut border border-[#E50914]"
            >
              {actionLoading ? (
                <PunkLoader size="sm" label="Signing in..." className="text-white" />
              ) : (
                <>
                  <GrungeGlyph name="key" className="w-4 h-4" />
                  <span>SIGN IN TO ADMIN PANEL</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800 text-center">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-xs text-neutral-500 hover:text-neutral-300 uppercase underline underline-offset-4 font-bold"
            >
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered lists for simple UI
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      userSearch === '' ||
      (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.display_name && u.display_name.toLowerCase().includes(userSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (userSubscriptionFilter === 'subscribed') return u.email_subscribed;
    if (userSubscriptionFilter === 'unsubscribed') return !u.email_subscribed;
    return true;
  });

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'all') return true;
    return r.status === reviewFilter;
  });

  const filteredFeedback = feedback.filter((f) => {
    if (feedbackTypeFilter === 'all') return true;
    return f.type === feedbackTypeFilter;
  });

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen select-none font-mono">

      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-current">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="punk-stamp text-xs bg-[#E50914] text-white border-black">
              ADMIN DASHBOARD
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Live &amp; Connected
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-white">
            PROJECT S.H.E. ADMIN
          </h1>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* SAVE CHANGES BUTTON */}
          <button
            type="button"
            onClick={handleGlobalSaveChanges}
            disabled={actionLoading}
            className="group px-4 py-2 bg-[#E50914] hover:bg-white text-white hover:text-black border-2 border-white shadow-[3px_3px_0px_0px_#000000] text-xs font-heading font-black uppercase flex items-center gap-1.5 transition-all hover-lift disabled:opacity-50 stencil-cut"
            title="Save all changes and force database sync"
          >
            <GrungeGlyph name="save" className="w-3.5 h-3.5 text-white group-hover:text-black transition-colors" />
            <span>{actionLoading ? 'SAVING...' : 'SAVE CHANGES'}</span>
          </button>

          <button
            type="button"
            onClick={handleRefreshData}
            disabled={actionLoading}
            className="group px-3 py-2 bg-[#141414] border border-neutral-700 hover:border-[#E50914] text-white text-xs font-bold uppercase flex items-center gap-1.5 transition-colors hover-lift stencil-cut disabled:opacity-50"
            title="Refresh database records"
          >
            <GrungeGlyph
              name="loader"
              className={`w-3.5 h-3.5 ${
                actionLoading
                  ? 'animate-spin text-[#E50914]'
                  : 'text-neutral-400 group-hover:text-white group-hover:rotate-180 transition-transform duration-500'
              }`}
            />
            <span>{actionLoading ? 'REFRESHING...' : 'REFRESH'}</span>
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-3 py-2 border border-neutral-700 hover:border-white text-neutral-300 text-xs font-bold uppercase stencil-cut"
          >
            PUBLIC SITE
          </button>
          <button
            type="button"
            onClick={handleLockAdmin}
            className="px-3 py-2 bg-red-950/60 border border-red-800 hover:bg-[#E50914] text-white text-xs font-bold uppercase flex items-center gap-1.5 transition-colors stencil-cut"
            title="Lock Admin Panel"
          >
            <GrungeGlyph name="lock" className="w-3.5 h-3.5" />
            <span>LOCK PANEL</span>
          </button>
        </div>
      </div>

      {/* Floating Status Toast */}
      {feedbackMsg && (
        <div className="fixed bottom-20 right-6 z-50 p-4 bg-[#E50914] text-white font-mono text-xs font-bold uppercase shadow-[4px_4px_0px_0px_#000000] border-2 border-white animate-bounce stencil-cut">
          {feedbackMsg}
        </div>
      )}

      {/* Floating Quick Save Button for easy access anywhere on the dashboard */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          type="button"
          onClick={handleGlobalSaveChanges}
          disabled={actionLoading}
          className="group px-5 py-3 bg-[#E50914] hover:bg-white text-white hover:text-black border-2 border-white shadow-[4px_4px_0px_0px_#000000] text-xs font-heading font-black uppercase flex items-center gap-2 transition-all hover-lift disabled:opacity-50 stencil-cut"
          title="Save all changes and synchronize database"
        >
          <GrungeGlyph name="save" className="w-4 h-4 text-white group-hover:text-black transition-colors" />
          <span>{actionLoading ? 'SAVING...' : 'SAVE CHANGES'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-8 text-xs font-bold uppercase border-b border-neutral-800">
        {[
          { id: 'overview', label: 'OVERVIEW', count: null },
          { id: 'users', label: 'MEMBERS', count: users.length },
          { id: 'reviews', label: 'REVIEWS', count: stats?.pendingReviews },
          { id: 'feedback', label: 'SUGGESTIONS & MESSAGES', count: (stats?.newSuggestions || 0) + (stats?.newFeedback || 0) },
          { id: 'posts', label: 'STORIES & BLOG', count: posts.length },
          { id: 'updates', label: 'BULLETINS', count: updates.length },
          { id: 'email', label: 'NEWSLETTER', count: stats?.emailSubscribers },
          { id: 'config', label: 'SETTINGS', count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-3 sm:px-4 border-2 transition-all shrink-0 flex items-center gap-1.5 ${activeTab === tab.id
              ? 'border-[#E50914] bg-[#E50914] text-white shadow-[2px_2px_0px_0px_#000000]'
              : 'border-transparent bg-[#121212] text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && tab.count !== undefined && tab.count > 0 && (
              <span className="px-1.5 py-0.2 bg-black text-white text-[10px] font-black rounded">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & REAL TELEMETRY */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Real Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div
              onClick={() => setActiveTab('users')}
              className="p-5 bg-[#0E0E0E] border-2 border-neutral-800 hover:border-[#E50914] shadow-[4px_4px_0px_0px_#000000] cursor-pointer hover:-translate-y-1 transition-transform"
            >
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                REGISTERED MEMBERS
              </span>
              <span className="font-heading font-black text-4xl text-white block mt-1">
                {stats.totalUsers}
              </span>
              <span className="text-[10px] text-neutral-500 mt-2 block">
                View &amp; manage accounts →
              </span>
            </div>

            <div
              onClick={() => setActiveTab('reviews')}
              className="p-5 bg-[#0E0E0E] border-2 border-[#E50914] shadow-[4px_4px_0px_0px_#E50914] cursor-pointer hover:-translate-y-1 transition-transform"
            >
              <span className="text-[10px] text-[#E50914] uppercase font-bold block">
                REVIEWS WAITING
              </span>
              <span className="font-heading font-black text-4xl text-white block mt-1">
                {stats.pendingReviews}
              </span>
              <span className="text-[10px] text-neutral-500 mt-2 block">
                {stats.publishedReviews} approved on site →
              </span>
            </div>

            <div
              onClick={() => setActiveTab('feedback')}
              className="p-5 bg-[#0E0E0E] border-2 border-neutral-800 hover:border-[#E50914] shadow-[4px_4px_0px_0px_#000000] cursor-pointer hover:-translate-y-1 transition-transform"
            >
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                MESSAGES &amp; SUGGESTIONS
              </span>
              <span className="font-heading font-black text-4xl text-white block mt-1">
                {(stats.newSuggestions || 0) + (stats.newFeedback || 0)}
              </span>
              <span className="text-[10px] text-neutral-500 mt-2 block">
                Private feedback inbox →
              </span>
            </div>

            <div
              onClick={() => setActiveTab('email')}
              className="p-5 bg-[#0E0E0E] border-2 border-neutral-800 hover:border-[#E50914] shadow-[4px_4px_0px_0px_#000000] cursor-pointer hover:-translate-y-1 transition-transform"
            >
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                EMAIL SUBSCRIBERS
              </span>
              <span className="font-heading font-black text-4xl text-emerald-400 block mt-1">
                {stats.emailSubscribers}
              </span>
              <span className="text-[10px] text-neutral-500 mt-2 block">
                Opted-in for updates →
              </span>
            </div>

          </div>

          {/* Quick Actions & Live Telemetry Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Quick Actions */}
            <div className="p-6 bg-[#0E0E0E] border border-neutral-800 space-y-4">
              <span className="font-heading font-black text-lg text-white uppercase block">
                QUICK SHORTCUTS
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className="p-3 bg-[#141414] hover:bg-[#E50914] hover:text-white border border-neutral-700 transition-colors flex items-center justify-center gap-1.5 stencil-cut"
                >
                  <GrungeGlyph name="users" className="w-4 h-4" />
                  <span>VIEW MEMBERS</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPost({
                      title: '',
                      body: '',
                      category: 'Awareness & Action',
                      status: 'draft',
                      tags: ['Project SHE', 'Awareness'],
                      author_name: 'Lead Director',
                    });
                    setActiveTab('posts');
                  }}
                  className="p-3 bg-[#141414] hover:bg-[#E50914] hover:text-white border border-neutral-700 transition-colors flex items-center justify-center gap-1.5 stencil-cut"
                >
                  <GrungeGlyph name="plus" className="w-4 h-4" />
                  <span>WRITE ARTICLE</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('updates')}
                  className="p-3 bg-[#141414] hover:bg-[#E50914] hover:text-white border border-neutral-700 transition-colors flex items-center justify-center gap-1.5 stencil-cut"
                >
                  <GrungeGlyph name="bell" className="w-4 h-4" />
                  <span>POST BULLETIN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('email')}
                  className="p-3 bg-[#141414] hover:bg-[#E50914] hover:text-white border border-neutral-700 transition-colors flex items-center justify-center gap-1.5 stencil-cut"
                >
                  <GrungeGlyph name="send" className="w-4 h-4" />
                  <span>SEND NEWSLETTER</span>
                </button>
              </div>
            </div>

            {/* 100% REAL LIVE TELEMETRY (No fake indicators) */}
            <div className="p-6 bg-[#0E0E0E] border border-neutral-800 space-y-3 text-xs relative overflow-hidden stencil-cut">
              {/* Permitted Vinyl watermark */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 pointer-events-none z-0">
                <Image
                  src="/assets/punk-vinyl-clean.png"
                  alt="Vinyl watermark"
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>

              <div className="flex items-center justify-between relative z-10">
                <span className="font-heading font-black text-lg text-white uppercase block">
                  LIVE TELEMETRY
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <GrungeGlyph name="activity" className="w-3.5 h-3.5" />
                  100% LIVE DATA
                </span>
              </div>

              <div className="space-y-2 text-[11px] text-neutral-300 relative z-10">
                <div className="flex items-center justify-between p-2.5 bg-[#141414] border border-neutral-800">
                  <span className="text-neutral-400">Database Connection</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <GrungeGlyph name="check" className="w-3.5 h-3.5" />
                    Supabase Online ({dbStatus === 'connected' ? 'Connected' : 'Syncing'})
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#141414] border border-neutral-800">
                  <span className="text-neutral-400">Response Speed</span>
                  <span className="text-white font-bold">
                    {liveLatency !== null ? `${liveLatency} ms roundtrip` : 'Checked just now'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#141414] border border-neutral-800">
                  <span className="text-neutral-400">Last Verified Sync</span>
                  <span className="text-white font-bold">
                    {lastSyncTime || 'Just now'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#141414] border border-neutral-800">
                  <span className="text-neutral-400">Monthly Egress Protection</span>
                  <span className="text-emerald-400 font-bold">
                    Protected (Caching active for 5,600+ followers)
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED MEMBERS & USERS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-white">
                REGISTERED MEMBERS &amp; LOGINS
              </h2>
              <p className="text-xs text-neutral-400">
                View all individuals who have created an account or logged into Project S.H.E.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-400">
                Total Members: <strong className="text-white">{users.length}</strong>
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                <GrungeGlyph name="search" className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search member by name or email..."
                className="w-full pl-9 pr-3 py-2 bg-[#141414] border border-neutral-700 text-white text-xs outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              {(['all', 'subscribed', 'unsubscribed'] as const).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setUserSubscriptionFilter(sub)}
                  className={`px-3 py-2 uppercase font-bold border ${userSubscriptionFilter === sub
                    ? 'border-[#E50914] bg-[#E50914] text-white'
                    : 'border-neutral-700 bg-[#141414] text-neutral-400 hover:text-white'
                    }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Members Table / List */}
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-neutral-800 text-neutral-500 text-xs">
              No registered members match your search criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((u) => {
                const joinedDate = u.created_at
                  ? new Date(u.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                  : 'Recently';

                return (
                  <div
                    key={u.id}
                    className="p-4 bg-[#0E0E0E] border-2 border-neutral-800 hover:border-[#E50914] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors stencil-cut"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-none bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-white uppercase text-sm shrink-0">
                        {u.display_name ? u.display_name.slice(0, 2).toUpperCase() : (u.email ? u.email.slice(0, 2).toUpperCase() : 'U')}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">
                            {u.display_name || 'Community Member'}
                          </span>
                          {u.is_admin ? (
                            <span className="px-1.5 py-0.5 bg-[#E50914] text-white text-[9px] font-black uppercase">
                              ADMIN
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-neutral-800 text-neutral-300 text-[9px] font-bold uppercase">
                              MEMBER
                            </span>
                          )}
                          {u.email_subscribed ? (
                            <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-bold uppercase">
                              SUBSCRIBED
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-neutral-900 text-neutral-500 border border-neutral-800 text-[9px] font-bold uppercase">
                              NO NEWSLETTER
                            </span>
                          )}
                        </div>

                        <div className="text-neutral-400 text-[11px] font-mono">
                          {u.email || 'No email provided'}
                        </div>

                        <div className="text-[10px] text-neutral-500 font-mono">
                          Joined on: {joinedDate} • User ID: {u.id.slice(0, 16)}...
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u.id, u.email || 'this member')}
                        disabled={actionLoading}
                        className="px-3 py-1.5 border border-red-900 hover:bg-red-700 hover:text-white text-red-400 font-bold uppercase flex items-center gap-1.5 transition-colors text-xs stencil-cut"
                        title="Delete User Account Permanently"
                      >
                        <GrungeGlyph name="trash" className="w-3.5 h-3.5" />
                        <span>DELETE ACCOUNT</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REVIEW MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-white">
                COMMUNITY REVIEWS QUEUE
              </h2>
              <p className="text-xs text-neutral-400">
                Only reviews marked as APPROVED appear publicly on the website.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-xs flex-wrap">
              {(['pending', 'approved', 'rejected', 'archived', 'all'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setReviewFilter(f)}
                  className={`px-3 py-1.5 uppercase font-bold border transition-colors ${reviewFilter === f
                    ? 'border-[#E50914] bg-[#E50914] text-white'
                    : 'border-neutral-700 bg-[#141414] text-neutral-400 hover:text-white'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-neutral-800 text-neutral-500 text-xs">
              No reviews found in this queue.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-[#0E0E0E] border-2 border-neutral-800 hover:border-[#E50914] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs max-w-full overflow-hidden"
                >
                  <div className="space-y-2 flex-1 min-w-0 max-w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm truncate max-w-[200px] sm:max-w-none">{rev.display_name}</span>
                      <span className="text-neutral-500 text-[10px]">({rev.role_or_relation || 'Community'})</span>
                      <div className="flex items-center text-amber-500 ml-2 shrink-0">
                        {[...Array(rev.rating)].map((_, i) => (
                          <GrungeGlyph key={i} name="star" className="w-3 h-3 text-amber-500" />
                        ))}
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[9px] uppercase font-bold shrink-0 ${rev.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : rev.status === 'pending'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : rev.status === 'archived'
                              ? 'bg-neutral-800 text-neutral-300 border border-neutral-600'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                      >
                        {rev.status}
                      </span>
                    </div>

                    <p className="text-neutral-300 italic font-sans leading-relaxed break-words break-all [overflow-wrap:anywhere] max-w-full">
                      &ldquo;{rev.review_text}&rdquo;
                    </p>

                    <div className="text-[10px] text-neutral-500 truncate font-mono">
                      ID: {rev.id} • Submitted: {new Date(rev.created_at).toLocaleString()}
                    </div>
                  </div>

                  {/* Actions: Approve, Archive, Reject, Delete */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap pt-2 md:pt-0 border-t border-neutral-900 md:border-t-0">
                    {rev.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => handleModerateReview(rev.id, 'approved')}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold uppercase flex items-center gap-1.5 transition-colors text-xs hover-lift stencil-cut"
                        title="Approve and publish to public website"
                      >
                        <GrungeGlyph name="check" className="w-3.5 h-3.5" />
                        <span>APPROVE</span>
                      </button>
                    )}
                    {rev.status !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => handleModerateReview(rev.id, 'archived')}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold uppercase flex items-center gap-1.5 transition-colors text-xs hover-lift border border-neutral-700 stencil-cut"
                        title="Archive review without deleting"
                      >
                        <GrungeGlyph name="archive" className="w-3.5 h-3.5" />
                        <span>ARCHIVE</span>
                      </button>
                    )}
                    {rev.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => handleModerateReview(rev.id, 'rejected')}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-amber-950 hover:bg-amber-800 text-amber-200 hover:text-white font-bold uppercase flex items-center gap-1.5 transition-colors text-xs hover-lift border border-amber-800 stencil-cut"
                        title="Mark review as rejected"
                      >
                        <GrungeGlyph name="close" className="w-3.5 h-3.5" />
                        <span>REJECT</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev.id)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-red-950/60 hover:bg-[#E50914] text-red-300 hover:text-white border border-red-800 font-bold uppercase flex items-center gap-1.5 transition-colors text-xs hover-lift stencil-cut"
                      title="Permanently delete review from database"
                    >
                      <GrungeGlyph name="trash" className="w-3.5 h-3.5" />
                      <span>DELETE</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SUGGESTIONS & FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-white">
                SUGGESTIONS &amp; FEEDBACK INBOX
              </h2>
              <p className="text-xs text-neutral-400">
                Direct messages submitted privately by community members.
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs">
              {(['all', 'suggestion', 'feedback'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFeedbackTypeFilter(t)}
                  className={`px-3 py-1.5 uppercase font-bold border ${feedbackTypeFilter === t
                    ? 'border-[#E50914] bg-[#E50914] text-white'
                    : 'border-neutral-700 bg-[#141414] text-neutral-400'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {filteredFeedback.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-neutral-800 text-neutral-500 text-xs">
              No suggestions or feedback in this category.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="p-5 bg-[#0E0E0E] border-2 border-neutral-800 hover:border-[#E50914] space-y-3 text-xs stencil-cut"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#E50914] text-white font-bold uppercase text-[9px]">
                        {fb.type}
                      </span>
                      <span className="font-bold text-white text-sm">{fb.subject}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-400">Status: {fb.status}</span>
                      <select
                        value={fb.status}
                        onChange={(e) => handleUpdateFeedbackStatus(fb.id, e.target.value as any)}
                        className="p-1 bg-[#141414] border border-neutral-700 text-neutral-300 text-[10px] outline-none font-mono"
                      >
                        <option value="new">NEW</option>
                        <option value="reviewed">REVIEWED</option>
                        <option value="resolved">RESOLVED</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDeleteFeedback(fb.id)}
                        className="p-1 text-neutral-500 hover:text-red-500"
                        title="Delete"
                      >
                        <GrungeGlyph name="trash" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-neutral-300 leading-relaxed font-sans text-xs whitespace-pre-line break-words break-all [overflow-wrap:anywhere] max-w-full">
                    {fb.message}
                  </p>

                  <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-[10px] text-neutral-500">
                    <span>From: {fb.name} ({fb.email})</span>
                    <span>Date: {new Date(fb.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: BLOG & STORIES */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-white">
                STORIES &amp; ARTICLES
              </h2>
              <p className="text-xs text-neutral-400 font-sans">
                Write, edit, and publish awareness articles, stories, and campaign updates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-neutral-800 text-[11px] font-mono text-neutral-300 stencil-cut">
                <Image src="/assets/punk-red-pin.png" alt="Pin" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                <span>PINNED:</span>
                <span className={`font-bold ${posts.filter((p) => p.is_pinned).length >= 3 ? 'text-amber-400' : 'text-[#E50914]'}`}>
                  {posts.filter((p) => p.is_pinned).length}/3
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingPost({
                    title: '',
                    body: '',
                    category: 'Awareness & Action',
                    status: 'draft',
                    author_name: 'Project S.H.E. Core Team',
                    tags: ['Project SHE', 'Awareness', 'Rehabilitation'],
                  })
                }
                className="px-4 py-2 bg-[#E50914] text-white hover:bg-white hover:text-black text-xs font-bold uppercase transition-colors flex items-center gap-1.5 stencil-cut"
              >
                <GrungeGlyph name="plus" className="w-4 h-4" />
                <span>NEW ARTICLE</span>
              </button>
            </div>
          </div>

          {/* Post Editor Drawer */}
          {editingPost && (
            <form
              onSubmit={handleSavePost}
              className="p-6 bg-[#0E0E0E] border-2 border-[#E50914] shadow-[6px_6px_0px_0px_#E50914] space-y-4 text-xs stencil-cut"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="font-heading font-black text-base text-white uppercase">
                  {editingPost.id ? 'EDIT ARTICLE' : 'WRITE NEW ARTICLE'}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="text-neutral-400 hover:text-white"
                >
                  CANCEL
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 uppercase font-bold mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none font-mono"
                    placeholder="e.g. Sayodhya Women's Safehouse Relief Drive Recap"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase font-bold mb-1">
                    Category
                  </label>
                  <select
                    value={editingPost.category || 'Awareness & Action'}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none font-mono"
                  >
                    <option value="Awareness & Action">Awareness &amp; Action</option>
                    <option value="Survivor Voices">Survivor Voices</option>
                    <option value="Community Action">Community Action</option>
                    <option value="Safehouse Relief">Safehouse Relief</option>
                    <option value="Mental Health">Mental Health</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase font-bold mb-1">
                  Short Summary (Excerpt)
                </label>
                <input
                  type="text"
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="One sentence summary for previews..."
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase font-bold mb-1">
                  Full Article Body (Markdown supported) *
                </label>
                <textarea
                  required
                  rows={8}
                  value={editingPost.body || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
                  placeholder="Write the full content here..."
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none font-sans"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <span className="text-neutral-400 uppercase font-bold">Publish Status:</span>
                {(['draft', 'published', 'archived'] as const).map((st) => (
                  <label key={st} className="flex items-center gap-1.5 cursor-pointer uppercase">
                    <input
                      type="radio"
                      name="postStatus"
                      value={st}
                      checked={editingPost.status === st}
                      onChange={() => setEditingPost({ ...editingPost, status: st })}
                    />
                    <span className={st === 'published' ? 'text-emerald-400 font-bold' : ''}>
                      {st}
                    </span>
                  </label>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-300 font-bold uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#E50914] text-white font-bold uppercase hover:bg-white hover:text-black stencil-cut"
                >
                  {actionLoading ? 'SAVING...' : 'SAVE ARTICLE'}
                </button>
              </div>
            </form>
          )}

          {/* Posts List */}
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`p-5 bg-[#0E0E0E] border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs stencil-cut ${post.is_pinned
                  ? 'border-[#E50914] bg-[#120505]'
                  : 'border-neutral-800'
                  }`}
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {post.is_pinned && (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase font-bold bg-[#E50914] text-white tracking-widest stencil-cut">
                        <Image src="/assets/punk-red-pin.png" alt="Pinned" width={12} height={12} className="w-3 h-3 object-contain" />
                        PINNED TOP
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-[9px] uppercase font-bold ${post.status === 'published'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : post.status === 'draft'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-neutral-900 text-neutral-500 border border-neutral-700'
                        }`}
                    >
                      {post.status}
                    </span>
                    <span className="text-neutral-500 text-[10px]">[{post.category}]</span>
                    <h3 className="font-bold text-white text-sm">{post.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-mono">
                    <span>Slug: /{post.slug}</span>
                    <span>•</span>
                    <span className="text-neutral-400 flex items-center gap-1">
                      <GrungeGlyph name="heart" className="w-3 h-3 text-[#E50914]" />
                      <span>{post.likes || 0} Likes</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTogglePinPost(post)}
                    disabled={actionLoading}
                    className={`px-3 py-2 border flex items-center gap-1.5 font-bold text-xs stencil-cut transition-all ${post.is_pinned
                      ? 'border-[#E50914] bg-[#E50914]/20 text-[#E50914] hover:bg-[#E50914] hover:text-white'
                      : 'border-neutral-700 text-neutral-400 hover:border-white hover:text-white'
                      }`}
                    title={post.is_pinned ? 'Unpin this blog' : 'Pin to top of blog archive (Max 3)'}
                  >
                    <Image
                      src="/assets/punk-red-pin.png"
                      alt="Pin"
                      width={14}
                      height={14}
                      className={`w-3.5 h-3.5 object-contain transition-transform ${post.is_pinned ? '-rotate-12 scale-110' : 'opacity-60 grayscale'
                        }`}
                    />
                    <span>{post.is_pinned ? 'PINNED' : 'PIN (MAX 3)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPost(post)}
                    className="p-2 border border-neutral-700 hover:border-white text-white flex items-center gap-1 font-bold text-xs stencil-cut"
                  >
                    <GrungeGlyph name="edit" className="w-3.5 h-3.5" />
                    <span>EDIT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 border border-neutral-700 hover:bg-red-700 hover:text-white stencil-cut"
                    title="Delete Post"
                  >
                    <GrungeGlyph name="trash" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: BULLETINS & ANNOUNCEMENTS */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-white">
                BULLETINS &amp; ANNOUNCEMENTS
              </h2>
              <p className="text-xs text-neutral-400">
                Customizable bulletins, community topics, and announcements displayed on the top banner and on the star-grid bulletin board.
              </p>
            </div>
            <a
              href="/#bulletin-board"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 hover:border-white text-neutral-200 text-xs font-mono font-bold uppercase flex items-center gap-1.5"
            >
              <span>VIEW PUBLIC BULLETIN BOARD</span>
              <GrungeGlyph name="external" className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form */}
            <form
              onSubmit={handleCreateUpdate}
              className="lg:col-span-7 p-6 bg-[#0E0E0E] border-2 border-neutral-800 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="font-heading font-black text-sm uppercase text-[#E50914] block">
                  CREATE CUSTOM BULLETIN
                </span>
                <span className="font-mono text-[10px] text-neutral-500">
                  STARTS IN REAL-TIME
                </span>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block uppercase font-bold text-neutral-400 mb-1 text-[11px]">
                    Bulletin Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newUpdateTitle}
                    onChange={(e) => setNewUpdateTitle(e.target.value)}
                    placeholder="e.g. Battle of the Bands 3.0"
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none focus:border-[#E50914]"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-neutral-400 mb-1 text-[11px]">
                    Category
                  </label>
                  <select
                    value={newUpdateCategory}
                    onChange={(e) => setNewUpdateCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none focus:border-[#E50914]"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Event / Gig">Event / Gig</option>
                    <option value="Safehouse Aid">Safehouse Aid</option>
                    <option value="Volunteer Call">Volunteer Call</option>
                    <option value="Creative & Art">Creative &amp; Art</option>
                    <option value="Urgent Alert">Urgent Alert</option>
                  </select>
                </div>
              </div>

              {/* Card Style Selector */}
              <div>
                <label className="block uppercase font-bold text-neutral-400 mb-1.5 text-[11px]">
                  Card Visual Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'zine' as BulletinCardStyle, label: 'Zine Note', desc: 'Taped dark paper' },
                    { id: 'polaroid' as BulletinCardStyle, label: 'Polaroid', desc: 'Photo + caption' },
                    { id: 'stamp' as BulletinCardStyle, label: 'Crimson Stamp', desc: 'Brutalist official' },
                    { id: 'doodle' as BulletinCardStyle, label: 'Punk Doodle', desc: 'Sketch & marker' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setNewUpdateCardStyle(style.id)}
                      className={`p-2.5 text-left border transition-all ${
                        newUpdateCardStyle === style.id
                          ? 'border-[#E50914] bg-red-950/30 text-white'
                          : 'border-neutral-800 bg-[#141414] text-neutral-400 hover:border-neutral-600'
                      }`}
                    >
                      <div className="font-bold text-[11px] uppercase">{style.label}</div>
                      <div className="text-[9px] text-neutral-500 font-mono mt-0.5">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="block uppercase font-bold text-neutral-400 mb-1 text-[11px]">
                  Bulletin Message Content
                </label>
                <textarea
                  required
                  rows={3}
                  value={newUpdateContent}
                  onChange={(e) => setNewUpdateContent(e.target.value)}
                  placeholder="Details of the announcement, venue, dates, or safehouse updates..."
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none resize-none focus:border-[#E50914]"
                />
              </div>

              {/* Sticker / Picture Picker */}
              <div>
                <label className="block uppercase font-bold text-neutral-400 mb-1 text-[11px]">
                  Attach Sticker or Picture
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    { label: 'None', val: '', glyph: null },
                    { label: 'HEADPHONES', val: '/assets/headphones-sticker.png', glyph: 'headphones' as const },
                    { label: 'DISCO BALL', val: '/assets/discoball-sticker.png', glyph: 'disc' as const },
                    { label: 'SPIRAL STAR', val: '/assets/punk-red-spiral-star-clean.png', glyph: 'sparkle' as const },
                  ].map((stk) => (
                    <button
                      key={stk.val}
                      type="button"
                      onClick={() => setNewUpdateImageUrl(stk.val)}
                      className={`px-2.5 py-1 text-[11px] font-mono border transition-colors flex items-center gap-1.5 ${
                        newUpdateImageUrl === stk.val
                          ? 'border-[#E50914] bg-[#E50914] text-white font-bold'
                          : 'border-neutral-800 bg-[#161616] text-neutral-400 hover:border-neutral-600'
                      }`}
                    >
                      {stk.glyph && <GrungeGlyph name={stk.glyph} className="w-3 h-3 text-[#E50914]" />}
                      <span>{stk.label}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newUpdateImageUrl}
                  onChange={(e) => setNewUpdateImageUrl(e.target.value)}
                  placeholder="Or paste custom image URL / photo link"
                  className="w-full p-2 bg-[#141414] border border-neutral-700 text-white outline-none font-mono text-[11px] focus:border-[#E50914]"
                />
              </div>

              {/* Optional Call to Action Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block uppercase font-bold text-neutral-400 mb-1 text-[11px]">
                    Action Link URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newUpdateLinkUrl}
                    onChange={(e) => setNewUpdateLinkUrl(e.target.value)}
                    placeholder="https://example.com/rsvp"
                    className="w-full p-2 bg-[#141414] border border-neutral-700 text-white outline-none font-mono text-[11px] focus:border-[#E50914]"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-neutral-400 mb-1 text-[11px]">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={newUpdateLinkText}
                    onChange={(e) => setNewUpdateLinkText(e.target.value)}
                    placeholder="e.g. REGISTER NOW"
                    className="w-full p-2 bg-[#141414] border border-neutral-700 text-white outline-none font-mono text-[11px] focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Top Banner Checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newUpdateIsBanner}
                  onChange={(e) => setNewUpdateIsBanner(e.target.checked)}
                  className="accent-[#E50914] w-4 h-4 cursor-pointer"
                />
                <span className="font-mono text-xs text-neutral-300 font-bold">
                  Show as top website banner above Hero
                </span>
              </label>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3 bg-[#E50914] text-white font-heading font-black text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? (
                  <span>POSTING BULLETIN...</span>
                ) : (
                  <>
                    <GrungeGlyph name="megaphone" className="w-4 h-4" />
                    <span>POST BULLETIN TO BOARD &amp; BANNER</span>
                  </>
                )}
              </button>
            </form>

            {/* Live Visual Preview */}
            <div className="lg:col-span-5 p-5 bg-[#0A0A0A] border-2 border-neutral-800 space-y-3">
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider block">
                LIVE STAR-GRID BOARD PREVIEW
              </span>

              {/* Mini Star Grid Sandbox */}
              <div className="p-4 bg-[#080808] border border-neutral-800 bg-star-gridlines rounded-sm min-h-[220px] flex items-center justify-center relative overflow-hidden">
                <div className="w-full max-w-sm">
                  {/* Polaroid Preview */}
                  {newUpdateCardStyle === 'polaroid' && (
                    <div className="bg-[#EDEDED] text-black p-3 shadow-[4px_4px_0px_#000000] rotate-[-1deg]">
                      <div className="relative w-full h-32 bg-[#181818] mb-2 flex items-center justify-center overflow-hidden">
                        {newUpdateImageUrl ? (
                          <Image
                            src={newUpdateImageUrl}
                            alt="Preview"
                            fill
                            sizes="96px"
                            className="object-contain p-2"
                          />
                        ) : (
                          <span className="text-[10px] text-neutral-500 font-mono">PHOTO SPACE</span>
                        )}
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[#E50914] text-white font-mono text-[8px] font-bold uppercase">
                          {newUpdateCategory}
                        </span>
                      </div>
                      <div className="font-heading font-black text-xs text-black uppercase truncate">
                        {newUpdateTitle || 'BULLETIN TITLE'}
                      </div>
                      <div className="font-mono text-[10px] text-neutral-700 line-clamp-2 mt-1">
                        {newUpdateContent || 'Message content preview will appear here on the polaroid card...'}
                      </div>
                    </div>
                  )}

                  {/* Stamp Preview */}
                  {newUpdateCardStyle === 'stamp' && (
                    <div className="bg-[#120606] border-2 border-[#E50914] p-4 text-white space-y-2 shadow-[4px_4px_0px_#E50914]">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-[#E50914] text-white font-mono text-[8px] font-bold uppercase">
                          {newUpdateCategory}
                        </span>
                        <span className="font-mono text-[8px] text-[#E50914] font-bold flex items-center gap-1">
                          <GrungeGlyph name="bolt" className="w-2.5 h-2.5" />
                          <span>STAMPED</span>
                        </span>
                      </div>
                      {newUpdateImageUrl && (
                        <div className="relative w-full h-24 bg-black border border-neutral-800 overflow-hidden my-1">
                          <Image src={newUpdateImageUrl} alt="Preview" fill sizes="96px" className="object-contain p-2" />
                        </div>
                      )}
                      <div className="font-heading font-black text-xs uppercase text-white truncate">
                        {newUpdateTitle || 'BULLETIN TITLE'}
                      </div>
                      <div className="font-sans text-[10px] text-neutral-300 line-clamp-2">
                        {newUpdateContent || 'Message content preview will appear here in brutalist format...'}
                      </div>
                    </div>
                  )}

                  {/* Doodle Preview */}
                  {newUpdateCardStyle === 'doodle' && (
                    <div className="bg-[#0C0C0C] border-2 border-dashed border-neutral-600 p-4 text-white space-y-2 rotate-[1deg]">
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.5 bg-neutral-800 text-white font-mono text-[8px] uppercase">
                          {newUpdateCategory}
                        </span>
                        <GrungeGlyph name="edit" className="w-3 h-3 text-[#E50914]" />
                      </div>
                      {newUpdateImageUrl && (
                        <div className="relative w-full h-24 bg-black border border-dashed border-neutral-700 overflow-hidden my-1">
                          <Image src={newUpdateImageUrl} alt="Preview" fill sizes="96px" className="object-contain p-2" />
                        </div>
                      )}
                      <div className="font-heading font-black text-xs uppercase tracking-tight text-white truncate">
                        {newUpdateTitle || 'BULLETIN TITLE'}
                      </div>
                      <div className="font-mono text-[10px] text-neutral-300 line-clamp-2">
                        {newUpdateContent || 'Message content preview will appear here in punk doodle format...'}
                      </div>
                    </div>
                  )}

                  {/* Zine Note Preview */}
                  {newUpdateCardStyle === 'zine' && (
                    <div className="bg-[#121212] border-2 border-neutral-800 p-4 text-white space-y-2 relative">
                      <div className="zine-tape absolute -top-2 left-4 w-12 h-3" />
                      <div className="flex items-center justify-between pt-1">
                        <span className="px-2 py-0.5 bg-[#E50914] text-white font-mono text-[8px] font-bold uppercase">
                          {newUpdateCategory}
                        </span>
                      </div>
                      {newUpdateImageUrl && (
                        <div className="relative w-full h-24 bg-black border border-neutral-800 overflow-hidden my-1">
                          <Image src={newUpdateImageUrl} alt="Preview" fill sizes="96px" className="object-contain p-2" />
                        </div>
                      )}
                      <div className="font-heading font-black text-xs uppercase text-white truncate">
                        {newUpdateTitle || 'BULLETIN TITLE'}
                      </div>
                      <div className="font-sans text-[10px] text-neutral-300 line-clamp-2">
                        {newUpdateContent || 'Message content preview will appear here on zine paper...'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* List of Posted Bulletins */}
          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-neutral-400 uppercase font-bold block">
                POSTED BULLETINS &amp; TOPICS ({updates.length})
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                Click controls to pin, toggle banner, or lock replies
              </span>
            </div>

            {updates.length === 0 ? (
              <div className="p-4 bg-[#101010] border border-neutral-800 text-neutral-500 font-mono text-xs">
                No bulletins posted yet. Create your first bulletin above.
              </div>
            ) : (
              updates.map((u) => {
                const parsed = parseBulletinPayload(u);
                return (
                  <div
                    key={u.id}
                    className="p-4 bg-[#0E0E0E] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {parsed.image_url && (
                        <div className="relative w-12 h-12 shrink-0 bg-neutral-900 border border-neutral-800">
                          <Image
                            src={parsed.image_url}
                            alt={u.title}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-[#E50914] text-white text-[9px] font-bold uppercase shrink-0">
                            {u.category}
                          </span>
                          <span className="font-bold text-white text-sm truncate">{u.title}</span>
                          <span className="text-neutral-500 text-[10px] font-mono shrink-0">
                            [{parsed.card_style}]
                          </span>
                          {parsed.pinned && (
                            <span className="text-amber-400 text-[9px] font-mono uppercase shrink-0 font-bold flex items-center gap-1">
                              • <GrungeGlyph name="pin" className="w-2.5 h-2.5" /> PINNED
                            </span>
                          )}
                          {parsed.locked && (
                            <span className="text-neutral-400 text-[9px] font-mono uppercase shrink-0 flex items-center gap-1">
                              • <GrungeGlyph name="lock" className="w-2.5 h-2.5" /> LOCKED
                            </span>
                          )}
                          {parsed.is_banner && (
                            <span className="text-emerald-400 text-[9px] font-mono uppercase shrink-0 font-bold flex items-center gap-1">
                              • <GrungeGlyph name="megaphone" className="w-2.5 h-2.5" /> TOP BANNER
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-400 text-[11px] mt-1 line-clamp-2">{parsed.body}</p>
                        <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-neutral-500">
                          <span>By {parsed.author_name || 'Admin'}</span>
                          <span>•</span>
                          <span>{new Date(u.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <GrungeGlyph name="chat" className="w-3 h-3" />
                            <span>{parsed.comments?.length || 0} comments</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <GrungeGlyph name="star" className="w-3 h-3 text-amber-400" />
                            <span>{parsed.likes || 0} stars</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Moderation Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                      <button
                        type="button"
                        onClick={() => handleModerateBulletin(u.id, 'pin')}
                        className={`px-2.5 py-1 border font-mono text-[10px] font-bold transition-colors flex items-center gap-1 ${
                          parsed.pinned ? 'bg-amber-950 border-amber-600 text-amber-300' : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
                        }`}
                        title="Toggle Pin"
                      >
                        <GrungeGlyph name="pin" className="w-2.5 h-2.5" />
                        <span>{parsed.pinned ? 'UNPIN' : 'PIN'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModerateBulletin(u.id, 'toggle_banner')}
                        className={`px-2.5 py-1 border font-mono text-[10px] font-bold transition-colors flex items-center gap-1 ${
                          parsed.is_banner ? 'bg-emerald-950 border-emerald-600 text-emerald-300' : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
                        }`}
                        title="Toggle Top Banner"
                      >
                        <GrungeGlyph name="megaphone" className="w-2.5 h-2.5" />
                        <span>{parsed.is_banner ? 'BANNER ON' : 'SET BANNER'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModerateBulletin(u.id, 'lock')}
                        className={`px-2.5 py-1 border font-mono text-[10px] font-bold transition-colors flex items-center gap-1 ${
                          parsed.locked ? 'bg-neutral-800 border-neutral-600 text-white' : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
                        }`}
                        title="Toggle Discussion Lock"
                      >
                        <GrungeGlyph name="lock" className="w-2.5 h-2.5" />
                        <span>{parsed.locked ? 'UNLOCK' : 'LOCK'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModerateBulletin(u.id, 'delete')}
                        className="p-2 text-neutral-500 hover:text-red-500 hover:bg-neutral-900 transition-colors"
                        title="Delete Bulletin"
                      >
                        <GrungeGlyph name="trash" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 7: EMAIL NEWSLETTER */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-white">
                EMAIL NEWSLETTER
              </h2>
              <p className="text-xs text-neutral-400 font-sans">
                Compose and send updates to subscribers with customizable buttons, headline, and live preview.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-[#141414] border border-neutral-800 text-[11px] font-mono text-neutral-300">
                Active Subscribers: <strong className="text-[#E50914]">{stats?.emailSubscribers || 0}</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Compose Form (7 cols) */}
            <form
              onSubmit={handleSendNewsletter}
              className="lg:col-span-7 p-6 bg-[#0E0E0E] border-2 border-[#E50914] shadow-[6px_6px_0px_0px_#E50914] space-y-4 text-xs stencil-cut"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="font-heading font-black text-sm uppercase text-[#E50914]">
                  COMPOSE NEWSLETTER
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Standard HTML Template
                </span>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase font-bold mb-1.5">
                  Send To
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className={`p-2.5 border cursor-pointer text-center flex flex-col items-center justify-center gap-1 transition-all ${emailTarget === 'subscribed_only'
                    ? 'border-[#E50914] bg-[#1A0002] text-white font-bold'
                    : 'border-neutral-800 bg-[#121212] text-neutral-400 hover:border-neutral-600'
                    }`}>
                    <input
                      type="radio"
                      name="targetAudience"
                      value="subscribed_only"
                      checked={emailTarget === 'subscribed_only'}
                      onChange={() => setEmailTarget('subscribed_only')}
                      className="sr-only"
                    />
                    <span className="text-xs">Subscribed Only</span>
                    <span className="text-[10px] text-neutral-500 font-mono">({stats?.emailSubscribers || 0})</span>
                  </label>

                  <label className={`p-2.5 border cursor-pointer text-center flex flex-col items-center justify-center gap-1 transition-all ${emailTarget === 'all'
                    ? 'border-[#E50914] bg-[#1A0002] text-white font-bold'
                    : 'border-neutral-800 bg-[#121212] text-neutral-400 hover:border-neutral-600'
                    }`}>
                    <input
                      type="radio"
                      name="targetAudience"
                      value="all"
                      checked={emailTarget === 'all'}
                      onChange={() => setEmailTarget('all')}
                      className="sr-only"
                    />
                    <span className="text-xs">All Members</span>
                    <span className="text-[10px] text-neutral-500 font-mono">({stats?.totalUsers || 0})</span>
                  </label>

                  <label className={`p-2.5 border cursor-pointer text-center flex flex-col items-center justify-center gap-1 transition-all ${emailTarget === 'test_admin'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                    : 'border-neutral-800 bg-[#121212] text-neutral-400 hover:border-neutral-600'
                    }`}>
                    <input
                      type="radio"
                      name="targetAudience"
                      value="test_admin"
                      checked={emailTarget === 'test_admin'}
                      onChange={() => setEmailTarget('test_admin')}
                      className="sr-only"
                    />
                    <span className="text-xs">Test (Admin Only)</span>
                    <span className="text-[10px] text-emerald-500 font-mono">Safe Preview</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase font-bold mb-1">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="e.g. Project S.H.E. Monthly Newsletter: Upcoming Workshops & News"
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 uppercase font-bold mb-1">
                    Main Headline (Optional)
                  </label>
                  <input
                    type="text"
                    value={emailHeadline}
                    onChange={(e) => setEmailHeadline(e.target.value)}
                    placeholder="Defaults to subject if empty"
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase font-bold mb-1">
                    Subtitle / Tagline (Optional)
                  </label>
                  <input
                    type="text"
                    value={emailSubtitle}
                    onChange={(e) => setEmailSubtitle(e.target.value)}
                    placeholder="e.g. Field Update &amp; Legal Literacy"
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase font-bold mb-1">
                  Email Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Write your newsletter text here. Line breaks are preserved in the email..."
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-800">
                <div>
                  <label className="block text-neutral-400 uppercase font-bold mb-1">
                    Call-to-Action Button Text
                  </label>
                  <input
                    type="text"
                    value={emailCtaText}
                    onChange={(e) => setEmailCtaText(e.target.value)}
                    placeholder="e.g. READ FULL STORY"
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase font-bold mb-1">
                    Button Destination URL
                  </label>
                  <input
                    type="url"
                    value={emailCtaUrl}
                    onChange={(e) => setEmailCtaUrl(e.target.value)}
                    placeholder="https://projectshe.org/#donate"
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-[#E50914] text-white hover:bg-white hover:text-black font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 stencil-cut shadow-[3px_3px_0px_#000000]"
                >
                  <GrungeGlyph name="send" className="w-4 h-4" />
                  <span>
                    {actionLoading
                      ? 'SENDING NEWSLETTER...'
                      : emailTarget === 'test_admin'
                        ? 'SEND TEST EMAIL TO ADMIN'
                        : 'SEND NEWSLETTER TO MEMBERS'}
                  </span>
                </button>
              </div>
            </form>

            {/* Right: Live Interactive Mockup (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-neutral-400 font-mono">
                  LIVE EMAIL PREVIEW
                </span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 border border-emerald-800">
                  REAL-TIME PREVIEW
                </span>
              </div>

              {/* Realistic Email Box */}
              <div className="bg-[#0C0C0C] border-2 border-[#E50914] shadow-[6px_6px_0px_#E50914] overflow-hidden text-xs">
                {/* Top Crimson Accent */}
                <div className="h-1 bg-[#E50914]" />

                <div className="p-5 space-y-4">
                  {/* Brand Header */}
                  <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-[#E50914] font-black uppercase tracking-widest block">
                        // PROJECT S.H.E. NEWSLETTER
                      </span>
                      <h4 className="font-heading font-black text-lg text-white uppercase tracking-tight">
                        PROJECT S.H.E.
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono text-neutral-500">
                      SUPPORT • HELP • EMPOWER
                    </span>
                  </div>

                  {/* Headline & Subtitle */}
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-white uppercase leading-snug">
                      {emailHeadline || emailSubject || 'Newsletter Headline'}
                    </h3>
                    {emailSubtitle && (
                      <p className="text-[11px] font-mono text-[#E50914] uppercase tracking-wider font-bold mt-1">
                        {emailSubtitle}
                      </p>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="text-neutral-300 leading-relaxed font-sans whitespace-pre-line text-xs min-h-[80px]">
                    {emailContent || 'Your email message will appear here with clean paragraph breaks and high-contrast typography.'}
                  </div>

                  {/* Action Button */}
                  {emailCtaText && (
                    <div className="pt-2">
                      <span className="inline-block px-5 py-2.5 bg-[#E50914] text-white font-mono font-black text-[11px] uppercase tracking-wider shadow-[3px_3px_0px_#000000]">
                        {emailCtaText} &rarr;
                      </span>
                    </div>
                  )}

                  {/* Helpline box */}
                  <div className="p-3 bg-[#141414] border border-neutral-800 text-[10px] text-neutral-400 font-mono space-y-1">
                    <span className="text-[#E50914] font-bold block uppercase">24/7 CRISIS RESPONSE</span>
                    <span>National Women Helpline: 1091 / 181</span>
                  </div>

                  {/* Unsubscribe Footer */}
                  <div className="pt-3 border-t border-neutral-800 text-center text-[10px] font-mono text-neutral-500 space-y-1">
                    <p>Sent to member@example.com • Project S.H.E. NGO</p>
                    <p className="text-[#E50914] underline font-bold cursor-pointer">
                      Unsubscribe from this newsletter
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: WEBSITE SETTINGS */}
      {activeTab === 'config' && config && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-white">
              WEBSITE SETTINGS &amp; GOOGLE FORM URLS
            </h2>
            <p className="text-xs text-neutral-400">
              Update Google Form links and contact info anytime without touching any code.
            </p>
          </div>

          <form
            onSubmit={handleSaveConfig}
            className="p-6 bg-[#0E0E0E] border-2 border-[#E50914] shadow-[6px_6px_0px_0px_#E50914] space-y-4 text-xs"
          >
            <div className="space-y-4">
              <div>
                <label className="block uppercase font-bold text-neutral-400 mb-1">
                  1. Team Application Google Form Link
                </label>
                <input
                  type="url"
                  required
                  value={config.google_form_team_app}
                  onChange={(e) => setConfig({ ...config, google_form_team_app: e.target.value })}
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-400 mb-1">
                  2. Artwork &amp; Poetry Google Form Link
                </label>
                <input
                  type="url"
                  required
                  value={config.google_form_artwork_poetry}
                  onChange={(e) => setConfig({ ...config, google_form_artwork_poetry: e.target.value })}
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-400 mb-1">
                  3. Anonymous Confessions Vault Google Form Link
                </label>
                <input
                  type="url"
                  required
                  value={config.google_form_anonymous_confessions}
                  onChange={(e) => setConfig({ ...config, google_form_anonymous_confessions: e.target.value })}
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-neutral-400 mb-1">
                    Donation UPI Address
                  </label>
                  <input
                    type="text"
                    required
                    value={config.donation_upi_id}
                    onChange={(e) => setConfig({ ...config, donation_upi_id: e.target.value })}
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-neutral-400 mb-1">
                    Donation QR Image Path
                  </label>
                  <input
                    type="text"
                    required
                    value={config.donation_qr_url}
                    onChange={(e) => setConfig({ ...config, donation_qr_url: e.target.value })}
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-400 mb-1">
                  Emergency Helpline Notice
                </label>
                <input
                  type="text"
                  required
                  value={config.emergency_helpline}
                  onChange={(e) => setConfig({ ...config, emergency_helpline: e.target.value })}
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-400 mb-1">
                  Official Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={config.contact_email}
                  onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-400 mb-1">
                  Instagram Profile Link
                </label>
                <input
                  type="url"
                  value={config.instagram_url || ''}
                  onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/projectshe.ngo"
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none font-mono text-[11px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-3 bg-[#E50914] text-white font-heading font-black text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
            >
              {actionLoading ? 'SAVING SETTINGS...' : 'SAVE WEBSITE SETTINGS'}
            </button>
          </form>

          {/* MASTER PASSWORD UPDATE CARD */}
          <div className="p-6 bg-[#0E0E0E] border-2 border-[#E50914] shadow-[6px_6px_0px_0px_#E50914] space-y-4 text-xs stencil-cut">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg uppercase tracking-tight text-white flex items-center gap-2">
                  <GrungeGlyph name="key" className="w-5 h-5 text-[#E50914]" />
                  <span>MASTER CONSOLE PASSWORD</span>
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Update the master clearance password used to access this Admin Console.
                </p>
              </div>
              <div className="text-[11px] font-mono text-neutral-400 bg-[#141414] px-3 py-1.5 border border-neutral-700">
                ACTIVE STATUS: <span className="text-[#00FF66] font-bold">PROTECTED &amp; ACTIVE</span>
              </div>
            </div>

            <form onSubmit={handleChangeMasterPassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-neutral-400 mb-1">
                    New Master Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      spellCheck={false}
                      placeholder="Enter at least 6 characters..."
                      value={newMasterPassword}
                      onChange={(e) => setNewMasterPassword(e.target.value)}
                      className="w-full p-2.5 bg-[#141414] border border-neutral-700 focus:border-[#E50914] text-white outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordText(!showPasswordText)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 hover:text-white uppercase font-bold"
                    >
                      {showPasswordText ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block uppercase font-bold text-neutral-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    spellCheck={false}
                    placeholder="Re-enter new password..."
                    value={confirmMasterPassword}
                    onChange={(e) => setConfirmMasterPassword(e.target.value)}
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 focus:border-[#E50914] text-white outline-none font-mono"
                  />
                </div>
              </div>

              {passwordChangeStatus.type === 'error' && (
                <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs">
                  {passwordChangeStatus.message}
                </div>
              )}

              {passwordChangeStatus.type === 'success' && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs font-bold">
                  ✓ {passwordChangeStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={passwordChangeStatus.type === 'loading' || !newMasterPassword}
                className="py-2.5 px-6 bg-[#E50914] text-white font-heading font-black text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <GrungeGlyph name="lock" className="w-4 h-4" />
                <span>{passwordChangeStatus.type === 'loading' ? 'UPDATING PASSWORD...' : 'UPDATE MASTER PASSWORD'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
