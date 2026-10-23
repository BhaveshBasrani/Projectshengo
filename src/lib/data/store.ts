import fs from 'fs';
import path from 'path';
import { getSupabaseServer, isSupabaseConfigured, markSupabaseOffline } from '@/lib/supabase/server';
import {
  PublicReview,
  SuggestionFeedback,
  BlogPost,
  SiteUpdate,
  SiteConfig,
  UserProfile,
  AdminStats,
  BulletinComment,
  parseBulletinPayload,
  SiteSettings,
  GalleryItem,
  VisitorLog,
  TeamAccessLog,
  DEFAULT_SITE_SETTINGS,
} from '@/lib/types';
import { GALLERY_ITEMS } from '@/lib/gallery-data';

import { setDynamicAdminPassword, isAuthorizedAdminEmail } from '@/lib/admin/auth';

export { DEFAULT_SITE_SETTINGS };

export function getDeletedGalleryIds(): Set<string> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'data', 'deleted-gallery.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch {}
  return new Set();
}

export function persistDeletedGalleryId(id: string) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'data', 'deleted-gallery.json');
    const existing = getDeletedGalleryIds();
    existing.add(id);
    fs.writeFileSync(filePath, JSON.stringify(Array.from(existing), null, 2));
  } catch {}
}

export function getPersistentSiteSettings(): Partial<SiteSettings> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'data', 'site-settings.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    }
  } catch {}
  return {};
}

export function persistSiteSettings(settings: SiteSettings) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'data', 'site-settings.json');
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
  } catch {}
}

// Default initial website configuration
export const DEFAULT_CONFIG: SiteConfig = {
  google_form_team_app: 'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheTeamApplication/viewform',
  google_form_artwork_poetry: 'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheArtworkPoetry/viewform',
  google_form_anonymous_confessions: 'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheAnonymousConfessions/viewform',
  donation_qr_url: '/assets/qr-code.svg',
  donation_upi_id: 'shailajalakshmisarao1974-2@okicici',
  contact_email: 'projectshe.ngo@gmail.com',
  emergency_helpline: 'Women Helpline: 1091 | Domestic Abuse: 181 | Direct: +91 98765 43210',
  instagram_url: 'https://instagram.com/projectshe.ngo',
  admin_master_password: 'rendervoid@16',
};

// In-Memory Data Store (Used if Supabase is offline or not configured)
let memoryReviews: PublicReview[] = [];
let memoryPosts: BlogPost[] = [];
let memoryUpdates: SiteUpdate[] = [];
let memoryFeedback: SuggestionFeedback[] = [];
let memoryProfiles: UserProfile[] = [];
let memoryConfig: SiteConfig = { ...DEFAULT_CONFIG };

let memorySiteSettings: SiteSettings = {
  ...DEFAULT_SITE_SETTINGS,
  ...getPersistentSiteSettings(),
};

let memoryGalleryItems: GalleryItem[] = (GALLERY_ITEMS || [])
  .filter((g) => !getDeletedGalleryIds().has(g.id))
  .map((g) => ({
    id: g.id,
    src: g.src,
    title: g.event || 'Battle of the Bands',
    event: g.event || 'Battle of the Bands 2.0',
    aspect: g.aspect,
    category: g.category,
    width: g.width,
    height: g.height,
    created_at: new Date().toISOString(),
  }));

