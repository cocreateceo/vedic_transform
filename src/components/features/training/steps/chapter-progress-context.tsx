"use client";

// One progress state for the whole chapter page.
//
// The chapter page stays a server component so its prose renders on the server.
// This provider wraps it and passes the shared progress down through context, so
// each step's mark-done control is a small client island while the teaching
// itself is not.

import { createContext, useContext } from "react";
import {
  useChapterProgress,
  type ChapterProgress,
} from "@/lib/hooks/use-chapter-progress";
import type { StepKey } from "@/lib/training-steps";

const ChapterProgressContext = createContext<ChapterProgress | null>(null);

export function ChapterProgressProvider({
  slug,
  stepKeys,
  children,
}: {
  slug: string;
  stepKeys: StepKey[];
  children: React.ReactNode;
}) {
  const progress = useChapterProgress(slug, stepKeys);
  return (
    <ChapterProgressContext.Provider value={progress}>
      {children}
    </ChapterProgressContext.Provider>
  );
}

export function useChapterProgressContext(): ChapterProgress {
  const value = useContext(ChapterProgressContext);
  if (!value) {
    throw new Error(
      "useChapterProgressContext must be used inside <ChapterProgressProvider>",
    );
  }
  return value;
}
