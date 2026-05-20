"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  DOSHA_QUESTIONS,
  DOSHA_INFO,
  scoresToResult,
  ANON_DOSHA_KEY,
  type DoshaResult,
  type DoshaScores,
} from "@/lib/dosha";
import { getPosterByDosha } from "@/data/posters";
import { PosterSection } from "@/components/features/posters/poster-section";

export type DoshaAssessmentMode = "authenticated" | "anonymous";

interface DoshaAssessmentProps {
  /**
   * - "authenticated" (default) saves the result to /data/user and shows a
   *   "Go to Dashboard" CTA on completion.
   * - "anonymous" saves to /data/dosha-test/anonymous and redirects the
   *   browser to /dosha-test/result/[id] for the share-friendly view.
   */
  mode?: DoshaAssessmentMode;
}

export function DoshaAssessment({ mode = "authenticated" }: DoshaAssessmentProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState<DoshaScores>({ vata: 0, pitta: 0, kapha: 0 });
  const [result, setResult] = useState<DoshaResult | null>(null);
  const [saving, setSaving] = useState(false);

  const question = DOSHA_QUESTIONS[currentQuestion];
  const totalQuestions = DOSHA_QUESTIONS.length;
  const progress = (currentQuestion / totalQuestions) * 100;

  function handleAnswer(optionIndex: number) {
    const option = question.options[optionIndex];
    const newScores: DoshaScores = {
      vata: scores.vata + option.vata,
      pitta: scores.pitta + option.pitta,
      kapha: scores.kapha + option.kapha,
    };
    setScores(newScores);
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));

    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion((c) => c + 1), 250);
    } else {
      const doshaResult = scoresToResult(newScores);
      setResult(doshaResult);
      void persistResult(doshaResult);
    }
  }

  async function persistResult(doshaResult: DoshaResult) {
    setSaving(true);
    try {
      if (mode === "authenticated") {
        await apiFetch("/data/user", {
          method: "PATCH",
          body: JSON.stringify({
            doshaType: doshaResult.primary,
            doshaSecondary: doshaResult.secondary,
            doshaScores: doshaResult.scores,
            doshaAssessedAt: new Date().toISOString(),
          }),
        });
      } else {
        const res = await apiFetch("/data/dosha-test/anonymous", {
          method: "POST",
          body: JSON.stringify({
            primary: doshaResult.primary,
            secondary: doshaResult.secondary,
            scores: doshaResult.scores,
            percentages: doshaResult.percentages,
          }),
        });
        if (res?.id) {
          // Remember the result so it can be claimed after signup.
          try {
            localStorage.setItem(ANON_DOSHA_KEY, res.id);
          } catch {
            // Storage unavailable; ignored.
          }
          router.push(`/dosha-test/result/${res.id}`);
        }
      }
    } catch {
      // Silent fail — user still sees their result on-screen.
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    if (currentQuestion > 0) {
      const prevAnswer = answers[DOSHA_QUESTIONS[currentQuestion - 1].id];
      if (prevAnswer !== undefined) {
        const prevOption = DOSHA_QUESTIONS[currentQuestion - 1].options[prevAnswer];
        setScores((s) => ({
          vata: s.vata - prevOption.vata,
          pitta: s.pitta - prevOption.pitta,
          kapha: s.kapha - prevOption.kapha,
        }));
      }
      setCurrentQuestion((c) => c - 1);
    }
  }

  function restart() {
    setCurrentQuestion(0);
    setAnswers({});
    setScores({ vata: 0, pitta: 0, kapha: 0 });
    setResult(null);
  }

  // ── Result View ────────────────────────────────────────────────
  // In anonymous mode the redirect handles the result page; show a
  // brief "saving" state to avoid a flash of the inline result UI.
  if (result && mode === "anonymous") {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center text-gray-500">
        Preparing your result…
      </div>
    );
  }

  if (result) {
    const primary = DOSHA_INFO[result.primary];
    const secondary = DOSHA_INFO[result.secondary];

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="vedic-card p-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center">
          <h1 className="text-2xl font-bold mb-1">Your Dosha Profile</h1>
          <p className="text-orange-100 text-sm">Ayurvedic Constitution Assessment</p>
        </div>

        {/* Primary Dosha */}
        <div className="vedic-card p-6">
          <div className="text-center mb-6">
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3 text-white text-3xl font-bold"
              style={{ background: `linear-gradient(135deg, ${primary.color}, ${primary.color}cc)` }}
            >
              {primary.sanskrit}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {primary.name}-{secondary.name}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Primary: {primary.element} | Secondary: {secondary.element}
            </p>
          </div>

          {/* Score Bars */}
          <div className="space-y-3 mb-6">
            {(["vata", "pitta", "kapha"] as const).map((dosha) => {
              const info = DOSHA_INFO[dosha];
              const pct = result.percentages[dosha];
              return (
                <div key={dosha} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-16">{info.name}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${pct}%`, backgroundColor: info.color }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700 w-12 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Qualities */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Your Natural Strengths</h3>
            <div className="grid grid-cols-2 gap-2">
              {primary.qualities.map((q) => (
                <div key={q} className="flex items-center gap-2 text-sm text-gray-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200/50">
                  <span className="text-amber-500">&#10003;</span>
                  {q}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Personalized Recommendations for {primary.name}
            </h3>
            <div className="space-y-2">
              {primary.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dosha-matched posters */}
        {(() => {
          const yogaPoster = getPosterByDosha(result.primary, "yoga");
          const pranayamaPoster = getPosterByDosha(result.primary, "pranayama");
          if (!yogaPoster && !pranayamaPoster) return null;
          return (
            <div className="space-y-4">
              {yogaPoster && (
                <PosterSection
                  poster={yogaPoster}
                  heading={`${primary.name} Balancing Yoga`}
                />
              )}
              {pranayamaPoster && (
                <PosterSection
                  poster={pranayamaPoster}
                  heading={`Pranayama for ${primary.name}`}
                />
              )}
            </div>
          );
        })()}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={restart}
            className="flex-1 py-3 rounded-xl border-2 border-[#DAA520] text-amber-700 font-medium hover:bg-amber-50 transition-all"
          >
            Retake Assessment
          </button>
          <a
            href="/dashboard"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-center hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-amber-500/20 transition-all"
          >
            Go to Dashboard
          </a>
        </div>

        {saving && (
          <p className="text-center text-xs text-gray-400">Saving your dosha profile...</p>
        )}
      </div>
    );
  }

  // ── Quiz View ──────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="vedic-card p-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <h1 className="text-2xl font-bold mb-1">Dosha Assessment</h1>
        <p className="text-orange-100 text-sm">
          Discover your Ayurvedic constitution (Prakriti) to personalize your journey
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span className="text-amber-600 font-medium">{question.category}</span>
        </div>
        <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="vedic-card p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            const isSelected = answers[question.id] === i;
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-[#DAA520] bg-amber-50/80 shadow-md shadow-amber-200/30"
                    : "border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? "border-amber-500" : "border-gray-300"
                  }`}>
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-orange-500 to-amber-500" />
                    )}
                  </div>
                  <span className={`text-sm ${isSelected ? "text-amber-800 font-medium" : "text-gray-700"}`}>
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentQuestion === 0}
          className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <div className="flex gap-1">
          {DOSHA_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < currentQuestion ? "bg-amber-500" : i === currentQuestion ? "bg-orange-500 scale-125" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <div className="w-20" /> {/* Spacer for alignment */}
      </div>
    </div>
  );
}
