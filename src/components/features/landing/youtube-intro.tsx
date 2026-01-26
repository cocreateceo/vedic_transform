"use client";

import { siteConfig } from "@/config/site.config";
import { Play } from "lucide-react";
import { useState } from "react";

interface YouTubeIntroProps {
  className?: string;
}

export function YouTubeIntro({ className = "" }: YouTubeIntroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { introVideo } = siteConfig;

  // Don't render if disabled or no video ID
  if (!introVideo.enabled || !introVideo.youtubeVideoId) {
    return null;
  }

  const videoId = introVideo.youtubeVideoId;
  const autoplayParam = introVideo.autoplay ? "&autoplay=1&mute=1" : "";
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0${autoplayParam}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
        {!isPlaying ? (
          // Thumbnail with play button
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label="Play introduction video"
          >
            {/* Thumbnail Image */}
            <img
              src={thumbnailUrl}
              alt={introVideo.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to default quality if maxres not available
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg">
                <Play className="w-8 h-8 text-amber-600 ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Video Title */}
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <p className="text-white font-semibold text-lg drop-shadow-lg">
                {introVideo.title}
              </p>
              <p className="text-white/80 text-sm mt-1">
                Click to watch the introduction
              </p>
            </div>
          </button>
        ) : (
          // YouTube iframe
          <iframe
            src={embedUrl}
            title={introVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
    </div>
  );
}
