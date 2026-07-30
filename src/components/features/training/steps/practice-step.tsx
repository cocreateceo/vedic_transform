"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PracticeCards } from "../practice-cards";
import { StepSection } from "./step-shell";
import type { TrainingExercise } from "@/data/training-book";
import type { ChapterStep } from "@/lib/training-steps";

export function PracticeStep({
  step,
  exercises,
  practiceHref,
  practiceLabel,
  /**
   * `sectionArt.exercises` — authored for every chapter that has exercises and,
   * until now, rendered only by the plain-reader fallback, which no published
   * chapter route reaches. This is its one render site.
   */
  art,
}: {
  step: ChapterStep;
  exercises: TrainingExercise[];
  practiceHref?: string;
  practiceLabel?: string;
  art?: string;
}) {
  return (
    <StepSection
      step={step}
      markLabel="I practiced today"
      action={
        practiceHref ? (
          <Link
            href={practiceHref}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-shadow hover:shadow-xl"
          >
            Begin practice — {practiceLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : undefined
      }
      markVariant="subtle"
    >
      <div className="mx-auto max-w-3xl space-y-5">
        {art && (
          <Image
            src={art}
            alt=""
            width={800}
            height={500}
            className="h-28 w-full rounded-xl object-cover sm:h-32"
          />
        )}
        <PracticeCards exercises={exercises} />
      </div>
    </StepSection>
  );
}
