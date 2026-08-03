import { describe, it, expect } from "vitest";
import {
  nextRailPreference,
  parseRailPreference,
  railCollapsed,
  type RailPreference,
} from "./nav-rail";

describe("rail preference parsing", () => {
  it("accepts the two explicit values", () => {
    expect(parseRailPreference("expanded")).toBe("expanded");
    expect(parseRailPreference("collapsed")).toBe("collapsed");
  });

  it("treats anything else as auto", () => {
    // A first visit, a cleared store, or a value from a future version.
    expect(parseRailPreference(null)).toBe("auto");
    expect(parseRailPreference("")).toBe("auto");
    expect(parseRailPreference("auto")).toBe("auto");
    expect(parseRailPreference("{}")).toBe("auto");
  });
});

describe("railCollapsed", () => {
  it("collapses inside Training on auto", () => {
    expect(railCollapsed("auto", "/training")).toBe(true);
    expect(railCollapsed("auto", "/training/introduction")).toBe(true);
  });

  it("stays expanded everywhere else on auto", () => {
    for (const p of ["/dashboard", "/sessions", "/pillars", "/journal", "/progress"]) {
      expect(railCollapsed("auto", p)).toBe(false);
    }
  });

  it("does not collapse on a route that merely starts with the same letters", () => {
    expect(railCollapsed("auto", "/trainingcamp")).toBe(false);
  });

  it("an explicit preference beats the route, in both directions", () => {
    // The whole point: once the reader has chosen, navigating must not
    // silently override them.
    expect(railCollapsed("expanded", "/training/introduction")).toBe(false);
    expect(railCollapsed("collapsed", "/dashboard")).toBe(true);
  });
});

describe("nextRailPreference", () => {
  it("toggling always yields an explicit preference, never auto", () => {
    const cases: [RailPreference, string][] = [
      ["auto", "/training"],
      ["auto", "/dashboard"],
      ["expanded", "/training"],
      ["collapsed", "/dashboard"],
    ];
    for (const [pref, path] of cases) {
      expect(nextRailPreference(pref, path)).not.toBe("auto");
    }
  });

  it("toggling flips what is currently on screen", () => {
    for (const [pref, path] of [
      ["auto", "/training"],
      ["auto", "/dashboard"],
      ["expanded", "/dashboard"],
      ["collapsed", "/training"],
    ] as [RailPreference, string][]) {
      const before = railCollapsed(pref, path);
      const after = railCollapsed(nextRailPreference(pref, path), path);
      expect(after).toBe(!before);
    }
  });

  it("toggling out of auto inside Training expands, and sticks", () => {
    const pref = nextRailPreference("auto", "/training/introduction");
    expect(pref).toBe("expanded");
    // Still expanded after moving to another chapter — the earlier bug shape
    // would have re-collapsed on navigation.
    expect(railCollapsed(pref, "/training/consciousness-and-self-awareness")).toBe(
      false,
    );
  });

  it("is stable when applied twice", () => {
    const once = nextRailPreference("auto", "/dashboard");
    const twice = nextRailPreference(once, "/dashboard");
    expect(railCollapsed(twice, "/dashboard")).toBe(
      railCollapsed("auto", "/dashboard"),
    );
  });
});
