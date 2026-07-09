"use client";

// Dosha Quiz — a short Ayurvedic constitution questionnaire (Vata / Pitta /
// Kapha). Tallies answers, names the dominant dosha, and recommends which
// sessions suit it. Informational/personalisation only — no pillar check-in.
// Result is cached in localStorage so other surfaces can read it later.

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Wind, Flame, Mountain, RotateCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Dosha = "vata" | "pitta" | "kapha";

interface Question {
  q: string;
  options: { dosha: Dosha; label: string }[];
}

const QUESTIONS: Question[] = [
  { q: "My natural body frame is…", options: [
    { dosha: "vata", label: "Thin and light — I find it hard to gain weight" },
    { dosha: "pitta", label: "Medium and muscular" },
    { dosha: "kapha", label: "Larger and solid — I gain weight easily" },
  ]},
  { q: "My skin tends to be…", options: [
    { dosha: "vata", label: "Dry, rough, and cool" },
    { dosha: "pitta", label: "Warm, reddish, prone to rashes" },
    { dosha: "kapha", label: "Thick, smooth, and oily" },
  ]},
  { q: "My appetite is…", options: [
    { dosha: "vata", label: "Irregular and variable" },
    { dosha: "pitta", label: "Strong — I get irritable if I skip a meal" },
    { dosha: "kapha", label: "Steady — I can skip meals easily" },
  ]},
  { q: "My sleep is usually…", options: [
    { dosha: "vata", label: "Light and easily disturbed" },
    { dosha: "pitta", label: "Moderate and sound" },
    { dosha: "kapha", label: "Deep and long — hard to wake" },
  ]},
  { q: "Under stress, I tend to become…", options: [
    { dosha: "vata", label: "Anxious and worried" },
    { dosha: "pitta", label: "Irritable and intense" },
    { dosha: "kapha", label: "Withdrawn and sluggish" },
  ]},
  { q: "My mind is most naturally…", options: [
    { dosha: "vata", label: "Quick, restless, and creative" },
    { dosha: "pitta", label: "Focused, driven, and sharp" },
    { dosha: "kapha", label: "Calm, steady, and slow to change" },
  ]},
  { q: "The weather I least enjoy is…", options: [
    { dosha: "vata", label: "Cold, dry, and windy" },
    { dosha: "pitta", label: "Hot and humid" },
    { dosha: "kapha", label: "Cold and damp" },
  ]},
  { q: "My energy through the day…", options: [
    { dosha: "vata", label: "Comes in bursts" },
    { dosha: "pitta", label: "Is strong and intense" },
    { dosha: "kapha", label: "Is steady and enduring" },
  ]},
];

const RESULTS: Record<Dosha, { name: string; icon: typeof Wind; color: string; elements: string; blurb: string; advice: string; sessions: string[] }> = {
  vata: {
    name: "Vata", icon: Wind, color: "#6366F1", elements: "Air & Space",
    blurb: "Creative, quick, and light — but prone to anxiety, dryness, and irregular routines when out of balance.",
    advice: "Favour warmth, routine, and grounding. Keep regular meal and sleep times.",
    sessions: ["Morning Routine for rhythm", "Grounding Yoga Flow", "Slow 4:6 Breathing", "Yoga Nidra for rest"],
  },
  pitta: {
    name: "Pitta", icon: Flame, color: "#EF4444", elements: "Fire & Water",
    blurb: "Sharp, driven, and warm — but prone to irritability, inflammation, and burnout when out of balance.",
    advice: "Favour cooling, moderation, and rest. Don't skip meals or overwork.",
    sessions: ["Cooling 4:7:8 Breathing", "Healing Meditation", "Yoga Nidra", "Gentle Yoga Flow"],
  },
  kapha: {
    name: "Kapha", icon: Mountain, color: "#10B981", elements: "Earth & Water",
    blurb: "Calm, steady, and strong — but prone to heaviness, lethargy, and resistance to change when out of balance.",
    advice: "Favour stimulation, movement, and variety. Rise early and stay active.",
    sessions: ["Vigorous Movement", "Energising Yoga Flow", "Intermittent Fasting", "Early Morning Routine"],
  },
};

const STORAGE_KEY = "dosha-result-v1";

