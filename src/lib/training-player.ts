// Where the chapter player is pointed, as pure functions.
//
// The chapter used to be a document: all eight activities stacked into one
// 8,800px page (12.3 screens on mobile) that the reader scrolled. It is now a
// player — one activity rendered at a time, chosen here.
//
// This module holds only the decisions, so they can be tested without a DOM:
// where to open, where to go after finishing a step, and which steps a reader
// is allowed to jump to. The component in
// components/features/training/chapter-player.tsx owns the rendering.

import { stepAnchorId, CLOSING_ANCHOR_ID, type StepKey } from "./training-steps";

/**
 * A position in the player. The closing ceremony is a position too — it is
 * where the last Continue lands, and where a completed chapter opens.
 */
export type PlayerPosition = StepKey | "complete";

export const isComplete = (p: PlayerPosition): p is "complete" =>
  p === "complete";

/**
 * Reads an explicitly requested position out of the URL.
 *
 * Two forms are honoured because two different callers already exist:
 *   - `?step=practice`  — the Sessions round trip's documented contract
 *   - `#step-practice`  — what NextPracticeCta actually navigates to, built
 *                         from stepAnchorId(); `#chapter-close` is the seal.
 *
 * Anything unrecognised, or naming a step this chapter doesn't author, returns
 * undefined so the caller falls back to resume.
 */
export function parseRequestedPosition(
  search: string | null | undefined,
  hash: string | null | undefined,
  steps: StepKey[],
): PlayerPosition | undefined {
  const fromHash = (() => {
    if (!hash) return undefined;
    const h = hash.startsWith("#") ? hash.slice(1) : hash;
    if (h === CLOSING_ANCHOR_ID) return "complete" as const;
    return steps.find((k) => stepAnchorId(k) === h);
  })();
  if (fromHash) return fromHash;

  if (!search) return undefined;
  if (search === "complete") return "complete";
  return steps.find((k) => k === search);
}

/**
 * Where the player opens.
 *
 * An explicit request always wins — a learner returning from a session must
 * land on the activity that sent them, even if an earlier one is unfinished.
 * Otherwise the position is COMPUTED from progress rather than remembered:
 * the first unfinished activity, or the closing once everything is done.
 *
 * Before progress loads there is nothing to compute from, so the first step is
 * shown. It is the right answer for a new reader and is corrected in place for
 * a returning one the moment the fetch resolves.
 */
export function initialPosition({
  requested,
  steps,
  done,
  loaded,
}: {
  requested?: PlayerPosition;
  steps: StepKey[];
  done: Record<string, boolean>;
  loaded: boolean;
}): PlayerPosition {
  if (steps.length === 0) return "complete";
  if (requested) return requested;
  if (!loaded) return steps[0];
  return steps.find((k) => !done[k]) ?? "complete";
}

/**
 * Where Continue goes.
 *
 * Deliberately the literal next activity, not "the next unfinished one": a
 * reader revisiting step 3 of a finished chapter expects step 4, not to be
 * thrown to the end. The last activity leads to the closing.
 */
export function positionAfter(
  current: PlayerPosition,
  steps: StepKey[],
): PlayerPosition {
  if (isComplete(current)) return "complete";
  const i = steps.indexOf(current);
  if (i < 0) return steps[0] ?? "complete";
  return i < steps.length - 1 ? steps[i + 1] : "complete";
}

/**
 * Whether a reader may jump straight to a position from the spine.
 *
 * Vedic has always let a reader open any activity in a published chapter, and
 * this change is about how the chapter is presented, not about restricting
 * what it allows. So: everything is reachable. The gate exists as a single
 * named predicate so that adopting strict sequential unlock later (spec Q8) is
 * a one-function change with tests already around it, rather than a hunt
 * through the component.
 */
export function canOpen(_position: PlayerPosition): boolean {
  return true;
}

/** Progress readout for the spine meter. */
export function playerProgress(
  steps: StepKey[],
  done: Record<string, boolean>,
): { completed: number; total: number; percent: number } {
  const total = steps.length;
  const completed = steps.filter((k) => done[k]).length;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
