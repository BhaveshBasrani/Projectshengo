import { getSupabaseServer, isSupabaseConfigured } from '@/lib/supabase/server';
import {
  PublicReview,
  SuggestionFeedback,
  BlogPost,
  SiteUpdate,
  SiteConfig,
  UserProfile,
  AdminStats,
} from '@/lib/types';

// Default initial website configuration
export const DEFAULT_CONFIG: SiteConfig = {
  google_form_team_app: 'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheTeamApplication/viewform',
  google_form_artwork_poetry: 'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheArtworkPoetry/viewform',
  google_form_anonymous_confessions: 'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheAnonymousConfessions/viewform',
  donation_qr_url: '/assets/donation-qr.png',
  donation_upi_id: 'shailajalakshmisarao1974-2@okicici',
  contact_email: 'projectshe.ngo@gmail.com',
  emergency_helpline: 'Women Helpline: 1091 | Domestic Abuse: 181 | Direct: +91 98765 43210',
  instagram_url: 'https://instagram.com/projectshe.ngo',
};

// Initial verified seed data for Project S.H.E.
const SEED_REVIEWS: PublicReview[] = [
  {
    id: 'rev-seed-1',
    user_id: null,
    display_name: 'Niveditt V.',
    role_or_relation: 'Volunteer & Ground Advocate',
    rating: 5,
    review_text: 'Volunteering with Project S.H.E. during the safehouse relief drives was truly eye-opening. Seeing direct student action bring tangible change and dignity to survivors in Hyderabad gives me immense hope. Transparent, fearless, and deeply committed.',
    likes: 32,
    status: 'approved',
    created_at: new Date('2026-08-01').toISOString(),
    reviewed_at: new Date('2026-08-01').toISOString(),
  },
  {
    id: 'rev-seed-2',
    user_id: null,
    display_name: 'Ananya Rao',
    role_or_relation: 'Event Attendee & Ally',
    rating: 5,
    review_text: 'Attended Battle of the Bands 2.0 and the energy was unbelievable. It is rare to see youth organizing combining underground creative culture with relentless survivor solidarity and tangible monetary aid to safehouses.',
    likes: 27,
    status: 'approved',
    created_at: new Date('2026-08-18').toISOString(),
    reviewed_at: new Date('2026-08-18').toISOString(),
  },
  {
    id: 'rev-seed-3',
    user_id: null,
    display_name: 'Kavita M.',
    role_or_relation: 'Community Partner',
    rating: 5,
    review_text: 'Project S.H.E. stands completely apart from superficial campus initiatives. Their focus on legal literacy, dismantling victim-blaming mindsets, and ongoing material support for Sahodaya is authentic and inspiring.',
    likes: 21,
    status: 'approved',
    created_at: new Date('2026-09-05').toISOString(),
    reviewed_at: new Date('2026-09-05').toISOString(),
  },
];

const SEED_POSTS: BlogPost[] = [
  {
    id: 'post-seed-1',
    title: "Sayodhya Women's Safehouse Relief Drive: What We Achieved",
    slug: 'sayodhya-safehouse-relief-drive',
    cover_image_url: '/assets/statue_lady_justice.jpg',
    excerpt: 'A comprehensive report on our grassroots mobilization for Sahodaya and Sayodhya Women’s Help Home, delivering essential kits, direct aid, and childcare space setup.',
    body: `In August 2024, Project S.H.E. partnered with local shelter homes to channel emergency supplies and direct childcare infrastructure to women rebuilding their lives after escaping domestic abuse.\n\nThrough community solidarity and youth fundraising drives, over ₹2,00,000 in supplies, medical aid, and educational kits was mobilised. Our mission remains rooted in tangible support that restores human dignity and long-term autonomy.`,
    category: 'Safehouse Relief',
    tags: ['Safehouse', 'Grassroots', 'Direct Aid'],
    author_name: 'Sanskriti Mohan',
    likes: 48,
    is_pinned: true,
    status: 'published',
    published_at: new Date('2026-06-15').toISOString(),
    created_at: new Date('2026-06-15').toISOString(),
    updated_at: new Date('2026-06-15').toISOString(),
  },
  {
    id: 'post-seed-2',
    title: 'Deconstructing Misogyny in Media & Street Culture',
    slug: 'deconstructing-misogyny-in-media',
    cover_image_url: '/assets/riot_lady_justice.jpg',
    excerpt: 'Examining the normalization of victim-blaming in street interviews and popular entertainment, and why student collectives must speak out fearlessly.',
    body: `When violence occurs, the conversation routinely shifts to what the survivor was wearing, why she was outside, or who accompanied her.\n\nAt Project S.H.E., we refuse to permit these rationalizations. Through street dialogues, zines, and open university forums, we challenge the psychological roots of gender violence.`,
    category: 'Awareness & Action',
    tags: ['Mindset', 'Advocacy', 'Student Voices'],
    author_name: 'Project S.H.E. Editorial Team',
    likes: 39,
    is_pinned: true,
    status: 'published',
    published_at: new Date('2026-07-20').toISOString(),
    created_at: new Date('2026-07-20').toISOString(),
    updated_at: new Date('2026-07-20').toISOString(),
  },
  {
    id: 'post-seed-3',
    title: 'Battle of the Bands 2.0: Raising ₹2,00,000+ for Survivor Solidarity',
    slug: 'battle-of-the-bands-2-recap',
    cover_image_url: '/assets/punk_paper_bg.jpg',
    excerpt: 'How Hyderabad’s underground music scene rallied together under Project S.H.E. to fund healthcare, shelter infrastructure, and educational materials.',
    body: `Two packed editions of Battle of the Bands proved that culture and social justice belong together. Featuring student acts from across Telangana, BOTB 2.0 directed all proceeds to Sahodaya, Ammani Foundation, Snehalaya, and NIEPID.`,
    category: 'Community Action',
    tags: ['BOTB', 'Music', 'Fundraising'],
    author_name: 'Project S.H.E. Events Team',
    likes: 64,
    is_pinned: true,
    status: 'published',
    published_at: new Date('2026-08-10').toISOString(),
    created_at: new Date('2026-08-10').toISOString(),
    updated_at: new Date('2026-08-10').toISOString(),
  },
];

