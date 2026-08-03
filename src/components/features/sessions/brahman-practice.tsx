"use client";

// Brahman Connection — silent expansion meditation with concentric rings
// pulsing outward through three phases (expanding · infinite · returning).
// 5-minute total. Fires /data/checkin for brahman-connection on completion.

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { NextPracticeCta } from "./next-practice-cta";
import { MoodCheck, moodLabel, type MoodValue } from "./mood-check";
import { SessionIntro } from "./session-intro";
import { SESSION_INTROS } from "./session-intros";

const SESSION_PILLAR = "brahman-connection";

type Phase = "idle" | "expanding" | "infinite" | "returning" | "complete";

const SEQUENCE: Array<[Phase, number]> = [
  ["expanding", 60],
  ["infinite", 180],
  ["returning", 60],
];

const PHASE_LABEL: Record<Phase, string> = {
  idle: "Sit comfortably · close your eyes",
  expanding: "Expanding · feel your edges dissolve",
  infinite: "Infinite · rest in awareness",
  returning: "Returning · bring it back to the body",
  complete: "Namaste",
};

export function BrahmanPractice() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const [moodBefore, setMoodBefore] = useState<MoodValue | null>(null);
  const [moodAfter, setMoodAfter] = useState<MoodValue | null>(null);
  const [sealed, setSealed] = useState(false);
  const [started, setStarted] = useState(false);
  const checkinFiredRef = useRef(false);

  // Tick once a second while running.
  useEffect(() => {
    if (phase === "idle" || phase === "complete") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Advance phases at the right cumulative seconds.
  useEffect(() => {
    let cum = 0;
    for (let i = 0; i < SEQUENCE.length; i++) {
      cum += SEQUENCE[i][1];
      if (elapsed === cum) {
        const nextSpec = SEQUENCE[i + 1];
        setPhase(nextSpec ? nextSpec[0] : "complete");
        return;
      }
    }
  }, [elapsed]);

  // Credit fires in the Reflect step, carrying before/after mood with it.
  const sealSession = useCallback(() => {
    if (checkinFiredRef.current) return;
    checkinFiredRef.current = true;
    setSealed(true);
    apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({
        pillarSlug: SESSION_PILLAR,
        durationMinutes: 5,
        moodBefore: moodLabel(moodBefore),
        moodAfter: moodLabel(moodAfter),
      }),
    })
      .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
      .catch(() => {});
  }, [moodBefore, moodAfter]);

  const ringScale =
    phase === "idle"
      ? 0.5
      : phase === "expanding"
        ? 0.5 + (elapsed / 60) * 0.5
        : phase === "infinite"
          ? 1
          : phase === "returning"
            ? 1 - ((elapsed - 240) / 60) * 0.5
            : 1;

  const start = () => {
    setPhase("expanding");
    setElapsed(0);
    setKarmaAwarded(null);
    setMoodAfter(null);
    setSealed(false);
    checkinFiredRef.current = false;
  };
  const stop = () => {
    setPhase("idle");
    setElapsed(0);
  };
  const beginAgain = () => {
    setPhase("idle");
    setElapsed(0);
    setKarmaAwarded(null);
    setMoodAfter(null);
    setSealed(false);
    checkinFiredRef.current = false;
  };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (!started) {
    return (
      <div
        className="relative min-h-[540px] p-8 rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ background: "radial-gradient(circle at 50% 50%, #1e1b4b, #050514)" }}
      >
        <SessionIntro {...SESSION_INTROS.brahman} onBegin={() => setStarted(true)} />
      </div>
    );
  }

  return (
    <div
      className="relative min-h-[540px] p-8 rounded-2xl overflow-hidden flex flex-col items-center gap-6"
      style={{ background: "radial-gradient(circle at 50% 50%, #1e1b4b, #050514)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#FCD34D" }}>
        Brahma Sambandha · ब्रह्म सम्बन्ध
      </p>
      <h2 className="text-2xl font-bold text-white">Connection to the infinite</h2>

      <div className="relative w-72 h-72">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `2px solid rgba(255,215,0,${0.5 - i * 0.1})`,
              transform: `scale(${ringScale * (1 - i * 0.18)})`,
              transition: "transform 1s ease-out",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: "40%",
            borderRadius: "50%",
            background: "radial-gradient(circle, #FFD700, #FF9933)",
            boxShadow: "0 0 50px #FFD700",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-3xl font-extrabold" style={{ color: "#FFD700" }}>ॐ</span>
        </div>
      </div>

      <div className="text-center text-white">
        <div className="text-xs uppercase tracking-widest opacity-85" style={{ color: "#FCD34D" }}>
          {PHASE_LABEL[phase]}
        </div>
        <div className="text-5xl font-extrabold mt-1 tabular-nums">
          {fmt(elapsed)}
          <span className="text-base opacity-70 ml-1"> / 5:00</span>
        </div>
      </div>

      {phase === "complete" ? (
        !sealed ? (
          <div className="flex flex-col items-center gap-5">
            <MoodCheck
              value={moodAfter}
              onChange={setMoodAfter}
              prompt="Coming back — how do you feel now?"
              light
            />
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
                <span className="font-semibold text-white">{moodLabel(moodBefore)}</span>{" "}
                to{" "}
                <span className="font-semibold" style={{ color: "#FCD34D" }}>{moodLabel(moodAfter)}</span>.
              </p>
            )}
            {karmaAwarded !== null && karmaAwarded > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                +{karmaAwarded} karma earned
              </span>
            )}
            <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
            <Button variant="outline" onClick={beginAgain}>
              Begin again
            </Button>
          </div>
        )
      ) : phase === "idle" ? (
        <div className="flex flex-col items-center gap-5">
          <MoodCheck
            value={moodBefore}
            onChange={setMoodBefore}
            prompt="Before you begin — how do you feel?"
            light
          />
          <Button size="lg" onClick={start} className="min-w-[160px]">
            <Play className="w-5 h-5 mr-2" /> Begin
          </Button>
        </div>
      ) : (
        <Button size="lg" onClick={stop} className="min-w-[160px]">
          <Square className="w-5 h-5 mr-2" /> End
        </Button>
      )}

      {/* The brief belongs to the moment before the sit. Once the timer is
          running it is a second thing to read while the instruction is to stop
          reading, and after the sit it is advice for a practice just finished.
          It renders where it is useful and nowhere else. */}
      {phase === "idle" && (
        <p className="text-center text-sm max-w-md" style={{ color: "rgba(255,255,255,0.75)" }}>
          5 minutes of silent expansion meditation. Let go of body, breath, and
          thought. Rest in pure awareness.
        </p>
      )}
    </div>
  );
}
