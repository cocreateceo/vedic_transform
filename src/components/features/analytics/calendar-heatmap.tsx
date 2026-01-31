"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface DayData {
  date: string;
  dayNumber: number;
  pillarsCompleted: number;
  totalPillars: number;
  percentage: number;
  isToday: boolean;
  isFuture: boolean;
}

interface CalendarHeatmapProps {
  data: DayData[];
  totalDays?: number;
  className?: string;
}

export function CalendarHeatmap({
  data,
  totalDays = 48,
  className = "",
}: CalendarHeatmapProps) {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  // Get intensity class based on percentage
  const getIntensityClass = (day: DayData) => {
    if (day.isFuture) return "bg-gray-100 text-gray-400";
    if (day.isToday) return "ring-2 ring-amber-400 bg-amber-500 text-white";
    if (day.percentage === 0) return "bg-red-100 text-red-600";
    if (day.percentage < 30) return "bg-red-200 text-red-700";
    if (day.percentage < 50) return "bg-orange-200 text-orange-700";
    if (day.percentage < 70) return "bg-amber-200 text-amber-700";
    if (day.percentage < 90) return "bg-green-200 text-green-700";
    return "bg-green-500 text-white";
  };

  // Group days by weeks
  const weeks: DayData[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  // Calculate overall stats
  const completedDays = data.filter((d) => !d.isFuture && d.percentage > 0).length;
  const perfectDays = data.filter((d) => d.percentage === 100).length;
  const averageCompletion =
    data.filter((d) => !d.isFuture).length > 0
      ? Math.round(
          data.filter((d) => !d.isFuture).reduce((sum, d) => sum + d.percentage, 0) /
            data.filter((d) => !d.isFuture).length
        )
      : 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">48-Day Journey Map</CardTitle>
        <p className="text-xs sm:text-sm text-gray-500">
          Your daily completion across the entire journey
        </p>
      </CardHeader>
      <CardContent>
        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-green-50">
            <p className="text-lg sm:text-2xl font-bold text-green-600">{perfectDays}</p>
            <p className="text-[10px] sm:text-xs text-gray-600">Perfect Days</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-amber-50">
            <p className="text-lg sm:text-2xl font-bold text-amber-600">{averageCompletion}%</p>
            <p className="text-[10px] sm:text-xs text-gray-600">Average</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-50">
            <p className="text-lg sm:text-2xl font-bold text-blue-600">{completedDays}</p>
            <p className="text-[10px] sm:text-xs text-gray-600">Active Days</p>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="overflow-x-auto hide-scrollbar">
          <div className="min-w-[300px]">
            {/* Week labels */}
            <div className="flex mb-1">
              <div className="w-8 sm:w-10" /> {/* Spacer for week numbers */}
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div
                  key={i}
                  className="flex-1 text-center text-[10px] sm:text-xs text-gray-400 font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex items-center gap-1 mb-1">
                <div className="w-8 sm:w-10 text-[10px] sm:text-xs text-gray-400 font-medium">
                  W{weekIndex + 1}
                </div>
                <div className="flex-1 grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) => (
                    <button
                      key={dayIndex}
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "aspect-square rounded-md flex items-center justify-center",
                        "text-[10px] sm:text-xs font-medium transition-all",
                        "hover:scale-110 hover:shadow-md cursor-pointer",
                        getIntensityClass(day)
                      )}
                      title={`Day ${day.dayNumber}: ${day.percentage}%`}
                    >
                      {day.dayNumber}
                    </button>
                  ))}
                  {/* Fill empty cells for incomplete weeks */}
                  {week.length < 7 &&
                    Array.from({ length: 7 - week.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gray-100" />
            <span className="text-gray-500">Future</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-red-200" />
            <span className="text-gray-500">&lt;50%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-amber-200" />
            <span className="text-gray-500">50-70%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-green-200" />
            <span className="text-gray-500">70-90%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-green-500" />
            <span className="text-gray-500">90%+</span>
          </div>
        </div>

        {/* Selected day detail */}
        {selectedDay && !selectedDay.isFuture && (
          <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Day {selectedDay.dayNumber}</p>
                <p className="text-xs text-gray-500">{selectedDay.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-amber-600">{selectedDay.percentage}%</p>
                <p className="text-xs text-gray-500">
                  {selectedDay.pillarsCompleted}/{selectedDay.totalPillars} pillars
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
