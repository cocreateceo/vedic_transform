"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Sparkles, Calendar, Check, Trash2, RotateCcw } from "lucide-react";

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

export default function JournalPage() {
  const [gratitudeEntries, setGratitudeEntries] = useState<any[]>([]);
  const [todayGratitude, setTodayGratitude] = useState<any>(null);
  const [todayIntention, setTodayIntention] = useState<any>(null);
  const [manifestations, setManifestations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingGratitude, setSavingGratitude] = useState(false);
  const [savingIntention, setSavingIntention] = useState(false);
  const [savingManifestation, setSavingManifestation] = useState(false);

  const fetchData = async () => {
    try {
      const data = await apiFetch("/data/journal");
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
        <p className="text-gray-600 mt-2">
          Record your gratitude, intentions, and manifestations
        </p>
      </div>

      {/* Today's entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gratitude */}
        <Card>
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
        <Card>
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
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <Button type="submit" size="sm" isLoading={savingManifestation}>
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
                    <h4 className="font-medium text-gray-900 flex-1 min-w-0 break-words">
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
