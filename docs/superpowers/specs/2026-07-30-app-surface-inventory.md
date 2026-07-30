# App Surface Inventory — every menu tab, what it is, what it reads

> ## ⚠ CURRENT-STATE REFERENCE — NOT A CHANGE REQUEST
>
> This document records the architecture and product semantics that **currently
> exist**. A listed API relationship does not imply that additional
> cross-surface integration should be created. Surfaces explicitly documented as
> disconnected **must remain disconnected** unless a separate approved change
> request says otherwise.
>
> The actionable change request is a different document:
> `2026-07-30-pillar-chapter-coverage-brief.md`. Do not turn this one into an
> implementation plan.

**Date:** 2026-07-30
**Purpose:** Context hand-off. A complete, verified map of the application's navigable surfaces so another model can reason about the app without re-deriving it.
**Accuracy:** Endpoints and mappings below were extracted from source on 2026-07-30, not recalled. Navigation reflects the post-Phase-D model in `src/constants/navigation.ts`.

---

## Rules for future changes

Binding constraints. Violating any of these is a regression, not a design choice.

1. **Journey and Training are different systems.**
   *Journey:* the 48-day programme · 6 Phases · `/data/checkin` · streak · karma.
   *Training:* the educational/book experience · 4 Parts · chapters + activities · `/data/content-progress`.
   **Never infer Training completion from Journey progress, or Journey progress from Training completion.**

2. **Training progress ids are contractual.**
   Chapter → `training-<slug>` (hyphen). Activity → `training:<slug>:<activity>` (colons).
   **Do not normalise these into one separator style.**

3. **The Introduction is structurally exceptional.** It is completable Training
   content but has **no** numbered-chapter learning cycle and exposes **no**
   `#step-*` anchors. Do not generate 8 activities or activity deep links for it.
   The predicate is `hasLearningCycle()` in `training-steps.ts`.

4. **`training-progress.ts` is the sole Training progress writer and chapter-sealing
   authority.** Any future feature needing to mark Training progress must delegate
   to it. **Do not create a second chapter-completion implementation.**

5. **Authored relationships ≠ live relationships.** A coming-soon chapter may carry
   `relatedPillarSlug`, but the Pillar UI must not link to it. User-facing Training
   links must respect published/reachable content.

6. **Do not infer Day N → Chapter N or Phase N → Training Part mappings.** No such
   numerical mapping exists. Connections are semantic, via pillar.

7. **Current deliberate non-connections remain deliberate:** Achievements ↔ Training,
   Goals ↔ Training, Posters ↔ Training. Their presence in navigation or in this
   document is **not** permission to connect them.

8. **Typecheck terminology must stay precise.** Root `tsc --noEmit` covers the Next
   application under the current `tsconfig` exclusions. It does **not** mean every
   Lambda has been typechecked. Do not report "whole project typecheck clean"
   unless `functions/` is independently covered.

---

## 0. Vocabulary (fixed — do not interchange)

| Term | Means |
|---|---|
| **Journey** | The overall **48-day programme**. Owns day number, 6 phases, check-ins, streak, karma. |
| **Training** | The **educational / book** experience: 12 chapters. Separate progress ledger. |
| **Parts** | Training's curriculum grouping (4 Parts). *Not* "Phases". |
| **Pillars** | The 11 **practice domains**. |
| **Sessions** | The **practices themselves** — 15 interactive tabs. |

Journey phases (Foundation → Cleansing → Integration → Expansion → Manifestation → Completion) and Training Parts are **different things** that deliberately no longer share the word "Phase".

---

## 1. Navigation model

Single source: **`src/constants/navigation.ts`**. Desktop sidebar and mobile nav both derive from it, so they cannot drift.

### Desktop sidebar

| Group | Items |
|---|---|
| **TODAY** | Dashboard · Sessions · Journal |
| **JOURNEY** | Training · Pillars · Goals |
| **PROGRESS** | Progress · Achievements · Insights · Reports · Mood |
| **EXPLORE** | Library · Posters · Wisdom · Dosha Quiz |
| **Footer** (icon row) | Reminders · Settings · Admin *(role-gated)* |

