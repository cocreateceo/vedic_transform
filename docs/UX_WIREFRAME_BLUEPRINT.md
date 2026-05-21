# 10X Vedic Transform — UX & Wireframe Blueprint

> Hand this to a design-focused LLM (or a human designer). It describes what the app IS, every screen that exists, every UX problem the current build has, and what a redesign should produce. No code in this doc — pure UX/IA/wireframe specification.

---

## 1. What the product is (plain language)

A 48-day Ayurvedic transformation program in a web app. The user picks 1–3 "focus pillars" out of 11 wellness practices (5 AM rising, breathing meditation, fasting, movement, gratitude, sleep, etc.) and does them daily for 48 days. Each completion earns "karma points" and builds a streak. There's also a free public dosha (Ayurvedic body type) test that doubles as a funnel into signup.

**Three surfaces today:** web app (primary), Expo mobile app (early), static landing page.

**Live at:** `https://10x.vedics.net`

## 2. The core daily loop (what SHOULD happen)

This is the single most important thing a user does. Today it spans 3 screens awkwardly. The redesign needs to make this **one screen, one CTA**.

```
1. Open app
2. See: "Today is Day 14 of 48. Your focus practice today is Pranayama (breathing)."
3. Tap ONE button: "Start 10-minute breathing"
4. Run the timer (~10 min)
5. See: "+15 karma. 7-day streak. See you tomorrow."
6. Done. Close app.
```

That's it. Everything else (Library, Wisdom, Achievements, Mood log, Journal, Progress charts) is **exploration**, not daily required. Right now the UI doesn't communicate this hierarchy.

## 3. User personas / lifecycle states

The product has six user states. Each one needs a different UI treatment:

| State | Identifying signal | Primary need |
|---|---|---|
| **Visitor** | No account, on marketing pages | Understand the value, take the dosha test |
| **Anon dosha taker** | Took the dosha test, no account | See result → CTA to sign up |
| **Registered** | Signed up, hasn't started a Journey | Pick focus pillars, start Day 1 |
| **New** | Day 1–3 of journey, sparse data | Build the habit. ONE clear action. |
| **Active** | Day 4–48, regular check-ins | Daily ritual UI, light celebration |
| **At-risk** | 1–2 days since last check-in | Gentle re-engagement, save the streak |
| **Dormant** | 3+ days since last check-in | Recovery copy, low-friction restart |
| **Completed** | Day 49+ or done | Reflection, achievement display, "start a new cycle" |

The visual treatment should subtly differ for each. Right now it doesn't.

## 4. The 11 Pillars (the product's spine)

Three categories. A user picks 1–3 of these as focus pillars during onboarding.

**Body (4):**
1. Morning Initiation — 5 AM rising (Brahma Muhurta)
2. Vedic Nutrition + Fasting — Sattvic diet, 16:8 IF
3. Movement Everyday — Yoga / walking / strength
4. Sleep Optimization

**Mind (4):**
5. Thoughts & Intention Reset — Sankalpa
6. Breathing + Meditation — Pranayama (4:6 etc.)
7. Healing Meditation — Dhyana
8. Gratitude Practice — Kritajnata

**Spirit (3):**
9. Sandhya Meditation — 3x daily nature alignment
10. Connection to Brahman — Consciousness practice
11. Divine Manifestation — Sankalpa Shakti

Each pillar has: a name, a Sanskrit name, a description, a color, an icon, a karma-points value (10–20), a default duration.

Of these 11, only 5 have an interactive timer/session in the app today (Morning Routine, Meditation, Breathing, Fasting, Movement). The other 6 are passive practices — user just taps "Mark complete" on the pillar detail page.

## 5. Every screen that currently exists

