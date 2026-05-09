---
title: "P0 Bundle — Design Spec"
date: "2026-05-09"
companion_docs:
  - "docs/COMPETITOR_GAP_ANALYSIS.md"
  - "docs/ROADMAP.md"
status: "draft — pending user review"
items:
  - P0-7 — Fix the broken check-in (pillarSlug vs pillarId)
  - P0-2 — "Today's Practice" hero card on dashboard
  - P0-5 — Karma Shield (streak freeze)
  - P0-6 — Per-pillar karma points (use karmaPointsBase)
  - P0-1 — PWA push notifications
  - P0-3 — SSR for the (public) route group
  - P0-4 — Public Dosha Test funnel
---

# P0 Bundle — Design Spec

This spec covers seven P0 items from `docs/ROADMAP.md`. Implementation order is fixed by dependency — see §9. Each section is self-contained (problem, design, data/API/UI changes, edge cases, testing) so items can be implemented and reviewed independently.

**Stack reminder:** Next.js 15.5 static export + AWS API Gateway V2 + Lambda (Node 20) + DynamoDB. SST v4. JWT auth. No SSR today.

**Out of scope:** anything in P1/P2 (cohorts, email lifecycle, escalating curriculum, friend streaks, referrals, multi-language, sunrise-aware push, festival calendar, sutra book preview, mantra library, public community feed). These are explicitly deferred until P0 ships and we have data to weigh them.

---

## 1. P0-7 — Fix the broken check-in

### Problem
Every pillar check-in currently returns 400. UI sends `{ pillarSlug }` (`src/app/(main)/pillars/[pillarId]/pillar-detail-client.tsx:53`); Lambda expects `{ pillarId }` (`functions/data/checkin.ts:33,35`). The URL parameter named `pillarId` in the route is actually the slug (e.g. `"breathing-meditation"`), not the numeric `Pillar.id`. This is a known bug surfaced in `PROJECT_FLOW.md` row #1 and is the silent root cause behind any low completion metric — until it's fixed, no other completion feature can be measured.

### Decision
**Make the Lambda the source of truth and accept the slug.** Resolving slugs server-side is more robust than threading numeric IDs through the URL: pillars are a small fixed set, slug → ID mapping is in `src/constants/pillars.ts`, and there's no scenario where the UI legitimately needs to know the numeric ID.

### Changes

**Backend** — `functions/data/checkin.ts`
- Accept either `pillarId` (number) or `pillarSlug` (string) in the POST body.
- If `pillarSlug` provided, resolve it to a numeric pillar ID via a small lookup (mirror `src/constants/pillars.ts` into `functions/lib/pillars.ts`).
- Persist both `pillarId` (number) and `pillarSlug` (string) on the `DailyCheckins` row to avoid future ambiguity. New rows will have both; old rows keep whatever they have.
- Validate that the slug/ID resolves to a known pillar; 400 if not.

**Frontend** — no change (already sends `pillarSlug`).

**Constants** — new file `functions/lib/pillars.ts`:
```ts
export const PILLAR_SLUGS = {
  "morning-initiation": { id: 1, karmaPointsBase: 15 },
  "nutrition-fasting":  { id: 2, karmaPointsBase: 10 },
  "thoughts-intention": { id: 3, karmaPointsBase: 12 },
  "breathing-meditation": { id: 4, karmaPointsBase: 15 },
  "movement":           { id: 5, karmaPointsBase: 12 },
  "healing-meditation": { id: 6, karmaPointsBase: 15 },
  "gratitude":          { id: 7, karmaPointsBase: 10 },
  "sandhya-meditation": { id: 8, karmaPointsBase: 20 },
  "brahman-connection": { id: 9, karmaPointsBase: 15 },
  "divine-manifestation": { id: 10, karmaPointsBase: 12 },
  "sleep-optimization": { id: 11, karmaPointsBase: 10 },
} as const;
```

