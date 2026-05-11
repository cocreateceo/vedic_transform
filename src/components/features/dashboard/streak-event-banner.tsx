"use client";

import { useEffect, useState } from "react";
import { Shield, ShieldCheck, X } from "lucide-react";
import { consumeStreakEvent, type StreakEvent } from "@/lib/streak-events";
import { cn } from "@/lib/utils/cn";

export function StreakEventBanner() {
  const [event, setEvent] = useState<StreakEvent | null>(null);

  useEffect(() => {
    setEvent(consumeStreakEvent());
  }, []);

  if (!event) return null;

  const isShieldUsed = event.type === "shield-used";
  const Icon = isShieldUsed ? ShieldCheck : Shield;

  const title = isShieldUsed
    ? `Karma Shield used — your ${event.currentStreak}-day streak is safe`
    : "You earned your first Karma Shield";

  const subtitle = isShieldUsed
    ? `One missed day was absorbed. You have ${event.shields} shield${event.shields === 1 ? "" : "s"} remaining.`
    : `Day 7 of practice — a Karma Shield has been added to your inventory. It will auto-protect your streak the next time you miss a day.`;

  return (
    <div
      className={cn(
        "vedic-card p-5 flex items-start gap-4 border-2",
        isShieldUsed
          ? "border-emerald-300 bg-emerald-50"
          : "border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50"
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
          isShieldUsed ? "bg-emerald-500" : "bg-amber-500"
        )}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "font-semibold",
            isShieldUsed ? "text-emerald-900" : "text-amber-900"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-sm mt-1",
            isShieldUsed ? "text-emerald-700" : "text-amber-700"
          )}
        >
          {subtitle}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setEvent(null)}
        aria-label="Dismiss"
        className={cn(
          "p-1 rounded-lg transition-colors flex-shrink-0",
          isShieldUsed
            ? "text-emerald-500 hover:bg-emerald-100"
            : "text-amber-500 hover:bg-amber-100"
        )}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