### Public / marketing
| Route | What's there |
|---|---|
| `/` | Landing page, hero, value prop, CTA to dosha test or signup |
| `/about` | About the program |
| `/how-it-works` | The 48-day method explained |
| `/pillars-overview` | All 11 pillars described |
| `/dosha-test` | Intro to the free dosha quiz |
| `/dosha-test/quiz` | 12+ question quiz |
| `/dosha-test/result/[id]` | Anonymous result page, shareable link (90-day TTL) |
| `/blog`, `/blog/[slug]` | Marketing blog |
| `/faq`, `/testimonials`, `/contact` | Standard marketing pages |
| `/privacy`, `/terms` | Legal |

### Auth
| Route | What's there |
|---|---|
| `/login` | Email/password + Google sign-in |
| `/register` | Sign up form |
| `/onboarding` | Multi-step welcome → pick focus pillars → start Day 1 |

### Main app (post-login)
| Route | What's there | Used in daily loop? |
|---|---|---|
| `/dashboard` | Welcome banner + Daily Brief + Today's Practice + Streak + Karma + Pillar Grid + Quick Actions + Discover | **Yes (primary)** |
| `/pillars` | List of all 11 pillars grouped by Body/Mind/Spirit, "x of 11 done today" | Sometimes |
| `/pillars/[pillarId]` | Pillar detail: description, "Mark complete" button, mood-before/after, notes | Sometimes |
| `/sessions` | 5 tabs: Morning Routine, Meditation, Breathing, Fasting, Movement (interactive timers) | **Yes** |
| `/goals` | Focus pillar picker (1–3) + weekly goal tasks | Setup only |
| `/journal` | Tabs: Gratitude / Intention / Manifestation entries | Daily writing ritual |
| `/mood` | Log today's mood/energy/stress/sleep; chart of past 30d | Daily |
| `/wisdom` | Today's Vedic quote + past 7 days | Glance only |
| `/library` | Long-form content (audio/reading) tracked by ContentProgress | Exploration |
| `/insights` | AI-computed insights list | Weekly |
| `/progress` | Charts: streak, pillar completion, karma over time | Weekly |
| `/reports` | Journey report / certificate | At Day 48 or weekly |
| `/achievements` | Badge collection | Occasional |
| `/reminders` | Notification time settings | Setup only |
| `/settings` | Profile, password, account | Rare |
| `/dosha-assessment` | Retake dosha quiz (authenticated version) | One-time |
| `/admin` | (admin-only) User search + Context Pack viewer | Admin only |
| `/posters` | Downloadable poster gallery | Marketing aid |

**That is 24 authenticated routes.** Way too many for a user to mentally model.

## 6. Current UX problems — call them out by name

These are the things any redesign MUST fix.

