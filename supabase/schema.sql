-- PROJECT S.H.E. NGO PRODUCTION DATABASE SCHEMA FOR SUPABASE
-- Run this script in the Supabase SQL Editor

-- 1. PROFILES TABLE (Linked with Firebase Auth UID)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY, -- Firebase Auth UID
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  email_subscribed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PUBLIC REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  role_or_relation TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  review_text TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Index for public reviews
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_likes ON public.reviews(likes DESC);

-- 3. PRIVATE SUGGESTIONS & FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.suggestions_feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT CHECK (type IN ('suggestion', 'feedback')) NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('new', 'reviewed', 'resolved')) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BLOG & CASE POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_image_url TEXT,
  excerpt TEXT,
  body TEXT NOT NULL,
  category TEXT DEFAULT 'Legal Rights',
  tags TEXT[] DEFAULT ARRAY['Project SHE'],
  author_name TEXT DEFAULT 'Project S.H.E.',
  likes INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON public.posts(is_pinned DESC);

-- Migration Statements for Existing Databases:
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;

-- 5. FIELD BULLETINS & ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.updates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Announcement',
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. OPERATIONAL SITE CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT
);

-- Insert Default Operational Config
INSERT INTO public.site_config (key, value, description) VALUES
  ('google_form_team_app', 'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheTeamApplication/viewform', 'External URL for volunteer & team applications'),
  ('google_form_artwork_poetry', 'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheArtworkPoetry/viewform', 'External URL for artwork & poetry submissions'),
  ('google_form_anonymous_confessions', 'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheAnonymousConfessions/viewform', 'External URL for anonymous confessions vault'),
  ('donation_qr_url', '/assets/donation-qr.png', 'Official donation QR code image asset URL'),
  ('donation_upi_id', 'projectshe.ngo@upi', 'Official UPI VPA for direct survivor donations'),
  ('contact_email', 'projectshe.ngo@gmail.com', 'Primary administrative contact email'),
  ('emergency_helpline', 'Women Helpline: 1091 | Domestic Abuse: 181 | Direct Desk: +91 98765 43210', 'Emergency helpline numbers')
ON CONFLICT (key) DO NOTHING;

-- 7. EMAIL LOGS TABLE
CREATE TABLE IF NOT EXISTS public.email_logs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  subject TEXT,
  recipient_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'sent',
  response_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SUPABASE STORAGE BUCKET CONFIGURATION
-- Run in Storage setup:
-- Create a public bucket named 'project-she-assets'

-- 9. LIVE SITE SETTINGS TABLE (CMS Live Editor)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_config',
  marquee_text TEXT NOT NULL,
  hero_headline TEXT NOT NULL,
  footer_quote TEXT NOT NULL,
  google_form_team_app TEXT NOT NULL,
  google_form_artwork_poetry TEXT NOT NULL,
  google_form_anonymous_confessions TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Default Settings
INSERT INTO public.site_settings (
  id,
  marquee_text,
  hero_headline,
  footer_quote,
  google_form_team_app,
  google_form_artwork_poetry,
  google_form_anonymous_confessions
) VALUES (
  'default_config',
  '₹2,00,000+ RAISED & DELIVERED ✦ BATTLE OF THE BANDS (BOTB 1.0 & 2.0) ✦ SARVA NIRBHAYA FOUNDATION ✦ HYDERABAD, INDIA ✦ DISMANTLING GENDER-BASED VIOLENCE ✦ SUPPORT. HELP. EMPOWER. ✦ REGISTERED SECTION 8 NON-PROFIT ✦ SAHODAYA WOMEN''S HELP HOME',
  'RAISE YOUR VOICE WHERE THEIRS WAS SILENCED. STAND WITH THOSE WHO SURVIVED.',
  'Challenging the violence women face, reshaping the minds that permit it, and turning solidarity into dignity and tangible change.',
  'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheTeamApplication/viewform',
  'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheArtworkPoetry/viewform',
  'https://docs.google.com/forms/d/e/1FAIpQLScProjectSheAnonymousConfessions/viewform'
) ON CONFLICT (id) DO NOTHING;

-- 10. VISUAL CHRONICLES (GALLERY IMAGES)
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id TEXT PRIMARY KEY,
  src TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Community Event Photograph',
  category TEXT DEFAULT 'BOTB 2.0',
  aspect NUMERIC DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery_images(created_at DESC);

-- 11. VISITOR INSIGHTS (COMMUNITY PRESENCE & TRAFFIC)
CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  location TEXT DEFAULT 'Hyderabad, IN',
  last_online TIMESTAMPTZ DEFAULT NOW(),
  action TEXT DEFAULT 'Browsing Website',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitor_logs_last_online ON public.visitor_logs(last_online DESC);

-- 12. TEAM ACCESS LOG (SECURITY & ACCESS MONITORING)
CREATE TABLE IF NOT EXISTS public.team_access_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('successful', 'unsuccessful')) NOT NULL,
  attempted_from TEXT DEFAULT 'Hyderabad, IN',
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_access_timestamp ON public.team_access_logs(timestamp DESC);

