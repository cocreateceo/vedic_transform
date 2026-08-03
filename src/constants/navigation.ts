// The one navigation model, shared by the desktop rail and the mobile nav.
//
// These used to be two hand-maintained arrays in two components, and they had
// already drifted: Training was a top-level item on desktop and a fourth-row
// entry inside a "More" sheet on mobile, and Goals and Journal had the same
// split. Two components, one model — they can't disagree again.
//
// The model is now two levels. Sixteen flat destinations made every subpage a
// primary one, which is why the sidebar needed its own scrollbar and why an
// icon rail was impossible — you cannot draw sixteen icons in one column and
// expect anyone to read it. Six sections carry the app; everything else lives
// under the section it belongs to and is still one click away.
//
// Nothing was dropped. navigation.test.ts pins the exact route list the flat
// model exposed and fails if any of it stops being reachable.
//
// Vocabulary (fixed — do not reuse these words for each other):
//   Journey  = the overall 48-day programme
//   Training = the educational / book experience
//   Parts    = the Training curriculum grouping
//   Pillars  = practice domains
//   Sessions = the actual practices

import {
  Bell,
  BookMarked,
  BookOpen,
  Compass,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Leaf,
  Quote,
  Settings,
  Shield,
  SmilePlus,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  FileText,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Rendered only for users with Users.role === "admin". */
  adminOnly?: boolean;
}

export interface NavSection {
  name: string;
  /**
   * The section's own page. Absent for a section that is purely a grouping —
   * Explore has no landing page of its own, so it opens its children instead.
   */
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

/**
 * The six sections.
 *
 * Sessions sits under Training by product decision. Note the tension: the
 * vocabulary above treats Sessions as practice rather than learning, and the
 * mobile bar keeps /sessions as a primary thumb target ("Practice"). Both
 * remain true — this is where it is *filed*, not a claim that practice is a
 * kind of study.
 */
export const NAV_PRIMARY: NavSection[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Training",
    href: "/training",
    icon: GraduationCap,
    children: [
      { name: "Sessions", href: "/sessions", icon: Timer },
      { name: "Goals", href: "/goals", icon: Target },
    ],
  },
  { name: "Pillars", href: "/pillars", icon: Layers },
  { name: "Journal", href: "/journal", icon: BookOpen },
  {
    name: "Progress",
    href: "/progress",
    icon: TrendingUp,
    children: [
      { name: "Achievements", href: "/achievements", icon: Trophy },
      { name: "Insights", href: "/insights", icon: Sparkles },
      // Records of what happened, not things you do today.
      { name: "Reports", href: "/reports", icon: FileText },
      { name: "Mood", href: "/mood", icon: SmilePlus },
    ],
  },
  {
    name: "Explore",
    icon: Compass,
    children: [
      { name: "Library", href: "/library", icon: BookMarked },
      { name: "Posters", href: "/posters", icon: ImageIcon },
      { name: "Wisdom", href: "/wisdom", icon: Quote },
      { name: "Dosha Quiz", href: "/dosha-assessment", icon: Leaf },
    ],
  },
];

export const NAV_FOOTER: NavItem[] = [
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Admin", href: "/admin", icon: Shield, adminOnly: true },
];

/**
 * The mobile bottom bar — four verbs. Labels differ from the rail
 * deliberately: a thumb target reads better as a verb ("Learn") than as a
 * noun ("Training").
 */
export const MOBILE_TABS: NavItem[] = [
  { name: "Today", href: "/dashboard", icon: LayoutDashboard },
  { name: "Practice", href: "/sessions", icon: Timer },
  { name: "Learn", href: "/training", icon: GraduationCap },
  { name: "Progress", href: "/progress", icon: TrendingUp },
];

const TAB_HREFS = new Set(MOBILE_TABS.map((t) => t.href));

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/** Every item a section contains, including the section's own page. */
export const sectionItems = (section: NavSection): NavItem[] => [
  ...(section.href
    ? [{ name: section.name, href: section.href, icon: section.icon }]
    : []),
  ...(section.children ?? []),
];

/**
 * What the mobile "More" sheet shows: one group per section, minus whatever
 * the bottom bar already covers, so no route appears twice on one screen.
 * Empty groups drop out.
 */
export const mobileMoreGroups = (isAdmin: boolean): NavGroup[] =>
  [
    ...NAV_PRIMARY.map((s) => ({ title: s.name, items: sectionItems(s) })),
    { title: "Account", items: NAV_FOOTER },
  ]
    .map((group) => ({
      title: group.title,
      items: group.items.filter(
        (item) => !TAB_HREFS.has(item.href) && (!item.adminOnly || isAdmin),
      ),
    }))
    .filter((group) => group.items.length > 0);

/** Every route the navigation exposes, for reachability checks. */
export const allNavHrefs = (): string[] => [
  ...MOBILE_TABS.map((i) => i.href),
  ...NAV_PRIMARY.flatMap((s) => sectionItems(s).map((i) => i.href)),
  ...NAV_FOOTER.map((i) => i.href),
];

/** Shared active-state rule, so every nav highlights identically. */
export const isNavItemActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + "/");

/**
 * The section a route belongs to.
 *
 * A section counts as active when its own page or any of its children match,
 * so /achievements lights up Progress even though Progress's own href does
 * not match. Longest match wins, which keeps /dashboard from being shadowed.
 */
export function activeSection(pathname: string): NavSection | undefined {
  let best: { section: NavSection; length: number } | undefined;
  for (const section of NAV_PRIMARY) {
    for (const item of sectionItems(section)) {
      if (isNavItemActive(pathname, item.href)) {
        if (!best || item.href.length > best.length) {
          best = { section, length: item.href.length };
        }
      }
    }
  }
  return best?.section;
}