let memoryVisitorLogs: VisitorLog[] = [
  {
    id: 'vis-1',
    visitor_id: 'visitor_8a4f91',
    location: 'Hyderabad, Telangana, IN',
    last_online: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    action: 'Browsing Website',
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: 'vis-2',
    visitor_id: 'visitor_3c29b7',
    location: 'Bengaluru, Karnataka, IN',
    last_online: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    action: 'Viewed Visual Chronicles',
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 'vis-3',
    visitor_id: 'visitor_99df12',
    location: 'Mumbai, Maharashtra, IN',
    last_online: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    action: 'Read Notice Board',
    created_at: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
  },
  {
    id: 'vis-4',
    visitor_id: 'visitor_5e11d0',
    location: 'Delhi, IN',
    last_online: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    action: 'Submitted Community Review',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
];

let memoryTeamAccessLogs: TeamAccessLog[] = [
  {
    id: 'acc-1',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'successful',
    attempted_from: 'Hyderabad, IN',
    reason: 'Verified passkey',
  },
  {
    id: 'acc-2',
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    status: 'unsuccessful',
    attempted_from: 'Secunderabad, IN',
    reason: 'Passkey mismatch',
  },
];

// --- REVIEWS ---

export async function getPublicReviews(sortBy: 'stars' | 'likes' | 'rating' | 'newest' = 'stars'): Promise<PublicReview[]> {
  let list: PublicReview[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved');
      if (!error && data) {
        list = (data as PublicReview[]).filter(
          (r) =>
            !r.review_text.toLowerCase().includes('blind text') &&
            !r.review_text.toLowerCase().includes('lorem ipsum') &&
            !r.review_text.toLowerCase().includes('vokalia') &&
            !r.review_text.toLowerCase().includes('bookmarksgrove')
        );
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to memory store:', e);
      list = memoryReviews.filter((r) => r.status === 'approved');
    }
  } else {
    list = memoryReviews.filter((r) => r.status === 'approved');
  }

  // Pure sorting: highest star rating first, then newest
  return list.sort((a, b) => {
    const starDiff = (b.rating || 5) - (a.rating || 5);
    if (starDiff !== 0) return starDiff;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function getAllReviewsAdmin(): Promise<PublicReview[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return (data as PublicReview[]).filter(
          (r) =>
            !r.review_text.toLowerCase().includes('blind text') &&
            !r.review_text.toLowerCase().includes('lorem ipsum') &&
            !r.review_text.toLowerCase().includes('vokalia')
        );
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to memory store:', e);
    }
  }
  return memoryReviews;
}

export async function submitReview(review: Omit<PublicReview, 'id' | 'status' | 'created_at'>): Promise<PublicReview> {
  const newReview: PublicReview = {
    ...review,
    id: 'rev-' + Math.random().toString(36).substring(2, 9),
    status: 'pending', // Strictly pending by default
    likes: 0,
    created_at: new Date().toISOString(),
  };

  memoryReviews.unshift(newReview);

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      await supabase.from('reviews').insert(newReview);
    } catch (e) {
      console.warn('Supabase insert failed, stored in memory:', e);
    }
  }

  return newReview;
}

export async function updateReviewStatus(id: string, status: 'approved' | 'rejected' | 'pending' | 'archived'): Promise<boolean> {
  const item = memoryReviews.find((r) => r.id === id);
  if (item) {
    item.status = status;
    item.reviewed_at = new Date().toISOString();
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      await supabase
        .from('reviews')
        .update({ status, reviewed_at: new Date().toISOString() })
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase update failed:', e);
    }
  }

  return Boolean(item);
}

export async function likeReview(id: string): Promise<{ success: boolean; likes: number }> {
  let newLikes = 1;
  const item = memoryReviews.find((r) => r.id === id);
  if (item) {
    item.likes = (item.likes || 0) + 1;
    newLikes = item.likes;
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data } = await supabase.from('reviews').select('likes').eq('id', id).single();
      const currentLikes = (data?.likes || 0) + 1;
      await supabase.from('reviews').update({ likes: currentLikes }).eq('id', id);
      newLikes = currentLikes;
    } catch (e) {
      console.warn('Supabase likeReview failed:', e);
    }
  }

  return { success: true, likes: newLikes };
}

export async function deleteReview(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase.from('reviews').delete().eq('id', id).select();
      if (!error && data && data.length > 0) return true;
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  const initialLen = memoryReviews.length;
  memoryReviews = memoryReviews.filter((r) => r.id !== id);
  return memoryReviews.length < initialLen;
}

// --- SUGGESTIONS & FEEDBACK ---

export async function submitSuggestionFeedback(item: Omit<SuggestionFeedback, 'id' | 'status' | 'created_at'>): Promise<SuggestionFeedback> {
  const newFeedback: SuggestionFeedback = {
    ...item,
    id: 'fb-' + Math.random().toString(36).substring(2, 9),
    status: 'new',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase.from('suggestions_feedback').insert(newFeedback).select().single();
      if (!error && data) return data as SuggestionFeedback;
    } catch (e) {
      console.warn('Supabase insert failed, storing in memory:', e);
    }
  }

  memoryFeedback.unshift(newFeedback);
  return newFeedback;
}

export async function getAllFeedbackAdmin(): Promise<SuggestionFeedback[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('suggestions_feedback')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as SuggestionFeedback[];
    } catch (e) {
      console.warn('Supabase fetch failed:', e);
    }
  }
  return memoryFeedback;
}

export async function updateFeedbackStatus(id: string, status: 'new' | 'reviewed' | 'resolved'): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { error } = await supabase.from('suggestions_feedback').update({ status }).eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase update failed:', e);
    }
  }

  const item = memoryFeedback.find((f) => f.id === id);
  if (item) {
    item.status = status;
    return true;
  }
  return false;
}

