"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Lightbulb, Play, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  MiniBreathingDemo,
  type BreathPattern,
} from "@/components/features/pillars/mini-breathing-demo";
import { TimerPractice } from "@/components/features/pillars/timer-practice";
import { AudioPractice } from "@/components/features/pillars/audio-practice";
import { PexelsImage } from "@/components/ui/pexels-image";

// Shared one-question-at-a-time reflection used by the Morning Initiation,
// Nutrition, and Breathing & Meditation pillars. Each pillar supplies its
// own steps array (question + tailored success/try-again coaching) and a
// small config bundle for the header and summary copy. State stays at
// the parent so the answers can persist day-scoped in localStorage and
// outlast page navigation.

export type YesNoAnswer = "yes" | "no" | null;

/**
 * Practice surfaces rendered between a step's description and its
 * yes/no buttons. Some are pure reference (image); others are
 * "mandatory" — the user has to engage with the practice before
 * the "Yes, I did" button unlocks. Breathing pacers and animated
 * posture GIFs are both gating; simple reference images are not.
 *
 * For questions that don't need demonstrating ("Did you drink warm
 * water?"), omit `practice` entirely — the user just answers.
 */
export type StepPractice =
  /**
   * Breathing pacer. When `mandatory` is true the user must finish all
   * rounds (Try it now → complete cycle) before Yes unlocks.
   */
  | { kind: "breathing"; pattern: BreathPattern; mandatory?: boolean }
  /**
   * Posture / position image (static, non-gating reference). Use this
   * for poses where the practice happens elsewhere in the user's day
   * (sitting meditation, body scan in bed). `caption` adds an
   * instructional cue; `poseList` adds a numbered sequence next to
   * the photo for steps like Surya Namaskar.
   */
  | {
      kind: "image";
      pexelsSlug: string;
      caption?: string;
      poseList?: string[];
    }
  /**
   * Animated GIF demo. When `mandatory` is set the user must press
   * "Practice along" and let the timer reach zero before Yes unlocks.
   * Used for active sequence demos: sun salutation, strength circuit,
   * stretches.
   */
  | {
      kind: "gif";
      src: string;
      caption?: string;
      poseList?: string[];
      attribution?: { name: string; url?: string; source?: string };
      mandatory?: { practiceSeconds: number; label?: string };
    }
  /**
   * Countdown timer with a guidance script — used for silent sitting,
   * visualization, metta. Mandatory mode keeps the parent's Yes
   * disabled until the timer reaches zero.
   */
  | {
      kind: "timer";
      totalSeconds: number;
      label?: string;
      guidance?: string;
      mandatory?: boolean;
    }
  /**
   * Inline audio player — used for mantra recitation and other
   * listen-along practices. Mandatory mode requires playback to
   * reach the audio's end event before Yes unlocks.
   */
  | {
      kind: "audio";
      src: string;
      title?: string;
      guidance?: string;
      attribution?: { name: string; url?: string; source?: string };
      mandatory?: boolean;
    };

export type YesNoStep = {
  title: string;
  description: string;
  question: string;
  successMessage: string;
  tryAgainMessage: string;
  /**
   * Optional inline practice widget shown between the description and
   * the question. Lets the user try the technique in place before
   * honestly answering whether they did it today.
   */
  practice?: StepPractice;
};

export type YesNoConfig = {
  headerTitle: string;
  headerSubtitle?: string;
  summaryTitle: string;
  /**
   * Used inside "You {verb} X of Y {summaryStatLabel} today." e.g.
   * "habits" or "honored these habits". Keep it short.
   */
  summaryStatLabel: string;
  /** Verb between "You" and the count. Defaults to "completed". */
  summaryStatVerb?: string;
  summaryClosingNote?: string;
};