This is duplication of `src/constants/pillars.ts` data, but Lambdas can't import from `src/`. The duplication is small, well-bounded, and updated only when a pillar is added.

### Edge cases
- Existing `DailyCheckins` rows have only `pillarId` (a value that today is *the slug string passed through to the database*). On read paths (GET), still return them; the dashboard groups by either field. Migration: a one-off Lambda script that walks the table and backfills both fields, run after deploy. (Add as a sub-task; not required for the bug fix itself.)
- GET `/data/checkin` already filters by `userId-index` + date — unaffected.

### Testing
- Manual: register fresh user → start journey → check-in on each of 11 pillars → verify 200 + DynamoDB rows have both `pillarId` and `pillarSlug`.
- Verify dashboard "completed today" count includes the new check-in.
- Verify streak increments on first check-in of the day.

---

## 2. P0-6 — Per-pillar karma points

### Problem
`src/constants/pillars.ts` defines `karmaPointsBase` per pillar (10–20). Lambda awards a flat 10 (`functions/data/checkin.ts:101`). UI shows "+15 karma" on the pillar card but actually credits +10. This breaks the trust contract and zeros out the difficulty signal that P0-5 (Karma Shield pricing) depends on.

### Decision
Award `karmaPointsBase` from the resolved pillar definition. Land in the same PR as P0-7 — same file, same lookup map.

### Changes
- `functions/data/checkin.ts:115` — replace `points: 10` with `points: pillarMeta.karmaPointsBase` (where `pillarMeta` is the lookup result from §1).
- Surface the actual awarded points in the response: `return ok({ success: true, checkinId: id, karmaAwarded: pillarMeta.karmaPointsBase })` so the UI can render the correct toast.
- UI: `pillar-detail-client.tsx` reads the toast from response.

### Testing
- Check-in on Sandhya Meditation (20) and Sleep Optimization (10) — verify two separate `KarmaTransactions` rows with `points: 20` and `points: 10` respectively.

---

## 3. P0-2 — "Today's Practice" hero card on dashboard

### Problem
The current dashboard shows the 11-pillar grid above the fold via `<PillarGrid />`. Users facing 11 daily checkboxes default to "I'll come back later" — choice paralysis is the dominant Day-7 dropout cause across competitor research. Every winner (Calm, Headspace, Insight Timer, Balance) ships a single canonical "today" surface.

### Decision
Replace the grid as the primary call-to-action with a `<TodaysPractice />` hero card. Keep the grid below the fold for users who want to see all 11 pillars and check in across them. The hero card surfaces **one action** keyed to:
1. The user's `journeyDay` (deterministic — same day of journey gets the same pillar across users).
2. Whether the user has set focus pillars in onboarding (`FocusPillars` table). If so, rotate among those 1–3 instead of all 11.
3. Whether that pillar is already completed today — if yes, show a celebratory "today's practice complete" state with an optional secondary CTA (journal entry, mood log, breath session).

### Selection logic (deterministic)
```
function getPillarOfDay(journeyDay, focusPillarSlugs):
  pool = focusPillarSlugs.length > 0 ? focusPillarSlugs : ALL_PILLAR_SLUGS
  index = (journeyDay - 1) % pool.length
  return pool[index]
```

This is the simplest possible rotation. It guarantees variety and makes Day 5 ≠ Day 6. Real curriculum escalation is P1-1; this is the holding pattern.

### Component design

```
+----------------------------------------------------+
|  Day 12 of 48                       [Streak: 11d]  |
|                                                    |
|  Today's Practice                                  |
|  ──────────────                                    |
|  Pranayama — Breathing + Meditation                |
|  "Breath is the bridge between body and mind"      |
|                                                    |
|  [ Begin 15-min session →  ]   +15 karma           |
|                                                    |
|  Skip → smaller "If too busy: 3-min breath"        |
+----------------------------------------------------+
```

Completed state:
```
+----------------------------------------------------+
|  ✓ Today's practice complete                       |
|  +15 karma earned                                  |
|                                                    |
|  Want more? [Journal entry] [Mood log] [More →]    |
+----------------------------------------------------+
```

