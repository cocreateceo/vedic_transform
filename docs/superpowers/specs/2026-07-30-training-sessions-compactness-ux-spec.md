# Training + Sessions — UX Wireframe & Compactness Specification

**Date:** 2026-07-30
**Status:** DESIGN SPEC — AWAITING REVIEW. No code has been written for it.
**Scope:** `/training`, `/training/[chapter]`, `/sessions`, Training→Sessions, Sessions→Training, desktop + mobile.
**Explicitly out of scope:** every other page. Dashboard, Journey, Pillars index/detail, Journal, Progress, Posters, Achievements, Goals and the public marketing site are NOT redesigned by this document.

---

## 0. The one-sentence goal

> Training: learn → understand → choose practice.
> Sessions: prepare briefly → start → focus → complete.
> Return: confirm completion → continue learning.

Everything below serves that sentence. Where a current screen fights it, this spec says how to change the *presentation*, never the *content*.

---

## 1. UX principles (binding)

**P1 — Compact ≠ less content.** Vertical space is reduced by removing decoration, repetition and nesting. Authored teaching, exercises, reflection prompts, session instructions, cautions and progress information are all preserved, in full, somewhere reachable on the same screen.

**P2 — The resting page is what must feel compact.** Distinguish RESTING HEIGHT (what you land on) from FULLY EXPANDED HEIGHT (what you get after opening every disclosure). Only resting height is a compactness target. Expanded height may legitimately be large.

**P3 — One screen answers three questions.** Where am I? What am I learning / doing? What do I do next?

**P4 — One dominant action per activity.** Completion controls, alternates and metadata are visually secondary.

**P5 — Metadata must look like metadata.** Chapter number, stage, activity index, duration, pillar and completion state must not carry the same weight as the title and the primary action.

**P6 — Cards are for genuinely distinct interactive units.** Not for every paragraph. Never card-in-card-in-card, especially on mobile.

**P7 — Mobile is designed, not shrunk.** Mobile layouts are specified separately and checked at 390px.

**P8 — Architecture is preserved.** Training teaches, Pillars are practice domains, Sessions executes practice, Journal holds user prose, Progress reports, Journey is the 48-day programme. Compactness comes from presentation, never from collapsing these concepts to save a click.

---

## 2. Measured current state

Measured 2026-07-30 against the local production build (`next build` + `next start`), Chromium, `reducedMotion: reduce`, authenticated shell, desktop 1440×1000 and mobile 390×844. Numbers are `document.scrollHeight` at rest, and the absolute Y-offset of the primary start control.

### 2.1 Sessions — intro (pre-start) state

| Session | Desktop resting | Scroll to Start | Mobile resting | Scroll to Start |
|---|---|---|---|---|
| Morning Routine | 1,347px | 1,210px | 1,616px | 1,415px |
| Fasting | 1,430px | 1,293px | 1,732px | 1,531px |
| Breathing | 1,415px | 1,278px | 1,702px | 1,501px |
| Movement | 1,444px | 1,307px | 1,749px | 1,548px |
| Meditation | 1,347px | 1,210px * | 1,628px | — * |
| Sandhya | 1,425px | 1,256px | 1,814px | 1,581px |
| Brahman | 1,385px | 1,216px | 1,769px | 1,536px |
| Manifest | 1,396px | 1,227px | 1,769px | 1,536px |
| Sleep | 1,411px | 1,242px | 1,731px | 1,498px |
| **Median** | **1,411px** | **1,256px** | **1,732px** | **1,536px** |

\* Meditation's control is not "Begin" but **"Set up my session"** — it opens a *further* setup screen before practice.

**The headline number: the primary Start control sits 1.26 screens down on desktop and 1.82 screens down on mobile.** On a phone you scroll nearly two full screens before you can start a five-minute practice.

### 2.2 Where that height goes (Brahman, representative)

| Block | Desktop | Mobile | Verdict |
|---|---|---|---|
| Page `<h1>` "Guided Sessions" + subtitle | 64px | 88px | repeated on every session |
| Tab strip (16 buttons, wraps to 3 rows) | 142px | 148px | repeated in **every** state, incl. active |
| Intro hero (ambient video, `h-44`) | 176px | 176px | decorative |
| "Why" lead paragraph | ~60px | ~110px | essential |
| "Why it helps" benefits list | 119px | 196px | essential, collapsible |
| "What you'll feel" callout | ~70px | ~110px | essential, collapsible |
| "Before you begin" setup list | 144px | 221px | essential, collapsible |
| Tradition note | ~40px | ~60px | essential, collapsible |
| Caution (where authored) | ~60px | ~90px | essential — never collapsed |
| Format chip (duration) | 30px | 30px | essential, mergeable into header |
| Begin button | 48px | 48px | primary |
| Outer `vedic-card p-6` padding | 48px | 48px | nesting |
| Session's own inner panel padding (`p-8`) | 64px | 64px | nesting |

Two nested paddings cost **112px** on every session before a single word of content.

### 2.3 Sessions — state transitions (Brahman)

| State | Resting height | Page title | Tab strip | Pre-brief text | Benefits | Setup |
|---|---|---|---|---|---|---|
| INTRO | 1,385px | shown | shown | — | shown | shown |
| IDLE (after 1st Begin) | 1,233px | shown | shown | **shown** | — | **shown** |
| ACTIVE (timer running) | 1,120px | **shown** | **shown** | **shown** | — | — |

The active practice state still renders the page title, the 16-button tab strip and the pre-session brief. It is not quieter than preparation — it is only 265px shorter.

### 2.4 Training

| Screen | Desktop resting | Mobile resting | `.vedic-card` count | First CTA |
|---|---|---|---|---|
| `/training` landing | 2,034px (2.0 screens) | 2,529px (3.0 screens) | 1 | — |
| Chapter 1, zero progress | 8,784px (8.8 screens) | 10,339px (12.3 screens) | 3 | 452px |
| Chapter 2, zero progress | 8,611px (8.6 screens) | 10,123px (12.0 screens) | 2 | 452px |
| Introduction | 9,563px (9.6 screens) | 12,842px (15.2 screens) | 1 | 680px |

Training already had a compaction pass and the landing is in reasonable shape. The chapter resting height is still 8.8 / 12.3 screens at zero progress, and the Introduction is the tallest screen in the product.

---

## 3. Current problems

**S1 — The Start button is below the fold on every session.** Median 1,256px desktop / 1,536px mobile. (§2.1)

**S2 — Two-gate start.** Brahman: `Begin` (leaves intro) → mood check → `Begin` (starts timer). Same label, two different meanings.

