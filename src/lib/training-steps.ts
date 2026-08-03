// The chapter learning cycle, defined once.
//
// Before this file existed the step list was authored twice — once in
// chapter-experience.tsx (titles only, for the outline drawer) and once in
// chapter-journey.tsx (titles + notes + icons, for the cycle section). The two
// lists had already drifted. Everything that needs to know "what are this
// chapter's steps, in what order" now reads from here: the chapter page, the
// outline drawer, the training landing, and the dashboard teaching card.
//
// A step exists for a chapter only when the chapter authors the content that
// step is about — no empty steps, and no invented ones.

import {
  BookOpen,
  Flame,
  Lightbulb,
  ListChecks,
  NotebookPen,
  PlayCircle,
  Sparkles,
  Timer,
} from "lucide-react";
import type { TrainingChapter } from "@/data/training-book";

export type StepKey =
  | "watch"
  | "read"
  | "takeaways"
  | "practice"
  | "meditation"
  | "reflection"
  | "quiz"
  | "challenge";

type IconComponent = React.ComponentType<{ className?: string }>;

interface StepDefinition {
  key: StepKey;
  title: string;
  icon: IconComponent;
  /** True when the chapter authors the content this step is about. */
  isAuthored: (chapter: TrainingChapter) => boolean;
  /** One-line description, derived from the chapter's own content. */
  note: (chapter: TrainingChapter) => string;
}

// Order is the reading order of the page itself — the page renders these
// sections top to bottom, so step 1 is the first thing you meet.
const DEFINITIONS: StepDefinition[] = [
  {
    key: "watch",
    title: "Watch the Cinematic Lesson",
    icon: PlayCircle,
    isAuthored: (c) => Boolean(c.lessonVideoId),
    note: () => "The chapter told as a short documentary",
  },
  {
    key: "read",
    title: "Read the Chapter",
    icon: BookOpen,
    isAuthored: (c) => (c.sections?.length ?? 0) > 0,
    note: (c) => `${c.sections?.length ?? 0} movements`,
  },
  {
    key: "takeaways",
    title: "Key Learnings",
    icon: Lightbulb,
    isAuthored: (c) => Boolean(c.keyTakeaways?.length),
    note: (c) => `${c.keyTakeaways?.length ?? 0} to carry with you`,
  },
  {
    key: "practice",
    title: "Daily Practices",
    icon: ListChecks,
    isAuthored: (c) => Boolean(c.exercises?.length),
    note: (c) => `${c.exercises?.length ?? 0} practices from this chapter`,
  },
  {
    key: "meditation",
    title: "Guided Meditation",
    icon: Timer,
    isAuthored: (c) => Boolean(c.meditationMinutes),
    note: (c) => `${c.meditationMinutes} minute sit`,
  },
  {
    key: "reflection",
    title: "Reflection Journal",
    icon: NotebookPen,
    isAuthored: (c) => Boolean(c.reflectionQuestions?.length),
    note: () => "Write before you move on",
  },
  {
    key: "quiz",
    title: "Self-Assessment",
    icon: Sparkles,
    isAuthored: (c) => Boolean(c.quiz?.length),
    note: (c) => `${c.quiz?.length ?? 0} questions`,
  },
  {
    key: "challenge",
    title: "Daily Challenge",
    icon: Flame,
    isAuthored: (c) => Boolean(c.dailyChallenge),
    note: () => "One real-world action",
  },
];

/**
 * Icons live apart from ChapterStep so a step descriptor stays fully
 * serializable — chapter pages are server components that hand these lists to
 * client children, and a React component reference can't cross that boundary.
 */
export const STEP_ICONS: Record<StepKey, IconComponent> = DEFINITIONS.reduce(
  (acc, d) => {
    acc[d.key] = d.icon;
    return acc;
  },
  {} as Record<StepKey, IconComponent>,
);

export interface ChapterStep {
  key: StepKey;
  title: string;
  note: string;
  /** 1-based position among *this chapter's* steps. */
  position: number;
  total: number;
}

/**
 * Whether this chapter actually renders the learning cycle.
 *
 * The routing in app/(main)/training/[slug]/page.tsx sends the Introduction to
 * IntroductionExperience — a ceremonial opening with no step sections and no
 * `#step-…` anchors — and every numbered chapter to ChapterExperience. Anything
 * that counts activities or builds a resume link must respect that split, or it
 * will promise activities the page never renders and link to anchors that don't
 * exist.
 */
export const hasLearningCycle = (chapter: TrainingChapter): boolean =>
  chapter.number >= 1;

export function chapterSteps(chapter: TrainingChapter): ChapterStep[] {
  const authored = DEFINITIONS.filter((d) => d.isAuthored(chapter));
  return authored.map((d, i) => ({
    key: d.key,
    title: d.title,
    note: d.note(chapter),
    position: i + 1,
    total: authored.length,
  }));
}

export function chapterStepKeys(chapter: TrainingChapter): StepKey[] {
  return DEFINITIONS.filter((d) => d.isAuthored(chapter)).map((d) => d.key);
}

/* ————— Stages ————— */
//
// Five stages group the eight tracked actions. They exist for orientation and
// for the outline rail — NOT as five more banner sections. A reader should be
// able to tell they have moved from learning to practising without the page
// announcing "Step 5 of 8" above every heading.

export type StageKey =
  | "understand"
  | "explore"
  | "practice"
  | "reflect"
  | "complete";

export const STAGES: { key: StageKey; title: string; steps: StepKey[] }[] = [
  { key: "understand", title: "Understand", steps: ["watch", "read"] },
  { key: "explore", title: "Explore", steps: ["takeaways"] },
  { key: "practice", title: "Practice", steps: ["practice", "meditation"] },
  {
    key: "reflect",
    title: "Reflect",
    steps: ["reflection", "quiz", "challenge"],
  },
  { key: "complete", title: "Complete", steps: [] },
];

export function stageForStep(key: StepKey): StageKey {
  return STAGES.find((s) => s.steps.includes(key))?.key ?? "understand";
}

export function stageTitleForStep(key: StepKey): string {
  return STAGES.find((s) => s.steps.includes(key))?.title ?? "";
}

export interface ChapterStage {
  key: StageKey;
  title: string;
  steps: ChapterStep[];
}

/** Stages this chapter actually has content for, plus the closing stage. */
export function chapterStages(chapter: TrainingChapter): ChapterStage[] {
  const steps = chapterSteps(chapter);
  return STAGES.map((stage) => ({
    key: stage.key,
    title: stage.title,
    steps: steps.filter((s) => stage.steps.includes(s.key)),
  })).filter((stage) => stage.steps.length > 0 || stage.key === "complete");
}

/** DOM id of a step's section — the target for outline jumps and resume links. */
/**
 * One-word labels for the spine and for any surface naming the next activity.
 * The step's own `title` is the panel heading; this is the index entry.
 */
export const STEP_SHORT_LABELS: Record<StepKey, string> = {
  watch: "Watch",
  read: "Read",
  takeaways: "Takeaways",
  practice: "Practice",
  meditation: "Meditate",
  reflection: "Reflect",
  quiz: "Quiz",
  challenge: "Challenge",
};

export const stepAnchorId = (key: StepKey) => `step-${key}`;

/** DOM id the "Complete" stage scrolls to. */
export const CLOSING_ANCHOR_ID = "chapter-close";

/** Key this step is stored under in the generic /data/content-progress store. */
export const stepContentId = (slug: string, key: StepKey) =>
  `training:${slug}:${key}`;
