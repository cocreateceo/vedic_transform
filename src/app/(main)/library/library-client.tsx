"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SERIF_CLASS } from "@/lib/fonts";
import { Mandala, LotusDivider } from "@/components/features/training/intro/mandala";
import { apiFetch } from "@/lib/api";
import { CONTENT_LIBRARY, type ContentItem } from "@/data/content-library";
import { POSTERS, type Poster } from "@/data/posters";
import { MANTRAS, type Mantra } from "@/data/mantras";
import { PILLARS } from "@/constants/pillars";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAudioPlayer } from "@/context/audio-player-context";
import { MantraIntroButton } from "@/components/features/library/mantra-intro-button";
import { PosterCard } from "@/components/features/posters/poster-card";
import { PosterModal } from "@/components/features/posters/poster-modal";
import { MantraCard } from "@/components/features/mantras/mantra-card";
import { MantraModal } from "@/components/features/mantras/mantra-modal";
import { VideoModal, youtubeIdFromUrl } from "@/components/features/library/video-modal";
import {
  Search,
  CheckCircle2,
  Video,
  Headphones,
  FileText,
  BookOpen,
  ExternalLink,
  Play,
  Pause,
} from "lucide-react";

interface ContentProgressRecord {
  id: string;
  userId: string;
  contentId: string;
  completed: boolean;
  progress: number;
  lastAccessedAt: Date | string | null;
}

interface LibraryPageClientProps {
  initialProgress: ContentProgressRecord[];
}

type CategoryFilter = "all" | "body" | "mind" | "spirit";
type TypeFilter = "all" | "video" | "audio" | "article" | "guide" | "poster" | "mantra";

const CATEGORY_TABS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "body", label: "Body" },
  { value: "mind", label: "Mind" },
  { value: "spirit", label: "Spirit" },
];

const TYPE_TABS: { value: TypeFilter; label: string; icon: string }[] = [
  { value: "all", label: "All Types", icon: "" },
  { value: "audio", label: "Audio", icon: "" },
  { value: "video", label: "Video", icon: "" },
  { value: "article", label: "Articles", icon: "" },
  { value: "guide", label: "Guides", icon: "" },
  { value: "poster", label: "Posters", icon: "" },
  { value: "mantra", label: "Mantras", icon: "" },
];

// One calm chip style for every content type — identity comes from the icon
// and label, not from a rainbow of badge colors.
const TYPE_CONFIG: Record<ContentItem["type"], { icon: typeof Video; label: string }> = {
  video: { icon: Video, label: "Video" },
  audio: { icon: Headphones, label: "Audio" },
  article: { icon: FileText, label: "Article" },
  guide: { icon: BookOpen, label: "Guide" },
};

function getPillarName(item: ContentItem): string {
  // Exact slug match only — the fuzzy `includes()` fallback was papering
  // over mismatches like `morning-routine` vs `morning-initiation`. The
  // content library now uses canonical pillar slugs from src/constants/pillars.ts.
  const pillar = PILLARS.find((p) => p.slug === item.pillarSlug);
  return pillar?.name || item.pillarSlug;
}