### 6.1 No clear "start here" on the dashboard
Dashboard has **8 stacked sections** (welcome banner, Daily Brief, Today's Practice, Streak Event Banner, Streak + Karma counters, Pillar Grid showing all 11, Quick Actions, Discover). A new user has no visual hierarchy telling them which to tap first. Even the developer (the user of this app) said "I'm confused."

### 6.2 Four surfaces all sound like "where I train"
- **Pillars** — list of 11. Tap to check in.
- **Sessions** — interactive timers (this is where the actual "doing" happens for 5 of 11).
- **Library** — content/audio progress.
- **Wisdom** — daily quotes.

A first-time user has no way to know which one is the daily action. They sound interchangeable. (And just now the developer admitted they confused Sessions with Library — if the builder can't keep them straight, neither can the user.)

### 6.3 The bridge from Dashboard → action → completion is now wired, but invisible

The dashboard CTA now correctly routes to the right Session tab and timers auto-record check-ins. But the user doesn't *see* the loop close. There's no visual continuity that says "you just did your practice, here's your reward." After timer completion, the user is stranded on the Sessions page with a "+15 karma" toast, then has to navigate back to the dashboard to see the journey progress update.

### 6.4 Pillars detail page exists for every pillar but is barely needed
The pillar detail page is mostly a "Mark complete" button + description. With the bridge in place, most pillars now route to Sessions instead. The pillar detail page should probably collapse into a richer pillar info screen (for reading about the practice), with the actual "do it" action handled elsewhere.

### 6.5 Onboarding ends in a vacuum
After picking focus pillars, the user is dropped on the dashboard. No tooltip, no "this is what you do tomorrow." First-day retention probably suffers.

### 6.6 Marketing site IA is fine, but the dosha test funnel is buried
The dosha test (the main lead-gen tool) is at `/dosha-test` — not prominent on the landing page hero. Should probably be the primary CTA.

### 6.7 No visual differentiation between user states
Active user, at-risk user, and brand-new user all see the same dashboard layout. The visual tone should shift: celebrate for active, gentle for at-risk, instructional for new.

### 6.8 24 routes, all in one flat sidebar
The sidebar mixes daily-critical (Dashboard, Sessions) with rare-use (Settings, Reminders) and exploration (Library, Wisdom, Posters). Needs grouping or progressive disclosure.

### 6.9 Mobile experience exists but is ~5 tabs vs 24 web routes
A native Expo app exists at `mobile/` with only 5 tabs (Home, Pillars, Sessions, Journal, More). Web and mobile don't have parity. The mobile IA is actually closer to what the web should be.

### 6.10 No empty-state design
A brand-new user with zero check-ins sees the same dashboard as a Day-40 user, just with empty fields. There's no warm "welcome, here's what tomorrow looks like" treatment.

## 7. Proposed Information Architecture

This is what I'd hand the design LLM as the target IA. It collapses 24 routes into a far smaller cognitive map.

### Primary navigation (always visible)
1. **Today** (replaces "Dashboard") — single daily surface. The ONE place users land. Shows the one action for today, with everything else collapsed.
2. **Practice** (replaces "Sessions" + "Pillars" merged) — all 11 pillars, with timers when available, descriptions when not. Tabs by Body / Mind / Spirit.
3. **Journal** — gratitude, intention, manifestation, and mood logs all unified here.
4. **Progress** — charts + reports + achievements + insights, unified.

### Profile menu (top-right or in "More")
- Settings
- Reminders
- Goals & focus pillars
- Dosha assessment (retake)
- Library
- Wisdom (daily quote)
- Logout

### Admin (only visible if role=admin)
- Admin console

### Removed from primary IA
- `/pillars` and `/pillars/[id]` → merged into `/practice`
- `/sessions` → merged into `/practice`
- `/wisdom`, `/library` → moved to profile menu (low-frequency)
- `/insights`, `/progress`, `/reports`, `/achievements` → merged into one `/progress`
- `/dosha-assessment`, `/reminders`, `/settings`, `/goals` → moved to profile menu
- `/posters` → marketing, not main app
- `/mood` → folded into `/journal` as a tab

**Net result: 4 primary destinations instead of 16. The cognitive load drops 4x.**

## 8. Wireframes — the critical screens

Layout intent in ASCII. The design LLM should produce polished mockups, but these capture the hierarchy.

### 8.1 Today (the new dashboard)

```
┌─────────────────────────────────────────────────────────────┐
│ ☰  10X Vedic           Day 14 / 48           🔥 7   ✨ 245 │ ← compact header
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Good morning, Gopinath.                                     │
│  Tuesday, May 20                                             │
│                                                              │
│  ┌───────────────────────────────────────────────────┐      │
│  │ ✨ Today's Brief                                  │      │ ← Daily Brief
│  │ Your sleep pillar after 4 days. Tonight, prio-   │      │   (AI or template)
│  │ ritize sleep over the late screen time.          │      │
│  └───────────────────────────────────────────────────┘      │
│                                                              │
│  ┌───────────────────────────────────────────────────┐      │
│  │                                                   │      │ ← THE ONE CTA
│  │       🧘    Today's Practice                      │      │   Big, central
│  │             Pranayama (Breathing)                 │      │   Visually dominant
│  │             10 minutes  •  +15 karma              │      │
│  │                                                   │      │
│  │      [  ▶  Start 10-minute breathing  →  ]       │      │
│  │                                                   │      │
│  │             Too busy? Try 3 minutes →             │      │
│  └───────────────────────────────────────────────────┘      │
│                                                              │
│  [ + Log mood ]   [ + Journal entry ]   [ + Mark another ]  │ ← secondary actions
│                                                              │
│  ▾ More for today                                            │ ← collapsed by default
│  ▾ This week's progress                                      │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Welcome banner: greeting + date only. NOT a giant gradient.
- Daily Brief: small, indigo, AI-personalized.
- Today's Practice: the visual anchor. Big card, generous whitespace, ONE primary CTA.
- Secondary actions: small chips. Tappable but not competing for visual attention.
- "More for today" and "This week's progress": collapsed. User can expand for streak counter, karma, pillar grid, all the existing widgets.

**State variations:**
- **New user (Day 1, 0 check-ins):** Today's Practice card becomes "Welcome — let's start with [first focus pillar]. Tap below to begin."
- **At-risk (1–2 days off):** Today's Practice card has amber tint + "Your 7-day streak is still yours. One pillar today saves it."
- **Dormant (3+ days off):** Practice card has neutral tone + "Welcome back. Start small — try 3 minutes."
- **Today complete:** Card flips to green + "You've done today. Mandala day complete." with a small "do another pillar" link.

### 8.2 Practice (replaces Pillars + Sessions)

```
┌─────────────────────────────────────────────────────────────┐
│ ☰  10X Vedic                                                 │
├─────────────────────────────────────────────────────────────┤
│  Practice                                                    │
│                                                              │
│  ┌────────────┬────────────┬────────────┐                   │
│  │ Body (4)   │ Mind (4)   │ Spirit (3) │                   │ ← category tabs
│  └────────────┴────────────┴────────────┘                   │
│                                                              │
│  Body                                                        │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │ 🌅  Morning Initiation                            │       │ ← pillar card
│  │     Brahma Muhurta  •  5 AM rising routine       │       │   Click → opens
│  │     ✓ Done today  •  +15 karma                   │       │   timer OR detail
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │ 🍽   Nutrition + Fasting                          │       │
│  │     Ahara Vidhi  •  16:8 protocol                │       │
│  │     [▶ Start fast]  •  +10 karma                 │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  ⋮ (more body pillars)                                       │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**
- One card per pillar.
- Status badge: done today (green check), not done (action button).
- Tapping a pillar with a timer → opens the timer inline OR routes to /sessions tab. Either works; the user shouldn't see a "different page."
- Tapping a pillar without a timer (e.g. Sleep Optimization) → opens an inline detail panel with the description + "Mark complete" button.

### 8.3 The Timer screen (when in a Session)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Practice                          🔊  ⚙          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                  Breathing (4:6 Basic)                       │
│                                                              │
│                       ╭─────╮                                │
│                      ╱       ╲                               │
│                     │ 10:00   │       ← circular progress    │
│                      ╲       ╱           breathing animation │
│                       ╰─────╯                                │
│                                                              │
│                    Breathe In  ·  4                          │
│                                                              │
│            [  ▶  Start  ]    [  ↻  Reset  ]                  │
│                                                              │
│         5 cycles complete  •  +15 karma when you finish      │
└─────────────────────────────────────────────────────────────┘
```

**Behavior on completion:**
- Soft chime
- Auto check-in fires
- Screen transforms to "Namaste — practice complete. +15 karma earned. 8-day streak."
- Two CTAs: [Back to Today] (primary), [Do another practice] (secondary)
- After 3 seconds of no input → auto-redirect to Today. Closes the loop visually.

### 8.4 Journal (unified — gratitude + intention + manifestation + mood)

```
┌─────────────────────────────────────────────────────────────┐
│ ☰  10X Vedic                                                 │
├─────────────────────────────────────────────────────────────┤
│  Journal                                                     │
│                                                              │
│  ┌──────────┬──────────┬──────────┬──────────┐              │
│  │Gratitude │ Intention│Manifest. │   Mood   │              │ ← tabs
│  └──────────┴──────────┴──────────┴──────────┘              │
│                                                              │
│  Today's gratitude — Tue, May 20                             │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │ I am grateful for...                              │       │
│  └──────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────┐       │
│  │ I am grateful for...                              │       │
│  └──────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────┐       │
│  │ I am grateful for...                              │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  [ Save ]                                                    │
│                                                              │
│  Recent entries ⌄                                            │
└─────────────────────────────────────────────────────────────┘
```

Today's Mood goes in the Mood tab. Last 30 days chart underneath.

### 8.5 Progress (unified — charts + report + achievements + insights)

```
┌─────────────────────────────────────────────────────────────┐
│  Progress                                                    │
│                                                              │
│  Day 14 of 48 ━━━━━━━░░░░░░░░░░░░░░  29%                    │
│                                                              │
│  ┌─────────┬─────────┬─────────┬─────────┐                  │
│  │ Streak  │ Karma   │ Mood    │ Pillars │                  │
│  │   7d    │  245    │  4.2/5  │ 32/77   │                  │
│  └─────────┴─────────┴─────────┴─────────┘                  │
│                                                              │
│  This week's completion                                      │
│  [bar chart: 7 days × 11 pillars]                            │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │ ✨ Insight                                        │       │
│  │ Your meditation consistency dropped when sleep   │       │
│  │ was under 6h. Two missed sleeps last week.       │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Achievements (3 of 12)                                      │
│  🏆 First Week  🏆 Pranayama Master  🏆 Karma 100             │
│                                                              │
│  [ View 48-day report ]                                      │
└─────────────────────────────────────────────────────────────┘
```

### 8.6 Onboarding (after register, before Day 1)

Three steps, each on its own screen with a visible progress dot:

```
Step 1: Welcome + your dosha (auto-claimed if they took the test)
Step 2: Pick your focus pillars (1–3 cards selected from a grid of 11)
Step 3: Set your first reminder time + tour the dashboard

End screen:
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│           Your 48-day journey starts tomorrow.               │
│                                                              │
│      Tomorrow at 6 AM you'll get a gentle nudge.             │
│           Your first practice: Pranayama.                    │
│                                                              │
│              [   Take me to my dashboard   ]                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

The dashboard then renders with a one-time tooltip pointing at Today's Practice: "This is what you'll do each day. Tap to start."

### 8.7 Public dosha test funnel

The landing page hero should make the dosha test the primary CTA. Currently it's buried under "Start Your Journey" (which requires signup).

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│           Which Ayurvedic body type are you?                 │
│                                                              │
│         Take the free 3-minute dosha quiz to find out.       │
│                                                              │
│             [  Start the dosha test (free)  ]                │
│                                                              │
│       Already know your dosha? [Start the 48-day program]    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

After the quiz, result page has TWO CTAs:
1. Primary: "Get your personalized 48-day program based on your dosha" → signup
2. Secondary: "Share my result" (link, copy)

## 9. Visual hierarchy rules

For the design LLM to apply consistently:

1. **One primary action per screen.** If a screen has two equal-weight buttons, redesign.
2. **The daily CTA is always the visual anchor of Today.** Largest text, most contrast, most whitespace around it.
3. **Stats are supportive, not decorative.** Karma/streak counters belong as small chips, not giant gradient cards.
4. **No section should be more than 80% of viewport on first load.** If users have to scroll to see what to do, the hierarchy is broken.
5. **Empty states matter more than full states.** Design for Day 1 first.

## 10. Design system notes (what already exists)

- **Colors:** Orange + amber gradient is the brand. Use sparingly — currently overused on every card. Reserve for primary CTAs only.
- **Typography:** Sans-serif, no custom font configured. Designer can propose one (Inter, IBM Plex Sans, Söhne).
- **Iconography:** `lucide-react` is the icon library. Don't introduce a second set.
- **Components in `src/components/ui/`:** `Card` (variants: default, elevated, golden), `Button` (variants: primary, secondary, outline, ghost, danger; sizes: sm, md, lg), `ShareButton`. Plus dosha-specific visual components.
- **Animation:** `framer-motion` available, but currently sparse. Animation should communicate state change (check-in success, streak milestone), not decoration.
- **Theme variables in CSS:** `--color-primary`, `--color-bg-surface`, `--color-card-bg`, `--color-border`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`. Defined in globals.css.

## 11. Mobile considerations

The web app already responsive — sidebar collapses to a hamburger on mobile. The Expo app is a separate codebase (`mobile/`) with ~5 tabs:
- Home, Pillars, Sessions, Journal, More

Web mobile and native mobile should converge on the same 4-tab IA proposed in §7 (Today, Practice, Journal, Progress).

## 12. What's been built recently (context for the redesign)

The current build just shipped these in the last two days. The redesign can assume these exist:

- **Daily Brief card** on dashboard (indigo gradient) — AI-generated or template fallback.
- **Bridge:** Today's Practice CTA now routes into the right Session timer with auto check-in.
- **Lifecycle state machine** computed server-side: `new | active | at-risk | dormant | completed`.
- **Admin console** at `/admin` (role-gated).
- **Event emission** wired into 5 key handlers (analytics foundation).
- **Public dosha test** with 90-day TTL'd shareable result.

## 13. What I want from the receiving LLM

Concrete deliverables in priority order:

1. **Redesign the Today screen** (§8.1) as a polished mockup. This is the single biggest UX lever.
2. **Reduce the 24 routes to 4 primary destinations** per §7. Show the new sidebar/nav structure.
3. **Five state variants of the Today screen** — new, active, at-risk, dormant, completed.
4. **Onboarding flow** as 3 screens with the tooltip on Day 1 dashboard.
5. **The completion screen** when a Session timer finishes — must close the loop visually.
6. **Empty states** for Journal, Progress, Practice for Day 1 users.
7. **Mobile-first wireframes** for the 4 primary screens (not just desktop).
8. **Color/component-token guidance** if the current palette needs evolving.

Bonus if there's time:
- Public landing page hero redesign with dosha test as primary CTA.
- Dosha test result page with stronger signup conversion.
- Pillar info page (the read-about-the-practice screen, separate from the do-the-practice flow).

## 14. What's out of scope for the redesign

- Admin console (it's internal, functional UI is fine)
- The 5 timer interaction designs (they work and are loved — keep them)
- Marketing site content (blog, about, faq — IA is fine)
- Mobile native app (separate redesign track)
- Color theme overhaul (refinement OK, not a from-scratch palette)

## 15. Constraints & non-negotiables

- The Vedic / Ayurvedic identity is core. Sanskrit names alongside English. Subtle traditional motifs (lotus, mandala, sunrise). Do not redesign into a generic wellness-app look.
- The 11-pillar structure is fixed. Don't propose merging or removing pillars.
- The 48-day length is fixed. Don't propose changing the cycle.
- Karma points + streaks + Karma Shield are existing mechanics. Don't propose alternative gamification systems.
- The product is monetization-ready but free today. Don't propose paywalls in V1 of the redesign.

---

**File companions:**
- `docs/PROJECT_BLUEPRINT.md` — current technical state
- `docs/PROJECT_VISION.md` — aspirational roadmap
- `docs/ARCHITECTURE.md` — system architecture
- This file — UX/wireframe specification

Live deployment: `https://10x.vedics.net`
