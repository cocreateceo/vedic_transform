"use client";

import { useState, useMemo, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { CONTENT_LIBRARY, type ContentItem } from "@/data/content-library";
import { PILLARS } from "@/constants/pillars";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCircle2,
  Video,
  Headphones,
  FileText,
  BookOpen,
  ExternalLink,
  Library,
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

const CATEGORY_TABS: { value: CategoryFilter; label: string; color: string }[] = [
  { value: "all", label: "All", color: "from-orange-500 to-amber-500" },
  { value: "body", label: "Body", color: "from-orange-500 to-red-500" },
  { value: "mind", label: "Mind", color: "from-cyan-500 to-blue-500" },
  { value: "spirit", label: "Spirit", color: "from-amber-500 to-yellow-500" },
];

const TYPE_CONFIG: Record<ContentItem["type"], { icon: typeof Video; label: string; color: string }> = {
  video: { icon: Video, label: "Video", color: "bg-red-100 text-red-700" },
  audio: { icon: Headphones, label: "Audio", color: "bg-blue-100 text-blue-700" },
  article: { icon: FileText, label: "Article", color: "bg-green-100 text-green-700" },
  guide: { icon: BookOpen, label: "Guide", color: "bg-amber-100 text-amber-700" },
};

const CATEGORY_BORDER_COLORS: Record<string, string> = {
  body: "border-t-orange-500",
  mind: "border-t-cyan-500",
  spirit: "border-t-amber-500",
};

function getPillarName(item: ContentItem): string {
  const pillar = PILLARS.find(
    (p) =>
      p.slug === item.pillarSlug ||
      item.pillarSlug.includes(p.slug) ||
      p.slug.includes(item.pillarSlug)
  );
  return pillar?.name || item.pillarSlug;
}

export function LibraryPageClient({ initialProgress }: LibraryPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [progressMap, setProgressMap] = useState<Map<string, ContentProgressRecord>>(() => {
    const map = new Map<string, ContentProgressRecord>();
    for (const p of initialProgress) {
      map.set(p.contentId, p);
    }
    return map;
  });
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const filteredContent = useMemo(() => {
    let items = CONTENT_LIBRARY;

    if (activeCategory !== "all") {
      items = items.filter((item) => item.category === activeCategory);
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
  }, [activeCategory, searchQuery]);

  const stats = useMemo(() => {
    const total = CONTENT_LIBRARY.length;
    const completed = Array.from(progressMap.values()).filter((p) => p.completed).length;
    return { total, completed };
  }, [progressMap]);

  const handleOpenContent = useCallback(
    async (item: ContentItem) => {
      // Open in new tab
      window.open(item.url, "_blank", "noopener,noreferrer");

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
    [progressMap]
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
      {/* Header */}
      <div className="vedic-card p-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Library className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold">Content Library</h1>
            </div>
            <p className="text-orange-100">
              Explore guided content for your transformation journey
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">
              {stats.completed}/{stats.total} Completed
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search content..."
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
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === tab.value
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] border border-[var(--color-border)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {filteredContent.length === 0 ? (
        <Card variant="elevated" className="text-center py-12">
          <CardContent>
            <p className="text-[var(--color-text-secondary)]">
              No content found matching your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => {
            const isCompleted = progressMap.get(item.id)?.completed || false;
            const isLoading = loadingIds.has(item.id);
            const typeConfig = TYPE_CONFIG[item.type];
            const TypeIcon = typeConfig.icon;
            const borderColor = CATEGORY_BORDER_COLORS[item.category] || "border-t-gray-500";

            return (
              <Card
                key={item.id}
                variant="elevated"
                className={`relative overflow-hidden border-t-4 ${borderColor} p-0 flex flex-col`}
              >
                <div className="p-5 flex-1 flex flex-col">
                  {/* Type badge and completion indicator */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${typeConfig.color}`}
                    >
                      <TypeIcon className="w-3.5 h-3.5" />
                      {typeConfig.label}
                    </span>
                    {isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
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
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleOpenContent(item)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-1.5" />
                      Open
                    </Button>
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
      )}
    </div>
  );
}
