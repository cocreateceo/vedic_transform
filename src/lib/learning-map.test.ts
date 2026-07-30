import { describe, it, expect } from "vitest";
import {
  chapterForPillar,
  chaptersForPillar,
  chapterSlugFromSource,
  linkForChapter,
  trainingSource,
} from "./learning-map";
import { chapterStepKeys } from "./training-steps";
import { getPublishedChapters, getTrainingChapterBySlug } from "@/data/training-book";
import { PILLARS } from "@/constants/pillars";

describe("chapter → practice mapping", () => {
  it("deep-links a chapter whose pillar has a Sessions practice", () => {
    // Chapter 1 → brahman-connection → the Brahman session tab.
    const link = linkForChapter("connect-to-the-universe")!;
    expect(link.pillar?.slug).toBe("brahman-connection");
    expect(link.sessionKey).toBe("brahman");
    expect(link.practiceHref).toBe(
      "/sessions?practice=brahman&from=training:connect-to-the-universe",
    );
  });

  it("routes a journal pillar to the journal, not to Sessions", () => {
    // Chapter 2 → thoughts-intention, which is a writing practice.
    const link = linkForChapter("consciousness-and-self-awareness")!;
    expect(link.pillar?.slug).toBe("thoughts-intention");
    expect(link.sessionKey).toBeUndefined();
    expect(link.practiceHref).toContain("/journal");
    expect(link.practiceHref).not.toContain("/sessions");
  });

  it("never invents a practice route for a chapter without a pillar", () => {
    const link = linkForChapter("introduction")!;
    expect(link.pillar).toBeUndefined();
    expect(link.practiceHref).toBeUndefined();
  });

  it("resolves the pillar → chapter direction, published only", () => {
    expect(chapterForPillar("thoughts-intention")?.slug).toBe(
      "consciousness-and-self-awareness",
    );
    expect(chapterForPillar("not-a-pillar")).toBeUndefined();
  });

  it("never advertises a chapter the learner cannot open", () => {
    // healing-meditation is taught by a chapter still in writing. Routing only
    // generates published slugs, so a link here would 404.
    expect(chaptersForPillar("healing-meditation")).toEqual([]);
    expect(chapterForPillar("healing-meditation")).toBeUndefined();
    // The relationship still exists in the data — it's just not reachable yet.
    expect(
      chaptersForPillar("healing-meditation", { includeUnpublished: true }),
    ).toHaveLength(1);
  });

  it("is plural, so a future second chapter needs no UI rewrite", () => {
    const all = PILLARS.flatMap((p) => chaptersForPillar(p.slug));
    // Today the mapping is one-to-one; the helper does not encode that.
    expect(Array.isArray(chaptersForPillar("brahman-connection"))).toBe(true);
    expect(all.map((c) => c.slug).sort()).toEqual(
      ["connect-to-the-universe", "consciousness-and-self-awareness"].sort(),
    );
  });

  it("only two pillars currently have a published chapter", () => {
    const mapped = PILLARS.filter((p) => chaptersForPillar(p.slug).length > 0);
    expect(mapped.map((p) => p.slug).sort()).toEqual(
      ["brahman-connection", "thoughts-intention"].sort(),
    );
  });

  it("round-trips: chapter → pillar → same chapter", () => {
    for (const chapter of getPublishedChapters()) {
      const pillarSlug = linkForChapter(chapter.slug)?.pillar?.slug;
      if (!pillarSlug) continue;
      expect(chaptersForPillar(pillarSlug).map((c) => c.slug)).toContain(
        chapter.slug,
      );
    }
  });

  it("round-trips the training source marker", () => {
    expect(chapterSlugFromSource(trainingSource("introduction"))).toBe(
      "introduction",
    );
    expect(chapterSlugFromSource("training:nope")).toBeUndefined();
    expect(chapterSlugFromSource(null)).toBeUndefined();
  });

  it("only maps chapters to pillars that exist", () => {
    for (const chapter of getPublishedChapters()) {
      if (!chapter.relatedPillarSlug) continue;
      expect(
        PILLARS.some((p) => p.slug === chapter.relatedPillarSlug),
      ).toBe(true);
    }
  });
});

describe("meditation without a matching session", () => {
  // A chapter authoring `meditationMinutes` means "sit for this long". It does
  // NOT mean a guided session exists. Where none does, the chapter must run the
  // sit itself rather than dropping the reader on a generic /sessions.
  it("gives every meditation step either a real session or none at all", () => {
    for (const chapter of getPublishedChapters()) {
      if (!chapterStepKeys(chapter).includes("meditation")) continue;
      const link = linkForChapter(chapter.slug);
      if (link?.sessionKey) {
        expect(link.practiceHref).toContain(`practice=${link.sessionKey}`);
      } else {
        // No session mapping — nothing may point at the Sessions page.
        expect(link?.practiceHref ?? "").not.toContain("/sessions");
      }
    }
  });

  it("chapter 2 in particular has minutes but no session", () => {
    const ch2 = getTrainingChapterBySlug("consciousness-and-self-awareness")!;
    expect(ch2.meditationMinutes).toBeGreaterThan(0);
    expect(linkForChapter(ch2.slug)?.sessionKey).toBeUndefined();
  });
});

describe("authored art is reachable", () => {
  // sectionArt.exercises was authored, covered by tests, and rendered only by
  // an unreachable fallback route. The Practice step is now its render site,
  // so the data guarantee it depends on is asserted here.
  it("every chapter with exercises authors its exercises banner", () => {
    for (const chapter of getPublishedChapters()) {
      if (!chapter.exercises?.length) continue;
      expect(chapter.sectionArt?.exercises).toBeTruthy();
    }
  });
});
