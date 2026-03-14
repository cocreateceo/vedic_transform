# 10X Vedic Platform Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing 10X Vedic app into a complete platform with 21 features: 10 public pages, 6 enhanced app pages, and 5 platform-wide enhancements — all with a mystical purple/gold theme.

**Architecture:** Next.js 16 App Router with two route groups: `(public)` for unauthenticated pages with shared navbar/footer, and `(main)` for authenticated app pages with existing sidebar/header layout. Data stored in SQLite via Prisma. Static content in `src/data/` files. New Prisma models for ContentProgress and Notification.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4 (CSS-first config), Framer Motion, Prisma/SQLite, Recharts, Lucide React, Serwist (PWA)

**Spec:** `docs/superpowers/specs/2026-03-14-platform-enhancement-design.md`

---

## Chunk 1: Theme Redesign & Dark Mode (Tasks 1-3)

### Task 1: Purple/Gold Theme — CSS Variables & @theme Update

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update CSS color variables for purple/gold mystical theme**

Replace the vedic color variables and add light/dark theme support in `src/app/globals.css`. Update the `@theme` block and `:root` variables:

```css
@layer base {
  :root {
    /* Primary Purple/Gold Palette */
    --color-bg-primary: #faf5ff;
    --color-bg-surface: #ffffff;
    --color-bg-elevated: #f5f0ff;
    --color-primary: #7c3aed;
    --color-primary-hover: #6d28d9;
    --color-secondary: #d97706;
    --color-secondary-hover: #b45309;
    --color-accent: #8b5cf6;
    --color-text-primary: #1e1b4b;
    --color-text-secondary: #64748b;
    --color-text-muted: #94a3b8;
    --color-border: rgba(124, 58, 237, 0.15);
    --color-card-bg: rgba(124, 58, 237, 0.05);
    --color-gold-gradient: linear-gradient(to right, #fbbf24, #f59e0b);
    --color-purple-gradient: linear-gradient(135deg, #7c3aed, #6d28d9);

    /* Keep existing pillar colors */
  }

  [data-theme="dark"] {
    --color-bg-primary: #0f0a1e;
    --color-bg-surface: #1a1145;
    --color-bg-elevated: #231b4d;
    --color-primary: #a78bfa;
    --color-primary-hover: #8b5cf6;
    --color-secondary: #fbbf24;
    --color-secondary-hover: #f59e0b;
    --color-accent: #c4b5fd;
    --color-text-primary: #e2e8f0;
    --color-text-secondary: #94a3b8;
    --color-text-muted: #64748b;
    --color-border: rgba(124, 58, 237, 0.25);
    --color-card-bg: rgba(124, 58, 237, 0.1);
  }

  [data-theme="sattva"] {
    --color-bg-primary: #1a1025;
    --color-bg-surface: #231830;
    --color-bg-elevated: #2d2040;
    --color-primary: #c4b5fd;
    --color-primary-hover: #a78bfa;
    --color-secondary: #fcd34d;
    --color-text-primary: #e8dff5;
    --color-text-secondary: #a89bc4;
    --color-border: rgba(196, 181, 253, 0.15);
    --color-card-bg: rgba(196, 181, 253, 0.08);
  }
}
```

- [ ] **Step 2: Add sacred geometry and glassmorphism utility classes**

Add to globals.css:

```css
/* Sacred geometry background */
.sacred-geometry-bg {
  background-image: url("data:image/svg+xml,..."); /* Sri Yantra SVG pattern */
  background-size: 400px;
  background-repeat: repeat;
  opacity: 0.03;
}

/* Enhanced glassmorphism */
.glass-card {
  background: var(--color-card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  border-radius: 16px;
}

.glass-card:hover {
  border-color: rgba(124, 58, 237, 0.3);
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.1);
}

/* Gold gradient text */
.text-gold-gradient {
  background: var(--color-gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Purple gradient text */
.text-purple-gradient {
  background: var(--color-purple-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

- [ ] **Step 3: Verify theme renders correctly**

Run: `npm run dev`
Check the app in browser — existing pages should still work with updated colors.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add purple/gold mystical theme with dark and sattva mode CSS variables"
```

---

### Task 2: Theme Provider & Dark Mode Toggle

**Files:**
- Create: `src/lib/theme.ts`
- Create: `src/components/ui/theme-toggle.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/header.tsx`

