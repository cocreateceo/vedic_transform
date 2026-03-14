"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  TrendingUp,
  Target,
  BookOpen,
  Sparkles,
  FileText,
  Bell,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pillars", href: "/pillars", icon: Layers },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Progress", href: "/progress", icon: TrendingUp },
];

const moreNavItems = [
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Insights", href: "/insights", icon: Sparkles },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Reminders", href: "/reminders", icon: Bell },
];

export function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const isMoreActive = moreNavItems.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More menu panel */}
      {showMore && (
        <div className="fixed bottom-16 left-0 right-0 z-50 bg-white border-t border-gray-200 rounded-t-2xl shadow-xl lg:hidden safe-area-bottom">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Tools
              </p>
              <button
                onClick={() => setShowMore(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {moreNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl transition-colors",
                      isActive
                        ? "bg-[var(--color-card-bg)] text-[var(--color-primary)]"
                        : "text-gray-500 hover:bg-[var(--color-card-bg)] hover:text-[var(--color-primary)]"
                    )}
                  >
                    <item.icon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors",
                  isActive ? "text-[var(--color-primary)]" : "text-gray-500"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 mb-1",
                    isActive && "scale-110 transition-transform"
                  )}
                />
                <span className="text-[10px] font-medium truncate">
                  {item.name}
                </span>
                {isActive && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                )}
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors",
              isMoreActive || showMore ? "text-[var(--color-primary)]" : "text-gray-500"
            )}
          >
            <MoreHorizontal
              className={cn(
                "w-5 h-5 mb-1",
                (isMoreActive || showMore) && "scale-110 transition-transform"
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
