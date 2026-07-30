// The one place the Journal's query parameters are interpreted.
//
// /journal is reachable three ways and they are NOT the same workflow:
//
//   1. From a Training chapter's Reflect activity  → source=training&chapter=&prompt=
//   2. From a pillar practice route                → action=gratitude|intention
//   3. Directly                                    → no parameters
//
// (2) has been emitted by src/lib/practice-routes.ts since it was written and
// silently ignored by the Journal ever since — two of eleven pillars have been
// landing on a generic page with no prompt.
//
// Precedence is deterministic so two modes can never compete visually:
//   valid Training reflection → Training reflection mode
//   else valid action         → Journal practice mode
//   else                      → ordinary Journal
//
// An invalid Training context does not suppress an otherwise valid action.
// Nothing here throws; every malformed input degrades to ordinary Journal.

import {
  getTrainingChapterBySlug,
  type TrainingChapter,
} from "@/data/training-book";
import { chapterStepKeys, hasLearningCycle, stepAnchorId } from "./training-steps";
import { PILLARS, type Pillar } from "@/constants/pillars";
import type { JournalAction } from "./practice-routes";

/** Journal practice modes a pillar can deep-link into. */
export const JOURNAL_PRACTICE_ACTIONS = ["gratitude", "intention"] as const;
export type JournalPracticeAction = (typeof JOURNAL_PRACTICE_ACTIONS)[number];

const ACTION_PILLAR: Record<JournalPracticeAction, string> = {
  gratitude: "gratitude",
  intention: "thoughts-intention",
};

export interface TrainingReflectionContext {
  kind: "training-reflection";
  chapter: TrainingChapter;
  slug: string;
  /** All authored questions for the chapter. */
  prompts: string[];
  /** The specific question requested, when the link named one. */
  promptIndex?: number;
  /** Back to the Reflect activity in the chapter. */
  originHref: string;
}

export interface JournalPracticeContext {
  kind: "practice";
  action: JournalPracticeAction;
  pillar?: Pillar;
}

export interface OrdinaryJournalContext {
  kind: "ordinary";
}

export type JournalContext =
  | TrainingReflectionContext
  | JournalPracticeContext
  | OrdinaryJournalContext;

const ORDINARY: OrdinaryJournalContext = { kind: "ordinary" };

interface ParamSource {
  get(name: string): string | null;
}

/** The link a chapter's Reflect activity uses to open the Journal. */
export function journalHrefForReflection(
  slug: string,
  promptIndex?: number,
): string {
  const base = `/journal?source=training&chapter=${encodeURIComponent(slug)}`;
  return typeof promptIndex === "number" ? `${base}&prompt=${promptIndex}` : base;
}

/**
 * Resolves the authored prompt for a stored entry's Training context.
 *
 * Returns null when the entry has no Training context, or when the chapter or
 * prompt it referenced no longer exists — the caller then renders it as an
 * ordinary journal entry. The user's prose is never hidden because authored
 * content moved.
 */
export function resolveEntryTrainingContext(entry: {
  source?: string | null;
  chapterSlug?: string | null;
  promptIndex?: number | null;
}): { label: string; prompt?: string } | null {
  if (entry?.source !== "training" || !entry.chapterSlug) return null;
  const chapter = getTrainingChapterBySlug(entry.chapterSlug);
  if (!chapter) return null;

  const label =
    chapter.number === 0 ? "Introduction" : `Chapter ${chapter.number}`;
  const prompts = chapter.reflectionQuestions ?? [];
  const idx = entry.promptIndex;
  const prompt =
    typeof idx === "number" && idx >= 0 && idx < prompts.length
      ? prompts[idx]
      : undefined;

  return { label: `${label} · ${chapter.title}`, prompt };
}

function parseTrainingReflection(
  params: ParamSource,
): TrainingReflectionContext | null {
  if (params.get("source") !== "training") return null;

  const slug = params.get("chapter");
  if (!slug) return null;

  const chapter = getTrainingChapterBySlug(slug);
  if (!chapter) return null;
  if (chapter.status !== "published" || !hasLearningCycle(chapter)) return null;

  // The chapter must actually have a reflection activity to complete.
  if (!chapterStepKeys(chapter).includes("reflection")) return null;

  const prompts = chapter.reflectionQuestions ?? [];
  if (prompts.length === 0) return null;

  // A named prompt must exist. An absent one is fine — the panel then shows
  // every question, which is the chapter's own presentation.
  let promptIndex: number | undefined;
  const raw = params.get("prompt");
  if (raw !== null) {
    if (!/^\d+$/.test(raw)) return null;
    const idx = Number(raw);
    if (idx < 0 || idx >= prompts.length) return null;
    promptIndex = idx;
  }

  return {
    kind: "training-reflection",
    chapter,
    slug,
    prompts,
    promptIndex,
    originHref: `/training/${slug}#${stepAnchorId("reflection")}`,
  };
}

function parsePractice(params: ParamSource): JournalPracticeContext | null {
  const action = params.get("action") as JournalAction | null;
  if (!action) return null;
  if (!JOURNAL_PRACTICE_ACTIONS.includes(action as JournalPracticeAction)) {
    return null;
  }
  const key = action as JournalPracticeAction;
  return {
    kind: "practice",
    action: key,
    pillar: PILLARS.find((p) => p.slug === ACTION_PILLAR[key]),
  };
}

export function parseJournalContext(
  params: ParamSource | null | undefined,
): JournalContext {
  if (!params) return ORDINARY;
  return parseTrainingReflection(params) ?? parsePractice(params) ?? ORDINARY;
}
