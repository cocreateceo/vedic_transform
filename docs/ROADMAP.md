---
title: "10X Vedic Transform — Prioritized Roadmap"
date: "2026-05-08"
companion: "docs/COMPETITOR_GAP_ANALYSIS.md"
---

# 10X Vedic Transform — Prioritized Roadmap

Ranks every gap from `COMPETITOR_GAP_ANALYSIS.md` by **impact × effort**, with implementation sketches anchored to the existing codebase.

**Goals (in order):**
1. **G1 — Completion**: raise the share of users who finish the 48-day program.
2. **G2 — Acquisition**: drive top-of-funnel growth (SEO + virality).

**Tier definitions:**
- **P0** — Ship within 4 weeks. Highest impact, low-to-moderate effort, unblocks multiple downstream items.
- **P1** — Ship within 8 weeks. High impact OR moderate effort, depends on a P0.
- **P2** — Backlog. Moderate impact, or high effort, or strategic but not urgent.

Effort scale (rough engineering days for one developer):
- **S** = 1–3 days
- **M** = 4–10 days
- **L** = 2–4 weeks
- **XL** = 1+ months

---

## P0 — Ship First (4-week sprint)

| ID | Item | Goal | Effort | Why it's P0 | Implementation sketch |
|---|---|---|---|---|---|
| **P0-1** | **PWA push notifications** | G1 | M | Calm reports 3x retention from Daily Reminders. The flagship Brahma Muhurta pillar literally cannot be honored without it. Unblocks streak-save nudges, recovery flows, cohort communication. | Add Web Push API via `web-push` npm. Add `PushSubscriptions` DynamoDB table. New Lambda: `POST /data/push/subscribe`, `POST /data/push/test`. Use existing `ReminderSettings` table for per-user time/timezone. Service worker already registered (`public/sw.js`). |
| **P0-2** | **"Today's Practice" hero card on dashboard** | G1 | S | Replaces choice-paralysis grid of 11 pillars with one canonical daily action — the Daily Calm pattern adapted to Vedic Transform. Re-uses existing `currentDay` derivation, focus pillars, and AI Vedic Guide. | New component `<TodaysPractice />` at top of dashboard. Logic: if user has focus pillars, rotate among them by day-of-week; else show today's mantra/breath practice from `daily-wisdom.ts`. Surface a single 5–15 min CTA. |
| **P0-3** | **SSR for `(public)` route group only** | G2 | M | Single biggest acquisition lever. Headspace's blog gets 720K/mo organic. Currently every public page is `output: 'export'` static-bundle and has zero crawlable content per page. | Migrate `(public)` group to dynamic rendering (`export const dynamic = 'force-dynamic'`). Keep `(main)` static. Requires moving from S3 static-export to OpenNext on CloudFront, OR splitting into a small SSR sub-app. Add `<head>` meta + JSON-LD per page. |
| **P0-4** | **Public Dosha Test funnel** | G2 | S | "Dosha test" is a high-intent search keyword; conversion to signup is intrinsic. Component already exists (`dosha-assessment.tsx`); just needs a public route + share card + CTA. | New public route `/dosha-test` rendering existing `<DoshaAssessment />` without auth. Result page generates an OpenGraph share image (Vata/Pitta/Kapha card). CTA: "Start your 48-day journey." |
| **P0-5** | **Streak Freeze (Karma Shield)** | G1 | S | Loss-aversion currency. Duolingo gold standard. Existing karma economy is the perfect rail — no new currency. Replaces silent 36h grace with explicit, agentic protection. | Update `functions/data/checkin.ts` streak logic: if a day is missed AND user has ≥1 unused Shield, auto-consume Shield and continue streak. Add `karmaShields` field to `Streaks` table. Cost to buy: 200 karma. Auto-grant 2 at Day 7 (Streak Society pattern). |
| **P0-6** | **Per-pillar karma points (fix existing bug)** | G1 | S | Already flagged tech debt (PROJECT_FLOW.md row #10): `karmaPointsBase` per pillar exists in constants but Lambda awards flat 10. Fixing it makes harder pillars (Sandhya Meditation: 20) more rewarding and enables P0-5 pricing. | One-line fix in `functions/data/checkin.ts:101`: replace `points: 10` with `points: pillar.karmaPointsBase`. Backfill an info-only display "+X karma" in the check-in toast. |
| **P0-7** | **Fix the broken check-in (`pillarSlug` vs `pillarId`)** | G1 | S | Currently every check-in returns 400 (PROJECT_FLOW.md row #1). Without fixing this, no other completion feature matters. | Either rename the UI key to `pillarId` (and pass numeric ID), or have the Lambda accept `pillarSlug` and look up the ID. Verify with manual check-in flow before declaring done. |

**P0 total estimate:** ~5–6 weeks for one developer (some items can ship in parallel). P0-7 is a blocker for measuring everything else.

---

## P1 — Next Sprint (weeks 5–12)

| ID | Item | Goal | Effort | Depends on | Implementation sketch |
|---|---|---|---|---|---|
| **P1-1** | **Phased curriculum (rebuild the 48 days)** | G1 | L | P0-2 | Replace the static "all 11 pillars every day" with 4 phases per `COMPETITOR_GAP_ANALYSIS.md §1`. New table `JourneyDayContent` keyed by `(journeyDay)` with: phase, focus pillar(s), unlock content (mantra / breath / wisdom card), required vs optional. Update dashboard + `<TodaysPractice />` to render the day-specific content. |
| **P1-2** | **Email lifecycle drips** | G1 | M | — | SES + a `transactional-emails` Lambda. Triggers: welcome, day-3, day-7, day-14, day-21, day-30, day-48 completion, "missed 3 days" win-back. Templates in `emails/` (React Email). Unsubscribe link via signed token. |
| **P1-3** | **Recovery flow after a miss** | G1 | S | P0-1, P0-2 | When dashboard loads and user has missed ≥2 days, show a "Welcome back — take a breath" overlay routing to a 3-min breath practice + intention reset. Logged as a "recovery checkin" (does not break streak; existing Shield can apply). |
| **P1-4** | **Cohort start dates ("New Moon cohorts")** | G1 + G2 | M | P1-2 | Add `Cohorts` table: `{cohortId, startDate, theme, capacity, currentCount}`. New onboarding step: "Your cohort starts in N days — 412 yatris are starting with you." Email trigger on cohort start day. Cohort name displayed on dashboard. |
| **P1-5** | **Shareable progress cards (default daily action)** | G2 | M | P0-2, P0-4 | New Lambda `/share/card` returning a generated PNG (use `@vercel/og` or `satori`). Cards: streak milestone, dosha result, weekly recap, pillar completion. Branded watermark + UTM. Auto-prompt share at Day 7/21/48 milestones. Add OpenGraph tags so links unfurl beautifully. |
| **P1-6** | **Friend Streaks (buddy match)** | G1 + G2 | M | P0-1, P1-4 | Optional opt-in at Day 1 of cohort. New table `FriendPairs`. Daily silent ping when both check in. Share count visible on dashboard. WhatsApp invite deep-link drives acquisition. |
| **P1-7** | **Sunrise-aware Brahma Muhurta push** | G1 (Vedic moat) | S | P0-1 | Use SunCalc (`suncalc` npm) to compute sunrise per user lat/long (collected at install). Push fires at sunrise − 96 min. Setting in `ReminderSettings`. |
| **P1-8** | **Referral program** | G2 | S | P0-2 | Per-user referral code (8-char nanoid). Public landing `/refer/[code]` with referrer's name + bonus. Reward 100 karma each side at referee Day 7. Track via `Referrals` table. |
| **P1-9** | **Sutra Book preview from Day 1** | G1 | S | P0-2 | Render existing `journey-certificate.tsx` as a 48-page accordion on the `/progress` page. Pages 1..currentDay are populated with the user's journal/mood/check-in highlights; remaining pages locked with a teaser. |
| **P1-10** | **Festival / vrat push calendar** | G1 (Vedic moat) | M | P0-1 | One-off SSG of festival data (Ekadashi, Purnima, Amavasya, Pradosh, Shivaratri, Navratri, Janmashtami) for the next 5 years. New Lambda computes upcoming festival per user location. Push 24 hours before. Surfaces in `<TodaysPractice />` when relevant. |

**P1 total estimate:** ~10–12 weeks of dev work; can mostly run in parallel.

---

## P2 — Backlog (post-P1)

Listed without estimates; sequenced once P0+P1 measurements come back.

### Acquisition
- **P2-1** SEO panchang pages (city × date matrix). High effort, very-long-tail SEO; build only if (P0-3) shows SSR is producing organic growth.
- **P2-2** Hindi UI translation (then Tamil, Telugu).
- **P2-3** Mantra library `/mantras/[name]` public pages (Gayatri, Mahamrityunjaya, Hanuman Chalisa, etc.) — each ranks for high-volume queries.
- **P2-4** YouTube channel + weekly podcast (content production, not engineering).
- **P2-5** "#48DayVedic" branded challenge with TikTok activation. Spawnable variants: "48 Family", "48 Couple", "48 Soft."
- **P2-6** Festival-keyed launch campaigns (PR + press cohort drops).
- **P2-7** Read-only "Stories" feed (Black Lotus model) — UGC for SEO without full social graph risk.

### Completion
- **P2-8** Live group event (weekly 20-min Zoom or audio room).
- **P2-9** Karma Leaderboard within cohort (Top 10 = "Sahasra Tier" badge).
- **P2-10** Year-in-Review / 48-Day Recap card (Spotify Wrapped).
- **P2-11** AI Pandit mode for Vedic Guide (extend existing `/chat` Lambda system prompt; add ritual flows).
- **P2-12** Mantra audio + 108-bead japa counter with haptic feedback.
- **P2-13** Manasic puja flow (DIY 5-min mental offering).
- **P2-14** Nakshatra-tailored daily insight (extends onboarding to capture birth date/place).
- **P2-15** Bandit-algorithm push notification copy A/B (after P0-1 ships and we have ≥1k DAU).

### Quality / infra
- **P2-16** Move JWT from `localStorage` to HttpOnly cookie (PROJECT_FLOW row #6).
- **P2-17** Implement missing auth Lambdas (`/auth/forgot-password`, `/auth/verify-email`, `/auth/reset-password`, OAuth) — currently UI calls 404s (PROJECT_FLOW row #2).
- **P2-18** CloudFront cache + `Promise.all` on reports endpoint (PROJECT_FLOW rows #7, #8).
- **P2-19** Day-49+ post-completion experience (PROJECT_FLOW row #9).
- **P2-20** Structured logging + X-Ray (PROJECT_FLOW row #12).

---

## What I'd Build First (Recommendation)

If you want maximum impact in the next 4 weeks, ship this exact bundle:

### Recommended P0 bundle: "Daily anchor + acquisition funnel"

1. **P0-7** Fix check-in bug (without this, nothing about completion is measurable).
2. **P0-1** Push notifications.
3. **P0-2** Today's Practice hero card.
4. **P0-5** Karma Shield (streak freeze).
5. **P0-3** SSR for public pages.
6. **P0-4** Public Dosha Test funnel.

Together these address: the worst silent bug, the #1 completion lever (push), the #1 dropout cause (choice paralysis on the dashboard), the loss-aversion mechanic that prevents week-3 churn, and the two highest-leverage acquisition surfaces (SEO + dosha funnel). P0-6 (per-pillar karma) ships alongside P0-5 since it's the same file.

**Skip in P0:** anything that requires Lambdas you don't have yet (email, SES, etc.) — those go to P1.

---

## Decision Points for the User

Before specing the top items, three calls to make:

1. **Which 1–3 P0 items do you want to brainstorm + spec next?** I recommend starting with **P0-2 (Today's Practice card) + P0-5 (Karma Shield) + P0-7 (check-in fix)** because they ship in days, are visibly different to existing users, and unlock the rest. P0-1 (push) and P0-3 (SSR) are higher-leverage but bigger projects.
2. **SSR strategy for P0-3:** OpenNext-on-CloudFront upgrade (keeps single deployment, ~2 weeks) vs. splitting `(public)` into a separate Vercel/Cloudflare Pages app (faster ship, two repos). I'd recommend OpenNext.
3. **Cohort start cadence (for P1-4):** monthly New Moon (12/year), weekly (52/year), or on-demand "next cohort starts in N days." I'd recommend monthly New Moon — fits brand, easier to fill, gives press hooks (festival cohorts).

---

*Next: pick top items above, then enter brainstorming mode (one design per feature) before any implementation.*
