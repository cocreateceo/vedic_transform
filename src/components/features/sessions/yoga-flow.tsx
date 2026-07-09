"use client";

// Yoga Flow — a guided sequence of asanas with a demo loop, Sanskrit + English
// name, form cue, and a per-pose hold timer that auto-advances. Credits the
// `movement` pillar on completion (a physical practice). Follows the standard
// session arc: Intro → setup (before-mood) → flow → Reflect (after-mood + seal).

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, RotateCcw, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { apiFetch } from "@/lib/api";
import { PexelsVideo } from "@/components/ui/pexels-video";
import { NextPracticeCta } from "./next-practice-cta";
import { MoodCheck, moodLabel, type MoodValue } from "./mood-check";
import { SessionIntro } from "./session-intro";
import { SESSION_INTROS } from "./session-intros";

const SESSION_PILLAR = "movement";

interface Pose {
  name: string;
  sanskrit: string;
  holdSec: number;
  cue: string;
  demoSlug: string;
}

const POSES: Pose[] = [
  { name: "Mountain Pose", sanskrit: "Tadasana", holdSec: 20, cue: "Stand tall, feet rooted, crown lifting. Breathe evenly.", demoSlug: "yoga-mountain" },
  { name: "Forward Fold", sanskrit: "Uttanasana", holdSec: 30, cue: "Hinge at the hips, soften the knees, let the head hang heavy.", demoSlug: "yoga-forward-fold" },
  { name: "Downward Dog", sanskrit: "Adho Mukha Svanasana", holdSec: 30, cue: "Hips up and back, press the floor away, lengthen the spine.", demoSlug: "yoga-downward-dog" },
  { name: "Cobra", sanskrit: "Bhujangasana", holdSec: 25, cue: "Lie down, hands under shoulders, lift the chest, shoulders soft.", demoSlug: "yoga-cobra" },
  { name: "Warrior II", sanskrit: "Virabhadrasana II", holdSec: 30, cue: "Front knee over the ankle, arms strong, gaze forward. Switch sides halfway.", demoSlug: "yoga-warrior" },
  { name: "Tree Pose", sanskrit: "Vrikshasana", holdSec: 30, cue: "Foot to the inner calf or thigh, fix your gaze, breathe. Switch sides halfway.", demoSlug: "yoga-tree" },
  { name: "Child's Pose", sanskrit: "Balasana", holdSec: 30, cue: "Knees wide, hips to heels, forehead down, arms forward. Rest.", demoSlug: "yoga-child" },
  { name: "Corpse Pose", sanskrit: "Savasana", holdSec: 45, cue: "Lie flat, let everything grow heavy. Complete stillness.", demoSlug: "yoga-savasana" },
];

