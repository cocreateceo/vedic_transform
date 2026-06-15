"use client";

// Yoga Nidra — a guided body-scan into deep rest. Attention moves through the
// body in timed stages while a soft orb breathes. Credits the
// `healing-meditation` pillar. Arc: Intro → setup → rest → Reflect + seal.

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { NextPracticeCta } from "./next-practice-cta";
import { MoodCheck, moodLabel, type MoodValue } from "./mood-check";
import { SessionIntro } from "./session-intro";
import { SESSION_INTROS } from "./session-intros";

const SESSION_PILLAR = "healing-meditation";

const STAGES: Array<{ text: string; sec: number }> = [
  { text: "Settle onto your back. Let the whole body be heavy, still, and supported.", sec: 60 },
  { text: "Become aware of the natural breath, without changing it.", sec: 45 },
  { text: "Bring attention to the right hand — each finger, the palm, the back of the hand.", sec: 45 },
  { text: "The right arm — wrist, forearm, elbow, shoulder. Let it dissolve.", sec: 45 },
  { text: "The left hand — each finger, the palm, the back of the hand.", sec: 45 },
  { text: "The left arm — wrist, forearm, elbow, shoulder. Let it dissolve.", sec: 45 },
  { text: "Both legs — feet, calves, knees, thighs growing heavy.", sec: 60 },
  { text: "The torso — the belly rising and falling, the chest, the back.", sec: 45 },
  { text: "The face — jaw, lips, eyes, forehead all softening.", sec: 45 },
  { text: "The whole body at once — heavy, still, completely at rest.", sec: 60 },
  { text: "Rest in the quiet space behind the closed eyes.", sec: 60 },
  { text: "Gently sense the breath again, and the body returning.", sec: 45 },
  { text: "Deepen the breath; small movements in the fingers and toes.", sec: 45 },
  { text: "When you are ready, open the eyes. The practice is complete.", sec: 30 },
];

const TOTAL = STAGES.reduce((s, st) => s + st.sec, 0);
const BOUNDS = STAGES.reduce<number[]>((acc, st) => {
  acc.push((acc[acc.length - 1] ?? 0) + st.sec);
  return acc;
}, []);

function stageForElapsed(elapsed: number): number {
  for (let i = 0; i < BOUNDS.length; i++) if (elapsed < BOUNDS[i]) return i;
  return STAGES.length - 1;
}

export function NidraPractice() {
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [moodBefore, setMoodBefore] = useState<MoodValue | null>(null);
  const [moodAfter, setMoodAfter] = useState<MoodValue | null>(null);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const checkinFiredRef = useRef(false);

  useEffect(() => {
    if (!running || complete) return;
    const id = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= TOTAL) {
          setRunning(false);
          setComplete(true);
          return TOTAL;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, complete]);

  const sealSession = useCallback(() => {
    if (checkinFiredRef.current) return;
    checkinFiredRef.current = true;
    setSealed(true);
    apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({
        pillarSlug: SESSION_PILLAR,
        durationMinutes: Math.round(TOTAL / 60),
        moodBefore: moodLabel(moodBefore),
        moodAfter: moodLabel(moodAfter),
      }),
    })
      .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
      .catch(() => {});
  }, [moodBefore, moodAfter]);

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setComplete(false);
    setSealed(false);
    setMoodAfter(null);
    setKarmaAwarded(null);
    checkinFiredRef.current = false;
  };

  if (!started) {
    return (
      <div
        className="relative min-h-[540px] p-8 rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ background: "radial-gradient(circle at 50% 40%, #1e1b4b, #050514)" }}
      >
        <SessionIntro {...SESSION_INTROS.nidra} onBegin={() => setStarted(true)} />
      </div>
    );
  }

  const stage = stageForElapsed(elapsed);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const orbScale = 0.85 + Math.sin((elapsed % 8) / 8 * Math.PI) * 0.15;
  const hasBegun = running || elapsed > 0;

  return (
    <div
      className="relative min-h-[540px] p-8 rounded-2xl overflow-hidden flex flex-col items-center gap-6"
      style={{ background: "radial-gradient(circle at 50% 40%, #1e1b4b, #050514)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#A5B4FC" }}>
        Yoga Nidra · योग निद्रा
      </p>

      {/* Breathing orb */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(165,180,252,0.5), rgba(99,102,241,0))",
            transform: `scale(${complete ? 1.1 : orbScale})`,
            transition: "transform 1s ease-in-out",
          }}
        />
        <div
          className="w-20 h-20 rounded-full"
          style={{ background: "radial-gradient(circle, #c7d2fe, #6366f1)", boxShadow: "0 0 40px #6366f1" }}
        />
      </div>

      {/* Guidance / progress */}
      {complete ? (
        !sealed ? (
          <div className="flex flex-col items-center gap-5">
            <p className="text-center text-white/90 max-w-md">Rest complete. Take your time returning.</p>
            <MoodCheck value={moodAfter} onChange={setMoodAfter} prompt="How rested do you feel?" light />
            <Button size="lg" onClick={sealSession} className="min-w-[200px]">
              <Sparkles className="w-4 h-4 mr-2" />
              Seal this session
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {moodBefore && moodAfter && (
              <p className="text-sm text-white/85">
                You moved from{" "}
                <span className="font-semibold text-white">{moodLabel(moodBefore)}</span> to{" "}
                <span className="font-semibold" style={{ color: "#A5B4FC" }}>{moodLabel(moodAfter)}</span>.
              </p>
            )}
            {karmaAwarded !== null && karmaAwarded > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" /> +{karmaAwarded} karma earned
              </span>
            )}
            <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Rest again
            </Button>
          </div>
        )
      ) : (
        <>
          <p className="text-center text-lg text-white/90 max-w-md min-h-[3.5rem] leading-snug">
            {hasBegun ? STAGES[stage].text : "Lie down, get comfortable, and press begin when you're ready."}
          </p>
          <div className="text-white/70 tabular-nums text-sm">{fmt(elapsed)} / {fmt(TOTAL)}</div>

          {!hasBegun && (
            <MoodCheck value={moodBefore} onChange={setMoodBefore} prompt="Before you rest — how do you feel?" light />
          )}

          <Button size="lg" onClick={() => setRunning((r) => !r)} className="min-w-[160px]">
            {running ? <><Pause className="w-5 h-5 mr-2" /> Pause</> : <><Play className="w-5 h-5 mr-2" /> {hasBegun ? "Resume" : "Begin"}</>}
          </Button>
        </>
      )}
    </div>
  );
}
