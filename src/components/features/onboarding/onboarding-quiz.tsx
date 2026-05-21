"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { MandalaBackdrop } from "./mandala-backdrop";

// ── Step Data ────────────────────────────────────────────────────────

interface QuizAnswer {
  goal: string;
  experience: string;
  focusPillars: string[];
  wakeUpTime: string;
  commitmentLevel: string;
  motivation: string;
}

const STEPS = [
  {
    id: "goal",
    question: "What is your primary transformation goal?",
    subtitle: "This helps us personalize your 48-day journey",
    type: "single" as const,
    options: [
      { value: "physical", label: "Physical Wellness", desc: "Improve fitness, nutrition & sleep", icon: "\uD83C\uDFCB\uFE0F" },
      { value: "mental", label: "Mental Clarity", desc: "Reduce stress, sharpen focus & calm the mind", icon: "\uD83E\uDDE0" },
      { value: "spiritual", label: "Spiritual Growth", desc: "Deepen meditation, connect with inner self", icon: "\uD83E\uDDD8" },
      { value: "holistic", label: "Complete Transformation", desc: "All-round body, mind & spirit renewal", icon: "\u2728" },
    ],
  },
  {
    id: "experience",
    question: "What's your experience with Vedic practices?",
    subtitle: "We'll adjust the guidance level to match you",
    type: "single" as const,
    options: [
      { value: "beginner", label: "Complete Beginner", desc: "New to yoga, meditation & Ayurveda", icon: "\uD83C\uDF31" },
      { value: "some", label: "Some Experience", desc: "Tried meditation or yoga a few times", icon: "\uD83C\uDF3F" },
      { value: "regular", label: "Regular Practitioner", desc: "Have an existing practice I want to deepen", icon: "\uD83C\uDF33" },
      { value: "advanced", label: "Advanced", desc: "Deep knowledge of Vedic traditions", icon: "\uD83C\uDF1F" },
    ],
  },
  {
    id: "focusPillars",
    question: "Which pillars interest you most?",
    subtitle: "Select 3-5 pillars to focus on (you can change later)",
    type: "multi" as const,
    options: [
      { value: "morning-initiation", label: "Morning Ritual", desc: "Sacred morning routine", icon: "\uD83C\uDF05", color: "#FFD700" },
      { value: "nutrition-fasting", label: "Nutrition & Fasting", desc: "Ayurvedic eating & intermittent fasting", icon: "\uD83C\uDF4E", color: "#4CAF50" },
      { value: "thoughts-intention", label: "Thoughts & Intention", desc: "Mental clarity & positive mindset", icon: "\uD83D\uDCAD", color: "#9C27B0" },
      { value: "breathing-meditation", label: "Breathwork", desc: "Pranayama & meditation", icon: "\uD83C\uDF2C\uFE0F", color: "#00BCD4" },
      { value: "movement", label: "Movement & Yoga", desc: "Physical activity & yoga asanas", icon: "\uD83E\uDD38", color: "#FF5722" },
      { value: "healing-meditation", label: "Healing Meditation", desc: "Deep healing & energy work", icon: "\uD83D\uDC9C", color: "#E91E63" },
      { value: "sandhya-meditation", label: "Sandhya Meditation", desc: "Twilight meditation practice", icon: "\uD83C\uDF1C", color: "#FFC107" },
      { value: "gratitude", label: "Gratitude Practice", desc: "Daily gratitude journaling", icon: "\uD83D\uDE4F", color: "#8BC34A" },
      { value: "brahman-connection", label: "Connection to Brahman", desc: "Universal consciousness", icon: "\uD83D\uDD49\uFE0F", color: "#673AB7" },
      { value: "manifestation", label: "Manifestation", desc: "Attract your desires", icon: "\u2B50", color: "#FF9800" },
      { value: "sleep", label: "Sacred Sleep", desc: "Optimize rest & recovery", icon: "\uD83C\uDF19", color: "#3F51B5" },
    ],
  },
  {
    id: "wakeUpTime",
    question: "What time do you usually wake up?",
    subtitle: "We'll schedule your morning ritual accordingly",
    type: "single" as const,
    options: [
      { value: "before-5", label: "Before 5:00 AM", desc: "Brahma Muhurta - the sacred hour", icon: "\uD83C\uDF1F" },
      { value: "5-6", label: "5:00 - 6:00 AM", desc: "Early riser - great for practice", icon: "\uD83C\uDF05" },
      { value: "6-7", label: "6:00 - 7:00 AM", desc: "Moderate - room for adjustment", icon: "\u2600\uFE0F" },
      { value: "after-7", label: "After 7:00 AM", desc: "We'll work with your schedule", icon: "\u23F0" },
    ],
  },
  {
    id: "commitmentLevel",
    question: "How much time can you dedicate daily?",
    subtitle: "Be honest - consistency beats intensity",
    type: "single" as const,
    options: [
      { value: "15min", label: "15 Minutes", desc: "Quick but consistent practice", icon: "\u23F1\uFE0F" },
      { value: "30min", label: "30 Minutes", desc: "Balanced daily practice", icon: "\u23F2\uFE0F" },
      { value: "45min", label: "45 Minutes", desc: "Deep immersive practice", icon: "\u23F3" },
      { value: "60plus", label: "60+ Minutes", desc: "Full transformation routine", icon: "\uD83D\uDD25" },
    ],
  },
  {
    id: "motivation",
    question: "What motivates you to start this journey?",
    subtitle: "This helps us keep you inspired along the way",
    type: "single" as const,
    options: [
      { value: "health", label: "Better Health", desc: "Improve physical & mental wellbeing", icon: "\uD83D\uDCAA" },
      { value: "peace", label: "Inner Peace", desc: "Find calm in a chaotic world", icon: "\u262E\uFE0F" },
      { value: "discipline", label: "Build Discipline", desc: "Create lasting positive habits", icon: "\uD83C\uDFAF" },
      { value: "purpose", label: "Find Purpose", desc: "Discover deeper meaning in life", icon: "\uD83D\uDD2E" },
    ],
  },
];

