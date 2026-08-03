"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationCenter } from "@/components/features/notifications/notification-center";
import { useAuth } from "@/context/auth-context";

interface HeaderProps {
  user?: {
    email?: string;
    name?: string;
  };
}

export function Header({ user }: HeaderProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b-2 border-[#DAA520]/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand, below lg only. The sidebar carries it from lg up, and two
              logos on one screen is what this header was doing wrong. */}
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <Image
              src="/images/logo.jpg"
              alt="10X Vedic Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-bold text-[#1a1a1a] [font-family:var(--font-intro-serif),Georgia,serif]">
              10X Vedic
            </span>
          </Link>
          {/* Holds the row open at lg+, where the brand above is hidden. */}
          <span className="hidden lg:block" aria-hidden="true" />

          {/* Utilities. Navigation lives in the sidebar (lg+) and the bottom
              tab bar (below lg); this bar owns only what neither can do. */}
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-amber-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user?.name || user?.email?.split("@")[0] || "User"}
                </span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border-2 border-[#DAA520]/30 py-1">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
