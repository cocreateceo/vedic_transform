"use client";

// The single owner of a chapter's progress.
//
// Previously three components read /data/content-progress independently and
// TWO of them wrote the chapter key `training:<slug>`: the manual "Mark chapter
// complete" button and the learning cycle's auto-seal. They never reconciled —
// marking a chapter complete by hand left its steps at 0/8, and toggling the
// button after finishing every step un-completed a chapter whose steps were all
// green.
//
// Here the chapter key is derived state with exactly one writer: it is sealed
// when the last step lands and unsealed when a step is taken back. Progress
// stays best-effort — a failed write surfaces a retry hint without losing the
// local state the user just created.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { trainingContentId } from "@/data/training-book";
import { stepContentId, type StepKey } from "@/lib/training-steps";
import { markTrainingActivity } from "@/lib/training-progress";

interface ProgressRecord {
  contentId: string;
  completed: boolean;
}

export interface ChapterProgress {
  /** Completion state per step key. Empty until the first load resolves. */
  done: Record<string, boolean>;
  completedCount: number;
  total: number;
  allDone: boolean;
  /** First step not yet complete — what "Resume" should jump to. */
  nextStep?: StepKey;
  loaded: boolean;
  saveError: boolean;
  markStep: (key: StepKey, value?: boolean) => void;
}

export function useChapterProgress(
  slug: string,
  stepKeys: StepKey[],
): ChapterProgress {
  // stepKeys is rebuilt on every render by the caller; depend on its contents
  // rather than its identity so the fetch doesn't loop.
  const fingerprint = stepKeys.join(",");
  const keys = useMemo(
    () => (fingerprint ? (fingerprint.split(",") as StepKey[]) : []),
    [fingerprint],
  );

  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // Mirrors of state for use inside callbacks without stale closures.
  const doneRef = useRef<Record<string, boolean>>({});
  const sealedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/data/content-progress")
      .then((res) => {
        if (cancelled) return;
        const records = (res?.progress || []) as ProgressRecord[];
        const next: Record<string, boolean> = {};
        for (const key of keys) {
          next[key] = records.some(
            (r) => r.contentId === stepContentId(slug, key) && r.completed,
          );
        }
        doneRef.current = next;
        sealedRef.current = records.some(
          (r) => r.contentId === trainingContentId(slug) && r.completed,
        );
        setDone(next);
        setLoaded(true);
      })
      .catch(() => {
        // Reading never blocks the reader; an unreachable API just means the
        // page renders as "nothing complete yet".
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, keys]);

  const markStep = useCallback(
    (key: StepKey, value = true) => {
      const next = { ...doneRef.current, [key]: value };
      doneRef.current = next;
      setDone(next);
      setSaveError(false);

      void (async () => {
        // Delegated so Sessions and the chapter page share one definition of
        // what completing an activity means for the chapter. The hook passes
        // the state it already holds, so this costs no extra read.
        const result = await markTrainingActivity({
          slug,
          step: key,
          completed: value,
          knownSteps: doneRef.current,
          knownSealed: sealedRef.current,
        });
        if (!result.ok) {
          setSaveError(true);
          return;
        }
        sealedRef.current = result.chapterSealed;
      })();
    },
    [slug],
  );

  const completedCount = keys.filter((k) => done[k]).length;

  return {
    done,
    completedCount,
    total: keys.length,
    allDone: keys.length > 0 && completedCount === keys.length,
    nextStep: keys.find((k) => !done[k]),
    loaded,
    saveError,
    markStep,
  };
}
