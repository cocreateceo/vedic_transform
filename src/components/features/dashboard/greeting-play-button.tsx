"use client";

import { Play, Square, Volume2 } from "lucide-react";
import { useVoiceCue } from "@/lib/hooks/use-voice-cue";

/**
 * Compact play/stop button in the dashboard welcome banner that plays a
 * short CEO-voice greeting cue with the Om ambient backdrop. White-on-
 * translucent styling so it sits well on the saffron banner.
 *
 * Greeting autoplays once per browser session (gated by sessionStorage)
 * so users don't get re-greeted on every tab switch / remount.
 */
export function GreetingPlayButton() {
  const { isPlaying, toggle } = useVoiceCue({
    src: "/audio/dashboard/greeting.mp3",
    autoplay: true,
    ambient: true,
    autoplayOnceKey: "vt:dashboard:greeting:played",
  });

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
