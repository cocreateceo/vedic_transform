"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  TrendingUp,
  Target,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pillars", href: "/pillars", icon: Layers },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Journal", href: "/journal", icon: BookOpen },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
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
                isActive ? "text-amber-600" : "text-gray-500"
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
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