export function YesNoReflection({
  steps,
  answers,
  setAnswers,
  config,
}: {
  steps: YesNoStep[];
  answers: YesNoAnswer[];
  setAnswers: (next: YesNoAnswer[]) => void;
  config: YesNoConfig;
}) {
  const total = steps.length;
  const firstUnanswered = answers.findIndex((a) => a === null);
  const initialStep = firstUnanswered === -1 ? total : firstUnanswered;
  const [activeStep, setActiveStep] = useState<number>(initialStep);
  const [phase, setPhase] = useState<"question" | "feedback">(() =>
    initialStep < total && answers[initialStep] != null
      ? "feedback"
      : "question",
  );

  const yesCount = answers.filter((a) => a === "yes").length;
  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === total;

  const recordAnswer = (idx: number, value: YesNoAnswer) => {
    const next = [...answers];
    next[idx] = value;
    setAnswers(next);
    setPhase("feedback");
  };

  const continueToNext = () => {
    if (activeStep + 1 >= total) {
      setActiveStep(total);
    } else {
      setActiveStep(activeStep + 1);
      setPhase("question");
    }
  };

  const goToStep = (idx: number) => {
    setActiveStep(idx);
    setPhase(answers[idx] != null ? "feedback" : "question");
  };

  const restart = () => {
    setAnswers(Array(total).fill(null) as YesNoAnswer[]);
    setActiveStep(0);
    setPhase("question");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {config.headerTitle}
          </h3>
          <span className="text-sm font-medium text-amber-600">
            {answeredCount === 0
              ? `${total} reflections`
              : `${answeredCount} / ${total} answered`}
          </span>
        </div>
        {config.headerSubtitle && (
          <p className="text-sm text-gray-600">{config.headerSubtitle}</p>
        )}
        <div className="flex gap-1.5">
          {steps.map((step, i) => {
            const a = answers[i];
            const isActive = i === activeStep;
            const segColor =
              a === "yes"
                ? "bg-green-500"
                : a === "no"
                  ? "bg-amber-400"
                  : "bg-gray-200";
            return (
              <button
                key={i}
                type="button"
                onClick={() => goToStep(i)}
                title={`Step ${i + 1}: ${step.title}`}
                aria-label={`Go to step ${i + 1}: ${step.title}`}
                className={cn(
                  "h-2 flex-1 rounded-full transition-all",
                  segColor,
                  isActive && "ring-2 ring-offset-2 ring-amber-500",
                )}
              />
            );
          })}
        </div>
      </div>

      {!allAnswered || activeStep < total ? (
        <StepCard
          stepIndex={activeStep}
          step={steps[activeStep]}
          phase={phase}
          currentAnswer={answers[activeStep]}
          totalSteps={total}
          onAnswer={(v) => recordAnswer(activeStep, v)}
          onContinue={continueToNext}
          onChangeAnswer={() => setPhase("question")}
        />
      ) : (
        <SummaryCard
          steps={steps}
          answers={answers}
          yesCount={yesCount}
          totalSteps={total}
          title={config.summaryTitle}
          statLabel={config.summaryStatLabel}
          statVerb={config.summaryStatVerb ?? "completed"}
          closingNote={config.summaryClosingNote}
          onRestart={restart}
          onJumpToStep={goToStep}
        />
      )}
    </div>
  );
}

