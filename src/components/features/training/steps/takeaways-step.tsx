"use client";

import { CheckCircle2 } from "lucide-react";
import { StepSection } from "./step-shell";
import type { ChapterStep } from "@/lib/training-steps";

export function TakeawaysStep({
  step,
  takeaways,
}: {
  step: ChapterStep;
  takeaways: string[];
}) {
  return (
    <StepSection
      step={step}
      markLabel="I can recall these without looking"
      markVariant="subtle"
    >
      <ul className="mx-auto max-w-3xl space-y-2.5">
        {takeaways.map((t) => (
          <li
            key={t}
            className="flex items-start gap-3 rounded-xl border border-[#DAA520]/25 bg-[var(--color-bg-elevated)] px-4 py-3"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#B8860B]" />
            <span className="text-[15px] leading-relaxed text-[var(--color-text-primary)]">
              {t}
            </span>
          </li>
        ))}
      </ul>
    </StepSection>
  );
}
