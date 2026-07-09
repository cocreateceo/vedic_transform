# 10x Vedic Training Course — Design Spec

**Date:** 2026-07-09
**Status:** Approved
**Source content:** `docs/Training Materials/` (Introduction.txt, Chapter1.txt, Chapter2.txt — chapters 3–11 to be authored later)

## Goal

Publish the "10x Vedic" book as a self-paced training course inside the app, structured so live/cohort classes can attach later. Access: free, login required (rides on the existing `(main)` AuthGuard). Live classes ship as a placeholder only.

## Decisions made

- **Approach:** Dedicated course section (not library articles, not a DB-backed LMS).
- **Access:** Free with login; no paywall in this version.
- **Live classes:** "Coming soon — register interest" block only; data model leaves room for cohorts later.
- **Content format:** Structured TypeScript data (typed sections/exercises/questions), not HTML blobs — the chapters have a rigid, consistent shape.

## Routes

| Route | Group | Purpose |
|---|---|---|
| `/training` | `(main)` | Course landing: hero, overall progress, ordered chapter list, live-class placeholder |
| `/training/[slug]` | `(main)` | Chapter reader, statically generated per published chapter |
| `/10x-vedic` | `(public)` | SEO/marketing page: course overview, five dimensions, 11-chapter outline, register CTA |

### Course landing (`/training`)

- Hero: title + tagline ("Ancient Wisdom. Conscious Leadership. AI-Powered Transformation.").
- Overall progress bar: completed published chapters / total published chapters, from ContentProgress.
- Chapter list in order: Introduction (number 0) then Chapters 1–11.
  - `published` chapters: clickable cards → `/training/[slug]`, show completion checkmark.
  - `coming-soon` chapters: non-clickable cards with title + one-line description (descriptions come from the Introduction's chapter outline).
- Live classes block: "Live classes coming soon" + "Register interest" action as a `mailto:` link to the site contact address — no new backend.

### Chapter reader (`/training/[slug]`)

- Layout mirrors `library/article/[slug]`: centered `max-w-3xl mx-auto space-y-8`, `.vedic-card` header with chapter number, title, subtitle.
- Body: narrative sections as headed prose.
- Distinct styled cards for: **Practical Exercises** (checklist-style), **Reflection Questions** (journaling style), **Chapter Summary**.
- Optional "related pillar" cross-link ("Deepen this: → pillar page") when `relatedPillarSlug` is set.
- Footer: "Mark chapter complete" button + prev/next chapter navigation.
- `generateStaticParams` over published chapters; unknown slugs → `notFound()`.

### Public page (`/10x-vedic`)

- What the course is, the five dimensions (Consciousness; Health & Energy; Relationships & Service; Leadership & Creation; Wealth & Purpose), the 11-chapter outline, closing thought, CTA to register/login. No chapter body content (it's login-gated).

## Data model

New file `src/data/training-book.ts`:

```ts
export interface TrainingChapterSection {
  heading: string;
  paragraphs: string[];
}

export interface TrainingExercise {
  title: string;      // e.g. "Daily Silence"
  steps: string[];
}

export interface TrainingChapter {
  slug: string;                 // "introduction", "connect-to-the-universe", ...
  number: number;               // 0 = Introduction, 1–11 = chapters
  title: string;
  subtitle?: string;            // e.g. "Remembering Who You Truly Are"
  description: string;          // one-liner for cards / coming-soon entries
  status: "published" | "coming-soon";
  relatedPillarSlug?: string;   // joins src/constants/pillars.ts
  sections?: TrainingChapterSection[];
  exercises?: TrainingExercise[];
  reflectionQuestions?: string[];
  summary?: string[];           // paragraphs
}

export const TRAINING_CHAPTERS: TrainingChapter[];
```

- All 12 entries exist from day one; only Introduction, Chapter 1, Chapter 2 are `published`.
- Content conversion from the .txt files happens at implementation time (the .txt files use one-sentence-per-line style; conversion groups them into paragraphs under their headings).
- Future chapters follow the existing `content-incoming-*.snippet` → merge-into-`src/data` workflow.

## Progress

- Reuse the existing ContentProgress Lambda/table (`functions/data/content-progress.ts`) unchanged.
- `contentId` convention: `training-<slug>` (e.g. `training-introduction`).
- Chapter reader POSTs `{ completed: true }` on "Mark chapter complete"; landing page GETs the user's records and computes course progress client-side.
- Failure handling: progress API errors never block reading; the complete button surfaces an error toast and the page remains usable.

## Navigation

- Add "Training" to `src/components/layout/sidebar.tsx` and `mobile-nav.tsx` (lucide `GraduationCap`).

## Out of scope

Payments/paywall, cohort scheduling/registration, admin UI, certificates, video content, dashboard surfacing of course cards.

## Verification

Run the app; walk `/training` → Introduction → Chapter 1 → mark complete → confirm the landing page progress updates; confirm coming-soon chapters are not routable; confirm `/10x-vedic` renders publicly without auth.
