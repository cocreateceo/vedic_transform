import { describe, it, expect } from "vitest";
import {
  TRAINING_CHAPTERS,
  chapterReadMinutes,
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

  it("relatedPillarSlugs values exist in PILLARS", () => {
    const valid = new Set(PILLARS.map((p) => p.slug));
    for (const c of TRAINING_CHAPTERS) {
      for (const slug of c.relatedPillarSlugs ?? []) {
        expect(valid.has(slug)).toBe(true);
      }
    }
  });

  it("no chapter lists the same pillar twice", () => {
    for (const c of TRAINING_CHAPTERS) {
      const s = c.relatedPillarSlugs ?? [];
      expect(new Set(s).size).toBe(s.length);
    }
  });

  // The central invariant of the two-field model: the practice CTA must point
  // at a pillar the chapter actually teaches.
  it("primaryPillarSlug always belongs to relatedPillarSlugs", () => {
    for (const c of TRAINING_CHAPTERS) {
      if (!c.primaryPillarSlug) continue;
      expect(c.relatedPillarSlugs ?? []).toContain(c.primaryPillarSlug);
    }
  });

  it("the two fields are declared together or not at all", () => {
    for (const c of TRAINING_CHAPTERS) {
      expect(Boolean(c.primaryPillarSlug)).toBe(
        Boolean(c.relatedPillarSlugs?.length),
      );
    }
  });

  it("no pillar is the primary of more than one chapter", () => {
    const primaries = TRAINING_CHAPTERS.map((c) => c.primaryPillarSlug).filter(
      Boolean,
    );
    expect(new Set(primaries).size).toBe(primaries.length);
  });

  it("helpers resolve slugs and content ids", () => {
    expect(getTrainingChapterBySlug("introduction")?.number).toBe(0);
    expect(getTrainingChapterBySlug("nope")).toBeUndefined();
    expect(trainingContentId("introduction")).toBe("training-introduction");
  });

  it("derives sensible reading minutes from authored content", () => {
    // Published chapters carry thousands of words → several minutes each.
    for (const c of getPublishedChapters()) {
      expect(chapterReadMinutes(c)).toBeGreaterThanOrEqual(2);
    }
    // Coming-soon chapters have no content and clamp to the 1-minute floor.
    expect(
      chapterReadMinutes(getTrainingChapterBySlug("dharma-and-purpose")!)
    ).toBe(1);
  });

  it("every chapter has a hero image", () => {
    for (const c of TRAINING_CHAPTERS) {
      expect(c.image).toMatch(/^\/training-media\/hero-.+\.webp$/);
    }
  });

  it("published chapters have section art matching their content", () => {
    for (const c of getPublishedChapters()) {
      expect(c.sectionArt?.summary).toBeTruthy();
      expect(Boolean(c.sectionArt?.exercises)).toBe(
        Boolean(c.exercises && c.exercises.length)
      );
      expect(Boolean(c.sectionArt?.reflections)).toBe(
        Boolean(c.reflectionQuestions && c.reflectionQuestions.length)
      );
    }
  });
});
