import { describe, it, expect } from "vitest";
import {
  canOpen,
  initialPosition,
  isComplete,
  parseRequestedPosition,
  playerProgress,
  positionAfter,
} from "./training-player";
import type { StepKey } from "./training-steps";

const STEPS: StepKey[] = [
  "watch",
  "read",
  "takeaways",
  "practice",
  "meditation",
  "reflection",
  "quiz",
  "challenge",
];

const noneDone: Record<string, boolean> = {};
const allDone = Object.fromEntries(STEPS.map((k) => [k, true]));

describe("parseRequestedPosition", () => {
  it("reads the anchor NextPracticeCta actually navigates to", () => {
    // The Sessions return builds `/training/<slug>#step-<key>`.
    expect(parseRequestedPosition(null, "#step-practice", STEPS)).toBe(
      "practice",
    );
  });

  it("reads the documented ?step= contract", () => {
    expect(parseRequestedPosition("meditation", null, STEPS)).toBe("meditation");
  });

  it("maps the closing anchor to the complete position", () => {
    expect(parseRequestedPosition(null, "#chapter-close", STEPS)).toBe(
      "complete",
    );
    expect(parseRequestedPosition("complete", null, STEPS)).toBe("complete");
  });

  it("prefers the hash when both are present", () => {
    // The hash is what a real navigation carries; ?step= may be stale.
    expect(parseRequestedPosition("quiz", "#step-read", STEPS)).toBe("read");
  });

  it("ignores a step this chapter does not author", () => {
    expect(parseRequestedPosition("quiz", null, ["read", "practice"])).toBeUndefined();
    expect(
      parseRequestedPosition(null, "#step-quiz", ["read", "practice"]),
    ).toBeUndefined();
  });

  it("ignores junk rather than throwing", () => {
    expect(parseRequestedPosition("../../etc", "#nonsense", STEPS)).toBeUndefined();
    expect(parseRequestedPosition(null, null, STEPS)).toBeUndefined();
    expect(parseRequestedPosition("", "", STEPS)).toBeUndefined();
  });

  it("tolerates a hash without its leading #", () => {
    expect(parseRequestedPosition(null, "step-quiz", STEPS)).toBe("quiz");
  });
});

describe("initialPosition", () => {
  it("opens the first step for a new reader", () => {
    expect(
      initialPosition({ steps: STEPS, done: noneDone, loaded: true }),
    ).toBe("watch");
  });

  it("resumes at the first unfinished step", () => {
    const done = { watch: true, read: true, takeaways: true };
    expect(initialPosition({ steps: STEPS, done, loaded: true })).toBe(
      "practice",
    );
  });

  it("opens the closing when everything is done", () => {
    expect(initialPosition({ steps: STEPS, done: allDone, loaded: true })).toBe(
      "complete",
    );
  });

  it("shows the first step while progress is still loading", () => {
    // Nothing to compute from yet; corrected in place once the fetch lands.
    expect(
      initialPosition({ steps: STEPS, done: noneDone, loaded: false }),
    ).toBe("watch");
  });

  it("an explicit request beats resume", () => {
    // Returning from a session must land on the activity that sent you, even
    // though an earlier activity is unfinished.
    const done = { watch: false };
    expect(
      initialPosition({
        requested: "practice",
        steps: STEPS,
        done,
        loaded: true,
      }),
    ).toBe("practice");
  });

  it("an explicit request beats a completed chapter", () => {
    expect(
      initialPosition({ requested: "read", steps: STEPS, done: allDone, loaded: true }),
    ).toBe("read");
  });

  it("degrades to the closing for a chapter with no steps", () => {
    expect(initialPosition({ steps: [], done: noneDone, loaded: true })).toBe(
      "complete",
    );
  });
});

describe("positionAfter", () => {
  it("advances to the literal next step", () => {
    expect(positionAfter("watch", STEPS)).toBe("read");
    expect(positionAfter("practice", STEPS)).toBe("meditation");
  });

  it("does NOT skip a step that happens to be done", () => {
    // A reader revisiting step 3 of a finished chapter expects step 4, not to
    // be thrown to the end.
    expect(positionAfter("takeaways", STEPS)).toBe("practice");
  });

  it("lands on the closing after the last step", () => {
    expect(positionAfter("challenge", STEPS)).toBe("complete");
  });

  it("stays put at the closing", () => {
    expect(positionAfter("complete", STEPS)).toBe("complete");
  });

  it("handles a chapter whose step list omits the current key", () => {
    expect(positionAfter("quiz", ["read", "practice"])).toBe("read");
    expect(positionAfter("quiz", [])).toBe("complete");
  });

  it("walks the whole chapter and terminates", () => {
    let pos = initialPosition({ steps: STEPS, done: noneDone, loaded: true });
    const seen: string[] = [];
    for (let i = 0; i < 50 && !isComplete(pos); i++) {
      seen.push(pos);
      pos = positionAfter(pos, STEPS);
    }
    expect(seen).toEqual(STEPS);
    expect(isComplete(pos)).toBe(true);
  });
});

describe("canOpen", () => {
  it("keeps every activity reachable, as today", () => {
    // This change is about presentation, not about restricting what a reader
    // is allowed to open. Strict sequential unlock is spec Q8, not this pass.
    for (const k of STEPS) expect(canOpen(k)).toBe(true);
    expect(canOpen("complete")).toBe(true);
  });
});

describe("playerProgress", () => {
  it("counts only this chapter's steps", () => {
    const done = { watch: true, read: true, quiz: true, notAStep: true };
    expect(playerProgress(STEPS, done)).toEqual({
      completed: 3,
      total: 8,
      percent: 38,
    });
  });

  it("reports 100% when sealed and 0% when empty", () => {
    expect(playerProgress(STEPS, allDone).percent).toBe(100);
    expect(playerProgress(STEPS, noneDone).percent).toBe(0);
  });

  it("never divides by zero", () => {
    expect(playerProgress([], noneDone)).toEqual({
      completed: 0,
      total: 0,
      percent: 0,
    });
  });
});
