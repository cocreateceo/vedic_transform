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
      for (const slug of chapter.relatedPillarSlugs ?? []) {
        expect(PILLARS.some((p) => p.slug === slug)).toBe(true);
      }
    }
  });
});

describe("plural pillar model", () => {
  const ch = (slug: string) => getTrainingChapterBySlug(slug)!;

  it("preserves the seven migrated single mappings unchanged", () => {
    const expected: [string, string][] = [
      ["connect-to-the-universe", "brahman-connection"],
      ["consciousness-and-self-awareness", "thoughts-intention"],
      ["vedic-meditation-and-healing", "healing-meditation"],
      ["relationships-family-and-community", "gratitude"],
      ["nutrition-and-fasting", "nutrition-fasting"],
      ["creation-manifestation-and-transformation", "divine-manifestation"],
    ];
    for (const [slug, pillar] of expected) {
      expect(ch(slug).relatedPillarSlugs).toEqual([pillar]);
      expect(ch(slug).primaryPillarSlug).toBe(pillar);
    }
  });

  it("Chapter 3 maps ONLY to healing-meditation", () => {
    // Sandhya / breathing / manifestation were proposed and rejected: the
    // authored content is description-level only and never names them.
    expect(ch("vedic-meditation-and-healing").relatedPillarSlugs).toEqual([
      "healing-meditation",
    ]);
  });

  it("Chapter 5 remains unmapped", () => {
    expect(ch("health-energy-and-balance").relatedPillarSlugs).toBeUndefined();
    expect(ch("health-energy-and-balance").primaryPillarSlug).toBeUndefined();
  });

  it("Chapter 9 teaches movement AND sleep-optimization", () => {
    const c = ch("movement-exercise-and-sleep-optimization");
    expect(c.relatedPillarSlugs).toEqual(["movement", "sleep-optimization"]);
    expect(c.primaryPillarSlug).toBe("movement");
  });

  it("finds Chapter 9 from either of its pillars when unpublished is included", () => {
    for (const p of ["movement", "sleep-optimization"]) {
      expect(
        chaptersForPillar(p, { includeUnpublished: true }).map((c) => c.slug),
      ).toContain("movement-exercise-and-sleep-optimization");
    }
  });

  it("does not expose Chapter 9 to the published-only default", () => {
    for (const p of ["movement", "sleep-optimization"]) {
      expect(chaptersForPillar(p)).toEqual([]);
    }
  });

  it("array ORDER carries no behaviour", () => {
    // The whole point of the explicit primary field. Reversing the array must
    // not change where the chapter's Practice CTA goes.
    const c = ch("movement-exercise-and-sleep-optimization");
    const before = linkForChapter(c.slug)?.pillar?.slug;
    const original = c.relatedPillarSlugs!;
    try {
      c.relatedPillarSlugs = [...original].reverse();
      expect(linkForChapter(c.slug)?.pillar?.slug).toBe(before);
      expect(before).toBe("movement");
    } finally {
      c.relatedPillarSlugs = original;
    }
  });

  it("changing the primary DOES change the practice destination", () => {
    const c = ch("movement-exercise-and-sleep-optimization");
    const original = c.primaryPillarSlug;
    try {
      c.primaryPillarSlug = "sleep-optimization";
      expect(linkForChapter(c.slug)?.sessionKey).toBe("sleep");
    } finally {
      c.primaryPillarSlug = original;
    }
    expect(linkForChapter(c.slug)?.sessionKey).toBe("movement");
  });

  it("live pillar→chapter chips are unchanged: still exactly two", () => {
    const live = PILLARS.filter((p) => chaptersForPillar(p.slug).length > 0);
    expect(live.map((p) => p.slug).sort()).toEqual(
      ["brahman-connection", "thoughts-intention"].sort(),
    );
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
