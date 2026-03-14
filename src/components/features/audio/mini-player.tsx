"use client";

import { useAudioPlayer } from "@/context/audio-player-context";

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    currentTime,
    volume,
    togglePlay,
    stop,
    seek,
    setVolume,
  } = useAudioPlayer();

  if (!currentTrack) return null;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seek(pct * duration);
  };

  return (
    <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t-2 border-[#DAA520]/40 shadow-[0_-4px_20px_rgba(255,215,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Progress bar - clickable */}
        <div
          className="h-1 bg-amber-100 cursor-pointer -mx-4 px-0"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-3 py-2.5">
          {/* Track info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0 border border-[#DAA520]/30">
              {isPlaying ? (
                <div className="flex items-end gap-0.5 h-4">
                  <div className="w-1 bg-orange-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ height: "60%", animationDelay: "0ms" }} />
                  <div className="w-1 bg-orange-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ height: "100%", animationDelay: "150ms" }} />
                  <div className="w-1 bg-orange-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ height: "40%", animationDelay: "300ms" }} />
                  <div className="w-1 bg-orange-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ height: "80%", animationDelay: "450ms" }} />
                </div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{currentTrack.title}</p>
              <p className="text-xs text-gray-500">
                {formatTime(currentTime)} / {formatTime(duration)}
                {currentTrack.category && (
                  <span className="ml-2 text-amber-600 capitalize">{currentTrack.category}</span>
                )}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Volume (desktop only) */}
            <div className="hidden sm:flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center hover:from-orange-600 hover:to-amber-600 shadow-md shadow-amber-500/20 transition-all"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              )}
            </button>

            {/* Close */}
            <button
              onClick={stop}
              className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
