"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { POSTERS, type Poster, type PosterCategory } from "@/data/posters";
import { PosterCard } from "@/components/features/posters/poster-card";
import { PosterModal } from "@/components/features/posters/poster-modal";

type CategoryFilter = "all" | PosterCategory;

const CATEGORY_TABS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "body", label: "Body" },
  { value: "mind", label: "Mind" },
  { value: "spirit", label: "Spirit" },
];

function matchesQuery(poster: Poster, q: string): boolean {
  if (!q) return true;
  const haystack = [
    poster.title,
    poster.concept,
    poster.tagline ?? "",
    ...poster.sections.flatMap((s) => [s.title, s.body, ...(s.bullets ?? [])]),
    ...poster.scripture.flatMap((s) => [s.sutra, s.translation, s.sanskrit ?? ""]),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q.toLowerCase());
}

export function PostersGallery() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Poster | null>(null);

  const filtered = useMemo(() => {
    return POSTERS.filter((p) => (category === "all" || p.category === category) && matchesQuery(p, query));
  }, [category, query]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Teaching Posters</h1>
        <p className="text-gray-500 mt-1">
          Vedic infographics rooted in Patanjali&apos;s Yoga Sutras and Ayurveda.
        </p>
      </header>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setCategory(tab.value)}
              className={
                category === tab.value
                  ? "px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                  : "px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posters by topic, sutra, or concept"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No posters match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <PosterCard key={p.slug} poster={p} onOpen={setOpen} />
          ))}
        </div>
      )}

      {open && <PosterModal poster={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
