"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Sparkles, Calendar } from "lucide-react";

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
    try {
      await apiFetch("/data/journal", {
        method: "POST",
        body: JSON.stringify({
          action: "gratitude",
          gratitude1: formData.get("gratitude_1"),
          gratitude2: formData.get("gratitude_2"),
          gratitude3: formData.get("gratitude_3"),
        }),
      });
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
    const intentionText = formData.get("intention") as string;
    if (!intentionText?.trim()) {
      setSavingIntention(false);
      return;
    }
    try {
      await apiFetch("/data/journal", {
        method: "POST",
        body: JSON.stringify({
          action: "intention",
          intentionText,
        }),
      });
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
          action: "manifestation",
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
            <form onSubmit={handleSaveGratitude} className="space-y-3">
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
            <form onSubmit={handleSetIntention} className="space-y-3">
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
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900">{m.title}</h4>
                    {m.isAchieved && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white">
                        Achieved!
                      </span>
                    )}
                  </div>
                  {m.description && (
                    <p className="text-sm text-gray-600 mt-1">{m.description}</p>
                  )}
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