export function YogaFlow() {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(POSES[0].holdSec);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [moodBefore, setMoodBefore] = useState<MoodValue | null>(null);
  const [moodAfter, setMoodAfter] = useState<MoodValue | null>(null);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const checkinFiredRef = useRef(false);

  const pose = POSES[idx];
  const nextPose = POSES[idx + 1];

  const advance = useCallback(() => {
    setIdx((i) => {
      if (i + 1 >= POSES.length) {
        setRunning(false);
        setComplete(true);
        return i;
      }
      setRemaining(POSES[i + 1].holdSec);
      return i + 1;
    });
  }, []);

  useEffect(() => {
    if (!running || complete) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          advance();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, complete, advance]);

  const sealSession = useCallback(() => {
    if (checkinFiredRef.current) return;
    checkinFiredRef.current = true;
    setSealed(true);
    const totalMin = Math.max(1, Math.round(POSES.reduce((s, p) => s + p.holdSec, 0) / 60));
    apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({
        pillarSlug: SESSION_PILLAR,
        durationMinutes: totalMin,
        moodBefore: moodLabel(moodBefore),
        moodAfter: moodLabel(moodAfter),
      }),
    })
      .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
      .catch(() => {});
  }, [moodBefore, moodAfter]);

  const reset = () => {
    setIdx(0);
    setRemaining(POSES[0].holdSec);
    setRunning(false);
    setComplete(false);
    setSealed(false);
    setMoodAfter(null);
    setKarmaAwarded(null);
    checkinFiredRef.current = false;
  };

  if (!started) {
    return <SessionIntro {...SESSION_INTROS.yoga} onBegin={() => setStarted(true)} />;
  }

  // Reflect / reward
  if (complete) {
    return (
      <div className="flex flex-col items-center gap-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <div className="text-center text-white">
              <Check className="w-10 h-10 mx-auto mb-2" />
              <p className="text-lg font-bold">Namaste</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">Flow complete</h3>
          <p className="text-[var(--color-text-secondary)] mt-2">
            You moved through all {POSES.length} poses. Rest a moment before you rise.
          </p>
        </div>

        {!sealed ? (
          <div className="flex flex-col items-center gap-5">
            <MoodCheck value={moodAfter} onChange={setMoodAfter} prompt="How does the body feel now?" />
            <Button size="lg" onClick={sealSession} className="min-w-[200px]">
              <Sparkles className="w-4 h-4 mr-2" />
              Seal this session
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {moodBefore && moodAfter && (
              <p className="text-[var(--color-text-secondary)]">
                You moved from{" "}
                <span className="font-semibold text-[var(--color-text-primary)]">{moodLabel(moodBefore)}</span> to{" "}
                <span className="font-semibold text-amber-600">{moodLabel(moodAfter)}</span>.
              </p>
            )}
            {karmaAwarded !== null && karmaAwarded > 0 && (
              <p className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" /> +{karmaAwarded} karma earned
              </p>
            )}
            <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Flow again
            </Button>
          </div>
        )}
      </div>
    );
  }

  const hasBegun = running || idx > 0 || remaining < pose.holdSec;

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      {/* Before-mood on the setup screen */}
      {!hasBegun && (
        <MoodCheck value={moodBefore} onChange={setMoodBefore} prompt="Before you begin — how do you feel?" />
      )}

      {/* Pose progress dots */}
      <div className="flex items-center gap-1.5">
        {POSES.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i < idx ? "w-2 bg-orange-500" : i === idx ? "w-6 bg-orange-500" : "w-2 bg-[var(--color-border)]",
            )}
          />
        ))}
      </div>

      {/* Demo + name */}
      <div className="w-full max-w-md">
        <div className="relative h-48 rounded-2xl overflow-hidden">
          <PexelsVideo slug={pose.demoSlug} showAttribution={false} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-orange-300">
                Pose {idx + 1} / {POSES.length}
              </p>
              <p className="text-xl font-bold text-white leading-tight">{pose.name}</p>
              <p className="text-xs italic text-white/80">{pose.sanskrit}</p>
            </div>
            <div className="text-3xl font-extrabold text-white tabular-nums">{remaining}</div>
          </div>
        </div>
        <p className="text-sm text-center text-[var(--color-text-secondary)] mt-2">{pose.cue}</p>
        {nextPose && (
          <p className="text-xs text-center text-[var(--color-text-secondary)] mt-1">
            Next: {nextPose.name} · {nextPose.sanskrit}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button size="lg" onClick={() => setRunning((r) => !r)} className="min-w-[150px]">
          {running ? <><Pause className="w-5 h-5 mr-2" /> Pause</> : <><Play className="w-5 h-5 mr-2" /> {hasBegun ? "Resume" : "Start flow"}</>}
        </Button>
        <Button variant="outline" size="lg" onClick={advance} aria-label="Skip pose">
          <SkipForward className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="lg" onClick={reset} aria-label="Restart">
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      <p className="text-center text-sm text-[var(--color-text-secondary)] max-w-md">
        Move with the breath. Hold each pose for the timer, easing off anything
        that hurts — the flow advances on its own.
      </p>
    </div>
  );
}
