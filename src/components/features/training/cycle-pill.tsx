"use client";

// Floating learning-cycle progress pill — surfaces the cycle while the
// learner is still reading, instead of only at the page's end. Desktop
// only; links down to the full cycle rail.

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

export function CyclePill({
  slug,
  stepKeys,
}: {
  slug: string;
  stepKeys: string[];
}) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    apiFetch("/data/content-progress")
      .then((res) => {
        const records = (res?.progress || []) as {
          contentId: string;
          completed: boolean;
        }[];
        setDone(
          stepKeys.filter((k) =>
            records.some(
              (r) => r.contentId === `training:${slug}:${k}` && r.completed,
            ),
          ).length,
        );
      })
      .catch(() => {});
  }, [slug, stepKeys]);

  return (
    <a
      href="#cycle"
      className="fixed bottom-6 left-6 z-40 hidden items-center gap-2 rounded-full border border-[#DAA520]/50 bg-[#0C0F22]/90 px-4 py-2.5 text-sm font-semibold text-amber-100 shadow-lg shadow-black/30 backdrop-blur transition-colors hover:border-[#DAA520] lg:inline-flex"
      aria-label="Jump to your learning cycle"
    >
      <CheckCircle2 className="h-4 w-4 text-[#FFD700]" />
      Cycle {done}/{stepKeys.length}
    </a>
  );
}
