"use client";

// Divine Manifestation — write your intention, visualize for 60s, seal it.
// Three-step ritual: write → visualize → seal. Persists the intention to
// the journal (POST /data/journal type=intention) and fires a check-in for
// divine-manifestation on completion.

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, RotateCcw } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { NextPracticeCta } from "./next-practice-cta";

const SESSION_PILLAR = "divine-manifestation";

type Step = "write" | "visualize" | "seal";

export function ManifestationPractice() {
  const [intention, setIntention] = useState("");
  const [step, setStep] = useState<Step>("write");
  const [seconds, setSeconds] = useState(0);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);
  const checkinFiredRef = useRef(false);

  // Tick during visualization. At 60s, advance to seal.
  useEffect(() => {
    if (step !== "visualize") return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s + 1 >= 60) {
          setStep("seal");
          return 0;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  // On seal, persist intention (best-effort) and fire check-in.
  useEffect(() => {
    if (step !== "seal" || checkinFiredRef.current) return;
    checkinFiredRef.current = true;

    // Best-effort journal save.
    if (intention.trim()) {
      void apiFetch("/data/journal", {
        method: "POST",
        body: JSON.stringify({ type: "intention", intentionText: intention.trim() }),
      }).catch(() => {});
    }

    apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({ pillarSlug: SESSION_PILLAR }),
    })
      .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
      .catch(() => {});
  }, [step, intention]);

  const reset = () => {
    setIntention("");
    setStep("write");
    setSeconds(0);
    setKarmaAwarded(null);
    checkinFiredRef.current = false;
  };

  return (
    <div
      className="relative min-h-[540px] p-8 rounded-2xl overflow-hidden flex flex-col items-center gap-6"
      style={{ background: "linear-gradient(180deg, #FAF5FF 0%, #FEF3C7 100%)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7C3AED" }}>
        Sankalpa Shakti · सङ्कल्प शक्ति
      </p>
      <h2 className="text-2xl font-bold text-gray-900">Manifest with intention</h2>

      {step === "write" && (
        <>
          <div className="w-full max-w-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Write your intention in one clear sentence — present tense.
            </label>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              rows={3}
              placeholder="I am calm, clear, and grounded in everything I do."
              className="w-full p-4 border-2 border-purple-100 rounded-xl text-base bg-white shadow-sm outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 resize-none"
            />
          </div>
          <Button
            size="lg"
            onClick={() => intention.trim() && setStep("visualize")}
            disabled={!intention.trim()}
            className="min-w-[220px]"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Begin 60-sec visualization
          </Button>
        </>
      )}

      {step === "visualize" && (
        <>
          <div className="relative w-64 h-64">
            <svg viewBox="0 0 260 260" width="100%" height="100%">
              <defs>
                <radialGradient id="mf-core" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF8DC" />
                  <stop offset="60%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle
                cx="130"
                cy="130"
                r="120"
                fill="none"
                stroke="#A855F7"
                strokeWidth="3"
                opacity="0.3"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - seconds / 60)}
                transform="rotate(-90 130 130)"
              />
              <circle
                cx="130"
                cy="130"
                r="60"
                fill="url(#mf-core)"
                style={{
                  transform: `scale(${1 + Math.sin(seconds * 0.4) * 0.08})`,
                  transformOrigin: "130px 130px",
                  transition: "transform 0.2s",
                }}
              />
              <text x="130" y="138" textAnchor="middle" fontFamily="Plus Jakarta Sans, Inter, system-ui" fontSize="40" fontWeight="800" fill="#1a1a1a">
                {60 - seconds}
              </text>
            </svg>
          </div>
          <div className="text-center max-w-md">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              Visualize as if it&apos;s already true
            </p>
            <p className="text-xl font-bold italic" style={{ color: "#7C3AED" }}>
              &ldquo;{intention}&rdquo;
            </p>
          </div>
        </>
      )}

      {step === "seal" && (
        <div className="text-center flex flex-col items-center gap-3">
          <div
            className="w-24 h-24 rounded-full inline-flex items-center justify-center mb-2 shadow-lg"
            style={{ background: "linear-gradient(135deg, #fbbf24, #d97706)" }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900">Sealed in.</h3>
          <p className="text-gray-600 max-w-sm leading-relaxed">
            Your intention has been sent. Now — release attachment to the outcome.
          </p>
          {karmaAwarded !== null && karmaAwarded > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              +{karmaAwarded} karma earned
            </span>
          )}
          <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Set another
          </Button>
        </div>
      )}
    </div>
  );
}
