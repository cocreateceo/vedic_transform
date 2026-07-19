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
  Timer,
  BookMarked,
  Image as ImageIcon,
  Quote,
  SmilePlus,
  Trophy,
  Leaf,
  Shield,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/context/auth-context";
import { SERIF_CLASS } from "@/lib/fonts";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pillars", href: "/pillars", icon: Layers },
  { name: "Sessions", href: "/sessions", icon: Timer },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Training", href: "/training", icon: GraduationCap },
];

const secondaryNav = [
  { name: "Library", href: "/library", icon: BookMarked },
  { name: "Posters", href: "/posters", icon: ImageIcon },
  { name: "Dosha Quiz", href: "/dosha-assessment", icon: Leaf },
  { name: "Wisdom", href: "/wisdom", icon: Quote },
  { name: "Mood", href: "/mood", icon: SmilePlus },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Insights", href: "/insights", icon: Sparkles },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = (user as { role?: string } | null)?.role === "admin";

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
                    ? "bg-[#FF9933] text-white shadow-lg shadow-orange-500/25"
                    : "text-[#94a3b8] hover:bg-white/[0.06] hover:text-white"
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
          <div className="border-t border-white/10"></div>
        </div>

        {/* Secondary Nav */}
        <div className="space-y-1">
          <p className="px-4 text-xs font-bold text-[#FFD700]/80 uppercase tracking-[0.15em] mb-2">
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
                    ? "bg-white/[0.08] text-[#FFB366]"
                    : "text-[#94a3b8] hover:bg-white/[0.06] hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}

          {/* Admin link — rendered only for users with Users.role === 'admin'.
              The Lambda enforces the same check, so non-admins who somehow
              navigate to /admin are redirected back to /dashboard. */}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all mt-2",
                pathname === "/admin" || pathname.startsWith("/admin/")
                  ? "bg-white/[0.1] text-white"
                  : "text-[#94a3b8] hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/10">
        <div className="p-4 rounded-2xl bg-white/[0.05] border border-[#FFD700]/20">
          <p className="text-xs text-[#FFD700]/90 font-bold uppercase tracking-[0.15em]">Daily Wisdom</p>
          <p className="text-sm text-[#e2e8f0] mt-2 italic">
            &quot;The mind is everything. What you think you become.&quot;
          </p>
          <p className="text-xs text-[#94a3b8] mt-1">— Buddha</p>
        </div>
      </div>
    </aside>
  );
}
