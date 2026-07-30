import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { selectTraining, summarizeTraining } from "./training-selection";
import {
  getPublishedChapters,
  TRAINING_CHAPTERS,
  trainingContentId,
} from "@/data/training-book";
import {
  chapterStepKeys,
  hasLearningCycle,
  stepContentId,
} from "./training-steps";

const published = getPublishedChapters();
const [intro, ch1, ch2] = published;
const sealed = (...slugs: string[]) =>
  new Set(slugs.map((s) => trainingContentId(s)));

describe("counting rules", () => {
  it("counts only published chapters — unpublished never inflate the total", () => {
    const s = summarizeTraining(new Set());
    expect(s.publishedChapters).toBe(published.length);
    expect(s.publishedChapters).toBeLessThan(TRAINING_CHAPTERS.length);
  });

  it("excludes the Introduction from activity totals", () => {
    const s = summarizeTraining(new Set());
    const expected = published
      .filter(hasLearningCycle)
      .reduce((n, c) => n + chapterStepKeys(c).length, 0);
    expect(s.totalActivities).toBe(expected);
    expect(s.cycleChapters).toBe(published.filter(hasLearningCycle).length);
    // The Introduction is published and completable, but contributes no
    // activities — it must not appear as a fake "0 of 8".
    expect(s.publishedChapters).toBeGreaterThan(s.cycleChapters);
    expect(chapterStepKeys(intro).length).toBeGreaterThan(0);
  });

  it("counts a sealed Introduction as a completed chapter", () => {
    const s = summarizeTraining(sealed(intro.slug));
    expect(s.chaptersComplete).toBe(1);
    // …without inventing activity progress for it.
    expect(s.completedActivities).toBe(0);
  });

  it("counts completed activities across chapters", () => {
    const keys1 = chapterStepKeys(ch1);
    const keys2 = chapterStepKeys(ch2);
    const done = new Set([
      stepContentId(ch1.slug, keys1[0]),
      stepContentId(ch1.slug, keys1[1]),
      stepContentId(ch2.slug, keys2[0]),
    ]);
    expect(summarizeTraining(done).completedActivities).toBe(3);
  });

  it("never reports more complete than available", () => {
    const all = new Set<string>();
    for (const c of published) {
      all.add(trainingContentId(c.slug));
      for (const k of chapterStepKeys(c)) all.add(stepContentId(c.slug, k));
    }
    const s = summarizeTraining(all);
    expect(s.chaptersComplete).toBe(s.publishedChapters);
    expect(s.completedActivities).toBe(s.totalActivities);
    expect(s.selection.state).toBe("caught-up");
  });

  it("ignores malformed and stale progress ids", () => {
    const junk = new Set([
      "training:not-a-chapter:practice",
      "training-nope",
      "",
      "random-key",
      stepContentId(ch1.slug, "not-a-step" as never),
    ]);
    const s = summarizeTraining(junk);
    expect(s.chaptersComplete).toBe(0);
    expect(s.completedActivities).toBe(0);
    expect(s.selection.state).toBe("not-started");
  });
});

describe("surfaces agree", () => {
  // Dashboard, /training and /progress all derive from selectTraining, so the
  // summary's selection must be identical to a direct call.
  const scenarios: [string, Set<string>][] = [
    ["nothing started", new Set()],
    ["intro sealed", sealed(intro.slug)],
    [
      "chapter 1 partly done",
      new Set([
        trainingContentId(intro.slug),
        stepContentId(ch1.slug, chapterStepKeys(ch1)[0]),
      ]),
    ],
    ["two chapters sealed", sealed(intro.slug, ch1.slug)],
    ["everything sealed", sealed(intro.slug, ch1.slug, ch2.slug)],
  ];

  for (const [name, ids] of scenarios) {
    it(`agrees on current chapter and completion: ${name}`, () => {
      const summary = summarizeTraining(ids);
      const direct = selectTraining(ids);
      expect(summary.selection.chapter?.slug).toBe(direct.chapter?.slug);
      expect(summary.selection.state).toBe(direct.state);
      expect(summary.selection.href).toBe(direct.href);
      expect(summary.chaptersComplete).toBe(direct.chaptersSealed);
    });
  }

  it("deep-links to the next incomplete activity when partly done", () => {
    const keys = chapterStepKeys(ch1);
    const s = summarizeTraining(
      new Set([
        trainingContentId(intro.slug),
        stepContentId(ch1.slug, keys[0]),
      ]),
    );
    expect(s.selection.href).toContain("#step-");
    expect(s.selection.nextStep).toBe(keys[1]);
  });
});

describe("Progress contains no Training write path", () => {
  const read = (p: string) =>
    readFileSync(join(__dirname, "..", p), "utf8");

  it("the Progress card only reads", () => {
    const src = read("components/features/progress/training-progress-card.tsx");
    expect(src).not.toMatch(/markTrainingActivity/);
    expect(src).not.toMatch(/method:\s*["']POST["']/);
    expect(src).not.toMatch(/creditPillar|\/data\/checkin|\/data\/journey/);
  });

  it("the summary utility performs no I/O", () => {
    const src = read("lib/training-selection.ts");
    expect(src).not.toMatch(/apiFetch|fetch\(/);
  });
});
