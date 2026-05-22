"use client";

// Sleep Optimization — bedtime wind-down checklist with bed/wake time picker.
// Persists checklist state to localStorage per day. Fires /data/checkin for
// sleep-optimization once all 7 items are checked.

import { useEffect, useRef, useState } from "react";
import {
  Smartphone,
  Coffee,
  Moon,
  Hand,
  BookOpen,
  Sparkles,
  Bed,
  Check,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { NextPracticeCta } from "./next-practice-cta";

const SESSION_PILLAR = "sleep-optimization";

interface Step {
  id: number;
  label: string;
  icon: typeof Smartphone;
  color: string;
  desc: string;
}

const SLEEP_RITUAL: Step[] = [
  { id: 1, label: "Screens off",         icon: Smartphone, color: "#3F51B5", desc: "Phones, TVs, laptops — at least 60 min before bed." },
  { id: 2, label: "Warm milk + nutmeg",  icon: Coffee,     color: "#92400E", desc: "A teaspoon of ghee + a pinch of nutmeg in warm milk." },
  { id: 3, label: "Dim the lights",      icon: Moon,       color: "#6366F1", desc: "Candle or salt lamp only after 9 PM." },
  { id: 4, label: "Foot massage",        icon: Hand,       color: "#10B981", desc: "2-min self-massage with warm sesame oil." },
  { id: 5, label: "Gratitude journal",   icon: BookOpen,   color: "#F59E0B", desc: "Three things from today. Close the book." },
  { id: 6, label: "Yoga Nidra (10 min)", icon: Sparkles,   color: "#A855F7", desc: "Body scan from the Audio Library." },
  { id: 7, label: "Right-side sleep",    icon: Bed,        color: "#0EA5E9", desc: "Lie on your right side first — opens the lunar nadi." },
];

function todayKey() {
  return `sleep-ritual-${new Date().toISOString().split("T")[0]}`;
}

export function SleepPractice() {
  const [done, setDone] = useState<Set<number>>(new Set());
  const [bedTime, setBedTime] = useState("22:00");
  const [wakeTime, setWakeTime] = useState("05:00");
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const checkinFiredRef = useRef(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(todayKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.done)) setDone(new Set(parsed.done));
        if (parsed.bedTime) setBedTime(parsed.bedTime);
        if (parsed.wakeTime) setWakeTime(parsed.wakeTime);
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist on every change.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        todayKey(),
        JSON.stringify({ done: Array.from(done), bedTime, wakeTime }),
      );
    } catch {}
  }, [done, bedTime, wakeTime, hydrated]);

  // Credit check-in once all 7 items are done.
  useEffect(() => {
    if (done.size < SLEEP_RITUAL.length || checkinFiredRef.current) return;
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

  // Compute hours slept (handle wrap-around).
  const [bh, bm] = bedTime.split(":").map(Number);
  const [wh, wm] = wakeTime.split(":").map(Number);
  let hours = wh + (wh < bh ? 24 : 0) - bh + (wm - bm) / 60;
  if (hours < 0) hours += 24;
  const hoursClass = hours >= 7 ? "text-emerald-300" : "text-rose-300";
  const allDone = done.size === SLEEP_RITUAL.length;

  return (
    <div
      className="relative min-h-[540px] p-8 rounded-2xl overflow-hidden flex flex-col items-center gap-6"
      style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #050514 100%)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#FCD34D" }}>
        Nidra · निद्रा
      </p>
      <h2 className="text-2xl font-bold text-white">Tonight&apos;s wind-down ritual</h2>

      {/* Bed / Wake / Hours */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        <div className="text-center bg-white/10 p-3 rounded-xl min-w-[130px]">
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#A5B4FC" }}>
            Bedtime
          </div>
          <input
            type="time"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            className="bg-transparent border-0 text-white text-2xl font-extrabold outline-none w-full text-center"
            style={{ fontFamily: "var(--font-display, inherit)" }}
          />
        </div>
        <div className="text-xl" style={{ color: "#A5B4FC" }}>→</div>
        <div className="text-center bg-white/10 p-3 rounded-xl min-w-[130px]">
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#A5B4FC" }}>
            Wake
          </div>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="bg-transparent border-0 text-white text-2xl font-extrabold outline-none w-full text-center"
            style={{ fontFamily: "var(--font-display, inherit)" }}
          />
        </div>
        <div className="text-center p-3 rounded-xl min-w-[130px] border border-amber-300/30" style={{ background: "rgba(252,211,77,0.15)" }}>
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#FCD34D" }}>
            You get
          </div>
          <div className={`text-2xl font-extrabold ${hoursClass}`}>
            {hours.toFixed(1)}h
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="w-full max-w-xl flex flex-col gap-2">
        {SLEEP_RITUAL.map((s) => {
          const isDone = done.has(s.id);
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className="flex items-center gap-3 p-3 rounded-xl transition text-left"
              style={{
                background: isDone ? "rgba(16,185,129,0.10)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${isDone ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.12)"}`,
              }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: isDone ? "#10B981" : "transparent",
                  border: `2px solid ${isDone ? "#10B981" : "rgba(255,255,255,0.3)"}`,
                }}
              >
                {isDone && <Check className="w-3 h-3 text-white" />}
              </span>
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${s.color}33` }}
              >
                <Icon className="w-4 h-4" style={{ color: s.color }} />
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-semibold text-white"
                  style={{
                    textDecoration: isDone ? "line-through" : "none",
                    opacity: isDone ? 0.6 : 1,
                  }}
                >
                  {s.label}
                </div>
                <div className="text-xs" style={{ color: "#A5B4FC" }}>
                  {s.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {allDone && (
        <div className="flex flex-col items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: "rgba(16,185,129,0.15)" }}>
          <span className="inline-flex items-center gap-2 font-semibold" style={{ color: "#86EFAC" }}>
            <Moon className="w-4 h-4" />
            Sleep well. See you at {wakeTime}.
          </span>
          {karmaAwarded !== null && karmaAwarded > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              +{karmaAwarded} karma earned
            </span>
          )}
          <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
        </div>
      )}
    </div>
  );
}
