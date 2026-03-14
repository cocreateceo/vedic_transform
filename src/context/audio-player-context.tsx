"use client";

import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { generateMeditationTone, getPresetConfig, stopGeneratedAudio } from "@/lib/audio-generator";

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  duration?: string;
  url: string;
  category?: string;
}

interface AudioPlayerContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  volume: number;
  playTrack: (track: AudioTrack) => void;
  togglePlay: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  isMinimized: boolean;
  setIsMinimized: (v: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isGenerated, setIsGenerated] = useState(false);
  const generatedStopRef = useRef<(() => void) | null>(null);
  const generatedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audio.volume = 0.7;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const stopGenerated = useCallback(() => {
    if (generatedStopRef.current) {
      generatedStopRef.current();
      generatedStopRef.current = null;
    }
    if (generatedTimerRef.current) {
      clearInterval(generatedTimerRef.current);
      generatedTimerRef.current = null;
    }
    setIsGenerated(false);
  }, []);

  const playGenerated = useCallback((track: AudioTrack) => {
    stopGenerated();
    const config = getPresetConfig(track.id);
    const { stop: stopFn } = generateMeditationTone(config);
    generatedStopRef.current = stopFn;
    setIsGenerated(true);
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(config.durationSeconds);
    setIsMinimized(true);

    // Simulate time progress for generated audio
    const startTime = Date.now();
    generatedTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setCurrentTime(elapsed);
      setProgress((elapsed / config.durationSeconds) * 100);
      if (elapsed >= config.durationSeconds) {
        stopGenerated();
        setIsPlaying(false);
      }
    }, 1000);
  }, [stopGenerated]);

  const playTrack = useCallback((track: AudioTrack) => {
    const audio = audioRef.current;

    // Stop any generated audio first
    stopGenerated();

    if (currentTrack?.id === track.id && !isGenerated && audio?.src) {
      audio.play();
      setIsPlaying(true);
      return;
    }

    // Try to play the URL; if it fails or is a placeholder, use generated audio
    const isPlaceholderUrl = !track.url || track.url === "#" || track.url === "generated" || track.url.startsWith("/audio/");

    if (isPlaceholderUrl) {
      playGenerated(track);
      return;
    }

    if (audio) {
      audio.src = track.url;
      audio.load();
      audio.play().catch(() => {
        // File failed to load - fallback to generated
        playGenerated(track);
      });

      // Also handle load errors
      const handleError = () => {
        playGenerated(track);
        audio.removeEventListener("error", handleError);
      };
      audio.addEventListener("error", handleError, { once: true });
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime(0);
    setIsMinimized(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id, isGenerated, stopGenerated, playGenerated]);

  const togglePlay = useCallback(() => {
    if (!currentTrack) return;

    if (isGenerated) {
      // For generated audio, stop/restart
      if (isPlaying) {
        stopGenerated();
        setIsPlaying(false);
      } else {
        playGenerated(currentTrack);
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack, isGenerated, stopGenerated, playGenerated]);

  const pause = useCallback(() => {
    if (isGenerated) {
      stopGenerated();
    } else {
      audioRef.current?.pause();
    }
    setIsPlaying(false);
  }, [isGenerated, stopGenerated]);

  const stop = useCallback(() => {
    stopGenerated();
    stopGeneratedAudio();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setProgress(0);
    setCurrentTime(0);
  }, [stopGenerated]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (audio) audio.volume = v;
    setVolumeState(v);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        currentTime,
        volume,
        playTrack,
        togglePlay,
        pause,
        stop,
        seek,
        setVolume,
        isMinimized,
        setIsMinimized,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
}