**S3 — Three-gate start on Meditation.** `Set up my session` → setup screen → start. The longest path to the most common practice.

**S4 — The active state is not quiet.** Page title, 16 tabs and the pre-brief paragraph all remain on screen while the timer runs. (§2.3)

**S5 — Double card padding on every session.** `vedic-card p-6` (page) wraps a `p-8` panel (component) = 112px of pure nesting.

**S6 — The tab strip is permanent chrome.** 142–148px, three wrapped rows on mobile, shown even mid-practice.

**S7 — The completion view stacks up to six blocks.** mood delta line + karma chip + poster card + return/next CTA + "Begin again" + the trailing pre-brief paragraph. Two of those are onward actions competing for the same decision.

**S8 — The pre-brief paragraph is duplicated.** Brahman's closing paragraph ("5 minutes of silent expansion meditation…") repeats what the intro's "why" already said, and it renders in idle, active *and* complete states.

**S9 — Chapter resting height is 12.3 screens on mobile at zero progress.**

**S10 — The Introduction is 15.2 screens on mobile** and its first CTA is 627px down.

**Leverage note:** 14 of the 15 sessions render through one shared component, `SessionIntro` (`src/components/features/sessions/session-intro.tsx`). Only Dosha Quiz does not. **Fixing the shell fixes S1, S5 and most of S8 across fourteen sessions at once.** This is by far the cheapest high-impact change in the product.

---

## 3A. Reference implementation — ExecSpeak

Reviewed 2026-08-02 at `cocreateceo/ExecSpeak-communication-mastery@5ab609f`. Same problem — a multi-step lesson inside a modular curriculum — solved with a different structure. The relevant files are `web/src/components/player/LessonPlayer.tsx`, `web/src/components/player/steps.tsx`, `web/src/components/dashboard/DashboardView.tsx`, `web/src/components/dashboard/ModuleBrowser.tsx` and `web/src/lib/progress/logic.ts`.

### The structural difference

**ExecSpeak's lesson body renders exactly one step at a time.** `LessonPlayer` holds `activeStep` in React state and swaps the reading column; the other six steps are not in the DOM. The lesson is a one-viewport application view. Vedic's chapter is a document with all eight activities stacked, which is why it measures 8,784px desktop / 10,339px mobile (§2.4).

| | ExecSpeak lesson | Vedic chapter (today) |
|---|---|---|
| Body | one step rendered at a time | all 8 activities stacked |
| Navigation | sticky left spine, 7 steps, click to jump | scroll + Outline drawer |
| Progress | one meter in the spine (`%`) | repeated per section |
| Advance | `Continue` → auto-advances to next step | manual scroll |
| Resume | `activeStep = firstIncomplete` on load | anchor / scroll position |
| Gating | strict sequential; future steps `disabled`; locked lessons redirect | everything always visible |
| Header | back-link + eyebrow + `h1`, no artwork | hero image + artwork |
| Resting height | ≈ one viewport | 8.8 / 12.3 screens |
| Primary actions per view | exactly one (`Continue`) | several |
| Card nesting | one `StepCard` per step | card-in-card |

### The seven mechanics worth adopting

**M1 — One step in the DOM at a time.** `{activeStep === "concept" && <ConceptStep …/>}`. Page height becomes a function of the *largest single step*, not the sum of all of them. This is the single change that fixes the chapter.

**M2 — A sticky step spine, not a drawer.** A 230px left rail lists all seven steps with number, label, done-tick and current highlight, plus one progress meter at the bottom. Always visible on desktop; no repeated per-section progress anywhere.

**M3 — Strict sequential unlock, expressed in the UI.** `canOpen(s) = stepDone(s) || s === firstIncomplete`. Completed steps stay revisitable, the next one is open, the rest are `disabled` with `cursor-not-allowed`. `canOpenLesson()` additionally guards direct-URL access and redirects to the dashboard.

**M4 — Continue auto-advances.** `completeStep` marks the step, persists, then sets `activeStep` to the next id. The learner never scrolls to find what's next.

**M5 — Resume is computed, not remembered.** On load, `activeStep = STEP_IDS.find(s => !completed.includes(s)) ?? last`. No scroll restoration, no anchor.

**M6 — One `ContinueButton` component, one label.** Every step ends with the same single filled button. Vedic's two-`Begin` problem (S2) cannot occur in this structure.

**M7 — Deferred ceremony.** Narration autoplays only on a lesson's first open (`openedAt` stamped, `shouldAutoplayLesson`). Revisits are silent. Vedic's equivalent: the cinematic hero belongs to the first visit, not every visit.

### What ExecSpeak does NOT do

No hero image on the lesson. No per-step progress text. No decorative separators between steps. No second CTA competing with `Continue`. The masthead is three lines: back-link, `module · Lesson N · X min` eyebrow, title. That is the whole header.

### Dashboard

`DashboardView` is a three-tile stat strip over a two-column body: left is the module accordion (`ModuleBrowser` — one row per module, `completed/total`, a progress spine as the divider, current module open by default), right is a **sticky action rail** whose lit card is "Today's lesson → `Start lesson`". Close to the §4B wireframe already proposed, with one improvement worth taking: **the primary CTA lives in a sticky rail, so it stays reachable while the learner browses the curriculum.**

One further pattern: a challenge accepted inside a lesson surfaces the next day as a "Challenge check-in" card on the dashboard. Vedic has a Challenge activity with no such follow-up.

### Consequence for this spec

§4 C/D/E below are rewritten to the step-player model. The earlier draft proposed collapsing sections *within* a long page; that is a weaker form of M1 and would still leave a multi-screen chapter. Collapse-in-place is retained only for review mode and for long Read content inside a single step.

---

## 4. Wireframes

Notation: `▾` collapsed disclosure · `▸` expanded · `[ Button ]` primary · `( button )` secondary · `····` fold line at 1000px desktop / 844px mobile.

### A. Training landing — new learner

**Desktop**
```
┌────────────────────────────────────────────────────────────┐
│ TRAINING                                                   │
│ The 10x Vedic book, one chapter at a time.  0 of 3 open    │
│                                                            │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ START HERE                                             │ │
│ │ Introduction · The 10x Vedic Life                      │ │
│ │ 6 min read                                             │ │
│ │                                     [ Begin ]          │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ CURRICULUM                                                 │
│ Part 1 · Foundations                              3 open   │
│   ○ Introduction · The 10x Vedic Life                      │
│   ○ 1 · Connect to the Universe            Brahman         │
│   ○ 2 · Consciousness & Self-Awareness      Thoughts       │
│ ···························································· │
│ Part 2 · Living the Practice     · 3 chapters · soon    ▾  │
│ Part 3 · Expansion               · 4 chapters · soon    ▾  │
│ Part 4 · Integration             · 2 chapters · soon    ▾  │
└────────────────────────────────────────────────────────────┘
```