### Mobile

Bottom bar: **Today · Practice · Learn · Progress · More**
(`/dashboard`, `/sessions`, `/training`, `/progress`, sheet)

The "More" sheet renders the same four groups minus whatever the bottom bar already covers, so no route appears twice on one screen. All 17 routes remain reachable on both widths (test-enforced).

---

## 2. Tab-by-tab

### TODAY

#### Dashboard — `/dashboard`
The daily home. Phase-tinted banner (Day N of 48 + phase name) with a mandala progress ring, cohort banner, recovery-ritual card (after a 2+ day absence), phase-transition reflection, Daily Brief, Wisdom-of-the-Day short, **Today's Practice** (the one canonical daily action), **Today's Teaching** (link into Training), streak + karma cards, the 11-pillar grid, focus-pillar quick actions, and a Discover row.
*Reads:* `/data/journey`, `/data/checkin`, `/data/reports`, `/data/focus-pillars`, `/data/mood`, `/data/content-progress`, `/data/cohort`, `/data/daily-brief`
*Writes:* `/data/journey` (start journey), `/data/streaks/buy-shield`

#### Sessions — `/sessions`
15 interactive practice tabs: Morning Routine · Fasting · Breathing · Movement · Meditation · Sandhya · Brahman · Manifest · Sleep · Yoga Flow · Yoga Nidra · Dinacharya · Mantra · Manasic Puja · Dosha Quiz. Deep-linkable via `?practice=<key>`. Each tab fires its own check-in on completion.
*Reads/writes (per tab):* `/data/checkin`, `/data/focus-pillars`, `/data/journal`
*Training integration:* accepts `?from=training:<slug>&step=practice|meditation`; on completion marks **only** that activity.

#### Journal — `/journal`
Three authored practices — Today's Gratitude (3 slots, upsert per day), Today's Intention (upsert per day), Manifestation Board (append-only goals with achieved state) — plus **Written Entries**, the generic free-prose list.
*Reads:* `/data/journal`; *writes:* `/data/journal`, `/data/checkin` (gratitude/intention credit their pillars)
*Modes:* `?source=training&chapter=&prompt=` → Training reflection; `?action=gratitude|intention` → pillar practice mode; otherwise ordinary.

---

### JOURNEY

#### Training — `/training`
The 12-chapter book (Introduction + 11). Hero with status, current-chapter card, "this chapter in your daily practice", roadmap of 4 **Parts** (current expanded), honest course totals, achievements link, live-classes card.
*Reads:* `/data/content-progress`
**Currently published: 3** (Introduction, Ch 1, Ch 2). Chapters 3–11 are `coming-soon` and 404 by design.

#### Training chapter — `/training/<slug>`
Five stages over eight tracked activities: **Understand** (Watch · Read) → **Explore** (Key Learnings) → **Practice** (Daily Practices · Guided Meditation) → **Reflect** (Reflection · Self-Assessment · Daily Challenge) → **Complete**. Compact hero for returning readers, cinematic at zero progress; outline rail; chapter seals when the last activity lands.
*The Introduction is different* — `IntroductionExperience`, a ceremonial page with **no learning cycle** and no `#step-` anchors.

#### Pillars — `/pillars`
All 11 practice domains in three tiers — Active today (focus pillars) · Recommended for the current phase · Quietly present — with today's progress bar. Each card shows its practice type (Timer / Journal) and, where a **published** chapter teaches it, a "Ch N" chip.
*Reads:* `/data/checkin`, `/data/focus-pillars`, `/data/journey`

#### Pillar detail — `/pillars/<slug>`
Hero, teaching video, posters, long-form content, practice UI (timer / breathing visualizer / gratitude steps), PDF guide, mark-complete, and — where mapped — a compact Training block linking to the chapter.
*Reads/writes:* `/data/checkin`, `/data/journal`, `/data/journey`, `/data/focus-pillars`

#### Goals — `/goals`
Weekly goals by week number, focus-pillar selector (1–3 pillars), per-pillar completion stats, weekly streak.
*Reads/writes:* `/data/goals`, `/data/focus-pillars`, `/data/journey`, `/data/checkin`

