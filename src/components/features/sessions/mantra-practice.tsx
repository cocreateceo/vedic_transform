"use client";

// Mantra Library — choose a sacred sound and repeat it, tapping once per
// repetition (japa) toward a round of 108. Shows Devanagari, transliteration,
// and meaning. Credits the `brahman-connection` pillar. Arc: Intro → setup →
// japa → Reflect + seal.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Check, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { apiFetch } from "@/lib/api";
import { NextPracticeCta } from "./next-practice-cta";
import { MoodCheck, moodLabel, type MoodValue } from "./mood-check";
import { SessionIntro } from "./session-intro";
import { SESSION_INTROS } from "./session-intros";
import { hapticTap, playBeadClick } from "@/lib/utils/haptics";

const SESSION_PILLAR = "brahman-connection";
const GOAL = 108;

interface Mantra {
  id: string;
  name: string;
  devanagari: string;
  transliteration: string;
  meaning: string;
}

const MANTRAS: Mantra[] = [
  {
    id: "om",
    name: "Om (Pranava)",
    devanagari: "ॐ",
    transliteration: "Om",
    meaning: "The primordial sound — the vibration from which all creation arises. Rest on it to still the mind.",
  },
  {
    id: "gayatri",
    name: "Gayatri",
    devanagari: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्",
    transliteration: "Om bhūr bhuvaḥ svaḥ, tat savitur vareṇyaṃ, bhargo devasya dhīmahi, dhiyo yo naḥ prachodayāt",
    meaning: "We meditate on the divine light of the Sun; may it awaken and guide our understanding.",
  },
  {
    id: "mahamrityunjaya",
    name: "Mahamrityunjaya",
    devanagari: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्",
    transliteration: "Om tryambakaṃ yajāmahe sugandhiṃ puṣṭi-vardhanam, urvārukam iva bandhanān mṛtyor mukṣīya māmṛtāt",
    meaning: "We worship the three-eyed one who nourishes all; free us from the bonds of fear and death, as a ripe fruit falls from the vine.",
  },
  {
    id: "shanti",
    name: "Shanti Mantra",
    devanagari: "ॐ शान्तिः शान्तिः शान्तिः",
    transliteration: "Om Shāntiḥ Shāntiḥ Shāntiḥ",
    meaning: "Peace, peace, peace — in body, in mind, and in spirit.",
  },
];

const RADIUS = 110;
const CIRC = 2 * Math.PI * RADIUS;

export function MantraPractice() {
  const [started, setStarted] = useState(false);
  const [mantraIdx, setMantraIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [showMeaning, setShowMeaning] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sealed, setSealed] = useState(false);
  const [moodBefore, setMoodBefore] = useState<MoodValue | null>(null);
  const [moodAfter, setMoodAfter] = useState<MoodValue | null>(null);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);

  const mantra = MANTRAS[mantraIdx];
  const isComplete = count >= GOAL;
  const progress = Math.min(count / GOAL, 1);

  const tap = () => {
    if (isComplete) return;
    setCount((c) => Math.min(c + 1, GOAL));
    if (soundEnabled) playBeadClick();
    hapticTap(12);
  };

  const sealSession = () => {
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

  const reset = () => {
    setCount(0);
    setSealed(false);
    setMoodAfter(null);
    setKarmaAwarded(null);
  };

  if (!started) {
    return <SessionIntro {...SESSION_INTROS.mantra} onBegin={() => setStarted(true)} />;
  }

  return (
    <div
      className="relative min-h-[540px] p-8 rounded-2xl overflow-hidden flex flex-col items-center gap-5"
      style={{ background: "radial-gradient(circle at 50% 30%, #2d1b4e, #0a0612)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#FCD34D" }}>
        Japa · जप
      </p>

      {/* Mantra picker */}
      <div className="flex flex-wrap justify-center gap-2">
        {MANTRAS.map((m, i) => (
          <button
            key={m.id}
            onClick={() => { setMantraIdx(i); reset(); }}
            disabled={count > 0 && !isComplete}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition border",
              mantraIdx === i
                ? "bg-white text-amber-700 border-white shadow-md"
                : "bg-white/10 text-white border-white/25 hover:bg-white/20",
              count > 0 && !isComplete && mantraIdx !== i && "opacity-40 cursor-not-allowed",
            )}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Mantra text */}
      <div className="w-full max-w-md rounded-2xl bg-black/25 border border-white/15 px-5 py-4 text-center">
        <p className="text-xl leading-snug text-white font-semibold">{mantra.devanagari}</p>
        <p className="text-sm italic text-white/75 mt-2">{mantra.transliteration}</p>
        <button
          onClick={() => setShowMeaning((v) => !v)}
          className="mt-2 inline-flex items-center gap-1 text-xs text-white/80 hover:text-white"
        >
          <BookOpen className="w-3.5 h-3.5" />
          {showMeaning ? "Hide meaning" : "Show meaning"}
        </button>
        {showMeaning && <p className="text-sm text-white/75 mt-2">{mantra.meaning}</p>}
      </div>

      {/* Tap counter ring */}
      <button
        onClick={tap}
        disabled={isComplete}
        aria-label="Count one repetition"
        className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-full"
        style={{ width: 248, height: 248 }}
      >
        <svg width="248" height="248" className="transform -rotate-90">
          <circle cx="124" cy="124" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
          <circle
            cx="124" cy="124" r={RADIUS} fill="none" stroke="#FFD700" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)}
            className="transition-all duration-200"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold text-white tabular-nums">{count}</span>
          <span className="text-sm text-white/60">/ {GOAL}</span>
          {!isComplete && <span className="text-[11px] uppercase tracking-wide text-white/50 mt-1">Tap each repetition</span>}
        </div>
      </button>

      {/* Sound toggle */}
      {!isComplete && (
        <button
          onClick={() => setSoundEnabled((s) => !s)}
          className="text-xs text-white/70 hover:text-white underline"
        >
          Bead sound: {soundEnabled ? "on" : "off"}
        </button>
      )}

      {/* Setup before-mood (before first tap) */}
      {count === 0 && (
        <MoodCheck value={moodBefore} onChange={setMoodBefore} prompt="Before you begin — how do you feel?" light />
      )}

      {/* Completion / Reflect */}
      {isComplete && (
        !sealed ? (
          <div className="flex flex-col items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-emerald-700 text-sm font-semibold">
              <Check className="w-4 h-4" /> {GOAL} repetitions complete
            </span>
            <MoodCheck value={moodAfter} onChange={setMoodAfter} prompt="After the japa — how do you feel?" light />
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
                <span className="font-semibold" style={{ color: "#FFD700" }}>{moodLabel(moodAfter)}</span>.
              </p>
            )}
            {karmaAwarded !== null && karmaAwarded > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" /> +{karmaAwarded} karma earned
              </span>
            )}
            <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" /> Another round
            </Button>
          </div>
        )
      )}
    </div>
  );
}
