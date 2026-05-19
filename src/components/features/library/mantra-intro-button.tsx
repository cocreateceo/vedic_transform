"use client";

import { Volume2, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceCue } from "@/lib/hooks/use-voice-cue";

/**
 * Small "Learn" button on each mantra library card. Plays a short CEO-
 * voice cue explaining how to chant the mantra and its meaning, with the
 * usual soft Om backdrop. Does NOT autoplay — the user clicks to learn.
 *
 * The cue MP3 lives at /audio/library/<itemId>.mp3 (e.g.
 * /audio/library/mantra-gayatri.mp3). If the file is missing for a given
 * id the click silently no-ops — the catalog of cues is curated, not
 * one-per-item generically.
 */
export function MantraIntroButton({ itemId }: { itemId: string }) {
  const { isPlaying, toggle } = useVoiceCue({
    src: `/audio/library/${itemId}.mp3`,
    autoplay: false,
    ambient: true,
  });

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={toggle}
      title={isPlaying ? "Stop pronunciation guide" : "Hear pronunciation & meaning"}
      className="inline-flex items-center gap-1"
    >
      {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      <Volume2 className="w-3.5 h-3.5 opacity-70" />
      <span className="hidden sm:inline ml-1">{isPlaying ? "Stop" : "Learn"}</span>
    </Button>
  );
}
