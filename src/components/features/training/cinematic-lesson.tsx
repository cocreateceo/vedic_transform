"use client";

// Lazy click-to-play YouTube embed for a chapter's documentary lesson.
// Renders the video thumbnail until tapped so chapter pages stay fast.

import { useState } from "react";
import { Play } from "lucide-react";

export function CinematicLesson({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-[#0C0F22] shadow-2xl shadow-black/30">
      {!playing ? (
        <button
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full cursor-pointer"
          aria-label={`Play: ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail host */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
              <Play className="ml-1 h-8 w-8 text-amber-600" fill="currentColor" />
            </span>
          </div>
          <div className="absolute bottom-4 left-5 right-5 text-left">
            <p className="text-lg font-semibold text-white drop-shadow-lg">
              {title}
            </p>
            <p className="mt-1 text-sm text-white/80">
              Watch the cinematic lesson
            </p>
          </div>
        </button>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}
