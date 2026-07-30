"use client";

import Image from "next/image";
import Link from "next/link";
import { NotebookPen } from "lucide-react";
import { StepSection } from "./step-shell";
import { SERIF_CLASS } from "@/lib/fonts";
import type { ChapterStep } from "@/lib/training-steps";

export function ReflectStep({
  step,
  questions,
  journalHref,
  art,
}: {
  step: ChapterStep;
  questions: string[];
  /** Carries the chapter so the journal opens ready to write. */
  journalHref: string;
  art?: string;
}) {
  return (
    <StepSection
      step={step}
      markLabel="I wrote today"
      markVariant="subtle"
      action={
        <Link
          href={journalHref}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-shadow hover:shadow-xl"
        >
          <NotebookPen className="h-4 w-4" />
          Write your reflection
        </Link>
      }
    >
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-[#DAA520]/40 bg-[var(--color-bg-surface)] md:grid-cols-[2fr_3fr]">
        {art && (
          <div className="relative min-h-40 md:min-h-full">
            <Image
              src={art}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}
        <div className="p-5 sm:p-7">
          <ol className="space-y-2.5">
            {questions.map((q, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                  {i + 1}
                </span>
                <span
                  className={`${SERIF_CLASS} text-[16px] italic leading-relaxed text-[var(--color-text-primary)]`}
                >
                  {q}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </StepSection>
  );
}
