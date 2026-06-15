"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cuesToFire, type Cue } from "@/lib/audio/cue-engine";

interface GuidedAudioPlayerProps {
  /** Optional continuous background track (e.g. ambient drone or narration). */
  trackSrc?: string;
  /** Timed voice/bell cues fired against elapsed time. */
  cues?: Cue[];
  /** Session length in seconds (drives the progress bar + completion). */
  durationSeconds: number;
  onComplete?: () => void;
  title?: string;
}

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

export function GuidedAudioPlayer({
  trackSrc,
  cues = [],
  durationSeconds,
  onComplete,
  title = "Guided practice",
}: GuidedAudioPlayerProps) {
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);

  const trackRef = useRef<HTMLAudioElement | null>(null);
  const cueAudio = useRef<Map<string, HTMLAudioElement>>(new Map());
  const firedRef = useRef<Set<string>>(new Set());
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (trackSrc) {
      trackRef.current = new Audio(trackSrc);
      trackRef.current.preload = "auto";
      trackRef.current.loop = true;
    }
    for (const c of cues) {
      if (!cueAudio.current.has(c.src)) {
        const a = new Audio(c.src);
        a.preload = "auto";
        cueAudio.current.set(c.src, a);
      }
    }
    const cueMap = cueAudio.current;
    return () => {
      trackRef.current?.pause();
      cueMap.forEach((a) => a.pause());
    };
    // Intentionally run once; trackSrc/cues are treated as fixed per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (trackRef.current) trackRef.current.muted = muted;
    cueAudio.current.forEach((a) => (a.muted = muted));
  }, [muted]);

  const reset = () => {
    setIsActive(false);
    setElapsed(0);
    firedRef.current.clear();
    if (trackRef.current) {
      trackRef.current.pause();
      trackRef.current.currentTime = 0;
    }
  };

  const toggle = () => {
    if (elapsed >= durationSeconds) reset();
    const next = !isActive;
    setIsActive(next);
    if (next && trackRef.current && !muted) void trackRef.current.play().catch(() => {});
    else trackRef.current?.pause();
  };

  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => {
      setElapsed((prev) => {
        const t = prev + 0.25;
        for (const c of cuesToFire(cues, t, firedRef.current)) {
          firedRef.current.add(c.id);
          if (!muted) {
            const a = cueAudio.current.get(c.src);
            if (a) {
              try {
                a.currentTime = 0;
                void a.play().catch(() => {});
              } catch {}
            }
          }
        }
        if (t >= durationSeconds) {
          setIsActive(false);
          trackRef.current?.pause();
          onCompleteRef.current?.();
          return durationSeconds;
        }
        return t;
      });
    }, 250);
    return () => clearInterval(id);
  }, [isActive, cues, durationSeconds, muted]);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <p className="font-medium text-[var(--color-text-primary)]">{title}</p>
      <p className="text-4xl font-bold text-gray-900">{fmt(elapsed)}</p>
      <div className="w-full max-w-md h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-200"
          style={{ width: `${(elapsed / durationSeconds) * 100}%` }}
        />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="lg" onClick={reset} disabled={elapsed === 0} aria-label="Reset">
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button size="lg" onClick={toggle} className="min-w-[140px]">
          {isActive ? <><Pause className="w-5 h-5 mr-2" />Pause</> : <><Play className="w-5 h-5 mr-2" />{elapsed > 0 ? "Resume" : "Start"}</>}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