### Changes

**New component** — `src/components/features/dashboard/todays-practice.tsx`
- Props: `journeyDay`, `focusPillarSlugs`, `completedToday` (string[] of pillar slugs)
- Uses `getPillarBySlug` from existing constants
- Routes "Begin" CTA to `/pillars/[slug]` (existing detail page)
- Shows "If too busy: 3-min breath" link (routes to `/pillars/breathing-meditation` with `?short=1` query) only if today's pillar's `defaultDurationMinutes >= 10`. The pillar detail page reads `?short=1` and starts a pre-baked 3-min Pranayama timer that, on completion, also marks today's primary pillar as checked in (one tap, one check-in)

**Dashboard** — `src/app/(main)/dashboard/page.tsx`
- Reorder: `<TodaysPractice />` first, then existing widgets, then `<PillarGrid />` collapsed into an "All 11 pillars" expander.

**Daily wisdom integration** — fetch one inspirational line keyed to the pillar slug from `src/data/daily-wisdom.ts` (already exists). If no match for that pillar, fall back to a generic line.

### Edge cases
- No active journey yet → hide hero card; show existing "Start your 48-day journey" CTA (already in dashboard).
- Day 49+ (post-completion) → show "Journey complete" state with restart CTA. (Borrowed from P2-19 to avoid an awkward gap.)
- All 11 pillars completed today → show "Master day" celebration card with link to journal.

### Testing
- New user, day 1, no focus pillars → see Pillar #1 (Morning Initiation).
- New user, day 5, no focus pillars → see Pillar #5 (Movement Everyday).
- User with focus pillars `[breathing-meditation, gratitude]`, day 3 → `(3-1) % 2 = 0` → `focus[0]` = breathing-meditation. Day 4 → `focus[1]` = gratitude.
- Completed today → celebratory state.

---

## 4. P0-5 — Karma Shield (streak freeze)

### Problem
Today's streak logic (`functions/data/checkin.ts:70-88`) silently extends the streak if the user checks in within 36 hours. Past 36 hours, the streak resets to 1. The user has no agency, no warning, no mechanic to preserve a 14-day streak after one busy day. Duolingo's streak freeze is the canonical mechanic; absence of it is consistently in the top-3 churn drivers across habit apps research.

### Decision
Replace the 36-hour silent grace with an **explicit, agentic Karma Shield** that the user earns and consumes:
- **Auto-grant 1 Shield at Day 7** (Streak Society pattern from Duolingo).
- **Buy more for 200 karma each.**
- **Maximum 2 Shields stocked.**
- **Auto-consumes** when a check-in arrives after a missed day, before the streak resets. The user opens the app to a "Shield used — your streak is safe!" toast.
- **Calendar grace remains 0**: either you check in same day, or a Shield is consumed, or the streak resets. This is more explicit than the current 36-hour fuzzy window.

### Data model

Extend `Streaks` table (no new table — same row per user):
```
{
  id, userId, journeyId,
  currentStreak: number,
  longestStreak: number,
  lastCheckin: string,
  shields: number,           // NEW — count of unused Shields, capped at 2
  shieldsEarned: number,     // NEW — lifetime granted (for analytics)
  shieldsUsed: number,       // NEW — lifetime consumed
  shieldsPurchased: number,  // NEW — lifetime bought with karma
  createdAt, updatedAt
}
```

No schema migration in DynamoDB (schemaless); existing rows missing the fields are treated as 0.

### Streak update algorithm (replaces lines 70-88)

