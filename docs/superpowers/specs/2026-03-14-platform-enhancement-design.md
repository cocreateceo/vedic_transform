# 10X Vedic — Full Platform Enhancement Design Spec

## Overview

Transform the existing 10X Vedic 48-day transformation app into a complete, full-featured platform with essential public pages, rich content library, interactive activities, mystical purple/gold theme redesign, and platform-wide enhancements. Built in 3 phases — this spec covers **Phase 1** (all 21 features).

**Theme Direction:** Deep purples, golds, sacred geometry backgrounds — spiritual/mystical aesthetic.

---

## Phase 1 Feature List (21 Features)

### Section A: Public Pages (No Login Required)

---

### A1. Enhanced Landing Page

**Route:** `/`
**File:** `src/app/page.tsx` (rewrite)

**Sections (top to bottom):**

1. **Navbar** — Sticky, glassmorphism blur background. Logo (🕉 10X Vedic), nav links (Home, About, Pillars Overview, How It Works, Blog, Contact, FAQ) — "Pillars Overview" links to `/pillars-overview` (public page), NOT `/pillars` (authenticated tracking page), Login button (outline), "Start Free" button (gradient purple). Mobile: hamburger menu.

2. **Hero Section** — Full-width dark gradient background (`#0f0a1e → #1a1145`). Sacred geometry mandala pattern as subtle background SVG. Headline: "Transform Yourself in 48 Days" in gold gradient text. Tagline below. Two CTAs: "Begin Your Journey →" (purple gradient) and "▶ Watch Intro" (outline). YouTube video embed below (configurable via `site.config.ts`).

3. **Stats Bar** — Horizontal strip with animated counters: 48 Days | 11 Pillars | 60 Min/Day | 1000+ Transformations. Background: subtle purple tint.

4. **How It Works** — 4-step horizontal flow with numbered circles: Sign Up → Practice Daily → Track Progress → Transform. Each step in a glassmorphism card.

5. **11 Pillars Grid** — 4-column grid (3 on tablet, 2 on mobile). Each pillar card shows emoji icon, name, Sanskrit term, category tag (Body/Mind/Spirit). Color-coded borders: orange for Body, purple for Mind, gold for Spirit. "View All →" card links to `/pillars-overview`.

6. **Benefits Grid** — 3x2 grid of transformation outcomes: Strong Discipline, Emotional Stability, Better Metabolism, Clear Mind, Rapid Growth, Success Energy. Dark glassmorphism cards with icons.

7. **Testimonials Carousel** — Auto-scrolling carousel (Framer Motion). Star ratings, quote text, practitioner name. Dots navigation. Testimonials stored in `src/data/testimonials.ts`.

8. **FAQ Preview** — Top 4 questions in accordion style. "View All FAQs →" link. FAQ data from `src/data/faq.ts`.

9. **CTA Section** — Gradient background (purple to gold). Bold headline, tagline, single large CTA button.

10. **Footer** — 4-column layout: Company (About, How It Works, Blog), Support (Contact, FAQ, Help), Legal (Privacy, Terms, Cookie Policy), Connect (YouTube, Instagram, Twitter). Copyright with "🕉 Shri Hari Hari". Dark background.

**New data files:**
- `src/data/testimonials.ts` — Testimonial entries with name, quote, rating, day completed
- `src/data/faq.ts` — FAQ entries with question, answer, category

---

### A2. About Us Page

**Route:** `/about`
**File:** `src/app/about/page.tsx`

**Sections:**
1. **Hero** — "About 10X Vedic" headline with sacred geometry background
2. **Mission & Vision** — Two-column card layout. Mission: "To make ancient Vedic wisdom accessible through modern technology." Vision: "A world where everyone has tools for daily transformation."
3. **The Science** — Explanation of the 48-day Mandala cycle, neurobiology of habit formation (18-245 days research), why 48 days works
4. **The 11 Pillars Overview** — Brief grid showing Body/Mind/Spirit categories
5. **Founder/Team Section** — Photo placeholder, name, bio, social links. Data from `src/data/team.ts`
6. **CTA** — "Start Your Journey" button

---

### A3. How It Works Page

