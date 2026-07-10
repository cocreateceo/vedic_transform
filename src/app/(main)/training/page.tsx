"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Lock,
  Mail,
  Video,
} from "lucide-react";
import {
  TRAINING_CHAPTERS,
  getPublishedChapters,
  getTrainingChapterBySlug,
  trainingContentId,
} from "@/data/training-book";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

interface ProgressRecord {
  contentId: string;
  completed: boolean;
}

export default function TrainingPage() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    apiFetch("/data/content-progress")
      .then((res) => {
        const records = (res?.progress || []) as ProgressRecord[];
        setCompletedIds(
          new Set(records.filter((r) => r.completed).map((r) => r.contentId))
        );
      })
      .catch(() => {}); // progress is an enhancement, never a blocker
  }, []);

  const published = getPublishedChapters();
  const completedCount = published.filter((c) =>
    completedIds.has(trainingContentId(c.slug))
  ).length;
  const pct =
    published.length > 0
      ? Math.round((completedCount / published.length) * 100)
      : 0;

  return (
    <div className="max-w-3xl lg:max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <header className="vedic-card relative overflow-hidden p-6 sm:p-8 space-y-4">
        <video
          src="/training-media/ambient-copper-1.mp4"
          poster={getTrainingChapterBySlug("introduction")?.image}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F0]/85 to-white/90" />
        <div className="relative z-10 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border bg-amber-100 text-amber-700 border-amber-200">
            <GraduationCap className="w-3 h-3" />
            Training Course
          </span>
        </div>
        <h1 className="relative z-10 text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] leading-tight">
          10x Vedic
        </h1>
        <p className="relative z-10 text-base text-[var(--color-text-secondary)] leading-relaxed">
          Ancient Wisdom. Conscious Leadership. Science-Powered Transformation.
          A 48-day practical framework for living, leading, healing, creating,
          and scaling life from higher awareness.
        </p>

        {/* Course progress */}
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <span>
              {completedCount} of {published.length} available chapters
              completed
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </header>

      {/* Chapter list */}
      <section className="space-y-3">
        {TRAINING_CHAPTERS.map((chapter) => {
          const label =
            chapter.number === 0
              ? "Introduction"
              : `Chapter ${chapter.number}`;
          const isPublished = chapter.status === "published";
          const isComplete = completedIds.has(
            trainingContentId(chapter.slug)
          );

          if (!isPublished) {
            return (
              <div
                key={chapter.slug}
                className="vedic-card p-4 sm:p-5 opacity-60"
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0 w-24 h-[54px] rounded-lg overflow-hidden opacity-50 grayscale-[30%]">
                    <Image
                      src={chapter.image}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Lock className="w-4 h-4 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                      {label} · Coming soon
                    </p>
                    <h2 className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)]">
                      {chapter.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                      {chapter.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={chapter.slug}
              href={`/training/${chapter.slug}`}
              className="vedic-card p-4 sm:p-5 block hover:border-[#DAA520] transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0 w-24 h-[54px] rounded-lg overflow-hidden">
                  <Image
                    src={chapter.image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                  <span
                    className={cn(
                      "absolute bottom-1 right-1 w-6 h-6 rounded-lg flex items-center justify-center shadow",
                      isComplete
                        ? "bg-green-50 text-green-600"
                        : "bg-gradient-to-br from-orange-500 to-amber-500 text-white"
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <BookOpen className="w-3 h-3" />
                    )}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                    {label}
                    {isComplete && " · Completed"}
                  </p>
                  <h2 className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                    {chapter.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                    {chapter.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Live classes placeholder */}
      <section className="vedic-card p-6 sm:p-8 space-y-3 bg-gradient-to-br from-orange-50 to-amber-50">
        <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)]">
          <Video className="w-5 h-5 text-[var(--color-primary)]" />
          Live Classes
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Live guided classes for each chapter are coming soon — group
          sessions, Q&amp;A, and practice together. Register your interest and
          we&apos;ll let you know when enrollment opens.
        </p>
        <a
          href="mailto:support@10xvedic.com?subject=10x%20Vedic%20Live%20Classes%20%E2%80%94%20Register%20Interest"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
        >
          <Mail className="w-4 h-4" />
          Register interest
        </a>
      </section>
    </div>
  );
}