```
const today = parseDate(checkinDate)
const last = streak.lastCheckin ? parseDate(streak.lastCheckin) : null
const daysSinceLast = last ? floor((today - last) / 86400000) : null

if (last == null) {
  // first check-in
  newCurrent = 1
  shieldDelta = 0
} else if (daysSinceLast === 0) {
  // same calendar day, no streak change
  return
} else if (daysSinceLast === 1) {
  // consecutive
  newCurrent = currentStreak + 1
  shieldDelta = 0
} else if (daysSinceLast === 2 && shields >= 1) {
  // exactly 1 missed day, 1 shield available → shield protects it
  newCurrent = currentStreak + 1
  shieldDelta = -1
  shieldUsedToday = true
} else {
  // either no shields, or more than 1 missed day (shield only covers 1)
  // streak resets; shield stays in inventory for next time
  newCurrent = 1
  shieldDelta = 0
}

newLongest = max(newCurrent, longestStreak)

// Day-7 auto-grant
if (newCurrent === 7 && shieldsEarned === 0) {
  shieldDelta += 1
  shieldsEarnedDelta = 1
}

// Cap at 2
newShields = min(2, max(0, shields + shieldDelta))
```

### API additions

**New route** `POST /data/streaks/buy-shield`
- Cost: 200 karma.
- Validate: user has ≥200 unspent karma (sum of `KarmaTransactions.points`).
- Validate: shields < 2.
- Atomic: deduct 200 karma (insert negative `KarmaTransactions` row with `reason: 'Karma Shield purchased'`) AND increment shields.
- Return: `{ shields, karmaBalance }`.

(SST link this Lambda to `Streaks` and `KarmaTransactions`.)

### UI changes

- **Streak counter widget** (`src/components/features/dashboard/streak-counter.tsx`) — show shield count next to streak: `🔥 11d  🛡️ 1`.
- **Shield purchase modal** — opens from streak counter when user has karma ≥ 200 and shields < 2. Shows "Protect your streak — 200 karma."
- **Auto-consume toast** — on dashboard load after a check-in that consumed a shield, show: "Karma Shield used. Your 12-day streak is safe."
- **Day-7 grant celebration** — small confetti animation + "You earned your first Karma Shield" badge.

### Edge cases
- User has 1 shield, misses 2 days in a row (daysSinceLast = 3 on next check-in) → shield does NOT save the streak. Streak resets to 1. Shield is preserved (not consumed). Rationale: a shield protects exactly one missed day; two missed days exceeds its capacity, so we don't burn it for no benefit. To survive two missed days the user needs both shields stocked, and even then this v1 doesn't auto-stack — they'd survive the first miss with the first shield, then the second miss would consume the second only if they checked in on what would have been Day N+2. Multi-day shield stacking is a P1 refinement if data shows it matters.
- User starts a new journey → `Streaks` row gets fresh; old shields are lost. Acceptable.
- Time-zone edge: today the `checkinDate` is computed in UTC (`functions/data/checkin.ts:38`). A user in IST checking in at 1 AM IST = 7:30 PM UTC the previous day. P1 will fix timezone properly; for P0 the semantics are unchanged from today.
- Pseudocode change vs current 1.5-day grace: today's logic uses a 36-hour wall-clock window. The new logic uses calendar-day diffs (UTC). This is a small behavior shift — a user who checks in at 11 PM Day N and then 9 AM Day N+2 (34 hours apart, but 2 calendar days later in UTC) will see the streak reset under the new logic but extend under the old. This is intentional: the new logic is unambiguous and shield-compatible, and the user can always Karma Shield it.

### Testing
- Day 6 → check in Day 7 → shield count goes 0 → 1.
- Day 14 streak → miss 1 day → check in next day → shield consumed (1 → 0), streak now 15.
- Day 14 streak → miss 2 days → check in → streak resets to 1, shield NOT consumed.
- Earn 200 karma → buy shield → shield count 1 → 2; karma balance −200.
- Buy when shields = 2 → 400 + appropriate error.

---

## 5. P0-1 — PWA push notifications

### Problem
The flagship Brahma Muhurta pillar requires a 5 AM nudge. The app has in-app notifications only. Web Push is the highest-leverage retention mechanic per Calm's reported 3x retention figure, and PWA is already shipped (service worker registered, manifest in place).