- [ ] **Step 1: Create theme utility**

Create `src/lib/theme.ts`:

```typescript
"use client";

const THEME_KEY = "vedic-theme";

export type Theme = "light" | "dark" | "sattva";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem(THEME_KEY) as Theme) || "light";
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function getDefaultSunsetHour(): number {
  // Simple timezone-based sunset approximation
  // Returns hour (18 = 6 PM) — conservative default
  return 18;
}

export function shouldAutoSattva(): boolean {
  const hour = new Date().getHours();
  return hour >= getDefaultSunsetHour() || hour < 5;
}
```

- [ ] **Step 2: Create ThemeToggle component**

Create `src/components/ui/theme-toggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Sunset } from "lucide-react";
import { getStoredTheme, setTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = getStoredTheme();
    setCurrentTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "sattva"];
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    const next = themes[nextIndex];
    setTheme(next);
    setCurrentTheme(next);
  };

  const Icon = currentTheme === "dark" ? Moon : currentTheme === "sattva" ? Sunset : Sun;

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-xl hover:bg-[var(--color-card-bg)] transition-colors"
      title={`Theme: ${currentTheme}`}
    >
      <Icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
    </button>
  );
}
```

- [ ] **Step 3: Add ThemeToggle to header**

In `src/components/layout/header.tsx`, import and add `<ThemeToggle />` next to the profile section in the header bar.

- [ ] **Step 4: Add theme initialization script to root layout**

In `src/app/layout.tsx`, add an inline script in `<head>` to prevent flash of wrong theme:

```tsx
<script dangerouslySetInnerHTML={{
  __html: `(function(){try{var t=localStorage.getItem('vedic-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
}} />
```

- [ ] **Step 5: Test theme toggle**

Run `npm run dev`, click the theme toggle in header. Verify light → dark → sattva cycling works.

- [ ] **Step 6: Commit**

```bash
git add src/lib/theme.ts src/components/ui/theme-toggle.tsx src/components/layout/header.tsx src/app/layout.tsx
git commit -m "feat: add dark mode and sattva night mode with theme toggle"
```

---

### Task 3: Update Existing Components to Use Theme Variables

**Files:**
- Modify: `src/components/ui/card.tsx`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/layout/sidebar.tsx`
- Modify: `src/components/layout/mobile-nav.tsx`
- Modify: `src/app/(main)/layout.tsx`

- [ ] **Step 1: Update Card component to use CSS variables**

Update `src/components/ui/card.tsx` — replace hardcoded `bg-white`, `border-gray-*`, `text-gray-*` classes with CSS variable-based classes or inline styles using `var(--color-*)`.

- [ ] **Step 2: Update Button component primary variant**

Update `src/components/ui/button.tsx` — change primary variant from amber/orange gradient to purple gradient. Keep other variants.

- [ ] **Step 3: Update Sidebar colors**

Update `src/components/layout/sidebar.tsx` — change `bg-white`, `border-amber-*`, `text-amber-*` to use purple/gold theme. Active state: purple gradient instead of amber.

- [ ] **Step 4: Update Mobile Nav colors**

Update `src/components/layout/mobile-nav.tsx` — change `text-amber-*` active states to purple theme.

- [ ] **Step 5: Update main layout background**

Update `src/app/(main)/layout.tsx` — change `bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50` to `bg-[var(--color-bg-primary)]`.

- [ ] **Step 6: Test all existing pages with new theme**

Run `npm run dev`, navigate through Dashboard, Pillars, Progress, Journal, Goals, Settings. Verify all pages render correctly in light and dark modes.

- [ ] **Step 7: Commit**

```bash
git add src/components/ src/app/\(main\)/layout.tsx
git commit -m "feat: update existing components to use purple/gold theme variables"
```

---

## Chunk 2: Public Layout & Essential Pages (Tasks 4-8)

### Task 4: Public Layout — Navbar & Footer Components

**Files:**
- Create: `src/components/layout/public-navbar.tsx`
- Create: `src/components/layout/public-footer.tsx`
- Create: `src/app/(public)/layout.tsx`

- [ ] **Step 1: Create public navbar component**

Create `src/components/layout/public-navbar.tsx` — sticky navbar with:
- Logo (🕉 10X Vedic)
- Nav links: Home, About, Pillars Overview, How It Works, Blog, Contact, FAQ
- Login (outline button) and "Start Free" (purple gradient button)
- Mobile hamburger menu with slide-out panel
- Glassmorphism blur background
- Uses Framer Motion for mobile menu animation

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Pillars", href: "/pillars-overview" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
  { name: "FAQ", href: "/faq" },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-bg-primary)]/80 border-b border-[var(--color-border)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.jpg" alt="10X Vedic" width={36} height={36} className="rounded-xl" />
          <span className="font-bold text-lg text-gold-gradient">10X Vedic</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium rounded-xl border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-card-bg)] transition-colors">
            Login
          </Link>
          <Link href="/register" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors">
            Start Free
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-[var(--color-border)]"
          >
            <div className="px-4 py-4 space-y-2 bg-[var(--color-bg-surface)]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-card-bg)]"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="flex-1 text-center px-4 py-2 text-sm rounded-xl border border-[var(--color-primary)] text-[var(--color-primary)]">Login</Link>
                <Link href="/register" className="flex-1 text-center px-4 py-2 text-sm rounded-xl bg-[var(--color-primary)] text-white">Start Free</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