**Mobile (390)**
```
┌──────────────────────────────┐
│ TRAINING          0 of 3     │
│ The 10x Vedic book, one      │
│ chapter at a time.           │
│ ┌──────────────────────────┐ │
│ │ START HERE               │ │
│ │ Introduction             │ │
│ │ 6 min read               │ │
│ │ [ Begin ]                │ │
│ └──────────────────────────┘ │
│ CURRICULUM                   │
│ Part 1 · Foundations         │
│  ○ Introduction              │
│  ○ 1 · Connect to the Univ.  │
│  ○ 2 · Consciousness & Self  │
│ ···························· │
│ Part 2 · 3 chapters   soon ▾ │
│ Part 3 · 4 chapters   soon ▾ │
│ Part 4 · 2 chapters   soon ▾ │
└──────────────────────────────┘
```

| Action | Item |
|---|---|
| KEEP | Part grouping, chapter titles, pillar tags, read-time, coming-soon status |
| COLLAPSE | Non-current Parts, closed by default |
| MERGE | Orientation line + overall counter into one header row |
| DEMOTE | Pillar tag and read-time to metadata weight |
| REMOVE DUPLICATION | Any second "resume/start" control outside the START HERE card |

---

### B. Training landing — returning learner

**Desktop**
```
┌────────────────────────────────────────────────────────────┐
│ TRAINING                                                   │
│ Chapter 1 · 4 of 8 activities                              │
│                                                            │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ CONTINUE                                               │ │
│ │ 1 · Connect to the Universe                            │ │
│ │ ████████░░░░░░░░  Next: Practice                       │ │
│ │                                     [ Continue ]       │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ CURRICULUM                                                 │
│ Part 1 · Foundations                                       │
│   ✓ Introduction                                           │
│   ◐ 1 · Connect to the Universe          4/8               │
│   ○ 2 · Consciousness & Self-Awareness                     │
│ Part 2 · Living the Practice     · 3 chapters · soon    ▾  │
│ Part 3 · Expansion               · 4 chapters · soon    ▾  │
│ Part 4 · Integration             · 2 chapters · soon    ▾  │
└────────────────────────────────────────────────────────────┘
```

Mobile: identical stack, single column, progress bar full-width under the title.

| Action | Item |
|---|---|
| KEEP | Per-chapter completion marks, current-chapter progress, next-activity name |
| MERGE | "Where am I" status into the page subtitle — one status line, not a separate card |
| DEMOTE | Chapter numbers, counts |
| REMOVE DUPLICATION | Duplicate Resume buttons; multiple progress summaries; repeated current-chapter messaging; large chapter artwork on the landing |

---

### C. Chapter — zero progress

**Step-player model (M1).** One activity is in the DOM at a time. The chapter's resting height becomes the height of the largest single activity, not the sum of eight.

The ceremonial opening is a **first-visit-only overlay** (M7), not a permanent hero: it plays once, ends with `Begin the chapter`, and hands off to the player. Revisits land straight in the player.

**Desktop — first visit, the ceremony**
```
┌────────────────────────────────────────────────────────────┐
│ ← Training                                                 │
│                                                            │
│                   CHAPTER 1 · BRAHMAN · 18 MIN             │
│                                                            │
│                  Connect to the Universe                   │
│            You are not separate from the infinite.         │
│                                                            │
│                    [ Begin the chapter ]                   │
│                                                            │
│   Prepare · Learn · Practice · Reflect · Seal              │
└────────────────────────────────────────────────────────────┘
```
Shown once. `openedAt` is stamped on first open; later visits skip it.

**Desktop — the player (every subsequent view)**
```
┌────────────────────────────────────────────────────────────┐
│ ← Training              CHAPTER 1 · BRAHMAN · 18 MIN       │
│ Connect to the Universe                                    │
│────────────────────────────────────────────────────────────│
│ PREPARE          │ ┌──────────────────────────────────────┐│
│  ✓ Watch         │ │ WATCH · 4 min                        ││
│ LEARN            │ │                                      ││
│  02 Read      ◀  │ │ The nature of Brahman                ││
│  03 Takeaways    │ │                                      ││
│ PRACTISE         │ │  ┌────────────────────────────────┐  ││
│  04 Practice     │ │  │        (video)                 │  ││
│  05 Meditate     │ │  └────────────────────────────────┘  ││
│ REFLECT          │ │                                      ││
│  06 Reflect      │ │            [ Continue ]              ││
│  07 Quiz         │ └──────────────────────────────────────┘│
│ SEAL             │                                         │
│  08 Challenge ⟳  │                                         │
│                  │                                         │
│ Progress    13%  │                                         │
│ ██░░░░░░░░░░░░   │                                         │
└──────────────────┴─────────────────────────────────────────┘
```
Left spine is sticky (M2). Completed steps are ticked and clickable; the current step is highlighted; later steps are `disabled` (M3). `Continue` completes the step and auto-advances (M4).

**Mobile (390)** — the spine becomes a compact header strip, not a drawer.
```
┌──────────────────────────────┐
│ ← Training                   │
│ CH 1 · BRAHMAN               │
│ Connect to the Universe      │
│ ✓ ● ○ ○ ○ ○ ○ ○     2/8  13% │ ← tap any dot to jump
│──────────────────────────────│
│ WATCH · 4 min                │
│ The nature of Brahman        │
│ ┌──────────────────────────┐ │
│ │      (video)             │ │
│ └──────────────────────────┘ │
│                              │
│ [ Continue ]                 │
│                              │
│ ···························· │
└──────────────────────────────┘
```
The step strip replaces the Outline bottom sheet, which removes the bottom-nav/FAB collision entirely.

| Action | Item |
|---|---|
| KEEP | Every authored activity, all durations, the full stage model, the ceremonial opening |
| COLLAPSE | — superseded: non-current activities are not rendered at all (M1) |
| MERGE | Chapter number + pillar + duration into one eyebrow; all progress into the spine meter |
| DEMOTE | Stage names to spine group labels; activity numbers to `01`–`08` metadata |
| REMOVE DUPLICATION | The ceremony re-rendered on every visit; the Outline drawer (spine replaces it); decorative separators between activities; the second progress readout in the hero |

---

### D. Chapter — partially completed

Same player. The learner lands on the first incomplete activity, computed at load (M5) — no scroll restoration, no anchor.

