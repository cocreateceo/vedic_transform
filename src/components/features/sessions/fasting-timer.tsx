"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Square, UtensilsCrossed, Moon, Sparkles, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { apiFetch } from "@/lib/api";
import { PexelsVideo } from "@/components/ui/pexels-video";
import { NextPracticeCta } from "./next-practice-cta";

// Eating-window presets the user can pick before starting. Fasting window is
// always 24 - eating. 16:8 stays the default because it's the most common
// intermittent-fasting pattern.
const PRESETS = [
  { eatingHours: 6,  label: "18:6",  blurb: "Intensive — longer cellular cleanup" },
  { eatingHours: 8,  label: "16:8",  blurb: "Standard — most popular pattern" },
  { eatingHours: 10, label: "14:10", blurb: "Gentle — easier on social meals" },
  { eatingHours: 12, label: "12:12", blurb: "Starter — modest overnight fast" },
] as const;
type Preset = (typeof PRESETS)[number];
const DEFAULT_PRESET: Preset = PRESETS[1];

const STORAGE_KEY = "fasting-session-v1";
const SESSION_PILLAR = "nutrition-fasting";

// CEO voice cues for fasting milestones. Empty src silently skipped.
const VOICE = {
  fastStart:    "/audio/fasting/start.mp3",
  fastMidway:   "/audio/fasting/midway.mp3",
  fastComplete: "/audio/fasting/complete.mp3",
  eatStart:     "/audio/fasting/eat-start.mp3",
};

type StoredSession = {
  startTime: number;
  isFasting: boolean;
  // Older sessions predate presets — eatingHours may be missing, in which
  // case we fall back to the default (16:8) on hydrate.
  eatingHours?: number;
};

