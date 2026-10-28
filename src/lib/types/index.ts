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

export interface BulletinComment {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string | null;
  content: string;
  created_at: string;
  parent_id?: string | null;
  reply_to_name?: string | null;
  likes?: number;
  liked_by?: string[];
}

export interface ParsedBulletin {
  body: string;
  image_url?: string;
  card_style: BulletinCardStyle;
  is_banner: boolean;
  link_url?: string;
  link_text?: string;
  doodle_icon?: BulletinDoodleIcon;
  author_name?: string;
  author_id?: string;
  pinned?: boolean;
  locked?: boolean;
  likes?: number;
  liked_by?: string[];
  comments?: BulletinComment[];
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
          author_name: parsed.author_name || 'Project S.H.E.',
          author_id: parsed.author_id,
          pinned: Boolean(parsed.pinned),
          locked: Boolean(parsed.locked),
          likes: typeof parsed.likes === 'number' ? parsed.likes : 0,
          liked_by: Array.isArray(parsed.liked_by) ? parsed.liked_by : [],
          comments: Array.isArray(parsed.comments) ? parsed.comments : [],
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
    author_name: 'Project S.H.E.',
    pinned: false,
    locked: false,
    likes: 0,
    liked_by: [],
    comments: [],
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
  admin_master_password?: string;
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

export interface SiteSettings {
  id?: string;
  default_theme?: 'dark' | 'light';
  marquee_text: string;
  hero_badge?: string;
  hero_subbadge?: string;
  hero_headline: string;
  hero_headline_2?: string;
  hero_headline_3?: string;
  hero_description?: string;
  about_statement?: string;
  pillar_1_title?: string;
  pillar_1_desc?: string;
  pillar_2_title?: string;
  pillar_2_desc?: string;
  pillar_3_title?: string;
  pillar_3_desc?: string;
  donation_headline?: string;
  donation_subtext?: string;
  donation_qr_url?: string;
  donation_upi_id?: string;
  footer_quote: string;
  google_form_team_app: string;
  google_form_artwork_poetry: string;
  google_form_anonymous_confessions: string;
  emergency_helpline?: string;
  contact_email?: string;
  instagram_url?: string;
  updated_at?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  title?: string;
  aspect?: number;
  category?: 'BOTB 2.0' | string;
  event?: string;
  width?: number;
  height?: number;
  created_at?: string;
}

export interface VisitorLog {
  id: string;
  visitor_id: string;
  location: string;
  last_online: string;
  action: string;
  created_at: string;
}

export interface TeamAccessLog {
  id: string;
  timestamp: string;
  status: 'successful' | 'unsuccessful';
  attempted_from?: string;
  reason?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  default_theme: 'dark',
  marquee_text: '₹2,00,000+ RAISED & DELIVERED ✦ BATTLE OF THE BANDS (BOTB 1.0 & 2.0) ✦ SARVA NIRBHAYA FOUNDATION ✦ HYDERABAD, INDIA ✦ DISMANTLING GENDER-BASED VIOLENCE ✦ SUPPORT. HELP. EMPOWER. ✦ REGISTERED SECTION 8 NON-PROFIT ✦ SAHODAYA WOMEN\'S HELP HOME',
  hero_badge: 'HYDERABAD\'S LEADING STUDENT NGO',
  hero_subbadge: 'SARVA NIRBHAYA FOUNDATION • HYDERABAD, INDIA',
  hero_headline: 'RAISE YOUR VOICE WHERE THEIRS WAS SILENCED.',
  hero_headline_2: 'STAND WITH THOSE WHO SURVIVED.',
  hero_headline_3: '',
  hero_description: 'Violence injects itself into the lives of survivors even after the incident itself has long passed, impacting their very ability to rebuild their lives. Project S.H.E., Hyderabad\'s leading student NGO, works to dismantle this systemic gender-based violence as well as extend support to survivor safe houses.',
  about_statement: 'Hi, I’m Sanskriti Mohan, founder of Project S.H.E. We are a youth-led organisation based in Hyderabad, India, and this is how our movement began.',
  pillar_1_title: '1. Fundraising',
  pillar_1_desc: 'Whether through enigmatic events like the two editions of Battle of the Bands, or through wholesome bake sales and community fundraisers, Project S.H.E. has remained committed to mobilising community support through both monetary contributions and meaningful presence. Through these events and endeavours, we have raised and contributed more than Rs. 2,00,000 towards survivor care and rehabilitation.',
  pillar_2_title: '2. Direct support for survivors.',
  pillar_2_desc: 'Our partnership with Sahodaya Women\'s Help Home has contributed towards the establishment of a day-care centre for the children of domestic violence survivors-a nurturing space for them while their mothers work towards rebuilding their lives. More recently, funds raised through BOTB 2.0 were contributed to Sahodaya, Ammani Foundation, Snehalaya, and NIEPID, and helped support improvements in infrastructure and essential services across communities facing marginalisation.',
  pillar_3_title: '3. Advocacy and dialogue.',
  pillar_3_desc: 'Our dedicated team of writers and designers brings forward an expansive range of topics, from articles examining issues such as misogyny in the media to case posts that shed light on the violence faced by women and children. Our goal has always been to turn community support into tangible change- channelling that collective engagement towards advocacy and awareness-building.',
  donation_headline: 'DONATE THROUGH UPI',
  donation_subtext: 'Convenient, safe, and designed to ensure your contribution reaches those who need it most.',
  donation_qr_url: '/assets/qr-code.svg',
  donation_upi_id: 'shailajalakshmisarao1974-2@okicici',
  footer_quote: 'Challenging the violence women face, reshaping the minds that permit it, and turning solidarity into dignity and tangible change.',
  google_form_team_app: 'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheTeamApplication/viewform',
  google_form_artwork_poetry: 'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheArtworkPoetry/viewform',
  google_form_anonymous_confessions: 'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheAnonymousConfessions/viewform',
  emergency_helpline: 'Women Helpline: 1091 | Domestic Abuse: 181 | Direct Desk: +91 98765 43210',
  contact_email: 'projectshe.ngo@gmail.com',
  instagram_url: 'https://instagram.com/projectshe.ngo',
  updated_at: new Date().toISOString(),
};