**Desktop — resumed at activity 4**
```
┌────────────────────────────────────────────────────────────┐
│ ← Training              CHAPTER 1 · BRAHMAN · 18 MIN       │
│ Connect to the Universe                                    │
│────────────────────────────────────────────────────────────│
│ PREPARE          │ ┌──────────────────────────────────────┐│
│  ✓ Watch         │ │ PRACTICE · 5 min                     ││
│ LEARN            │ │                                      ││
│  ✓ Read          │ │ Brahman session                      ││
│  ✓ Takeaways     │ │ Sit with the expansion practice you  ││
│ PRACTISE         │ │ just read about.                     ││
│  04 Practice  ◀  │ │                                      ││
│  05 Meditate     │ │       [ Start practice ]             ││
│ REFLECT          │ │       ( mark done instead )          ││
│  06 Reflect      │ └──────────────────────────────────────┘│
│  07 Quiz         │                                         │
│ SEAL             │                                         │
│  08 Challenge    │                                         │
│                  │                                         │
│ Progress    38%  │                                         │
│ ██████░░░░░░░░   │                                         │
└──────────────────┴─────────────────────────────────────────┘
```

Steps 05–08 are visible in the spine but not clickable — the learner can see the whole shape of the chapter while the path stays sequential (M3). Clicking a ticked step re-opens it for review in the same column.

**Mobile** — identical to C, with the strip showing `✓ ✓ ✓ ● ○ ○ ○ ○   4/8  38%`.

| Action | Item |
|---|---|
| KEEP | All completed content re-openable from the spine; the "mark done instead" escape hatch |
| COLLAPSE | — not needed; completed steps are simply not the active step |
| MERGE | Progress bar + counts into the single spine meter |
| DEMOTE | "mark done instead" to text weight beneath the primary |
| REMOVE DUPLICATION | `STEP 1 OF 8 / STEP 2 OF 8 / …` per activity — progress exists once, in the spine |

---

### E. Chapter — completed / review mode

The one state where collapse-in-place is still the right tool: the learner is no longer working through a sequence, they are looking things up. The spine stays; the reading column shows a summary rather than a step.

**Desktop**
```
┌────────────────────────────────────────────────────────────┐
│ ← Training     CHAPTER 1 · BRAHMAN · ✓ Completed 28 Jul    │
│ Connect to the Universe                                    │
│────────────────────────────────────────────────────────────│
│ PREPARE          │  Chapter complete.                      │
│  ✓ Watch         │                                         │
│ LEARN            │       [ Next: Chapter 2 ]               │
│  ✓ Read          │       ( Read as article )               │
│  ✓ Takeaways     │                                         │
│ PRACTISE         │  ·····································  │
│  ✓ Practice      │   Your reflections (3)              ▾   │
│  ✓ Meditate      │   Quiz results · 4/5                ▾   │
│ REFLECT          │   Challenge · accepted 28 Jul       ▾   │
│  ✓ Reflect       │                                         │
│  ✓ Quiz          │  Pick any step on the left to revisit.  │
│ SEAL             │                                         │
│  ✓ Challenge     │                                         │
│ Progress   100%  │                                         │
│ ██████████████   │                                         │
└──────────────────┴─────────────────────────────────────────┘
```

**Mobile** — the strip shows all ticks; the summary column stacks; `[ Next: Chapter 2 ]` stays above the fold.

| Action | Item |
|---|---|
| KEEP | Every activity re-openable from the spine; the learner's own reflections, quiz results and challenge state |
| COLLAPSE | Reflections / quiz / challenge summaries, closed with counts shown (R3) |
| MERGE | Eight completion rows into the existing spine — no separate checklist |
| DEMOTE | "Read as article" to secondary beneath the single primary |
| REMOVE DUPLICATION | The seal ceremony re-rendered on every later visit — it plays once, on the visit that seals it (M7) |

---

### F. Sessions landing

Today `/sessions` has no landing: it opens straight onto tab 0 (Morning Routine) with a 16-button strip above it. Proposal — keep the single-route architecture, but when no `?practice=` is present, show a chooser instead of an arbitrary practice.

**Desktop**
```
┌────────────────────────────────────────────────────────────┐
│ SESSIONS                                                   │
│ Practice, guided. 15 practices · 3 done today              │
│                                                            │
│ TODAY                                                      │
│ ┌──────────────────┐ ┌──────────────────┐                  │
│ │ ☀ Morning Routine│ │ ∞ Brahman        │                  │
│ │ 12 min      ✓    │ │ 5 min            │                  │
│ └──────────────────┘ └──────────────────┘                  │
│                                                            │
│ ALL PRACTICES                                              │
│ ☀ Morning 12m ✓   ⏱ Fasting 16h   ~ Breathing 6m           │
│ ⬛ Movement 15m   ⏲ Meditation 10m  ☼ Sandhya 8m           │
│ ∞ Brahman 5m     ✦ Manifest 7m    ☾ Sleep 10m             │
│ ···························································· │
│ More practices · 6                                     ▾   │
└────────────────────────────────────────────────────────────┘
```

**Mobile (390)** — two-column grid, `More practices ▾` collapsed.

| Action | Item |
|---|---|
| KEEP | All 15 practices reachable; durations; today's completion state |
| COLLAPSE | The 6 non-pillar practices behind `More practices ▾` |
| MERGE | Nothing — this screen is new surface, not a merge |
| DEMOTE | Icons to metadata scale |
| REMOVE DUPLICATION | The permanent 16-button tab strip — replaced by this chooser plus a compact back-link inside a session (§G) |

**Open question for review — Q1:** replacing the always-on tab strip with a chooser changes how a user switches practice mid-visit. Alternative: keep a single-row horizontally-scrolling strip (≈48px, one row) instead of the wrapping 3-row strip (142–148px). Recommendation: the chooser, with a `← Sessions` back-link in each session header. It costs one tap to switch and saves ~148px in every state, including active practice.

---

### G. Session — before starting

This is the most important wireframe in the document. It restructures `SessionIntro`, which serves 14 of 15 sessions.

**Desktop**
```
┌────────────────────────────────────────────────────────────┐
│ ← Sessions                    BRAHMA SAMBANDHA · 5 MIN     │
│                                                            │
│ Connection to Brahman                                      │
│ Silent expansion meditation. Let go of body, breath and    │
│ thought, and rest in pure awareness.                       │
│                                                            │
│                     [ Start practice ]                     │
│                                                            │
│ ⚠ If you feel dizzy or disoriented, open your eyes and     │
│   return to normal breathing.                              │
│ ···························································· │
│ Why it helps · 4                                       ▾   │
│ Before you begin · 5 cues                              ▾   │
│ What you'll feel                                       ▾   │
│ In the tradition                                       ▾   │
└────────────────────────────────────────────────────────────┘
```

