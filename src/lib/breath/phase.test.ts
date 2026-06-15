import { describe, expect, test } from "vitest";
import { phaseAt } from "./phase";
import type { BreathPattern } from "./patterns";

const box: BreathPattern = {
  id: "box", label: "Box", inhale: 4, holdIn: 4, exhale: 4, holdOut: 4, note: "",
};
const calm: BreathPattern = {
  id: "calm", label: "Calm", inhale: 4, holdIn: 0, exhale: 6, holdOut: 0, note: "",
};

describe("phaseAt", () => {
  test("start of cycle is inhale at progress 0", () => {
    const s = phaseAt(box, 0);
    expect(s.phase).toBe("inhale");
    expect(s.progress).toBeCloseTo(0, 5);
    expect(s.cycle).toBe(0);
  });

  test("box: each 4s segment maps to the right phase", () => {
    expect(phaseAt(box, 2).phase).toBe("inhale");
    expect(phaseAt(box, 5).phase).toBe("holdIn");
    expect(phaseAt(box, 9).phase).toBe("exhale");
    expect(phaseAt(box, 13).phase).toBe("holdOut");
  });

  test("box: progress is fractional position within the phase", () => {
    expect(phaseAt(box, 6).progress).toBeCloseTo(0.5, 5);
  });

  test("cycle index increments after a full cycle", () => {
    expect(phaseAt(box, 16).cycle).toBe(1);
    expect(phaseAt(box, 16).phase).toBe("inhale");
  });

  test("calm pattern skips zero-length holds", () => {
    expect(phaseAt(calm, 0).phase).toBe("inhale");
    expect(phaseAt(calm, 5).phase).toBe("exhale");
  });

  test("openness: 0 fully exhaled, 1 fully inhaled", () => {
    expect(phaseAt(box, 0).openness).toBeCloseTo(0, 5);
    expect(phaseAt(box, 4).openness).toBeCloseTo(1, 1);
    expect(phaseAt(box, 6).openness).toBeCloseTo(1, 5);
    expect(phaseAt(box, 14).openness).toBeCloseTo(0, 5);
  });
});
