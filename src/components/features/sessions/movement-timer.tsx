"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Trophy, Volume2, VolumeX, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { apiFetch } from "@/lib/api";
import { PexelsVideo } from "@/components/ui/pexels-video";
import { NextPracticeCta } from "./next-practice-cta";
import { MoodCheck, moodLabel, type MoodValue } from "./mood-check";
import { SessionIntro } from "./session-intro";
import { SESSION_INTROS } from "./session-intros";
import { MOVEMENT_EXERCISES, exerciseForRound } from "./movement-exercises";

const SESSION_PILLAR = "movement";

const VOICE = {
  start:    "/audio/movement/start.mp3",
  work:     "/audio/movement/work.mp3",
  rest:     "/audio/movement/rest.mp3",
  final:    "/audio/movement/final.mp3",
  complete: "/audio/movement/complete.mp3",
};

export function MovementTimer() {
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(10);
  const [totalRounds, setTotalRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<"idle" | "work" | "rest" | "complete">(
    "idle"
  );
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const [moodBefore, setMoodBefore] = useState<MoodValue | null>(null);
  const [moodAfter, setMoodAfter] = useState<MoodValue | null>(null);
  const [sealed, setSealed] = useState(false);
  const [started, setStarted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
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

  const playCue = useCallback(
    (kind: "work" | "rest" | "finale") => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
        const ctx = audioCtxRef.current;
        // work: rising tone (motivating push), rest: falling tone (recover),
        // finale: ascending three-note arpeggio.
        const freqs =
          kind === "work" ? [330, 660] :
          kind === "rest" ? [660, 330] :
          [528, 660, 880];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          const t = ctx.currentTime + i * (kind === "finale" ? 0.2 : 0.12);
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.3, t + 0.04);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            t + (kind === "finale" ? 1.2 : 0.18),
          );
          osc.start(t);
          osc.stop(t + (kind === "finale" ? 1.3 : 0.25));
        });
      } catch {}
    },
    [soundEnabled],
  );

  const phaseDuration = phase === "work" ? workTime : restTime;

  // During work, demo the current round's exercise; during rest, preview the
  // exercise coming up in the next round.
  const demoExercise =
    phase === "rest" ? exerciseForRound(currentRound + 1) : exerciseForRound(currentRound);

  // SVG parameters
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress =
    phase === "idle" || phase === "complete"
      ? 0
      : (phaseDuration - timeRemaining) / phaseDuration;
  const strokeDashoffset = circumference * (1 - progress);

  const reset = useCallback(() => {
    setIsActive(false);
    setPhase("idle");
    setCurrentRound(1);
    setTimeRemaining(workTime);
    setKarmaAwarded(null);
    setMoodAfter(null);
    setSealed(false);
    checkinFiredRef.current = false;
  }, [workTime]);

  // Play the celebratory finale when the workout finishes; the check-in itself
  // is deferred to the Reflect step so it can carry the after-mood.
  useEffect(() => {
    if (phase !== "complete") return;
    playCue("finale");
    playVoice(VOICE.complete);
  }, [phase, playCue, playVoice]);

  // Credit fires when the user seals the session in Reflect, carrying mood
  // + the actual workout duration. Server dedupes same-day.
  const sealSession = useCallback(() => {
    if (checkinFiredRef.current) return;
    checkinFiredRef.current = true;
    setSealed(true);
    apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({
        pillarSlug: SESSION_PILLAR,
        durationMinutes: Math.max(1, Math.round((totalRounds * (workTime + restTime)) / 60)),
        moodBefore: moodLabel(moodBefore),
        moodAfter: moodLabel(moodAfter),
      }),
    })
      .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
      .catch(() => {});
  }, [totalRounds, workTime, restTime, moodBefore, moodAfter]);

  useEffect(() => {
    if (!isActive || phase === "idle" || phase === "complete") return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (phase === "work") {
            if (currentRound >= totalRounds) {
              setPhase("complete");
              setIsActive(false);
              return 0;
            }
            setPhase("rest");
            playCue("rest");
            playVoice(VOICE.rest);
            return restTime;
          } else {
            // rest -> next work round
            const nextRound = currentRound + 1;
            setCurrentRound(nextRound);
            setPhase("work");
            playCue("work");
            // Special voice cue on the last round; otherwise the regular work cue.
            playVoice(nextRound === totalRounds ? VOICE.final : VOICE.work);
            return workTime;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, currentRound, totalRounds, workTime, restTime, playCue, playVoice]);

  const startTimer = () => {
    if (phase === "idle" || phase === "complete") {
      setPhase("work");
      setCurrentRound(1);
      setTimeRemaining(workTime);
      playCue("work");
      // Opening cue once at session start, then queue the first "Work" cue
      // about 4s later so they don't overlap.
      playVoice(VOICE.start);
      setTimeout(() => playVoice(VOICE.work), 4000);
    }
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const adjustValue = (
    setter: (fn: (v: number) => number) => void,
    delta: number,
    min: number,
    max: number
  ) => {
    if (isActive) return;
    setter((v: number) => Math.max(min, Math.min(max, v + delta)));
  };

  if (!started) {
    return <SessionIntro {...SESSION_INTROS.movement} onBegin={() => setStarted(true)} />;
  }

  if (phase === "complete") {
    return (
      <div className="flex flex-col items-center gap-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <Trophy className="w-16 h-16 text-white" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Workout Complete!
          </h3>
          <p className="text-[var(--color-text-secondary)] mt-2">
            You crushed {totalRounds} rounds. Stay consistent, stay strong.
          </p>
        </div>

        {!sealed ? (
          <div className="flex flex-col items-center gap-5">
            <MoodCheck
              value={moodAfter}
              onChange={setMoodAfter}
              prompt="How's your energy now?"
            />
            <Button size="lg" onClick={sealSession} className="min-w-[200px]">
              <Sparkles className="w-4 h-4 mr-2" />
              Seal this session
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {moodBefore && moodAfter && (
              <p className="text-[var(--color-text-secondary)]">
                You moved from{" "}
                <span className="font-semibold text-[var(--color-text-primary)]">{moodLabel(moodBefore)}</span>{" "}
                to{" "}
                <span className="font-semibold text-amber-600">{moodLabel(moodAfter)}</span>.
              </p>
            )}
            {karmaAwarded !== null && karmaAwarded > 0 && (
              <p className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                +{karmaAwarded} karma earned
              </p>
            )}
            {karmaAwarded === 0 && (
              <p className="text-xs text-gray-500">
                Already checked in today — your workout is recorded.
              </p>
            )}
            <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New workout
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-8 py-8 rounded-3xl overflow-hidden">
      {/* Yoga-silhouette backdrop. Brighter during work, dim during rest/idle. */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-1000",
          phase === "work" ? "opacity-30" : "opacity-12",
        )}
      >
        <PexelsVideo slug="movement-ambient" showAttribution={false} className="w-full h-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/35 to-white/75 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full">

      {/* Configuration (only when idle) */}
      {phase === "idle" && (
        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Work time */}
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              Work (sec)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustValue(setWorkTime, -5, 10, 120)}
                className="w-8 h-8 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-orange-50 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-bold text-[var(--color-text-primary)] w-12 text-center tabular-nums">
                {workTime}
              </span>
              <button
                onClick={() => adjustValue(setWorkTime, 5, 10, 120)}
                className="w-8 h-8 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-orange-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Rest time */}
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              Rest (sec)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustValue(setRestTime, -5, 5, 60)}
                className="w-8 h-8 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-orange-50 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-bold text-[var(--color-text-primary)] w-12 text-center tabular-nums">
                {restTime}
              </span>
              <button
                onClick={() => adjustValue(setRestTime, 5, 5, 60)}
                className="w-8 h-8 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-orange-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Rounds */}
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              Rounds
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustValue(setTotalRounds, -1, 1, 20)}
                className="w-8 h-8 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-orange-50 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-bold text-[var(--color-text-primary)] w-12 text-center tabular-nums">
                {totalRounds}
              </span>
              <button
                onClick={() => adjustValue(setTotalRounds, 1, 1, 20)}
                className="w-8 h-8 rounded-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-orange-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Before-mood — captured once, while idle */}
      {phase === "idle" && (
        <MoodCheck
          value={moodBefore}
          onChange={setMoodBefore}
          prompt="Before you begin — how's your energy?"
        />
      )}

      {/* Circuit preview — what you'll cycle through */}
      {phase === "idle" && (
        <div className="w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2 text-center">
            Your circuit · {totalRounds} {totalRounds === 1 ? "round" : "rounds"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {MOVEMENT_EXERCISES.map((ex, i) => (
              <div
                key={ex.name}
                className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-2"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{ex.name}</p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] truncate">{ex.target}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-center text-[var(--color-text-secondary)] mt-2">
            One exercise per round; the circuit repeats if you set more rounds.
          </p>
        </div>
      )}

      {/* Live exercise demo — current move during work, next move during rest */}
      {(phase === "work" || phase === "rest") && (
        <div className="w-full max-w-md">
          <div className="relative h-44 rounded-2xl overflow-hidden">
            <PexelsVideo slug={demoExercise.demoSlug} showAttribution={false} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <span
                className={cn(
                  "text-[11px] font-semibold uppercase tracking-widest",
                  phase === "rest" ? "text-green-300" : "text-orange-300",
                )}
              >
                {phase === "rest" ? "Next up" : `Round ${currentRound} · now`}
              </span>
              <p className="text-xl font-bold text-white leading-tight">{demoExercise.name}</p>
              <p className="text-xs text-white/80">{demoExercise.target}</p>
            </div>
          </div>
          <p className="text-sm text-center text-[var(--color-text-secondary)] mt-2">
            {demoExercise.cue}
          </p>
        </div>
      )}

      {/* Main timer display */}
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-2xl transition-all duration-500",
            phase === "work" ? "bg-orange-500/15" : phase === "rest" ? "bg-green-500/15" : "bg-gray-300/5"
          )}
          style={{ transform: "scale(1.3)" }}
        />

        <svg
          width="260"
          height="260"
          className="relative transform -rotate-90"
        >
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="8"
            opacity="0.3"
          />
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke={
              phase === "work"
                ? "url(#workGradient)"
                : phase === "rest"
                  ? "url(#restGradient)"
                  : "var(--color-border)"
            }
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient
              id="workGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="100%" stopColor="#E8860D" />
            </linearGradient>
            <linearGradient
              id="restGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "text-sm font-semibold uppercase tracking-wider",
              phase === "work"
                ? "text-orange-600"
                : phase === "rest"
                  ? "text-green-600"
                  : "text-[var(--color-text-secondary)]"
            )}
          >
            {phase === "idle" ? "Ready" : phase === "work" ? "Work" : "Rest"}
          </span>
          <span className="text-5xl font-bold text-[var(--color-text-primary)] tabular-nums mt-1">
            {timeRemaining}
          </span>
          <span className="text-sm text-[var(--color-text-secondary)] mt-2">
            {phase !== "idle"
              ? `Round ${currentRound} / ${totalRounds}`
              : `${totalRounds} rounds`}
          </span>
        </div>
      </div>

      {/* Round indicators */}
      {phase !== "idle" && (
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalRounds }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                i < currentRound - 1
                  ? "bg-orange-500"
                  : i === currentRound - 1
                    ? phase === "work"
                      ? "bg-orange-500 animate-pulse"
                      : "bg-green-500 animate-pulse"
                    : "bg-[var(--color-border)]"
              )}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {(phase === "work" || phase === "rest") && (
          <Button variant="outline" size="lg" onClick={reset}>
            <RotateCcw className="w-5 h-5" />
          </Button>
        )}
        <Button
          size="lg"
          onClick={isActive ? pauseTimer : startTimer}
          className={cn(
            "min-w-[140px]",
            isActive && phase === "work" && "bg-red-500 hover:bg-red-600"
          )}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              {phase === "idle" ? "Start" : "Resume"}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setSoundEnabled((s) => !s)}
          aria-label={soundEnabled ? "Mute cues" : "Unmute cues"}
          title={soundEnabled ? "Audio cues on" : "Audio cues off"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </div>

      {/* Info */}
      <p className="text-center text-sm text-[var(--color-text-secondary)] max-w-md">
        High-intensity interval training. Push hard during work phases, recover
        during rest. Modify the intervals to match your fitness level.
      </p>

      </div>
    </div>
  );
}