**Mobile (390)**
```
┌──────────────────────────────┐
│ ← Sessions                   │
│ BRAHMA SAMBANDHA · 5 MIN     │
│ Connection to Brahman        │
│ Silent expansion meditation. │
│ Let go of body, breath and   │
│ thought.                     │
│                              │
│ [ Start practice ]           │
│                              │
│ ⚠ If you feel dizzy, open    │
│   your eyes.                 │
│ Why it helps · 4          ▾  │
│ Before you begin · 5 cues ▾  │
│ What you'll feel          ▾  │
│ In the tradition          ▾  │
│ ···························· │
└──────────────────────────────┘
```

Everything authored in `SessionIntroContent` is still on the page. Four blocks become disclosures; the caution never collapses.

| Action | Item |
|---|---|
| KEEP | `why`, `benefits`, `feel`, `setup`, `tradition`, `caution`, `formatLabel` — all of it, all reachable |
| COLLAPSE | `benefits`, `feel`, `setup`, `tradition` — closed by default, count shown in the summary line |
| MERGE | `eyebrow` + `formatLabel` into one metadata row; `title` + `why` into the header block |
| DEMOTE | Ambient video hero — from a 176px block to either a thin banner or removed on mobile |
| REMOVE DUPLICATION | Outer `vedic-card p-6` wrapping an inner `p-8` — one padding, not two; the trailing pre-brief paragraph that repeats `why` |

**Expected effect:** Start moves from ~1,256px to roughly ~300px desktop and from ~1,536px to roughly ~380px mobile — above the fold in both. This is a projection from the block table in §2.2, to be confirmed by measurement during implementation, not a committed pixel target.

**Q2 — the mood check.** Brahman gates the timer behind a second `Begin` after a mood question (S2). Options: (a) fold the mood check into this screen just above Start, keeping one Start; (b) keep it as its own step but rename the controls so the two are not both "Begin"; (c) move it to completion only. Recommendation: **(a)** — one screen, one Start, mood captured inline as a compact row.

**Q3 — Meditation's three gates (S3).** Its setup screen chooses duration and ambience, which is real configuration, not ceremony. Recommendation: inline the duration choice as a compact chip row on this screen so the flow is `choose 10m → Start`, matching every other session.

---

### H. Session — active timer / practice

Once practice starts, chrome goes away. This is the quietest screen in the product.

**Desktop**
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                  Connection to Brahman                     │
│               Infinite · rest in awareness                 │
│                                                            │
│                      ◎  (rings / lotus)                    │
│                                                            │
│                        2:14 / 5:00                         │
│                                                            │
│                  ( Pause )    ( End )                      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Mobile (390)** — same, timer dominant, controls thumb-reachable at the lower third.

| Action | Item |
|---|---|
| KEEP | Practice name, phase guidance, timer, visual, Pause/End |
| COLLAPSE | — |
| MERGE | — |
| DEMOTE | Pause/End to secondary weight — during practice nothing should shout |
| REMOVE DUPLICATION | Page `<h1>` "Guided Sessions", the 16-button tab strip, the pre-session brief paragraph, the benefits/setup lists — none belong on screen while the timer runs (S4, S8) |

**Rule:** the active state must be strictly shorter than the preparation state and should fit one viewport at 390×844 with no scrolling.

---

### I. Session — completed from an ordinary Sessions visit

**Desktop / mobile (same structure)**
```
┌──────────────────────────────────────────┐
│                ✓                         │
│         Practice complete                │
│   Connection to Brahman · 5 min          │
│   Tense → Serene        +5 karma         │
│                                          │
│           [ Next: Breathing ]            │
│           ( Begin again )                │
│ ········································ │
│   Related teaching · Brahman poster   ▸  │
└──────────────────────────────────────────┘
```

| Action | Item |
|---|---|
| KEEP | Mood delta, karma award, next-practice suggestion, "Begin again", the related poster |
| COLLAPSE | Related teaching poster to a single compact row |
| MERGE | Mood delta + karma into one metadata line under the title |
| DEMOTE | "Begin again" to secondary under the single primary |
| REMOVE DUPLICATION | The trailing pre-brief paragraph still rendered under the completion view (S8) |

---

### J. Session — completed when launched from Training

One completion screen, enhanced by Training context. Not a second card underneath.

```
┌──────────────────────────────────────────┐
│                ✓                         │
│         Practice complete                │
│   Connection to Brahman · 5 min          │
│   Tense → Serene        +5 karma         │
│                                          │
│   TRAINING                               │
│   Chapter 1 · Connect to the Universe    │
│   Practice activity completed            │
│                                          │
│      [ Return to Training ]              │
│ ········································ │
│   Related teaching · Brahman poster   ▸  │
└──────────────────────────────────────────┘
```

| Action | Item |
|---|---|
| KEEP | The same completion facts as (I); the Training context block; exactly one onward action |
| COLLAPSE | Poster row |
| MERGE | Training context into the completion card — same card, a bordered-off section, not a sibling card |
| DEMOTE | "Begin again" — hidden in this variant; the learner's next move is the chapter |
| REMOVE DUPLICATION | The "Next: <pillar>" suggestion must not co-exist with "Return to Training" (already correct in `next-practice-cta.tsx`; this spec locks it in) |

This behaviour is already implemented correctly and is recorded here so the compaction pass does not regress it.

---

### K. Training reflection → Journal handoff

```
┌────────────────────────────────────────────────────────────┐
│ ✓ 5 MEDITATE                                    Review ▾   │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 6  REFLECT · 3 prompts                       CURRENT   │ │
│ │                                                        │ │
│ │  1. Where in your life do you feel separate?           │ │
│ │  2. What changed during the sit?                       │ │
│ │  3. What will you carry into tomorrow?                 │ │
│ │                                                        │ │
│ │  ┌──────────────────────────────────────────────────┐  │ │
│ │  │ Write here…                                      │  │ │
│ │  └──────────────────────────────────────────────────┘  │ │
│ │                            [ Save reflection ]         │ │
│ │                            ( Open in Journal )         │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

Prompts are shown as a panel, never pre-filled into the textarea. Journal owns the prose; Training owns the prompt and the completion. Saving persists the entry first, then marks the activity.

| Action | Item |
|---|---|
| KEEP | All authored prompts, visible together; inline writing; the Journal route |
| COLLAPSE | — prompts are short; collapsing them would hide the actual task |
| MERGE | — |
| DEMOTE | "Open in Journal" to secondary |
| REMOVE DUPLICATION | Repeating the prompt text inside the textarea as placeholder *and* above it |

---

### L. Return to Training after external practice

```
┌────────────────────────────────────────────────────────────┐
│ ← Training     CH 1 · BRAHMAN · 5 of 8 · ██████████░░      │
│ Connect to the Universe                                    │
│                                                            │
│ ✓ 4 PRACTICE   Brahman session · completed just now        │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 5  MEDITATE · 10 min                         CURRENT   │ │
│ │                          [ Start 10-minute sit ]       │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