**Route:** `/how-it-works`
**File:** `src/app/how-it-works/page.tsx`

**Sections:**
1. **Hero** — "Your Transformation Path" headline
2. **Timeline** — Vertical animated timeline with 5 steps:
   - Step 1: Create Account & Take Baseline Assessment
   - Step 2: Start Your 48-Day Journey
   - Step 3: Daily Practice — 30 min Mind + 30 min Body
   - Step 4: Track Progress, Earn Karma, Build Streaks
   - Step 5: Complete Mandala & Receive Certificate
3. **Daily Routine Breakdown** — Visual showing a typical day: 5 AM wake → breathwork → meditation → movement → evening practices → sleep optimization
4. **Pillar Categories** — Three cards (Body, Mind, Spirit) with list of pillars under each
5. **What You Need** — Simple requirements: 60 min/day, open mind, consistency
6. **CTA** — Register button

---

### A4. Pillars Overview Page (Public)

**Route:** `/pillars-overview`
**File:** `src/app/pillars-overview/page.tsx`

**Sections:**
1. **Hero** — "11 Pillars of Transformation"
2. **Category Filter Tabs** — All | Body | Mind | Spirit
3. **Pillar Detail Cards** — For each pillar: icon, name, Sanskrit name, duration, description (2-3 sentences), key benefits (bullet list), what you'll practice. Cards are expandable/collapsible.
4. **Science Behind It** — Brief section explaining Vedic roots and modern research backing each category
5. **CTA** — "Begin Your Journey" button

Uses existing `PILLARS` constant from `src/constants/pillars.ts` for data.

---

### A5. Testimonials / Success Stories Page

**Route:** `/testimonials`
**File:** `src/app/testimonials/page.tsx`

**Sections:**
1. **Hero** — "Transformation Stories"
2. **Stats Summary** — Average completion rate, total journeys completed, average consistency score
3. **Stories Grid** — Card grid with: user avatar placeholder, name, star rating, quote, day completed, top 3 pillars practiced, before/after metrics (if available)
4. **Video Testimonials** — YouTube embed grid (configurable)
5. **CTA** — "Start Your Story" button

**Data:** `src/data/testimonials.ts` — Array of testimonial objects

---

### A6. Blog / Articles Section

**Route:** `/blog` and `/blog/[slug]`
**Files:** `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`

**Blog List Page:**
1. **Hero** — "Vedic Wisdom & Insights"
2. **Category Filter** — All | Body | Mind | Spirit | Science | Lifestyle
3. **Featured Article** — Large hero card for latest/pinned post
4. **Article Grid** — Cards with: thumbnail placeholder, title, excerpt, category badge, read time, date
5. **Pagination** — Simple prev/next

**Article Detail Page:**
1. **Header** — Title, author, date, read time, category badge
2. **Content** — Rendered markdown/HTML content
3. **Share buttons** — Copy link, Twitter, WhatsApp
4. **Related Articles** — 3 related posts at bottom

**Data:** `src/data/blog-posts.ts` — Array of blog post objects with slug, title, content, category, excerpt, date, readTime. Initially seeded with 5-6 articles about Vedic practices.

---

### A7. Contact Us Page

**Route:** `/contact`
**File:** `src/app/contact/page.tsx`

**Sections:**
1. **Hero** — "Get In Touch"
2. **Two-column layout:**
   - **Left:** Contact form (name, email, subject dropdown, message textarea, submit button). Server action sends email via configured email provider.
   - **Right:** Contact info cards — Email address, social media links, response time ("We respond within 24 hours")
3. **FAQ Link** — "Looking for quick answers? Check our FAQ"

---

### A8. FAQ / Help Center Page

**Route:** `/faq`
**File:** `src/app/faq/page.tsx`

**Sections:**
1. **Hero** — "Frequently Asked Questions"
2. **Search Bar** — Client-side search/filter
3. **Category Tabs** — Getting Started | Journey & Pillars | Account | Technical
4. **Accordion List** — Expandable Q&A items grouped by category
5. **Contact CTA** — "Still have questions? Contact us"

**Data:** `src/data/faq.ts` — Array with question, answer (supports HTML), category

