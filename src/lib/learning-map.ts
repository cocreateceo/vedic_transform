// The join between what the book teaches and what the app makes you do.
//
// Three vocabularies already existed and never met:
//   - training chapters   (src/data/training-book.ts, with relatedPillarSlug)
//   - the 11 pillars      (src/constants/pillars.ts)
//   - Sessions practices  (src/lib/practice-routes.ts)
//
// `relatedPillarSlug` was authored for 7 of the 12 chapters but consumed in
// exactly one place — a card at the bottom of the chapter page. This module
// exposes the join in both directions so a chapter can send you to the right
// practice, and a pillar can tell you which chapter explains it.
//
// No new data is authored here. Everything is derived.

import {
  TRAINING_CHAPTERS,
  type TrainingChapter,
  getTrainingChapterBySlug,
} from "@/data/training-book";
import { PILLARS, type Pillar } from "@/constants/pillars";
import {
  PILLAR_TO_JOURNAL,
  PILLAR_TO_SESSION,
  type JournalAction,
  type SessionKey,
} from "./practice-routes";

/**
 * Marks a practice route as having been reached from a chapter, so the
 * destination can show a breadcrumb back and record the step on completion.
 */
export const trainingSource = (slug: string) => `training:${slug}`;

/** Parses a `?from=` value back into a chapter slug. */
export function chapterSlugFromSource(
  source: string | null | undefined,
): string | undefined {
  if (!source?.startsWith("training:")) return undefined;
  const slug = source.slice("training:".length);
  return getTrainingChapterBySlug(slug) ? slug : undefined;
}

export interface LearningLink {
  chapter: TrainingChapter;
  pillar?: Pillar;
  sessionKey?: SessionKey;
  journalAction?: JournalAction;
  /** Where the chapter's practice is actually done, or undefined if unmapped. */
  practiceHref?: string;
  /** Human label for that destination, e.g. "Brahman session". */
  practiceLabel?: string;
}

export function linkForChapter(slug: string): LearningLink | undefined {
  const chapter = getTrainingChapterBySlug(slug);
  if (!chapter) return undefined;

  const pillar = chapter.relatedPillarSlug
    ? PILLARS.find((p) => p.slug === chapter.relatedPillarSlug)
    : undefined;

  if (!pillar) return { chapter };

  const sessionKey = PILLAR_TO_SESSION[pillar.slug];
  if (sessionKey) {
    return {
      chapter,
      pillar,
      sessionKey,
      practiceHref: `/sessions?practice=${sessionKey}&from=${trainingSource(slug)}`,
      practiceLabel: `${pillar.name} session`,
    };
  }

  const journalAction = PILLAR_TO_JOURNAL[pillar.slug];
  if (journalAction) {
    return {
      chapter,
      pillar,
      journalAction,
      practiceHref: `/journal?action=${journalAction}&from=${trainingSource(slug)}`,
      practiceLabel: `${pillar.name} in your journal`,
    };
  }

  return { chapter, pillar };
}

/**
 * Every chapter that teaches a pillar.
 *
 * Plural on purpose: today the data is one-to-one, but nothing in the content
 * model guarantees it stays that way, and a one-chapter assumption buried in
 * several Pillar components would be expensive to unpick later.
 *
 * Published-only by default — the UI must never advertise "Taught in Chapter N"
 * for a chapter the learner cannot open. `generateStaticParams` only routes
 * published slugs, so an unpublished link would 404.
 */
export function chaptersForPillar(
  pillarSlug: string,
  { includeUnpublished = false } = {},
): TrainingChapter[] {
  return TRAINING_CHAPTERS.filter(
    (c) =>
      c.relatedPillarSlug === pillarSlug &&
      (includeUnpublished || c.status === "published"),
  );
}

/**
 * The single published chapter that teaches a pillar, for surfaces that render
 * one. Undefined when the pillar has no reachable chapter.
 */
export function chapterForPillar(
  pillarSlug: string,
): TrainingChapter | undefined {
  return chaptersForPillar(pillarSlug)[0];
}

/** Short label for a chapter, matching how the training pages name them. */
export const chapterLabel = (chapter: TrainingChapter) =>
  chapter.number === 0 ? "Introduction" : `Chapter ${chapter.number}`;
