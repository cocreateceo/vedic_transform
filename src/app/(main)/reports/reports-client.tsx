"use client";

import { useState, useRef } from "react";
import { ReportCard, JourneyCertificate } from "@/components/features/reports";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileText } from "lucide-react";

interface ReportsPageClientProps {
  hasJourney: boolean;
  currentDay: number;
  currentWeek: number;
  stats: {
    totalCheckins: number;
    totalKarma: number;
    currentStreak: number;
    badgesEarned: number;
    completionRate: number;
  };
  journeyStartDate: Date;
  userName: string;
}

export function ReportsPageClient({
  hasJourney,
  currentDay,
  currentWeek,
  stats,
  journeyStartDate,
  userName,
}: ReportsPageClientProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownloadCSV = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/reports?format=csv");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vedic-journey-report-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to download CSV:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePrintCertificate = () => {
    if (certificateRef.current) {
      const printContent = certificateRef.current.innerHTML;
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>10X Vedic - Journey Certificate</title>
              <style>
                body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
                @media print { body { padding: 0; } }
              </style>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (!hasJourney) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">No Journey Started</h2>
          <p className="text-gray-500 mt-2">
            Start your 48-day transformation journey to generate reports.
          </p>
        </div>
      </div>
    );
  }

  const endDate = new Date(journeyStartDate);
  endDate.setDate(endDate.getDate() + 48);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Download and print your journey progress
        </p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Journey Report */}
        <ReportCard
          title="Journey Progress Report"
          type="journey"
          date={new Date()}
          stats={[
            { label: "Day", value: currentDay },
            { label: "Karma", value: stats.totalKarma },
            { label: "Streak", value: stats.currentStreak },
            { label: "Rate", value: `${stats.completionRate}%` },
          ]}
          onDownloadCSV={handleDownloadCSV}
          onPrint={handlePrint}
          isGenerating={isGenerating}
        />

        {/* Weekly Summary */}
        <ReportCard
          title={`Week ${currentWeek} Summary`}
          type="weekly"
          date={new Date()}
          stats={[
            { label: "Check-ins", value: stats.totalCheckins },
            { label: "Badges", value: stats.badgesEarned },
          ]}
          onDownloadCSV={handleDownloadCSV}
          isGenerating={isGenerating}
        />
      </div>

      {/* Certificate Section */}
      {currentDay >= 48 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Journey Completion Certificate
                </h3>
                <p className="text-sm text-gray-500">
                  Congratulations on completing your 48-day transformation!
                </p>
              </div>
              <Button onClick={handlePrintCertificate}>
                <Printer className="w-4 h-4 mr-2" />
                Print Certificate
              </Button>
            </div>

            <div ref={certificateRef}>
              <JourneyCertificate
                userName={userName}
                startDate={journeyStartDate}
                endDate={endDate}
                totalKarma={stats.totalKarma}
                completionRate={stats.completionRate}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Certificate (for users who haven't completed) */}
      {currentDay < 48 && (
        <Card className="opacity-75">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Journey Completion Certificate
              </h3>
              <p className="text-sm text-gray-500">
                Complete your 48-day journey to unlock your certificate
              </p>
              <p className="text-amber-600 font-medium mt-2">
                {48 - currentDay} days remaining
              </p>
            </div>

            <div className="filter blur-sm pointer-events-none">
              <JourneyCertificate
                userName={userName}
                startDate={journeyStartDate}
                endDate={endDate}
                totalKarma={stats.totalKarma}
                completionRate={stats.completionRate}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