**Initial FAQ content (15-20 questions):**
- What is the 48-day Mandala?
- Do I need meditation experience?
- How much time do I need daily?
- Is this program free?
- Can I restart my journey?
- What are Karma Points?
- How do streaks work?
- What happens after 48 days?
- etc.

---

### A9. Privacy Policy Page

**Route:** `/privacy`
**File:** `src/app/privacy/page.tsx`

**Content:** Legal page with proper headings and sections:
- Information We Collect (account data, usage data, cookies)
- How We Use Your Information
- Data Storage & Security
- Third-Party Services (analytics, email providers)
- Your Rights (access, delete, export)
- Cookie Policy
- Data Retention
- Changes to Policy
- Contact for Privacy Concerns

**Last updated date shown at top.**

---

### A10. Terms of Service Page

**Route:** `/terms`
**File:** `src/app/terms/page.tsx`

**Content:** Legal page with sections:
- Acceptance of Terms
- Account Registration
- User Responsibilities
- Intellectual Property
- Acceptable Use
- Disclaimer & Limitation of Liability
- Account Termination
- Changes to Terms
- Governing Law
- Contact

---

### Section B: Enhanced App Pages (Login Required)

---

### B1. Content Library / Learning Modules

**Route:** `/library`
**File:** `src/app/(main)/library/page.tsx`

**Purpose:** Central hub for all learning content organized by pillar.

**Sections:**
1. **Header** — "Content Library" with search bar
2. **Category Tabs** — All | Body | Mind | Spirit | Favorites
3. **Content Grid** — Cards with:
   - Thumbnail (placeholder or YouTube thumbnail)
   - Title, type badge (Video / Audio / Article / Guide)
   - Duration, pillar association
   - Completion status (checkmark if viewed)
   - Bookmark/favorite toggle

**Content Types:**
- **Video modules** — YouTube embeds per pillar (5 AM routine walkthrough, yoga flows, meditation guides)
- **Audio meditations** — Guided audio with play controls (stored as URLs, configurable)
- **PDF Guides** — Downloadable guides (like existing 5am-morning-routine-guide)
- **Articles** — Written guides and tips

**Data:** `src/data/content-library.ts` — Array of content items with id, title, type, pillarSlug, duration, url, thumbnail, description

**Database:** New `ContentProgress` model in Prisma:
```prisma
model ContentProgress {
  id        String   @id @default(cuid())
  userId    String
  contentId String
  completed Boolean  @default(false)
  progress  Int      @default(0)  // percentage
  lastAccessedAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  @@unique([userId, contentId])
}
```

**Add to sidebar navigation** under "Tools" section.

---

### B2. Guided Sessions (Timers & Exercises)

**Route:** `/sessions`
**File:** `src/app/(main)/sessions/page.tsx`

**Purpose:** Interactive, timer-based exercises for each pillar.

**Session Types:**

1. **Morning Routine Guide** — Step-by-step flow matching Step 1 from Vedic1.txt:
   - Wake Up (calm breathing animation)
   - Hydrate reminder
   - 4:6 Breathing (uses existing BreathingVisualizer, enhanced)
   - Awareness Connection (1-2 min timer with ambient sound)
   - Gratitude (3 items input)
   - Manifestation (2 min visualization timer)
   - Total: ~10-15 min guided flow

2. **Meditation Timer** — Configurable duration (5/10/15/20/30 min), ambient sound selection (silence, nature, om chant, singing bowls), interval bells, session complete chime.

3. **Breathing Exercises** — Enhanced breathing visualizer with multiple patterns:
   - 4:6 Basic (existing)
   - 4:7:8 Relaxing Breath
   - Box Breathing (4:4:4:4)
   - Wim Hof style

4. **Fasting Timer** — 16:8 intermittent fasting tracker. Start/stop fasting window, countdown, progress ring, fasting history.

5. **Movement Timer** — Yoga/exercise session timer with intervals, rest periods, exercise list.

**Components:**
- `src/components/features/sessions/morning-routine.tsx`
- `src/components/features/sessions/meditation-timer.tsx`
- `src/components/features/sessions/breathing-patterns.tsx`
- `src/components/features/sessions/fasting-timer.tsx`
- `src/components/features/sessions/movement-timer.tsx`

