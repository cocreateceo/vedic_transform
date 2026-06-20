import { describe, expect, test } from "vitest";
import { decideLifecycleEmail, type LifecycleState } from "./lifecycle";

const base: LifecycleState = {
  hasJourney: true,
  journeyDay: 1,
  daysSinceLastCheckin: 0,
  alreadySent: new Set(),
};

describe("decideLifecycleEmail", () => {
  test("no active journey → nothing", () => {
    expect(decideLifecycleEmail({ ...base, hasJourney: false })).toBeNull();
  });

  test("day 1 → welcome", () => {
    expect(decideLifecycleEmail(base)).toBe("welcome");
  });

  test("sends the highest reached milestone not yet sent", () => {
    expect(
      decideLifecycleEmail({
        ...base,
        journeyDay: 9,
        alreadySent: new Set(["welcome", "day3"]),
      }),
    ).toBe("day7");
  });

  test("does not resend a milestone already sent", () => {
    expect(
      decideLifecycleEmail({
        ...base,
        journeyDay: 7,
        alreadySent: new Set(["welcome", "day3", "day7"]),
      }),
    ).toBeNull();
  });

  test("day 48 → completion", () => {
    expect(
      decideLifecycleEmail({
        ...base,
        journeyDay: 48,
        alreadySent: new Set(["welcome", "day3", "day7", "day14", "day21", "day30"]),
      }),
    ).toBe("completion");
  });

  test("win-back fires after a 3-day lapse, ahead of milestones", () => {
    expect(
      decideLifecycleEmail({
        ...base,
        journeyDay: 10,
        daysSinceLastCheckin: 4,
        alreadySent: new Set(["welcome", "day3", "day7"]),
      }),
    ).toBe("winback");
  });

  test("win-back does not refire once sent (and no milestone is due yet)", () => {
    expect(
      decideLifecycleEmail({
        ...base,
        journeyDay: 10, // past day7 (sent) but short of day14
        daysSinceLastCheckin: 5,
        alreadySent: new Set(["welcome", "day3", "day7", "winback"]),
      }),
    ).toBeNull();
  });

  test("never checked in → no win-back", () => {
    expect(
      decideLifecycleEmail({
        ...base,
        journeyDay: 5,
        daysSinceLastCheckin: null,
        alreadySent: new Set(["welcome", "day3"]),
      }),
    ).toBeNull();
  });
});
