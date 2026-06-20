import { describe, expect, test } from "vitest";
import {
  dayMilestoneShare,
  streakShare,
  dayMilestoneToCelebrate,
} from "./share-links";

describe("dayMilestoneShare", () => {
  test("mid-journey day points at /share with the day card", () => {
    const s = dayMilestoneShare(7);
    expect(s.url).toContain("/share?");
    expect(s.url).toContain("big=Day+7");
    expect(s.text).toContain("Day 7");
  });

  test("day 48 reads as completion", () => {
    const s = dayMilestoneShare(48);
    expect(s.text.toLowerCase()).toContain("completed");
    expect(s.url).toContain("complete");
  });
});

describe("streakShare", () => {
  test("encodes the streak length into the card", () => {
    const s = streakShare(21);
    expect(s.url).toContain("big=21");
    expect(s.url).toContain("Day+Streak");
    expect(s.text).toContain("21-day streak");
  });
});

describe("dayMilestoneToCelebrate", () => {
  test("returns the milestone just reached", () => {
    expect(dayMilestoneToCelebrate(7, new Set())).toBe(7);
  });

  test("skips already-celebrated milestones", () => {
    expect(dayMilestoneToCelebrate(8, new Set([7]))).toBeNull();
  });

  test("returns the highest uncelebrated reached milestone", () => {
    expect(dayMilestoneToCelebrate(25, new Set([7]))).toBe(21);
  });

  test("nothing before the first milestone", () => {
    expect(dayMilestoneToCelebrate(3, new Set())).toBeNull();
  });

  test("completion at day 48", () => {
    expect(dayMilestoneToCelebrate(48, new Set([7, 21]))).toBe(48);
  });
});
