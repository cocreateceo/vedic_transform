// "Where is this learner in the book, and what should they do next?"
//
// The Training landing worked this out inline. The dashboard needs the same
// answer, and two implementations of "which chapter is current" would drift the
// way the two navigation arrays did. One selector, both surfaces.
//
// It reads nothing itself — callers pass the completed content ids they already
// fetched — so it stays pure and testable.

import {
  chapterReadMinutes,
  getPublishedChapters,
  trainingContentId,
  type TrainingChapter,
} from "@/data/training-book";
import {
  chapterStepKeys,
  hasLearningCycle,
  stageTitleForStep,
  stepAnchorId,
  stepContentId,
  type StepKey,
} from "./training-steps";
import { linkForChapter, type LearningLink } from "./learning-map";

export type TrainingState =
  /** Nothing published — the surface should render nothing at all. */
  | "no-content"
  /** Published chapters exist and none has been touched. */
  | "not-started"
  /** A chapter is sealed; the next one hasn't been started. */
  | "resuming"
  /** Part-way through the current chapter. */
  | "in-progress"
  /** Every published chapter is sealed. NOT "the 48-day Journey is done". */
  | "caught-up";

export interface TrainingSelection {
  state: TrainingState;
  publishedCount: number;
  chaptersSealed: number;
  /** Percent of published chapters sealed. */
  percentComplete: number;
  /** Reading time left across every unsealed published chapter. */
  remainingMinutes: number;

  /** The chapter to point at. Undefined only when state is "no-content". */
  chapter?: TrainingChapter;
  stepKeys: StepKey[];
  stepsComplete: number;
  nextStep?: StepKey;
  /** Stage name of the next activity — "Practice", "Reflect", … */
  nextStepStage?: string;
  /** Deep link to the next incomplete activity, or the chapter top. */
  href: string;
  /** Pillar / practice join, present only when the book authors one. */
  link?: LearningLink;
}

export function selectTraining(completedIds: Set<string>): TrainingSelection {
  const published = getPublishedChapters();

  if (published.length === 0) {
    return {
      state: "no-content",
      publishedCount: 0,
      chaptersSealed: 0,
      percentComplete: 0,
      remainingMinutes: 0,
      stepKeys: [],
      stepsComplete: 0,
      href: "/training",
    };
  }

  const isSealed = (c: TrainingChapter) =>
    completedIds.has(trainingContentId(c.slug));
  const chaptersSealed = published.filter(isSealed).length;
  const percentComplete = Math.round((chaptersSealed / published.length) * 100);

  // The current chapter is the first published one not yet sealed.
  const chapter = published.find((c) => !isSealed(c));
  const remainingMinutes = published
    .filter((c) => !isSealed(c))
    .reduce((sum, c) => sum + chapterReadMinutes(c), 0);

  if (!chapter) {
    const last = published[published.length - 1];
    return {
      state: "caught-up",
      publishedCount: published.length,
      chaptersSealed,
      percentComplete,
      remainingMinutes: 0,
      chapter: last,
      stepKeys: hasLearningCycle(last) ? chapterStepKeys(last) : [],
      stepsComplete: hasLearningCycle(last) ? chapterStepKeys(last).length : 0,
      href: `/training/${last.slug}`,
      link: linkForChapter(last.slug),
    };
  }

  // The Introduction has no learning cycle — counting activities for it would
  // promise steps its page never renders, and linking to #step-… would land on
  // an anchor that doesn't exist.
  const stepKeys = hasLearningCycle(chapter) ? chapterStepKeys(chapter) : [];
  const doneKeys = stepKeys.filter((k) =>
    completedIds.has(stepContentId(chapter.slug, k)),
  );
  const nextStep = stepKeys.find(
    (k) => !completedIds.has(stepContentId(chapter.slug, k)),
  );

  const state: TrainingState =
    doneKeys.length > 0
      ? "in-progress"
      : chaptersSealed > 0
        ? "resuming"
        : "not-started";

  return {
    state,
    publishedCount: published.length,
    chaptersSealed,
    percentComplete,
    remainingMinutes,
    chapter,
    stepKeys,
    stepsComplete: doneKeys.length,
    nextStep,
    nextStepStage: nextStep ? stageTitleForStep(nextStep) : undefined,
    href: nextStep
      ? `/training/${chapter.slug}#${stepAnchorId(nextStep)}`
      : `/training/${chapter.slug}`,
    link: linkForChapter(chapter.slug),
  };
}

export interface TrainingSummary {
  /** Current/next chapter, from the same selector every other surface uses. */
  selection: TrainingSelection;
  /** Published chapters only — unpublished ones never inflate a total. */
  publishedChapters: number;
  chaptersComplete: number;
  /**
   * Published chapters that actually use the learning-cycle model. The
   * Introduction is excluded: it has no activities, and giving it a fake
   * "0 of 8" would describe a page that doesn't exist.
   */
  cycleChapters: number;
  totalActivities: number;
  completedActivities: number;
}

/**
 * Whole-course counts, derived once so Dashboard, /training and /progress can
 * never disagree. Read-only: it takes the completed ids a caller already has
 * and returns numbers. Nothing here writes.
 */
export function summarizeTraining(completedIds: Set<string>): TrainingSummary {
  const published = getPublishedChapters();
  const selection = selectTraining(completedIds);

  const cycleChapters = published.filter(hasLearningCycle);
  let totalActivities = 0;
  let completedActivities = 0;

  for (const chapter of cycleChapters) {
    const keys = chapterStepKeys(chapter);
    totalActivities += keys.length;
    completedActivities += keys.filter((k) =>
      completedIds.has(stepContentId(chapter.slug, k)),
    ).length;
  }

  return {
    selection,
    publishedChapters: published.length,
    chaptersComplete: published.filter((c) =>
      completedIds.has(trainingContentId(c.slug)),
    ).length,
    cycleChapters: cycleChapters.length,
    totalActivities,
    completedActivities,
  };
}

/** The one CTA label for a selection. Never more than one action per surface. */
export function trainingCtaLabel(selection: TrainingSelection): string {
  switch (selection.state) {
    case "not-started":
      return "Start Chapter";
    case "resuming":
      return "Continue Training";
    case "in-progress":
      return "Continue";
    case "caught-up":
      return "Review Training";
    default:
      return "Open Training";
  }
}
