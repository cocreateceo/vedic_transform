# Phase D (Navigation) + Phase E (Connections) — Implementation Plan

**Date:** 2026-07-29
**Status:** Awaiting approval. No code written for either phase.
**Precondition met:** Training internal UX approved — chapter 10,275→7,469px, landing 2,570→2,156px, 12/12 chapter titles verified reachable, build/typecheck/108 tests clean.

---

## Standing constraints (carried into every task below)

1. **Journey = the 48-day programme. Training = the book.** Never the same word for both.
2. **No Day N → Chapter N mapping.** The chapter sequence and the six journey phases are not semantically aligned. Connections go through the **pillar**, which `relatedPillarSlug` makes truthful.
3. **Training completion never writes streak, karma, or check-in.** Reading is not practising. Nothing in Phase E may make chapter progress move a 48-day participation metric.
4. **Scope:** Dashboard ↔ Training, Training ↔ Sessions, Training ↔ Journal, Progress → Training, Pillars ↔ Training. Achievements, Goals and Posters are out.

---

## Phase D — Navigation

### D1. One nav model — `src/constants/navigation.ts` (new)

Today `sidebar.tsx` and `mobile-nav.tsx` each hold their own arrays, and they have already drifted: Training is primary on desktop and a 4th-row item inside "More" on mobile. One exported model, consumed by both.

```ts
export interface NavItem { name: string; href: string; icon: LucideIcon }
export interface NavGroup { title: string; items: NavItem[] }

export const NAV_GROUPS: NavGroup[] = [
  { title: "Today",    items: [Dashboard, Sessions, Journal] },
  { title: "Journey",  items: [Training, Pillars, Goals] },
  { title: "Progress", items: [Progress, Achievements, Insights, Reports, Mood] },
  { title: "Explore",  items: [Library, Posters, Wisdom, Dosha Quiz] },
]
export const NAV_FOOTER: NavItem[] = [Reminders, Settings]     // Admin appended for role === "admin"
export const MOBILE_TABS: NavItem[] = [Today, Practice, Learn, Progress]  // + More
```

> **Naming caution.** The group is titled "Journey" per the approved IA, while constraint 1 reserves "Journey" for the 48-day programme. These don't conflict — the group contains Training, Pillars and Goals, i.e. the things you are committed to across the 48 days — but the label sits one word away from the collision we just removed. Flagging it for a decision: keep **Journey**, or use **Your Path**. I'd keep Journey; it names the programme, and Training is an item *inside* it rather than a synonym for it.

Reports and Mood are placed under Progress by judgement. There is no usage telemetry in this repo to place them by.

### D2. `sidebar.tsx`

Replace the two arrays with `NAV_GROUPS.map(...)`. Group headers reuse the existing "TOOLS" header style (`sidebar.tsx:110`). Active-state logic (`pathname === href || pathname.startsWith(href + "/")`) is unchanged. Admin link keeps its `role === "admin"` guard.

### D3. `mobile-nav.tsx`

Bottom bar becomes `MOBILE_TABS` — Today / Practice (`/sessions`) / Learn (`/training`) / Progress — plus More. The More sheet renders `NAV_GROUPS` in the same order with the same headers, so the two navs read as one IA.

**Acceptance:** every route reachable from the old nav is reachable from the new one (assert by diffing the old arrays against the new model in a test); desktop and mobile expose the same top-level set; active highlighting unchanged; Training reachable in one tap on both.

**Risk:** low. No route changes, no data changes.

---

## Phase E — The four primary connections

### E1. Dashboard → Training (the missing inbound link)

**File:** `src/components/features/dashboard/todays-teaching-card.tsx` (new), mounted in `dashboard/page.tsx` immediately after `<TodaysPractice />`.

Reads `/data/content-progress` (already the only source Training uses), resolves the current chapter and next incomplete activity via `getPublishedChapters()` + `chapterStepKeys()`, and renders one card:

```
TODAY'S TEACHING
[poster]  Chapter 2 · Consciousness & Self-Awareness
          Next: Reflect · 3 of 8 activities
          [ Continue learning → ]   →  /training/<slug>#step-<key>
```

Hidden entirely when no chapter is published or nothing is in progress. **Reuses `CurrentChapterCard`** (`compact` variant already exists for exactly this).

The daily action still comes first — this sits below Today's Practice, not above it.

### E2. Training ↔ Sessions

