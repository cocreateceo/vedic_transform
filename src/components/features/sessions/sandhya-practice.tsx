"use client";

// Sandhya practice — 3-times-daily face-direction + 108-bead Gayatri count.
// Ported from the Vedics Design System kit.
//
// Fires a /data/checkin for sandhya-meditation once the user crosses 108
// counts. Same dedupe semantics as the other timers (server-side same-day).

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Check, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { NextPracticeCta } from "./next-practice-cta";

const SESSION_PILLAR = "sandhya-meditation";

const SANDHYAS = [
  { id: "pratah", label: "Pratah · Dawn",  time: "5:30 AM",  face: "East",  bgGrad: "linear-gradient(135deg, #5B2C6F, #E67E22)" },
  { id: "madhya", label: "Madhya · Noon",  time: "12:00 PM", face: "North", bgGrad: "linear-gradient(135deg, #3498DB, #85C1E9)" },
  { id: "sayam",  label: "Sayam · Dusk",   time: "6:00 PM",  face: "West",  bgGrad: "linear-gradient(135deg, #D35400, #4A235A)" },
];

const FACE_ROTATIONS: Record<string, number> = { North: 0, East: 90, South: 180, West: 270 };

export function SandhyaPractice() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [chanting, setChanting] = useState(false);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const checkinFiredRef = useRef(false);

  const sandhya = SANDHYAS[activeIdx];

  useEffect(() => {
    if (!chanting) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c + 1 >= 108) {
          setChanting(false);
          return 108;
        }
        return c + 1;
      });
    }, 800);
    return () => clearInterval(id);
  }, [chanting]);

  // Credit on reaching 108. Server dedupes by (userId, date, pillarSlug).
  useEffect(() => {
    if (count < 108 || checkinFiredRef.current) return;
    checkinFiredRef.current = true;
    apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({ pillarSlug: SESSION_PILLAR }),
    })
      .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
      .catch(() => {});
  }, [count]);

  const reset = () => {
    setCount(0);
    setChanting(false);
    setKarmaAwarded(null);
    checkinFiredRef.current = false;
  };

  return (
    <div
      className="relative min-h-[540px] p-8 rounded-2xl overflow-hidden flex flex-col items-center gap-6"
      style={{ background: sandhya.bgGrad }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-white/85">
        Sandhyavandana · सन्ध्यावन्दना
      </p>
      <h2 className="text-2xl font-bold text-white text-center" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
        The three junctures of the day
      </h2>

      {/* Sandhya picker */}
      <div className="flex flex-wrap justify-center gap-2">
        {SANDHYAS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setActiveIdx(i); reset(); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeIdx === i
                ? "bg-white text-amber-700 shadow-md"
                : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Compass */}
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 220 220" width="100%" height="100%">
          <circle cx="110" cy="110" r="100" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          <circle cx="110" cy="110" r="70" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 3" />
          {(["N", "E", "S", "W"] as const).map((letter, i) => {
            const direction = letter === "N" ? "North" : letter === "E" ? "East" : letter === "S" ? "South" : "West";
            const angle = i * 90;
            const x = 110 + 88 * Math.cos((angle - 90) * Math.PI / 180);
            const y = 110 + 88 * Math.sin((angle - 90) * Math.PI / 180) + 5;
            return (
              <text key={letter} x={x} y={y} textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" opacity={sandhya.face === direction ? 1 : 0.4}>
                {letter}
              </text>
            );
          })}
          <g transform={`translate(110 110) rotate(${FACE_ROTATIONS[sandhya.face]})`}>
            <path d="M 0 -70 L 10 0 L 0 -8 L -10 0 Z" fill="#FFD700" stroke="#fff" strokeWidth="1" />
            <circle r="6" fill="#FFD700" />
          </g>
        </svg>
      </div>

      <div className="text-center text-white">
        <div className="text-xs uppercase tracking-widest opacity-85">
          Face {sandhya.face} · {sandhya.time}
        </div>
        <div className="text-5xl font-extrabold mt-1 tabular-nums">
          {count}
          <span className="text-xl opacity-70 ml-1">/ 108</span>
        </div>
        <div className="text-sm opacity-85 mt-1">Gayatri mantra · ॐ भूर्भुवः स्वः</div>
      </div>

      {count >= 108 ? (
        <div className="flex flex-col items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-emerald-700 text-sm font-semibold">
            <Check className="w-4 h-4" /> 108 counts complete
          </span>
          {karmaAwarded !== null && karmaAwarded > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              +{karmaAwarded} karma earned
            </span>
          )}
          <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart count
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            size="lg"
            onClick={() => setChanting((c) => !c)}
            className="min-w-[160px]"
          >
            {chanting ? <><Pause className="w-5 h-5 mr-2" /> Pause</> : <><Play className="w-5 h-5 mr-2" /> {count === 0 ? "Begin chant" : "Resume"}</>}
          </Button>
          <button
            onClick={reset}
            className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 text-white hover:bg-white/30 transition flex items-center justify-center"
            aria-label="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      )}

      <p className="text-center text-sm text-white/85 max-w-md">
        Recite 108 times. Each repetition is one bead on the mala. Eyes closed,
        attention on the inner space between the brows.
      </p>
    </div>
  );
}