**Add to sidebar navigation** as primary nav item.

---

### B3. Daily Wisdom Feed

**Route:** `/wisdom` (or widget on dashboard)
**File:** `src/app/(main)/wisdom/page.tsx` + dashboard widget

**Purpose:** Daily curated positive content to start the day (matching Step 2B "Positive Inputs before 8 AM").

**Features:**
1. **Daily Verse/Quote** — Rotates daily from a seeded collection. Shows Sanskrit text + English translation for Vedic verses, or wisdom quotes from relevant teachers.
2. **Shareable Card** — Generate image card of today's wisdom for social sharing
3. **Bookmark** — Save favorites
4. **History** — View past daily wisdom entries
5. **Dashboard Widget** — Small card on dashboard showing today's wisdom

**Data:** `src/data/daily-wisdom.ts` — Start with 60 entries (covers initial 48-day cycle + buffer). Expand to 365 over time. Entries indexed by day-of-year; wraps around if user continues past the available entries.

**Shareable Card:** Use `html-to-image` library to render a styled card component to PNG for download/sharing.

**No new DB model needed** — the content is date-indexed from the static data file. Bookmarks stored in localStorage.

---

### B4. Enhanced Mood & Energy Tracker

**Route:** `/mood` (or integrated into dashboard)
**File:** `src/app/(main)/mood/page.tsx`

**Purpose:** Track daily emotional and physical state, correlate with pillar practice.

**Daily Check-in Widget (also on dashboard):**
- Mood (5-point emoji scale: 😞 😐 🙂 😊 🤩)
- Energy Level (1-5 battery icon)
- Stress Level (1-5 with color indicator)
- Sleep Quality (1-5 moon icons)
- Optional: short note/reflection

**Analytics Page:**
- 48-day mood trend line chart
- Energy vs. pillar completion correlation
- Stress reduction over time
- Sleep quality trend
- Best/worst days analysis
- Weekly averages comparison

**Database:** Uses existing `MoodLog` model in Prisma schema (has moodScore, energy, stress, notes). **Must add** `sleepQuality Int?` field to `MoodLog` model in `prisma/schema.prisma`.

---

### B5. Achievements & Badges Gallery

**Route:** `/achievements`
**File:** `src/app/(main)/achievements/page.tsx`

**Purpose:** Full achievement system with visual badge gallery.

**Sections:**
1. **Summary** — Total badges earned / total available, karma points, current level
2. **Badge Categories:**
   - **Streak Badges** — 7-day, 14-day, 21-day, 30-day, 48-day streak
   - **Pillar Mastery** — Complete a pillar 10/20/30/48 times
   - **Category Mastery** — Complete all Body/Mind/Spirit pillars in one day for 7 consecutive days
   - **Milestone Badges** — Day 7 (Week 1), Day 21 (Habit Formed), Day 48 (Mandala Complete)
   - **Special Badges** — Perfect Day (all 11 pillars), Early Bird (5 AM check-in), Night Owl (sleep optimization), Karma King (1000+ points)
3. **Badge Cards** — Visual badge icon, name, description, earned date (or greyed out with progress bar if not earned)
4. **Shareable Certificate** — Enhanced journey completion certificate (unlocks at Day 48)

**Database:** Uses existing `Badge` and `UserBadge` models. Seed additional badges in `prisma/seed.ts`.

**Badge Definitions to Seed:**

| Badge Name | Slug | Category | Unlock Criteria |
|-----------|------|----------|-----------------|
| First Step | `first-step` | milestone | Complete first pillar check-in |
| Week One | `week-one` | milestone | Complete Day 7 |
| Habit Formed | `habit-formed` | milestone | Complete Day 21 |
| Mandala Complete | `mandala-complete` | milestone | Complete Day 48 |
| Streak 7 | `streak-7` | streak | 7-day streak |
| Streak 14 | `streak-14` | streak | 14-day streak |
| Streak 21 | `streak-21` | streak | 21-day streak |
| Streak 48 | `streak-48` | streak | 48-day streak (perfect) |
| Body Master | `body-master` | mastery | All Body pillars completed 30+ times |
| Mind Master | `mind-master` | mastery | All Mind pillars completed 30+ times |
| Spirit Master | `spirit-master` | mastery | All Spirit pillars completed 30+ times |
| Perfect Day | `perfect-day` | special | All 11 pillars in one day |
| Early Bird | `early-bird` | special | 5 AM check-in 7 consecutive days |
| Karma King | `karma-king` | special | Earn 1000+ karma points |
| Journaler | `journaler` | special | 30 gratitude entries |

