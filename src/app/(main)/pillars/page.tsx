import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { PILLARS, getPillarsByCategory } from "@/constants/pillars";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

export const dynamic = "force-dynamic";
export default async function PillarsPage() {
  const user = await requireAuth();
  const userId = user.id;

  // Get today's completed pillars
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCheckins = await db.dailyCheckin.findMany({
    where: {
      userId,
      checkinDate: today,
      completed: true,
    },
    include: {
      pillar: {
        select: {
          slug: true,
        },
      },
    },
  });

  const completedPillars = todayCheckins.map((c) => c.pillar.slug);

  const bodyPillars = getPillarsByCategory("body");
  const mindPillars = getPillarsByCategory("mind");
  const spiritPillars = getPillarsByCategory("spirit");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          11 Transformation Pillars
        </h1>
        <p className="text-gray-600 mt-2">
          Track your daily progress across body, mind, and spirit
        </p>
      </div>

      {/* Overall progress */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Today&apos;s Progress</h3>
              <p className="text-sm text-gray-500">
                {completedPillars.length} of {PILLARS.length} pillars completed
              </p>
            </div>
            <div className="text-3xl font-bold text-amber-600">
              {Math.round((completedPillars.length / PILLARS.length) * 100)}%
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{
                width: `${(completedPillars.length / PILLARS.length) * 100}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Body pillars */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <span className="text-xl">🏃</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Body</h2>
            <p className="text-sm text-gray-500">Physical transformation</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bodyPillars.map((pillar) => {
            const Icon = pillar.icon;
            const isCompleted = completedPillars.includes(pillar.slug);
            return (
              <Link key={pillar.id} href={`/pillars/${pillar.slug}`}>
                <Card
                  className={cn(
                    "hover:shadow-lg transition-all cursor-pointer h-full",
                    isCompleted && "ring-2 ring-green-500 bg-green-50"
                  )}
                >
                  <CardContent className="p-5 relative">
                    {isCompleted && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                        pillar.bgColor
                      )}
                    >
                      <Icon className="w-6 h-6" style={{ color: pillar.color }} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{pillar.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {pillar.sanskritName}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {pillar.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-amber-600 font-medium">
                        +{pillar.karmaPointsBase} karma
                      </span>
                      {pillar.defaultDurationMinutes > 0 && (
                        <span className="text-xs text-gray-400">
                          {pillar.defaultDurationMinutes} min
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Mind pillars */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <span className="text-xl">🧠</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Mind</h2>
            <p className="text-sm text-gray-500">Mental transformation</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mindPillars.map((pillar) => {
            const Icon = pillar.icon;
            const isCompleted = completedPillars.includes(pillar.slug);
            return (
              <Link key={pillar.id} href={`/pillars/${pillar.slug}`}>
                <Card
                  className={cn(
                    "hover:shadow-lg transition-all cursor-pointer h-full",
                    isCompleted && "ring-2 ring-green-500 bg-green-50"
                  )}
                >
                  <CardContent className="p-5 relative">
                    {isCompleted && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                        pillar.bgColor
                      )}
                    >
                      <Icon className="w-6 h-6" style={{ color: pillar.color }} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{pillar.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {pillar.sanskritName}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {pillar.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-amber-600 font-medium">
                        +{pillar.karmaPointsBase} karma
                      </span>
                      {pillar.defaultDurationMinutes > 0 && (
                        <span className="text-xs text-gray-400">
                          {pillar.defaultDurationMinutes} min
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Spirit pillars */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Spirit</h2>
            <p className="text-sm text-gray-500">Spiritual transformation</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {spiritPillars.map((pillar) => {
            const Icon = pillar.icon;
            const isCompleted = completedPillars.includes(pillar.slug);
            return (
              <Link key={pillar.id} href={`/pillars/${pillar.slug}`}>
                <Card
                  className={cn(
                    "hover:shadow-lg transition-all cursor-pointer h-full",
                    isCompleted && "ring-2 ring-green-500 bg-green-50"
                  )}
                >
                  <CardContent className="p-5 relative">
                    {isCompleted && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                        pillar.bgColor
                      )}
                    >
                      <Icon className="w-6 h-6" style={{ color: pillar.color }} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{pillar.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {pillar.sanskritName}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {pillar.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-amber-600 font-medium">
                        +{pillar.karmaPointsBase} karma
                      </span>
                      {pillar.defaultDurationMinutes > 0 && (
                        <span className="text-xs text-gray-400">
                          {pillar.defaultDurationMinutes} min
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
