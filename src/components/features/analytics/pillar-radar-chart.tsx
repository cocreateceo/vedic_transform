"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PillarData {
  name: string;
  shortName: string;
  completion: number;
  category: string;
  color: string;
}

interface PillarRadarChartProps {
  data: PillarData[];
  className?: string;
}

export function PillarRadarChart({ data, className = "" }: PillarRadarChartProps) {
  // Prepare data for radar chart
  const chartData = data.map((pillar) => ({
    subject: pillar.shortName,
    fullName: pillar.name,
    value: pillar.completion,
    fullMark: 100,
  }));

  // Calculate category averages
  const categories = ["body", "mind", "spirit"];
  const categoryAverages = categories.map((cat) => {
    const pillarsInCat = data.filter((p) => p.category === cat);
    const avg =
      pillarsInCat.length > 0
        ? pillarsInCat.reduce((sum, p) => sum + p.completion, 0) / pillarsInCat.length
        : 0;
    return { category: cat, average: Math.round(avg) };
  });

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">Pillar Strengths</CardTitle>
        <p className="text-xs sm:text-sm text-gray-500">
          Your consistency across all 11 pillars
        </p>
      </CardHeader>
      <CardContent>
        {/* Category summary - mobile friendly */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-4">
          {categoryAverages.map((cat) => (
            <div
              key={cat.category}
              className="flex flex-col items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gray-50"
            >
              <span className="text-[10px] sm:text-xs text-gray-500 capitalize">
                {cat.category}
              </span>
              <span
                className={`text-sm sm:text-lg font-bold ${
                  cat.average >= 70
                    ? "text-green-600"
                    : cat.average >= 40
                    ? "text-amber-600"
                    : "text-red-500"
                }`}
              >
                {cat.average}%
              </span>
            </div>
          ))}
        </div>

        {/* Radar Chart */}
        <div className="chart-container h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 9 }}
                tickCount={5}
                axisLine={false}
              />
              <Radar
                name="Completion %"
                dataKey="value"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.5}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600">Strong (70%+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-600">Moderate (40-69%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600">Needs Focus (&lt;40%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
