"use client";

// Sandhya practice — 3-times-daily face-direction + 108-bead Gayatri count.
//
// The count is now TAP-DRIVEN: the user recites the Gayatri mantra and taps
// the mala bead once per repetition (with a soft bead click + haptic), exactly
// like turning a physical japa mala. Nothing auto-advances — the 108 is proof
// the user actually did the reps. A "guided pace" toggle is offered for those
// who want an audible metronome to chant along to, but it is opt-in.
//
// Fires a /data/checkin for sandhya-meditation once the user crosses 108
// counts. Same dedupe semantics as the other timers (server-side same-day).

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Check, Sparkles, Volume2, VolumeX, BookOpen } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { NextPracticeCta } from "./next-practice-cta";
import { hapticTap, playBeadClick } from "@/lib/utils/haptics";
import { cn } from "@/lib/utils/cn";
import { MoodCheck, moodLabel, type MoodValue } from "./mood-check";
import { SessionIntro } from "./session-intro";
import { SESSION_INTROS } from "./session-intros";

const SESSION_PILLAR = "sandhya-meditation";
const TOTAL_BEADS = 108;

const SANDHYAS = [
  { id: "pratah", label: "Pratah · Dawn", time: "5:30 AM", face: "East", why: "Facing the rising sun at dawn, the mind is freshest and the air most sattvic.", bgGrad: "linear-gradient(135deg, #5B2C6F, #E67E22)" },
  { id: "madhya", label: "Madhya · Noon", time: "12:00 PM", face: "North", why: "At midday the sun is at its zenith; the noon juncture steadies the working mind.", bgGrad: "linear-gradient(135deg, #3498DB, #85C1E9)" },
  { id: "sayam", label: "Sayam · Dusk", time: "6:00 PM", face: "West", why: "Facing the setting sun at dusk, the day's activity is offered and released.", bgGrad: "linear-gradient(135deg, #D35400, #4A235A)" },
];

const FACE_ROTATIONS: Record<string, number> = { North: 0, East: 90, South: 180, West: 270 };

// The Gayatri mantra (Rig Veda 3.62.10) — the verse recited at each sandhya.
const GAYATRI = {
  devanagari: ["ॐ भूर्भुवः स्वः", "तत्सवितुर्वरेण्यं", "भर्गो देवस्य धीमहि", "धियो यो नः प्रचोदयात्"],
  transliteration: ["Om bhūr bhuvaḥ svaḥ", "tat savitur vareṇyaṃ", "bhargo devasya dhīmahi", "dhiyo yo naḥ prachodayāt"],
  meaning:
    "We meditate on the radiant glory of the divine Sun, the source of the three worlds. May that light awaken and guide our understanding.",
};

// Bead-ring geometry. 108 beads laid around a circle; filled up to `count`.
const RING_SIZE = 280;
const RING_CENTER = RING_SIZE / 2;
const RING_RADIUS = 124;
const BEAD_POSITIONS = Array.from({ length: TOTAL_BEADS }, (_, i) => {
  const angle = (i / TOTAL_BEADS) * 2 * Math.PI - Math.PI / 2;
  return {
    x: RING_CENTER + RING_RADIUS * Math.cos(angle),
    y: RING_CENTER + RING_RADIUS * Math.sin(angle),
    // The 109th "guru bead" position is the gap at top; mark every 27th (a quarter).
    marker: i % 27 === 0,
  };
});