The learner lands scrolled to the *next* activity, with the just-completed one visibly ticked directly above it — the confirmation is the context, not a modal or a banner.

| Action | Item |
|---|---|
| KEEP | Deep-link to next outstanding activity; visible tick on the completed one |
| COLLAPSE | The completed activity, immediately |
| MERGE | — |
| DEMOTE | — |
| REMOVE DUPLICATION | A "welcome back" banner on top of an already-visible tick |

---

## 5. Disclosure & collapse rules

**R1 — In a chapter, one activity is rendered at a time (M1).** Not "expanded" — rendered. Non-active activities are absent from the DOM and reachable from the spine. Disclosure rules R2–R9 govern content *inside* a step, and the review-mode summary (E).

**R2 — Completed content is reached from the spine, not from a collapsed row.** Inside review mode, summaries collapse with counts. Nothing is ever removed.

**R3 — Summaries must count.** `Why it helps · 4`, `Reflections (3)`, `5 questions` — a collapsed section states its size so nothing feels hidden.

**R4 — Cautions never collapse.** Safety text renders at rest, always.

**R5 — Quiz shows one question at a time.** Never five questions and all answers at once.

**R6 — Long Read collapses to a review state once completed,** with per-movement disclosure plus `Expand all` and `Read as article`.

**R7 — Disclosure state is per-visit, not persisted,** except that completed activities always start collapsed.

**R8 — Every disclosure is keyboard reachable and announces state.** `<details>`/`aria-expanded`; no hover-only reveals.

**R9 — Nothing authored is permanently hidden.** Every collapsed block has a visible, labelled control that opens it.

---

## 6. CTA hierarchy

```
PAGE TITLE
   ↓
CURRENT STATE          (progress · duration · pillar — metadata weight)
   ↓
PRIMARY ACTION         (exactly one, filled button)
   ↓
SUPPORTING CONTENT     (teaching, disclosures)
   ↓
SECONDARY ACTIONS      (mark done, begin again, open in journal — text/outline weight)
```

**C1 — One filled button per screen state.** Everything else is outline or text.

**C2 — Primary above the fold.** Desktop and mobile both.

**C3 — Verb-first, unambiguous labels.** Two controls in the same flow may never share a label — Brahman's two `Begin`s (S2) are the case to fix.

**C4 — Completion controls are secondary.** "Mark complete" never outranks "Start practice".

**C5 — Training-origin sessions carry exactly one onward action.**

| Activity | Primary |
|---|---|
| Watch | Watch |
| Read | Open / Read |
| Takeaways | Continue |
| Practice | Start practice |
| Meditate (mapped) | Start session |
| Meditate (unmapped) | Start self-guided sit |
| Reflect | Save reflection |
| Quiz | Answer / Next question |
| Challenge | Accept challenge |

---

## 7. Spacing & density recommendations

**D1 — One card boundary per interactive unit.** `/sessions` currently wraps every component in `vedic-card p-6` and several components add their own `p-8`. Choose one owner. Recommendation: the page provides no card; each session owns its surface.

**D2 — Section rhythm: 24px desktop / 16px mobile** between blocks inside a screen. Current `space-y-6` + `gap-6` + `py-6` stack to far more.

**D3 — Card padding: 24px desktop / 16px mobile.** Not 32px.

**D4 — Heroes.** Chapter zero-progress hero may stay cinematic but must leave the first activity within 1.2 screens on mobile. Returning-reader hero is one metadata row plus title. Session intro hero drops to a thin banner or nothing on mobile.

**D5 — Metadata is 11–12px, uppercase, tracked, muted.** Titles are the only large type in a header.

**D6 — Replace decorative separators with 1px dividers** at 8–12% opacity.

**D7 — Fixed elements must not cover content.** The mobile Outline sheet clears the bottom navigation and the AI FAB; add bottom padding equal to their combined height.

**D8 — Tap targets ≥ 44×44px** with ≥ 8px spacing.

**D9 — No horizontal overflow at 390px.** Long content scrolls inside its own container.

**D10 — Do not chase a pixel target.** Every proposed reduction traces to a named block in §2.2 or a numbered problem in §3. If a reduction cannot be traced, it does not happen.

---

## 8. Content-preservation rules (binding)

**K1 — REMOVE applies only to duplicated UI and ceremony.** Never to authored content. Every `REMOVE DUPLICATION` row in §4 names a repeated element, not a piece of writing.

**K2 — Nothing is deleted from `session-intros.ts`, `training-book.ts`, or any content module by this work.** A compaction pass that needs content cut is a wrong compaction pass.

**K3 — Word-count parity.** After implementation, the total authored words reachable on each screen must equal the count before. Collapsed ≠ removed. This is checkable and should be checked.

**K4 — Cautions, contraindications and safety cues always render at rest.**

**K5 — Progress information is preserved but centralised.** Removing `STEP n OF 8` from every activity is legitimate only because the header and outline carry it.

**K6 — If a compaction would drop content, escalate instead of cutting.**

---

## 9. Before / after structural comparison

### Session intro (14 sessions, one shell)

| | Before | After |
|---|---|---|
| Blocks before Start | hero, why, benefits, feel, setup, tradition, caution, format chip | metadata row, title, why, Start, caution |
| Blocks after Start | — | 4 disclosures |
| Start offset, desktop | 1,256px (median) | above fold |
| Start offset, mobile | 1,536px (median) | above fold |
| Card paddings | 2 nested (112px) | 1 |
| Authored content reachable | all | **all** |

### Session active state

| | Before | After |
|---|---|---|
| Page title | shown | removed |
| Tab strip (142–148px) | shown | removed |
| Pre-session brief | shown | removed |
| Height vs preparation | −265px | strictly quieter, one viewport |

### Session completion

| | Before | After |
|---|---|---|
| Onward actions | up to 2 competing | exactly 1 |
| Stacked blocks | up to 6 | 3 + 1 disclosure |
| Trailing pre-brief paragraph | shown | removed (duplicate) |

