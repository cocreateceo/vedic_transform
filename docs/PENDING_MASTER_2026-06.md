---
title: "10X Vedic Transform — Consolidated Pending Master List"
date: "2026-06-17"
supersedes_status_in: ["docs/COMPETITOR_GAP_ANALYSIS.md", "docs/ROADMAP.md", "docs/SITE_AUDIT_2026-06.md", "docs/pillar-research/README.md"]
method: "Pure synthesis — de-duplicates every gap across the four research docs, re-checked against the live codebase. No new research."
---

# 10X Vedic Transform — Consolidated Pending Master List

**One list to work from.** This merges every open item across the competitor gap analysis
(May 8), the prioritized roadmap (May 8), the live-site audit (Jun 14), and the 11 pillar
research dossiers — then re-verifies status against the current code so nothing already
shipped is re-listed.

**Status legend**

| Tag | Meaning |
|-----|---------|
| 🟥 **OPEN** | Not started — zero code. |
| 🟧 **PARTIAL** | Foundation exists but the user-facing payoff is incomplete. |
| 🟩 **SHIPPED** | Done since the original research (listed only to stop re-recommending). |

**Effort:** S = 1–3 days · M = 4–10 days · L = 2–4 weeks · XL = 1 month+.

---

## 0. What already shipped (do NOT re-scope)

Confirmed in the codebase / recent commits, closing items the older docs still list as gaps:

- 🟩 **Push notifications** (PWA, VAPID, `PushSubscriptions` table)
- 🟩 **Karma Shields** (streak freeze) + **per-pillar karma points**
- 🟩 **Public Dosha Test funnel** with a real OG share image
- 🟩 **SSR foundation** for public pages — they are genuinely crawlable now
- 🟩 **Shared pillar infrastructure** (commits `01ce237`→`1c34ef4`): sunrise/sunset **solar
  scheduler**, reusable **guided-audio player**, generalized **breath pacer** (presets + holds)
- 🟩 **Citation-integrity pass (most of it)** — the fabricated "90% of thoughts" stat is now
  caveated, the movement/antidepressant claim is nuanced with a 2024 citation, and the
  debunked "metabolic waste / autophagy / RAS" claims are gone from `pillar-content.ts`.
- 🟩 **Most of the June-14 "quick wins"** (verified in code 2026-06-17): first-run consent
  gating of Daily Wisdom (`daily-wisdom-popup.tsx:26-30`), cookie "Accept All" reactive (no
  reload, `cookie-consent.tsx:22`), `/mood` disabled-CTA neutral styling + helper, the
  `CustomTooltip` hoist, the sitemap `dosha-test` + per-dosha entries, and the in-app
  **recovery ritual** card (built *and* wired at `dashboard/page.tsx:263`).

> ⚠️ **Staleness note:** the June-14 audit it was built on is moving fast. Rows below were
> re-checked against code on 2026-06-17; treat any unverified row as "confirm first."

---

## 1. The headline: three things still hold the product back

1. **No money path at all.** Zero payment/paywall/subscription code. Karma can't even be spent.
   Highest-severity strategic gap (`SITE_AUDIT` P0-3).
2. **No email lifecycle.** Push only reaches PWA opt-ins; email is the universal Day-3/7/14/30
   + "missed 3 days" channel. Single biggest *remaining* retention lever.
3. **The growth/share layer is half-built.** SSR is live but there's **zero JSON-LD**, **no OG
   images/canonicals** on most pages, share buttons emit **plain text**, and the dosha funnel
   isn't in the sitemap. SEO is crawlable but not *rankable* or *shareable*.

---

## 2. Pending master table (grouped by theme, de-duplicated)

Each row carries its origin ID(s) so you can trace back: `R#` = ROADMAP, `C#/A#` = gap analysis,
`SA` = site audit, `CP` = cross-pillar synthesis.

### 2.1 💰 Monetization — *nothing monetizes today*

| ID | Item | Status | Effort | Origin |
|----|------|--------|--------|--------|
| **M1** | **Payment path** — `Subscriptions` table + soft paywall | 🟧 SCAFFOLDED 2026-06-19 — table, pure entitlement logic (+tests), provider-agnostic `createCheckout()` (none→501), GET/POST subscription routes, `useEntitlement` + `<Paywall>` + `/upgrade`. **Needs:** wire a gateway in `functions/lib/payments.ts` + `PAYMENTS_PROVIDER`/keys | L | SA-P0-3 |
| **M2** | **Karma store / spend sink** — "buy a Shield (200 karma)", premium unlocks | 🟧 PARTIAL (shields auto-granted only) | S | SA, R-P0-5 |

### 2.2 🔁 Retention & Completion

