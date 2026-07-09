# 10x Vedic Training Course Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the "10x Vedic" book (`docs/Training Materials/`) as a self-paced training course at `/training`, with per-chapter completion tracking, a live-classes placeholder, and a public SEO page.

**Architecture:** Content lives in a new typed data file `src/data/training-book.ts` (same pattern as `library-articles.ts`). Two new `(main)` routes (course landing + statically-generated chapter reader) reuse the existing ContentProgress Lambda for completion — zero backend changes. One new `(public)` marketing page.

**Tech Stack:** Next.js 15 App Router, Tailwind v4 (CSS-variable tokens + `.vedic-card`), lucide-react, existing `apiFetch` (`src/lib/api.ts`), Vitest.

**Spec:** `docs/superpowers/specs/2026-07-09-training-course-design.md`

## Global Constraints

- Access model: all `/training` routes go in `src/app/(main)/` (AuthGuard-gated). The marketing page goes in `src/app/(public)/` (public, dark theme `bg-[#0f0d08]`).
- Progress `contentId` convention: `training-<slug>` (e.g. `training-introduction`). API: `GET/POST /data/content-progress` via `apiFetch`.
- No new dependencies. No backend/`functions/` changes. No new DynamoDB tables.
- Styling: use CSS-variable tokens (`var(--color-text-primary)` etc.), `.vedic-card`, `cn()` from `@/lib/utils/cn`, saffron accents (`#DAA520`, orange/amber gradients) — match `library/article/[slug]/page.tsx`.
- Chapter slugs (fixed, used everywhere): `introduction`, `connect-to-the-universe`, `consciousness-and-self-awareness`, `vedic-meditation-and-healing`, `dharma-and-purpose`, `health-energy-and-balance`, `relationships-family-and-community`, `leadership-through-consciousness`, `ai-innovation-and-human-evolution`, `wealth-abundance-and-conscious-business`, `creation-manifestation-and-transformation`, `living-the-10x-vedic-life`.
- Test runner: `npx vitest run <file>` (npm script `test` runs all).
- Commit after every task; work stays on branch `feat/shared-pillar-infrastructure`.

---

### Task 1: Training book data file + integrity tests

**Files:**
- Create: `src/data/training-book.ts`
- Test: `src/data/training-book.test.ts`

**Interfaces:**
- Consumes: `PILLARS` from `src/constants/pillars.ts` (test only).
- Produces (used by Tasks 2, 3, 5):
  - `interface TrainingChapter { slug; number; title; subtitle?; description; status; relatedPillarSlug?; sections?; exercises?; reflectionQuestions?; summary? }`
  - `const TRAINING_CHAPTERS: TrainingChapter[]` (12 entries, ordered by `number`)
  - `getTrainingChapterBySlug(slug: string): TrainingChapter | undefined`
  - `getPublishedChapters(): TrainingChapter[]`
  - `trainingContentId(slug: string): string` → `` `training-${slug}` ``

- [ ] **Step 1: Write the failing test**

