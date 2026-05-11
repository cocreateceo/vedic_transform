import type { Metadata } from "next";
import { DoshaAssessment } from "@/components/features/dosha/dosha-assessment";

export const metadata: Metadata = {
  title: "Take the Dosha Test — 10X Vedic Transform",
  description: "12 questions, 2 minutes. Find your Vedic dosha and personalized practice recommendations.",
};

export default function DoshaTestQuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0d08] to-[#1a1508] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <DoshaAssessment mode="anonymous" />
      </div>
    </div>
  );
}
