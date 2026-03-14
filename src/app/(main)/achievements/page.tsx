"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Award, Star, Trophy, Flame, Target, Sparkles } from "lucide-react";

interface BadgeWithEarned {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  karmaBonus: number;
  earned: boolean;
  earnedAt?: string;
}

function parseBadgeCategory(requirement: string): string {
  try {
    const parsed = JSON.parse(requirement);
    return parsed.type || "special";
  } catch {
    if (requirement.toLowerCase().includes("streak")) return "streak";
    if (requirement.toLowerCase().includes("milestone")) return "milestone";
    if (requirement.toLowerCase().includes("master")) return "mastery";
    return "special";
  }
}

const CATEGORY_META: Record<
  string,
  { label: string; icon: typeof Award; color: string }
> = {
  streak: { label: "Streak Badges", icon: Flame, color: "text-orange-400" },
  milestone: { label: "Milestone Badges", icon: Target, color: "text-blue-400" },
  mastery: { label: "Mastery Badges", icon: Star, color: "text-amber-400" },
  special: { label: "Special Badges", icon: Sparkles, color: "text-purple-400" },
};

export default function AchievementsPage() {
  const [badgesWithStatus, setBadgesWithStatus] = useState<BadgeWithEarned[]>([]);
  const [totalKarma, setTotalKarma] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/data/achievements")
      .then((res) => {
        setBadgesWithStatus(res?.badges || []);
        setTotalKarma(res?.totalKarma || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Group by category
  const grouped: Record<string, BadgeWithEarned[]> = {};
  for (const badge of badgesWithStatus) {
    const cat = parseBadgeCategory(badge.requirement);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(badge);
  }

  const earnedCount = badgesWithStatus.filter((b) => b.earned).length;
  const totalCount = badgesWithStatus.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <Trophy className="h-8 w-8 text-[var(--color-secondary)]" />
          Achievements
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Your badges and karma on the transformation path
        </p>
      </div>

      {/* Summary Bar */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-around gap-6">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-[var(--color-primary)]" />
            <span className="text-3xl font-bold text-[var(--color-text-primary)]">
              {earnedCount}
            </span>
            <span className="text-lg text-[var(--color-text-muted)]">
              / {totalCount}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Badges Earned
          </p>
        </div>

        <div className="hidden sm:block w-px h-12 bg-[var(--color-border)]" />

        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-[var(--color-secondary)]" />
            <span className="text-3xl font-bold text-gold-gradient text-[var(--color-text-primary)]">
              {totalKarma.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Total Karma Points
          </p>
        </div>

        <div className="hidden sm:block w-px h-12 bg-[var(--color-border)]" />

        <div className="text-center space-y-1">
          <div className="w-full max-w-[120px] h-3 rounded-full bg-[var(--color-card-bg)] border border-[var(--color-border)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%`,
                background: "var(--color-purple-gradient)",
              }}
            />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {totalCount > 0
              ? Math.round((earnedCount / totalCount) * 100)
              : 0}
            % Complete
          </p>
        </div>
      </div>

      {/* Badge Grid by Category */}
      {Object.entries(CATEGORY_META).map(([category, meta]) => {
        const badges = grouped[category];
        if (!badges || badges.length === 0) return null;
        const CategoryIcon = meta.icon;

        return (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
              <CategoryIcon className={`h-5 w-5 ${meta.color}`} />
              {meta.label}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`relative rounded-2xl p-4 text-center space-y-2 transition-all ${
                    badge.earned
                      ? "glass-card border-2 border-[var(--color-primary)]/40 shadow-lg shadow-[var(--color-primary)]/10"
                      : "bg-[var(--color-card-bg)] border border-[var(--color-border)] opacity-50 grayscale"
                  }`}
                >
                  <div
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                      badge.earned
                        ? "bg-[var(--color-primary)]/15"
                        : "bg-[var(--color-card-bg)]"
                    }`}
                  >
                    <Award
                      className={`h-7 w-7 ${
                        badge.earned
                          ? "text-[var(--color-secondary)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    />
                  </div>

                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-1">
                    {badge.name}
                  </h3>

                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
                    {badge.description}
                  </p>

                  {badge.earned && badge.earnedAt && (
                    <p className="text-[10px] text-[var(--color-primary)] font-medium">
                      Earned{" "}
                      {new Date(badge.earnedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  {badge.karmaBonus > 0 && badge.earned && (
                    <span className="absolute -top-2 -right-2 flex items-center gap-0.5 rounded-full bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)]/40 px-2 py-0.5 text-[10px] font-bold text-[var(--color-secondary)]">
                      +{badge.karmaBonus}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {totalCount === 0 && (
        <div className="glass-card p-8 text-center space-y-2">
          <Trophy className="h-12 w-12 mx-auto text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-secondary)]">
            No badges available yet. Keep up your transformation journey!
          </p>
        </div>
      )}
    </div>
  );
}