```

- [ ] **Step 2: Create public footer component**

Create `src/components/layout/public-footer.tsx` — 4-column footer with links, social, copyright. Import `siteConfig` for social URLs.

- [ ] **Step 3: Create public route group layout**

Create `src/app/(public)/layout.tsx`:

```tsx
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
```

- [ ] **Step 4: Verify layout renders**

Run `npm run dev`. The public layout won't have pages yet but verify no build errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/public-navbar.tsx src/components/layout/public-footer.tsx src/app/\(public\)/layout.tsx
git commit -m "feat: add public layout with navbar and footer components"
```

---

### Task 5: Data Files — Testimonials, FAQ, Blog, Team, Content Library, Daily Wisdom

**Files:**
- Create: `src/data/testimonials.ts`
- Create: `src/data/faq.ts`
- Create: `src/data/blog-posts.ts`
- Create: `src/data/team.ts`
- Create: `src/data/content-library.ts`
- Create: `src/data/daily-wisdom.ts`

- [ ] **Step 1: Create testimonials data**

Create `src/data/testimonials.ts` with 6 sample testimonials — name, quote, rating (1-5), dayCompleted, topPillars array.

- [ ] **Step 2: Create FAQ data**

Create `src/data/faq.ts` with 16 FAQ entries across 4 categories: "Getting Started", "Journey & Pillars", "Account", "Technical". Each entry: question, answer (string, can include HTML), category.

- [ ] **Step 3: Create blog posts data**

Create `src/data/blog-posts.ts` with 6 initial articles:
1. "The Science Behind 48-Day Habit Formation" (Science)
2. "Pranayama: The Art of Vedic Breathing" (Mind)
3. "5 AM Routine: Transform Your Mornings" (Body)
4. "Sattvic Nutrition for Modern Living" (Body)
5. "Understanding the 11 Pillars of Transformation" (Spirit)
6. "Gratitude Practice: Rewiring Your Brain" (Mind)

Each entry: slug, title, excerpt, content (markdown string), category, readTime, date, author.

- [ ] **Step 4: Create team data**

Create `src/data/team.ts` with placeholder founder entry — name, role, bio, avatar placeholder.

- [ ] **Step 5: Create content library data**

Create `src/data/content-library.ts` with 11 entries (one per pillar) — id, title, type (video/audio/article/guide), pillarSlug, duration, url (YouTube or placeholder), thumbnail, description.

- [ ] **Step 6: Create daily wisdom data**

Create `src/data/daily-wisdom.ts` with 60 entries — text, source, category (vedic/philosophical/scientific), sanskrit (optional).

- [ ] **Step 7: Commit**

```bash
git add src/data/
git commit -m "feat: add data files for testimonials, FAQ, blog, team, content library, daily wisdom"
```

---

### Task 6: Enhanced Landing Page

**Files:**
- Modify: `src/app/page.tsx` (complete rewrite)

- [ ] **Step 1: Rewrite landing page**

Rewrite `src/app/page.tsx` with all 10 sections as specified in the design spec (A1):
1. Import `PublicNavbar` and `PublicFooter` (landing page is NOT in `(public)` route group but uses same components)
2. Hero section with YouTube embed (from `siteConfig`)
3. Stats bar with animated counters
4. How It Works 4-step flow
5. 11 Pillars grid (import `PILLARS` from constants)
6. Benefits grid
7. Testimonials carousel (import from data, use Framer Motion)
8. FAQ preview accordion (import first 4 from data)
9. CTA section
10. Uses dark gradient background throughout