| ID | Item | Status | Effort | Origin |
|----|------|--------|--------|--------|
| **RC1** | **Email lifecycle / win-back** — Day-1/3/7/14/21/30/48 + "missed 3 days" | 🟧 SCAFFOLDED 2026-06-19 — pure `decideLifecycleEmail()` (+tests), provider-agnostic `sendEmail()` (console no-op default, SES stub), templates, HMAC unsubscribe + handler, hourly cron, dedup on ReminderSettings. **Needs:** implement `sendViaSes()` + `EMAIL_PROVIDER`/`EMAIL_FROM` | M | R-P1-2, SA-P0-4 |
| **RC2** | **In-app recovery ritual** — dashboard card when `daysAway ≥ 2`, 3-min reset CTA | 🟩 SHIPPED (`recovery-ritual-card.tsx`, wired `dashboard/page.tsx:263`) | — | R-P1-3, SA-P0-5, C6 |
| **RC3** | **Day-gated curriculum** — `JourneyDayContent` table; "Today's Practice" required-vs-optional; Day 5 ≠ Day 45 | 🟧 PARTIAL (phasing is visual only, nothing gated) | L | R-P1-1, C2 |
| **RC4** | **"Today's Practice" hero card** | 🟩 SHIPPED (`todays-practice.tsx`, wired on dashboard) | S | R-P0-2, C3 |
| **RC5** | **Cohort start dates** ("New Moon cohorts") — `Cohorts` table + onboarding step | 🟥 OPEN | M | R-P1-4, C8 |
| **RC6** | **Friend streaks / accountability buddy** — opt-in pairing, daily ping | 🟥 OPEN | M | R-P1-6, C5 |
| **RC7** | **Sutra Book preview from Day 1** | 🟩 SHIPPED 2026-06-19 — `SutraBook` 48-page grid on `/progress`, pages unlock with journey day | S | R-P1-9, C10 |

### 2.3 📈 Acquisition / SEO / Virality

| ID | Item | Status | Effort | Origin |
|----|------|--------|--------|--------|
| **AQ1** | **JSON-LD structured data** | 🟩 SHIPPED 2026-06-19 — Article (blog/[slug]), Course (how-it-works), ItemList (pillars-overview), AboutPage, ContactPage + existing FAQPage + Organization/WebSite | M | SA-P0-6 |
| **AQ2** | **OG images + canonicals + per-page metadata** | 🟩 SHIPPED 2026-06-19 — centralized `src/lib/seo.ts` `pageMetadata()`; OG/canonical/twitter on about, how-it-works, pillars-overview, contact, blog, blog/[slug], testimonials, faq | S–M | SA-P0-7, SA-P1 |
| **AQ3** | **Real shareable image cards** + auto-prompt at Day 7/21/48 | 🟩 SHIPPED 2026-06-19 — `share-links.ts` (+tests) → `/share` OG cards; `MilestoneCelebration` auto-prompt on dashboard | M | R-P1-5, A3 |
| **AQ4** | **`/dosha-test/` in sitemap** + indexable `/dosha-test/[dosha]` guide pages | 🟩 SHIPPED (`sitemap.ts` + `(public)/dosha-test/[dosha]`) | — | SA quick-win + P1 |
| **AQ5** | **Referral program** — per-user code, `/refer/[code]`, 100 karma both sides at referee Day 7 | 🟥 OPEN | S | R-P1-8, A5 |
| **AQ6** | **Scale blog + Article schema** (currently 6 posts) — per-pillar/per-dosha/per-practice | 🟥 OPEN | L | SA-P1, A* |
| **AQ7** | **Unblock + build public `/library` & `/wisdom`** (robots currently disallows rankable mantra/wisdom content) | 🟥 OPEN | M | SA-P2 |
| **AQ8** | **RSS feed + `llms.txt`** | 🟩 SHIPPED 2026-06-19 — `/feed.xml` (RSS 2.0 of blog posts) + `public/llms.txt` + RSS `<link>` in root metadata | S | SA-P2 |
| **AQ9** | **Mantra library public pages** `/mantras/[name]` (Gayatri, Mahamrityunjaya, Hanuman Chalisa…) | 🟥 OPEN | M | A11, R-P2-3 |
| **AQ10** | **Hindi UI** (then Tamil, Telugu) | 🟥 OPEN | L | A6, R-P2-2 |
| **AQ11** | **SEO panchang pages** (city × date) | 🟧 **STARTED** — engine + ISR `/panchang` page (New Delhi) shipped. Next: parameterize per city/date (`/panchang/[city]/[date]`) for the long-tail matrix. | XL | A4, R-P2-1 |
| **AQ12** | **YouTube + podcast funnel**, **#48DayVedic challenge**, **festival-keyed campaigns** (content/marketing, not eng) | 🟥 OPEN | — | A7/A8/A9, R-P2-4..6 |

