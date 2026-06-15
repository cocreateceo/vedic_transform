"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Moon } from "lucide-react";

interface Cohort {
  label: string;
  memberCount: number;
}

/**
 * Social-proof / accountability banner. Solo 48-day programs leak ~80% by
 * week 3; knowing you're walking with a named cohort ("412 yatris started
 * with you") is one of the strongest completion levers. The cohort is the
 * month the user started their journey ("New Moon cohort").
 */
export function CohortBanner() {
  const [cohort, setCohort] = useState<Cohort | null>(null);

  useEffect(() => {
    apiFetch("/data/cohort")
      .then((r) => setCohort(r?.cohort ?? null))
      .catch(() => {});
  }, []);

  if (!cohort) return null;

  return (
    <div className="vedic-card flex items-center gap-3 border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
        <Moon className="h-5 w-5 text-white" />
      </div>
      <p className="text-sm text-gray-700">
        You&apos;re part of the{" "}
        <span className="font-semibold text-indigo-700">
          {cohort.label} cohort
        </span>{" "}
        —{" "}
        <span className="font-semibold">{cohort.memberCount}</span>{" "}
        {cohort.memberCount === 1 ? "yatri is" : "yatris are"} walking the 48
        days alongside you.
      </p>
    </div>
  );
}
