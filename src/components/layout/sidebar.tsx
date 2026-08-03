"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/context/auth-context";
import { SERIF_CLASS } from "@/lib/fonts";
import {
  NAV_FOOTER,
  NAV_GROUPS,
  isNavItemActive,
  type NavItem,
} from "@/constants/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = (user as { role?: string } | null)?.role === "admin";

  // The Admin link is rendered only for users with Users.role === 'admin'. The
  // Lambda enforces the same check, so non-admins who somehow navigate to
  // /admin are redirected back to /dashboard.
  const footer = NAV_FOOTER.filter((item) => !item.adminOnly || isAdmin);

  // Uniform row height. Four group headers cost vertical space the old
  // two-group list didn't, so the rows give it back — otherwise Explore and
  // the footer fall below the fold on a 900–1000px laptop.
  const renderItem = (item: NavItem) => {
    const active = isNavItemActive(pathname, item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition-all",
          active
            ? "bg-[#FF9933] text-white shadow-lg shadow-orange-500/25"
            : "text-[#94a3b8] hover:bg-white/[0.06] hover:text-white",
        )}
      >
        <item.icon className="w-[18px] h-[18px] shrink-0" />
        {item.name}
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#0F172A] border-r border-[#FF9933]/20">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <Image
          src="/images/logo.jpg"
          alt="10X Vedic Logo"
          width={40}
          height={40}
          className="rounded-xl"
        />
        <div>
          {/* Not an h1 — the page content owns the document heading. */}
          <p className={cn("font-bold text-xl text-white", SERIF_CLASS)}>
            10X Vedic
          </p>
          <p className="text-xs text-[#94a3b8]">48-Day Transformation</p>
        </div>
      </div>

      {/* Navigation — grouped by what you're doing, from one shared model. */}
      <nav
        aria-label="Primary"
        className="flex-1 px-4 py-4 space-y-4 overflow-y-auto"
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <p className="px-4 mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#FFD700]/80">
              {group.title}
            </p>
            {group.items.map(renderItem)}
          </div>
        ))}

      </nav>

      {/* Utility links as a compact icon row rather than three more full-width
          rows. Four group headers already cost the height the old two-group
          list didn't, and Reminders/Settings/Admin are destinations you go to
          deliberately, not ones you scan for. */}
      <div className="px-4 pb-2">
        <div className="border-t border-white/10 pt-2 flex items-center gap-1">
          {footer.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.name}
                aria-label={item.name}
                className={cn(
                  "flex flex-1 items-center justify-center rounded-lg py-2 transition-all",
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

    </aside>
  );
}
