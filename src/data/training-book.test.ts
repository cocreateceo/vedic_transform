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
