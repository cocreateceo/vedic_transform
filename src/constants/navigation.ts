// The one navigation model, shared by the desktop sidebar and the mobile nav.
//
// These used to be two hand-maintained arrays in two components, and they had
// already drifted: Training was a top-level item on desktop and a fourth-row
// entry inside a "More" sheet on mobile, and Goals and Journal had the same
// split. Two components, one model — they can't disagree again.
//
// Grouping is by what the user is doing, not by feature category.
//
// Vocabulary (fixed — do not reuse these words for each other):
//   Journey  = the overall 48-day programme
//   Training = the educational / book experience
//   Parts    = the Training curriculum grouping
//   Pillars  = practice domains
//   Sessions = the actual practices
//
// "Journey" here is the umbrella containing Training, Pillars and Goals — the
// things you commit to across the 48 days. It is never a heading for Training
// itself.

import {
  Bell,
  BookMarked,
  BookOpen,
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

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Today",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Sessions", href: "/sessions", icon: Timer },
      { name: "Journal", href: "/journal", icon: BookOpen },
    ],
  },
  {
    title: "Journey",
    items: [
      { name: "Training", href: "/training", icon: GraduationCap },
      { name: "Pillars", href: "/pillars", icon: Layers },
      { name: "Goals", href: "/goals", icon: Target },
    ],
  },
  {
    title: "Progress",
    items: [
      { name: "Progress", href: "/progress", icon: TrendingUp },
      { name: "Achievements", href: "/achievements", icon: Trophy },
      { name: "Insights", href: "/insights", icon: Sparkles },
      // Reports and Mood are placed here by judgement — they are records of
      // what happened, not things you do today. There is no usage telemetry in
      // this repo to place them by.
      { name: "Reports", href: "/reports", icon: FileText },
      { name: "Mood", href: "/mood", icon: SmilePlus },
    ],
  },
  {
    title: "Explore",
    items: [
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
 * The mobile bottom bar — the four verbs, matching the four desktop groups.
 * Labels differ from the sidebar deliberately: a thumb target reads better as
 * a verb ("Learn") than as a noun ("Training").
 */
export const MOBILE_TABS: NavItem[] = [
  { name: "Today", href: "/dashboard", icon: LayoutDashboard },
  { name: "Practice", href: "/sessions", icon: Timer },
  { name: "Learn", href: "/training", icon: GraduationCap },
  { name: "Progress", href: "/progress", icon: TrendingUp },
];

const TAB_HREFS = new Set(MOBILE_TABS.map((t) => t.href));

/**
 * What the mobile "More" sheet shows: the same groups in the same order, minus
 * whatever the bottom bar already covers, so no route appears twice on one
 * screen. Empty groups drop out.
 */
export const mobileMoreGroups = (isAdmin: boolean): NavGroup[] =>
  [
    ...NAV_GROUPS,
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
  ...NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href)),
  ...NAV_FOOTER.map((i) => i.href),
];

/** Shared active-state rule, so the two navs highlight identically. */
export const isNavItemActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + "/");