export async function deleteFeedback(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { error } = await supabase.from('suggestions_feedback').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  const len = memoryFeedback.length;
  memoryFeedback = memoryFeedback.filter((f) => f.id !== id);
  return memoryFeedback.length < len;
}

// --- BLOG / CASE POSTS ---

export async function getPublishedPosts(): Promise<BlogPost[]> {
  let list: BlogPost[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published');
      if (!error && data) {
        list = data as BlogPost[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to memory store:', e);
      list = memoryPosts.filter((p) => p.status === 'published');
    }
  } else {
    list = memoryPosts.filter((p) => p.status === 'published');
  }

  // Pinned posts always appear at the top (max 3), followed by newest published
  return list.sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) return data as BlogPost;
    } catch (e) {
      console.warn('Supabase fetch failed:', e);
    }
  }
  return memoryPosts.find((p) => p.slug === slug) || null;
}

export async function getAllPostsAdmin(): Promise<BlogPost[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as BlogPost[];
    } catch (e) {
      console.warn('Supabase fetch failed:', e);
    }
  }
  return memoryPosts;
}

export async function savePost(post: Partial<BlogPost> & { title: string; body: string }): Promise<BlogPost> {
  const isNew = !post.id;
  const slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const postData: BlogPost = {
    id: post.id || 'post-' + Math.random().toString(36).substring(2, 9),
    title: post.title,
    slug,
    cover_image_url: post.cover_image_url || '/assets/logo.png',
    excerpt: post.excerpt || post.body.substring(0, 160) + '...',
    body: post.body,
    category: post.category || 'General',
    tags: post.tags || ['Project SHE'],
    author_name: post.author_name || 'Project S.H.E.',
    status: post.status || 'draft',
    published_at: post.status === 'published' ? (post.published_at || new Date().toISOString()) : null,
    created_at: post.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      if (isNew) {
        const { data, error } = await supabase.from('posts').insert(postData).select().single();
        if (!error && data) return data as BlogPost;
      } else {
        const { data, error } = await supabase.from('posts').update(postData).eq('id', post.id).select().single();
        if (!error && data) return data as BlogPost;
      }
    } catch (e) {
      console.warn('Supabase savePost failed:', e);
    }
  }

  if (isNew) {
    memoryPosts.unshift(postData);
  } else {
    const idx = memoryPosts.findIndex((p) => p.id === post.id);
    if (idx !== -1) memoryPosts[idx] = postData;
    else memoryPosts.unshift(postData);
  }
  return postData;
}

export async function deletePost(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  const len = memoryPosts.length;
  memoryPosts = memoryPosts.filter((p) => p.id !== id);
  return memoryPosts.length < len;
}

export async function likeBlogPost(id: string): Promise<{ success: boolean; likes: number }> {
  let newLikes = 1;
  const item = memoryPosts.find((p) => p.id === id);
  if (item) {
    item.likes = (item.likes || 0) + 1;
    newLikes = item.likes;
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data } = await supabase.from('posts').select('likes').eq('id', id).single();
      const currentLikes = (data?.likes || 0) + 1;
      await supabase.from('posts').update({ likes: currentLikes }).eq('id', id);
      newLikes = currentLikes;
    } catch (e) {
      console.warn('Supabase likeBlogPost failed:', e);
    }
  }

  return { success: true, likes: newLikes };
}

export async function togglePinBlogPost(id: string, is_pinned: boolean): Promise<{ success: boolean; error?: string }> {
  const allPosts = await getAllPostsAdmin();
  if (is_pinned) {
    const currentlyPinned = allPosts.filter((p) => p.is_pinned && p.id !== id);
    if (currentlyPinned.length >= 3) {
      return { success: false, error: 'Maximum 3 blogs can be pinned simultaneously. Please unpin an existing blog first.' };
    }
  }

  const post = memoryPosts.find((p) => p.id === id);
  if (post) {
    post.is_pinned = is_pinned;
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      await supabase.from('posts').update({ is_pinned }).eq('id', id);
    } catch (e) {
      console.warn('Supabase togglePinBlogPost failed:', e);
    }
  }

  return { success: true };
}

// --- UPDATES ---

export async function getPublishedUpdates(): Promise<SiteUpdate[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(15);
      if (!error && data) return data as SiteUpdate[];
    } catch (e) {
      console.warn('Supabase updates fetch failed:', e);
    }
  }
  return memoryUpdates.filter((u) => u.status === 'published');
}