- [ ] **Step 2: Test landing page**

Run `npm run dev`, visit `http://localhost:3000`. Verify all sections render, video embed works, responsive on mobile.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redesign landing page with purple/gold mystical theme and all sections"
```

---

### Task 7: About, How It Works, Pillars Overview Pages

**Files:**
- Create: `src/app/(public)/about/page.tsx`
- Create: `src/app/(public)/how-it-works/page.tsx`
- Create: `src/app/(public)/pillars-overview/page.tsx`

- [ ] **Step 1: Create About page**

Create `src/app/(public)/about/page.tsx` with sections: Hero, Mission & Vision, The Science of 48-Day Mandala, Founder/Team section (import from `src/data/team.ts`), CTA.

- [ ] **Step 2: Create How It Works page**

Create `src/app/(public)/how-it-works/page.tsx` with sections: Hero, 5-step vertical timeline (animated with Framer Motion), Daily Routine Breakdown, Pillar Categories, Requirements, CTA.

- [ ] **Step 3: Create Pillars Overview page**

Create `src/app/(public)/pillars-overview/page.tsx` — import `PILLARS` from constants. Show category filter tabs (All/Body/Mind/Spirit), expandable pillar cards with Sanskrit name, duration, description, benefits. Client component for filter state.

- [ ] **Step 4: Test all three pages**

Visit `/about`, `/how-it-works`, `/pillars-overview`. Verify public layout (navbar/footer) wraps correctly. Test responsive.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/about/ src/app/\(public\)/how-it-works/ src/app/\(public\)/pillars-overview/
git commit -m "feat: add About, How It Works, and Pillars Overview public pages"
```

---

### Task 8: Testimonials, Blog, Contact, FAQ, Privacy, Terms Pages

**Files:**
- Create: `src/app/(public)/testimonials/page.tsx`
- Create: `src/app/(public)/blog/page.tsx`
- Create: `src/app/(public)/blog/[slug]/page.tsx`
- Create: `src/app/(public)/contact/page.tsx`
- Create: `src/app/(public)/contact/actions.ts`
- Create: `src/app/(public)/faq/page.tsx`
- Create: `src/app/(public)/privacy/page.tsx`
- Create: `src/app/(public)/terms/page.tsx`

- [ ] **Step 1: Create Testimonials page**

Testimonials grid with star ratings, quotes, video embeds section. Import from `src/data/testimonials.ts`.

- [ ] **Step 2: Create Blog list page**

Blog grid with category filter, featured article card, article cards. Import from `src/data/blog-posts.ts`. Client component for filter.

- [ ] **Step 3: Create Blog article page**

Dynamic route `[slug]` — find post by slug, render markdown content, share buttons, related articles.

- [ ] **Step 4: Create Contact page**

Two-column layout: contact form (server action sends email via existing email provider) + contact info. Create `actions.ts` with server action for form submission.

- [ ] **Step 5: Create FAQ page**

Search bar + category tabs + accordion list. Import from `src/data/faq.ts`. Client component for search/filter.

- [ ] **Step 6: Create Privacy Policy page**

Static legal content page with proper sections as specified in design spec (A9).

- [ ] **Step 7: Create Terms of Service page**

Static legal content page with proper sections as specified in design spec (A10).

- [ ] **Step 8: Test all pages**

Visit all new routes. Verify public layout wraps each. Test blog slug routing. Test contact form submission.

- [ ] **Step 9: Commit**

```bash
git add src/app/\(public\)/
git commit -m "feat: add Testimonials, Blog, Contact, FAQ, Privacy, Terms public pages"
```

---

## Chunk 3: Database Updates & App Pages (Tasks 9-14)

### Task 9: Prisma Schema Updates & Badge Seeding

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Add new models to Prisma schema**

Add to `prisma/schema.prisma`:

