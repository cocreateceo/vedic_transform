"use client";

import { forwardRef } from "react";
import { Award, Star, Flame } from "lucide-react";

interface JourneyCertificateProps {
  userName: string;
  startDate: Date;
  endDate: Date;
  totalKarma: number;
  completionRate: number;
  topPillar?: string;
}

export const JourneyCertificate = forwardRef<HTMLDivElement, JourneyCertificateProps>(
  ({ userName, startDate, endDate, totalKarma, completionRate, topPillar }, ref) => {
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <div
        ref={ref}
        className="w-full max-w-2xl mx-auto bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8 sm:p-12 rounded-2xl border-4 border-amber-200 shadow-xl print:shadow-none"
      >
        {/* Decorative corners */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
          <div className="absolute -top-4 -right-4 w-16 h-16 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

          <div className="text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Award className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-amber-800">
                Certificate of Transformation
              </h1>
              <p className="text-amber-600 text-lg">10X Vedic Journey</p>
            </div>

            {/* Main content */}
            <div className="space-y-4 py-6">
              <p className="text-gray-600 text-lg">This certifies that</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b-2 border-amber-300 inline-block px-8 pb-2">
                {userName}
              </h2>
              <p className="text-gray-600 text-lg">
                has successfully completed the
              </p>
              <p className="text-xl font-semibold text-amber-700">
                48-Day Vedic Transformation Program
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-amber-200">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-2xl font-bold text-amber-700">{totalKarma}</p>
                <p className="text-xs text-gray-500">Karma Points</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Award className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-green-700">{completionRate}%</p>
                <p className="text-xs text-gray-500">Completion</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-lg font-bold text-orange-700 truncate px-2">
                  {topPillar || "Master"}
                </p>
                <p className="text-xs text-gray-500">Top Pillar</p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex justify-between items-center text-sm text-gray-500 pt-4">
              <div>
                <p className="font-medium text-gray-700">Journey Started</p>
                <p>{formatDate(startDate)}</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif text-amber-400">✦</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-700">Journey Completed</p>
                <p>{formatDate(endDate)}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 space-y-2">
              <p className="text-sm text-amber-700 italic">
                "Through discipline, devotion, and daily practice,
                transformation becomes inevitable."
              </p>
              <p className="text-xs text-gray-400">
                10X Vedic Transformation • www.10xvedic.com
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

JourneyCertificate.displayName = "JourneyCertificate";
