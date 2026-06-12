"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Lightbox player for Library video items — plays the YouTube embed inline
 * instead of opening a new tab. Channel videos allow embedding, so the
 * iframe loads the player directly.
 */
export function VideoModal({
  videoId,
  title,
  onClose,
}: {
  videoId: string;
  title: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-10 right-0 text-white/80 hover:text-white"
        >
          <X className="w-7 h-7" />
        </button>
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

/** Extract an 11-char YouTube video id from a watch / youtu.be / shorts URL. */
export function youtubeIdFromUrl(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}
