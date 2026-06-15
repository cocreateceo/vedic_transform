"use client";

// Dinacharya — the Ayurvedic morning cleansing routine as a check-off ritual.
// Persists per-day in localStorage; credits the `morning-initiation` pillar
// once every step is done. Opens with the standard SessionIntro briefing.

import { useEffect, useRef, useState } from "react";
import { Sun, Droplet, Droplets, Sparkles, Wind, Hand, Smile, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { NextPracticeCta } from "./next-practice-cta";
import { SessionIntro } from "./session-intro";
import { SESSION_INTROS } from "./session-intros";

const SESSION_PILLAR = "morning-initiation";

interface Step {
  id: number;
  label: string;
  icon: typeof Sun;
  color: string;
  desc: string;
}

const RITUAL: Step[] = [
  { id: 1, label: "Wake before sunrise", icon: Sun, color: "#F59E0B", desc: "Rise in Brahma Muhurta, ideally before 6 AM." },
  { id: 2, label: "Warm water", icon: Droplet, color: "#0EA5E9", desc: "A glass of warm water to wake digestion and elimination." },
  { id: 3, label: "Scrape the tongue", icon: Sparkles, color: "#10B981", desc: "Gently scrape back-to-front 7–10 times to clear ama." },
  { id: 4, label: "Oil pulling", icon: Droplets, color: "#92400E", desc: "Swish a tablespoon of sesame or coconut oil 5–10 min, then spit." },
  { id: 5, label: "Splash the face & eyes", icon: Smile, color: "#6366F1", desc: "Cool water on the face and eyes to refresh the senses." },
  { id: 6, label: "Nasya (nasal oil)", icon: Wind, color: "#A855F7", desc: "A drop of warm oil in each nostril to clear the channels." },
  { id: 7, label: "Abhyanga (self-massage)", icon: Hand, color: "#EC4899", desc: "Warm-oil massage into the skin before bathing." },
];

function todayKey() {
  return `dinacharya-${new Date().toISOString().split("T")[0]}`;
}

export function DinacharyaPractice() {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const checkinFiredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(todayKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.done)) setDone(new Set(parsed.done));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(todayKey(), JSON.stringify({ done: Array.from(done) }));
    } catch {}
  }, [done, hydrated]);

  useEffect(() => {
    if (done.size < RITUAL.length || checkinFiredRef.current) return;
    checkinFiredRef.current = true;
    apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({ pillarSlug: SESSION_PILLAR }),
    })
      .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
      .catch(() => {});
  }, [done]);

  const toggle = (id: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!started) {
    return <SessionIntro {...SESSION_INTROS.dinacharya} onBegin={() => setStarted(true)} />;
  }

  const allDone = done.size === RITUAL.length;

  return (
    <div
      className="relative min-h-[480px] p-8 rounded-2xl overflow-hidden flex flex-col items-center gap-5"
      style={{ background: "linear-gradient(180deg, #FFF7ED 0%, #FEF3C7 100%)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#B45309" }}>
        Dinacharya · दिनचर्या
      </p>
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Ayurvedic morning ritual</h2>
      <p className="text-sm text-[var(--color-text-secondary)]">
        {done.size} of {RITUAL.length} complete
      </p>

      <div className="w-full max-w-xl flex flex-col gap-2">
        {RITUAL.map((s) => {
          const isDone = done.has(s.id);
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className="flex items-center gap-3 p-3 rounded-xl transition text-left border bg-white/70"
              style={{ borderColor: isDone ? "rgba(16,185,129,0.4)" : "rgba(0,0,0,0.08)" }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: isDone ? "#10B981" : "transparent",
                  border: `2px solid ${isDone ? "#10B981" : "rgba(0,0,0,0.2)"}`,
                }}
              >
                {isDone && <Check className="w-3 h-3 text-white" />}
              </span>
              <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.color}22` }}>
                <Icon className="w-4 h-4" style={{ color: s.color }} />
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-semibold text-[var(--color-text-primary)]"
                  style={{ textDecoration: isDone ? "line-through" : "none", opacity: isDone ? 0.6 : 1 }}
                >
                  {s.label}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)]">{s.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {allDone && (
        <div className="flex flex-col items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: "rgba(16,185,129,0.12)" }}>
          <span className="inline-flex items-center gap-2 font-semibold text-emerald-700">
            <Sun className="w-4 h-4" />
            Your morning is set. Carry this clarity into the day.
          </span>
          {karmaAwarded !== null && karmaAwarded > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" /> +{karmaAwarded} karma earned
            </span>
          )}
          <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
        </div>
      )}
    </div>
  );
}
