"use client";

import { StepSection } from "./step-shell";
import { SERIF_CLASS } from "@/lib/fonts";
import type { ChapterStep } from "@/lib/training-steps";

export function ChallengeStep({
  step,
  challenge,
}: {
  step: ChapterStep;
  challenge: string;
}) {
  return (
    <StepSection step={step} markLabel="Challenge completed">
      <p
        className={`${SERIF_CLASS} mx-auto max-w-2xl rounded-2xl border border-[#DAA520]/40 bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-5 text-center text-lg italic leading-relaxed text-[#3d3223]`}
      >
        {challenge}
      </p>
    </StepSection>
  );
}
