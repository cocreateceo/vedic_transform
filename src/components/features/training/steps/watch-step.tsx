"use client";

import { CinematicLesson } from "../cinematic-lesson";
import { StepSection } from "./step-shell";
import type { ChapterStep } from "@/lib/training-steps";

export function WatchStep({
  step,
  videoId,
  title,
}: {
  step: ChapterStep;
  videoId: string;
  title: string;
}) {
  return (
    <StepSection
      step={step}
      tone="dark"
      markLabel="I watched the lesson"
      markVariant="subtle"
    >
      <div className="mx-auto max-w-3xl">
        <CinematicLesson videoId={videoId} title={title} />
      </div>
    </StepSection>
  );
}