### Decision
Use the standard Web Push API with VAPID keys. Lambda generates and sends pushes via the `web-push` npm package. iOS Safari 16.4+ supports Web Push for installed PWAs; Chrome/Firefox/Edge desktop and mobile all support it. Native iOS/Android apps are P2.

### Data model

**New table** `PushSubscriptions` (DynamoDB):
- PK: `id` (string)
- GSI: `userId-index`
- Fields: `{ id, userId, endpoint, p256dh, auth, userAgent, createdAt, lastSentAt }`

A user can have multiple subscriptions (phone + laptop). Endpoint uniqueness is enforced at insert time by querying the GSI.

**Extend `ReminderSettings`** (already exists, hash key `userId`):
- `morningPushEnabled: boolean`
- `morningPushTime: string` ("HH:MM" in user's timezone)
- `userTimezone: string` (IANA, e.g. "Asia/Kolkata")
- `streakSavePushEnabled: boolean` (defaults true)
- `recoveryPushEnabled: boolean` (defaults true)

### API additions

**New routes:**
- `POST /data/push/subscribe` — body: `{ endpoint, keys: { p256dh, auth }, userAgent }`. Insert a `PushSubscriptions` row.
- `DELETE /data/push/subscribe` — body: `{ endpoint }`. Delete a subscription.
- `POST /data/push/test` — sends a test push to all the user's subscriptions. (For settings UI.)

**Cron-triggered Lambdas (SST `cron`):**
- `morning-push` — runs every 15 minutes. Queries `ReminderSettings` for users whose `morningPushTime` falls in the current 15-min window when converted to UTC. Sends push: "Day {N} of 48 — Pillar of the day: {name}."
- `streak-save-push` — runs at 21:00 user-local (every 15 min UTC, computes per timezone). Targets users with active streak ≥ 3 who have not checked in today. Sends: "Your {N}-day streak is at risk. {pillarName} — 5 minutes."
- `recovery-push` — runs at 12:00 user-local. Targets users with no check-in for 2+ days and an active journey. Sends: "Welcome back. Take one breath."

VAPID keys stored in SST secrets: `VapidPublicKey`, `VapidPrivateKey`. Frontend reads `VapidPublicKey` via the same env-var injection used today for `NEXT_PUBLIC_API_URL`.

### Service worker

`public/sw.js` — extend with `push` and `notificationclick` handlers:
```js
self.addEventListener('push', (event) => {
  const data = event.data?.json();
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body, icon: '/icon-192.png', badge: '/badge-72.png',
    data: { url: data.url }, tag: data.tag,
  }));
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/dashboard'));
});
```

### Frontend changes

**Settings page** (`src/app/(main)/reminders/page.tsx` already exists):
- "Enable morning practice reminder" toggle.
- Time picker (default 06:30).
- Timezone picker (auto-detect from `Intl.DateTimeFormat().resolvedOptions().timeZone`).
- "Send test push" button.

**Notification permission flow:**
- Prompt only after user explicitly toggles on in Settings (NOT on first load — prompt fatigue is a known killer).
- On permission granted: register service worker, get subscription, POST to `/data/push/subscribe`.

### Edge cases
- User denies permission → settings toggle reverts; show explainer.
- Subscription expires (browser-side) → push fails with 410 Gone → cleanup Lambda deletes that subscription.
- Multiple devices → all subscriptions get the push; user can disable per device.
- iOS PWA: only works for installed PWAs (must be added to home screen). Add an "Install to home screen" prompt when iOS user toggles push.

### Testing
- Subscribe on Chrome desktop → receive test push.
- Subscribe on iOS Safari (must add to home screen) → receive test push.
- Set morning push for current minute + 1 → wait for cron → receive.
- Skip a day → verify recovery push fires next day at 12:00 local.

---

## 6. P0-3 — SSR for the (public) route group

### Problem
The site uses `next.config.ts` `output: 'export'` — a static bundle. Every public page (about, blog, blog/[slug], faq, how-it-works, pillars-overview, testimonials, contact, privacy, terms) is a thin HTML shell with content rendered client-side. Crawlers see empty `<body>`. This is the single biggest acquisition-side block: Headspace's blog gets 720K monthly organic visits via SSR; Vedic Transform currently gets near-zero from the public surface.

### Decision
**Migrate to OpenNext on CloudFront via SST's `Nextjs` construct.** Removes `output: 'export'`. Public routes get SSR/ISR; auth-protected routes still render client-side (they don't need SEO and SSR them complicates auth). One deployment, single origin, no split repos.