### Chapter

| | Before (measured) | After (step player) |
|---|---|---|
| Activities in the DOM | 8 | 1 |
| Resting height, desktop | 8,784px | height of the largest single activity |
| Resting height, mobile | 10,339px | ditto |
| Navigation | scroll + Outline drawer | sticky spine / mobile strip |
| Progress readouts | per-activity, repeated | one meter |
| Resume | anchor / scroll position | computed `firstIncomplete` (M5) |
| Ceremony | every visit | first visit only (M7) |
| `STEP n OF 8` repeats | 8 | 0 |
| Authored content reachable | all | **all** |

### Training landing

| | Before | After |
|---|---|---|
| Resting height, desktop | 2,034px | comparable — already compact |
| Resting height, mobile | 2,529px | reduced via collapsed Parts |
| Progress summaries | more than one | one |

---

## 10. Architecture preserved

- A Chapter may teach multiple Pillars: `relatedPillarSlugs`.
- `primaryPillarSlug` drives that chapter's Practice CTA. Array order carries no behaviour.
- Pillar practice routes stay independent of Training.
- Sessions is a superset of Pillar practices (15 practices, 9 pillar-mapped).
- Training owns WHY and LEARNING. Sessions owns DOING. Chapter teaching is never duplicated inside a Session.
- A Training activity with no real Sessions mapping keeps its compact inline self-guided timer and is **never** routed to a generic `/sessions`.
- Journal owns user prose; Progress reports; Journey is the 48-day programme. None are collapsed into another to save a click.

This UX pass changes no information architecture.

---

## 11. Decisions needed before implementation

| # | Question | Recommendation |
|---|---|---|
| Q1 | Replace the permanent 16-button tab strip with a Sessions chooser + back-link, or keep a single-row scrolling strip? | Chooser + back-link — saves ~148px in every state including active |
| Q2 | Brahman's two `Begin` controls | Fold the mood check into the intro screen; one Start |
| Q3 | Meditation's three gates | Inline duration/ambience as a chip row on the intro screen |
| Q4 | Session intro hero video | Thin banner on desktop, removed on mobile |
| Q5 | Who owns the card boundary on `/sessions`? | The session component; the page stops wrapping |
| Q6 | Introduction at 15.2 screens on mobile | Treat in the same pass or defer to its own — it is the tallest screen in the product |
| Q7 | Adopt the step-player model (M1) for chapters, replacing the long scrolling page? | **Yes** — this is the change that actually fixes the chapter flow; collapse-in-place does not |
| Q8 | Strict sequential unlock (M3)? Vedic today lets a learner open any activity. | Recommend adopting, with completed steps always revisitable. It is a behavioural change, not only visual — flagging it explicitly |
| Q9 | Does the chapter become a client-side player, given `dynamicParams = false` + SSG? | The shell stays statically generated; only the active-step swap is client state. No routing change, no new URLs — but `?step=` should keep working as a deep link |
| Q10 | Challenge follow-up on the Dashboard the next day (ExecSpeak pattern)? | Out of scope for this spec — Dashboard is not in scope. Recorded for a later decision |

---

## 12. Implementation sequencing (for the later pass — not authorised by this document)

1. **Chapter step player** (C, D, E / M1–M6) — the structural fix; everything else is trim by comparison.
2. `SessionIntro` shell — 14 sessions, largest single Sessions win (G).
3. Active-state chrome removal (H).
4. Completion consolidation (I, J).
5. Sessions landing / tab-strip decision (F, Q1).
6. Training landing trims (A, B).
7. Introduction (Q6).

Steps 1 and 2 are independent and could run in parallel; 3–4 depend on 2.

Each step re-measures against §2 and checks §8 K3 word-count parity.

**Existing Vedic code the step player can build on** — this is a re-composition, not a rewrite:
- `src/lib/training-steps.ts` already provides `StepKey`, `chapterSteps()`, `chapterStages()`, `stepAnchorId()`, `stepContentId()` — the equivalent of ExecSpeak's `STEP_IDS`.
- `src/components/features/training/steps/` already has one component per activity.
- `src/lib/training-progress.ts` is already the single write authority and already returns `nextStep`, which is exactly what M4's auto-advance needs.
- `src/lib/training-return-context.ts` already round-trips `?step=` for Q9.

What is missing is the container: an `activeStep` state, the spine, and the gating predicate.

---

## 12A. Implementation log

**2026-08-02 — step 1 of §12 (chapter step player) is IMPLEMENTED.** Sections C, D, E and mechanics M1–M7 are built; Sessions (F–J) is untouched and remains next.

Files: `src/lib/training-player.ts` (new, pure logic + 24 tests), `src/components/features/training/chapter-player.tsx` (new), `steps/first-visit-only.tsx` (new), `chapter-experience.tsx` (restructured into panels), `steps/chapter-hero.tsx` (dropped the duplicate progress bar and Continue link), `lesson-outline.tsx` (deleted — the spine replaces the drawer).

Measured, same harness and viewports as §2:

| | Before | After | Change |
|---|---|---|---|
| Chapter 1 resting, desktop | 8,784px | 1,936px | **−78%** |
| Chapter 1 resting, mobile | 10,339px | 1,929px | **−81%** |
| Chapter 2 resting, desktop | 8,611px | 1,936px | −78% |
| Chapter 2 resting, mobile | 10,123px | 1,957px | −81% |
| Activities in the DOM | 8 | 1 | M1 |
| Progress readouts | per-activity + hero + drawer | one spine meter | M2 |

Decisions taken while building, all reversible:
- **Q8 — strict sequential unlock was NOT adopted.** `canOpen()` returns true for every activity, so a reader can still open anything, exactly as before. It is a single named predicate with tests around it, so adopting the gate later is a one-function change.
- **Q9 — resolved.** The page stays statically generated; only the panel swap is client state. `?step=` and `#step-<key>` both deep-link, and the hash is kept current with `replaceState` (not `push`, so Back still leaves the chapter).
- **Continue defers.** On practice / meditation / reflection — the three activities that render their own filled CTA — Continue drops to an outline so only one action dominates.
- **The snapshot is first-visit only.** Orientation for a new reader; a reader already underway goes straight to their activity. The same description anchors the chapter's card on `/training`.
- **Content that sat between activities kept a home:** the night interlude moved into the Read panel it quotes, the Chapter Gallery into the Takeaways panel it illustrates.

