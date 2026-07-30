// The single authority for writing Training progress.
//
// Sessions is the first surface outside Training that can complete a Training
// activity, so "what does completing an activity mean for the chapter" must
// live in exactly one place. It lives here. Sessions says only "the activity
// that launched me finished"; this module decides whether that seals the
// chapter.
//
// Two hard rules encoded here:
//   1. Chapter completion is DERIVED. Nothing outside this module may write
//      `training-<slug>` — no "if 8/8 then mark complete" anywhere else.
//   2. Training progress is Training progress. This module writes only to
//      /data/content-progress. It never touches journey day, check-in, streak
//      or karma; reading a chapter is not practising.

import { apiFetch } from "@/lib/api";
import {
  getTrainingChapterBySlug,
  trainingContentId,
} from "@/data/training-book";
import {
  chapterStepKeys,
  hasLearningCycle,
  stepContentId,
  type StepKey,
} from "./training-steps";

interface ProgressRecord {
  contentId: string;
  completed: boolean;
}

export interface MarkActivityResult {
  /** False when the write failed, or the request was not valid to begin with. */
  ok: boolean;
  /** Every activity in the chapter is now complete. */
  allComplete: boolean;
  /** The chapter's sealed state as it now stands. */
  chapterSealed: boolean;
  /** First activity still outstanding — where a return link should point. */
  nextStep?: StepKey;
}

const FAILED: MarkActivityResult = {
  ok: false,
  allComplete: false,
  chapterSealed: false,
};

async function write(contentId: string, completed: boolean): Promise<boolean> {
  try {
    await apiFetch("/data/content-progress", {
      method: "POST",
      body: JSON.stringify({
        contentId,
        completed,
        progress: completed ? 100 : 0,
      }),
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Mark one Training activity, then reconcile the chapter.
 *
 * Idempotent: marking an already-complete activity re-asserts the same state
 * and produces no additional side effect.
 *
 * `knownSteps` / `knownSealed` let a caller that already holds the chapter's
 * progress (the chapter page) skip the read. Callers that don't (Sessions)
 * omit them and the current state is fetched.
 */
export async function markTrainingActivity({
  slug,
  step,
  completed = true,
  knownSteps,
  knownSealed,
}: {
  slug: string;
  step: StepKey;
  completed?: boolean;
  knownSteps?: Record<string, boolean>;
  knownSealed?: boolean;
}): Promise<MarkActivityResult> {
  const chapter = getTrainingChapterBySlug(slug);
  if (!chapter || chapter.status !== "published" || !hasLearningCycle(chapter)) {
    return FAILED;
  }

  const keys = chapterStepKeys(chapter);
  if (!keys.includes(step)) return FAILED;

  const ok = await write(stepContentId(slug, step), completed);
  if (!ok) return FAILED;

  // Establish the chapter's full state, from the caller's copy or the store.
  let steps: Record<string, boolean>;
  let sealed: boolean;

  if (knownSteps) {
    steps = { ...knownSteps, [step]: completed };
    sealed = knownSealed ?? false;
  } else {
    try {
      const res = await apiFetch("/data/content-progress");
      const records = (res?.progress || []) as ProgressRecord[];
      const done = new Set(
        records.filter((r) => r.completed).map((r) => r.contentId),
      );
      steps = Object.fromEntries(
        keys.map((k) => [k, done.has(stepContentId(slug, k))]),
      );
      // The write above may not be visible in this read yet — trust it.
      steps[step] = completed;
      sealed = done.has(trainingContentId(slug));
    } catch {
      // The activity is recorded; we just can't reconcile the chapter now. The
      // chapter page will settle it on its next load.
      return { ok: true, allComplete: false, chapterSealed: false };
    }
  }

  const allComplete = keys.length > 0 && keys.every((k) => steps[k]);

  if (allComplete !== sealed) {
    const sealedOk = await write(trainingContentId(slug), allComplete);
    if (!sealedOk) {
      return { ok: true, allComplete, chapterSealed: sealed };
    }
    sealed = allComplete;
  }

  return {
    ok: true,
    allComplete,
    chapterSealed: sealed,
    nextStep: keys.find((k) => !steps[k]),
  };
}