**Outbound (built):** practice and meditation steps emit `/sessions?practice=<key>&from=training:<slug>`.

**Needed — disambiguate which step:** both steps currently produce the same href. Add `&step=practice|meditation` in `learning-map.ts` so the return path knows what to mark.

**Return path — `src/components/features/sessions/next-practice-cta.tsx`:** this one component renders on *every* session tab's completion view and already receives `justCompletedPillarSlug`, so a single change covers all 15 tabs. When `?from=training:<slug>` is present:

- POST `training:<slug>:<step>` to `/data/content-progress`
- make **"Back to Chapter N"** the primary CTA instead of the next-pillar suggestion

**Breadcrumb — `sessions/page.tsx`:** when `?from=` is present, render a slim bar above the tabs: `← Chapter 2 · Practice`.

**Guard:** the training step is written **only** when `?from=training:<slug>` is present. Opening Sessions directly never writes training progress. The existing `/data/checkin` write is untouched — the session still counts as daily practice, and the chapter step is a separate record. This is constraint 3 in practice: one action, two independent ledgers, neither derived from the other.

### E3. Training ↔ Journal

**Outbound (built):** reflect step emits `/journal?from=training:<slug>`.

**Needed — `journal/page.tsx`:**
- read `?from=training:<slug>`, show `← Chapter 2 · Reflect` and the chapter's reflection questions above the editor
- on save, POST `training:<slug>:reflection` and offer "Back to Chapter 2"
- **also implement `?action=gratitude|intention`**, which `practice-routes.ts:71` has been emitting into a page that ignores it since it was written — two of eleven pillars currently land on a generic journal with no prompt

**Acceptance:** round trip from chapter → journal → save → back leaves exactly one reflection record and one training step marked.

### E4. Progress → Training

**File:** `progress/page.tsx`, one card after `<SutraBook />`:

```
YOUR STUDY
2 of 3 chapters sealed · 11 of 24 activities
Last read: Chapter 2 — Consciousness & Self-Awareness
[ Continue learning → ]
```

No new chart, no new metric type, and **not** folded into consistency score, streak or karma — study is reported beside practice, never inside it.

### E5. Pillars ↔ Training (contextual, not a nav loop)

- `pillars/page.tsx` and `pillars/[pillarId]/pillar-detail-client.tsx`: a chip — "Taught in Chapter 8" — via `chapterForPillar()`, linking to the chapter. Only when a published chapter matches.
- Chapter → pillar already exists (snapshot line + footer card).

---

## Order

| # | Task | Depends on | Why this order |
|---|---|---|---|
| 1 | D1–D3 navigation | — | Independent, lowest risk, and it's what makes Training reachable at all on mobile |
| 2 | E1 Dashboard card | — | Highest-value single edge; Training stops being an island |
| 3 | E2 Sessions return path | `&step=` param | Closes the first loop |
| 4 | E3 Journal return path + dead `?action=` | — | Closes the second loop, fixes a live bug |
| 5 | E4 Progress card | — | Reporting, once there is something to report |
| 6 | E5 Pillar chips | — | Smallest, purely additive |

Each is independently shippable and independently revertable.

## Tests to add

- `navigation.test.ts` — every route in the old sidebar/mobile arrays appears in `NAV_GROUPS ∪ NAV_FOOTER ∪ MOBILE_TABS`; no duplicate hrefs; every group non-empty.
- `learning-map.test.ts` (extend) — `&step=` is present and correct for practice vs meditation hrefs; `chapterSlugFromSource` still rejects unknown slugs.
- A guard test asserting **no Training code path posts to `/data/checkin`** — the mechanical form of constraint 3.

## What I am explicitly not doing

- No Achievements, Goals or Posters integration.
- No Day → Chapter mapping anywhere.
- No coupling of chapter completion to streak, karma or check-in.
- No further chapter-height reduction.
- No changes to `/data/*` API contracts — every write above uses the existing generic content-progress store.

## Open questions

1. **D1 naming** — "Journey" as a nav group title (see the caution above). Keep, or "Your Path"?
2. **E2** — when a reader opens the practice step's session and completes it, should that also satisfy the *practice* step, the *meditation* step, or only the one named in `&step=`? Proposal: only the one named, so two distinct activities never collapse into one tick.
3. **E3** — should the journal prefill the question text into the entry body, or show the questions as a prompt panel beside an empty editor? Proposal: prompt panel; prefilled body would make the user's own words indistinguishable from ours in the saved record.
