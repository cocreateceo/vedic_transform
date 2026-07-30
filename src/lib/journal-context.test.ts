import { describe, it, expect } from "vitest";
import {
  journalHrefForReflection,
  parseJournalContext,
} from "./journal-context";
import { getTrainingChapterBySlug } from "@/data/training-book";

const parse = (qs: string) => parseJournalContext(new URLSearchParams(qs));

const CH1 = "connect-to-the-universe";
const ch1 = getTrainingChapterBySlug(CH1)!;
const PROMPTS = ch1.reflectionQuestions!.length;

describe("Training reflection context", () => {
  it("accepts source + chapter, showing every authored question", () => {
    const c = parse(`source=training&chapter=${CH1}`);
    expect(c.kind).toBe("training-reflection");
    if (c.kind !== "training-reflection") return;
    expect(c.slug).toBe(CH1);
    expect(c.prompts).toHaveLength(PROMPTS);
    expect(c.promptIndex).toBeUndefined();
    expect(c.originHref).toBe(`/training/${CH1}#step-reflection`);
  });

  it("accepts a specific authored prompt", () => {
    const c = parse(`source=training&chapter=${CH1}&prompt=2`);
    expect(c.kind).toBe("training-reflection");
    if (c.kind !== "training-reflection") return;
    expect(c.promptIndex).toBe(2);
  });

  it("does not assume prompt 0 is the only valid prompt", () => {
    for (let i = 0; i < PROMPTS; i++) {
      const c = parse(`source=training&chapter=${CH1}&prompt=${i}`);
      expect(c.kind).toBe("training-reflection");
      if (c.kind === "training-reflection") expect(c.promptIndex).toBe(i);
    }
  });

  it("builds its own link", () => {
    expect(journalHrefForReflection(CH1)).toBe(
      `/journal?source=training&chapter=${CH1}`,
    );
    expect(journalHrefForReflection(CH1, 3)).toBe(
      `/journal?source=training&chapter=${CH1}&prompt=3`,
    );
  });
});

describe("Training reflection rejection matrix", () => {
  const cases: [string, string][] = [
    ["no params", ""],
    ["wrong source", `source=nope&chapter=${CH1}`],
    ["missing chapter", "source=training"],
    ["unknown chapter", "source=training&chapter=nope"],
    ["unpublished chapter", "source=training&chapter=dharma-and-purpose"],
    ["introduction has no learning cycle", "source=training&chapter=introduction"],
    ["prompt out of range", `source=training&chapter=${CH1}&prompt=${PROMPTS}`],
    ["negative prompt", `source=training&chapter=${CH1}&prompt=-1`],
    ["non-numeric prompt", `source=training&chapter=${CH1}&prompt=two`],
    ["empty prompt", `source=training&chapter=${CH1}&prompt=`],
  ];

  for (const [name, qs] of cases) {
    it(`falls back to ordinary Journal: ${name}`, () => {
      expect(parse(qs).kind).toBe("ordinary");
    });
  }

  it("never throws on hostile input", () => {
    expect(() => parse("source=training&chapter=%%%&prompt=%00")).not.toThrow();
    expect(parseJournalContext(null).kind).toBe("ordinary");
    expect(parseJournalContext(undefined).kind).toBe("ordinary");
  });
});

describe("Journal practice mode (the repaired ?action= links)", () => {
  it("recognises gratitude and names its pillar", () => {
    const c = parse("action=gratitude");
    expect(c.kind).toBe("practice");
    if (c.kind !== "practice") return;
    expect(c.action).toBe("gratitude");
    expect(c.pillar?.slug).toBe("gratitude");
  });

  it("recognises intention and names its pillar", () => {
    const c = parse("action=intention");
    expect(c.kind).toBe("practice");
    if (c.kind !== "practice") return;
    expect(c.action).toBe("intention");
    expect(c.pillar?.slug).toBe("thoughts-intention");
  });

  it("rejects actions that are not Journal practices", () => {
    // `manifestation` is a JournalAction in practice-routes but has no
    // deep-link practice mode here; it must not fabricate one.
    expect(parse("action=manifestation").kind).toBe("ordinary");
    expect(parse("action=banana").kind).toBe("ordinary");
    expect(parse("action=").kind).toBe("ordinary");
  });

  it("matches what practice-routes actually emits", async () => {
    const { practiceRouteForPillar } = await import("./practice-routes");
    for (const pillar of ["gratitude", "thoughts-intention"]) {
      const href = practiceRouteForPillar(pillar);
      const qs = href.split("?")[1] ?? "";
      expect(parse(qs).kind).toBe("practice");
    }
  });
});

describe("precedence", () => {
  it("valid Training reflection wins over a valid action", () => {
    const c = parse(`source=training&chapter=${CH1}&prompt=0&action=gratitude`);
    expect(c.kind).toBe("training-reflection");
  });

  it("an invalid Training context does not suppress a valid action", () => {
    const c = parse("source=training&chapter=nope&action=gratitude");
    expect(c.kind).toBe("practice");
    if (c.kind === "practice") expect(c.action).toBe("gratitude");
  });

  it("falls through to ordinary when both are invalid", () => {
    expect(parse("source=training&chapter=nope&action=banana").kind).toBe(
      "ordinary",
    );
  });
});
