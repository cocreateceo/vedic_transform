"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useEntitlement } from "@/lib/use-entitlement";

interface PaywallProps {
  children: ReactNode;
  /** Name of the gated feature, used in the overlay copy. */
  feature?: string;
}

/**
 * Soft paywall (M1, scaffold). Renders children for premium users (and while
 * entitlement is still loading, to avoid a flash). For free users the content
 * still mounts but is blurred behind a lock + upgrade CTA — a teaser, not a
 * hard block. Upgrade routes to /upgrade.
 */
export function Paywall({ children, feature = "This feature" }: PaywallProps) {
  const { isPremium, loading } = useEntitlement();

  if (loading || isPremium) return <>{children}</>;

  return (
    <div className="relative">
      <div
        className="pointer-events-none select-none blur-sm opacity-60"
        aria-hidden
      >
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <p className="font-semibold text-[var(--color-text-primary)]">
          {feature} is a Premium practice
        </p>
        <Link
          href="/upgrade"
          className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:from-amber-600 hover:to-orange-600"
        >
          Unlock with Premium
        </Link>
      </div>
    </div>
  );
}
