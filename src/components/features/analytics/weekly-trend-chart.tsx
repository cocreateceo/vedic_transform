"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DailyData {
  date: string;
  dayLabel: string;
  pillarsCompleted: number;
  totalPillars: number;
  percentage: number;
}

interface WeeklyTrendChartProps {
  data: DailyData[];
  currentWeek: number;
  previousWeekAverage?: number;
  className?: string;
}

export function WeeklyTrendChart({
  data,
  currentWeek,
  previousWeekAverage = 0,
  className = "",
}: WeeklyTrendChartProps) {
  // Calculate current week average
  const currentWeekAverage =
    data.length > 0
      ? Math.round(data.reduce((sum, d) => sum + d.percentage, 0) / data.length)
      : 0;

  // Calculate trend
  const trend = currentWeekAverage - previousWeekAverage;
  const trendDirection = trend > 0 ? "up" : trend < 0 ? "down" : "stable";

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900">{data.dayLabel}</p>
          <p className="text-sm text-gray-600">
            {data.pillarsCompleted} / {data.totalPillars} pillars
          </p>
          <p className="text-sm font-medium text-amber-600">{data.percentage}% complete</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">Weekly Progress</CardTitle>
            <p className="text-xs sm:text-sm text-gray-500">Week {currentWeek} of your journey</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                trendDirection === "up"
                  ? "bg-green-100 text-green-700"
                  : trendDirection === "down"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {trendDirection === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : trendDirection === "down" ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              <span>
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary stats */}
        <div className="flex justify-between mb-4 text-center">
          <div className="flex-1">
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">{currentWeekAverage}%</p>
            <p className="text-xs text-gray-500">This Week Avg</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1">
            <p className="text-2xl sm:text-3xl font-bold text-gray-400">{previousWeekAverage}%</p>
            <p className="text-xs text-gray-500">Last Week Avg</p>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-container h-[180px] sm:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPillars" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="dayLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#colorPillars)"
                dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily breakdown - mobile scroll */}
        <div className="mt-4 flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {data.map((day, i) => (
            <div
              key={i}
              className={`flex-shrink-0 flex flex-col items-center p-2 rounded-lg min-w-[60px] ${
                day.percentage >= 80
                  ? "bg-green-50"
                  : day.percentage >= 50
                  ? "bg-amber-50"
                  : "bg-gray-50"
              }`}
            >
              <span className="text-[10px] text-gray-500">{day.dayLabel}</span>
              <span
                className={`text-sm font-bold ${
                  day.percentage >= 80
                    ? "text-green-600"
                    : day.percentage >= 50
                    ? "text-amber-600"
                    : "text-gray-500"
                }`}
              >
                {day.pillarsCompleted}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
