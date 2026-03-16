"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { StreakCounter } from "@/components/features/dashboard/streak-counter";
import { KarmaPoints } from "@/components/features/dashboard/karma-points";
import { PillarGrid } from "@/components/features/dashboard/pillar-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Target, Sunrise, Leaf, Headphones, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DailyWisdomPopup } from "@/components/features/dashboard/daily-wisdom-popup";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [journey, setJourney] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [completedPillars, setCompletedPillars] = useState<string[]>([]);
  const [totalKarma, setTotalKarma] = useState(0);
  const [todayEarned, setTodayEarned] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [isStreakAtRisk, setIsStreakAtRisk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [journeyData, checkinData, karmaData] = await Promise.all([
          apiFetch("/data/journey"),
          apiFetch("/data/checkin"),
          apiFetch("/data/reports"),
        ]);

        if (journeyData?.journey) {
          setJourney(journeyData.journey);
          setStreak(journeyData.streak || null);

          const day = Math.min(
            Math.floor(
              (new Date().getTime() - new Date(journeyData.journey.startDate).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1,
            48
          );
          setCurrentDay(day);
        }

        if (checkinData?.completedPillars) {
          setCompletedPillars(checkinData.completedPillars);
          setIsStreakAtRisk(
            checkinData.completedPillars.length === 0 && new Date().getHours() >= 12
          );
        }

        if (karmaData) {
          setTotalKarma(karmaData.totalKarma || 0);
          setTodayEarned(karmaData.todayEarned || 0);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleStartJourney = async () => {
    setStarting(true);
    try {
      await apiFetch("/data/journey", {
        method: "POST",
        body: JSON.stringify({ action: "start" }),
      });
      router.refresh();
      window.location.reload();
    } catch {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="vedic-card p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse h-32 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vedic-card p-6 animate-pulse h-40 rounded-2xl bg-gray-100" />
          <div className="vedic-card p-6 animate-pulse h-40 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card variant="elevated" className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/25">
              <Sunrise className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Begin Your Transformation
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your 48-day Vedic journey to transform your body, mind, and
              spirit. Commit to 30 minutes for your mind and 30 minutes for your
              body each day.
            </p>
            <Button
              size="lg"
              onClick={handleStartJourney}
              isLoading={starting}
            >
              Start My 48-Day Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DailyWisdomPopup />
      {/* Welcome banner */}
      <div className="vedic-card p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-sm">Good morning!</p>
            <h1 className="text-2xl font-bold mt-1">
              Day {currentDay} of Your Journey
            </h1>
            <p className="text-amber-100 mt-2">
              {48 - currentDay} days remaining in your transformation
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakCounter
          currentStreak={streak?.currentStreak || 0}
          longestStreak={streak?.longestStreak || 0}
          isAtRisk={isStreakAtRisk}
        />
        <KarmaPoints totalKarma={totalKarma} todayEarned={todayEarned} />
      </div>

      {/* Today's pillars */}
      <PillarGrid completedPillars={completedPillars} />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/pillars/morning-initiation">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Sunrise className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Morning Routine</h4>
                <p className="text-sm text-gray-500">Start your day right</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/pillars/breathing-meditation">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Breathwork</h4>
                <p className="text-sm text-gray-500">4-6 breathing exercise</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/journal">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Journal</h4>
                <p className="text-sm text-gray-500">Record your gratitude</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Discover section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Discover</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/dosha-assessment">
            <Card variant="golden" className="hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md shadow-green-500/20 group-hover:scale-105 transition-transform">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Dosha Assessment</h4>
                  <p className="text-sm text-gray-500">Discover your Ayurvedic type</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/library">
            <Card variant="golden" className="hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Audio Meditations</h4>
                  <p className="text-sm text-gray-500">Play guided sessions in-app</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/insights">
            <Card variant="golden" className="hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">AI Insights</h4>
                  <p className="text-sm text-gray-500">Personalized recommendations</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
