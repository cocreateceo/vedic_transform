"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Heart, Sparkles, Calendar, Check, Trash2, RotateCcw } from "lucide-react";
import { QuillGlyph } from "@/components/features/daily/page-glyphs";
import {
  parseJournalContext,
  resolveEntryTrainingContext,
} from "@/lib/journal-context";
import { markTrainingActivity } from "@/lib/training-progress";
import { cn } from "@/lib/utils/cn";

// Best-effort pillar check-in after a journal save. Same-day server dedupe
// makes this safe to call repeatedly.
async function creditPillar(slug: string) {
  try {
    await apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({ pillarSlug: slug }),
    });
  } catch {}
}

// `useSearchParams` in a statically-rendered route needs a Suspense boundary —
// without one it yields an empty set and the deep-link modes below never
// activate. (This page is prerendered, so the symptom was silent: the URL had
// ?action=gratitude and the page rendered as if it didn't.)
export default function JournalPage() {
  return (
    <Suspense fallback={<JournalSkeleton />}>
      <JournalClient />
    </Suspense>
  );
}

function JournalSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

function JournalClient() {
  // Parsed once, centrally. Nothing else on this page reads search params.
  const searchParams = useSearchParams();
  const context = parseJournalContext(searchParams);
  const gratitudeRef = useRef<HTMLDivElement | null>(null);
  const intentionRef = useRef<HTMLDivElement | null>(null);

  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [gratitudeEntries, setGratitudeEntries] = useState<any[]>([]);
  const [todayGratitude, setTodayGratitude] = useState<any>(null);
  const [todayIntention, setTodayIntention] = useState<any>(null);
  const [manifestations, setManifestations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingGratitude, setSavingGratitude] = useState(false);
  const [savingIntention, setSavingIntention] = useState(false);
  const [savingManifestation, setSavingManifestation] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const [savingReflection, setSavingReflection] = useState(false);
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [reflectionError, setReflectionError] = useState<string | null>(null);
  const [progressSynced, setProgressSynced] = useState(true);

  const fetchData = async () => {
    try {
      const data = await apiFetch("/data/journal");
      setJournalEntries(data?.journalEntries || []);
      setGratitudeEntries(data?.gratitudeEntries || []);
      setTodayGratitude(data?.todayGratitude || null);
      setTodayIntention(data?.todayIntention || null);
      setManifestations(data?.manifestations || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Revisiting a chapter's reflection loads what was written before, so
  // re-saving edits the same entry rather than starting a blank second one.
  const existingReflection =
    context.kind === "training-reflection"
      ? journalEntries.find(
          (e: any) =>
            e?.source === "training" &&
            e?.chapterSlug === context.slug &&
            (e?.promptIndex ?? null) === (context.promptIndex ?? null),
        )
      : undefined;
  const seededFor = useRef<string | null>(null);

  useEffect(() => {
    if (context.kind !== "training-reflection") return;
    const key = `${context.slug}:${context.promptIndex ?? "all"}`;
    if (seededFor.current === key) return; // never clobber live typing
    if (!existingReflection) return;
    seededFor.current = key;
    setReflectionText(existingReflection.body ?? "");
  }, [context, existingReflection]);

  // A pillar deep-link names one practice — bring it into view instead of
  // dropping the user at the top of a generic page.
  useEffect(() => {
    if (loading || context.kind !== "practice") return;
    const target =
      context.action === "gratitude" ? gratitudeRef.current : intentionRef.current;
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [loading, context]);

  // Training reflection save. The ordering is the whole point:
  //   journal persists → THEN Training progress → THEN success state.
  // If the journal write fails the activity stays incomplete. If the journal
  // write succeeds but the progress write fails, the prose is safe and only
  // the progress sync is retried — the user is never asked to rewrite.
  const handleSaveReflection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (context.kind !== "training-reflection") return;
    const prose = reflectionText.trim();
    if (!prose) return;

    setSavingReflection(true);
    setReflectionError(null);
    try {
      await apiFetch("/data/journal", {
        method: "POST",
        body: JSON.stringify({
          type: "entry",
          body: prose,
          source: "training",
          chapterSlug: context.slug,
          promptIndex: context.promptIndex,
        }),
      });
    } catch {
      // Nothing was persisted — do not touch Training progress.
      setReflectionError(
        "Couldn't save your reflection. Please try again — nothing was lost.",
      );
      setSavingReflection(false);
      return;
    }

    // Prose is safe from here on, whatever happens next.
    setReflectionSaved(true);
    await fetchData();

    const result = await markTrainingActivity({
      slug: context.slug,
      step: "reflection",
    });
    setProgressSynced(result.ok);
    setSavingReflection(false);
  };

  const retryProgressSync = async () => {
    if (context.kind !== "training-reflection") return;
    setSavingReflection(true);
    const result = await markTrainingActivity({
      slug: context.slug,
      step: "reflection",
    });
    setProgressSynced(result.ok);
    setSavingReflection(false);
  };

  const handleSaveGratitude = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingGratitude(true);
    const formData = new FormData(e.currentTarget);
    const g1 = (formData.get("gratitude_1") || "").toString().trim();
    const g2 = (formData.get("gratitude_2") || "").toString().trim();
    const g3 = (formData.get("gratitude_3") || "").toString().trim();
    try {
      await apiFetch("/data/journal", {
        method: "POST",
        body: JSON.stringify({
          type: "gratitude",
          gratitude1: g1 || null,
          gratitude2: g2 || null,
          gratitude3: g3 || null,
        }),
      });
      // Credit the pillar — Gratitude Practice ("kritajnata") — when at least
      // one entry is actually filled in.
      if (g1 || g2 || g3) await creditPillar("gratitude");
      await fetchData();
    } catch {
    } finally {
      setSavingGratitude(false);
    }
  };

  const handleSetIntention = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingIntention(true);
    const formData = new FormData(e.currentTarget);
    const intentionText = ((formData.get("intention") as string) || "").trim();
    if (!intentionText) {
      setSavingIntention(false);
      return;
    }
    try {
      await apiFetch("/data/journal", {
        method: "POST",
        body: JSON.stringify({
          type: "intention",
          intentionText,
        }),
      });
      // Credit the "Thoughts & Intention Reset" pillar.
      await creditPillar("thoughts-intention");
      await fetchData();
    } catch {
    } finally {
      setSavingIntention(false);
    }
  };

  const handleAddManifestation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingManifestation(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    if (!title?.trim()) {
      setSavingManifestation(false);
      return;
    }
    try {
      await apiFetch("/data/journal", {
        method: "POST",
        body: JSON.stringify({
          type: "manifestation",
          title,
          description: formData.get("description") || "",
        }),
      });
      (e.target as HTMLFormElement).reset();
      await fetchData();
    } catch {
    } finally {
      setSavingManifestation(false);
    }
  };

  const handleToggleAchieved = async (id: string, currentlyAchieved: boolean) => {
    // Optimistic flip so the badge updates immediately.
    setManifestations((prev) =>
      prev.map((m: any) => (m.id === id ? { ...m, isAchieved: !currentlyAchieved } : m)),
    );
    try {
      await apiFetch("/data/journal", {
        method: "PATCH",
        body: JSON.stringify({
          type: "manifestation",
          id,
          isAchieved: !currentlyAchieved,
        }),
      });
    } catch {
      // Revert on failure so the UI doesn't drift from the server.
      setManifestations((prev) =>
        prev.map((m: any) => (m.id === id ? { ...m, isAchieved: currentlyAchieved } : m)),
      );
    }
  };

  const handleDeleteManifestation = async (id: string) => {
    const snapshot = manifestations;
    setManifestations((prev) => prev.filter((m: any) => m.id !== id));
    try {
      await apiFetch(`/data/journal?id=${encodeURIComponent(id)}&type=manifestation`, {
        method: "DELETE",
      });
    } catch {
      setManifestations(snapshot);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <QuillGlyph />
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Journal</h1>
          <p className="text-gray-600 mt-2">
            Record your gratitude, intentions, and manifestations
          </p>
        </div>
      </div>

      {/* Training reflection context — the authored questions, shown as
          context. They are never written into the user's own entry: the
          prompt is ours, the prose is theirs. */}
      {context.kind === "training-reflection" && (
        <section className="rounded-2xl border border-[#DAA520]/40 bg-gradient-to-br from-amber-50 to-orange-50 p-5 sm:p-6">
          <Link
            href={context.originHref}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B6914] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Reflection from Training
          </Link>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">
            {context.chapter.number === 0
              ? "Introduction"
              : `Chapter ${context.chapter.number}`}{" "}
            · {context.chapter.title}
          </p>
          <ol className="mt-3 space-y-2">
            {(typeof context.promptIndex === "number"
              ? [context.prompts[context.promptIndex]]
              : context.prompts
            ).map((q, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[15px] italic leading-relaxed text-[#3d3223]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#DAA520]" />
                {q}
              </li>
            ))}
          </ol>
          <form onSubmit={handleSaveReflection} className="mt-4 space-y-3">
            <label
              htmlFor="training-reflection"
              className="block text-xs font-semibold uppercase tracking-wide text-[#8B6914]"
            >
              Your reflection
            </label>
            <textarea
              id="training-reflection"
              name="reflection"
              rows={5}
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="In your own words..."
              className="w-full rounded-lg border border-[#DAA520]/40 bg-white/70 px-3 py-2 text-sm resize-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                size="sm"
                isLoading={savingReflection}
                disabled={!reflectionText.trim()}
              >
                {existingReflection ? "Update reflection" : "Save reflection"}
              </Button>

              {reflectionSaved && progressSynced && (
                <Link
                  href={context.originHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8860B] hover:underline"
                >
                  Back to{" "}
                  {context.chapter.number === 0
                    ? "the Introduction"
                    : `Chapter ${context.chapter.number}`}
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </Link>
              )}
            </div>

            {reflectionSaved && progressSynced && (
              <p className="flex items-center gap-1.5 text-sm font-medium text-green-700">
                <Check className="w-4 h-4" />
                Reflection saved · Training activity complete
              </p>
            )}

            {/* Prose is already safe here — only the progress sync failed, so
                that is all we offer to retry. Never "your writing failed". */}
            {reflectionSaved && !progressSynced && (
              <div className="text-sm">
                <p className="flex items-center gap-1.5 font-medium text-green-700">
                  <Check className="w-4 h-4" />
                  Reflection saved.
                </p>
                <p className="mt-1 text-[var(--color-text-secondary)]">
                  We couldn&apos;t mark the Training activity complete just
                  now.{" "}
                  <button
                    type="button"
                    onClick={retryProgressSync}
                    className="font-semibold text-[#B8860B] underline"
                  >
                    Retry
                  </button>
                </p>
              </div>
            )}

            {reflectionError && (
              <p className="text-sm text-red-600" role="alert">
                {reflectionError}
              </p>
            )}
          </form>
        </section>
      )}

      {/* Pillar practice mode — the long-dead ?action=gratitude|intention
          links finally say which practice they opened. Context only; the
          entry itself saves through the ordinary Journal flow. */}
      {context.kind === "practice" && context.pillar && (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B8860B]">
            {context.action === "gratitude"
              ? "Gratitude practice"
              : "Intention practice"}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {context.pillar.name}
            {context.pillar.sanskritName && (
              <span className="ml-2 font-normal text-gray-500">
                {context.pillar.sanskritName}
              </span>
            )}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {context.pillar.description}
          </p>
        </section>
      )}

      {/* Today's entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gratitude */}
        <Card
          ref={gratitudeRef}
          className={cn(
            context.kind === "practice" &&
              context.action === "gratitude" &&
              "ring-2 ring-amber-400",
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-lg">Today&apos;s Gratitude</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form
              key={todayGratitude?.id ?? "gratitude-empty"}
              onSubmit={handleSaveGratitude}
              className="space-y-3"
            >
              {[1, 2, 3].map((num) => (
                <div key={num}>
                  <label className="block text-xs text-gray-500 mb-1">
                    #{num}
                  </label>
                  <input
                    name={`gratitude_${num}`}
                    type="text"
                    placeholder="I am grateful for..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    defaultValue={
                      (todayGratitude as Record<string, string | null> | undefined)?.[`gratitude${num}`] || ""
                    }
                  />
                </div>
              ))}
              <Button type="submit" size="sm" className="w-full" isLoading={savingGratitude}>
                Save Gratitude
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Intention */}
        <Card
          ref={intentionRef}
          className={cn(
            context.kind === "practice" &&
              context.action === "intention" &&
              "ring-2 ring-amber-400",
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-lg">Today&apos;s Intention</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form
              key={todayIntention?.id ?? "intention-empty"}
              onSubmit={handleSetIntention}
              className="space-y-3"
            >
              <textarea
                name="intention"
                placeholder="My intention for today is..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                defaultValue={todayIntention?.intentionText || ""}
              />
              <Button type="submit" size="sm" className="w-full" isLoading={savingIntention}>
                Set Intention
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Manifestation Board */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <CardTitle>Manifestation Board</CardTitle>
            </div>
            <form onSubmit={handleAddManifestation}>
              <div className="flex gap-2">
                <input
                  name="title"
                  type="text"
                  placeholder="New manifestation..."
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:w-auto"
                />
                <Button type="submit" size="sm" className="shrink-0" isLoading={savingManifestation}>
                  Add
                </Button>
              </div>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {manifestations && manifestations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {manifestations.map((m: any) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border-2 ${
                    m.isAchieved
                      ? "bg-green-50 border-green-200"
                      : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-[var(--color-text-primary)] flex-1 min-w-0 break-words">
                      {m.title}
                    </h4>
                    {m.isAchieved && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white flex-shrink-0">
                        Achieved!
                      </span>
                    )}
                  </div>
                  {m.description && (
                    <p className="text-sm text-gray-600 mt-1">{m.description}</p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAchieved(m.id, !!m.isAchieved)}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        m.isAchieved
                          ? "bg-white text-green-700 hover:bg-green-100 border border-green-200"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {m.isAchieved ? (
                        <>
                          <RotateCcw className="w-3 h-3" />
                          Undo
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3" />
                          Mark achieved
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteManifestation(m.id)}
                      aria-label="Delete manifestation"
                      title="Delete"
                      className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Add your first manifestation to visualize your goals</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Written entries — generic prose, including Training reflections.
          Kept separate from the gratitude list so existing sections are
          unchanged. */}
      {journalEntries.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <CardTitle>Written Entries</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {journalEntries.slice(0, 8).map((entry: any) => {
                const training = resolveEntryTrainingContext(entry);
                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <p className="text-sm text-gray-500">
                      {entry.entryDate
                        ? new Date(entry.entryDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })
                        : "Journal entry"}
                    </p>
                    {/* Present only while the referenced chapter still exists;
                        if it doesn't, the prose below stands on its own. */}
                    {training && (
                      <p className="mt-1 text-xs font-semibold text-[#B8860B]">
                        {training.label}
                      </p>
                    )}
                    {training?.prompt && (
                      <p className="mt-1 text-xs italic text-gray-500">
                        {training.prompt}
                      </p>
                    )}
                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                      {entry.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <CardTitle>Recent Entries</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gratitudeEntries && gratitudeEntries.length > 0 ? (
              gratitudeEntries.slice(0, 5).map((entry: any) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(entry.entryDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <div className="space-y-1 text-sm">
                    {entry.gratitude1 && (
                      <p className="text-gray-700">- {entry.gratitude1}</p>
                    )}
                    {entry.gratitude2 && (
                      <p className="text-gray-700">- {entry.gratitude2}</p>
                    )}
                    {entry.gratitude3 && (
                      <p className="text-gray-700">- {entry.gratitude3}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No entries yet. Start by adding your gratitude above!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
