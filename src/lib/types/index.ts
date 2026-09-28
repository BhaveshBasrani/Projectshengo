export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string; // Firebase UID
  email: string;
  display_name: string;
  avatar_url?: string | null;
  is_admin: boolean;
  email_subscribed: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export interface PublicReview {
  id: string;
  user_id?: string | null;
  display_name: string;
  role_or_relation?: string | null;
  rating: number; // 1 to 5
  review_text: string;
  status: ReviewStatus;
  likes?: number;
  created_at: string;
  reviewed_at?: string | null;
}

export type FeedbackType = 'suggestion' | 'feedback';
export type FeedbackStatus = 'new' | 'reviewed' | 'resolved';

export interface SuggestionFeedback {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  type: FeedbackType;
  subject: string;
  message: string;
  status: FeedbackStatus;
  created_at: string;
}

export type PostStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_image_url?: string | null;
  excerpt?: string | null;
  body: string;
  category: string;
  tags?: string[];
  author_name: string;
  status: PostStatus;
  likes?: number;
  is_pinned?: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export type BulletinCardStyle = 'polaroid' | 'zine' | 'stamp' | 'doodle';
export type BulletinDoodleIcon = 'star' | 'lightning' | 'heart' | 'starburst' | 'headphones' | 'discoball';

export interface SiteUpdate {
  id: string;
  title: string;
  content: string;
  category: string;
  status: PostStatus;
  created_at: string;
  image_url?: string;
  card_style?: BulletinCardStyle;
  is_banner?: boolean;
  link_url?: string;
  link_text?: string;
  doodle_icon?: BulletinDoodleIcon;
}

export interface ParsedBulletin {
  body: string;
  image_url?: string;
  card_style: BulletinCardStyle;
  is_banner: boolean;
  link_url?: string;
  link_text?: string;
  doodle_icon?: BulletinDoodleIcon;
}

export function parseBulletinPayload(update: SiteUpdate): ParsedBulletin {
  try {
    if (update.content && update.content.trim().startsWith('{') && update.content.trim().endsWith('}')) {
      const parsed = JSON.parse(update.content);
      if (typeof parsed.body === 'string') {
        return {
          body: parsed.body,
          image_url: parsed.image_url || update.image_url,
          card_style: (parsed.card_style as BulletinCardStyle) || update.card_style || 'zine',
          is_banner: parsed.is_banner !== undefined ? Boolean(parsed.is_banner) : (update.is_banner ?? true),
          link_url: parsed.link_url || update.link_url,
          link_text: parsed.link_text || update.link_text,
          doodle_icon: (parsed.doodle_icon as BulletinDoodleIcon) || update.doodle_icon || 'star',
        };
      }
    }
  } catch (e) {}

  return {
    body: update.content || '',
    image_url: update.image_url,
    card_style: update.card_style || 'zine',
    is_banner: update.is_banner ?? true,
    link_url: update.link_url,
    link_text: update.link_text,
    doodle_icon: update.doodle_icon || 'star',
  };
}

export interface SiteConfig {
  google_form_team_app: string;
  google_form_artwork_poetry: string;
  google_form_anonymous_confessions: string;
  donation_qr_url: string;
  donation_upi_id: string;
  contact_email: string;
  emergency_helpline: string;
  instagram_url: string;
}

export interface AdminStats {
  totalUsers: number;
  pendingReviews: number;
  publishedReviews: number;
  newSuggestions: number;
  newFeedback: number;
  draftPosts: number;
  publishedPosts: number;
  emailSubscribers: number;
}