Create `src/data/training-book.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  TRAINING_CHAPTERS,
  getTrainingChapterBySlug,
  getPublishedChapters,
  trainingContentId,
} from "./training-book";
import { PILLARS } from "@/constants/pillars";

describe("training book data", () => {
  it("has 12 entries numbered 0-11 in order", () => {
    expect(TRAINING_CHAPTERS).toHaveLength(12);
    TRAINING_CHAPTERS.forEach((c, i) => expect(c.number).toBe(i));
  });

  it("has unique slugs", () => {
    const slugs = TRAINING_CHAPTERS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("publishes introduction and chapters 1-2 only", () => {
    expect(getPublishedChapters().map((c) => c.slug)).toEqual([
      "introduction",
      "connect-to-the-universe",
      "consciousness-and-self-awareness",
    ]);
  });

  it("published chapters carry full content", () => {
    for (const c of getPublishedChapters()) {
      expect(c.sections && c.sections.length).toBeTruthy();
      expect(c.summary && c.summary.length).toBeTruthy();
      for (const s of c.sections!) {
        expect(s.heading).toBeTruthy();
        expect(s.paragraphs.length).toBeGreaterThan(0);
      }
    }
    // Numbered chapters (not the Introduction) also carry practice material.
    for (const c of getPublishedChapters().filter((c) => c.number > 0)) {
      expect(c.exercises && c.exercises.length).toBeTruthy();
      expect(c.reflectionQuestions && c.reflectionQuestions.length).toBeTruthy();
    }
  });

  it("every entry has a description for coming-soon cards", () => {
    for (const c of TRAINING_CHAPTERS) expect(c.description.length).toBeGreaterThan(10);
  });

  it("relatedPillarSlug values exist in PILLARS", () => {
    const valid = new Set(PILLARS.map((p) => p.slug));
    for (const c of TRAINING_CHAPTERS) {
      if (c.relatedPillarSlug) expect(valid.has(c.relatedPillarSlug)).toBe(true);
    }
  });

  it("helpers resolve slugs and content ids", () => {
    expect(getTrainingChapterBySlug("introduction")?.number).toBe(0);
    expect(getTrainingChapterBySlug("nope")).toBeUndefined();
    expect(trainingContentId("introduction")).toBe("training-introduction");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/training-book.test.ts`
Expected: FAIL — `Cannot find module './training-book'` (or equivalent resolve error).

- [ ] **Step 3: Create `src/data/training-book.ts`**

File skeleton (types, helpers, and all 12 entries — content conversion rules below):

```ts
// The "10x Vedic" training course — the book from docs/Training Materials/
// converted into structured data. Introduction + Chapters 1-2 are published;
// chapters 3-11 are outlined (title + description from the Introduction's
// chapter list) and marked coming-soon until authored.
//
// New chapters follow the content-incoming snippet workflow: draft a
// TrainingChapter entry, flip status to "published", append here.

export interface TrainingChapterSection {
  heading: string;
  paragraphs: string[];
}

export interface TrainingExercise {
  title: string; // e.g. "Daily Silence"
  steps: string[];
}

export interface TrainingChapter {
  slug: string;
  number: number; // 0 = Introduction, 1-11 = chapters
  title: string;
  subtitle?: string;
  description: string; // one-liner for cards / coming-soon entries
  status: "published" | "coming-soon";
  relatedPillarSlug?: string; // joins src/constants/pillars.ts
  sections?: TrainingChapterSection[];
  exercises?: TrainingExercise[];
  reflectionQuestions?: string[];
  summary?: string[]; // paragraphs
}

export const TRAINING_CHAPTERS: TrainingChapter[] = [
  // ... 12 entries, number 0-11, see conversion rules ...
];

export const getTrainingChapterBySlug = (slug: string) =>
  TRAINING_CHAPTERS.find((c) => c.slug === slug);

export const getPublishedChapters = () =>
  TRAINING_CHAPTERS.filter((c) => c.status === "published");

export const trainingContentId = (slug: string) => `training-${slug}`;
```

**Content conversion rules** (source files: `docs/Training Materials/Introduction.txt`, `Chapter1.txt`, `Chapter2.txt` — read them in full; they use a one-sentence-per-line style):