export async function getAllUpdatesAdmin(): Promise<SiteUpdate[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase.from('updates').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as SiteUpdate[];
    } catch (e) {
      console.warn('Supabase updates fetch failed:', e);
    }
  }
  return memoryUpdates;
}

export async function saveUpdate(item: Partial<SiteUpdate> & { title: string; content: string }): Promise<SiteUpdate> {
  let contentString = item.content;

  // If rich properties are provided and content is not already JSON, package them cleanly
  if (item.image_url || item.card_style || item.is_banner !== undefined || item.link_url || item.doodle_icon) {
    if (!item.content.trim().startsWith('{')) {
      contentString = JSON.stringify({
        body: item.content,
        image_url: item.image_url,
        card_style: item.card_style || 'zine',
        is_banner: item.is_banner ?? true,
        link_url: item.link_url,
        link_text: item.link_text,
        doodle_icon: item.doodle_icon || 'star',
      });
    }
  }

  const updateData: SiteUpdate = {
    id: item.id || 'up-' + Math.random().toString(36).substring(2, 9),
    title: item.title,
    content: contentString,
    category: item.category || 'General',
    status: item.status || 'published',
    created_at: item.created_at || new Date().toISOString(),
    image_url: item.image_url,
    card_style: item.card_style,
    is_banner: item.is_banner,
    link_url: item.link_url,
    link_text: item.link_text,
    doodle_icon: item.doodle_icon,
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      // Only insert core columns supported by the Supabase table schema
      const dbPayload = {
        id: updateData.id,
        title: updateData.title,
        content: updateData.content,
        category: updateData.category,
        status: updateData.status,
        created_at: updateData.created_at,
      };

      if (!item.id) {
        const { data, error } = await supabase.from('updates').insert(dbPayload).select().single();
        if (!error && data) return { ...data, ...updateData } as SiteUpdate;
      } else {
        const { data, error } = await supabase.from('updates').update(dbPayload).eq('id', item.id).select().single();
        if (!error && data) return { ...data, ...updateData } as SiteUpdate;
      }
    } catch (e) {
      console.warn('Supabase saveUpdate failed:', e);
    }
  }

  const idx = memoryUpdates.findIndex((u) => u.id === item.id);
  if (idx !== -1) memoryUpdates[idx] = updateData;
  else memoryUpdates.unshift(updateData);
  return updateData;
}

export async function deleteUpdate(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { error } = await supabase.from('updates').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  const len = memoryUpdates.length;
  memoryUpdates = memoryUpdates.filter((u) => u.id !== id);
  return memoryUpdates.length < len;
}

// --- BULLETIN BOARD INTERACTIVITY & MODERATION ---

export async function addBulletinComment(
  updateId: string,
  comment: {
    author_id: string;
    author_name: string;
    author_avatar?: string | null;
    content: string;
    parent_id?: string | null;
    reply_to_name?: string | null;
  }
): Promise<{ success: boolean; update?: SiteUpdate; comment?: BulletinComment }> {
  const updates = await getAllUpdatesAdmin();
  const target = updates.find((u) => u.id === updateId);
  if (!target) return { success: false };

  const parsed = parseBulletinPayload(target);
  if (parsed.locked) {
    return { success: false };
  }

  const newComment: BulletinComment = {
    id: 'cm-' + Math.random().toString(36).substring(2, 9),
    author_id: comment.author_id,
    author_name: comment.author_name || 'Community Member',
    author_avatar: comment.author_avatar || null,
    content: comment.content.trim(),
    created_at: new Date().toISOString(),
    parent_id: comment.parent_id || null,
    reply_to_name: comment.reply_to_name || null,
    likes: 0,
    liked_by: [],
  };

  const updatedComments = [...(parsed.comments || []), newComment];
  const updatedPayload = {
    ...parsed,
    comments: updatedComments,
  };

  const saved = await saveUpdate({
    ...target,
    content: JSON.stringify(updatedPayload),
  });

  return { success: true, update: saved, comment: newComment };
}

export async function deleteBulletinComment(
  updateId: string,
  commentId: string
): Promise<{ success: boolean; update?: SiteUpdate }> {
  const updates = await getAllUpdatesAdmin();
  const target = updates.find((u) => u.id === updateId);
  if (!target) return { success: false };

  const parsed = parseBulletinPayload(target);
  const updatedComments = (parsed.comments || []).filter((c) => c.id !== commentId && c.parent_id !== commentId);
  const updatedPayload = {
    ...parsed,
    comments: updatedComments,
  };

  const saved = await saveUpdate({
    ...target,
    content: JSON.stringify(updatedPayload),
  });

  return { success: true, update: saved };
}

