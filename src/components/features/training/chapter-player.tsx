"use client";

// The chapter, as a player rather than a document.
//
// One activity is in the DOM at a time. The others are not hidden with CSS or
// collapsed behind a disclosure — they are not rendered. That is the whole
// point: a chapter's height becomes the height of its largest single activity
// instead of the sum of eight, which is what made the page 8,800px on desktop
// and 12,300px on mobile.
//
// The panels are still built on the server. `panels` arrives as ready-made
// React nodes from the server component, so the teaching prose is server
// rendered exactly as before; this client component only chooses which one to
// mount. Nothing about how a step renders changed.
//
// Navigation lives in the spine: sticky on desktop, a compact strip on mobile.
// It replaces both the per-step progress readouts and the Outline drawer, so
// the chapter states its progress once.

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import {
  stepAnchorId,
  CLOSING_ANCHOR_ID,
  type StepKey,
} from "@/lib/training-steps";
import {
  canOpen,
  initialPosition,
  isComplete,
  parseRequestedPosition,
  playerProgress,
  positionAfter,
  type PlayerPosition,
} from "@/lib/training-player";
import { useChapterProgressContext } from "./steps/chapter-progress-context";
import { ArrowRight, Check } from "lucide-react";
import { PlayerSpine, PlayerStrip, type SpineItem } from "./player-spine";

/** Short spine labels. The step's own title is the panel heading. */
const STEP_LABELS: Record<StepKey, string> = {
  watch: "Watch",
  read: "Read",
  takeaways: "Takeaways",
  practice: "Practice",
  meditation: "Meditate",
  reflection: "Reflect",
  quiz: "Quiz",
  challenge: "Challenge",
};

export function ChapterPlayer({
  steps,
  panels,
  stepsWithOwnAction = [],
  closing,
}: {
  /** This chapter's step keys, in order. */
  steps: StepKey[];
  /** Server-rendered content for each step. */
  panels: Partial<Record<StepKey, React.ReactNode>>;
  /**
   * Activities that carry their own filled call to action — open the session,
   * start the sit, write the reflection. On those, Continue steps down to a
   * quiet control so the screen keeps exactly one dominant action: doing the
   * thing, not moving past it.
   */
  stepsWithOwnAction?: StepKey[];
  /** The closing ceremony — the position after the last step. */
  closing: React.ReactNode;
}) {
  const { done, loaded, markStep } = useChapterProgressContext();

  // Resolved once, on mount, from the URL: `#step-practice` (what the Sessions
  // return navigates to) or `?step=practice`. useSearchParams is deliberately
  // not used — this page is statically generated, and reading location here
  // keeps it that way.
  const requestedRef = useRef<PlayerPosition | undefined>(undefined);
  const [position, setPosition] = useState<PlayerPosition>(() =>
    initialPosition({ steps, done: {}, loaded: false }),
  );
  // Resume must run once. Without this a reader who navigates back to an
  // earlier activity would be yanked forward again on the next render.
  const resumed = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    requestedRef.current = parseRequestedPosition(
      params.get("step"),
      window.location.hash,
      steps,
    );
    if (requestedRef.current) {
      resumed.current = true;
      setPosition(requestedRef.current);
    }
    // steps is derived from static chapter data and never changes identity in
    // a way that matters here; this is a mount-time read of the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Progress arrives after the first paint. Correct the position in place —
  // a returning reader lands on their first unfinished activity (M5) without
  // ever seeing step one flash past.
  useEffect(() => {
    if (!loaded || resumed.current) return;
    resumed.current = true;
    setPosition(
      initialPosition({
        requested: requestedRef.current,
        steps,
        done,
        loaded: true,
      }),
    );
  }, [loaded, done, steps]);

  // Keep the address bar honest so a refresh, a bookmark or a shared link
  // reopens the same activity. replaceState, not push — the player is one
  // page, and stacking eight history entries would break the back button.
  useEffect(() => {
    if (typeof window === "undefined" || !resumed.current) return;
    const hash = isComplete(position)
      ? `#${CLOSING_ANCHOR_ID}`
      : `#${stepAnchorId(position)}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
    }
  }, [position]);

  const go = useCallback((next: PlayerPosition) => {
    resumed.current = true;
    setPosition(next);
    // The activity changes without a navigation, so nothing would otherwise
    // move the viewport. Scroll to the top of the panel, not the page, so the
    // spine and title stay in view.
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        document
          .getElementById("chapter-panel")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  /** Complete the current activity and advance. The one forward control. */
  const advance = useCallback(() => {
    if (isComplete(position)) return;
    if (!done[position]) markStep(position, true);
    go(positionAfter(position, steps));
  }, [position, done, markStep, steps, go]);

  const { completed, total, percent } = playerProgress(steps, done);
  const spineItems: SpineItem[] = [
    ...steps.map((k) => ({ key: k, label: STEP_LABELS[k], done: Boolean(done[k]) })),
    {
      key: "complete",
      label: "Closing",
      done: total > 0 && completed === total,
      terminal: true,
    },
  ];
  const atLast = !isComplete(position) && steps.indexOf(position) === steps.length - 1;

  return (
    <div className="mt-8">
      {/* Mobile: the spine as a horizontal strip. Replaces the Outline sheet,
          which removes its collision with the bottom nav and the AI FAB. */}
      <PlayerStrip
        items={spineItems}
        current={position}
        onGo={(k) => go(k as PlayerPosition)}
        navLabel="Chapter activities"
        completed={completed}
        total={total}
        percent={percent}
      />

      <div className="lg:grid lg:grid-cols-[14.5rem_minmax(0,1fr)] lg:gap-12">
        <PlayerSpine
          items={spineItems}
          current={position}
          onGo={(k) => go(k as PlayerPosition)}
          navLabel="Chapter activities"
          percent={percent}
        />

        <div id="chapter-panel" className="mt-6 min-w-0 scroll-mt-24 lg:mt-0">
          {isComplete(position) ? (
            closing
          ) : (
            // One card per activity: kicker, heading and content come from the
            // step itself; Continue closes the card. The activity and the way
            // out of it are one object, not a section with a bar underneath.
            <section className="rounded-2xl border border-[#DAA520]/25 bg-[var(--color-bg-surface)] p-6 sm:p-9">
              {/* key forces a fresh mount per activity, so a step's own
                  internal state (quiz index, timer, draft) never leaks into
                  the next one. */}
              <div key={position}>{panels[position]}</div>
              <ContinueBar
                label={atLast ? "Finish the chapter" : "Continue"}
                done={Boolean(done[position])}
                quiet={stepsWithOwnAction.includes(position)}
                onClick={advance}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * The forward control every activity ends with.
 *
 * Filled where the activity has nothing else to press — reading, takeaways,
 * the quiz. Quiet where the activity already owns a filled CTA, so a screen
 * never shows two equally loud buttons pulling in different directions.
 */
function ContinueBar({
  label,
  done,
  quiet,
  onClick,
}: {
  label: string;
  done: boolean;
  quiet: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-7 py-3 text-[15px] font-semibold transition-transform hover:scale-[1.02]",
          quiet
            ? "border border-[#DAA520]/50 bg-transparent text-[#B8860B] hover:bg-amber-50"
            : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20",
        )}
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </button>
      {done && (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-green-600">
          <Check className="h-3.5 w-3.5" />
          Already complete
        </span>
      )}
    </div>
  );
}
