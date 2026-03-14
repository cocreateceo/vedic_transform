"use client";

import { useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Heart,
  Zap,
  Brain,
  Moon,
  Send,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface MoodLog {
  id: string;
  userId: string;
  logDate: string;
  moodScore: number;
  energy: number | null;
  stress: number | null;
  sleepQuality: number | null;
  notes: string | null;
  createdAt: string;
}

const MOOD_EMOJIS = [
  { value: 1, emoji: "\u{1F61E}", label: "Bad" },
  { value: 2, emoji: "\u{1F610}", label: "Low" },
  { value: 3, emoji: "\u{1F642}", label: "Okay" },
  { value: 4, emoji: "\u{1F60A}", label: "Good" },
  { value: 5, emoji: "\u{1F929}", label: "Great" },
];

const STRESS_COLORS = [
  "bg-green-500/80",
  "bg-lime-500/80",
  "bg-yellow-500/80",
  "bg-orange-500/80",
  "bg-red-500/80",
];

export function MoodPageClient({
  initialLogs,
}: {
  initialLogs: MoodLog[];
}) {
  const [logs, setLogs] = useState<MoodLog[]>(initialLogs);
  const [moodScore, setMoodScore] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(0);
  const [stress, setStress] = useState<number>(0);
  const [sleepQuality, setSleepQuality] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (moodScore === 0) return;
    setSubmitting(true);
    try {
      const newLog = await apiFetch("/data/mood", {
        method: "POST",
        body: JSON.stringify({
          moodScore,
          energy: energy || null,
          stress: stress || null,
          sleepQuality: sleepQuality || null,
          notes: notes.trim() || null,
        }),
      });
      if (newLog) {
        setLogs((prev) => {
          const filtered = prev.filter(
            (l) =>
              new Date(l.logDate).toDateString() !==
              new Date(newLog.logDate).toDateString()
          );
          return [newLog, ...filtered];
        });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save mood:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Chart data
  const chartData = useMemo(() => {
    return [...logs]
      .sort(
        (a, b) =>
          new Date(a.logDate).getTime() - new Date(b.logDate).getTime()
      )
      .map((log) => ({
        date: new Date(log.logDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        Mood: log.moodScore,
        Energy: log.energy ?? undefined,
        Stress: log.stress ?? undefined,
        Sleep: log.sleepQuality ?? undefined,
      }));
  }, [logs]);

  // Weekly averages
  const weeklyAvg = useMemo(() => {
    const last7 = logs.filter((l) => {
      const d = new Date(l.logDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return d >= weekAgo;
    });
    if (last7.length === 0) return null;
    const avg = (arr: number[]) =>
      arr.length > 0
        ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)
        : "-";
    return {
      mood: avg(last7.map((l) => l.moodScore)),
      energy: avg(last7.filter((l) => l.energy != null).map((l) => l.energy!)),
      stress: avg(last7.filter((l) => l.stress != null).map((l) => l.stress!)),
      sleep: avg(
        last7
          .filter((l) => l.sleepQuality != null)
          .map((l) => l.sleepQuality!)
      ),
      entries: last7.length,
    };
  }, [logs]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <Heart className="h-8 w-8 text-[var(--color-primary)]" />
          Mood Tracker
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Track your emotional well-being on your transformation journey
        </p>
      </div>

      {/* Daily Check-in Card */}
      <div className="glass-card p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <Send className="h-5 w-5 text-[var(--color-secondary)]" />
          Daily Check-in
        </h2>

        {/* Mood */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-2">
            <Heart className="h-4 w-4" /> Mood
          </label>
          <div className="flex gap-2 flex-wrap">
            {MOOD_EMOJIS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMoodScore(m.value)}
                className={`flex flex-col items-center gap-1 rounded-xl px-4 py-3 border transition-all text-2xl ${
                  moodScore === m.value
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/15 scale-110 shadow-lg"
                    : "border-[var(--color-border)] bg-[var(--color-card-bg)] hover:border-[var(--color-primary)]/50"
                }`}
              >
                <span>{m.emoji}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-2">
            <Zap className="h-4 w-4" /> Energy
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => setEnergy(v)}
                className={`flex items-center justify-center w-12 h-12 rounded-xl border text-sm font-bold transition-all ${
                  energy === v
                    ? "border-amber-400 bg-amber-500/20 text-amber-300 scale-110 shadow-lg"
                    : "border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] hover:border-amber-400/50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Stress */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-2">
            <Brain className="h-4 w-4" /> Stress
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => setStress(v)}
                className={`flex items-center justify-center w-12 h-12 rounded-xl border text-sm font-bold transition-all ${
                  stress === v
                    ? `${STRESS_COLORS[v - 1]} text-white scale-110 shadow-lg border-transparent`
                    : "border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Quality */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-2">
            <Moon className="h-4 w-4" /> Sleep Quality
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => setSleepQuality(v)}
                className={`flex items-center justify-center w-12 h-12 rounded-xl border text-sm font-bold transition-all ${
                  sleepQuality === v
                    ? "border-indigo-400 bg-indigo-500/20 text-indigo-300 scale-110 shadow-lg"
                    : "border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] hover:border-indigo-400/50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling today? Any observations..."
            rows={3}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={moodScore === 0 || submitting}
          className="w-full rounded-xl py-3 px-6 font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "var(--color-saffron-gradient)",
          }}
        >
          {submitting
            ? "Saving..."
            : submitted
              ? "Saved!"
              : "Log Today's Mood"}
        </button>
      </div>

      {/* Weekly Averages */}
      {weeklyAvg && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--color-secondary)]" />
            Weekly Averages
            <span className="text-sm font-normal text-[var(--color-text-muted)]">
              ({weeklyAvg.entries} entries)
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Mood",
                value: weeklyAvg.mood,
                icon: Heart,
                color: "text-[var(--color-primary)]",
              },
              {
                label: "Energy",
                value: weeklyAvg.energy,
                icon: Zap,
                color: "text-amber-400",
              },
              {
                label: "Stress",
                value: weeklyAvg.stress,
                icon: Brain,
                color: "text-red-400",
              },
              {
                label: "Sleep",
                value: weeklyAvg.sleep,
                icon: Moon,
                color: "text-indigo-400",
              },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center space-y-1">
                <stat.icon className={`h-5 w-5 mx-auto ${stat.color}`} />
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mood Trend Chart */}
      {chartData.length > 1 && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[var(--color-secondary)]" />
            Mood Trends
          </h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="date"
                  stroke="var(--color-text-muted)"
                  fontSize={12}
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  stroke="var(--color-text-muted)"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    color: "var(--color-text-primary)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Mood"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Energy"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Stress"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Sleep"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Empty state */}
      {chartData.length === 0 && (
        <div className="glass-card p-8 text-center space-y-2">
          <Heart className="h-12 w-12 mx-auto text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-secondary)]">
            No mood data yet. Start your first check-in above!
          </p>
        </div>
      )}
    </div>
  );
}