export async function toggleBulletinLike(
  updateId: string,
  userId: string
): Promise<{ success: boolean; likes: number; liked: boolean }> {
  const updates = await getAllUpdatesAdmin();
  const target = updates.find((u) => u.id === updateId);
  if (!target) return { success: false, likes: 0, liked: false };

  const parsed = parseBulletinPayload(target);
  const likedBy = parsed.liked_by || [];
  const hasLiked = likedBy.includes(userId);
  const nextLikedBy = hasLiked ? likedBy.filter((id) => id !== userId) : [...likedBy, userId];

  const updatedPayload = {
    ...parsed,
    liked_by: nextLikedBy,
    likes: nextLikedBy.length,
  };

  await saveUpdate({
    ...target,
    content: JSON.stringify(updatedPayload),
  });

  return { success: true, likes: nextLikedBy.length, liked: !hasLiked };
}

export async function toggleBulletinCommentLike(
  updateId: string,
  commentId: string,
  userId: string
): Promise<{ success: boolean; likes: number; liked: boolean }> {
  const updates = await getAllUpdatesAdmin();
  const target = updates.find((u) => u.id === updateId);
  if (!target) return { success: false, likes: 0, liked: false };

  const parsed = parseBulletinPayload(target);
  let commentLiked = false;
  let commentLikes = 0;

  const nextComments = (parsed.comments || []).map((c) => {
    if (c.id === commentId) {
      const curLikedBy = c.liked_by || [];
      const isAlready = curLikedBy.includes(userId);
      const nextBy = isAlready ? curLikedBy.filter((id) => id !== userId) : [...curLikedBy, userId];
      commentLiked = !isAlready;
      commentLikes = nextBy.length;
      return { ...c, liked_by: nextBy, likes: nextBy.length };
    }
    return c;
  });

  await saveUpdate({
    ...target,
    content: JSON.stringify({ ...parsed, comments: nextComments }),
  });

  return { success: true, likes: commentLikes, liked: commentLiked };
}

export async function toggleBulletinPin(updateId: string): Promise<{ success: boolean; pinned: boolean }> {
  const updates = await getAllUpdatesAdmin();
  const target = updates.find((u) => u.id === updateId);
  if (!target) return { success: false, pinned: false };
  const parsed = parseBulletinPayload(target);
  const nextPinned = !parsed.pinned;
  await saveUpdate({
    ...target,
    content: JSON.stringify({ ...parsed, pinned: nextPinned }),
  });
  return { success: true, pinned: nextPinned };
}

export async function toggleBulletinLock(updateId: string): Promise<{ success: boolean; locked: boolean }> {
  const updates = await getAllUpdatesAdmin();
  const target = updates.find((u) => u.id === updateId);
  if (!target) return { success: false, locked: false };
  const parsed = parseBulletinPayload(target);
  const nextLocked = !parsed.locked;
  await saveUpdate({
    ...target,
    content: JSON.stringify({ ...parsed, locked: nextLocked }),
  });
  return { success: true, locked: nextLocked };
}

export async function toggleBulletinBanner(updateId: string): Promise<{ success: boolean; is_banner: boolean }> {
  const updates = await getAllUpdatesAdmin();
  const target = updates.find((u) => u.id === updateId);
  if (!target) return { success: false, is_banner: false };
  const parsed = parseBulletinPayload(target);
  const nextBanner = !parsed.is_banner;
  await saveUpdate({
    ...target,
    is_banner: nextBanner,
    content: JSON.stringify({ ...parsed, is_banner: nextBanner }),
  });
  return { success: true, is_banner: nextBanner };
}

// --- SITE CONFIG ---

export async function getSiteConfig(): Promise<SiteConfig> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase.from('site_config').select('*');
      if (!error && data && data.length > 0) {
        const cfg = { ...DEFAULT_CONFIG };
        data.forEach((row: { key: string; value: string }) => {
          if (row.key in cfg) {
            (cfg as any)[row.key] = row.value;
          }
        });
        if (cfg.admin_master_password) {
          setDynamicAdminPassword(cfg.admin_master_password);
        }
        return cfg;
      }
    } catch (e) {
      console.warn('Supabase config fetch failed:', e);
    }
  }
  if (memoryConfig.admin_master_password) {
    setDynamicAdminPassword(memoryConfig.admin_master_password);
  }
  return memoryConfig;
}

