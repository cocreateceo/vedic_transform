"use client";

// Carries the normalized Training return context from the Sessions page down to
// the completion view.
//
// The page parses the URL exactly once through the central validator; every
// consumer receives a typed object or null. No session tab — and not
// NextPracticeCta — inspects search params itself, so there is one place where
// "does this URL count as coming from Training" is decided.

import { createContext, useContext } from "react";
import type { TrainingReturnContext } from "@/lib/training-return-context";

const Ctx = createContext<TrainingReturnContext | null>(null);

export function TrainingReturnProvider({
  value,
  children,
}: {
  value: TrainingReturnContext | null;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Null for an ordinary Sessions visit. */
export function useTrainingReturn(): TrainingReturnContext | null {
  return useContext(Ctx);
}