### Tradeoff considered
- **Alternative A:** Split `(public)` into a separate Vercel/Cloudflare Pages app. Faster to ship in isolation but doubles deploy infra and creates a divergence trap.
- **Alternative B:** Keep `output: 'export'` and use ISR via Cloudflare Workers / a custom edge function. Hacky.
- **Chosen:** SST `Nextjs` construct (built on OpenNext). Standard, supported, single-origin. ~2 weeks of infra work but unlocks all future SEO + dynamic features (cohorts, real auth middleware, panchang pages).

### Changes

**`next.config.ts`** — remove `output: 'export'`, add:
```ts
const nextConfig: NextConfig = {
  experimental: { serverActions: { allowedOrigins: [...] } },
  images: { unoptimized: false, remotePatterns: [...] },
};
```

**`sst.config.ts`** — replace `sst.aws.StaticSite` with `sst.aws.Nextjs`:
```ts
const site = new sst.aws.Nextjs("VedicTransformSite", {
  path: ".",
  link: [api],   // expose API URL inside server components if needed
  domain: "...",
  environment: { NEXT_PUBLIC_API_URL: api.url },
});
```

**Per-page rendering directives:**
- `(public)/blog/page.tsx` and `(public)/blog/[slug]/page.tsx` — `export const dynamic = 'force-static'` + `export const revalidate = 3600` (ISR hourly). Generate `<head>` meta + JSON-LD `Article` schema.
- `(public)/about/page.tsx`, `(public)/faq/page.tsx`, `(public)/how-it-works/page.tsx`, `(public)/pillars-overview/page.tsx`, `(public)/testimonials/page.tsx`, `(public)/contact/page.tsx`, `(public)/privacy/page.tsx`, `(public)/terms/page.tsx` — all `force-static` (build-time). Add OpenGraph + Twitter card meta.
- `(public)/page.tsx` (landing) — `force-static` with hourly revalidation.
- `(auth)/*` and `(main)/*` — explicitly opt out: `export const dynamic = 'force-dynamic'` and the existing `'use client'` shells continue to work. AuthGuard and localStorage-token unchanged.

**SEO additions per public page:**
- `<title>` and `<meta description>` derived from page content.
- OpenGraph image — `/api/og/[slug]/route.ts` route generating share images via `@vercel/og` (also serves P1-5 Shareable Cards).
- JSON-LD: `Article` for blog, `Organization` for about, `FAQPage` for FAQ.
- Sitemap: new `app/sitemap.ts` listing all public routes.
- `robots.txt`: allow all under `/`, disallow `/(main)/*` URL paths (won't matter since they're not linked publicly, but defensive).

### Edge cases
- Existing CloudFront URL changes? OpenNext sites get their own CF distribution. Plan a DNS swap if a custom domain exists. Production deploy can run side-by-side first.
- API CORS allowlist (`sst.config.ts:91`) — add the new SST `Nextjs` distribution origin.
- Build time goes from ~20s static export to ~60-90s with OpenNext bundling. Acceptable.

### Testing
- Curl `/about` and assert content is in HTML (not just `<div id="__next">`).
- Lighthouse score on `/blog/[slug]` — should jump to >90 SEO.
- View-source on `/dosha-test` (P0-4) shows the result OG meta.

---

## 7. P0-4 — Public Dosha Test funnel