---

### PROGRESS

#### Progress — `/progress`
Consistency score, **Training study card** (read-only), Sutra Book (48-page artifact), weekly trend chart, pillar radar, calendar heatmap, insights, pillar-consistency breakdown, badges.
*Reads:* `/data/reports`, `/data/journey`, `/data/content-progress`

#### Achievements — `/achievements`
Badges and milestones earned across practice.
*Reads:* `/data/achievements`
*Note:* no Training awareness — deliberately out of scope.

#### Insights — `/insights`
AI-generated personalised observations and recommendations.
*Reads:* `/data/insights`

#### Reports — `/reports`
Aggregate reporting over the journey.
*Reads:* `/data/reports`

#### Mood — `/mood`
Mood logging and history; feeds the dashboard reflection card.
*Reads/writes:* `/data/mood`

---

### EXPLORE

#### Library — `/library`
Articles and audio meditations; `/library/article/<slug>` for individual pieces.
*Reads:* `/data/content-progress`

#### Posters — `/posters`
Teaching-poster gallery; `?open=<slug>` deep-links a poster modal.

#### Wisdom — `/wisdom`
Scripture and wisdom quotes.

#### Dosha Quiz — `/dosha-assessment`
Ayurvedic constitution assessment. Also exists as a Sessions tab.

---

### Footer

| Route | What |
|---|---|
| `/reminders` | Notification/reminder scheduling — reads `/data/reminders` |
| `/settings` | Profile, theme, account — reads `/data/user` |
| `/admin` | Admin-only. User list; `/admin/class-registrations` for the cohort roster + CSV export. Role-gated client-side **and** in the Lambda. |

---

## 3. Two independent progress ledgers

This is the single most important thing to understand before changing anything.

| | Journey (48-day practice) | Training (the book) |
|---|---|---|
| Storage | `/data/checkin`, `/data/journey`, `/data/reports` | `/data/content-progress` |
| Units | Day 1–48, 6 phases, 11 pillars | 12 chapters, 8 activities per numbered chapter |
| Metrics | streak, karma, consistency, check-ins | chapters sealed, activities complete |
| Written by | Sessions tabs, pillar detail, journal gratitude/intention | `src/lib/training-progress.ts` **only** |

**Completing Training never moves streak, karma, check-in or journey day.** Reading is not practising. This is enforced by source-guard tests and was verified at runtime on both dev and production.

Key ids: chapter = `training-<slug>` (hyphen); activity = `training:<slug>:<activity>` (colons).

---

## 4. Cross-surface connections (shipped 2026-07-30)

```
Dashboard ──"Today's Teaching"──▶ Training chapter
Training ◀──▶ Sessions   (?from=training:<slug>&step=practice|meditation;
                          completion marks ONLY the launching activity)
Training ◀──▶ Journal    (?source=training&chapter=&prompt=;
                          prose saves first, then Training progress)
Training ───▶ Progress   (read-only summary)
Training ◀──▶ Pillars    (semantic "taught in Chapter N", published only)
```

Deliberately **not** connected: Achievements, Goals, Posters.
Deliberately **absent**: any Day N → Chapter N mapping. Connections are semantic, via pillar.

---

## 5. Shared modules worth knowing

| Module | Owns |
|---|---|
| `src/constants/navigation.ts` | The nav model for both desktop and mobile |
| `src/constants/pillars.ts` | The 11 pillars |
| `src/data/training-book.ts` | All chapter content |
| `src/lib/journey-phases.ts` | The 6 Journey phases |
| `src/lib/practice-routes.ts` | Pillar → Sessions tab / Journal action |
| `src/lib/learning-map.ts` | Chapter ↔ pillar ↔ session join; published-only filtering |
| `src/lib/training-steps.ts` | Activities, the 5 stages, `hasLearningCycle()` |
| `src/lib/training-selection.ts` | Current chapter, next activity, whole-course counts (pure) |
| `src/lib/training-progress.ts` | **The only writer of Training progress and the only chapter-sealing authority** |
| `src/lib/training-return-context.ts` | Training ↔ Sessions URL contract + validation |
| `src/lib/journal-context.ts` | Training ↔ Journal context + mode precedence |

