"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { apiFetch } from "@/lib/api";

const SESSION_PILLAR = "healing-meditation";

const DURATION_OPTIONS = [5, 10, 15, 20, 30];
// Tambura-like ambient drone: A2 + A3 + perfect fifth E3, slightly detuned
// for natural beating. Gain held very low so it sits behind everything.
const DRONE_FREQS = [110, 165, 220];
const DRONE_GAIN = 0.06;
// Bell rung at each interval to mark the passage of time without
// requiring the user to keep looking at the screen.
const INTERVAL_BELL_SECONDS = 60;
const BELL_FREQ = 528;

export function MeditationTimer() {
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscillatorsRef = useRef<OscillatorNode[]>([]);
  const droneGainRef = useRef<GainNode | null>(null);
  const checkinFiredRef = useRef(false);

  const totalSeconds = selectedDuration * 60;
  const elapsed = totalSeconds - timeRemaining;
  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;

  // SVG circle parameters
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const ensureAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new AudioContext();
      } catch {
        return null;
      }
    }
    return audioCtxRef.current;
  }, []);

  const playBell = useCallback(
    (freq = BELL_FREQ, durationSec = 2, gain = 0.3) => {
      const ctx = ensureAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationSec);
    },
    [ensureAudioCtx],
  );

  // Start the sustained ambient drone for the duration of the session.
  // Fades in over 3s so it doesn't startle, fades out over 2s on stop.
  const startDrone = useCallback(() => {
    const ctx = ensureAudioCtx();
    if (!ctx || droneOscillatorsRef.current.length > 0) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(DRONE_GAIN, ctx.currentTime + 3);
    masterGain.connect(ctx.destination);
    droneGainRef.current = masterGain;

    const oscs = DRONE_FREQS.map((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      // Slight detune in cents — gives a richer, more organic drone.
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.detune.setValueAtTime(i === 0 ? 0 : i === 1 ? -3 : 4, ctx.currentTime);
      osc.connect(masterGain);
      osc.start(ctx.currentTime);
      return osc;
    });
    droneOscillatorsRef.current = oscs;
  }, [ensureAudioCtx]);

  const stopDrone = useCallback(() => {
    const ctx = audioCtxRef.current;
    const gain = droneGainRef.current;
    if (!ctx || !gain) return;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 1.5);
    droneOscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop(now + 1.6);
      } catch {}
    });
    droneOscillatorsRef.current = [];
    droneGainRef.current = null;
  }, []);

  const playChime = useCallback(() => playBell(BELL_FREQ, 2.5, 0.35), [playBell]);

  const reset = useCallback(() => {
    setIsActive(false);
    setIsComplete(false);
    setTimeRemaining(selectedDuration * 60);
    setKarmaAwarded(null);
    checkinFiredRef.current = false;
  }, [selectedDuration]);

  // Credit the user's pillar check-in when the timer naturally completes.
  // Server-side same-day dedupe means re-running the timer is safe.
  useEffect(() => {
    if (!isComplete || checkinFiredRef.current) return;
    checkinFiredRef.current = true;
    apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({ pillarSlug: SESSION_PILLAR }),
    })
      .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
      .catch(() => {});
  }, [isComplete]);

  const selectDuration = useCallback(
    (mins: number) => {
      if (isActive) return;
      setSelectedDuration(mins);
      setTimeRemaining(mins * 60);
      setIsComplete(false);
    },
    [isActive]
  );

  useEffect(() => {
    if (!isActive || isComplete) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          setIsComplete(true);
          if (soundEnabled) playChime();
          return 0;
        }
        const next = prev - 1;
        // Ring an interval bell every INTERVAL_BELL_SECONDS, but never
        // at the very end (the completion chime handles that).
        const elapsedSec = selectedDuration * 60 - next;
        if (
          soundEnabled &&
          elapsedSec > 0 &&
          elapsedSec % INTERVAL_BELL_SECONDS === 0 &&
          next > 1
        ) {
          playBell(BELL_FREQ, 1.5, 0.18);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isComplete, playChime, playBell, soundEnabled, selectedDuration]);

  // Start / stop the drone whenever the active state flips.
  useEffect(() => {
    if (isActive && soundEnabled) {
      startDrone();
    } else {
      stopDrone();
    }
    return () => stopDrone();
  }, [isActive, soundEnabled, startDrone, stopDrone]);

  const toggleTimer = () => {
    if (isComplete) {
      reset();
      return;
    }
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center gap-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <div className="text-center text-white">
              <Sparkles className="w-12 h-12 mx-auto mb-3" />
              <p className="text-2xl font-bold">Namaste</p>
              <p className="text-amber-100 text-sm mt-1">Session Complete</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Well Done!
          </h3>
          <p className="text-[var(--color-text-secondary)] mt-2">
            You meditated for {selectedDuration} minutes. Your mind is clearer
            and more focused.
          </p>
          {karmaAwarded !== null && karmaAwarded > 0 && (
            <p className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              +{karmaAwarded} karma earned
            </p>
          )}
          {karmaAwarded === 0 && (
            <p className="text-xs text-gray-500 mt-3">
              Already checked in today — your meditation is recorded.
            </p>
          )}
        </div>
        <Button size="lg" onClick={reset}>
          <RotateCcw className="w-5 h-5 mr-2" />
          New Session
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Duration selector */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {DURATION_OPTIONS.map((mins) => (
          <button
            key={mins}
            onClick={() => selectDuration(mins)}
            disabled={isActive}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              selectedDuration === mins
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                : "bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] hover:bg-orange-50 border border-[var(--color-border)]",
              isActive && "opacity-50 cursor-not-allowed"
            )}
          >
            {mins} min
          </button>
        ))}
      </div>

      {/* Circular progress ring */}
      <div className="relative">
        {/* Ambient glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-2xl transition-all duration-1000",
            isActive ? "bg-orange-500/15" : "bg-orange-500/5"
          )}
          style={{ transform: "scale(1.3)" }}
        />

        <svg
          width="280"
          height="280"
          className="relative transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="8"
            opacity="0.3"
          />
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>

        {/* Timer display in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-[var(--color-text-primary)] tabular-nums">
            {formatTime(timeRemaining)}
          </span>
          <span className="text-sm text-[var(--color-text-secondary)] mt-2">
            {isActive ? "Meditating..." : "Ready"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={reset}
          disabled={elapsed === 0}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button
          size="lg"
          onClick={toggleTimer}
          className={cn("min-w-[140px]", isActive && "bg-red-500 hover:bg-red-600")}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              {elapsed > 0 ? "Resume" : "Start"}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setSoundEnabled((s) => !s)}
          aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
          title={soundEnabled ? "Audio on" : "Audio off"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </div>

      {/* Guidance text */}
      <p className="text-center text-sm text-[var(--color-text-secondary)] max-w-md">
        Find a comfortable position. Close your eyes and focus on your breath.
        Let thoughts pass without judgment.
      </p>
    </div>
  );
}
