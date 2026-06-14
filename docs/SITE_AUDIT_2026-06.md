# 10X Vedic Transform — End-to-End Site Audit & Improvement Plan

**Date:** 2026-06-14
**Method:** 4 parallel audits of the **live** site (https://10x.vedics.net) — performance (real Playwright timings), UX (logged-in page-by-page), SEO/acquisition (raw-HTML inspection), and features/retention/monetization (code-verified). Builds on `COMPETITOR_GAP_ANALYSIS.md` (2026-05-08); only **current** gaps are listed.

---

## Executive summary

**Good news first.** The site is *not* slow — CloudFront serves every route with TTFB 150–310 ms and `load` < 600 ms; public pages are genuinely server-rendered and crawlable; and a lot of the May backlog **shipped**: push notifications, Karma Shields (streak freeze), per-pillar karma, journey phases, the public dosha funnel with a real share card, and basic SEO metadata.

**The real "lags" are three things, none of which are raw page speed:**

1. **Money & retention channels are at zero or push-only.** There is **no payment path of any kind**, **no email lifecycle**, and the recovery flow is a push with no in-app landing. Outside PWA-push opt-ins, returning users are unreachable.
2. **First-run & mobile UX is rough.** On mobile, three fixed elements (chat bubble, cookie banner, bottom-nav) stack and overlap; on first load the Daily-Wisdom modal and cookie banner fire together — two dismissals before any content.
3. **The growth/share layer is half-built.** Share buttons share *plain text* (only the dosha result renders an image), there's **zero JSON-LD** sitewide, **no OG images / canonicals** on most pages, and the dosha funnel isn't even in the sitemap.

Plus a few concrete perf debts: a **16 MB raw PNG** loaded on every chat open, a **1.4 MB client-only authed shell**, charts (recharts ~348 KB) statically imported everywhere, and an **image optimizer that 500/502s** because it's deployed from Windows.

---

## P0 — Fix first (broken or highest-leverage)

| # | Item | Category | Why P0 | Effort |
|---|---|---|---|---|
| 1 | **Mobile fixed-element overlap** — chat FAB + cookie banner + bottom-nav collide; consent text and nav are covered | UX | Looks broken on first mobile visit; can't read consent or reach nav | M |
| 2 | **First-run double interruption** — Daily-Wisdom modal + cookie banner appear together | UX | Worst-possible first impression; gate Wisdom behind consent | S |
| 3 | **No monetization path at all** — zero payment/subscription/paywall code or deps | Money | No revenue; karma can't even be spent; LTV uncapturable. Razorpay (India-first) + soft paywall + karma store | L |
| 4 | **No email lifecycle / win-back** — no SES, no email pkg | Retention | Push only reaches PWA opt-ins; email is the universal Day-3/7/14/30 + "missed 3 days" channel — the single biggest remaining retention lever | M |
| 5 | **In-app recovery ritual missing** — only `recovery-push.ts` exists; returning user lands on the same dashboard | Retention | The moment of return is wasted. Dashboard overlay when `daysSinceLast ≥ 2` (3-min reset). **Small effort, high value** | S |
| 6 | **Zero JSON-LD structured data sitewide** — no Organization/FAQPage/Article/Course | SEO | Blocks rich results, PAA, and AI-search citations; content is already crawlable so this is near-pure upside | M |
| 7 | **No OG images + no canonicals on most pages** — every social/WhatsApp share is a bare text link; trailing-slash dupes uncanonicalized | SEO | Kills share CTR on the primary growth channel + duplicate-URL risk | S–M |

---

## Quick wins (low effort, ship this week)

- **Compress the 16 MB `avatar_sprite_circular.png`** (chat assistant loads it raw on every open; also 502s the optimizer) → WebP/resized < 200 KB. *(S)*
- **Hoist `CustomTooltip`** out of `WeeklyTrendChart`'s render body → kills the "component created during render" remount bug. *(S)*
- **Fix `/mood` disabled CTA contrast** — pale-orange-on-cream reads as broken; use a neutral gray disabled style + "select a mood" helper. *(S)*
- **Remove the full-page reload on cookie "Accept All"** (mount analytics reactively instead). *(S)*
- **Add `/dosha-test/` (+ result) to `sitemap.ts`** — the top funnel isn't surfaced to crawlers. *(S)*
- **Add `FAQPage` + `Organization` JSON-LD** (answers already crawlable). *(S)*
- **Add `alternates.canonical` + per-page `openGraph`** to the 8 marketing pages missing them. *(S)*

---

## Full findings

### Performance & Technical

| Sev | Issue | Evidence | Fix | Effort |
|---|---|---|---|---|
| P1 | `_next/image` optimizer 500s on missing source, 502s on the 16 MB PNG | `/_next/image?url=/logo.png` → 500; `…avatar_sprite…` → 502; valid → 200 | Deploy image-opt fn from Linux/WSL/CI; 404 (not 500) on missing source | M |
| P1 | 16 MB raw PNG via CSS `background-image` in chat | `public/avatar_sprite_circular.png` = 16.4 MB, `vedic-assistant.tsx:289,308` | Compress to < 200 KB WebP | S |
| P1 | Authed shell ships ~1.39 MB JS, blank until hydration (client-only `AuthGuard`) | 1385 KB JS on /dashboard, /library, /sessions, /progress; `(main)/layout.tsx` is `"use client"` | Auth gate in middleware/RSC; trim shared chunk; lazy-load widgets | L |
| P1 | recharts (~348 KB) statically imported on all chart routes | `2893-*.js` 348 KB; static `from "recharts"` in 3 components | `next/dynamic(..., {ssr:false})` for charts | M |
| P1 | `CustomTooltip` created during render → remounts each render | `weekly-trend-chart.tsx:49 → 137` | Hoist to module scope | S |
| P2 | ~30+ "setState in effect" warnings → extra render + hydration flash | `layout.tsx:21`, `ui/analytics.tsx:14`, `cookie-consent.tsx:13`, etc. | Read storage synchronously / `useSyncExternalStore` | M |
| P2 | Windows deploys non-deterministic (OpenNext dep install fails, Pulumi self-upgrade bug) | build "Could not install dependencies"; confirmed by 500/502 | Move deploys to CI (Linux)/WSL; pin Pulumi | M |
| P2 | 112 KB legacy polyfills shipped | `polyfills-*.js` 112 KB | Tighten `browserslist` | S |

### UX & Product

| Sev | Page | Issue | Fix | Effort |
|---|---|---|---|---|
| P0 | mobile/all | Chat FAB + cookie banner + bottom-nav stack & overlap | z-index/stack ordering + safe-area padding; hide FAB while banner shown | M |
| P0 | dashboard | Daily-Wisdom modal + cookie banner both on first load | Gate Wisdom behind consent resolution | S |
| P1 | /mood | Disabled "Log Mood" CTA invisible (contrast fail) | Neutral disabled style + helper text | S |
| P1 | all authed | Top-bar nav (4 items) ≠ sidebar (12+) — two mental models | Make top bar a true subset, or drop it on authed pages | S |
| P1 | cookie | "Accept All" does full `window.location.reload()` (laggy); "Necessary" doesn't | Remove reload; mount analytics reactively | S |
| P2 | /library | Entire catalog in one list (~33,000 px tall mobile), no pagination | Paginate / "load more" / windowed list | M |
| P2 | dashboard | Jargon (Karma Shields, Sadhaka, Antevasin, Sankalpa) with no first-use explainer | Tooltips / one-time hints | S |
| P2 | library/pillars | Visual monotony — wall of identical orange cards | Differentiate by type; reduce orange saturation | M |
| P2 | /progress | Barren zero-state for the demo/preview account | Seed demo data or show sample state | S–M |
| P2 | / (landing) | Long, uniformly dark, low section contrast; small hero stats | Tighten spacing, vary backgrounds, enlarge stats | M |

**Genuinely good (keep):** strong empty states on Journal/Goals/Mood; polished guided Sessions flow (Step 1 of 6); clear dashboard primary action + reward loop; Daily-Wisdom correctly throttled once/day; clean mobile reflow apart from the fixed-element bug.

### SEO & Acquisition

| Sev | Issue | Evidence | Fix | Effort |
|---|---|---|---|---|
| P0 | Zero JSON-LD on all pages | `ld+json blocks = 0` everywhere | Organization+WebSite, FAQPage, Article, Course | M |
| P0 | No `og:image`/`twitter:image` on most pages | grep empty on /, blog, etc. (dosha is the only one) | Generate OG images per page type; `summary_large_image` | S–M |
| P1 | No canonical tag on any page; trailing-slash dupes | `<link rel=canonical>` empty on 10+ pages | `alternates.canonical` per route | S |
| P1 | Metadata missing on 8/10 marketing pages | OG/Twitter empty on how-it-works, faq, blog, about… | Per-page metadata exports | S |
| P1 | No SEO-rankable per-dosha pages; funnel not in sitemap | `/dosha-test/vata` → 404; `/dosha-test/` absent from `sitemap.xml` (16 URLs) | Add indexable `/dosha-test/[dosha]` guide pages + sitemap entry *(the post-test share card already works)* | M |
| P1 | Blog = 6 posts; no Article schema/canonical/OG | sitemap lists 6 `/blog/*` | Scale per-pillar/per-dosha/per-practice content + Article schema | L |
| P2 | robots blocks `/library`, `/wisdom` (rankable mantra/wisdom content) | `robots.txt` Disallow list | Build public indexable versions, then unblock | M |
| P2 | No RSS feed, no `llms.txt` (AI-crawler discovery) | `/feed.xml`, `/llms.txt` → 404 | Add both | S |

### Features, Retention & Monetization

**Since-May status:** Push **CLOSED** · Streak-freeze (Karma Shields) **CLOSED** · Per-pillar karma **CLOSED** · Public dosha funnel + OG card **CLOSED** · SSR/SEO foundation **PARTIAL** · Curriculum phasing **PARTIAL (visual only, nothing gated)** · Recovery **PARTIAL (push only)** · Shareable artifacts **WEAK (text only)** · Email / cohorts / referral / **payments** **OPEN (0 files)**.

| Sev | Gap | Status | Fix | Effort |
|---|---|---|---|---|
| P0 | No monetization (no payment/paywall/deps) | OPEN | Razorpay + `Subscriptions` table + soft paywall + karma store (shields as sink) | L |
| P0 | No email lifecycle/win-back | OPEN | SES + React-Email Lambda + signed unsubscribe | M |
| P0 | In-app recovery ritual | PARTIAL | Dashboard overlay when `daysSinceLast ≥ 2` (3-min reset, logged as recovery) | S |
| P1 | Real shareable image artifacts (streak/recap/badge cards) | WEAK | Generalize `api/og/` (proven by dosha) to milestones; auto-prompt share at Day 7/21/48 | M |
| P1 | Cohorts / accountability buddy | OPEN | `Cohorts` table + "New Moon cohort" onboarding step; later buddy match | M–L |
| P1 | Referral program | OPEN | Per-user code + `/refer/[code]` + 100-karma both sides at referee Day 7 | S |
| P2 | Curriculum not day-gated (phasing visual only) | PARTIAL | `JourneyDayContent` table + "Today's Practice" required-vs-optional | L |
| P2 | Karma has no spend sink (shields auto-granted only) | PARTIAL | "Buy shield 200 karma" + karma store (ties to monetization) | S |

---

## Recommended sequencing

**Phase 1 — "Stop the bleeding" (1 week, mostly S):** all Quick Wins above + P0 UX #1/#2 + in-app recovery ritual (#5). Fixes the broken first impression and the worst perf/SEO foot-guns with low risk.

**Phase 2 — Retention channel (2–3 weeks):** email lifecycle (#4) + real share-card artifacts + referral. Turns one-time visitors into a loop; all reuse existing infra (JWT/Users, `next/og`, push crons).

**Phase 3 — Money (3–4 weeks):** Razorpay + soft paywall + karma store. The highest-severity strategic gap; nothing monetizes today.

**Phase 4 — Growth depth (ongoing):** programmatic SEO (per-pillar/per-dosha/per-practice pages + Article schema), cohorts, and the authed-shell SSR refactor (1.4 MB → server-rendered).

> Detailed competitor evidence and the original ranked C/A gap list remain in `COMPETITOR_GAP_ANALYSIS.md`. This document supersedes it on *current* status.