export function LibraryPageClient({ initialProgress }: LibraryPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [activeType, setActiveType] = useState<TypeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [progressMap, setProgressMap] = useState<Map<string, ContentProgressRecord>>(() => {
    const map = new Map<string, ContentProgressRecord>();
    for (const p of initialProgress) {
      map.set(p.contentId, p);
    }
    return map;
  });
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [posterModalSlug, setPosterModalSlug] = useState<Poster | null>(null);
  const [mantraModal, setMantraModal] = useState<Mantra | null>(null);
  const [videoModal, setVideoModal] = useState<{ videoId: string; title: string } | null>(null);

  const router = useRouter();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudioPlayer();

  // Are we showing posters / mantras instead of content-library items?
  const isPosterMode = activeType === "poster";
  const isMantraMode = activeType === "mantra";

  const filteredPosters = useMemo(() => {
    if (!isPosterMode) return [];
    let items = POSTERS;
    if (activeCategory !== "all") items = items.filter((p) => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((p) => {
        const hay = [
          p.title,
          p.concept,
          p.tagline ?? "",
          ...p.sections.flatMap((s) => [s.title, s.body, ...(s.bullets ?? [])]),
          ...p.scripture.flatMap((s) => [s.sutra, s.translation, s.sanskrit ?? ""]),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }
    return items;
  }, [isPosterMode, activeCategory, searchQuery]);

  const filteredMantras = useMemo(() => {
    if (!isMantraMode) return [];
    const q = searchQuery.trim().toLowerCase();
    return MANTRAS.filter((m) => {
      if (!q) return true;
      const hay = [
        m.title,
        m.sanskritName,
        m.devata,
        m.meaningOneLine,
        m.context,
        m.whenToChant,
        m.text.iast,
        m.text.english,
        m.category,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [isMantraMode, searchQuery]);

  const filteredContent = useMemo(() => {
    if (isPosterMode || isMantraMode) return [];
    let items = CONTENT_LIBRARY;

    if (activeCategory !== "all") {
      items = items.filter((item) => item.category === activeCategory);
    }

    if (activeType !== "all") {
      items = items.filter((item) => item.type === activeType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    return items;
  }, [isPosterMode, isMantraMode, activeCategory, activeType, searchQuery]);

  const stats = useMemo(() => {
    const total = CONTENT_LIBRARY.length;
    const completed = Array.from(progressMap.values()).filter((p) => p.completed).length;
    const audioCount = CONTENT_LIBRARY.filter((i) => i.audioUrl).length;
    return { total, completed, audioCount };
  }, [progressMap]);

  const handleOpenContent = useCallback(
    async (item: ContentItem) => {
      // If it has an audio URL, play in-app
      if (item.audioUrl) {
        if (currentTrack?.id === item.id) {
          togglePlay();
        } else {
          playTrack({
            id: item.id,
            title: item.title,
            duration: item.duration,
            url: item.audioUrl,
            category: item.category,
          });
        }
      } else if (item.url.startsWith("/")) {
        // Internal article/guide route — navigate in-app rather than opening
        // a new tab. External URLs still open in a new tab below.
        router.push(item.url);
      } else if (item.type === "video" && youtubeIdFromUrl(item.url)) {
        // YouTube video — play inline in a lightbox instead of a new tab.
        setVideoModal({ videoId: youtubeIdFromUrl(item.url)!, title: item.title });
      } else if (item.url && item.url !== "#") {
        // Other off-site reading — open in a new tab.
        window.open(item.url, "_blank", "noopener,noreferrer");
      }

      // Mark as accessed via API
      setLoadingIds((prev) => new Set(prev).add(item.id));
      try {
        const existing = progressMap.get(item.id);
        const updated = await apiFetch("/data/content-progress", {
          method: "POST",
          body: JSON.stringify({
            contentId: item.id,
            completed: existing?.completed || false,
            progress: existing?.progress || 0,
          }),
        });
        if (updated) {
          setProgressMap((prev) => {
            const next = new Map(prev);
            next.set(item.id, updated);
            return next;
          });
        }
      } catch {
        // Silently fail - content still opened
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }
    },
    [progressMap, currentTrack, playTrack, togglePlay, router]
  );

  const handleToggleComplete = useCallback(
    async (item: ContentItem) => {
      const existing = progressMap.get(item.id);
      const newCompleted = !existing?.completed;

      setLoadingIds((prev) => new Set(prev).add(item.id));
      try {
        const updated = await apiFetch("/data/content-progress", {
          method: "POST",
          body: JSON.stringify({
            contentId: item.id,
            completed: newCompleted,
            progress: newCompleted ? 100 : existing?.progress || 0,
          }),
        });
        if (updated) {
          setProgressMap((prev) => {
            const next = new Map(prev);
            next.set(item.id, updated);
            return next;
          });
        }
      } catch {
        // Silently fail
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }
    },
    [progressMap]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Masthead */}
      <header className="pt-4 pb-2 text-center space-y-3">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#DAA520]/40 bg-[var(--color-bg-surface)]">
          <Mandala className="h-12 w-12 text-[#B8860B] opacity-80" />
        </span>
        <h1 className="text-4xl sm:text-5xl text-[var(--color-text-primary)]">
          The 10x Vedic Library
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
          Guided wisdom for body, mind, and spirit.
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {stats.total} pieces · {stats.audioCount} with in-app audio ·{" "}
          {stats.completed} completed by you
        </p>
        <LotusDivider className="pt-2" />
      </header>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <Input
              placeholder="What do you need today: calm, energy, clarity…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === tab.value
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20"
                    : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:border-[#DAA520]/60 border border-[var(--color-border)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveType(tab.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeType === tab.value
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:border-[#DAA520]/50 border border-[var(--color-border)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Poster grid — shown when the Posters type tab is active */}
      {isPosterMode && (
        <>
          {filteredPosters.length === 0 ? (
            <Card variant="elevated" className="text-center py-12">
              <CardContent>
                <p className="text-[var(--color-text-secondary)]">
                  No posters match your filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPosters.map((p) => (
                <PosterCard key={p.slug} poster={p} onOpen={setPosterModalSlug} />
              ))}
            </div>
          )}
          {posterModalSlug && (
            <PosterModal poster={posterModalSlug} onClose={() => setPosterModalSlug(null)} />
          )}
        </>
      )}

      {/* Mantra grid — shown when the Mantras type tab is active */}
      {isMantraMode && (
        <>
          {filteredMantras.length === 0 ? (
            <Card variant="elevated" className="text-center py-12">
              <CardContent>
                <p className="text-[var(--color-text-secondary)]">
                  No mantras match your search.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMantras.map((m) => (
                <MantraCard key={m.slug} mantra={m} onOpen={setMantraModal} />
              ))}
            </div>
          )}
          {mantraModal && (
            <MantraModal mantra={mantraModal} onClose={() => setMantraModal(null)} />
          )}
        </>
      )}

      {/* Content Grid — content-library items (audio/video/article/guide) */}
      {!isPosterMode && !isMantraMode && filteredContent.length === 0 ? (
        <Card variant="elevated" className="text-center py-12">
          <CardContent>
            <p className="text-[var(--color-text-secondary)]">
              No content found matching your search.
            </p>
          </CardContent>
        </Card>
      ) : !isPosterMode && !isMantraMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => {
            const isCompleted = progressMap.get(item.id)?.completed || false;
            const isLoading = loadingIds.has(item.id);
            const typeConfig = TYPE_CONFIG[item.type];
            const TypeIcon = typeConfig.icon;
            const isCurrentlyPlaying = currentTrack?.id === item.id && isPlaying;
            const isCurrentTrack = currentTrack?.id === item.id;
            const hasAudio = !!item.audioUrl;

            return (
              <Card
                key={item.id}
                variant="elevated"
                className={`relative overflow-hidden p-0 flex flex-col ${
                  isCurrentTrack ? "ring-2 ring-amber-400/50" : ""
                }`}
              >
                {/* Editorial image header — category pill rides the image */}
                {item.thumbnail && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={item.thumbnail}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#FFF9F0]/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8B6914]">
                      {item.category}
                    </span>
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Type chip and completion indicator */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[#DAA520]/40 bg-[var(--color-card-bg)] text-[#8B6914]">
                      <TypeIcon className="w-3.5 h-3.5" />
                      {typeConfig.label}
                      {!item.thumbnail && (
                        <span className="capitalize text-[var(--color-text-muted)]">
                          · {item.category}
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {hasAudio && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
                          <Headphones className="w-3 h-3" />
                          In-App
                        </span>
                      )}
                      {isCompleted && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className={`${SERIF_CLASS} text-xl font-semibold leading-snug text-[var(--color-text-primary)] mb-1`}
                  >
                    {item.title}
                  </h3>

                  {/* Pillar name and duration */}
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-3">
                    <span>{getPillarName(item)}</span>
                    <span className="text-[var(--color-border)]">|</span>
                    <span>{item.duration}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 mb-4 flex-1">
                    {item.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-auto">
                    {hasAudio ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleOpenContent(item)}
                        disabled={isLoading}
                        className={`flex-1 ${isCurrentlyPlaying ? "animate-pulse" : ""}`}
                      >
                        {isCurrentlyPlaying ? (
                          <>
                            <Pause className="w-4 h-4 mr-1.5" />
                            Playing...
                          </>
                        ) : isCurrentTrack ? (
                          <>
                            <Play className="w-4 h-4 mr-1.5" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1.5" />
                            Play
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleOpenContent(item)}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {item.type === "video" ? (
                          <>
                            <Play className="w-4 h-4 mr-1.5" />
                            Play
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-1.5" />
                            Open
                          </>
                        )}
                      </Button>
                    )}
                    {item.id.startsWith("mantra-") && (
                      <MantraIntroButton itemId={item.id} />
                    )}
                    <Button
                      size="sm"
                      variant={isCompleted ? "secondary" : "outline"}
                      onClick={() => handleToggleComplete(item)}
                      disabled={isLoading}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}

      {videoModal && (
        <VideoModal
          videoId={videoModal.videoId}
          title={videoModal.title}
          onClose={() => setVideoModal(null)}
        />
      )}
    </div>
  );
}
