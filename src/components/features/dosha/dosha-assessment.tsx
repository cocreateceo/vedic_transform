"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

// ── Dosha Questions ──────────────────────────────────────────────────

interface DoshaQuestion {
  id: string;
  question: string;
  category: string;
  options: { label: string; vata: number; pitta: number; kapha: number }[];
}

const QUESTIONS: DoshaQuestion[] = [
  {
    id: "body-frame",
    question: "What best describes your body frame?",
    category: "Physical",
    options: [
      { label: "Thin, light, and lean with narrow shoulders", vata: 3, pitta: 0, kapha: 0 },
      { label: "Medium build, muscular, well-proportioned", vata: 0, pitta: 3, kapha: 0 },
      { label: "Broad, solid, naturally strong and sturdy", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "skin-type",
    question: "How would you describe your skin?",
    category: "Physical",
    options: [
      { label: "Dry, rough, cool to touch, prone to cracking", vata: 3, pitta: 0, kapha: 0 },
      { label: "Warm, oily, sensitive, prone to redness/rashes", vata: 0, pitta: 3, kapha: 0 },
      { label: "Thick, smooth, soft, cool and moist", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "hair-type",
    question: "What is your hair like?",
    category: "Physical",
    options: [
      { label: "Dry, thin, frizzy, or curly", vata: 3, pitta: 0, kapha: 0 },
      { label: "Fine, straight, oily, early greying or thinning", vata: 0, pitta: 3, kapha: 0 },
      { label: "Thick, wavy, lustrous, and strong", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "appetite",
    question: "How is your appetite?",
    category: "Digestion",
    options: [
      { label: "Irregular — sometimes ravenous, sometimes no appetite", vata: 3, pitta: 0, kapha: 0 },
      { label: "Strong and sharp — I get irritable if I miss a meal", vata: 0, pitta: 3, kapha: 0 },
      { label: "Steady but moderate — I can easily skip meals", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "digestion",
    question: "How is your digestion?",
    category: "Digestion",
    options: [
      { label: "Irregular with gas, bloating, or constipation", vata: 3, pitta: 0, kapha: 0 },
      { label: "Fast — occasional acid reflux or loose stools", vata: 0, pitta: 3, kapha: 0 },
      { label: "Slow but steady — feel heavy after large meals", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "sleep-pattern",
    question: "How do you sleep?",
    category: "Sleep",
    options: [
      { label: "Light sleeper, wake easily, difficulty falling asleep", vata: 3, pitta: 0, kapha: 0 },
      { label: "Moderate — sleep well but may wake from heat or dreams", vata: 0, pitta: 3, kapha: 0 },
      { label: "Deep and heavy sleeper, hard to wake up", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "energy-pattern",
    question: "How does your energy fluctuate through the day?",
    category: "Energy",
    options: [
      { label: "Bursts of energy followed by fatigue — very variable", vata: 3, pitta: 0, kapha: 0 },
      { label: "High and focused energy, but can burn out intensely", vata: 0, pitta: 3, kapha: 0 },
      { label: "Steady and enduring — slow to start but long-lasting", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "mind-nature",
    question: "How does your mind typically work?",
    category: "Mental",
    options: [
      { label: "Quick, restless, many ideas, hard to focus", vata: 3, pitta: 0, kapha: 0 },
      { label: "Sharp, focused, analytical, sometimes critical", vata: 0, pitta: 3, kapha: 0 },
      { label: "Calm, steady, methodical, sometimes slow to decide", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "stress-response",
    question: "How do you respond to stress?",
    category: "Emotional",
    options: [
      { label: "Anxiety, worry, fear — I overthink and get nervous", vata: 3, pitta: 0, kapha: 0 },
      { label: "Irritation, anger, frustration — I get heated", vata: 0, pitta: 3, kapha: 0 },
      { label: "Withdrawal, avoidance, comfort-seeking — I shut down", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "weather-preference",
    question: "What weather do you dislike most?",
    category: "Physical",
    options: [
      { label: "Cold, dry, and windy weather", vata: 3, pitta: 0, kapha: 0 },
      { label: "Hot, humid, and sunny weather", vata: 0, pitta: 3, kapha: 0 },
      { label: "Cold, damp, and rainy weather", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "learning-style",
    question: "How do you learn best?",
    category: "Mental",
    options: [
      { label: "Learn quickly but forget quickly — need repetition", vata: 3, pitta: 0, kapha: 0 },
      { label: "Grasp concepts fast with focus — good memory for details", vata: 0, pitta: 3, kapha: 0 },
      { label: "Take time to learn but remember for a long time", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: "social-nature",
    question: "How are you socially?",
    category: "Emotional",
    options: [
      { label: "Talkative, enthusiastic, make friends easily but surface-level", vata: 3, pitta: 0, kapha: 0 },
      { label: "Selective, persuasive, natural leader, competitive", vata: 0, pitta: 3, kapha: 0 },
      { label: "Loyal, nurturing, few deep relationships, supportive", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
];

// ── Dosha Results ────────────────────────────────────────────────────

interface DoshaResult {
  primary: "vata" | "pitta" | "kapha";
  secondary: "vata" | "pitta" | "kapha";
  scores: { vata: number; pitta: number; kapha: number };
  percentages: { vata: number; pitta: number; kapha: number };
}

const DOSHA_INFO: Record<string, { name: string; sanskrit: string; element: string; color: string; qualities: string[]; recommendations: string[] }> = {
  vata: {
    name: "Vata",
    sanskrit: "\u0935\u093E\u0924",
    element: "Air + Space (Ether)",
    color: "#00BCD4",
    qualities: ["Creative & Imaginative", "Quick Learner", "Energetic in Bursts", "Adaptable & Flexible"],
    recommendations: [
      "Follow a regular daily routine with consistent meal times",
      "Favor warm, cooked, nourishing foods with healthy fats",
      "Practice grounding yoga poses and slow breathing exercises",
      "Prioritize warm oil self-massage (Abhyanga) before bathing",
      "Focus on the Sleep, Morning Ritual, and Breathing pillars",
    ],
  },
  pitta: {
    name: "Pitta",
    sanskrit: "\u092A\u093F\u0924\u094D\u0924",
    element: "Fire + Water",
    color: "#FF5722",
    qualities: ["Sharp Intellect", "Natural Leader", "Strong Digestion", "Determined & Focused"],
    recommendations: [
      "Avoid excessive heat — favor cooling foods and environments",
      "Practice calming, non-competitive exercise like swimming or yoga",
      "Include sweet, bitter, and astringent tastes in your diet",
      "Practice cooling breathwork (Sheetali Pranayama)",
      "Focus on the Gratitude, Healing Meditation, and Sandhya pillars",
    ],
  },
  kapha: {
    name: "Kapha",
    sanskrit: "\u0915\u092B",
    element: "Earth + Water",
    color: "#4CAF50",
    qualities: ["Calm & Grounded", "Loyal & Loving", "Strong Endurance", "Steady & Patient"],
    recommendations: [
      "Stay active with vigorous exercise — avoid daytime sleeping",
      "Favor light, warm, spicy foods — reduce heavy and sweet foods",
      "Wake early (before 6am) and keep a stimulating daily routine",
      "Practice energizing breathwork (Kapalabhati Pranayama)",
      "Focus on the Movement, Fasting, and Thoughts & Intention pillars",
    ],
  },
};

// ── Component ────────────────────────────────────────────────────────

export function DoshaAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState({ vata: 0, pitta: 0, kapha: 0 });
  const [result, setResult] = useState<DoshaResult | null>(null);
  const [saving, setSaving] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const totalQuestions = QUESTIONS.length;
  const progress = (currentQuestion / totalQuestions) * 100;

  function handleAnswer(optionIndex: number) {
    const option = question.options[optionIndex];
    const newScores = {
      vata: scores.vata + option.vata,
      pitta: scores.pitta + option.pitta,
      kapha: scores.kapha + option.kapha,
    };
    setScores(newScores);
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));

    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion((c) => c + 1), 250);
    } else {
      // Calculate result
      const total = newScores.vata + newScores.pitta + newScores.kapha;
      const percentages = {
        vata: Math.round((newScores.vata / total) * 100),
        pitta: Math.round((newScores.pitta / total) * 100),
        kapha: Math.round((newScores.kapha / total) * 100),
      };

      const sorted = Object.entries(newScores).sort((a, b) => b[1] - a[1]);
      const doshaResult: DoshaResult = {
        primary: sorted[0][0] as "vata" | "pitta" | "kapha",
        secondary: sorted[1][0] as "vata" | "pitta" | "kapha",
        scores: newScores,
        percentages,
      };

      setResult(doshaResult);
      saveResult(doshaResult);
    }
  }

  async function saveResult(doshaResult: DoshaResult) {
    setSaving(true);
    try {
      await apiFetch("/data/user", {
        method: "PATCH",
        body: JSON.stringify({
          doshaType: doshaResult.primary,
          doshaSecondary: doshaResult.secondary,
          doshaScores: doshaResult.scores,
          doshaAssessedAt: new Date().toISOString(),
        }),
      });
    } catch {
      // Silent fail
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    if (currentQuestion > 0) {
      // Undo score
      const prevAnswer = answers[QUESTIONS[currentQuestion - 1].id];
      if (prevAnswer !== undefined) {
        const prevOption = QUESTIONS[currentQuestion - 1].options[prevAnswer];
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
          {QUESTIONS.map((_, i) => (
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
