# 10X Vedic Transform — UI Kit (faithful to source)

Pixel-faithful recreation of **`cocreateceo/vedic_transform`** — the actual
Next.js + Tailwind + SST production codebase.

This kit was **rebuilt from the real source** after the original (dark
Cinzel-serif) direction was off. The visual language now matches the
deployed product:

- **Light cream theme** (`#FFFEF5` base, optional `data-theme="dark"` toggle)
- **Saffron + gold + goldenrod border** — gradient `#f97316 → #f59e0b` and
  signature `2px solid #DAA520` card borders
- **Inter** (sans-serif) — closest CDN match to the Geist Sans the real app
  ships with
- **Lucide React** icons — loaded from CDN, same set the real `sidebar.tsx`
  / `mobile-nav.tsx` import
- **16-item left sidebar** (6 primary + 10 tools) instead of 3

## What's inside

### Marketing (no shell)

| Route | Source mapping | What you see |
|---|---|---|
| `home` | `src/app/page.tsx` + `home-client.tsx` | Hero with shimmer headline + verse, stats strip, all-11 pillars grid, CTA banner. |
| `login` | `src/app/(auth)/login/page.tsx` | Tabbed login/signup card with social-auth stubs. |

### Authenticated app (sidebar + header shell)

Sidebar contains, in order: **logo · primary nav (6) · TOOLS divider ·
secondary nav (10) · Daily Wisdom card**. Active item = orange→amber gradient
with `shadow-orange-500/25`. Mobile bottom-nav appears below 1024px with the
4 most-used items + a "More" sheet.

