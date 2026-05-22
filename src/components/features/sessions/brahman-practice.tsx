"use client";

// Brahman Connection — silent expansion meditation with concentric rings
// pulsing outward through three phases (expanding · infinite · returning).
// 5-minute total. Fires /data/checkin for brahman-connection on completion.

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { NextPracticeCta } from "./next-practice-cta";

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

  // Fire check-in once when complete.
  useEffect(() => {
    if (phase !== "complete" || checkinFiredRef.current) return;
    checkinFiredRef.current = true;
    apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({ pillarSlug: SESSION_PILLAR }),
    })
      .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
      .catch(() => {});
  }, [phase]);

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
    checkinFiredRef.current = false;
  };
  const stop = () => {
    setPhase("idle");
    setElapsed(0);
  };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

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
        <div className="flex flex-col items-center gap-3">
          {karmaAwarded !== null && karmaAwarded > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              +{karmaAwarded} karma earned
            </span>
          )}
          <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
          <Button variant="outline" onClick={() => { setPhase("idle"); setElapsed(0); setKarmaAwarded(null); checkinFiredRef.current = false; }}>
            Begin again
          </Button>
        </div>
      ) : (
        <Button size="lg" onClick={phase === "idle" ? start : stop} className="min-w-[160px]">
          {phase === "idle" ? <><Play className="w-5 h-5 mr-2" /> Begin</> : <><Square className="w-5 h-5 mr-2" /> End</>}
        </Button>
      )}

      <p className="text-center text-sm max-w-md" style={{ color: "rgba(255,255,255,0.75)" }}>
        5 minutes of silent expansion meditation. Let go of body, breath, and
        thought. Rest in pure awareness.
      </p>
    </div>
  );
}