export function FastingTimer() {
  const [isFasting, setIsFasting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [targetHit, setTargetHit] = useState(false);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [preset, setPreset] = useState<Preset>(DEFAULT_PRESET);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const targetHitFiredRef = useRef(false);
  const midwayFiredRef = useRef(false);
  const checkinFiredRef = useRef(false);

  const playVoice = useCallback((src: string) => {
    if (!soundEnabled) return;
    const prev = voiceRef.current;
    if (prev) { try { prev.pause(); prev.currentTime = 0; } catch {} }
    const a = new Audio(src);
    a.volume = 0.9;
    a.play().catch(() => {});
    voiceRef.current = a;
  }, [soundEnabled]);

  const fastingHours = 24 - preset.eatingHours;
  const targetSeconds = isFasting
    ? fastingHours * 3600
    : preset.eatingHours * 3600;
  const progress = targetSeconds > 0 ? Math.min(elapsedSeconds / targetSeconds, 1) : 0;

  // SVG parameters
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      // Three-note ascending arpeggio so the user hears it through a closed door.
      [528, 660, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.25);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.25);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.25 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + 1.5);
        osc.start(ctx.currentTime + i * 0.25);
        osc.stop(ctx.currentTime + i * 0.25 + 1.6);
      });
    } catch {}
  }, [soundEnabled]);

  // Hydrate from localStorage on mount — fixes the "page reload eats my
  // 14-hour fast" bug. Day-scope key not used because a fast can legitimately
  // cross midnight.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredSession = JSON.parse(raw);
        if (parsed.startTime) {
          setStartTime(parsed.startTime);
          setIsFasting(!!parsed.isFasting);
          setIsRunning(true);
          setElapsedSeconds(Math.floor((Date.now() - parsed.startTime) / 1000));
          const stored = PRESETS.find((p) => p.eatingHours === parsed.eatingHours);
          if (stored) setPreset(stored);
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isRunning || !startTime) return;

    const interval = setInterval(() => {
      const next = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(next);
      // Fire the halfway cue exactly once when we cross 50% of the target.
      if (
        isFasting &&
        !midwayFiredRef.current &&
        next >= targetSeconds / 2 &&
        next < targetSeconds
      ) {
        midwayFiredRef.current = true;
        playVoice(VOICE.fastMidway);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime, isFasting, targetSeconds, playVoice]);

  // Fire the completion chime + record the check-in exactly once when the
  // user crosses the target threshold. Re-renders after that don't refire.
  useEffect(() => {
    if (!isRunning) return;
    if (elapsedSeconds < targetSeconds) return;
    if (targetHitFiredRef.current) return;
    targetHitFiredRef.current = true;
    setTargetHit(true);
    playChime();
    playVoice(isFasting ? VOICE.fastComplete : VOICE.eatStart);

    // Best-effort browser notification — silently skipped if denied/unsupported.
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(isFasting ? "Fast complete!" : "Eating window closed", {
            body: isFasting
              ? `You completed a ${fastingHours}-hour fast.`
              : `Your ${preset.eatingHours}-hour eating window is over.`,
          });
        }
      }
    } catch {}

    // Only fasting (not the eating window) maps to the nutrition pillar.
    if (isFasting && !checkinFiredRef.current) {
      checkinFiredRef.current = true;
      apiFetch("/data/checkin", {
        method: "POST",
        body: JSON.stringify({ pillarSlug: SESSION_PILLAR }),
      })
        .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
        .catch(() => {});
    }
  }, [elapsedSeconds, targetSeconds, isRunning, isFasting, fastingHours, preset.eatingHours, playChime, playVoice]);

  const startSession = useCallback(
    (fasting: boolean) => {
      const now = Date.now();
      setIsFasting(fasting);
      setStartTime(now);
      setElapsedSeconds(0);
      setIsRunning(true);
      setTargetHit(false);
      setKarmaAwarded(null);
      targetHitFiredRef.current = false;
      midwayFiredRef.current = false;
      checkinFiredRef.current = false;
      playVoice(fasting ? VOICE.fastStart : VOICE.eatStart);

      // Persist immediately so a page reload right after start still works.
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            startTime: now,
            isFasting: fasting,
            eatingHours: preset.eatingHours,
          } satisfies StoredSession),
        );
      } catch {}

      // Politely ask for notification permission on first start — we use it
      // to ping the user when the fast completes (often while asleep).
      try {
        if (typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission === "default") void Notification.requestPermission();
        }
      } catch {}
    },
    [playVoice, preset.eatingHours]
  );

  const stopSession = useCallback(() => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setTargetHit(false);
    setKarmaAwarded(null);
    targetHitFiredRef.current = false;
    midwayFiredRef.current = false;
    checkinFiredRef.current = false;
    const a = voiceRef.current;
    if (a) { try { a.pause(); a.currentTime = 0; } catch {} voiceRef.current = null; }
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const formatDuration = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatClockTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const remaining = Math.max(0, targetSeconds - elapsedSeconds);
  const endTime = startTime ? startTime + targetSeconds * 1000 : null;

  // While we're hydrating from localStorage, render a stable shell so the
  // server-rendered markup matches.
  if (!hydrated) {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        <div className="w-[280px] h-[280px] rounded-full bg-gray-100/40 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-8 py-8 rounded-3xl overflow-hidden">
      {/* Candle-flame backdrop while the fast is active — the digestive fire metaphor. */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-1000",
          isRunning && isFasting ? "opacity-30" : "opacity-10",
        )}
      >
        <PexelsVideo
          slug={isFasting || !isRunning ? "candle-flame" : "nature-flow"}
          showAttribution={false}
          className="w-full h-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/35 to-white/75 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full">

      {/* Preset selector — only changeable when no session is active. The
          active preset drives `targetSeconds` for the ring + the completion
          notification, and is persisted alongside the session in localStorage. */}
      {!isRunning && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Eating window
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setPreset(p)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all",
                  preset.eatingHours === p.eatingHours
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-lg shadow-orange-500/25"
                    : "bg-white text-gray-700 border-gray-200 hover:border-amber-400"
                )}
                aria-pressed={preset.eatingHours === p.eatingHours}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center max-w-xs">
            {preset.blurb}
          </p>
        </div>
      )}

      {/* Mode toggle (only when not running) */}
      {!isRunning && (
        <div className="flex gap-3">
          <Button
            size="lg"
            onClick={() => startSession(true)}
            className="min-w-[160px]"
          >
            <Moon className="w-5 h-5 mr-2" />
            Start Fasting
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => startSession(false)}
            className="min-w-[160px]"
          >
            <UtensilsCrossed className="w-5 h-5 mr-2" />
            Start Eating
          </Button>
        </div>
      )}

      {/* Circular progress */}
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-2xl transition-all duration-1000",
            targetHit
              ? "bg-amber-400/30 animate-pulse"
              : isRunning
                ? isFasting
                  ? "bg-orange-500/15"
                  : "bg-green-500/15"
                : "bg-gray-300/5"
          )}
          style={{ transform: "scale(1.3)" }}
        />

        <svg
          width="280"
          height="280"
          className="relative transform -rotate-90"
        >
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="8"
            opacity="0.3"
          />
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke={
              targetHit
                ? "url(#completeGradient)"
                : isFasting
                  ? "url(#fastingGradient)"
                  : "url(#eatingGradient)"
            }
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient
              id="fastingGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="100%" stopColor="#E8860D" />
            </linearGradient>
            <linearGradient
              id="eatingGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient
              id="completeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {targetHit ? (
            <>
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-amber-600">
                {isFasting ? "Fast Complete" : "Window Closed"}
              </span>
              <span className="text-3xl font-bold text-[var(--color-text-primary)] tabular-nums mt-1">
                {formatDuration(elapsedSeconds)}
              </span>
              {karmaAwarded !== null && karmaAwarded > 0 && (
                <span className="text-xs text-amber-600 font-medium mt-1">
                  +{karmaAwarded} karma earned
                </span>
              )}
            </>
          ) : isRunning ? (
            <>
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                  isFasting
                    ? "bg-orange-100 text-orange-600"
                    : "bg-green-100 text-green-600"
                )}
              >
                {isFasting ? (
                  <Moon className="w-6 h-6" />
                ) : (
                  <UtensilsCrossed className="w-6 h-6" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-semibold uppercase tracking-wider",
                  isFasting ? "text-orange-600" : "text-green-600"
                )}
              >
                {isFasting ? "Fasting" : "Eating Window"}
              </span>
              <span className="text-3xl font-bold text-[var(--color-text-primary)] tabular-nums mt-1">
                {formatDuration(elapsedSeconds)}
              </span>
            </>
          ) : (
            <>
              <span className="text-lg text-[var(--color-text-secondary)]">
                {preset.label} Protocol
              </span>
              <span className="text-sm text-[var(--color-text-secondary)] mt-1">
                Tap to begin
              </span>
            </>
          )}
        </div>
      </div>

      {/* Time details */}
      {isRunning && (
        <div className="grid grid-cols-3 gap-6 text-center w-full max-w-md">
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Started
            </p>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">
              {startTime ? formatClockTime(startTime) : "--"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {targetHit ? "Overtime" : "Remaining"}
            </p>
            <p className="text-lg font-semibold text-[var(--color-text-primary)] tabular-nums">
              {targetHit
                ? formatDuration(elapsedSeconds - targetSeconds)
                : formatDuration(remaining)}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {isFasting ? "Break Fast" : "End Time"}
            </p>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">
              {endTime ? formatClockTime(endTime) : "--"}
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      {isRunning && (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={stopSession}
            className="min-w-[160px]"
          >
            <Square className="w-5 h-5 mr-2" />
            {targetHit ? "Finish" : "Stop Timer"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setSoundEnabled((s) => !s)}
            aria-label={soundEnabled ? "Mute alerts" : "Unmute alerts"}
            title={soundEnabled ? "Alerts on" : "Alerts off"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      )}

      {/* Next-practice CTA once the fasting target has been hit and the
          check-in fired. Only the fasting target awards a pillar credit
          (eating window does not), so the CTA only renders when fasting. */}
      {targetHit && isFasting && karmaAwarded !== null && (
        <div className="mt-2">
          <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
        </div>
      )}

      {/* Info */}
      <div className="text-center text-sm text-[var(--color-text-secondary)] max-w-md">
        <p className="font-medium mb-1">{preset.label} Intermittent Fasting</p>
        <p>
          Fast for {fastingHours} hours, eat within a {preset.eatingHours}-hour window.
          This pattern supports cellular repair, mental clarity, and metabolic health.
        </p>
      </div>

      </div>
    </div>
  );
}
