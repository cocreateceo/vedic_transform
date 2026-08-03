import { describe, it, expect } from "vitest";
import {
  MOBILE_TABS,
  NAV_FOOTER,
  NAV_PRIMARY,
  activeSection,
  allNavHrefs,
  isNavItemActive,
  mobileMoreGroups,
  sectionItems,
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

  it("lists no route twice across the whole rail", () => {
    const hrefs = [
      ...NAV_PRIMARY.flatMap((s) => sectionItems(s).map((i) => i.href)),
      ...NAV_FOOTER.map((i) => i.href),
    ];
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("uses the six approved sections, in order", () => {
    expect(NAV_PRIMARY.map((s) => s.name)).toEqual([
      "Dashboard",
      "Training",
      "Pillars",
      "Journal",
      "Progress",
      "Explore",
    ]);
  });

  it("stays within the range an icon rail can carry", () => {
    // Three to seven top-level destinations; sixteen was the reason the old
    // sidebar scrolled and could never be reduced to icons.
    expect(NAV_PRIMARY.length).toBeGreaterThanOrEqual(3);
    expect(NAV_PRIMARY.length).toBeLessThanOrEqual(7);
  });

  it("gives every section something to open", () => {
    for (const section of NAV_PRIMARY) {
      expect(sectionItems(section).length).toBeGreaterThan(0);
    }
  });

  it("only allows a section without its own page to have children", () => {
    // Explore is a grouping, not a destination. A section with neither an href
    // nor children would be a dead entry in the rail.
    for (const section of NAV_PRIMARY) {
      if (!section.href) expect(section.children?.length ?? 0).toBeGreaterThan(0);
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

describe("active section", () => {
  it("lights the section a child route belongs to", () => {
    expect(activeSection("/achievements")?.name).toBe("Progress");
    expect(activeSection("/sessions")?.name).toBe("Training");
    expect(activeSection("/library")?.name).toBe("Explore");
  });

  it("lights a section from its own page", () => {
    expect(activeSection("/journal")?.name).toBe("Journal");
    expect(activeSection("/training/introduction")?.name).toBe("Training");
  });

  it("prefers the longest match", () => {
    // /progress is a section href and /progress/x must not shadow a longer
    // child route were one ever added underneath it.
    expect(activeSection("/progress")?.name).toBe("Progress");
  });

  it("returns nothing for a route outside the model", () => {
    expect(activeSection("/settings")).toBeUndefined();
    expect(activeSection("/nope")).toBeUndefined();
  });

  it("resolves a section for every route the rail exposes", () => {
    for (const section of NAV_PRIMARY) {
      for (const item of sectionItems(section)) {
        expect(activeSection(item.href)?.name).toBe(section.name);
      }
    }
  });
});
