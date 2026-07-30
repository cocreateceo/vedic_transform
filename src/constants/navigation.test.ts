import { describe, it, expect } from "vitest";
import {
  MOBILE_TABS,
  NAV_FOOTER,
  NAV_GROUPS,
  allNavHrefs,
  isNavItemActive,
  mobileMoreGroups,
} from "./navigation";

// The exact routes the two hand-maintained arrays exposed before the IA
// change. Regrouping navigation is only safe if nothing fell out of it, so the
// old lists are pinned here rather than trusted to review.
const OLD_DESKTOP = [
  "/dashboard",
  "/pillars",
  "/sessions",
  "/goals",
  "/progress",
  "/journal",
  "/training",
  "/library",
  "/posters",
  "/dosha-assessment",
  "/wisdom",
  "/mood",
  "/achievements",
  "/insights",
  "/reports",
  "/reminders",
  "/settings",
  "/admin",
];

const OLD_MOBILE = [
  "/dashboard",
  "/pillars",
  "/sessions",
  "/progress",
  "/goals",
  "/journal",
  "/library",
  "/training",
  "/posters",
  "/dosha-assessment",
  "/wisdom",
  "/mood",
  "/achievements",
  "/insights",
  "/reports",
  "/reminders",
  "/settings",
];

describe("navigation model", () => {
  it("keeps every route the old desktop sidebar exposed", () => {
    const now = new Set(allNavHrefs());
    const missing = OLD_DESKTOP.filter((href) => !now.has(href));
    expect(missing).toEqual([]);
  });

  it("keeps every route the old mobile nav exposed", () => {
    const now = new Set(allNavHrefs());
    const missing = OLD_MOBILE.filter((href) => !now.has(href));
    expect(missing).toEqual([]);
  });

  it("lists no route twice within the sidebar", () => {
    const hrefs = [
      ...NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href)),
      ...NAV_FOOTER.map((i) => i.href),
    ];
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("uses the four approved groups, in order", () => {
    expect(NAV_GROUPS.map((g) => g.title)).toEqual([
      "Today",
      "Journey",
      "Progress",
      "Explore",
    ]);
  });

  it("never leaves a group empty", () => {
    for (const group of NAV_GROUPS) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });
});

describe("mobile navigation", () => {
  it("puts the four verbs in the bottom bar", () => {
    expect(MOBILE_TABS.map((t) => t.name)).toEqual([
      "Today",
      "Practice",
      "Learn",
      "Progress",
    ]);
    // Training is a thumb target, not a fourth-row item in a sheet.
    expect(MOBILE_TABS.map((t) => t.href)).toContain("/training");
  });

  it("covers every route across the bar and the More sheet", () => {
    const reachable = new Set([
      ...MOBILE_TABS.map((t) => t.href),
      ...mobileMoreGroups(true).flatMap((g) => g.items.map((i) => i.href)),
    ]);
    const missing = allNavHrefs().filter((href) => !reachable.has(href));
    expect(missing).toEqual([]);
  });

  it("never shows a bottom-bar route again inside More", () => {
    const inMore = mobileMoreGroups(true).flatMap((g) =>
      g.items.map((i) => i.href),
    );
    for (const tab of MOBILE_TABS) {
      expect(inMore).not.toContain(tab.href);
    }
  });

  it("hides admin from non-admins on mobile", () => {
    const forUser = mobileMoreGroups(false).flatMap((g) =>
      g.items.map((i) => i.href),
    );
    expect(forUser).not.toContain("/admin");
    const forAdmin = mobileMoreGroups(true).flatMap((g) =>
      g.items.map((i) => i.href),
    );
    expect(forAdmin).toContain("/admin");
  });
});

describe("active state", () => {
  it("matches the route and its children, and nothing else", () => {
    expect(isNavItemActive("/training", "/training")).toBe(true);
    expect(isNavItemActive("/training/introduction", "/training")).toBe(true);
    expect(isNavItemActive("/dashboard", "/training")).toBe(false);
    // Guards against a prefix false-positive between sibling routes.
    expect(isNavItemActive("/progressive", "/progress")).toBe(false);
  });
});