---

## 5a. The 11 Pillars — practice route vs Training chapter

**A pillar has two independent relationships.** Confusing them is the most likely
error when reading this document:

| | Practice relationship | Training relationship |
|---|---|---|
| Goes to | Sessions tab or Journal | Training chapter |
| Purpose | **Do** the practice | **Learn** the teaching |
| Owned by | `src/lib/practice-routes.ts` | `src/lib/learning-map.ts` |
| Coverage | **11 of 11** | 7 of 11 authored, **2 live** |

Generated from source 2026-07-30:

| Pillar | Practice route | Training chapter |
|---|---|---|
| 5 AM Initiation | Sessions · `morning-routine` | — none — |
| Vedic Nutrition + Fasting | Sessions · `fasting` | Ch 8 Nutrition and Fasting *(coming-soon)* |
| Thoughts & Intention Reset | Journal · `intention` | Ch 2 Consciousness & Self-Awareness ✅ **published** |
| Breathing + Meditation | Sessions · `breathing` | — none — |
| Movement Everyday | Sessions · `movement` | Ch 9 Movement, Exercise and Sleep Optimization *(coming-soon)* |
| Healing Meditation | Sessions · `meditation` | Ch 3 Meditation & Healing *(coming-soon)* |
| Gratitude Practice | Journal · `gratitude` | Ch 6 Relationships, Family & Community *(coming-soon)* |
| Sandhya Meditation | Sessions · `sandhya` | — none — |
| Connection to Brahman | Sessions · `brahman` | Ch 1 Connect to the Self and the Universe ✅ **published** |
| Divine Manifestation | Sessions · `manifestation` | Ch 10 Creation, Manifestation & Transformation *(coming-soon)* |
| Sleep Optimization | Sessions · `sleep` | — none — |

**Every pillar already has a practice experience** — 9 via a Sessions timer, 2 via
the Journal. The four pillars with no chapter are **practice-only**, not
content-less:

> 5 AM Initiation, Breathing + Meditation, Sandhya Meditation and Sleep
> Optimization each have a real, interactive Sessions practice. What they lack is
> the **book teaching**, not the practice.

**Consequence for any future chapter-writing work:** a new chapter for one of
these pillars should supply the *why* — philosophy, principles, preparation — and
then **send the learner into the existing Session** via the practice deep link.
It must **not** rebuild the Session's interactive experience inside the chapter.
That routing already exists: `linkForChapter()` produces
`/sessions?practice=<key>&from=training:<slug>&step=practice|meditation`.

**Sessions tabs are a superset of pillars.** There are 15 tabs; only 9 are the
target of a pillar practice route. The other 6 — Yoga Flow, Yoga Nidra,
Dinacharya, Mantra, Manasic Puja, Dosha Quiz — are standalone activities owned by
no pillar. Do not assume tab ↔ pillar is one-to-one.

---

## 6. Current content state

- **Training:** 3 of 12 chapters published. 9 are `coming-soon` and unreachable by design (`generateStaticParams` + `dynamicParams = false`).
- **Pillars ↔ Training:** 7 of 11 pillars have a chapter; **2 published**, so only 2 show a chip. Four pillars (5 AM Initiation, Breathing + Meditation, Sandhya Meditation, Sleep Optimization) have **no chapter at all** — see the companion brief `2026-07-30-pillar-chapter-coverage-brief.md`.
- **Pillars ↔ Sessions:** all 11 have a practice route — 9 to a Sessions timer, 2 (Gratitude, Thoughts & Intention) to the Journal.

---

## 7. Health

`tsc --noEmit` clean · `next build` clean, 90/90 static pages · **205 tests passing**.
Deployed to production 2026-07-30; gate passed on both dev and production.

Caveat: `tsconfig.json` **excludes** `functions/`, `sst.config.ts`, `scripts/` and `mobile/` — "tsc clean" covers the Next app only, not the Lambdas.
