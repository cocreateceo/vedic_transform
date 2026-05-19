"use client";

import { useEffect, useRef } from "react";
import manifest from "@/../public/videos/pexels/manifest.json";
import { cn } from "@/lib/utils/cn";

type VideoEntry = {
  query: string;
  duration: number;
  width: number;
  height: number;
  file_width: number;
  file_height: number;
  photographer: string;
  photographer_url: string;
  pexels_url: string;
  poster: string;
};

const KNOWN: Record<string, VideoEntry> = manifest as Record<string, VideoEntry>;

interface PexelsVideoProps {
  /** Slug from scripts/pexels-video-manifest.json */
  slug: string;
  /** Show photographer attribution caption (default true) */
  showAttribution?: boolean;
  /** Mute & autoplay (required for autoplay on most browsers). Default true. */
  muted?: boolean;
  className?: string;
}

/**
 * Renders a Pexels-sourced video clip that was pre-downloaded by
 * scripts/pexels-fetch.mjs into public/videos/pexels/. Auto-plays muted +
 * looped by default so it can act as an ambient hero background. Falls
 * back gracefully if the slug is missing.
 */
export function PexelsVideo({ slug, showAttribution = true, muted = true, className }: PexelsVideoProps) {
  const entry = KNOWN[slug];
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Some browsers (Safari) refuse to autoplay until the element is visible;
  // nudge play() on mount once attributes are set. Skip entirely if the user
  // has prefers-reduced-motion enabled — the poster image stays as a still.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    v.play().catch(() => {});
  }, []);

  if (!entry) {
    return (
      <div className={cn(
        "bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl flex items-center justify-center text-xs text-orange-700",
        className,
      )}>
        Missing video: {slug}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <video
        ref={videoRef}
        autoPlay
        muted={muted}
        loop
        playsInline
        poster={entry.poster}
        className="w-full h-full object-cover"
        aria-label={entry.query}
      >
        <source src={`/videos/pexels/${slug}.mp4`} type="video/mp4" />
      </video>
      {showAttribution && (
        <div className="absolute bottom-1 right-2 text-[10px] text-white/70 bg-black/30 backdrop-blur rounded px-1.5 py-0.5">
          Video by{" "}
          <a href={entry.photographer_url} target="_blank" rel="noreferrer" className="underline">
            {entry.photographer}
          </a>{" "}
          on{" "}
          <a href={entry.pexels_url} target="_blank" rel="noreferrer" className="underline">
            Pexels
          </a>
        </div>
      )}
    </div>
  );
}