Badge `requirement` JSON format: `{ "type": "streak|milestone|mastery|special", "target": number, "field": "string" }`

---

### B6. Notification Center

**Route:** N/A (header component)
**File:** `src/components/features/notifications/notification-center.tsx`

**Purpose:** In-app notification bell in header with dropdown.

**Features:**
1. **Bell Icon** — In header, shows unread count badge
2. **Dropdown Panel** — Click to show recent notifications
3. **Notification Types:**
   - Streak at risk (no check-ins after 6 PM)
   - Milestone reached (Day 7, 14, 21, 48)
   - Badge earned
   - New content available
   - Weekly summary ready
   - Insight generated
4. **Mark as Read** — Individual and bulk
5. **Settings Link** — Quick link to `/reminders`

**Database:** New `Notification` model:
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String   // streak_warning, milestone, badge, content, summary, insight
  title     String
  message   String
  isRead    Boolean  @default(false)
  actionUrl String?  // link to relevant page
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```
**Note:** Also add reverse relations to `User` model: `notifications Notification[]` and `contentProgress ContentProgress[]`.

---

### Section C: Platform-Wide Enhancements

---

### C1. Dark Mode / Sattva Night Mode

**Implementation:**
1. **Theme Toggle** — Button in header (sun/moon icon) to switch themes
2. **Three Modes:**
   - **Light** — Current amber/warm theme (for daytime)
   - **Dark** — Deep purple/indigo background, light text (manual toggle)
   - **Sattva Mode** — Auto-activates after sunset (configurable). Warm, low-blue-light colors. Reduced visual stimulation. Calming gradients.
3. **Persistence** — Store preference in localStorage + cookie
4. **CSS Implementation** — Use CSS custom properties (already partially set up in globals.css). Apply `data-theme="dark"` or `data-theme="sattva"` on `<html>`.
5. **Auto-detection** — Respect system `prefers-color-scheme` as default

**Files to modify:**
- `src/app/globals.css` — Add dark/sattva theme variables
- `src/components/layout/header.tsx` — Add theme toggle button
- `src/app/layout.tsx` — Add theme provider
- New: `src/components/ui/theme-toggle.tsx`
- New: `src/lib/theme.ts` — Theme detection, sunset lookup table (timezone-based, default 6 PM fallback), mode switching logic

---

### C2. Mystical Purple/Gold Theme Redesign

**Color Palette Update:**

| Role | Light Mode | Dark Mode |
|------|-----------|-----------|
| Background | `#faf5ff` (soft lavender) | `#0f0a1e` (deep space) |
| Surface | `#ffffff` | `#1a1145` (dark indigo) |
| Primary | `#7c3aed` (vivid purple) | `#a78bfa` (light purple) |
| Secondary | `#d97706` (warm gold) | `#fbbf24` (bright gold) |
| Accent | `#6d28d9` (deep violet) | `#8b5cf6` (medium purple) |
| Text Primary | `#1e1b4b` (dark indigo) | `#e2e8f0` (light gray) |
| Text Secondary | `#64748b` (slate) | `#94a3b8` (medium gray) |
| Border | `rgba(124,58,237,0.15)` | `rgba(124,58,237,0.25)` |
| Card BG | `rgba(124,58,237,0.05)` | `rgba(124,58,237,0.1)` |

**Sacred Geometry Elements:**
- Mandala SVG pattern as hero backgrounds (subtle, low opacity)
- Lotus decorative elements on section dividers
- Sri Yantra pattern as loading animation
- Om symbol in logo area

**Typography:**
- Headings: Keep current font, add gold gradient text for important headings
- Body: Keep current
- Wisdom quotes: Italic serif font for Sanskrit/wisdom text