### 2.4 📚 Content depth & credibility (from the 11 dossiers)

| ID | Item | Status | Effort | Origin |
|----|------|--------|--------|--------|
| **CT1** | **Citation-integrity sweep** | 🟩 COMPLETE (verified 2026-06-19) — BG 7.8 now quotes the full verse (`pillar-content.ts:468`), brainwave claims cited (line 502), *abrahmacharya* correctly glossed (635); the fabricated "metabolic waste / 30 hormonal phases / RAS / delta" claims are all gone | S | CP-§1 |
| **CT2** | **Translator labels on every verse** — quote verbatim, attribute the translator (Easwaran paraphrases are presented as literal text) | 🟥 OPEN | S | CP-§1 |
| **CT3** | **Safety layer** | 🟩 Healing Meditation adverse-effects note SHIPPED (`pillar-content.ts:328`, Lindahl & Britton 2017). Nutrition/Manifestation framing — spot-check if pursuing further | S | CP-§3 |
| **CT4** | **Per-pillar depth** — work each dossier's §6 prioritized table in impact×effort order (deeper verified verses + stronger studies) | 🟥 OPEN | L (ongoing) | CP-§3, all dossiers |
| **CT5** | **Measurable self-tests** — Sitting-Rising Test (Movement), HRV (Breathing), sleep latency (Sleep) so progress is tracked, not just claimed | 🟥 OPEN | M | CP-§2 |
| **CT6** | **Per-dosha default selections** — e.g. default breath preset by Vata/Pitta/Kapha (the new pacer makes this cheap) | 🟥 OPEN | S | infra plan follow-on |

### 2.5 🕉️ Vedic moat (defensible, none of the incumbents can copy)

| ID | Item | Status | Effort | Origin |
|----|------|--------|--------|--------|
| **V1** | **Sunrise-aware Brahma Muhurta *push*** — solar engine ships client-side; still need the server cron firing push at sunrise−96min | 🟧 PARTIAL (compute done; no server push) | S | R-P1-7, infra follow-on |
| **V2** | **Festival / vrat push calendar** — Ekadashi, Purnima, Amavasya, Pradosh, Shivaratri, Navratri, Janmashtami | 🟧 **UNBLOCKED** — `src/lib/panchang` engine shipped (tithi/nakshatra/yoga/karana). Next: scan dates for target tithis → festival list + push cron. | M | R-P1-10 |
| **V3** | **Mantra audio + 108-bead japa counter** with haptics | 🟩 SHIPPED (already built — `mantra-practice.tsx`: ring, 4 mantras, haptics, bead sound) | M | R-P2-12 |
| **V4** | **AI Pandit mode** for the Vedic Guide (ritual flows, samagri, muhurta) | 🟩 SHIPPED 2026-06-19 — Pandit-mode block in chat system prompt | M | R-P2-11 |
| **V5** | **Nakshatra-tailored daily insight** | 🟧 **UNBLOCKED** — nakshatra calc shipped (`src/lib/panchang`). Next: capture birth date/time/place in onboarding → birth-moon nakshatra → tailor insight. | M | R-P2-14 |
| **V6** | **Manasic puja flow** | 🟩 SHIPPED 2026-06-19 — `ManasicPractice` shodashopachara stepper, Sessions tab | S | R-P2-13 |

### 2.6 🎨 UX & first-run (live-site audit)

| ID | Item | Status | Effort | Origin |
|----|------|--------|--------|--------|
| **UX1** | **Mobile fixed-element overlap** — chat FAB + cookie banner + bottom-nav collide | 🟥 OPEN | M | SA-P0-1 |
| **UX2** | **First-run double interruption** — gate Wisdom behind consent | 🟩 SHIPPED (`daily-wisdom-popup.tsx:26-30`) | — | SA-P0-2 |
| **UX3** | **`/mood` disabled CTA contrast** + helper text | 🟩 SHIPPED (`mood-client.tsx:278-290`) | — | SA quick-win |
| **UX4** | **Cookie "Accept All" full page reload** → reactive | 🟩 SHIPPED (`cookie-consent.tsx:22`) | — | SA quick-win |
| **UX5** | **Top-bar nav ≠ sidebar** (two mental models) — make top bar a true subset | 🟥 OPEN | S | SA-P1 |
| **UX6** | **`/library` has no pagination** (~33,000px tall on mobile) | 🟥 OPEN | M | SA-P2 |
| **UX7** | **Jargon with no first-use explainer** (Karma Shields, Sadhaka, Antevasin, Sankalpa) | 🟥 OPEN | S | SA-P2 |
| **UX8** | **Visual monotony** — wall of identical orange cards; differentiate by type | 🟥 OPEN | M | SA-P2 |
| **UX9** | **Barren `/progress` zero-state** for demo/preview account — seed sample data | 🟥 OPEN | S–M | SA-P2 |
| **UX10** | **Landing page** — low section contrast, small hero stats | 🟥 OPEN | M | SA-P2 |