export async function updateSiteConfig(newConfig: Partial<SiteConfig>): Promise<SiteConfig> {
  memoryConfig = { ...memoryConfig, ...newConfig };

  if (newConfig.admin_master_password) {
    setDynamicAdminPassword(newConfig.admin_master_password);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const entries = Object.entries(newConfig).map(([key, value]) => ({ key, value }));
      await supabase.from('site_config').upsert(entries, { onConflict: 'key' });
    } catch (e) {
      console.warn('Supabase config update failed:', e);
    }
  }

  return memoryConfig;
}

// Bootstrap dynamic admin password on server initialization
if (typeof window === 'undefined') {
  getSiteConfig().catch(() => {});
}

// --- USER PROFILES & AUTH SYNC ---

export async function syncUserProfile(profile: { id: string; email: string; display_name: string; avatar_url?: string | null }): Promise<UserProfile> {
  const cleanEmail = profile.email.trim().toLowerCase();

  // If this account was previously flagged in deleted_accounts, unblock it on active authenticated login
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      await supabase
        .from('deleted_accounts')
        .delete()
        .or(`id.eq.${profile.id},email.eq.${cleanEmail}`);
    } catch (e) {
      // Non-critical cleanup
    }
  }

  const existing = memoryProfiles.find((p) => p.id === profile.id);
  const updated: UserProfile = {
    id: profile.id,
    email: profile.email,
    display_name: profile.display_name || profile.email.split('@')[0],
    avatar_url: profile.avatar_url || existing?.avatar_url || null,
    is_admin: isAuthorizedAdminEmail(cleanEmail) || Boolean(existing?.is_admin),
    email_subscribed: existing ? existing.email_subscribed : true,
    created_at: existing ? existing.created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('profiles')
        .upsert(updated, { onConflict: 'id' })
        .select()
        .single();
      if (!error && data) return data as UserProfile;
    } catch (e) {
      console.warn('Supabase syncUserProfile failed:', e);
    }
  }

  const idx = memoryProfiles.findIndex((p) => p.id === profile.id);
  if (idx !== -1) memoryProfiles[idx] = updated;
  else memoryProfiles.push(updated);
  return updated;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) return data as UserProfile;
    } catch (e) {
      console.warn('Supabase getUserProfile failed:', e);
    }
  }
  return memoryProfiles.find((p) => p.id === userId) || null;
}

export async function updateUserSubscription(userId: string, subscribed: boolean): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { error } = await supabase.from('profiles').update({ email_subscribed: subscribed }).eq('id', userId);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase updateUserSubscription failed:', e);
    }
  }

  const user = memoryProfiles.find((p) => p.id === userId);
  if (user) {
    user.email_subscribed = subscribed;
    return true;
  }
  return false;
}

export async function getAllUsersAdmin(): Promise<UserProfile[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, display_name, avatar_url, is_admin, email_subscribed, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(100);
      if (!error && data) return data as UserProfile[];
    } catch (e) {
      console.warn('Supabase getAllUsersAdmin failed:', e);
    }
  }
  return memoryProfiles;
}

export async function deleteUserAdmin(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (!error) {
        memoryProfiles = memoryProfiles.filter((p) => p.id !== id);
        return true;
      }
    } catch (e) {
      console.warn('Supabase deleteUserAdmin failed:', e);
    }
  }

  const len = memoryProfiles.length;
  memoryProfiles = memoryProfiles.filter((p) => p.id !== id);
  return memoryProfiles.length < len;
}

// --- ADMIN STATS ---

export async function getAdminStats(): Promise<AdminStats> {
  const users = await getAllUsersAdmin();
  const reviews = await getAllReviewsAdmin();
  const feedback = await getAllFeedbackAdmin();
  const posts = await getAllPostsAdmin();

  return {
    totalUsers: users.length,
    pendingReviews: reviews.filter((r) => r.status === 'pending').length,
    publishedReviews: reviews.filter((r) => r.status === 'approved').length,
    newSuggestions: feedback.filter((f) => f.type === 'suggestion' && f.status === 'new').length,
    newFeedback: feedback.filter((f) => f.type === 'feedback' && f.status === 'new').length,
    draftPosts: posts.filter((p) => p.status === 'draft').length,
    publishedPosts: posts.filter((p) => p.status === 'published').length,
    emailSubscribers: users.filter((u) => u.email_subscribed).length,
  };
}