```prisma
model ContentProgress {
  id             String   @id @default(cuid())
  userId         String
  contentId      String
  completed      Boolean  @default(false)
  progress       Int      @default(0)
  lastAccessedAt DateTime @default(now())
  user           User     @relation(fields: [userId], references: [id])
  @@unique([userId, contentId])
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  title     String
  message   String
  isRead    Boolean  @default(false)
  actionUrl String?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

Add `sleepQuality Int?` to the `MoodLog` model.

Add reverse relations to `User` model:
```prisma
contentProgress ContentProgress[]
notifications   Notification[]
```

- [ ] **Step 2: Push schema changes**

Run: `npx prisma db push`
Expected: Schema synced successfully.

- [ ] **Step 3: Update seed file with additional badges**

Update `prisma/seed.ts` — add 15 badge definitions as specified in the design spec (streak badges, mastery badges, milestone badges, special badges). Each with name, slug, description, requirement JSON.

- [ ] **Step 4: Run seed**

Run: `npx prisma db seed`
Expected: Badges created successfully.

- [ ] **Step 5: Generate Prisma client**

Run: `npx prisma generate`

- [ ] **Step 6: Commit**

```bash
git add prisma/
git commit -m "feat: add ContentProgress, Notification models, sleepQuality field, and seed 15 new badges"
```

---

### Task 10: Update Middleware & Site Config

**Files:**
- Modify: `src/middleware.ts`
- Modify: `src/config/site.config.ts`

- [ ] **Step 1: Add new protected routes to middleware**

Add `/library`, `/sessions`, `/wisdom`, `/mood`, `/achievements` to `protectedRoutes` array in `src/middleware.ts`.

- [ ] **Step 2: Update site config with social links**

Add Instagram and Twitter placeholders to `social` config in `src/config/site.config.ts`:

```typescript
social: {
  youtube: "https://www.youtube.com/@vedic-s",
  instagram: "",
  twitter: "",
}
```

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts src/config/site.config.ts
git commit -m "feat: add new protected routes and social link config"
```

---

### Task 11: Content Library Page

**Files:**
- Create: `src/app/(main)/library/page.tsx`
- Create: `src/app/(main)/library/library-client.tsx`
- Create: `src/app/api/content-progress/route.ts`

- [ ] **Step 1: Create library client component**

Create `src/app/(main)/library/library-client.tsx` — client component with:
- Search bar for filtering content
- Category tabs: All / Body / Mind / Spirit / Favorites
- Content card grid: thumbnail, title, type badge, duration, pillar, completion status, bookmark toggle
- Clicking a card opens the content (YouTube embed or PDF link)
- Uses TanStack React Query to fetch/update content progress

- [ ] **Step 2: Create library server page**

Create `src/app/(main)/library/page.tsx` — server component that:
- Calls `requireAuth()`
- Fetches user's `ContentProgress` records from DB
- Passes initial data to `LibraryPageClient`

- [ ] **Step 3: Create content progress API route**

Create `src/app/api/content-progress/route.ts`:
- `GET` — fetch user's content progress
- `POST` — create/update content progress (mark as viewed, update percentage)

- [ ] **Step 4: Test content library**