1. **Slugs/numbers/titles:** use the exact slug list from Global Constraints; numbers 0–11; titles from the source ("Introduction: 10x Vedic" → title `"10x Vedic"` with subtitle `"Ancient Wisdom. Conscious Leadership. AI-Powered Transformation."`; `"Chapter 1: Connect to the Universe"` → title `"Connect to the Universe"`, subtitle `"Remembering Who You Truly Are"`; Chapter 2 title `"Consciousness & Self-Awareness"`, subtitle `"The Foundation of Every Transformation"`).
2. **Sections:** each heading line in the source (e.g. "The Forgotten Power Within", "The Central Question of Human Life", "Energy and Frequency", "Practical Exercises", "Reflection Questions", "Chapter Summary") starts a section. Everything except Practical Exercises / Reflection Questions / Chapter Summary becomes a `sections[]` entry. Group consecutive single-sentence lines into readable paragraphs of roughly 2–5 related sentences — keep the author's short-line rhythm by joining sentences with spaces, starting a new paragraph at each shift of idea. Preserve wording exactly; fix nothing.
3. **Exercises:** in the "Practical Exercises" section, each mini-heading (e.g. "Daily Silence", "Gratitude Practice", "Nature Connection", "Intuition Journal", "Meditation Practice") becomes a `TrainingExercise` with its following lines as `steps` (one step per source line, quotes like "I am connected." stay as steps).
4. **Reflection questions:** one array item per question line.
5. **Summary:** the "Chapter Summary" lines grouped into paragraphs like rule 2.
6. **Coming-soon chapters (3–11):** `description` comes verbatim from the Introduction's chapter outline (e.g. Chapter 4 → "Discovering life purpose, soul alignment, service to humanity, values-based living, and purposeful decision-making."). No sections/exercises/questions/summary.
7. **Descriptions for published entries:** Introduction → "Why 10x Vedic exists, the five dimensions of evolution, and the journey ahead."; Chapter 1 → the Introduction outline line for Chapter 1; Chapter 2 → the outline line for Chapter 2.
8. **relatedPillarSlug mapping** (only where a clear match exists — omit otherwise): `connect-to-the-universe` → `brahman-connection`; `consciousness-and-self-awareness` → `thoughts-intention`; `vedic-meditation-and-healing` → `healing-meditation`; `health-energy-and-balance` → `nutrition-fasting`; `relationships-family-and-community` → `gratitude`; `creation-manifestation-and-transformation` → `divine-manifestation`. Introduction and remaining chapters: omit.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/training-book.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/training-book.ts src/data/training-book.test.ts
git commit -m "feat(training): add 10x Vedic training book data with integrity tests"
```

---

### Task 2: Chapter reader route `/training/[slug]`

**Files:**
- Create: `src/app/(main)/training/[slug]/page.tsx`
- Create: `src/app/(main)/training/[slug]/chapter-actions.tsx`

**Interfaces:**
- Consumes: `getPublishedChapters`, `getTrainingChapterBySlug`, `trainingContentId`, types from `src/data/training-book.ts`; `PILLARS` from `@/constants/pillars`; `apiFetch` from `@/lib/api`.
- Produces: route `/training/[slug]` (statically generated for published chapters); client component `<ChapterActions contentId prevSlug nextSlug prevTitle nextTitle />`.

- [ ] **Step 1: Create the client actions component**

`src/app/(main)/training/[slug]/chapter-actions.tsx` — "Mark complete" + prev/next footer. Progress failures never block reading; the button surfaces the error inline.

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

interface ChapterActionsProps {
  contentId: string;
  prevSlug?: string;
  prevTitle?: string;
  nextSlug?: string;
  nextTitle?: string;
}

export function ChapterActions({
  contentId,
  prevSlug,
  prevTitle,
  nextSlug,
  nextTitle,
}: ChapterActionsProps) {
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/data/content-progress")
      .then((res) => {
        const records = (res?.progress || []) as {
          contentId: string;
          completed: boolean;
        }[];
        setCompleted(
          records.some((r) => r.contentId === contentId && r.completed)
        );
      })
      .catch(() => {}); // reading never depends on progress
  }, [contentId]);

  const toggleComplete = async () => {
    const next = !completed;
    setSaving(true);
    setError(null);
    try {
      await apiFetch("/data/content-progress", {
        method: "POST",
        body: JSON.stringify({
          contentId,
          completed: next,
          progress: next ? 100 : 0,
        }),
      });
      setCompleted(next);
    } catch {
      setError("Couldn't save your progress. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 pt-8 border-t border-[var(--color-border)]">
      <button
        onClick={toggleComplete}
        disabled={saving}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60",
          completed
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl"
        )}
      >
        {completed ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
        {saving
          ? "Saving..."
          : completed
          ? "Chapter completed — tap to undo"
          : "Mark chapter complete"}
      </button>
      {error && (
        <p className="text-sm text-red-600 text-center" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-stretch gap-4">
        {prevSlug ? (
          <Link
            href={`/training/${prevSlug}`}
            className="vedic-card p-4 flex-1 hover:border-[#DAA520] transition-colors group"
          >
            <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </span>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] mt-1">
              {prevTitle}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {nextSlug ? (
          <Link
            href={`/training/${nextSlug}`}
            className="vedic-card p-4 flex-1 text-right hover:border-[#DAA520] transition-colors group"
          >
            <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              Next <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] mt-1">
              {nextTitle}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the chapter reader page**

`src/app/(main)/training/[slug]/page.tsx` (server component, mirrors the library article page):

```tsx
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ListChecks,
  MessageCircleQuestion,
  ScrollText,
} from "lucide-react";
import {
  getPublishedChapters,
  getTrainingChapterBySlug,
  trainingContentId,
} from "@/data/training-book";
import { PILLARS } from "@/constants/pillars";
import { ChapterActions } from "./chapter-actions";