export async function subscribeNewsletter(email: string, source = 'homepage_modal'): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Invalid email address' };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert({ email: cleanEmail, source, is_active: true }, { onConflict: 'email' });
      
      if (!error) {
        return { success: true, message: 'Subscribed successfully' };
      }
    } catch (e) {
      console.warn('Supabase subscribeNewsletter failed, falling back:', e);
    }
  }

  return { success: true, message: 'Subscribed successfully' };
}

export async function getAllNewsletterSubscribers(): Promise<string[]> {
  const emails: Set<string> = new Set();

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('is_active', true);
      if (data) {
        data.forEach((r: any) => {
          if (r.email) emails.add(r.email.trim().toLowerCase());
        });
      }
    } catch (e) {
      console.warn('Supabase fetch newsletter subscribers warning:', e);
    }
  }

  // Also include registered users who opted into emails
  const users = await getAllUsersAdmin();
  users.forEach((u) => {
    if (u.email && u.email_subscribed) {
      emails.add(u.email.trim().toLowerCase());
    }
  });

  return Array.from(emails);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const diskSettings = getPersistentSiteSettings();
  let base: SiteSettings = {
    ...DEFAULT_SITE_SETTINGS,
    ...diskSettings,
    ...memorySiteSettings,
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();
      if (!error && data) {
        base = {
          ...DEFAULT_SITE_SETTINGS,
          ...diskSettings,
          ...memorySiteSettings,
          ...data,
          updated_at: data.updated_at || new Date().toISOString(),
        };
        memorySiteSettings = base;
        persistSiteSettings(base);
        return base;
      }
      if (error) {
        const errStr = String(error.message || '') + ' ' + String((error as any).details || '');
        if (errStr.includes('ENOTFOUND') || errStr.includes('fetch failed')) {
          markSupabaseOffline(120000);
        }
      }
    } catch (e: any) {
      const errStr = String(e?.message || e);
      if (errStr.includes('ENOTFOUND') || errStr.includes('fetch failed')) {
        markSupabaseOffline(120000);
      }
      console.warn('Supabase getSiteSettings fallback:', e);
    }
  }
  return base;
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const diskSettings = getPersistentSiteSettings();
  const cleanUpdates: Partial<SiteSettings> = {};
  for (const [key, val] of Object.entries(updates)) {
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      (cleanUpdates as any)[key] = val;
    }
  }

  memorySiteSettings = {
    ...DEFAULT_SITE_SETTINGS,
    ...diskSettings,
    ...memorySiteSettings,
    ...cleanUpdates,
    updated_at: new Date().toISOString(),
  };

  persistSiteSettings(memorySiteSettings);

  // Sync with general site config if form or contact values changed
  const configUpdates: Partial<SiteConfig> = {};
  if (cleanUpdates.google_form_team_app) configUpdates.google_form_team_app = cleanUpdates.google_form_team_app;
  if (cleanUpdates.google_form_artwork_poetry) configUpdates.google_form_artwork_poetry = cleanUpdates.google_form_artwork_poetry;
  if (cleanUpdates.google_form_anonymous_confessions) configUpdates.google_form_anonymous_confessions = cleanUpdates.google_form_anonymous_confessions;
  if (cleanUpdates.emergency_helpline) configUpdates.emergency_helpline = cleanUpdates.emergency_helpline;
  if (cleanUpdates.donation_upi_id) configUpdates.donation_upi_id = cleanUpdates.donation_upi_id;
  if (cleanUpdates.contact_email) configUpdates.contact_email = cleanUpdates.contact_email;
  if (cleanUpdates.instagram_url) configUpdates.instagram_url = cleanUpdates.instagram_url;
  if (cleanUpdates.donation_qr_url) configUpdates.donation_qr_url = cleanUpdates.donation_qr_url;
  if (Object.keys(configUpdates).length > 0) {
    updateSiteConfig(configUpdates).catch(() => {});
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            id: 'default_config',
            ...memorySiteSettings,
          },
          { onConflict: 'id' }
        );
      if (error) {
        const errStr = String(error.message || '') + ' ' + String((error as any).details || '');
        if (errStr.includes('ENOTFOUND') || errStr.includes('fetch failed')) {
          markSupabaseOffline(120000);
        }
        console.warn('Supabase updateSiteSettings warning:', error);
      }
    } catch (e: any) {
      const errStr = String(e?.message || e);
      if (errStr.includes('ENOTFOUND') || errStr.includes('fetch failed')) {
        markSupabaseOffline(120000);
      }
      console.warn('Supabase updateSiteSettings fallback:', e);
    }
  }

  return memorySiteSettings;
}