### Problem
The dosha assessment is currently behind login at `/(main)/dosha-assessment`. "Dosha test" is one of the highest-volume Indic-spirituality search keywords; the result is naturally shareable; conversion to signup is intrinsic. Locking it behind auth is leaving the single biggest top-of-funnel opportunity on the floor.

### Decision
Lift the dosha assessment to a public route `/dosha-test` (under the `(public)` group → benefits from P0-3 SSR). Capture the result in a server-rendered share-friendly page. CTA to sign up — but the test itself requires no account.

### Changes

**New routes** under `(public)`:
- `/dosha-test/page.tsx` — landing + start test.
- `/dosha-test/quiz/page.tsx` — the multi-step quiz (component already exists at `src/components/features/dosha/dosha-assessment.tsx`; reuse).
- `/dosha-test/result/[id]/page.tsx` — result page, SSR'd, with OG image generation.

**API additions:**
- `POST /data/dosha-test/anonymous` — accepts the answers, returns a short result ID + dosha breakdown. Stored in a new `AnonymousDoshaResults` DynamoDB table, TTL'd to 90 days.
- Persistent linkable URL pattern: `/dosha-test/result/{id}` returns a Vata/Pitta/Kapha dominant breakdown + brief description + CTA.

**Result share card** — generated via `/api/og/dosha/[id]/route.ts` (introduced in P0-3):
- Branded: "I'm a {Dosha} — start your 48-day Vedic journey."
- Color-coded by dosha (Vata = blue, Pitta = red, Kapha = green-ish, matched to brand).

**OG meta on result page:**
```html
<meta property="og:title" content="I'm a Pitta — Vedic Transform">
<meta property="og:description" content="Discover your Vedic dosha in 2 minutes...">
<meta property="og:image" content="https://.../api/og/dosha/abc123">
<meta name="twitter:card" content="summary_large_image">
```

**Existing in-app dosha test** (`/(main)/dosha-assessment`) — keep unchanged for logged-in users; their result is stored on the user record. Add a one-time migration step: when a logged-in user has a public-result ID in `localStorage.vedic-anonymous-dosha`, attach it to their user record on signup.