Visit `/library`. Verify content cards render, category filter works, clicking a card shows content.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(main\)/library/ src/app/api/content-progress/
git commit -m "feat: add content library page with progress tracking"
```

---

### Task 12: Guided Sessions Page

**Files:**
- Create: `src/app/(main)/sessions/page.tsx`
- Create: `src/components/features/sessions/morning-routine.tsx`
- Create: `src/components/features/sessions/meditation-timer.tsx`
- Create: `src/components/features/sessions/breathing-patterns.tsx`
- Create: `src/components/features/sessions/fasting-timer.tsx`
- Create: `src/components/features/sessions/movement-timer.tsx`

- [ ] **Step 1: Create meditation timer component**

Configurable timer with: duration selector (5/10/15/20/30 min), start/pause/reset, circular progress ring, session complete chime (use Web Audio API), elapsed/remaining display.

- [ ] **Step 2: Create breathing patterns component**

Enhance existing `breathing-visualizer.tsx` pattern. Add 4 patterns:
- 4:6 Basic (existing)
- 4:7:8 Relaxing
- Box Breathing 4:4:4:4
- Custom (user-defined)

Pattern selector at top. Animated circle with expand/contract. Cycle counter.

- [ ] **Step 3: Create morning routine component**

Step-by-step guided flow matching Vedic1.txt Step 1:
- Wake Up (calming animation)
- Hydrate (reminder card)
- Breathwork (embed breathing visualizer, 4:6 pattern, 2-5 min)
- Awareness (1-2 min timer)
- Gratitude (3 text inputs)
- Manifestation (2 min visualization timer)
- Progress bar across top. Next/back buttons.

- [ ] **Step 4: Create fasting timer component**

16:8 intermittent fasting tracker: start/stop button, circular countdown ring showing eating/fasting window, current state (Eating/Fasting), history of past fasts (localStorage).

- [ ] **Step 5: Create movement timer component**

Exercise session timer: configurable intervals (e.g., 30s exercise / 10s rest), round counter, exercise name display, start/pause/reset.

- [ ] **Step 6: Create sessions page**

Create `src/app/(main)/sessions/page.tsx` — tab-based layout showing all 5 session types. Each tab renders the corresponding component.

- [ ] **Step 7: Test all session types**

Visit `/sessions`. Test each timer, breathing pattern, morning routine flow. Verify animations are smooth.

- [ ] **Step 8: Commit**

```bash
git add src/app/\(main\)/sessions/ src/components/features/sessions/
git commit -m "feat: add guided sessions page with morning routine, meditation, breathing, fasting, movement timers"
```

---

### Task 13: Daily Wisdom, Mood Tracker, Achievements Pages

**Files:**
- Create: `src/app/(main)/wisdom/page.tsx`
- Create: `src/app/(main)/mood/page.tsx`
- Create: `src/app/(main)/mood/mood-client.tsx`
- Create: `src/app/api/mood/route.ts`
- Create: `src/app/(main)/achievements/page.tsx`

- [ ] **Step 1: Create Daily Wisdom page**

Create `src/app/(main)/wisdom/page.tsx`:
- Import daily wisdom data, calculate today's index from day-of-year
- Display today's quote in a styled card with sacred geometry background
- Source attribution
- Bookmark toggle (localStorage)
- "Share" button placeholder (html-to-image can be added later)
- History section showing past 7 days of wisdom

- [ ] **Step 2: Create Mood Tracker client component**

Create `src/app/(main)/mood/mood-client.tsx` — client component:
- Daily check-in form: mood (5 emoji buttons), energy (1-5 battery), stress (1-5 colored scale), sleep quality (1-5 moon icons), optional note
- Submit via API route
- Analytics section: 48-day trend line chart (Recharts), weekly averages, best/worst days
- Uses TanStack React Query for data fetching

- [ ] **Step 3: Create Mood API route**

Create `src/app/api/mood/route.ts`:
- `GET` — fetch user's mood logs (supports date range query params)
- `POST` — create today's mood entry (upsert by date)

- [ ] **Step 4: Create Mood server page**

Create `src/app/(main)/mood/page.tsx` — server component, calls `requireAuth()`, fetches initial mood data, passes to client.

- [ ] **Step 5: Create Achievements page**

Create `src/app/(main)/achievements/page.tsx` — server component:
- Fetch all badges + user's earned badges from DB
- Summary stats: earned / total, karma points
- Badge grid organized by category (Streak, Mastery, Milestone, Special)
- Earned badges: full color + earned date
- Unearned badges: greyed out with progress indicator
- Journey certificate preview at bottom (link to `/reports` for full certificate)

- [ ] **Step 6: Test all three pages**

Visit `/wisdom`, `/mood`, `/achievements`. Test mood check-in submission. Verify badge display.

- [ ] **Step 7: Commit**

```bash
git add src/app/\(main\)/wisdom/ src/app/\(main\)/mood/ src/app/api/mood/ src/app/\(main\)/achievements/
git commit -m "feat: add Daily Wisdom, Mood Tracker, and Achievements pages"
```

---

### Task 14: Notification Center & Navigation Updates

**Files:**
- Create: `src/components/features/notifications/notification-center.tsx`
- Create: `src/app/api/notifications/route.ts`
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/layout/sidebar.tsx`
- Modify: `src/components/layout/mobile-nav.tsx`

- [ ] **Step 1: Create Notification API route**

Create `src/app/api/notifications/route.ts`:
- `GET` — fetch user's recent notifications (last 20, ordered by createdAt desc)
- `PATCH` — mark notification(s) as read (accept id or "all")

- [ ] **Step 2: Create NotificationCenter component**