// Only published chapters are routable; coming-soon slugs 404.
export function generateStaticParams() {
  return getPublishedChapters().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getTrainingChapterBySlug(slug);
  if (!chapter || chapter.status !== "published")
    return { title: "Chapter not found" };
  return {
    title: `${chapter.title} — 10x Vedic Training`,
    description: chapter.description,
  };
}

export default async function TrainingChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getTrainingChapterBySlug(slug);
  if (!chapter || chapter.status !== "published") notFound();

  const published = getPublishedChapters();
  const idx = published.findIndex((c) => c.slug === chapter.slug);
  const prev = idx > 0 ? published[idx - 1] : undefined;
  const next = idx < published.length - 1 ? published[idx + 1] : undefined;
  const pillar = PILLARS.find((p) => p.slug === chapter.relatedPillarSlug);
  const chapterLabel =
    chapter.number === 0 ? "Introduction" : `Chapter ${chapter.number}`;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        href="/training"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Training
      </Link>

      <header className="vedic-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-[#FFF9F0] to-white">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border bg-amber-100 text-amber-700 border-amber-200">
            <BookOpen className="w-3 h-3" />
            {chapterLabel}
          </span>
          {pillar && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)]">
              {pillar.name}
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] leading-tight">
          {chapter.title}
        </h1>
        {chapter.subtitle && (
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
            {chapter.subtitle}
          </p>
        )}
      </header>

      <article className="text-[17px] leading-[1.75] text-[var(--color-text-primary)] space-y-10">
        {chapter.sections?.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-4 text-2xl font-bold border-b-2 border-[#DAA520]/30 pb-2">
              {section.heading}
            </h2>
            <div className="space-y-6">
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {chapter.exercises && chapter.exercises.length > 0 && (
        <section className="vedic-card p-6 sm:p-8 space-y-6 bg-gradient-to-br from-orange-50 to-amber-50">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)]">
            <ListChecks className="w-5 h-5 text-[var(--color-primary)]" />
            Practical Exercises
          </h2>
          {chapter.exercises.map((ex) => (
            <div key={ex.title} className="space-y-2">
              <h3 className="text-sm font-semibold text-orange-800 uppercase tracking-wide">
                {ex.title}
              </h3>
              <ul className="space-y-1.5">
                {ex.steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[15px] leading-relaxed text-[var(--color-text-primary)]"
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#DAA520] shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {chapter.reflectionQuestions && chapter.reflectionQuestions.length > 0 && (
        <section className="vedic-card p-6 sm:p-8 space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)]">
            <MessageCircleQuestion className="w-5 h-5 text-[var(--color-primary)]" />
            Reflection Questions
          </h2>
          <ol className="space-y-3">
            {chapter.reflectionQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[15px] leading-relaxed italic text-[var(--color-text-secondary)]">
                  {q}
                </span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-[var(--color-text-muted)]">
            Take these into your{" "}
            <Link href="/journal" className="text-[var(--color-primary)] underline">
              journal
            </Link>{" "}
            for deeper reflection.
          </p>
        </section>
      )}

      {chapter.summary && chapter.summary.length > 0 && (
        <section className="vedic-card p-6 sm:p-8 space-y-4 border-l-4 border-l-[#DAA520]">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)]">
            <ScrollText className="w-5 h-5 text-[var(--color-primary)]" />
            Chapter Summary
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-[var(--color-text-primary)]">
            {chapter.summary.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {pillar && (
        <Link
          href={`/pillars/${pillar.slug}`}
          className="vedic-card p-4 flex items-center justify-between hover:border-[#DAA520] transition-colors group"
        >
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Deepen this chapter with daily practice
            </p>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
              {pillar.name} pillar
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]" />
        </Link>
      )}

      <ChapterActions
        contentId={trainingContentId(chapter.slug)}
        prevSlug={prev?.slug}
        prevTitle={prev?.title}
        nextSlug={next?.slug}
        nextTitle={next?.title}
      />
    </div>
  );
}
```

- [ ] **Step 3: Verify it builds and renders**

Run: `npm run build`
Expected: build succeeds; output lists `/training/[slug]` as SSG with 3 paths (`introduction`, `connect-to-the-universe`, `consciousness-and-self-awareness`).

- [ ] **Step 4: Commit**

```bash
git add "src/app/(main)/training/[slug]/page.tsx" "src/app/(main)/training/[slug]/chapter-actions.tsx"
git commit -m "feat(training): chapter reader with exercises, reflections, and completion"
```

---

### Task 3: Course landing page `/training`

**Files:**
- Create: `src/app/(main)/training/page.tsx`

**Interfaces:**
- Consumes: `TRAINING_CHAPTERS`, `getPublishedChapters`, `trainingContentId` from `@/data/training-book`; `apiFetch` from `@/lib/api`.
- Produces: route `/training`.

- [ ] **Step 1: Create the landing page**

`src/app/(main)/training/page.tsx` — client page (mirrors `library/page.tsx`'s progress-fetch pattern):

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Lock,
  Mail,
  Video,
} from "lucide-react";
import {
  TRAINING_CHAPTERS,
  getPublishedChapters,
  trainingContentId,
} from "@/data/training-book";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

interface ProgressRecord {
  contentId: string;
  completed: boolean;
}

export default function TrainingPage() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    apiFetch("/data/content-progress")
      .then((res) => {
        const records = (res?.progress || []) as ProgressRecord[];
        setCompletedIds(
          new Set(records.filter((r) => r.completed).map((r) => r.contentId))
        );
      })
      .catch(() => {}); // progress is an enhancement, never a blocker
  }, []);

  const published = getPublishedChapters();
  const completedCount = published.filter((c) =>
    completedIds.has(trainingContentId(c.slug))
  ).length;
  const pct =
    published.length > 0
      ? Math.round((completedCount / published.length) * 100)
      : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Hero */}
      <header className="vedic-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-[#FFF9F0] to-white">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border bg-amber-100 text-amber-700 border-amber-200">
            <GraduationCap className="w-3 h-3" />
            Training Course
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] leading-tight">
          10x Vedic
        </h1>
        <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
          Ancient Wisdom. Conscious Leadership. AI-Powered Transformation. A
          practical framework for living, leading, healing, creating, and
          scaling life from higher awareness.
        </p>

        {/* Course progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <span>
              {completedCount} of {published.length} available chapters
              completed
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </header>

      {/* Chapter list */}
      <section className="space-y-3">
        {TRAINING_CHAPTERS.map((chapter) => {
          const label =
            chapter.number === 0
              ? "Introduction"
              : `Chapter ${chapter.number}`;
          const isPublished = chapter.status === "published";
          const isComplete = completedIds.has(
            trainingContentId(chapter.slug)
          );

          if (!isPublished) {
            return (
              <div
                key={chapter.slug}
                className="vedic-card p-4 sm:p-5 opacity-60"
              >
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-9 h-9 rounded-xl bg-[var(--color-card-bg)] text-[var(--color-text-muted)] flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                      {label} · Coming soon
                    </p>
                    <h2 className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)]">
                      {chapter.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                      {chapter.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={chapter.slug}
              href={`/training/${chapter.slug}`}
              className="vedic-card p-4 sm:p-5 block hover:border-[#DAA520] transition-colors group"
            >
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
                    isComplete
                      ? "bg-green-50 text-green-600"
                      : "bg-gradient-to-br from-orange-500 to-amber-500 text-white"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <BookOpen className="w-4 h-4" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                    {label}
                    {isComplete && " · Completed"}
                  </p>
                  <h2 className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                    {chapter.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                    {chapter.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Live classes placeholder */}
      <section className="vedic-card p-6 sm:p-8 space-y-3 bg-gradient-to-br from-orange-50 to-amber-50">
        <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)]">
          <Video className="w-5 h-5 text-[var(--color-primary)]" />
          Live Classes
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Live guided classes for each chapter are coming soon — group
          sessions, Q&amp;A, and practice together. Register your interest and
          we&apos;ll let you know when enrollment opens.
        </p>
        <a
          href="mailto:cocreateceo@gmail.com?subject=10x%20Vedic%20Live%20Classes%20—%20Register%20Interest"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
        >
          <Mail className="w-4 h-4" />
          Register interest
        </a>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: build succeeds; `/training` appears in the route list.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(main)/training/page.tsx"
git commit -m "feat(training): course landing with progress and live-class placeholder"
```

---

### Task 4: Navigation entries

**Files:**
- Modify: `src/components/layout/sidebar.tsx` (imports at lines 6–24, `navigation` array at lines 28–35)
- Modify: `src/components/layout/mobile-nav.tsx` (imports at lines 6–25, `moreNavItems` array at lines 35–48)

**Interfaces:**
- Consumes: route `/training` (Task 3).
- Produces: "Training" nav item in desktop sidebar primary nav and mobile "More" panel.

- [ ] **Step 1: Add to sidebar**

In `src/components/layout/sidebar.tsx`, add `GraduationCap` to the lucide-react import list, then add to the `navigation` array after Journal:

```ts
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pillars", href: "/pillars", icon: Layers },
  { name: "Sessions", href: "/sessions", icon: Timer },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Training", href: "/training", icon: GraduationCap },
];
```

- [ ] **Step 2: Add to mobile nav**

In `src/components/layout/mobile-nav.tsx`, add `GraduationCap` to the lucide-react import list, then add to `moreNavItems` right after the Library entry:

```ts
  { name: "Training", href: "/training", icon: GraduationCap },
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`
Expected: lint clean, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/sidebar.tsx src/components/layout/mobile-nav.tsx
git commit -m "feat(training): add Training to sidebar and mobile navigation"
```

---

### Task 5: Public marketing page `/10x-vedic`

**Files:**
- Create: `src/app/(public)/10x-vedic/page.tsx`

**Interfaces:**
- Consumes: `TRAINING_CHAPTERS` from `@/data/training-book` (titles/descriptions only — no chapter bodies on the public page).
- Produces: public route `/10x-vedic` inside the dark public layout (`bg-[#0f0d08]`, `PublicNavbar`/`PublicFooter` come from `src/app/(public)/layout.tsx` automatically).

**Note:** the public layout is dark (`bg-[#0f0d08]`) — this page uses the public design idiom from `src/app/(public)/how-it-works/page.tsx`: `pageMetadata` from `@/lib/seo`, JSON-LD Course schema, gradient-text headings, blur-orb hero, `text-[#e2e8f0]` body / `text-[#94a3b8]` secondary.

- [ ] **Step 1: Create the page**

`src/app/(public)/10x-vedic/page.tsx` (server component, static):

```tsx
import Link from "next/link";
import { ArrowRight, GraduationCap, Lock, Sparkles } from "lucide-react";
import { TRAINING_CHAPTERS } from "@/data/training-book";
import { pageMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "10x Vedic Training Course — Free Online Course",
  description:
    "Ancient Wisdom. Conscious Leadership. AI-Powered Transformation. A free 11-chapter training course on living and leading from higher awareness.",
  path: "/10x-vedic",
});

const FIVE_DIMENSIONS = [
  "Consciousness",
  "Health & Energy",
  "Relationships & Service",
  "Leadership & Creation",
  "Wealth & Purpose",
];

export default function TenXVedicPage() {
  return (
    <div className="text-[#e2e8f0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: "10x Vedic Training Course",
            description:
              "An 11-chapter training course combining timeless Vedic wisdom with modern AI-enabled transformation — consciousness, health, relationships, leadership, and wealth.",
            isAccessibleForFree: true,
            provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          }),
        }}
      />

      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
            <GraduationCap className="w-3.5 h-3.5" />
            Free training course
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              10x Vedic
            </span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Ancient Wisdom. Conscious Leadership. AI-Powered Transformation. A
            practical framework for living, leading, healing, creating, and
            scaling life from higher awareness.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
            >
              Start the course <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-white/15 text-[#e2e8f0] hover:bg-white/5 transition-colors"
            >
              Sign in
            </Link>
          </div>
          <p className="mt-4 text-xs text-[#94a3b8]">
            Free with an account — all you need is an email address.
          </p>
        </div>
      </section>

      {/* ═══ Five Dimensions ═══ */}
      <section className="py-20 bg-[#0f0d08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Evolve in{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Five Dimensions
            </span>
          </h2>
          <p className="text-[#94a3b8] max-w-2xl mx-auto mb-10">
            The course is a roadmap toward conscious living and purposeful
            impact — aligned expansion, not working ten times harder.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {FIVE_DIMENSIONS.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/25 bg-amber-500/5 text-sm text-amber-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Chapter Outline ═══ */}
      <section className="py-20 bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
            The{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              11 Chapters
            </span>
          </h2>
          <div className="space-y-3">
            {TRAINING_CHAPTERS.map((chapter) => (
              <div
                key={chapter.slug}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold flex items-center justify-center">
                    {chapter.number === 0 ? "In" : chapter.number}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-semibold text-[#e2e8f0]">
                        {chapter.title}
                      </h3>
                      {chapter.status === "coming-soon" && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-white/15 text-[#94a3b8]">
                          <Lock className="w-2.5 h-2.5" /> Coming soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Closing CTA ═══ */}
      <section className="py-20 bg-[#1a1508] text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <p className="text-xl sm:text-2xl font-semibold leading-relaxed">
            &ldquo;The future does not belong only to the most intelligent.{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              It belongs to the most conscious.
            </span>
            &rdquo;
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
          >
            Begin your journey <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify it builds and is public**

Run: `npm run build`
Expected: build succeeds; `/10x-vedic` listed as static under the public group.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(public)/10x-vedic/page.tsx"
git commit -m "feat(training): public 10x Vedic course marketing page"
```

---

### Task 6: End-to-end verification

**Files:** none (verification only).

- [ ] **Step 1: Full test + lint + build**

Run: `npm run test && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 2: Manual walk (use the `verify` skill / run the dev server)**

Run: `npm run dev`, then verify:
1. `/10x-vedic` renders logged-out (dark theme, chapter outline, CTAs to register/login).
2. Logged in: sidebar shows "Training"; `/training` lists Introduction + 11 chapters, chapters 3–11 locked as "Coming soon" and not clickable.
3. Open Introduction → read → "Mark chapter complete" → button flips to completed state.
4. Back on `/training`: progress bar shows 1 of 3 (33%), Introduction card shows the green check.
5. `/training/dharma-and-purpose` (coming-soon slug) → 404.
6. Chapter 1 shows Practical Exercises, Reflection Questions, Chapter Summary cards and the "Deepen this" pillar link → navigates to `/pillars/brahman-connection`.

- [ ] **Step 3: Fix anything found, then final commit if fixes were made**