**Glassmorphism Cards:**
- `backdrop-filter: blur(12px)`
- Semi-transparent backgrounds
- Subtle purple border glow on hover

**Files to modify:**
- `src/app/globals.css` — Complete color variable overhaul
- All component files — Update hardcoded colors to use CSS variables
- `src/app/globals.css` — Update `@theme` block for Tailwind CSS 4 (no `tailwind.config.ts` — project uses CSS-first config)

---

### C3. Google Analytics + Cookie Consent

**Google Analytics 4:**
- Add GA4 script to root layout via `next/script`
- Track: page views, user registration, journey start, pillar completion, session duration
- Environment variable: `NEXT_PUBLIC_GA_MEASUREMENT_ID`

**Cookie Consent Banner:**
- New component: `src/components/ui/cookie-consent.tsx`
- Bottom banner with: "We use cookies to enhance your experience" message
- Buttons: "Accept All" | "Necessary Only" | "Manage Preferences"
- Stores preference in cookie
- Only loads GA after consent
- Framer Motion slide-up animation

---

### C4. SEO & Meta Tags

**Implementation:**
- **Root Layout** — Default metadata (title, description, OG image, Twitter card)
- **Per-Page Metadata** — Each page exports `metadata` object with unique title/description
- **Structured Data** — JSON-LD for:
  - Organization (10X Vedic)
  - WebApplication
  - FAQ (on FAQ page)
  - Article (on blog posts)
- **sitemap.xml** — Auto-generated via `src/app/sitemap.ts`
- **robots.txt** — Via `src/app/robots.ts`
- **Open Graph Images** — Default OG image in `public/images/og-image.jpg`

---

### C5. PWA (Progressive Web App)

**Implementation:**
- **Web App Manifest** — `public/manifest.json` with app name, icons, theme color, display mode
- **Service Worker** — Basic caching for offline shell using Serwist (maintained fork of next-pwa, compatible with Next.js 16)
- **Icons** — 192x192 and 512x512 app icons in `public/icons/`
- **Install Prompt** — "Add to Home Screen" banner for mobile users
- **Offline Page** — Simple offline fallback page

---

## New Data Files Summary

| File | Purpose |
|------|---------|
| `src/data/testimonials.ts` | Testimonial entries |
| `src/data/faq.ts` | FAQ question/answer pairs |
| `src/data/blog-posts.ts` | Blog article content |
| `src/data/content-library.ts` | Video/audio/guide entries per pillar |
| `src/data/daily-wisdom.ts` | 365+ daily quotes/verses |
| `src/data/team.ts` | Team/founder info (create new — does not exist yet) |

## New Database Models

| Model | Purpose |
|-------|---------|
| `ContentProgress` | Track user progress through content library |
| `Notification` | In-app notification storage |

## Modified Database Models

| Model | Change |
|-------|--------|
| `Badge` | Seed additional badges (streak, mastery, special) |

## New Routes Summary

### Public Routes
| Route | Page |
|-------|------|
| `/` | Enhanced Landing Page (rewrite) |
| `/about` | About Us |
| `/how-it-works` | How It Works |
| `/pillars-overview` | 11 Pillars Public Detail |
| `/testimonials` | Success Stories |
| `/blog` | Blog List |
| `/blog/[slug]` | Blog Article |
| `/contact` | Contact Form |
| `/faq` | FAQ / Help Center |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

### Protected Routes (add to middleware)
| Route | Page |
|-------|------|
| `/library` | Content Library |
| `/sessions` | Guided Sessions |
| `/wisdom` | Daily Wisdom Feed |
| `/mood` | Mood & Energy Tracker |
| `/achievements` | Badges & Achievements Gallery |

**Middleware update required:** Add these 5 routes to the `protectedRoutes` array in `src/middleware.ts` (line 11). All pages live under the `(main)` route group which provides authenticated layout but the URL paths are `/library`, `/sessions`, etc.

### API Pattern

All B-section features use **Next.js Server Actions** (inline `"use server"` functions in page/component files) for form submissions and mutations, consistent with the existing pattern used in journal and settings pages. For client-side data fetching (notifications, mood analytics), use **Route Handlers** in `src/app/api/` with TanStack React Query on the client, consistent with the existing insights/goals pattern.