export function DoshaQuiz() {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [tally, setTally] = useState<Record<Dosha, number>>({ vata: 0, pitta: 0, kapha: 0 });
  const [result, setResult] = useState<Dosha | null>(null);
  const savedRef = useRef(false);

  const answer = (dosha: Dosha) => {
    const next = { ...tally, [dosha]: tally[dosha] + 1 };
    setTally(next);
    if (idx + 1 >= QUESTIONS.length) {
      const winner = (Object.keys(next) as Dosha[]).reduce((a, b) => (next[b] > next[a] ? b : a));
      setResult(winner);
    } else {
      setIdx(idx + 1);
    }
  };

  // Persist the result once when it lands.
  useEffect(() => {
    if (!result || savedRef.current) return;
    savedRef.current = true;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ dosha: result, tally }));
    } catch {}
  }, [result, tally]);

  const restart = () => {
    setStarted(false);
    setIdx(0);
    setTally({ vata: 0, pitta: 0, kapha: 0 });
    setResult(null);
    savedRef.current = false;
  };

  // Intro
  if (!started) {
    return (
      <div className="flex flex-col items-center gap-6 py-10 text-center max-w-lg mx-auto">
        <div className="flex gap-3">
          {(["vata", "pitta", "kapha"] as Dosha[]).map((d) => {
            const Icon = RESULTS[d].icon;
            return (
              <div key={d} className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${RESULTS[d].color}22` }}>
                <Icon className="w-7 h-7" style={{ color: RESULTS[d].color }} />
              </div>
            );
          })}
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">What&apos;s your dosha?</h2>
        <p className="text-[var(--color-text-secondary)]">
          Ayurveda describes three constitutional types — Vata, Pitta, and Kapha. Answer {QUESTIONS.length} quick
          questions to find your dominant dosha and the practices that suit it best.
        </p>
        <Button size="lg" onClick={() => setStarted(true)} className="min-w-[200px]">
          <ArrowRight className="w-5 h-5 mr-2" />
          Start the quiz
        </Button>
        <p className="text-xs text-[var(--color-text-secondary)]">
          For self-understanding only — not a medical diagnosis.
        </p>
      </div>
    );
  }

  // Result
  if (result) {
    const r = RESULTS[result];
    const Icon = r.icon;
    const total = tally.vata + tally.pitta + tally.kapha;
    return (
      <div className="flex flex-col items-center gap-5 py-8 max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `${r.color}22` }}>
          <Icon className="w-10 h-10" style={{ color: r.color }} />
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">Your dominant dosha</p>
          <h2 className="text-3xl font-extrabold" style={{ color: r.color }}>{r.name}</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">{r.elements}</p>
        </div>

        {/* Tally bars */}
        <div className="w-full space-y-2">
          {(["vata", "pitta", "kapha"] as Dosha[]).map((d) => (
            <div key={d} className="flex items-center gap-3">
              <span className="w-12 text-xs font-medium text-[var(--color-text-secondary)] capitalize">{d}</span>
              <div className="flex-1 h-2.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(tally[d] / total) * 100}%`, background: RESULTS[d].color }} />
              </div>
              <span className="w-6 text-xs tabular-nums text-[var(--color-text-secondary)]">{tally[d]}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-[var(--color-text-primary)] text-center">{r.blurb}</p>
        <div className="w-full rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
          <p className="text-sm text-amber-800"><span className="font-semibold">To stay balanced — </span>{r.advice}</p>
        </div>

        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2">
            Recommended for you
          </p>
          <ul className="space-y-1.5">
            {r.sessions.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }} />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <Button variant="outline" onClick={restart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake quiz
        </Button>
      </div>
    );
  }

  // Question
  const question = QUESTIONS[idx];
  return (
    <div className="flex flex-col items-center gap-6 py-8 max-w-lg mx-auto">
      <div className="w-full flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300" style={{ width: `${(idx / QUESTIONS.length) * 100}%` }} />
        </div>
        <span className="text-xs text-[var(--color-text-secondary)] tabular-nums">{idx + 1}/{QUESTIONS.length}</span>
      </div>

      <h3 className="text-xl font-bold text-[var(--color-text-primary)] text-center">{question.q}</h3>

      <div className="w-full flex flex-col gap-2">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(opt.dosha)}
            className={cn(
              "w-full text-left p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]",
              "hover:border-orange-400 hover:bg-orange-50 transition-all text-sm text-[var(--color-text-primary)]",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
