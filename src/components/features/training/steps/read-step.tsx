"use client";

import { useCallback } from "react";
import { CheckCircle2 } from "lucide-react";
import { ChapterAccordion, type AccordionSection } from "../chapter-accordion";
import { StepSection } from "./step-shell";
import { useChapterProgressContext } from "./chapter-progress-context";
import type { ChapterStep } from "@/lib/training-steps";

export function ReadStep({
  step,
  sections,
}: {
  step: ChapterStep;
  sections: AccordionSection[];
}) {
  const { done, markStep } = useChapterProgressContext();
  const isRead = Boolean(done.read);

  // Opening every movement claims the step. The button stays available for the
  // reader who hit "Expand all" and read it as one article, or who wants to
  // take the claim back.
  const handleAllOpened = useCallback(() => {
    if (!done.read) markStep("read", true);
  }, [done.read, markStep]);

  return (
    <StepSection
      step={step}
      markLabel="I finished reading"
      markVariant="subtle"
    >
      <div>
        {/* A reader who has finished the teaching returns to a review state,
            not to the full scroll they already worked through. Nothing is
            hidden — every movement is one tap away, as always. */}
        {isRead && (
          <p className="mb-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-[var(--color-text-secondary)]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {sections.length} teaching movements — open any one to review it
            </span>
          </p>
        )}
        <ChapterAccordion
          sections={sections}
          onAllMovementsOpened={handleAllOpened}
          reviewMode={isRead}
        />
      </div>
    </StepSection>
  );
}