### Edge cases
- Spam bots submitting fake results — rate limit by IP at API Gateway level (P2 if needed; don't pre-build).
- TTL'd results — if a user shares a 90-day-old link, fall back to "this result has expired, take the test."
- SEO duplication: `/dosha-test` and `/(main)/dosha-assessment` have similar content. Set a canonical link from the in-app version pointing to the public one.

### Testing
- Open `/dosha-test` while logged out → can complete and see result.
- Share result URL from a phone → unfurls with branded image.
- Click "Start your journey" CTA on result page → routes to `/register`. After signup, the dosha is attached to the user.

---

## 8. Cross-cutting concerns

### 8.1 Authentication & authorization
No auth changes required for any P0 item. P0-7, P0-2, P0-5, P0-6, P0-1 remain JWT-protected as today. P0-3 and P0-4 explicitly add public surface — the `apiFetch` wrapper handles unauthenticated requests fine (just no Authorization header).

### 8.2 DynamoDB cost
- New tables: `PushSubscriptions`, `AnonymousDoshaResults` — both small, on-demand billing, < $0.10/mo at current scale.
- `Streaks` row gets 4 additional fields — no measurable cost impact.

### 8.3 Lambda count
Adds 5 routes:
- `POST /data/streaks/buy-shield`
- `POST /data/push/subscribe`
- `DELETE /data/push/subscribe`
- `POST /data/push/test`
- `POST /data/dosha-test/anonymous`

Plus 3 cron Lambdas (morning, streak-save, recovery push). Each runs every 15 minutes — ~96 invocations/day each. At current scale that's negligible cost; at >10k DAU consider consolidating into one cron that fans out, or use SQS scheduled delivery (P2).

Total: 8 new functions on top of the current 27. Cold-start risk grows linearly; already addressed in `PROJECT_FLOW.md §15.1` as a known concern.

### 8.4 Secrets
Add `VapidPublicKey` and `VapidPrivateKey` to SST secrets:
```bash
npx sst secret set VapidPublicKey "..." --stage production
npx sst secret set VapidPrivateKey "..." --stage production
```

Generate with `npx web-push generate-vapid-keys`.

### 8.5 Backwards compatibility
- Existing user check-ins (with `pillarId` = the slug string) keep rendering. Read paths handle both shapes.
- Existing streak rows without shield fields treat them as 0.
- Existing static export deployment is replaced by OpenNext deployment; no user-visible change beyond URL meta.

### 8.6 Observability
Each new Lambda uses the existing `console.error` pattern. Structured logging is P2-20.

For pushes specifically: log `{ userId, type, status }` per push attempt to CloudWatch. Failures (410 Gone) trigger subscription cleanup.

---

## 9. Build sequence and dependencies

```
P0-7 (check-in fix) ──► P0-6 (per-pillar karma) ──► P0-5 (Karma Shield)
        │
        └──► P0-2 (Today's Practice)
                  │
                  └──► P0-1 (Push notifications)

P0-3 (SSR) ──► P0-4 (Public Dosha Test)
```

Strict order:
1. **P0-7 + P0-6** — same PR. Unblocks meaningful streak logic.
2. **P0-5** — depends on P0-6 (200-karma cost is meaningless if karma is flat 10).
3. **P0-2** — independent of P0-5, can ship in parallel after P0-7.
4. **P0-3** — independent of all check-in work; can run in parallel from day 1.
5. **P0-1** — after P0-7 (so check-in flow is reliable to point pushes at) and after P0-2 (so push CTAs route to a meaningful "Today's Practice" surface, not the 11-pillar grid).
6. **P0-4** — after P0-3 (needs SSR for OG meta).

### Per-item effort (engineering days, single dev)

| Item | Days |
|---|---|
| P0-7 + P0-6 | 1–2 |
| P0-5 | 2–3 |
| P0-2 | 1–2 |
| P0-3 | 8–12 |
| P0-1 | 6–10 |
| P0-4 | 2–3 |
| **Total** | **~5–6 weeks** for one dev; ~3 weeks if parallelized across two devs |

---

## 10. Open questions

1. **VAPID keys & domain** — do you have a custom domain already, or will pushes register against the current `d1wkrhl40vhx82.cloudfront.net` URL? Custom domain is cleaner for VAPID but not required.
2. **Migration script for existing check-in rows** — needed (to backfill `pillarSlug` field), or do we accept that pre-fix data has only the legacy field? I'd default to "skip the migration" since the Lambda reads both shapes.
3. **iOS push prompt timing** — request on settings toggle (proposed) vs on first dashboard load after Day 1. I'd default to settings toggle to avoid notification fatigue.
4. **Anonymous dosha result expiry** — 90 days proposed. Change?
5. **Streak Society at Day 7** — auto-grant the first Karma Shield. Is the Day-7 trigger right, or should it be Day 3 (earlier belonging hook)?

---

## 11. What this spec deliberately does NOT include

- **No P1 work**: no cohorts, no email lifecycle, no escalating curriculum, no friend streaks, no referrals, no sunrise-aware muhurta, no festival calendar, no shareable progress cards beyond the dosha card, no Sutra Book preview.
- **No infrastructure cleanup**: known issues from `PROJECT_FLOW.md` (HttpOnly cookie migration, OAuth/forgot-password Lambdas, structured logging, X-Ray, Promise.all in reports endpoint) are P2.
- **No native apps**: Web Push covers iOS 16.4+ PWAs. Native is P2.
- **No new analytics tooling**: existing `console.error` and the user's reports endpoint suffice for P0 measurement.

If a P0 reveals during implementation that it can't be cleanly built without one of these, surface it to the user — do not silently expand scope.

---

*End of spec. Pending user review per `superpowers:brainstorming` flow.*