| Route | Source mapping | Status |
|---|---|---|
| `dashboard` | `src/app/(main)/dashboard/page.tsx` | ✅ **Full faithful** — phase-tinted welcome banner with 48-segment Mandala ring SVG; Daily Brief; Today's Practice canonical action; Streak + Karma 2-up; all-11 pillar grid (each tile **deep-links to pillar detail**); focus pillar quick actions; Discover row. |
| `pillars` | `src/app/(main)/pillars/page.tsx` | ✅ **Full faithful** — Phase badge; Today's Progress bar; 3-tier layout (Active Today / Recommended for `<phase>` / Quietly Present). Cards now show the **pillar hero image** + Lucide icon + Sanskrit + karma. Click any card → detail page. |
| `pillars/<slug>` | `src/app/(main)/pillars/[pillarId]/pillar-detail-client.tsx` | ✅ **Full faithful** — 340px hero with real Pexels image + dark gradient veil; breadcrumb; Sanskrit eyebrow + title; description + meta pills; 5-step practice guide; side panel with stats + Begin Practice CTA (deep-links to right Sessions tab); "Your progress" mini-card; **Yoga Library** gallery (Movement pillar only); Related pillars. Valid slugs (see [Pillar slugs](#pillar-slugs) below): `morning-initiation`, `nutrition-fasting`, `thoughts-intention`, `breathing-meditation`, `movement`, `healing-meditation`, `gratitude`, `sandhya-meditation`, `brahman-connection`, `divine-manifestation`, `sleep-optimization`. |
| `progress` | `src/app/(main)/progress/page.tsx` | ✅ **Full faithful** — Consistency Score (with delta vs last week); Weekly Trend SVG chart; Pillar Strengths radar; 48-Day Heatmap with today outline; Pillar Consistency bars; Badges grid. |
| `sessions` | `src/app/(main)/sessions/page.tsx` + 5 timer components | ✅ **Full faithful (the big one)** — 5 tabs: <ul><li>**Morning Routine** — checklist of 7 Brahma Muhurta steps (wake / tongue scrape / warm water / sun salutation / pranayama / sandhya / sankalpa) with strikethrough on done</li><li>**Fasting** — eating-window selector (18:6 / 16:8 / 14:10 / 12:12) with circular gold ring + elapsed/remaining/start time</li><li>**Breathing** — animated 16-petal SVG lotus that opens on inhale, holds bloomed, closes on exhale. 3 patterns: 4:6 Basic, 4:7:8 Relaxing, 4:4:4:4 Box. Color shifts cyan→saffron→amber per phase.</li><li>**Movement** — sticky pose gallery (Surya Namaskar, Morning Stretch, Strength Flow, Outdoor Walk, Mindful Walk, Hourly Standing, Body Scan) with **real animated GIFs**; active pose hero; HIIT timer with Work/Rest/Rounds steppers + circular saffron→green progress + round indicators + Work/Rest phase color.</li><li>**Meditation** — sukhasana figure SVG with breathing animation (torso scales 1→1.04 every 8s, aura pulses in sync); 5/10/15/20/30 min duration buttons; circular saffron progress ring with timer; "Namaste · Session Complete" finale screen.</li></ul> |
| `journal` | `src/app/(main)/journal/page.tsx` | ✅ **Full faithful** — Gratitude triple-field, daily intention, manifestation board with achieved/active state, recent entries list. |
| `dosha-assessment` | `src/app/(main)/dosha-assessment/page.tsx` | ✅ **Full faithful** — multi-question Vata/Pitta/Kapha quiz with progress bar, result card with dosha breakdown + dosha-specific recommendations. |
| `goals` | `src/app/(main)/goals/page.tsx` | ✅ **Full faithful** — weekly focus pillar selector with target/progress sliders, pillar chips, weekly intention prompt. |
| `library` | `src/app/(main)/library/page.tsx` | ✅ **Full faithful** — 9 audio sessions (Om / Yoga Nidra / chakra healing / mantra / breathwork), category filter pills, play/pause cards with progress, sticky mini-player with goldenrod border. |
| `posters` | `src/app/(main)/posters/page.tsx` | ✅ **Full faithful** — downloadable transformation poster gallery with preview + download CTA. |
| `wisdom` | `src/app/(main)/wisdom/page.tsx` | ✅ **Full faithful** — daily wisdom card with verse + commentary, savable favorites, scripture filter chips. |
| `mood` | `src/app/(main)/mood/page.tsx` | ✅ **Full faithful** — mood/energy/stress/sleep sliders with emoji ladder, daily log history. |
| `achievements` | `src/app/(main)/achievements/page.tsx` | ✅ **Full faithful** — streak badges, karma rank, milestone trophies grid (locked/earned states). |
| `insights` | `src/app/(main)/insights/page.tsx` | ✅ **Full faithful** — AI-generated pattern cards with recommendation pills. |
| `reports` | `src/app/(main)/reports/page.tsx` | ✅ **Full faithful** — weekly + monthly reflection summaries with consistency stats. |
| `reminders` | `src/app/(main)/reminders/page.tsx` | ✅ **Full faithful** — 10X daily nudge times with per-pillar enable toggles. |
| `settings` | `src/app/(main)/settings/page.tsx` | ✅ **Full faithful** — profile, theme toggle (light / dark / sattva), notifications, language (6), subscription tier. |

### Floating chat
`Vedic Wisdom Guide` — bottom-right sparkles FAB, present on every screen.
Scripted replies for dosha, pranayama, ayurveda, and the 48-day mandala.

### Extras (beyond the sidebar)

| Component | What it is |
|---|---|
| `OnboardingFlow` (4 steps) | Welcome → goal-picker → 3-pillar focus → name confirm; deep-links to dashboard on finish. Reachable via signup. |
| `NotFoundPage` | Branded 404 for unknown routes. |
| `CommandPalette` | ⌘K spotlight-style route switcher with Lucide icons (toggleable from any screen). Production equivalent at `src/components/layout/command-palette.tsx`, mounted in `src/app/(main)/layout.tsx` — groups commands into Navigate / Sessions / Settings, with deep-links into each Sessions tab. |
| `LoadingSkeleton` / `EmptyState` | Shared shimmer + empty primitives reused across Journal, Library, Mood, etc. |
| `StreakShield` / `AvatarUploader` / `PhaseReflectionCard` | Polish components surfaced inside Dashboard / Settings. |

### Pillar slugs

Pillar detail routes use **English-kebab slugs** — *not* the Sanskrit names.
Source of truth: `PillarData.jsx` (mirrors `src/constants/pillars.ts`).
Deep-linking with the Sanskrit name (e.g. `pillars/pranayama`) renders the
"Pillar not found" fallback.

| # | Slug | English name | Sanskrit | Icon | Color |
|---|---|---|---|---|---|
| 1  | `morning-initiation`    | 5 AM Initiation              | Brahma Muhurta     | `sunrise`          | `#FFD700` |
| 2  | `nutrition-fasting`     | Vedic Nutrition + Fasting    | Ahara Vidhi        | `utensils`         | `#4CAF50` |
| 3  | `thoughts-intention`    | Thoughts & Intention Reset   | Sankalpa           | `brain`            | `#9C27B0` |
| 4  | `breathing-meditation`  | Breathing + Meditation       | Pranayama          | `wind`             | `#00BCD4` |
| 5  | `movement`              | Movement Everyday            | Vyayama            | `person-standing`  | `#FF5722` |
| 6  | `healing-meditation`    | Healing Meditation           | Dhyana             | `heart`            | `#E91E63` |
| 7  | `gratitude`             | Gratitude Practice           | Kritajnata         | `hand-heart`       | `#8BC34A` |
| 8  | `sandhya-meditation`    | Sandhya Meditation           | Sandhyavandana     | `sun`              | `#FFC107` |
| 9  | `brahman-connection`    | Connection to Brahman        | Brahma Sambandha   | `infinity`         | `#673AB7` |
| 10 | `divine-manifestation`  | Divine Manifestation         | Sankalpa Shakti    | `sparkles`         | `#A855F7` |
| 11 | `sleep-optimization`    | Sleep Optimization           | Nidra              | `moon`             | `#3F51B5` |

## Click-thru flow

1. **Home** → click `Start Free` (top right) or `Begin Your Journey` → **Dashboard**.
2. **Sidebar** → click any item to navigate. Try **Pillars** → **Progress** →
   any Tools item (Library, Mood, Settings, etc. — all fully built).
   From the Pillars list, click a tile to deep-link to `pillars/<slug>`.
3. **Profile menu** (top right of header) → `Sign out` returns to home.
4. **Floating sparkles button** opens the AI chatbot.

## Files

```
ui_kits/10x_transform/
├── index.html              ← React + Babel + Lucide-CDN entry; routes incl. pillars/<slug>
├── globals.css             ← mirrors src/app/globals.css (tokens + utilities)
├── styles.css              ← layout + screens (sidebar, header, sessions stage, breathing lotus, movement gallery, pillar hero)
├── Primitives.jsx          ← LucideIcon, Button, Card, CardContent, PillBadge, Eyebrow
├── PillarData.jsx          ← PILLARS[11] (now with image + practice fields) + PHASES[6] + getJourneyPhase
├── Sidebar.jsx             ← Sidebar (16 items) + AppHeader + MobileNav
├── Dashboard.jsx           ← DashboardPage + MandalaRing + StreakCounter + KarmaPoints + PillarGrid + DiscoverRow
├── PillarsPage.jsx         ← 3-tier layout + PillarCardRich (with hero strip) + TierSection
├── PillarDetailPage.jsx    ← Hero + practice guide + side stats + Yoga Library (movement) + related
├── ProgressPage.jsx        ← ConsistencyScore + WeeklyTrendChart + PillarRadarChart + CalendarHeatmap + bars + badges
├── SessionsPage.jsx        ← 5 tabs: MorningRoutine · FastingTimer · BreathingPatterns + BreathingLotus · MovementTimer (yoga GIFs) · MeditationTimer + MeditationPosture
├── AppScreens2.jsx         ← JournalPage + DoshaAssessmentPage + GoalsPage
├── AppScreens3.jsx         ← LibraryPage + PostersPage + WisdomPage + MoodPage + AchievementsPage + InsightsPage + ReportsPage + RemindersPage + SettingsPage
├── MorePolish.jsx          ← OnboardingFlow + NotFoundPage + CommandPalette + LoadingSkeleton + EmptyState + StreakShield + AvatarUploader + PhaseReflectionCard
├── PillarAnimations.jsx    ← Per-pillar bespoke SVG/Lottie-style scenes (Brahma Muhurta sunrise, Sandhya, Sankalpa, Nidra, etc.)
├── SessionsExtended.jsx    ← Sandhya + Brahman + Manifestation + Sleep practice variants
├── MarketingAndStubs.jsx   ← PublicLanding + LoginPage (+ legacy StubScreen, no longer routed)
├── ChatBot.jsx             ← VedicWisdomGuide (light theme variant)
└── assets/
    ├── logo.jpg            ← imported from public/images/logo.jpg
    └── pexels/             ← 19 Pexels images (11 pillar JPGs + 8 posture GIFs/JPGs + home-hero)
```

## Tracing components back to source

| This kit | Real codebase |
|---|---|
| `Sidebar` | `src/components/layout/sidebar.tsx` (same nav arrays, same Lucide icon names) |
| `AppHeader` | `src/components/layout/header.tsx` |
| `MobileNav` | `src/components/layout/mobile-nav.tsx` |
| `PILLARS` | `src/constants/pillars.ts` (same 11 entries with sanskritName + bgColor + karma) |
| `getJourneyPhase` | `src/lib/journey-phases.ts` (paraphrased 6-phase mapping) |
| `MandalaRing` | `src/components/features/dashboard/mandala-progress.tsx` |
| `DashboardPage` banner | `src/app/(main)/dashboard/page.tsx` welcome banner |
| `PillarsPage` tiers | `src/app/(main)/pillars/page.tsx` + `src/lib/pillar-prioritization.ts` |
| `ConsistencyScore`, charts | `src/components/features/analytics/*` |

## What's intentionally simplified

- **No real data layer** — the source uses `apiFetch` against AWS Lambda + DynamoDB. This kit ships with a `MOCK_USER` constant (`Day 12, Pitta, 248 karma, 12-day streak`) so the UI has something to render. Swap `MOCK_USER` for live data when porting back.
- **Charts use inline SVG**, not recharts. Visual parity, no bundle.
- **Lucide is loaded as a UMD CDN** (`lucide@0.546.0`) instead of bundled `lucide-react`. Identical SVG output.
- **Inter** substitutes for **Geist Sans** (the real app's default). Same x-height + tone; flag if you need exact match.

## Caveats

- The kit reproduces the **light theme only**. Dark and Sattva tokens are
  defined in `globals.css` (`[data-theme="dark"]` / `[data-theme="sattva"]`)
  but the prototype boots in light mode. Add a real theme toggle if needed.
- **Audio cues stubbed.** The production app pre-records MP3s for inhale /
  exhale / hold / start / work / rest / midway / closing / chime. The kit
  exposes the mute/unmute button for visual fidelity but plays nothing.
- **`posture-surya-namaskar.gif` was too large to import** (5.8MB exceeded
  the cap) — the Surya Namaskar slot in YOGA_POSES now uses
  `posture-30min-movement.gif` (a different yoga-flow GIF from the same
  set). Swap back when you self-host.
- **Every sidebar route now ships with a real screen.** The old long-tail
  stubs (journal, dosha-assessment, library, posters, wisdom, mood,
  achievements, insights, reports, reminders, settings, goals) have been
  built out in `AppScreens2.jsx` + `AppScreens3.jsx`. They are not 1:1 with
  production but capture the layout, content, and interactions faithfully.