Create `src/components/features/notifications/notification-center.tsx`:
- Bell icon with unread count badge (red dot)
- Click opens dropdown panel (Framer Motion slide-down)
- List of notifications with icon per type, title, time ago, read/unread styling
- "Mark all read" button
- Empty state: "No notifications yet"
- Uses TanStack React Query with polling (every 60s)

- [ ] **Step 3: Add NotificationCenter to header**

In `src/components/layout/header.tsx`, add `<NotificationCenter />` next to `<ThemeToggle />`.

- [ ] **Step 4: Update Sidebar navigation**

Update `src/components/layout/sidebar.tsx`:

Primary nav: Dashboard, Pillars, Sessions *(new)*, Goals, Progress, Journal

Tools section: Library *(new)*, Wisdom *(new)*, Mood *(new)*, Achievements *(new)*, Insights, Reports, Reminders, Settings

- [ ] **Step 5: Update Mobile Nav**

Update `src/components/layout/mobile-nav.tsx`:

Bottom bar: Home, Pillars, Sessions *(new)*, Progress, More

More menu: Goals, Journal, Library, Wisdom, Mood, Achievements, Insights, Reports, Reminders, Settings

- [ ] **Step 6: Test navigation**

Run `npm run dev`. Verify all new sidebar links navigate correctly. Verify mobile nav "More" menu shows all items. Test notification bell dropdown.

- [ ] **Step 7: Commit**

```bash
git add src/components/features/notifications/ src/app/api/notifications/ src/components/layout/
git commit -m "feat: add notification center and update sidebar/mobile navigation with all new pages"
```

---

## Chunk 4: Platform-Wide Enhancements (Tasks 15-18)

### Task 15: Google Analytics & Cookie Consent

**Files:**
- Create: `src/components/ui/cookie-consent.tsx`
- Create: `src/components/ui/analytics.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Analytics component**

Create `src/components/ui/analytics.tsx` — client component that:
- Checks if consent is given (read cookie)
- If consented, loads GA4 script via `next/script`
- Uses env var `NEXT_PUBLIC_GA_MEASUREMENT_ID`

- [ ] **Step 2: Create Cookie Consent banner**

Create `src/components/ui/cookie-consent.tsx` — client component:
- Bottom banner with Framer Motion slide-up
- Message: "We use cookies to enhance your experience"
- Buttons: "Accept All" | "Necessary Only"
- Stores preference in cookie (`vedic-cookie-consent`)
- Only shows if no preference stored

- [ ] **Step 3: Add to root layout**

In `src/app/layout.tsx`, add `<Analytics />` and `<CookieConsent />` at the end of `<body>`.

- [ ] **Step 4: Add env variable**

Add `NEXT_PUBLIC_GA_MEASUREMENT_ID=` to `.env` (empty — fill in when GA4 is set up).

- [ ] **Step 5: Test**

Verify cookie banner appears on first visit. Accept → banner disappears. Refresh → banner stays hidden.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/cookie-consent.tsx src/components/ui/analytics.tsx src/app/layout.tsx .env
git commit -m "feat: add Google Analytics integration with GDPR cookie consent banner"
```

---

### Task 16: SEO & Meta Tags

**Files:**
- Modify: `src/app/layout.tsx` (root metadata)
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: Each public page to add `metadata` export

- [ ] **Step 1: Update root layout metadata**

In `src/app/layout.tsx`, update the `metadata` export:

```typescript
export const metadata: Metadata = {
  title: {
    default: "10X Vedic — 48-Day Vedic Transformation",
    template: "%s | 10X Vedic",
  },
  description: "Transform yourself in 48 days with ancient Vedic wisdom and modern science. 11 pillars for body, mind, and spirit alignment.",
  keywords: ["vedic transformation", "meditation", "48 day challenge", "spiritual growth", "pranayama", "yoga"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://10x.vedics.net",
    siteName: "10X Vedic",
    title: "10X Vedic — 48-Day Vedic Transformation",
    description: "Transform yourself in 48 days with ancient Vedic wisdom and modern science.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "10X Vedic — 48-Day Vedic Transformation",
    description: "Transform yourself in 48 days with ancient Vedic wisdom and modern science.",
  },
};
```

- [ ] **Step 2: Add per-page metadata**