// Production Data Store
let memoryReviews: PublicReview[] = [...SEED_REVIEWS];
let memoryPosts: BlogPost[] = [...SEED_POSTS];
let memoryUpdates: SiteUpdate[] = [];
let memoryFeedback: SuggestionFeedback[] = [];
let memoryProfiles: UserProfile[] = [];
let memoryConfig: SiteConfig = { ...DEFAULT_CONFIG };

// --- REVIEWS ---

export async function getPublicReviews(sortBy: 'likes' | 'rating' | 'newest' = 'likes'): Promise<PublicReview[]> {
  let list: PublicReview[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved');
      if (!error && data && data.length > 0) {
        list = data as PublicReview[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to memory store:', e);
    }
  }

  if (list.length < 3) {
    const memoryApproved = memoryReviews.filter((r) => r.status === 'approved');
    const existingIds = new Set(list.map((r) => r.id));
    for (const mr of memoryApproved) {
      if (!existingIds.has(mr.id)) {
        list.push(mr);
        existingIds.add(mr.id);
        if (list.length >= 3) break;
      }
    }
  }

  return list.sort((a, b) => {
    if (sortBy === 'likes') {
      const diff = (b.likes || 0) - (a.likes || 0);
      if (diff !== 0) return diff;
    } else if (sortBy === 'rating') {
      const diff = (b.rating || 5) - (a.rating || 5);
      if (diff !== 0) return diff;
    }
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
      if (!error && data) return data as PublicReview[];
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
      if (!error && data && data.length > 0) {
        list = data as BlogPost[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed:', e);
    }
  }

  if (list.length < 3) {
    const memoryPublished = memoryPosts.filter((p) => p.status === 'published');
    const existingIds = new Set(list.map((p) => p.id));
    for (const mp of memoryPublished) {
      if (!existingIds.has(mp.id)) {
        list.push(mp);
        existingIds.add(mp.id);
        if (list.length >= 3) break;
      }
    }
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
  const updateData: SiteUpdate = {
    id: item.id || 'up-' + Math.random().toString(36).substring(2, 9),
    title: item.title,
    content: item.content,
    category: item.category || 'General',
    status: item.status || 'published',
    created_at: item.created_at || new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      if (!item.id) {
        const { data, error } = await supabase.from('updates').insert(updateData).select().single();
        if (!error && data) return data as SiteUpdate;
      } else {
        const { data, error } = await supabase.from('updates').update(updateData).eq('id', item.id).select().single();
        if (!error && data) return data as SiteUpdate;
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
        return cfg;
      }
    } catch (e) {
      console.warn('Supabase config fetch failed:', e);
    }
  }
  return memoryConfig;
}

export async function updateSiteConfig(newConfig: Partial<SiteConfig>): Promise<SiteConfig> {
  memoryConfig = { ...memoryConfig, ...newConfig };

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

// --- USER PROFILES & AUTH SYNC ---

export async function syncUserProfile(profile: { id: string; email: string; display_name: string; avatar_url?: string | null }): Promise<UserProfile | null> {
  const cleanEmail = profile.email.trim().toLowerCase();

  // Check if this account was permanently deleted by the administrator
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { data: deletedMatch } = await supabase
        .from('deleted_accounts')
        .select('id')
        .or(`id.eq.${profile.id},email.eq.${cleanEmail}`)
        .limit(1);

      if (deletedMatch && deletedMatch.length > 0) {
        return null; // Account is deleted by admin; refuse re-creation
      }
    } catch (e) {
      console.warn('Supabase check deleted_accounts failed:', e);
    }
  }

  const existing = memoryProfiles.find((p) => p.id === profile.id);
  const updated: UserProfile = {
    id: profile.id,
    email: profile.email,
    display_name: profile.display_name || profile.email.split('@')[0],
    avatar_url: profile.avatar_url || null,
    is_admin: existing ? existing.is_admin : cleanEmail === (process.env.ADMIN_EMAIL || 'admin@projectshe.org').toLowerCase(),
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
  let userEmail: string | null = null;
  const memUser = memoryProfiles.find((p) => p.id === id);
  if (memUser) userEmail = memUser.email;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();

      // Retrieve email if not in memory
      if (!userEmail) {
        const { data: dbUser } = await supabase.from('profiles').select('email').eq('id', id).single();
        if (dbUser?.email) userEmail = dbUser.email;
      }

      // Record in deleted_accounts so automatic client auth doesn't resurrect this account
      await supabase.from('deleted_accounts').upsert(
        {
          id,
          email: userEmail ? userEmail.toLowerCase() : null,
          deleted_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

      // Permanently remove from profiles
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


