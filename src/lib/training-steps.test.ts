import { describe, it, expect } from "vitest";
import {
  STAGES,
  chapterStages,
  chapterStepKeys,
  chapterSteps,
  stageForStep,
  stageTitleForStep,
  stepAnchorId,
  stepContentId,
  type StepKey,
} from "./training-steps";
import { getPublishedChapters, getTrainingChapterBySlug } from "@/data/training-book";

const ALL_STEP_KEYS: StepKey[] = [
  "watch",
  "read",
  "takeaways",
  "practice",
  "meditation",
  "reflection",
  "quiz",
  "challenge",
];

describe("learning-cycle steps", () => {
  it("only includes steps the chapter authors content for", () => {
    const intro = getTrainingChapterBySlug("introduction")!;
    const keys = chapterStepKeys(intro);
    // The Introduction has a lesson video and sections but no quiz or
    // challenge — an empty step would be a step about nothing.
    expect(keys).toContain("watch");
    expect(keys).not.toContain("quiz");
    expect(keys).not.toContain("challenge");
  });

  it("numbers steps contiguously within a chapter", () => {
    for (const chapter of getPublishedChapters()) {
      const steps = chapterSteps(chapter);
      steps.forEach((s, i) => {
        expect(s.position).toBe(i + 1);
        expect(s.total).toBe(steps.length);
      });
    }
  });

  it("derives every note from authored content", () => {
    const ch2 = getTrainingChapterBySlug("consciousness-and-self-awareness")!;
    const steps = chapterSteps(ch2);
    const practice = steps.find((s) => s.key === "practice");
    expect(practice?.note).toBe(
      `${ch2.exercises!.length} practices from this chapter`,
    );
    const meditation = steps.find((s) => s.key === "meditation");
    expect(meditation?.note).toBe(`${ch2.meditationMinutes} minute sit`);
  });

  it("keeps step descriptors serializable for the server/client boundary", () => {
    // Chapter pages are server components that pass these to client children;
    // a React component reference on the descriptor would break that.
    for (const step of chapterSteps(getPublishedChapters()[1])) {
      expect(() => JSON.stringify(step)).not.toThrow();
      expect(step).not.toHaveProperty("icon");
    }
  });
});

describe("stages", () => {
  it("assigns every step key to exactly one stage", () => {
    for (const key of ALL_STEP_KEYS) {
      const owners = STAGES.filter((s) => s.steps.includes(key));
      expect(owners).toHaveLength(1);
    }
  });

  it("exposes the five stages in reading order", () => {
    expect(STAGES.map((s) => s.title)).toEqual([
      "Understand",
      "Explore",
      "Practice",
      "Reflect",
      "Complete",
    ]);
  });

  it("resolves a stage title for every step", () => {
    for (const key of ALL_STEP_KEYS) {
      expect(stageTitleForStep(key)).toBeTruthy();
      expect(stageForStep(key)).toBeTruthy();
    }
  });

  it("drops empty stages but always keeps Complete", () => {
    for (const chapter of getPublishedChapters()) {
      const stages = chapterStages(chapter);
      expect(stages.at(-1)?.key).toBe("complete");
      for (const stage of stages.slice(0, -1)) {
        expect(stage.steps.length).toBeGreaterThan(0);
      }
      // Every authored step lands in exactly one rendered stage.
      const inStages = stages.flatMap((s) => s.steps.map((x) => x.key));
      expect(inStages.sort()).toEqual(chapterStepKeys(chapter).sort());
    }
  });
});

describe("progress keys", () => {
  it("uses stable anchor and content ids", () => {
    expect(stepAnchorId("practice")).toBe("step-practice");
    expect(stepContentId("chapter-x", "quiz")).toBe("training:chapter-x:quiz");
  });
});