Add `export const metadata` to each public page with unique title and description:
- About: "About Us | 10X Vedic"
- How It Works: "How It Works | 10X Vedic"
- Pillars Overview: "11 Pillars of Transformation | 10X Vedic"
- Blog: "Blog — Vedic Wisdom & Insights | 10X Vedic"
- Contact: "Contact Us | 10X Vedic"
- FAQ: "FAQ — Help Center | 10X Vedic"
- Privacy: "Privacy Policy | 10X Vedic"
- Terms: "Terms of Service | 10X Vedic"
- Testimonials: "Transformation Stories | 10X Vedic"

- [ ] **Step 3: Create sitemap.ts**

Create `src/app/sitemap.ts`:

```typescript
import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "", "/about", "/how-it-works", "/pillars-overview",
    "/testimonials", "/blog", "/contact", "/faq", "/privacy", "/terms",
  ].map((route) => ({
    url: `https://10x.vedics.net${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `https://10x.vedics.net/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
```

- [ ] **Step 4: Create robots.ts**

Create `src/app/robots.ts`:

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/pillars", "/progress", "/journal"] },
    sitemap: "https://10x.vedics.net/sitemap.xml",
  };
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/sitemap.ts src/app/robots.ts src/app/\(public\)/
git commit -m "feat: add SEO metadata, sitemap, and robots.txt for all pages"
```

---

### Task 17: Loading & Error States

**Files:**
- Create: `src/app/(public)/loading.tsx`
- Create: `src/app/(main)/loading.tsx`
- Create: `src/app/(public)/error.tsx`
- Create: `src/app/(main)/error.tsx`

- [ ] **Step 1: Create public loading skeleton**

Create `src/app/(public)/loading.tsx` — full page skeleton with pulsing blocks matching typical page layout.

- [ ] **Step 2: Create main app loading skeleton**

Create `src/app/(main)/loading.tsx` — skeleton matching dashboard-style layout (cards, grids).

- [ ] **Step 3: Create public error boundary**

Create `src/app/(public)/error.tsx` — "use client" error component with "Something went wrong" card and retry button.

- [ ] **Step 4: Create main app error boundary**

Create `src/app/(main)/error.tsx` — same pattern, styled for authenticated layout.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/loading.tsx src/app/\(public\)/error.tsx src/app/\(main\)/loading.tsx src/app/\(main\)/error.tsx
git commit -m "feat: add loading skeletons and error boundaries for public and main layouts"
```

---

### Task 18: PWA Setup

**Files:**
- Create: `public/manifest.json`
- Create: `public/icons/icon-192.png` (placeholder)
- Create: `public/icons/icon-512.png` (placeholder)
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create web app manifest**

Create `public/manifest.json`:

```json
{
  "name": "10X Vedic — 48-Day Transformation",
  "short_name": "10X Vedic",
  "description": "Transform yourself in 48 days with Vedic wisdom",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#0f0a1e",
  "theme_color": "#7c3aed",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 2: Create placeholder icons**

Create simple placeholder PNG icons (solid purple square with "🕉") at 192x192 and 512x512. These can be replaced with proper icons later.

- [ ] **Step 3: Add manifest link to root layout**

In `src/app/layout.tsx`, add to metadata:

```typescript
manifest: "/manifest.json",
```

- [ ] **Step 4: Add .superpowers to .gitignore**

Add `.superpowers/` to `.gitignore` to exclude brainstorm files.

- [ ] **Step 5: Final build test**

Run: `npm run build`
Expected: Build succeeds with all new routes listed.

- [ ] **Step 6: Commit**

```bash
git add public/manifest.json public/icons/ src/app/layout.tsx .gitignore
git commit -m "feat: add PWA manifest and app icons for installable web app"
```

---

## Summary

| Chunk | Tasks | Features Covered |
|-------|-------|-----------------|
| 1: Theme & Dark Mode | 1-3 | C2 (Theme), C1 (Dark Mode) |
| 2: Public Layout & Pages | 4-8 | A1-A10 (All 10 public pages) |
| 3: DB & App Pages | 9-14 | B1-B6 (All 6 app pages), DB models |
| 4: Platform Enhancements | 15-18 | C3 (Analytics), C4 (SEO), C5 (PWA), Loading/Error states |

**Total: 18 tasks, 21 features**

After completing all tasks, the platform will have:
- 10 new public pages with mystical purple/gold theme
- 6 new authenticated app pages with interactive activities
- Dark mode + Sattva night mode
- Google Analytics with cookie consent
- Full SEO with sitemap
- PWA installable app
- Updated navigation across all layouts
