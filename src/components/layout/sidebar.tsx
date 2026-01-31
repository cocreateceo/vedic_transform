"use client";

import Link from "next/link";
import Image from "next/image";
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
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pillars", href: "/pillars", icon: Layers },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Journal", href: "/journal", icon: BookOpen },
];

const secondaryNav = [
  { name: "Insights", href: "/insights", icon: Sparkles },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-amber-100">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-amber-100">
        <Image
          src="/images/logo.jpg"
          alt="10X Vedic Logo"
          width={40}
          height={40}
          className="rounded-xl"
        />
        <div>
          <h1 className="font-bold text-lg bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            10X Vedic
          </h1>
          <p className="text-xs text-gray-500">48-Day Transformation</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {/* Primary Nav */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
                    : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="py-3">
          <div className="border-t border-amber-100"></div>
        </div>

        {/* Secondary Nav */}
        <div className="space-y-1">
          <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Tools
          </p>
          {secondaryNav.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-amber-100 text-amber-700"
                    : "text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-amber-100">
        <div className="vedic-card p-4 bg-gradient-to-br from-amber-50 to-orange-50">
          <p className="text-xs text-amber-800 font-medium">Daily Wisdom</p>
          <p className="text-sm text-amber-900 mt-2 italic">
            &quot;The mind is everything. What you think you become.&quot;
          </p>
          <p className="text-xs text-amber-600 mt-1">— Buddha</p>
        </div>
      </div>
    </aside>
  );
}