function StepCard({
  stepIndex,
  step,
  phase,
  currentAnswer,
  totalSteps,
  onAnswer,
  onContinue,
  onChangeAnswer,
}: {
  stepIndex: number;
  step: YesNoStep;
  phase: "question" | "feedback";
  currentAnswer: YesNoAnswer;
  totalSteps: number;
  onAnswer: (v: "yes" | "no") => void;
  onContinue: () => void;
  onChangeAnswer: () => void;
}) {
  const isLast = stepIndex === totalSteps - 1;
  const wasYes = currentAnswer === "yes";

  // Mandatory-practice gating. Tracks whether the user has finished the
  // breathing rounds or GIF practice timer for THIS step. Reset whenever
  // we land on a new step or the user switches back to the question
  // phase, so re-answering forces a re-practice.
  const requiresPractice =
    (step.practice?.kind === "breathing" && step.practice.mandatory === true) ||
    (step.practice?.kind === "gif" && step.practice.mandatory !== undefined) ||
    (step.practice?.kind === "timer" && step.practice.mandatory === true) ||
    (step.practice?.kind === "audio" && step.practice.mandatory === true);
  const [practiceDone, setPracticeDone] = useState(false);
  useEffect(() => {
    setPracticeDone(false);
  }, [stepIndex, phase]);

  const yesLocked = requiresPractice && !practiceDone;

  return (
    <div className="rounded-2xl bg-white border-2 border-amber-200 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white font-semibold flex items-center justify-center shadow-sm">
          {stepIndex + 1}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-amber-600 font-medium">
            Step {stepIndex + 1} of {totalSteps}
          </p>
          <h4 className="text-xl font-semibold text-gray-900">{step.title}</h4>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-2">{step.description}</p>

      {/*
        key={stepIndex} on every practice surface forces a fresh mount
        when the user jumps between steps. Without it, React reuses the
        same component instance and the previous step's internal state
        (active timer, secondsLeft, played audio) bleeds into the new
        step.
       */}
      {step.practice?.kind === "breathing" && (
        <MiniBreathingDemo
          key={stepIndex}
          pattern={step.practice.pattern}
          onComplete={() => setPracticeDone(true)}
        />
      )}

      {step.practice?.kind === "image" && (
        <div className="my-5 rounded-xl overflow-hidden border border-amber-200 bg-amber-50/40 p-3">
          <PexelsImage
            slug={step.practice.pexelsSlug}
            className="rounded-lg overflow-hidden"
          />
          {step.practice.caption && (
            <p className="text-sm text-gray-700 leading-relaxed mt-3 px-1">
              {step.practice.caption}
            </p>
          )}
          {step.practice.poseList && step.practice.poseList.length > 0 && (
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-3 px-1 text-sm text-gray-700">
              {step.practice.poseList.map((pose, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-600 font-semibold flex-shrink-0">
                    {i + 1}.
                  </span>
                  <span>{pose}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {step.practice?.kind === "gif" && (
        <GifPractice
          key={stepIndex}
          src={step.practice.src}
          alt={step.title}
          caption={step.practice.caption}
          poseList={step.practice.poseList}
          attribution={step.practice.attribution}
          mandatory={step.practice.mandatory}
          onComplete={() => setPracticeDone(true)}
        />
      )}

      {step.practice?.kind === "timer" && (
        <TimerPractice
          key={stepIndex}
          totalSeconds={step.practice.totalSeconds}
          label={step.practice.label}
          guidance={step.practice.guidance}
          mandatory={step.practice.mandatory}
          onComplete={() => setPracticeDone(true)}
        />
      )}

      {step.practice?.kind === "audio" && (
        <AudioPractice
          key={stepIndex}
          src={step.practice.src}
          title={step.practice.title}
          guidance={step.practice.guidance}
          attribution={step.practice.attribution}
          mandatory={step.practice.mandatory}
          onComplete={() => setPracticeDone(true)}
        />
      )}

      <div className="mt-4" />

      {phase === "question" ? (
        <>
          <p className="text-lg font-medium text-gray-900 mb-5">
            {step.question}
          </p>
          {yesLocked && (
            <div className="mb-4 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-900">
              Practice along with the demo above to unlock <strong>Yes</strong>.
              If you didn&apos;t do this today, you can still pick{" "}
              <strong>Not today</strong>.
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Button
              size="lg"
              onClick={() => !yesLocked && onAnswer("yes")}
              disabled={yesLocked}
              className={cn(
                "text-white",
                yesLocked
                  ? "bg-gray-300 cursor-not-allowed hover:bg-gray-300"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
              )}
            >
              <Check className="w-5 h-5 mr-2" />
              Yes, I did
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onAnswer("no")}
              className="border-amber-300 text-amber-800 hover:bg-amber-50"
            >
              <X className="w-5 h-5 mr-2" />
              Not today
            </Button>
          </div>
        </>
      ) : (
        <div
          className={cn(
            "rounded-xl p-5 border",
            wasYes
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200",
          )}
        >
          <div className="flex items-start gap-3 mb-4">
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                wasYes ? "bg-green-500 text-white" : "bg-amber-500 text-white",
              )}
            >
              {wasYes ? (
                <Check className="w-5 h-5" />
              ) : (
                <Lightbulb className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <p
                className={cn(
                  "font-semibold mb-1",
                  wasYes ? "text-green-800" : "text-amber-900",
                )}
              >
                {wasYes ? "Beautiful — keep this rhythm." : "Tomorrow's nudge"}
              </p>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  wasYes ? "text-green-700" : "text-amber-800",
                )}
              >
                {wasYes ? step.successMessage : step.tryAgainMessage}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onContinue} className="flex-1 sm:flex-initial">
              {isLast ? "See today's summary" : "Next reflection →"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onChangeAnswer}
              className="text-gray-600"
            >
              Change my answer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * GIF practice surface. When `mandatory` is set, the user must press
 * "Practice along" and let the countdown reach zero before `onComplete`
 * fires — that's what unlocks the parent's "Yes, I did" button. When
 * `mandatory` is omitted, the GIF is just reference and `onComplete`
 * fires immediately on mount.
 */
function GifPractice({
  src,
  alt,
  caption,
  poseList,
  attribution,
  mandatory,
  onComplete,
}: {
  src: string;
  alt: string;
  caption?: string;
  poseList?: string[];
  attribution?: { name: string; url?: string; source?: string };
  mandatory?: { practiceSeconds: number; label?: string };
  onComplete: () => void;
}) {
  const total = mandatory?.practiceSeconds ?? 0;
  const [active, setActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(total);
  const [done, setDone] = useState(false);

  // Stabilize onComplete via ref so parent re-renders don't tear down
  // the 1s interval mid-tick (same pattern as TimerPractice and
  // MiniBreathingDemo).
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reference-only GIFs don't need engagement — unlock immediately.
  useEffect(() => {
    if (!mandatory) onCompleteRef.current();
  }, [mandatory]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setActive(false);
          setDone(true);
          onCompleteRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-amber-200 bg-amber-50/40 p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full rounded-lg" />
      {caption && (
        <p className="text-sm text-gray-700 leading-relaxed mt-3 px-1">
          {caption}
        </p>
      )}

      {mandatory && (
        <div className="mt-3 px-1">
          {!active && !done && (
            <Button
              size="sm"
              onClick={() => {
                setSecondsLeft(total);
                setActive(true);
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              <Play className="w-4 h-4 mr-1.5" />
              {mandatory.label ?? `Practice along (${total}s)`}
            </Button>
          )}
          {active && (
            <p className="text-sm font-semibold text-cyan-800">
              Practicing… <span className="font-mono">{secondsLeft}s</span>{" "}
              remaining
            </p>
          )}
          {done && (
            <p className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Practice complete — Yes is unlocked
            </p>
          )}
        </div>
      )}

      <Attribution attribution={attribution} />

      {poseList && poseList.length > 0 && (
        <div className="mt-3 rounded-xl bg-amber-50/40 border border-amber-200 p-3">
          <p className="text-xs uppercase tracking-wide text-amber-700 font-semibold mb-2 px-1">
            The 12 poses in sequence
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 px-1 text-sm text-gray-700">
            {poseList.map((pose, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-600 font-semibold flex-shrink-0">
                  {i + 1}.
                </span>
                <span>{pose}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function Attribution({
  attribution,
}: {
  attribution?: { name: string; url?: string; source?: string };
}) {
  if (!attribution) return null;
  return (
    <p className="text-[10px] text-gray-400 mt-2 text-right px-1">
      {attribution.url ? (
        <>
          {attribution.source ? `${attribution.source} by ` : "By "}
          <a
            href={attribution.url}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {attribution.name}
          </a>
        </>
      ) : (
        <>
          {attribution.source ? `${attribution.source} by ` : "By "}
          {attribution.name}
        </>
      )}
    </p>
  );
}

function SummaryCard({
  steps,
  answers,
  yesCount,
  totalSteps,
  title,
  statLabel,
  statVerb,
  closingNote,
  onRestart,
  onJumpToStep,
}: {
  steps: YesNoStep[];
  answers: YesNoAnswer[];
  yesCount: number;
  totalSteps: number;
  title: string;
  statLabel: string;
  statVerb: string;
  closingNote?: string;
  onRestart: () => void;
  onJumpToStep: (idx: number) => void;
}) {
  const wins = steps
    .map((s, i) => ({ s, i }))
    .filter(({ i }) => answers[i] === "yes");
  const opportunities = steps
    .map((s, i) => ({ s, i }))
    .filter(({ i }) => answers[i] === "no");

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6 md:p-8 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h4 className="text-2xl font-bold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">
            You {statVerb}{" "}
            <strong>
              {yesCount} of {totalSteps}
            </strong>{" "}
            {statLabel} today.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRestart}
          className="text-gray-700"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start over
        </Button>
      </div>

      {wins.length > 0 && (
        <div className="rounded-xl bg-white/70 border border-green-200 p-4">
          <p className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <Check className="w-5 h-5" /> Keep this rhythm
          </p>
          <ul className="space-y-1.5">
            {wins.map(({ s, i }) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onJumpToStep(i)}
                  className="text-sm text-green-700 hover:underline text-left"
                >
                  - {s.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {opportunities.length > 0 && (
        <div className="rounded-xl bg-white/70 border border-amber-200 p-4">
          <p className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" /> Try these tomorrow
          </p>
          <ul className="space-y-1.5">
            {opportunities.map(({ s, i }) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onJumpToStep(i)}
                  className="text-sm text-amber-800 hover:underline text-left"
                >
                  - {s.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {closingNote && (
        <p className="text-sm text-gray-600 italic">{closingNote}</p>
      )}
    </div>
  );
}