// --- CMS: VISUAL CHRONICLES (GALLERY MANAGER) ---

export async function getGalleryItemsList(): Promise<GalleryItem[]> {
  const deleted = getDeletedGalleryIds();
  let items = memoryGalleryItems.filter((item) => !deleted.has(item.id));

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        items = (data as GalleryItem[]).filter((item) => !deleted.has(item.id));
      }
    } catch (e) {
      console.warn('Supabase getGalleryItemsList fallback:', e);
    }
  }
  return items;
}

export async function addGalleryItemToStore(item: {
  src: string;
  title?: string;
  category?: string;
  aspect?: number;
}): Promise<GalleryItem> {
  const newItem: GalleryItem = {
    id: 'gallery-' + Math.random().toString(36).substring(2, 9),
    src: item.src,
    title: item.title || 'Event Photograph',
    category: item.category || 'BOTB 2.0',
    aspect: item.aspect || 1.0,
    created_at: new Date().toISOString(),
  };

  memoryGalleryItems = [newItem, ...memoryGalleryItems];

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      await supabase.from('gallery_images').insert(newItem);
    } catch (e) {
      console.warn('Supabase addGalleryItem fallback:', e);
    }
  }

  return newItem;
}

export async function deleteGalleryItemFromStore(id: string): Promise<boolean> {
  persistDeletedGalleryId(id);
  memoryGalleryItems = memoryGalleryItems.filter((item) => item.id !== id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      await supabase.from('gallery_images').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteGalleryItem fallback:', e);
    }
  }

  return true;
}

// --- CMS: VISITOR INSIGHTS (TRAFFIC & ACCESS) ---

export async function getVisitorLogsList(): Promise<VisitorLog[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('visitor_logs')
        .select('*')
        .order('last_online', { ascending: false })
        .limit(50);
      if (!error && data && data.length > 0) {
        return data as VisitorLog[];
      }
    } catch (e) {
      console.warn('Supabase getVisitorLogsList fallback:', e);
    }
  }
  return memoryVisitorLogs;
}

export async function recordVisitorAction(
  action: string,
  location?: string,
  visitor_id?: string
): Promise<VisitorLog> {
  const newLog: VisitorLog = {
    id: 'vis-' + Math.random().toString(36).substring(2, 9),
    visitor_id: visitor_id || 'visitor_' + Math.random().toString(36).substring(2, 8),
    location: location || 'Hyderabad, IN',
    last_online: new Date().toISOString(),
    action: action || 'Browsing Website',
    created_at: new Date().toISOString(),
  };

  memoryVisitorLogs = [newLog, ...memoryVisitorLogs.slice(0, 99)];

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      await supabase.from('visitor_logs').insert(newLog);
    } catch (e) {
      console.warn('Supabase recordVisitorAction fallback:', e);
    }
  }

  return newLog;
}

// --- CMS: TEAM ACCESS LOGS ---

export async function getTeamAccessLogsList(): Promise<TeamAccessLog[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('team_access_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      if (!error && data && data.length > 0) {
        return data as TeamAccessLog[];
      }
    } catch (e) {
      console.warn('Supabase getTeamAccessLogsList fallback:', e);
    }
  }
  return memoryTeamAccessLogs;
}

export async function recordTeamAccessAttempt(
  status: 'successful' | 'unsuccessful',
  attempted_from?: string,
  reason?: string
): Promise<TeamAccessLog> {
  const newAttempt: TeamAccessLog = {
    id: 'acc-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    status,
    attempted_from: attempted_from || 'Hyderabad, IN',
    reason: reason || (status === 'successful' ? 'Verified passkey' : 'Passkey mismatch'),
  };

  memoryTeamAccessLogs = [newAttempt, ...memoryTeamAccessLogs.slice(0, 99)];

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      await supabase.from('team_access_logs').insert(newAttempt);
    } catch (e) {
      console.warn('Supabase recordTeamAccessAttempt fallback:', e);
    }
  }

  return newAttempt;
}

export async function clearVisitorLogs(): Promise<void> {
  memoryVisitorLogs = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      await supabase.from('visitor_logs').delete().neq('id', '');
    } catch (e) {
      console.warn('Supabase clearVisitorLogs fallback:', e);
    }
  }
}

export async function clearTeamAccessLogs(): Promise<void> {
  memoryTeamAccessLogs = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      await supabase.from('team_access_logs').delete().neq('id', '');
    } catch (e) {
      console.warn('Supabase clearTeamAccessLogs fallback:', e);
    }
  }
}







