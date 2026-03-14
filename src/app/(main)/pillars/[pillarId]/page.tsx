import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getPillarBySlug, PILLARS } from "@/constants/pillars";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreathingVisualizer } from "@/components/features/pillars/breathing-visualizer";
import { Check, ArrowLeft, Clock, Sparkles, Download, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export const dynamic = "force-dynamic";
interface PillarPageProps {
  params: Promise<{ pillarId: string }>;
}

export default async function PillarPage({ params }: PillarPageProps) {
  const { pillarId } = await params;
  const pillar = getPillarBySlug(pillarId);

  if (!pillar) {
    notFound();
  }

  const user = await requireAuth();

  // Get today's check-in status
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkin = await db.dailyCheckin.findFirst({
    where: {
      userId: user.id,
      pillarId: pillar.id,
      checkinDate: today,
    },
  });

  const isCompleted = checkin?.completed || false;

  // Get user's active journey
  const journey = await db.journey.findFirst({
    where: {
      userId: user.id,
      isActive: true,
    },
  });

  const Icon = pillar.icon;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        href="/pillars"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Pillars
      </Link>

      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <div
          className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center",
            pillar.bgColor
          )}
        >
          <Icon className="w-10 h-10" style={{ color: pillar.color }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{pillar.name}</h1>
            {isCompleted && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <Check className="w-4 h-4" />
                Completed
              </div>
            )}
          </div>
          <p className="text-lg text-amber-600 mt-1">{pillar.sanskritName}</p>
          <p className="text-gray-600 mt-2">{pillar.description}</p>

          <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
            {pillar.defaultDurationMinutes > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {pillar.defaultDurationMinutes} minutes
              </div>
            )}
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              +{pillar.karmaPointsBase} karma points
            </div>
          </div>
        </div>
      </div>

      {/* Pillar-specific content */}
      <Card className="mb-6">
        <CardContent className="py-8">
          {pillarId === "breathing-meditation" ? (
            <BreathingVisualizer
              inhaleDuration={4}
              exhaleDuration={6}
              totalDuration={5}
            />
          ) : pillarId === "morning-initiation" ? (
            <MorningInitiationContent />
          ) : pillarId === "gratitude" ? (
            <GratitudeContent />
          ) : pillarId === "nutrition-fasting" ? (
            <NutritionContent />
          ) : (
            <GenericPillarContent pillar={pillar} />
          )}
        </CardContent>
      </Card>

      {/* Complete button */}
      {!isCompleted && journey && (
        <form
          action={async () => {
            "use server";
            const { db } = await import("@/lib/db");
            const { requireAuth } = await import("@/lib/auth");

            const user = await requireAuth();

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Get journey
            const journey = await db.journey.findFirst({
              where: {
                userId: user.id,
                isActive: true,
              },
            });

            if (!journey) return;

            // Get pillar from DB
            const pillarData = await db.pillar.findUnique({
              where: { slug: pillarId },
            });

            if (!pillarData) return;

            // Upsert check-in
            await db.dailyCheckin.upsert({
              where: {
                userId_pillarId_checkinDate: {
                  userId: user.id,
                  pillarId: pillarData.id,
                  checkinDate: today,
                },
              },
              update: {
                completed: true,
              },
              create: {
                userId: user.id,
                pillarId: pillarData.id,
                checkinDate: today,
                completed: true,
              },
            });

            // Add karma
            await db.karmaTransaction.create({
              data: {
                userId: user.id,
                points: pillarData.karmaPointsBase,
                reason: `Completed ${pillarId}`,
                pillarId: pillarData.id,
              },
            });

            redirect("/pillars");
          }}
        >
          <Button type="submit" size="lg" className="w-full">
            <Check className="w-5 h-5 mr-2" />
            Mark as Complete (+{pillar.karmaPointsBase} karma)
          </Button>
        </form>
      )}

      {isCompleted && (
        <div className="vedic-card p-6 text-center bg-green-50 border-green-200">
          <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-700">
            Great job! You&apos;ve completed this pillar today.
          </h3>
          <p className="text-green-600 mt-1">
            +{pillar.karmaPointsBase} karma earned
          </p>
        </div>
      )}
    </div>
  );
}

// Morning Initiation specific content
function MorningInitiationContent() {
  return (
    <div className="space-y-6">
      {/* Download Guide Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Complete 5 AM Morning Routine Guide
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Download our detailed step-by-step guide to master the Brahma Muhurta practice.
              Includes preparation tips, breathing exercises, meditation techniques, and a daily checklist.
            </p>
            <a
              href="/guides/5am-morning-routine-guide.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              Download Guide
            </a>
            <p className="text-xs text-gray-500 mt-3">
              Tip: Open the guide and use Ctrl+P (or Cmd+P on Mac) to save as PDF
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900">
        Quick Morning Checklist
      </h3>
      <div className="space-y-4">
        {[
          {
            title: "Wake Up Early",
            description:
              "Get out of bed calmly. Preferably 5 AM or 20 mins before normal time.",
          },
          {
            title: "Hydrate",
            description: "Drink a glass of warm water.",
          },
          {
            title: "Avoid Phone",
            description: "No phone use for the first 20-30 minutes.",
          },
          {
            title: "Center Your Breath",
            description:
              "2-5 minutes of slow breathing. Inhale 4 seconds, exhale 6 seconds.",
          },
          {
            title: "Connect to Awareness",
            description:
              "1-2 minutes of stillness. Feel connection to universal energy.",
          },
          {
            title: "Gratitude & Intention",
            description: "List 3 things you're grateful for. Set one intention.",
          },
          {
            title: "Visualization",
            description:
              "2 minutes seeing yourself succeeding in your 48-day goal.",
          },
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-medium text-sm">
              {i + 1}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{step.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Gratitude specific content
function GratitudeContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">
        Today&apos;s Gratitude
      </h3>
      <p className="text-gray-600">
        Take a moment to reflect on three things you&apos;re grateful for today.
      </p>
      <div className="space-y-4">
        {[1, 2, 3].map((num) => (
          <div key={num}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gratitude #{num}
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none"
              rows={2}
              placeholder={`I am grateful for...`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Nutrition specific content
function NutritionContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">
        Vedic Nutrition Guidelines
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">Sattvic Foods</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Fresh fruits and vegetables</li>
            <li>• Whole grains and legumes</li>
            <li>• Nuts, seeds, and honey</li>
            <li>• Herbal teas and water</li>
            <li>• Light, easily digestible meals</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <h4 className="font-medium text-red-800 mb-2">Avoid (Tamasic)</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Processed and fried foods</li>
            <li>• Excessive caffeine</li>
            <li>• Heavy meals after sunset</li>
            <li>• Stale or reheated food</li>
            <li>• Overeating</li>
          </ul>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
        <h4 className="font-medium text-amber-800 mb-2">
          Intermittent Fasting (16:8)
        </h4>
        <p className="text-sm text-amber-700">
          Fast for 16 hours and eat within an 8-hour window. This aligns with
          circadian rhythm and promotes natural fat loss and high energy.
        </p>
      </div>
    </div>
  );
}

// Generic pillar content
function GenericPillarContent({
  pillar,
}: {
  pillar: (typeof PILLARS)[number];
}) {
  return (
    <div className="text-center py-8">
      <pillar.icon
        className="w-16 h-16 mx-auto mb-4"
        style={{ color: pillar.color }}
      />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{pillar.name}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{pillar.description}</p>
      {pillar.defaultDurationMinutes > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Recommended duration: {pillar.defaultDurationMinutes} minutes
        </p>
      )}
    </div>
  );
}