// ── Component ────────────────────────────────────────────────────────

export function OnboardingQuiz() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const welcomeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Play the CEO welcome cue once when the user lands on the first step.
  // Best-effort — autoplay may be blocked until the user clicks, which is fine
  // because the page itself is meaningful without audio.
  useEffect(() => {
    if (currentStep !== 0) return;
    const audio = new Audio("/audio/onboarding/welcome.mp3");
    audio.volume = 0.9;
    audio.play().catch(() => {});
    welcomeAudioRef.current = audio;
    return () => {
      try { audio.pause(); audio.currentTime = 0; } catch {}
      welcomeAudioRef.current = null;
    };
  }, [currentStep]);
  const [answers, setAnswers] = useState<Partial<QuizAnswer>>({});
  const [saving, setSaving] = useState(false);

  const step = STEPS[currentStep];
  const totalSteps = STEPS.length;
  const progress = ((currentStep) / totalSteps) * 100;

  function handleSingleSelect(value: string) {
    setAnswers((prev) => ({ ...prev, [step.id]: value }));
    // Auto-advance after a brief delay for visual feedback
    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((s) => s + 1);
      }
    }, 300);
  }

  function handleMultiSelect(value: string) {
    setAnswers((prev) => {
      const current = (prev.focusPillars || []) as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, focusPillars: updated };
    });
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  function handleNext() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  async function markOnboardingComplete() {
    // Always flips the user's onboardingCompleted bit so the (main)
    // layout's guard stops redirecting back here. Returns when done so
    // callers can navigate after the flag has propagated to localStorage.
    try {
      await apiFetch("/data/user", {
        method: "PATCH",
        body: JSON.stringify({
          onboardingCompleted: true,
          onboardingData: answers,
        }),
      });
    } catch {
      // Network/API failure — still flip the local flag so the user
      // doesn't get stuck on /onboarding. Server will reconcile later.
    }
    const savedUser = localStorage.getItem("vedic-user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        user.onboardingCompleted = true;
        localStorage.setItem("vedic-user", JSON.stringify(user));
      } catch {
        // ignore malformed cached user
      }
    }
  }

  async function handleComplete() {
    setSaving(true);
    await markOnboardingComplete();
    // Save focus pillars if selected (only on full completion, not skip)
    if (answers.focusPillars && answers.focusPillars.length > 0) {
      try {
        await apiFetch("/data/focus-pillars", {
          method: "PUT",
          body: JSON.stringify({ pillars: answers.focusPillars }),
        });
      } catch {}
    }
    router.push("/dashboard");
  }

  async function handleSkip() {
    // Skips the *entire* onboarding flow. Wired to the header "Exit setup"
    // button. Different from handleSkipStep below, which advances past a
    // single question while keeping the user inside the flow.
    setSaving(true);
    await markOnboardingComplete();
    router.push("/dashboard");
  }

  async function handleSkipStep() {
    // Advances past the current question without recording an answer for
    // it. On the last step, treats the skip as a graceful completion so
    // the user still ends up on the dashboard with their prior answers
    // saved.
    if (isLastStep) {
      await handleComplete();
      return;
    }
    setCurrentStep((s) => s + 1);
  }

  const isStepComplete = () => {
    if (step.id === "focusPillars") {
      return (answers.focusPillars || []).length >= 3;
    }
    return !!answers[step.id as keyof QuizAnswer];
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white flex flex-col relative overflow-hidden">
      <MandalaBackdrop />

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c.5 2.5 2 4.5 2 7a4 4 0 0 1-8 0c0-2.5 1.5-4.5 2-7" />
              <path d="M12 22v-4" /><path d="M8 22h8" />
            </svg>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            10X Vedic Transform
          </span>
        </Link>
        <button
          onClick={handleSkip}
          disabled={saving}
          aria-label="Exit setup and go to the dashboard"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          {saving ? "Exiting…" : "Exit setup"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6">
        <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Step {currentStep + 1} of {totalSteps}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {step.question}
            </h2>
            <p className="text-gray-500 text-sm">{step.subtitle}</p>
          </div>

          {/* Options Grid */}
          <div className={`grid gap-3 ${
            step.options.length > 6 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
          }`}>
            {step.options.map((option) => {
              const isSelected = step.type === "multi"
                ? (answers.focusPillars || []).includes(option.value)
                : answers[step.id as keyof QuizAnswer] === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() =>
                    step.type === "multi"
                      ? handleMultiSelect(option.value)
                      : handleSingleSelect(option.value)
                  }
                  className={`
                    relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200
                    ${isSelected
                      ? "border-[#DAA520] bg-amber-50/80 shadow-md shadow-amber-200/30"
                      : "border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/30"
                    }
                  `}
                >
                  {/* Selection indicator */}
                  {step.type === "multi" && (
                    <div className={`
                      mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${isSelected
                        ? "bg-gradient-to-br from-orange-500 to-amber-500 border-amber-500"
                        : "border-gray-300"
                      }
                    `}>
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
                          <polyline points="2 6 5 9 10 3" />
                        </svg>
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{option.icon}</span>
                      <span className={`font-semibold text-sm ${isSelected ? "text-amber-800" : "text-gray-800"}`}>
                        {option.label}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isSelected ? "text-amber-600" : "text-gray-500"}`}>
                      {option.desc}
                    </p>
                  </div>

                  {/* Single select radio indicator */}
                  {step.type === "single" && (
                    <div className={`
                      mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${isSelected
                        ? "border-amber-500"
                        : "border-gray-300"
                      }
                    `}>
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-orange-500 to-amber-500" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Multi-select helper text */}
          {step.type === "multi" && (
            <p className={`text-center text-xs mt-3 ${
              (answers.focusPillars || []).length >= 3 ? "text-green-600" : "text-gray-400"
            }`}>
              {(answers.focusPillars || []).length} selected
              {(answers.focusPillars || []).length < 3 && " (select at least 3)"}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="px-6 py-4 border-t-2 border-[#DAA520]/20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSkipStep}
              disabled={saving}
              aria-label={
                isLastStep
                  ? "Skip this question and finish setup"
                  : "Skip this question and continue"
              }
              className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 underline-offset-2 hover:underline transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Skip this question
            </button>

            {step.type === "multi" || isLastStep ? (
            <button
              onClick={isLastStep ? handleComplete : handleNext}
              disabled={!isStepComplete() || saving}
              className="px-8 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Personalizing...
                </span>
              ) : isLastStep ? (
                "Start My Journey"
              ) : (
                "Continue"
              )}
            </button>
          ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
