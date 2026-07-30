import { describe, it, expect } from "vitest";
import {
  EXTERNALLY_COMPLETABLE_STEPS,
  parseTrainingReturnContext,
  sessionHrefForStep,
} from "./training-return-context";

/** Sessions reads context from URLSearchParams; mirror that exactly. */
const parse = (qs: string) =>
  parseTrainingReturnContext(new URLSearchParams(qs));

// Chapter 1 → brahman-connection → the "brahman" session tab.
const CH1 = "connect-to-the-universe";
const VALID_PRACTICE = `practice=brahman&from=training:${CH1}&step=practice`;
const VALID_MEDITATION = `practice=brahman&from=training:${CH1}&step=meditation`;

describe("valid Training origin", () => {
  it("accepts a chapter + practice", () => {
    const ctx = parse(VALID_PRACTICE);
    expect(ctx).not.toBeNull();
    expect(ctx!.slug).toBe(CH1);
    expect(ctx!.step).toBe("practice");
    expect(ctx!.sessionKey).toBe("brahman");
    expect(ctx!.originHref).toBe(`/training/${CH1}#step-practice`);
    expect(ctx!.label).toBe("Chapter 1 · Practice");
  });

  it("accepts a chapter + meditation, distinctly", () => {
    const ctx = parse(VALID_MEDITATION);
    expect(ctx!.step).toBe("meditation");
    expect(ctx!.originHref).toBe(`/training/${CH1}#step-meditation`);
    expect(ctx!.label).toBe("Chapter 1 · Meditation");
  });

  it("builds the outbound link with an explicit step", () => {
    expect(sessionHrefForStep(CH1, "practice")).toBe(
      `/sessions?practice=brahman&from=training:${CH1}&step=practice`,
    );
    expect(sessionHrefForStep(CH1, "meditation")).toBe(
      `/sessions?practice=brahman&from=training:${CH1}&step=meditation`,
    );
  });

  it("builds no session link for a chapter with no mapped session", () => {
    // Chapter 2 → thoughts-intention → a journal practice, not a session.
    expect(
      sessionHrefForStep("consciousness-and-self-awareness", "meditation"),
    ).toBeUndefined();
  });
});

describe("everything invalid degrades to an ordinary Sessions visit", () => {
  const cases: [string, string][] = [
    ["no params at all", ""],
    ["ordinary session visit", "practice=brahman"],
    ["missing step", `practice=brahman&from=training:${CH1}`],
    ["missing from", "practice=brahman&step=practice"],
    ["missing practice", `from=training:${CH1}&step=practice`],
    ["malformed from", `practice=brahman&from=${CH1}&step=practice`],
    ["empty from slug", "practice=brahman&from=training:&step=practice"],
    ["unknown chapter", "practice=brahman&from=training:nope&step=practice"],
    [
      "unpublished chapter",
      "practice=meditation&from=training:vedic-meditation-and-healing&step=practice",
    ],
    [
      "introduction has no learning cycle",
      "practice=brahman&from=training:introduction&step=practice",
    ],
    ["invalid step", `practice=brahman&from=training:${CH1}&step=banana`],
    [
      "step that is not externally completable",
      `practice=brahman&from=training:${CH1}&step=quiz`,
    ],
    ["unknown session key", `practice=nope&from=training:${CH1}&step=practice`],
    [
      "session that isn't this chapter's",
      // Fasting is a real tab, but not Chapter 1's — otherwise any tab could
      // be used to claim any chapter's activity.
      `practice=fasting&from=training:${CH1}&step=practice`,
    ],
  ];

  for (const [name, qs] of cases) {
    it(`rejects: ${name}`, () => {
      expect(parse(qs)).toBeNull();
    });
  }

  it("never throws on hostile input", () => {
    expect(() => parse("from=training:%%%&step=%00&practice=<script>")).not.toThrow();
    expect(parseTrainingReturnContext(null)).toBeNull();
    expect(parseTrainingReturnContext(undefined)).toBeNull();
  });
});

describe("externally completable activities", () => {
  it("is limited to practice and meditation", () => {
    expect([...EXTERNALLY_COMPLETABLE_STEPS]).toEqual([
      "practice",
      "meditation",
    ]);
  });

  it("cannot be widened by a URL", () => {
    for (const step of ["read", "watch", "takeaways", "quiz", "challenge"]) {
      expect(parse(`practice=brahman&from=training:${CH1}&step=${step}`)).toBeNull();
    }
  });
});
