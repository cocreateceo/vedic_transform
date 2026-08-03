"use client";

// The desktop rail, in two widths.
//
// Expanded it lists six sections; the one you are in opens to show what it
// contains. Collapsed it is icons only, and the labels the icons stand for are
// one hover or one keyboard focus away in a flyout — an icon rail that hides
// its labels outright is unusable for destinations like Insights and Reports,
// which have no self-evident glyph.
//
// Sections come from NAV_PRIMARY. Nothing is filed here.

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/context/auth-context";
import { SERIF_CLASS } from "@/lib/fonts";
import {
  NAV_FOOTER,
  NAV_PRIMARY,
  activeSection,
  isNavItemActive,
  sectionItems,
  type NavItem,
  type NavSection,
} from "@/constants/navigation";
import { useRail } from "./rail-context";

export function Sidebar() {
  const pathname = usePathname() || "/";
  const { user } = useAuth();
  const { collapsed, toggle } = useRail();
  const isAdmin = (user as { role?: string } | null)?.role === "admin";
  const current = activeSection(pathname);

  // The Admin link is rendered only for users with Users.role === 'admin'. The
  // Lambda enforces the same check, so non-admins who somehow navigate to
  // /admin are redirected back to /dashboard.
  const footer = NAV_FOOTER.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 bg-[#0F172A] border-r border-[#FF9933]/20 transition-[width] duration-200",
        collapsed ? "lg:w-20" : "lg:w-64",
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center gap-3 border-b border-white/10 py-5",
          collapsed ? "justify-center px-2" : "px-6",
        )}
      >
        <Image
          src="/images/logo.jpg"
          alt="10X Vedic Logo"
          width={collapsed ? 32 : 40}
          height={collapsed ? 32 : 40}
          className="rounded-xl shrink-0"
        />
        {!collapsed && (
          <div className="min-w-0">
            {/* Not an h1 — the page content owns the document heading. */}
            <p className={cn("font-bold text-xl text-white truncate", SERIF_CLASS)}>
              10X Vedic
            </p>
            <p className="text-xs text-[#94a3b8]">48-Day Transformation</p>
          </div>
        )}
      </div>

      <nav
        aria-label="Primary"
        className={cn(
          "flex-1 py-4 space-y-1",
          // Collapsed, the flyout is positioned outside this column, so the
          // scroll container must not clip it. Six icons never overflow, so
          // there is nothing to scroll anyway.
          collapsed ? "px-2 overflow-visible" : "px-4 overflow-y-auto",
        )}
      >
        {NAV_PRIMARY.map((section) => (
          <SectionRow
            key={section.name}
            section={section}
            pathname={pathname}
            collapsed={collapsed}
            isCurrent={current?.name === section.name}
          />
        ))}
      </nav>

      {/* Utility links as a compact icon row rather than three more full-width
          rows — Reminders/Settings/Admin are destinations you go to
          deliberately, not ones you scan for. */}
      <div className={cn("pb-2", collapsed ? "px-2" : "px-4")}>
        <div
          className={cn(
            "border-t border-white/10 pt-2 flex items-center gap-1",
            collapsed && "flex-col",
          )}
        >
          {footer.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.name}
                aria-label={item.name}
                className={cn(
                  "flex items-center justify-center rounded-lg py-2 transition-all",
                  collapsed ? "w-full" : "flex-1",
                  active
                    ? "bg-[#FF9933] text-white"
                    : "text-[#94a3b8] hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* The width control. Explicit, reversible, and remembered. */}
      <div className={cn("pb-3", collapsed ? "px-2" : "px-4")}>
        <button
          onClick={toggle}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          aria-expanded={!collapsed}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#94a3b8] transition-colors hover:bg-white/[0.06] hover:text-white",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-[18px] w-[18px]" />
          ) : (
            <>
              <PanelLeftClose className="h-[18px] w-[18px]" />
              Collapse
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function SectionRow({
  section,
  pathname,
  collapsed,
  isCurrent,
}: {
  section: NavSection;
  pathname: string;
  collapsed: boolean;
  isCurrent: boolean;
}) {
  const [flyout, setFlyout] = useState(false);
  const children = section.children ?? [];
  const Icon = section.icon;
  // The section's own page when it has one; otherwise its first child, so
  // Explore still goes somewhere when clicked.
  const target = section.href ?? children[0]?.href;

  const rowClass = cn(
    "flex items-center gap-3 rounded-xl text-sm font-medium transition-all",
    collapsed ? "justify-center px-0 py-2.5" : "px-4 py-2",
    isCurrent
      ? "bg-[#FF9933] text-white shadow-lg shadow-orange-500/25"
      : "text-[#94a3b8] hover:bg-white/[0.06] hover:text-white",
  );

  if (collapsed) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setFlyout(true)}
        onMouseLeave={() => setFlyout(false)}
        onFocus={() => setFlyout(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFlyout(false);
        }}
      >
        <Link href={target ?? "#"} className={rowClass} aria-label={section.name}>
          <Icon className="h-[20px] w-[20px] shrink-0" />
        </Link>

        {/* The labels the icons stand for. Shown on hover AND on keyboard
            focus — a tooltip only a mouse can reach is not a label. */}
        {flyout && (
          <div className="absolute left-full top-0 z-50 ml-2 min-w-52 whitespace-nowrap rounded-xl border border-[#FF9933]/25 bg-[#0F172A] p-2 shadow-2xl">
            <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FFD700]/80">
              {section.name}
            </p>
            {sectionItems(section).map((item) => (
              <FlyoutLink key={item.href} item={item} pathname={pathname} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Link href={target ?? "#"} className={rowClass}>
        <Icon className="h-[18px] w-[18px] shrink-0" />
        <span className="truncate">{section.name}</span>
      </Link>

      {/* Children open for the section you are in. Everywhere else they stay
          closed, so the rail shows six rows rather than sixteen. */}
      {isCurrent && children.length > 0 && (
        <div className="mt-0.5 space-y-0.5 border-l border-white/10 pl-3 ml-5">
          {children.map((item) => (
            <ChildLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChildLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isNavItemActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors",
        active
          ? "bg-white/[0.10] font-semibold text-white"
          : "text-[#94a3b8] hover:bg-white/[0.06] hover:text-white",
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.name}</span>
    </Link>
  );
}

function FlyoutLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isNavItemActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors",
        active
          ? "bg-[#FF9933] font-semibold text-white"
          : "text-[#e2e8f0] hover:bg-white/[0.08]",
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.name}</span>
    </Link>
  );
}
