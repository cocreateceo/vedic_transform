"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Volume2 } from "lucide-react";

interface WisdomReadAloudProps {
  text: string;
  sanskrit?: string | null;
  source?: string;
}

// Mirror the constants from useVoiceCue so wisdom plays at the same pace
// (XTTS-rendered intro speeds up, browser TTS reads the actual quote).
const PLAYBACK_RATE = 1.56;
const VOICE_VOLUME = 0.95;
const AMBIENT_SRC = "/audio/om-ambient-loop.mp3";
const AMBIENT_VOLUME = 0.22;

/**
 * "Listen" for the daily wisdom card. Two-phase playback because wisdom
 * rotates daily and we can't pre-render 365 unique CEO-voice MP3s:
 *
 *   Phase 1: Pre-rendered CEO intro cue ("Here is today's wisdom...")
 *   Phase 2: Browser SpeechSynthesis reads the actual quote text
 *
 * A soft Om loop plays under both phases so the card feels like a real
 * guided wisdom moment instead of a dry TTS button.
 */
export function WisdomReadAloud({ text, sanskrit, source }: WisdomReadAloudProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const introRef = useRef<HTMLAudioElement | null>(null);
  const omRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopOm = useCallback(() => {
    const a = omRef.current;
    if (a) { try { a.pause(); a.currentTime = 0; } catch {} omRef.current = null; }
  }, []);

  const stop = useCallback(() => {
    const a = introRef.current;
    if (a) { try { a.pause(); a.currentTime = 0; } catch {} introRef.current = null; }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch {}
    }
    utteranceRef.current = null;
    stopOm();
    setIsPlaying(false);
  }, [stopOm]);

  useEffect(() => () => stop(), [stop]);

  const speakText = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      stopOm();
      setIsPlaying(false);
      return;
    }
    const parts = [text];
    if (sanskrit) parts.push(sanskrit);
    if (source) parts.push(`— ${source}`);
    const utter = new SpeechSynthesisUtterance(parts.join(". "));
    utter.rate = 0.9 * PLAYBACK_RATE;
    utter.pitch = 1.0;
    utter.volume = VOICE_VOLUME;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => /Neural|Natural/i.test(v.name) && /en-IN|en-US|en-GB/.test(v.lang))
      ?? voices.find((v) => /female/i.test(v.name))
      ?? voices.find((v) => /^en/.test(v.lang));
    if (preferred) utter.voice = preferred;
    utter.onend = () => { stopOm(); setIsPlaying(false); };
    utter.onerror = () => { stopOm(); setIsPlaying(false); };
    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [text, sanskrit, source, stopOm]);

  const startCue = useCallback(() => {
    stop();
    // Start Om backdrop first.
    const om = new Audio(AMBIENT_SRC);
    om.loop = true;
    om.volume = AMBIENT_VOLUME;
    omRef.current = om;
    om.play().catch(() => {});

    // Then play the CEO intro; when it ends, hand off to SpeechSynthesis.
    const intro = new Audio("/audio/wisdom/intro.mp3");
    intro.volume = VOICE_VOLUME;
    intro.playbackRate = PLAYBACK_RATE;
    type WithPitch = HTMLAudioElement & { preservesPitch?: boolean };
    (intro as WithPitch).preservesPitch = true;
    intro.onended = speakText;
    intro.onerror = speakText;
    intro.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay blocked or intro missing — go straight to SpeechSynthesis.
        speakText();
        setIsPlaying(true);
      });
    introRef.current = intro;
  }, [stop, speakText]);

  // Autoplay once per session on the wisdom page.
  useEffect(() => {
    const PLAYED_KEY = "vt:wisdom:played";
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(PLAYED_KEY)) return;
    startCue();
    try { window.sessionStorage.setItem(PLAYED_KEY, "1"); } catch {}
    // Cleanup is handled by the unmount effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Button
      onClick={isPlaying ? stop : startCue}
      size="sm"
      variant="outline"
      className="inline-flex items-center gap-2"
    >
      {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      {isPlaying ? "Stop" : "Listen"}
      <Volume2 className="w-4 h-4 opacity-60" />
    </Button>
  );
}
