// The one place Training's return-context query parameters are parsed.
//
// Sessions is reachable from Training, from the dashboard, from a pillar, and
// from a bookmarked URL a user edited by hand. Only the first of those may
// complete a Training activity, so exactly one module decides whether a given
// URL counts — not NextPracticeCta, and not the fifteen session tabs.
//
// Everything invalid degrades to `null`, which means "ordinary Sessions visit".
// Nothing here ever throws: a mistyped URL is not an error page.

import {
  getTrainingChapterBySlug,
  type TrainingChapter,
} from "@/data/training-book";
import { chapterStepKeys, hasLearningCycle, stepAnchorId } from "./training-steps";
import { linkForChapter } from "./learning-map";
import { SESSION_KEYS, type SessionKey } from "./practice-routes";

/**
 * Activities another surface is allowed to complete on Training's behalf.
 * Reading, watching and the quiz happen inside Training and are not externally
 * completable — listing them here would let a URL tick them.
 */
export const EXTERNALLY_COMPLETABLE_STEPS = ["practice", "meditation"] as const;
export type ExternalStep = (typeof EXTERNALLY_COMPLETABLE_STEPS)[number];

const SOURCE_PREFIX = "training:";

export interface TrainingReturnContext {
  chapter: TrainingChapter;
  slug: string;
  step: ExternalStep;
  sessionKey: SessionKey;
  /** "Chapter 1 · Practice" */
  label: string;
  /** Back to the activity that launched the session. */
  originHref: string;
}

interface ParamSource {
  get(name: string): string | null;
}

/**
 * Builds the outbound link Training uses to send a learner into a session.
 * The step is explicit — never inferred from the session key or the pillar,
 * because Practice and Meditation can legitimately share a session.
 */
export function sessionHrefForStep(slug: string, step: ExternalStep): string | undefined {
  const link = linkForChapter(slug);
  if (!link?.sessionKey) return undefined;
  return `/sessions?practice=${link.sessionKey}&from=${SOURCE_PREFIX}${slug}&step=${step}`;
}

export function parseTrainingReturnContext(
  params: ParamSource | null | undefined,
): TrainingReturnContext | null {
  if (!params) return null;

  const from = params.get("from");
  if (!from || !from.startsWith(SOURCE_PREFIX)) return null;

  const slug = from.slice(SOURCE_PREFIX.length);
  if (!slug) return null;

  const chapter = getTrainingChapterBySlug(slug);
  if (!chapter) return null;
  // An unpublished chapter has no reachable page, and the Introduction has no
  // learning cycle to complete an activity in.
  if (chapter.status !== "published" || !hasLearningCycle(chapter)) return null;

  const rawStep = params.get("step");
  if (!rawStep) return null;
  if (!EXTERNALLY_COMPLETABLE_STEPS.includes(rawStep as ExternalStep)) return null;
  const step = rawStep as ExternalStep;

  // The chapter must actually author this activity.
  if (!chapterStepKeys(chapter).includes(step)) return null;

  const practice = params.get("practice");
  if (!practice || !SESSION_KEYS.includes(practice as SessionKey)) return null;

  // And the session must be the one this chapter's pillar maps to — otherwise
  // any tab could be used to claim any chapter's activity.
  const mapped = linkForChapter(slug)?.sessionKey;
  if (!mapped || mapped !== practice) return null;

  const chapterName =
    chapter.number === 0 ? "Introduction" : `Chapter ${chapter.number}`;

  return {
    chapter,
    slug,
    step,
    sessionKey: practice as SessionKey,
    label: `${chapterName} · ${step === "practice" ? "Practice" : "Meditation"}`,
    originHref: `/training/${slug}#${stepAnchorId(step)}`,
  };
}
