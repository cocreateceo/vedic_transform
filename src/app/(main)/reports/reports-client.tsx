"use client";

import { useState, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { ReportCard, JourneyCertificate } from "@/components/features/reports";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileText } from "lucide-react";
import { ShareButton } from "@/components/ui/share-button";

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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const token = localStorage.getItem("vedic-token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_URL}/data/reports?format=csv`, { headers });
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
    // Use a print-scoped stylesheet on the *current* document rather than
    // re-rendering the certificate in a new window with an outdated Tailwind
    // CDN. The class on <body> + the @media print rules below hide everything
    // except the .cert-print-area wrapper, so all the certificate's existing
    // Tailwind classes keep rendering correctly.
    if (typeof window === "undefined") return;
    document.body.classList.add("printing-cert");
    const cleanup = () => {
      document.body.classList.remove("printing-cert");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  };

  if (!hasJourney) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">No Journey Started</h2>
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
      {/* Print-only stylesheet: when body has the printing-cert class, hide
          everything except elements inside .cert-print-area. Classic print
          pattern so the certificate's existing Tailwind classes render. */}
      <style>{`
        @media print {
          body.printing-cert * { visibility: hidden; }
          body.printing-cert .cert-print-area,
          body.printing-cert .cert-print-area * { visibility: visible; }
          body.printing-cert .cert-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">Reports</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Download and print your journey progress
        </p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Journey Report */}
        <div className="space-y-3">
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
          <ShareButton
            title="My Vedic Transformation Progress"
            text={`Day ${currentDay} of my 48-day Vedic transformation! ${stats.totalKarma} karma points, ${stats.currentStreak}-day streak, ${stats.completionRate}% completion rate.`}
            variant="outline"
            size="md"
            label="Share Progress"
          />
        </div>

        {/* Weekly Summary */}
        <div className="space-y-3">
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
          <ShareButton
            title={`Week ${currentWeek} Vedic Journey`}
            text={`Completed week ${currentWeek} of my Vedic journey! ${stats.totalCheckins} check-ins and ${stats.badgesEarned} badges earned.`}
            variant="outline"
            size="md"
            label="Share Progress"
          />
        </div>
      </div>

      {/* Certificate Section */}
      {currentDay >= 48 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
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

            <div ref={certificateRef} className="cert-print-area">
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
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
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
