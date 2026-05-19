"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared hook for playing CEO-voice cues across the app. Handles three
 * things consistently for every voice surface:
 *
 *  1. **Playback speed** — XTTS cues were rendered at speed 0.80 (slow
 *     meditation pace). The user wanted them at YouTube's 1.25 pace, so
 *     we set `audio.playbackRate = 1.56` (1.25 / 0.80) in the browser
 *     rather than re-render the whole catalog at the new speed. Modern
 *     browsers also support `preservesPitch` to keep the voice from
 *     sounding chipmunk-like.
 *
 *  2. **Ambient Om backdrop** — when a voice cue plays, a soft 10 s Om
 *     loop fades in at low volume so the experience feels like a real
 *     guided meditation rather than a dry TTS announcement. Loop stops
 *     when the voice ends.
 *
 *  3. **Autoplay-or-not** — exposed via `autoplay` option. When true,
 *     `play()` runs once on mount. Browsers grant a brief user-activation
 *     window after navigation clicks, so first-page autoplays usually
 *     succeed.
 *
 * Caller still controls when to invoke `play()` (e.g. when a user clicks
 * a Replay button) and gets back `isPlaying` for UI state.
 */
interface UseVoiceCueOptions {
  src: string;
  /** Set true to attempt autoplay once on mount. Default false. */
  autoplay?: boolean;
  /** Add a backing Om chant loop while voice plays. Default true. */
  ambient?: boolean;
  /** Override session-storage key to gate autoplay once per session. */
  autoplayOnceKey?: string;
}

const PLAYBACK_RATE = 1.56;   // 1.25 (target) / 0.80 (XTTS render speed)
const AMBIENT_OM_SRC = "/audio/om-ambient-loop.mp3";
const AMBIENT_VOLUME = 0.22;
const VOICE_VOLUME = 0.95;

export function useVoiceCue({ src, autoplay = false, ambient = true, autoplayOnceKey }: UseVoiceCueOptions) {
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const omRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stopAmbient = useCallback(() => {
    const a = omRef.current;
    if (a) {
      try { a.pause(); a.currentTime = 0; } catch {}
      omRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    const v = voiceRef.current;
    if (v) {
      try { v.pause(); v.currentTime = 0; } catch {}
      voiceRef.current = null;
    }
    stopAmbient();
    setIsPlaying(false);
  }, [stopAmbient]);

  const play = useCallback(() => {
    // Tear down any previous cue first so we never overlap.
    stop();

    const voice = new Audio(src);
    voice.volume = VOICE_VOLUME;
    voice.playbackRate = PLAYBACK_RATE;
    // `preservesPitch` is supported on Chrome/Edge/Firefox/Safari modern.
    // Falls back silently on older browsers (mild chipmunk effect).
    type WithPitch = HTMLAudioElement & {
      preservesPitch?: boolean;
      mozPreservesPitch?: boolean;
      webkitPreservesPitch?: boolean;
    };
    const vp = voice as WithPitch;
    vp.preservesPitch = true;
    vp.mozPreservesPitch = true;
    vp.webkitPreservesPitch = true;

    voice.onended = () => {
      stopAmbient();
      setIsPlaying(false);
    };
    voice.onerror = () => {
      stopAmbient();
      setIsPlaying(false);
    };
    voiceRef.current = voice;

    // Optional Om background — soft, looped, mixed under the voice.
    let om: HTMLAudioElement | null = null;
    if (ambient) {
      om = new Audio(AMBIENT_OM_SRC);
      om.loop = true;
      om.volume = AMBIENT_VOLUME;
      omRef.current = om;
    }

    // Start both together. We start Om first since some browsers refuse
    // a second concurrent audio start in the same tick — the voice play()
    // succeeding is what matters.
    if (om) om.play().catch(() => { /* ambient blocked — voice still plays */ });
    voice.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        stopAmbient();
        setIsPlaying(false);
      });
  }, [src, ambient, stop, stopAmbient]);

  // Optional autoplay on mount. Use the per-session gate if a key is given.
  useEffect(() => {
    if (!autoplay) return;
    if (autoplayOnceKey && typeof window !== "undefined") {
      if (window.sessionStorage.getItem(autoplayOnceKey)) return;
      try { window.sessionStorage.setItem(autoplayOnceKey, "1"); } catch {}
    }
    play();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, autoplay]);

  // Always tear down on unmount.
  useEffect(() => () => stop(), [stop]);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else play();
  }, [isPlaying, play, stop]);

  return { isPlaying, play, stop, toggle };
}
