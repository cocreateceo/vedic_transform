"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/context/auth-context";
import {
  MOBILE_TABS,
  isNavItemActive,
  mobileMoreGroups,
} from "@/constants/navigation";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = (user as { role?: string } | null)?.role === "admin";
  const [showMore, setShowMore] = useState(false);

  // Same model as the desktop sidebar, minus whatever the bottom bar already
  // covers — so Training is a thumb target here rather than a fourth-row item
  // buried in this sheet, and no route appears twice on one screen.
  const moreGroups = mobileMoreGroups(isAdmin);
  const isMoreActive = moreGroups.some((g) =>
    g.items.some((item) => isNavItemActive(pathname, item.href)),
  );

  return (
    <>
      {showMore && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setShowMore(false)}
        />
      )}

      {showMore && (
        <div className="fixed bottom-16 left-0 right-0 z-50 max-h-[70vh] overflow-y-auto bg-white border-t-2 border-[#DAA520]/40 rounded-t-2xl shadow-xl lg:hidden safe-area-bottom">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Everything else
              </p>
              <button
                onClick={() => setShowMore(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {moreGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#B8860B]">
                  {group.title}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {group.items.map((item) => {
                    const active = isNavItemActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowMore(false)}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 rounded-xl transition-colors text-center",
                          active
                            ? "bg-[var(--color-card-bg)] text-[var(--color-primary)]"
                            : "text-gray-500 hover:bg-[var(--color-card-bg)] hover:text-[var(--color-primary)]",
                        )}
                      >
                        <item.icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium leading-tight">
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar — Today | Practice | Learn | Progress | More */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-[#DAA520]/40 lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {MOBILE_TABS.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors",
                  active ? "text-[var(--color-primary)]" : "text-gray-500",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 mb-1",
                    active && "scale-110 transition-transform",
                  )}
                />
                <span className="text-[10px] font-medium truncate">
                  {item.name}
                </span>
                {active && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                )}
              </Link>
            );
          })}

          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors",
              isMoreActive || showMore
                ? "text-[var(--color-primary)]"
                : "text-gray-500",
            )}
          >
            <MoreHorizontal
              className={cn(
                "w-5 h-5 mb-1",
                (isMoreActive || showMore) && "scale-110 transition-transform",
              )}
            />
            <span className="text-[10px] font-medium truncate">More</span>
            {isMoreActive && (
              <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
