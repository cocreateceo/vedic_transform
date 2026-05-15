"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, UtensilsCrossed, Moon, Sparkles, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { apiFetch } from "@/lib/api";

const FASTING_HOURS = 16;
const EATING_HOURS = 8;
const STORAGE_KEY = "fasting-session-v1";
const SESSION_PILLAR = "nutrition-fasting";

type StoredSession = {
  startTime: number;
  isFasting: boolean;
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

  const audioCtxRef = useRef<AudioContext | null>(null);
  const targetHitFiredRef = useRef(false);
  const checkinFiredRef = useRef(false);

  const targetSeconds = isFasting
    ? FASTING_HOURS * 3600
    : EATING_HOURS * 3600;
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
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isRunning || !startTime) return;

    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  // Fire the completion chime + record the check-in exactly once when the
  // user crosses the target threshold. Re-renders after that don't refire.
  useEffect(() => {
    if (!isRunning) return;
    if (elapsedSeconds < targetSeconds) return;
    if (targetHitFiredRef.current) return;
    targetHitFiredRef.current = true;
    setTargetHit(true);
    playChime();

    // Best-effort browser notification — silently skipped if denied/unsupported.
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(isFasting ? "Fast complete!" : "Eating window closed", {
            body: isFasting
              ? `You completed a ${FASTING_HOURS}-hour fast.`
              : `Your ${EATING_HOURS}-hour eating window is over.`,
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
  }, [elapsedSeconds, targetSeconds, isRunning, isFasting, playChime]);

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
      checkinFiredRef.current = false;

      // Persist immediately so a page reload right after start still works.
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ startTime: now, isFasting: fasting } satisfies StoredSession),
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
    []
  );

  const stopSession = useCallback(() => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setTargetHit(false);
    setKarmaAwarded(null);
    targetHitFiredRef.current = false;
    checkinFiredRef.current = false;
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
    <div className="flex flex-col items-center gap-8 py-8">
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
                16:8 Protocol
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

      {/* Info */}
      <div className="text-center text-sm text-[var(--color-text-secondary)] max-w-md">
        <p className="font-medium mb-1">16:8 Intermittent Fasting</p>
        <p>
          Fast for 16 hours, eat within an 8-hour window. This pattern supports
          cellular repair, mental clarity, and metabolic health.
        </p>
      </div>
    </div>
  );
}
