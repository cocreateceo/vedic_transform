"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils/cn";
import { SERIF_CLASS } from "@/lib/fonts";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pillars-overview", label: "Pillars" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50",
        "bg-[#FFFEF5]/85 backdrop-blur-md",
        "border-b border-[#FF9933]/15"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.jpg"
              alt="10X Vedic"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className={cn("text-xl font-bold text-[#1a1a1a]", SERIF_CLASS)}>
              10X Vedic
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium",
                  "text-[#64748b]",
                  "hover:text-[#1a1a1a] hover:bg-[#FF9933]/8",
                  "transition-colors"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold",
                "border border-[#FF9933]/40",
                "text-[#E8860D]",
                "hover:bg-[#FF9933]/10 transition-colors"
              )}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold",
                "bg-[#FF9933] text-white shadow-sm shadow-orange-500/30",
                "hover:bg-[#E8860D] transition-colors"
              )}
            >
              Start Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-card-bg)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#FF9933]/15 bg-[#FFFEF5]/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-medium",
                  "text-[#64748b]",
                  "hover:text-[#1a1a1a] hover:bg-[#FF9933]/8",
                  "transition-colors"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-[#FF9933]/15">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium text-center",
                  "border border-[#FF9933]/40",
                  "text-[#E8860D]",
                  "hover:bg-[#FF9933]/10 transition-colors"
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium text-center",
                  "bg-[#FF9933] text-white",
                  "hover:bg-[#E8860D] transition-colors"
                )}
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