export function SandhyaPractice() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMeaning, setShowMeaning] = useState(false);
  const [guidedPace, setGuidedPace] = useState(false);
  const [moodBefore, setMoodBefore] = useState<MoodValue | null>(null);
  const [moodAfter, setMoodAfter] = useState<MoodValue | null>(null);
  const [sealed, setSealed] = useState(false);
  const [started, setStarted] = useState(false);
  const checkinFiredRef = useRef(false);

  const sandhya = SANDHYAS[activeIdx];
  const isComplete = count >= TOTAL_BEADS;
  // Which mantra line to highlight, cycling as the user chants.
  const activeLine = count % GAYATRI.devanagari.length;

  // Optional guided pace: an audible metronome cue every 4s to chant along to.
  // It does NOT advance the count — the user still taps each repetition.
  useEffect(() => {
    if (!guidedPace || isComplete) return;
    const id = setInterval(() => {
      if (soundEnabled) playBeadClick();
    }, 4000);
    return () => clearInterval(id);
  }, [guidedPace, isComplete, soundEnabled]);

  // Credit fires when the user seals the session in Reflect (after 108),
  // carrying before/after mood. Server dedupes by (userId, date, pillarSlug).
  const sealSession = () => {
    if (checkinFiredRef.current) return;
    checkinFiredRef.current = true;
    setSealed(true);
    apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({
        pillarSlug: SESSION_PILLAR,
        moodBefore: moodLabel(moodBefore),
        moodAfter: moodLabel(moodAfter),
      }),
    })
      .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
      .catch(() => {});
  };

  const tap = () => {
    if (isComplete) return;
    setCount((c) => Math.min(c + 1, TOTAL_BEADS));
    if (soundEnabled) playBeadClick();
    hapticTap(12);
  };

  const reset = () => {
    setCount(0);
    setKarmaAwarded(null);
    setMoodAfter(null);
    setSealed(false);
    checkinFiredRef.current = false;
  };

  if (!started) {
    return (
      <div
        className="relative min-h-[540px] p-8 rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ background: sandhya.bgGrad }}
      >
        <SessionIntro {...SESSION_INTROS.sandhya} onBegin={() => setStarted(true)} />
      </div>
    );
  }

  return (
    <div
      className="relative min-h-[540px] p-8 rounded-2xl overflow-hidden flex flex-col items-center gap-5"
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
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold transition",
              activeIdx === i
                ? "bg-white text-amber-700 shadow-md"
                : "bg-white/20 text-white border border-white/30 hover:bg-white/30",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Mantra to recite — Devanagari with the active line highlighted */}
      <div className="w-full max-w-md rounded-2xl bg-black/20 backdrop-blur-sm border border-white/15 px-5 py-4 text-center">
        <p className="text-[11px] uppercase tracking-widest text-white/70 mb-2">
          Recite the Gayatri mantra
        </p>
        <div className="space-y-0.5">
          {GAYATRI.devanagari.map((line, i) => (
            <p
              key={i}
              className={cn(
                "text-lg leading-snug transition-all duration-300",
                !isComplete && i === activeLine
                  ? "text-white font-semibold scale-[1.03]"
                  : "text-white/55",
              )}
            >
              {line}
            </p>
          ))}
        </div>
        <button
          onClick={() => setShowMeaning((v) => !v)}
          className="mt-2 inline-flex items-center gap-1 text-xs text-white/80 hover:text-white"
        >
          <BookOpen className="w-3.5 h-3.5" />
          {showMeaning ? "Hide meaning" : "Show meaning & transliteration"}
        </button>
        {showMeaning && (
          <div className="mt-2 text-left space-y-1">
            {GAYATRI.transliteration.map((line, i) => (
              <p key={i} className="text-sm italic text-white/85">{line}</p>
            ))}
            <p className="text-sm text-white/75 pt-1">{GAYATRI.meaning}</p>
          </div>
        )}
      </div>

      {/* Interactive japa mala — tap one bead per repetition */}
      <button
        onClick={tap}
        disabled={isComplete}
        aria-label="Count one mantra repetition"
        className="relative select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-full"
        style={{ width: RING_SIZE, height: RING_SIZE }}
      >
        <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} width="100%" height="100%">
          {BEAD_POSITIONS.map((b, i) => {
            const filled = i < count;
            return (
              <circle
                key={i}
                cx={b.x}
                cy={b.y}
                r={b.marker ? 5.5 : 4}
                fill={filled ? "#FFD700" : "rgba(255,255,255,0.18)"}
                stroke={filled ? "#fff" : "rgba(255,255,255,0.3)"}
                strokeWidth={b.marker ? 1.5 : 0.75}
                className="transition-all duration-150"
              />
            );
          })}
        </svg>
        {/* Center tap target / count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-white/12 border border-white/25 backdrop-blur-sm flex flex-col items-center justify-center shadow-inner active:scale-95 transition-transform">
            <span className="text-5xl font-extrabold text-white tabular-nums leading-none">
              {count}
            </span>
            <span className="text-sm text-white/70 mt-1">/ {TOTAL_BEADS}</span>
            {!isComplete && (
              <span className="text-[11px] uppercase tracking-wide text-white/60 mt-1">
                Tap each repetition
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Facing direction + sound controls */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 64 64" width="100%" height="100%">
            <circle cx="32" cy="32" r="29" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            {(["N", "E", "S", "W"] as const).map((letter, i) => {
              const direction = letter === "N" ? "North" : letter === "E" ? "East" : letter === "S" ? "South" : "West";
              const angle = i * 90;
              const x = 32 + 24 * Math.cos((angle - 90) * Math.PI / 180);
              const y = 32 + 24 * Math.sin((angle - 90) * Math.PI / 180) + 3;
              return (
                <text key={letter} x={x} y={y} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" opacity={sandhya.face === direction ? 1 : 0.4}>
                  {letter}
                </text>
              );
            })}
            <g transform={`translate(32 32) rotate(${FACE_ROTATIONS[sandhya.face]})`}>
              <path d="M 0 -20 L 3 0 L 0 -2.5 L -3 0 Z" fill="#FFD700" stroke="#fff" strokeWidth="0.5" />
            </g>
          </svg>
        </div>
        <div className="text-left text-white">
          <div className="text-xs uppercase tracking-widest opacity-85">
            Face {sandhya.face} · {sandhya.time}
          </div>
          <p className="text-xs text-white/70 max-w-[200px] mt-0.5">{sandhya.why}</p>
        </div>
        <button
          onClick={() => setSoundEnabled((s) => !s)}
          className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 text-white hover:bg-white/25 transition flex items-center justify-center shrink-0"
          aria-label={soundEnabled ? "Mute bead sound" : "Unmute bead sound"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {isComplete ? (
        !sealed ? (
          <div className="flex flex-col items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-emerald-700 text-sm font-semibold">
              <Check className="w-4 h-4" /> 108 repetitions complete
            </span>
            <MoodCheck
              value={moodAfter}
              onChange={setMoodAfter}
              prompt="After the mala — how do you feel?"
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
                <span className="font-semibold" style={{ color: "#FFD700" }}>{moodLabel(moodAfter)}</span>.
              </p>
            )}
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
        )
      ) : count === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <MoodCheck
            value={moodBefore}
            onChange={setMoodBefore}
            prompt="Before you begin — how do you feel?"
            light
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGuidedPace((g) => !g)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition border",
                guidedPace
                  ? "bg-white text-amber-700 border-white shadow-md"
                  : "bg-white/15 text-white border-white/30 hover:bg-white/25",
              )}
            >
              {guidedPace ? "Guided pace: on" : "Guided pace: off"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGuidedPace((g) => !g)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition border",
              guidedPace
                ? "bg-white text-amber-700 border-white shadow-md"
                : "bg-white/15 text-white border-white/30 hover:bg-white/25",
            )}
          >
            {guidedPace ? "Guided pace: on" : "Guided pace: off"}
          </button>
          <button
            onClick={reset}
            disabled={count === 0}
            className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 text-white hover:bg-white/30 transition flex items-center justify-center disabled:opacity-40"
            aria-label="Reset count"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      )}

      <p className="text-center text-sm text-white/85 max-w-md">
        Tap a bead for each repetition — eyes closed, attention on the space
        between the brows. A full mala is 108.
      </p>
    </div>
  );
}