### Public Page Layout

Public pages (A1-A10) need their own layout separate from the authenticated `(main)` layout:
- New: `src/components/layout/public-navbar.tsx` — Shared navbar for all public pages
- New: `src/components/layout/public-footer.tsx` — Shared footer for all public pages
- New: `src/app/(public)/layout.tsx` — Route group wrapping public pages with navbar + footer
- Move public pages into `src/app/(public)/` route group: about, how-it-works, pillars-overview, testimonials, blog, contact, faq, privacy, terms
- Landing page (`src/app/page.tsx`) stays at root but imports the same navbar/footer components

## Navigation Updates

### Sidebar (`sidebar.tsx`)
**Primary Nav:**
- Dashboard
- Pillars
- Sessions *(new)*
- Goals
- Progress
- Journal

**Tools:**
- Library *(new)*
- Wisdom *(new)*
- Mood *(new)*
- Achievements *(new)*
- Insights
- Reports
- Reminders
- Settings

### Mobile Nav (`mobile-nav.tsx`)
**Bottom bar (5 items):**
- Home (Dashboard)
- Pillars
- Sessions *(new)*
- Progress
- More

**More menu:**
- Goals
- Journal
- Library
- Wisdom
- Mood
- Achievements
- Insights
- Reports
- Reminders
- Settings

### Header
- Add notification bell icon (NotificationCenter component)
- Add dark mode toggle button
- Update to purple/gold theme

### Public Navbar (landing page)
- Home, About, Pillars, How It Works, Blog, Contact, FAQ
- Login | Start Free buttons

## Build Order (Recommended)

1. **Theme Redesign** (C2) — Do first so all new pages use new theme
2. **Dark Mode** (C1) — Implement alongside theme
3. **Landing Page** (A1) — Highest visibility page
4. **Footer Component** — Shared across all public pages
5. **Public Navbar** — Shared across all public pages
6. **About, How It Works, Pillars Overview** (A2, A3, A4) — Core info pages
7. **Privacy, Terms** (A9, A10) — Legal requirements
8. **Contact, FAQ** (A7, A8) — Support pages
9. **Testimonials** (A5) — Social proof
10. **Blog** (A6) — Content/SEO
11. **SEO & Meta** (C4) — Apply to all pages
12. **Google Analytics + Cookie Consent** (C3)
13. **Content Library** (B1) — Core app feature
14. **Guided Sessions** (B2) — Interactive activities
15. **Daily Wisdom** (B3) — Quick win
16. **Mood Tracker** (B4) — Enhancement
17. **Achievements** (B5) — Gamification
18. **Notification Center** (B6) — Platform polish
19. **PWA** (C5) — Final polish
20. **Navigation Updates** — Sidebar, mobile nav, header updates happen **incrementally** as each feature is built (not as a final batch step). Each feature that adds a new route also updates the relevant nav component.

## Site Config Updates

Update `src/config/site.config.ts` to add:
```typescript
social: {
  youtube: "https://www.youtube.com/@vedic-s",
  instagram: "", // placeholder — configure when ready
  twitter: "",   // placeholder — configure when ready
}
```

## Cross-Cutting Concerns

### Loading States
- All server-rendered pages: use Next.js `loading.tsx` files with skeleton UI per route group
- Client components: use loading spinners from existing Button component pattern

### Error Handling
- Add `error.tsx` files to `(main)` and `(public)` route groups
- Graceful fallbacks: show "Something went wrong" card with retry button
- Form submissions: show inline error messages

### ContentProgress Foreign Key Note
`ContentProgress.contentId` references static data in `src/data/content-library.ts`, NOT a database table. This is intentional — content metadata lives in code, progress tracking lives in DB.

---

## Phase 2 Preview (Future)
- Community features (user profiles, forums, group challenges, leaderboards)
- Manifestation groups (end of month/year)
- Live group meditation sessions
- Social sharing and user connections

## Phase 3 Preview (Future)
- Subscription tiers & payment gateway
- Premium content gating
- Admin dashboard
- AI Avatar (D-ID/HeyGen integration)
- Wearable integration
- Email with PDF attachments