### 2.7 ⚙️ Performance & infra / tech-debt

| ID | Item | Status | Effort | Origin |
|----|------|--------|--------|--------|
| **PF1** | **`avatar_sprite_circular.png`** — now **1.96 MB** (was 16.4 MB, compressed Jun 14); still a CSS `background-image` sprite-sheet. Optional further win → WebP/resize | 🟧 PARTIAL | S | SA quick-win |
| **PF2** | **`_next/image` optimizer 500/502s** — deploy image-opt fn from Linux/WSL/CI, 404 on missing source | 🟥 OPEN | M | SA-P1 |
| **PF3** | **Authed shell ships ~1.39 MB JS, blank until hydration** — auth gate in middleware/RSC, trim shared chunk | 🟥 OPEN | L | SA-P1 |
| **PF4** | **recharts (~348 KB) statically imported** on all chart routes — `next/dynamic({ssr:false})` | 🟥 OPEN | M | SA-P1 |
| **PF5** | **`CustomTooltip` hoist** in WeeklyTrendChart | 🟩 SHIPPED (`weekly-trend-chart.tsx:17-34`) | — | SA quick-win |
| **PF6** | **~30 "setState in effect" warnings** → extra render + hydration flash | 🟥 OPEN | M | SA-P2 |
| **PF7** | **Windows deploys non-deterministic** (OpenNext dep install fails, Pulumi self-upgrade) — move to CI/Linux, pin Pulumi | 🟥 OPEN | M | SA-P2 |
| **PF8** | **112 KB legacy polyfills** — tighten browserslist | 🟥 OPEN | S | SA-P2 |
| **PF9** | **JWT in `localStorage` → HttpOnly cookie** | 🟥 OPEN | M | R-P2-16 |
| **PF10** | **Missing auth Lambdas** (`/auth/forgot-password`, `/verify-email`, `/reset-password`, OAuth) — UI calls 404 | 🟥 OPEN | M | R-P2-17 |
| **PF11** | **CloudFront cache + `Promise.all` on reports endpoint** | 🟥 OPEN | S | R-P2-18 |
| **PF12** | **Structured logging + X-Ray** | 🟥 OPEN | S | R-P2-20 |
| **PF13** | **Day-49+ post-completion experience** | 🟥 OPEN | M | R-P2-19 |

---

## 3. Recommended sequencing (impact × effort)

**Phase 1 — Stop the bleeding:** ⚠️ **mostly already shipped** (UX2/UX3/UX4, PF5, AQ4, RC2 all
done as of 2026-06-17). The only genuinely-open item is **UX1** (mobile fixed-element overlap —
chat FAB + cookie banner + bottom-nav collide on authed mobile first-load), plus optional **PF1**
polish (1.96 MB sprite → WebP). UX1 is an S; treat Phase 1 as effectively closed after it.

**Phase 2 — Make growth rankable & shareable (2–3 weeks):** AQ1 (JSON-LD), AQ2 (OG/canonicals),
AQ3 (real share cards), AQ5 (referral). Reuses live SSR + `next/og` + push infra.

**Phase 3 — Retention channel (2–3 weeks):** RC1 (email lifecycle) — the biggest remaining
retention lever — then RC4/RC3 (Today's Practice → day-gated curriculum).

**Phase 4 — Money (3–4 weeks):** M1 (Razorpay + soft paywall) + M2 (karma store). Highest
strategic severity; nothing monetizes today.

**Continuous track — credibility & moat:** CT1–CT3 (finish citation sweep + translator labels +
safety notes — cheap, high-trust), then V1 (solar push) and CT4/CT5 per-pillar depth.

---

## 4. Source map

| Doc | Date | Role now |
|-----|------|----------|
| `COMPETITOR_GAP_ANALYSIS.md` | May 8 | Original 28-app benchmark + C/A gap IDs |
| `ROADMAP.md` | May 8 | Original P0/P1/P2 + implementation sketches (R# IDs) |
| `SITE_AUDIT_2026-06.md` | Jun 14 | Live-site status — supersedes the above on what shipped |
| `pillar-research/` (11 dossiers + README synthesis) | — | Content depth, citation audit, per-pillar gaps (CP / dossier §6) |
| **This doc** | **Jun 17** | **De-duplicated single backlog; re-verified against code** |

> Per-item implementation sketches still live in `ROADMAP.md` (R# IDs) and `SITE_AUDIT_2026-06.md`.
> This list is the index; those are the detail.
