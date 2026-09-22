# PROJECT S.H.E. (SUPPORT. HELP. EMPOWER.) NGO

A production-ready web application built for **Project S.H.E.**, a grassroots non-governmental organisation dedicated to survivor defense, 24/7 emergency response, pro-bono legal literacy, and holistic empowerment of women and vulnerable individuals across India.

Crafted with a **"grunge Y2K punk red & black"** brutalist aesthetic, procedural WebGL paper grain shaders, and strict separation between public, user-private, and administrator-only workflows.

---

## Key Workflows & Features

1. **Public Website**
   - Mission, Values, and the 3 Pillars: **Support** (Crisis response), **Help** (Legal aid & advocacy), **Empower** (Rehabilitation).
   - Published field bulletins and alerts.
   - Published blog & case studies archive (`/blog`, `/blog/[slug]`).
   - Approved community reviews and testimonials.
   - **External Google Forms Hub**:
     - *Main Team Applications*
     - *Artwork & Poetry Submissions*
     - *Anonymous Confessions*
     *(Stored in Supabase `site_config` and editable via Admin dashboard).*
   - **Donation Section**: Official Project S.H.E. QR Code with copyable UPI ID (`projectshe.ngo@upi`). Zero third-party payment gateways.
   - Public Suggestion / Feedback and Public Review submission modals.

2. **User Authentication (Firebase Auth)**
   - Sign up, Login, Logout, Password Reset.
   - Profile synchronization with Supabase `profiles` table.
   - Complete privacy: users can only view their own activity, submitted reviews, and feedback.

3. **Personal User Dashboard (`/dashboard`)**
   - Manage display name and account details.
   - Manage email newsletter subscription status (opt-in / opt-out).
   - Track submitted reviews (Pending / Approved / Rejected).
   - Track private feedback and suggestions.
   - Quick launcher for external Google Forms.

4. **Single Administrator Control Center (`/admin`)**
   - **Hard authorization**: Protected by explicit Admin Secret Key (`x-admin-secret` or `ADMIN_SECRET_KEY`) and Admin email. Normal users receive an explicit 403 Forbidden.
   - **Operational Overview**: Real-time counter metrics for pending reviews, published posts, feedback, and subscribers.
   - **Public Review Moderation Queue**: Approve, Reject, Delete incoming reviews.
   - **Feedback & Suggestion Inbox**: Private administrative inbox with status workflow (New -> Reviewed -> Resolved).
   - **Blog & Case Post CMS**: Full CRUD, markdown editor, cover image uploads to Supabase Storage, draft/publish/archive states.
   - **Bulletins & Updates**: Broadcast live announcements.
   - **Email & Newsletter Dispatch**: Broadcast updates via server-side Google Apps Script integration strictly to opted-in subscribers.
   - **Website Operational Settings**: Instant live editing of external Google Form URLs, donation QR image URL, emergency helpline numbers, and contact email.

5. **Aesthetics & Technology Stack**
   - **Framework**: Next.js 14 (App Router, TypeScript, React 18)
   - **Styling**: Tailwind CSS with custom brutalist shadows, raw high-contrast borders, and custom fonts.
   - **Texture & Canvas**: Standalone procedural WebGL FBM noise shader (`TextureBackground.tsx`) + tactile paper fiber overlay (`PaperOverlay.tsx`).
   - **Icons**: Lucide React.
   - **Database**: Supabase PostgreSQL (`supabase/schema.sql`).
   - **Auth**: Firebase Authentication (`src/lib/firebase`).
   - **Email**: Google Apps Script server dispatcher (`src/lib/email/google-apps-script.ts`).
   - **Hosting**: Vercel ready.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and populate your credentials:
```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Client API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Admin only) |
| `ADMIN_EMAIL` | Designated single administrator email (`admin@projectshe.org`) |
| `ADMIN_SECRET_KEY` | Explicit secret key to unlock admin dashboard |
| `GOOGLE_APPSCRIPT_URL` | Google Apps Script deployment URL for mailing |
| `APPSCRIPT_SECRET` | Secret token verified by Google Apps Script |

### 3. Setup Supabase Database
Paste the SQL commands in `supabase/schema.sql` into the [Supabase SQL Editor](https://app.supabase.com).

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```