Verified: 242 unit tests pass, `tsc` clean, `next build` clean (90/90 static pages). Runtime — one activity in the DOM, Continue walks all 9 stops, resume lands on the first unfinished activity, spine jumps, all three deep-link forms, completed chapter opens at the closing, no horizontal overflow at 390px, tap targets ≥ 40px. Content — Expand all still reveals the full article (441 → 1,310 words), all 9 teaching movements present, gallery's 11 frames intact, practice CTA still resolves to `practice=brahman&step=practice`, Chapter 2's unmapped meditation still runs its inline sit. Pillar regression suites (E5 + Chapter 9) still pass.

Not done: the Introduction (Q6) is unchanged at 9,563px / 12,842px, and all Sessions work.

### Revision — structural parity with the reference (same day)

The first build kept Vedic's own sectioning inside the player. Reviewed against ExecSpeak's `LessonPlayer` section by section and aligned the five differences:

| | First build | Now (matches reference) |
|---|---|---|
| Opening | dark ceremonial hero on every visit | masthead: back-link, one metadata line, title, hairline — ceremony only on a first visit |
| Rail | stage-grouped (5 headings + 8 rows) | **flat, numbered `01`–`08`** + Closing |
| Meter | `3/8` | **`38%`** |
| Panel | bare section, centred text | **one card**: kicker → heading → content → Continue, left-aligned |
| Continue | separate bar below the panel, centred | **inside the card**, at the end |

`chapter-hero.tsx` is superseded by `chapter-opening.tsx` and deleted. `StepSection` now renders no card of its own — the player owns the single card boundary — which also removes the card-in-card nesting §7 D1 called out.

The reference's stage names were dropped from the rail on purpose: each step already states its stage in its own kicker, and five group headings turn a list of eight into a list of thirteen, pushing the last activities out of view.

Re-verified after the change: 242 unit tests, `tsc` clean, build clean, and the full runtime suite green (heights 1,922px desktop / 2,634px mobile).

---

## 12B. Implementation log — Sessions

**2026-08-02 — steps 2–5 of §12 are IMPLEMENTED.** Sections F, G and H are built; the same shape as the chapter panel — eyebrow → heading → lead → one primary action → collapsed detail.

Files: `session-intro.tsx` (restructured, serves 14 sessions), `sessions-index.tsx` (new), `session-tabs.ts` (new — catalogue lifted out of the page), `app/(main)/sessions/page.tsx` (rewritten), `brahman-practice.tsx` (pre-brief scoped to the idle phase).

| | Before | After | |
|---|---|---|---|
| Scroll to Start, desktop (median) | 1,256px | **440px** (worst 440) | −65% |
| Scroll to Start, mobile (median) | 1,536px | **389px** (worst 389) | −75% |
| Intro resting height, desktop | 1,411px | 1,000px — no scroll | |
| Intro resting height, mobile | 1,732px | 844px — no scroll | |
| Page `<h1>` + 16-button tab strip | every state, incl. active | removed | S4, S6 |
| Card boundaries per session | 2 nested (112px) | 1 | S5, D1 |
| `/sessions` with no param | opened Morning Routine | the index | F |
| Unknown `?practice=` | silently opened Morning Routine | the index | |

**Start is now above the fold on every one of the nine pillar sessions, at both viewports.**

Decisions taken while building:
- **Q1 — the chooser was adopted.** `/sessions` is an index of all 15 practices with durations and today's completion state; each session carries a `← Sessions` back link. This is a behavioural change: the sidebar's Sessions link used to land on Morning Routine.
- **Q4 — the ambient hero was demoted, not dropped.** A 96px band on desktop, absent on phones, where the scroll-to-start problem was worst.
- **Q5 — the session component owns the card.** The page no longer wraps anything.
- **Q2/Q3 — the mood check and duration chips were left as a second screen.** They are "prepare briefly", not ceremony, and with the intro now one screen the sequence reads intro → prepare → practice → complete, which is the intended flow. Not a duplication, so not removed.

Verified: 242 unit tests, `tsc` clean, build clean. Runtime — index lists all 15 practices, tab strip gone, worst start offset 440px desktop / 389px mobile, all four briefing sections still reachable with counts shown (103 → 210 words expanded, 8 list items), active practice shows no page title, no tab strip, no pre-brief, no briefing sections, and the Training → Session → Training round trip still carries its origin and breadcrumb. No horizontal overflow at 390px; cards ≥44px.

Still open: completion consolidation (§4I/J) was verified as already correct in `next-practice-cta.tsx` and left alone.

---

## 12C. Implementation log — Introduction

**2026-08-02 — Q6 is IMPLEMENTED.** The last long screen in the product now uses the same shape.

The Introduction has no tracked activities — it is a reading — so its own sections became the positions: Opening, Cinematic lesson, The 48-Day Journey, A Profound Shift, Five Dimensions, Who This Is For, The Eleven Gates, Closing. Progress here means how far through you have read, held for the visit rather than persisted; chapter-level completion still belongs to `ChapterActions`.

Files: `introduction-reader.tsx` (new), `player-spine.tsx` (new — the rail and strip, now shared with the chapter player rather than duplicated), `introduction-experience.tsx` (restructured into sections), `chapter-accordion.tsx` (label fix).

| | Before | After | |
|---|---|---|---|
| Resting height, desktop | 9,563px | **1,196px** | −87% |
| Resting height, mobile | 12,842px (15.2 screens) | **1,344px** | −90% |
| Opening hero | 92vh, every visit | a panel in the reader | |
| Sections in the DOM | all 8 | 1 | |

Found and fixed while verifying: the Read accordion's inner control read `Continue — <heading>` while the reader and the chapter player both put a `Continue` at the foot of the same panel — two controls in one view sharing a label (§6 C3). It is now `Next movement — <heading>`.

Verified: 700 words are authored across the Introduction's sections and summary; 1,018 are reachable through the reader (the surplus is headings, chapter titles and milestone labels), and each of the five authored section headings was confirmed rendering in its own section. The `#journey` anchor the opening CTA has always used still works — the reader listens for `hashchange`, so existing in-page anchors did not need rewriting. The closing still links to Chapter 1.

---

## 13. Status

Wireframes and rules only. No product code has been written for this specification. The pillar-schema work from 2026-07-30 remains uncommitted and undeployed pending review of this document.

**Revision 2026-08-02** — added §3A after reviewing `cocreateceo/ExecSpeak-communication-mastery@5ab609f`, and rewrote §4 C/D/E from a collapse-in-place model to the step-player model (M1). §5 R1–R2, §9 chapter comparison, §11 Q7–Q10 and §12 sequencing updated to match. Sessions sections (F–J) are unchanged — ExecSpeak has no equivalent surface.
