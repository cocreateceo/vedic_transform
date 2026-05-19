"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square, Volume2 } from "lucide-react";

/**
 * Compact play/stop button in the dashboard welcome banner that plays a
 * short CEO-voice greeting cue. White-on-translucent so it sits well on
 * the saffron banner.
 */
export function GreetingPlayButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      const a = audioRef.current;
      if (a) { try { a.pause(); a.currentTime = 0; } catch {} }
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (isPlaying && a) {
      try { a.pause(); a.currentTime = 0; } catch {}
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }
    const audio = new Audio("/audio/dashboard/greeting.mp3");
    audio.volume = 0.95;
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    audioRef.current = audio;
  };

  return (
    <button
      onClick={toggle}
      aria-label={isPlaying ? "Stop greeting" : "Play greeting"}
      className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-3 py-2 transition-colors"
    >
      {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      <span className="text-sm font-medium hidden sm:inline">
        {isPlaying ? "Stop" : "Listen"}
      </span>
      <Volume2 className="w-4 h-4 opacity-70" />
    </button>
  );
}
