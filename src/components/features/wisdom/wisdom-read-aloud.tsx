"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Volume2 } from "lucide-react";

interface WisdomReadAloudProps {
  text: string;
  sanskrit?: string | null;
  source?: string;
}

/**
 * "Listen" button for the daily wisdom card. Plays a short CEO-voice intro
 * cue, then uses the browser's SpeechSynthesis to read the actual wisdom
 * text — wisdom rotates daily so we can't pre-render 365 unique MP3s.
 */
export function WisdomReadAloud({ text, sanskrit, source }: WisdomReadAloudProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (a) { try { a.pause(); a.currentTime = 0; } catch {} audioRef.current = null; }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch {}
    }
    utteranceRef.current = null;
    setIsPlaying(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  // Autoplay the wisdom on first visit to /wisdom each session. Once-per-
  // session gate prevents re-firing on every revisit.
  useEffect(() => {
    const PLAYED_KEY = "vt:wisdom:played";
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(PLAYED_KEY)) return;
    if (!window.speechSynthesis) return;

    let started = false;
    const speakText = () => {
      if (!window.speechSynthesis) return;
      const parts = [text];
      if (sanskrit) parts.push(sanskrit);
      if (source) parts.push(`— ${source}`);
      const utter = new SpeechSynthesisUtterance(parts.join(". "));
      utter.rate = 0.9;
      utter.pitch = 1.0;
      utter.volume = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) => /Neural|Natural/i.test(v.name) && /en-IN|en-US|en-GB/.test(v.lang))
        ?? voices.find((v) => /female/i.test(v.name))
        ?? voices.find((v) => /^en/.test(v.lang));
      if (preferred) utter.voice = preferred;
      utter.onend = () => setIsPlaying(false);
      utter.onerror = () => setIsPlaying(false);
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
    };

    const intro = new Audio("/audio/wisdom/intro.mp3");
    intro.volume = 0.9;
    intro.onended = speakText;
    intro.onerror = speakText;
    intro.play()
      .then(() => {
        started = true;
        setIsPlaying(true);
        try { window.sessionStorage.setItem(PLAYED_KEY, "1"); } catch {}
      })
      .catch(() => { /* autoplay blocked — Listen button still works */ });
    audioRef.current = intro;
    return () => {
      if (!started) return;
      try { intro.pause(); intro.currentTime = 0; } catch {}
    };
  }, [text, sanskrit, source]);

  const play = useCallback(() => {
    if (isPlaying) { stop(); return; }
    if (typeof window === "undefined") return;

    const speakText = () => {
      if (!window.speechSynthesis) { setIsPlaying(false); return; }
      const parts = [text];
      if (sanskrit) parts.push(sanskrit);
      if (source) parts.push(`— ${source}`);
      const utter = new SpeechSynthesisUtterance(parts.join(". "));
      utter.rate = 0.9;
      utter.pitch = 1.0;
      utter.volume = 0.95;
      // Prefer a calmer Indian-English voice if available.
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) => /Neural|Natural/i.test(v.name) && /en-IN|en-US|en-GB/.test(v.lang))
        ?? voices.find((v) => /female/i.test(v.name))
        ?? voices.find((v) => /^en/.test(v.lang));
      if (preferred) utter.voice = preferred;
      utter.onend = () => setIsPlaying(false);
      utter.onerror = () => setIsPlaying(false);
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
    };

    // CEO intro first, then browser-TTS reads the actual quote.
    const intro = new Audio("/audio/wisdom/intro.mp3");
    intro.volume = 0.9;
    intro.onended = speakText;
    intro.onerror = speakText; // fall through if the intro file is missing
    intro.play().catch(speakText);
    audioRef.current = intro;
    setIsPlaying(true);
  }, [isPlaying, stop, text, sanskrit, source]);

  return (
    <Button onClick={play} size="sm" variant="outline" className="inline-flex items-center gap-2">
      {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      {isPlaying ? "Stop" : "Listen"}
      <Volume2 className="w-4 h-4 opacity-60" />
    </Button>
  );
}
