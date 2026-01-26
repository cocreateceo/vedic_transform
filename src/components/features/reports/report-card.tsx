"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  Award,
  Calendar,
  Flame,
  Star,
  Target,
} from "lucide-react";

interface ReportCardProps {
  title: string;
  type: "weekly" | "monthly" | "journey" | "certificate";
  date?: Date;
  stats?: {
    label: string;
    value: string | number;
  }[];
  onDownloadPDF?: () => void;
  onDownloadCSV?: () => void;
  onPrint?: () => void;
  isGenerating?: boolean;
  className?: string;
}

const typeConfig = {
  weekly: {
    icon: Calendar,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
  },
  monthly: {
    icon: Target,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
  journey: {
    icon: Flame,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    borderColor: "border-orange-200",
  },
  certificate: {
    icon: Award,
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200",
  },
};

export function ReportCard({
  title,
  type,
  date,
  stats,
  onDownloadPDF,
  onDownloadCSV,
  onPrint,
  isGenerating = false,
  className = "",
}: ReportCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card className={cn("overflow-hidden", config.borderColor, className)}>
      <CardHeader className={cn("pb-3", config.bgColor)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                config.bgColor === "bg-blue-50" ? "bg-blue-100" :
                config.bgColor === "bg-purple-50" ? "bg-purple-100" :
                config.bgColor === "bg-orange-50" ? "bg-orange-100" :
                "bg-amber-100"
              )}
            >
              <Icon className={cn("w-5 h-5", config.iconColor)} />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base">{title}</CardTitle>
              {date && (
                <p className="text-xs text-gray-500">
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Stats grid */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-2 rounded-lg bg-gray-50"
              >
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {onDownloadPDF && (
            <Button
              size="sm"
              variant="outline"
              onClick={onDownloadPDF}
              disabled={isGenerating}
              className="flex-1 min-w-[100px]"
            >
              <FileText className="w-4 h-4 mr-1.5" />
              PDF
            </Button>
          )}
          {onDownloadCSV && (
            <Button
              size="sm"
              variant="outline"
              onClick={onDownloadCSV}
              disabled={isGenerating}
              className="flex-1 min-w-[100px]"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              CSV
            </Button>
          )}
          {onPrint && (
            <Button
              size="sm"
              variant="outline"
              onClick={onPrint}
              disabled={isGenerating}
              className="flex-1 min-w-[100px]"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Print
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
