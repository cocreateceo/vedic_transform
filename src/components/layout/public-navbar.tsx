"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils/cn";

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
        "bg-[var(--color-bg-primary)]/80 backdrop-blur-md",
        "border-b border-[var(--color-border)]"
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
            <span className="text-lg font-bold text-[var(--color-text-primary)]">
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
                  "text-[var(--color-text-secondary)]",
                  "hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-bg)]",
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
                "px-4 py-2 rounded-lg text-sm font-medium",
                "border border-[var(--color-border)]",
                "text-[var(--color-text-primary)]",
                "hover:bg-[var(--color-card-bg)] transition-colors"
              )}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium",
                "bg-[var(--color-primary)] text-white",
                "hover:opacity-90 transition-opacity"
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
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm font-medium",
                    "text-[var(--color-text-secondary)]",
                    "hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-bg)]",
                    "transition-colors"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-[var(--color-border)]">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium text-center",
                    "border border-[var(--color-border)]",
                    "text-[var(--color-text-primary)]",
                    "hover:bg-[var(--color-card-bg)] transition-colors"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium text-center",
                    "bg-[var(--color-primary)] text-white",
                    "hover:opacity-90 transition-opacity"
                  )}
                >
                  Start Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
