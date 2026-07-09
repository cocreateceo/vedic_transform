"use client";

// Manasic Puja — a guided *mental* offering (manasa puja). The worshipper makes
// each of the traditional upacharas (offerings) in the mind's eye, needing no
// physical samagri. A simple stepper walks the shodashopachara sequence, then
// seals with a mood check + check-in. Credits the `brahman-connection` pillar.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Check, Sparkles, ChevronRight, Flame } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { apiFetch } from "@/lib/api";
import { NextPracticeCta } from "./next-practice-cta";
import { MoodCheck, moodLabel, type MoodValue } from "./mood-check";
import { SessionIntro } from "./session-intro";
import { SESSION_INTROS } from "./session-intros";
import { hapticTap } from "@/lib/utils/haptics";

const SESSION_PILLAR = "brahman-connection";

interface Upachara {
  sanskrit: string;
  name: string;
  instruction: string;
}

// A condensed, contemplative sequence of mental offerings.
const OFFERINGS: Upachara[] = [
  {
    sanskrit: "Āvāhana",
    name: "Invocation",
    instruction:
      "Settle, and in your heart's space invite the divine — as light, as presence, as whatever form is dear to you. Feel it arrive.",
  },
  {
    sanskrit: "Āsana",
    name: "The seat",
    instruction:
      "Offer a seat — a lotus of soft light. Let the presence settle there, fully welcome, fully at home.",
  },
  {
    sanskrit: "Pādya",
    name: "Water",
    instruction:
      "Offer cool, clear water to the feet and hands. Imagine it washing away all that is stale in you as you give.",
  },
  {
    sanskrit: "Puṣpa",
    name: "Flowers",
    instruction:
      "Offer fragrant flowers — jasmine, marigold, rose. Let their scent fill the space. Offer, too, the flower of your own heart.",
  },
  {
    sanskrit: "Dhūpa",
    name: "Incense",
    instruction:
      "Offer the rising smoke of incense. Watch it spiral upward and dissolve — like the mind's restlessness, let it thin and clear.",
  },
  {
    sanskrit: "Dīpa",
    name: "The lamp",
    instruction:
      "Offer the flame of a lamp. Hold its steady, golden light before the presence — and feel it kindle the same light within you.",
  },
  {
    sanskrit: "Naivedya",
    name: "Food",
    instruction:
      "Offer something sweet — fruit, or a handful of payasam. Offer it freely, wanting nothing back. Then receive it as prasada.",
  },
  {
    sanskrit: "Praṇāma",
    name: "The bow",
    instruction:
      "Bow. Lay down every wish, every burden. Rest in the silence after the bow, and receive the blessing that is already yours.",
  },
];

export function ManasicPractice() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [moodBefore, setMoodBefore] = useState<MoodValue | null>(null);
  const [moodAfter, setMoodAfter] = useState<MoodValue | null>(null);
  const [karmaAwarded, setKarmaAwarded] = useState<number | null>(null);

  const offering = OFFERINGS[step];
  const isLast = step >= OFFERINGS.length - 1;

  const advance = () => {
    hapticTap(12);
    if (isLast) setDone(true);
    else setStep((s) => s + 1);
  };

  const sealSession = () => {
    setSealed(true);
    apiFetch("/data/checkin", {
      method: "POST",
      body: JSON.stringify({
        pillarSlug: SESSION_PILLAR,
        moodBefore: moodLabel(moodBefore),
        moodAfter: moodLabel(moodAfter),
      }),
    })
      .then((res) => setKarmaAwarded(res?.karmaAwarded ?? 0))
      .catch(() => {});
  };

  const reset = () => {
    setStep(0);
    setDone(false);
    setSealed(false);
    setMoodAfter(null);
    setKarmaAwarded(null);
  };

  if (!started) {
    return (
      <SessionIntro
        {...SESSION_INTROS.manasic}
        onBegin={() => setStarted(true)}
      />
    );
  }

  return (
    <div
      className="relative min-h-[540px] p-8 rounded-2xl overflow-hidden flex flex-col items-center gap-6"
      style={{ background: "radial-gradient(circle at 50% 25%, #3a2410, #0a0604)" }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#FCD34D" }}
      >
        Manasa Puja · मानस पूजा
      </p>

      {!done ? (
        <>
          {/* Progress dots */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {OFFERINGS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i < step
                    ? "w-2 bg-amber-400/60"
                    : i === step
                      ? "w-6 bg-amber-300"
                      : "w-2 bg-white/15",
                )}
              />
            ))}
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
            <Flame className="h-8 w-8 text-white" />
          </div>

          <div className="w-full max-w-md text-center">
            <p className="text-2xl font-bold text-white">{offering.sanskrit}</p>
            <p className="text-sm uppercase tracking-wide text-amber-300/80">
              {offering.name}
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              {offering.instruction}
            </p>
          </div>

          {/* Before-mood gate on the first offering (non-blocking) */}
          {step === 0 && (
            <MoodCheck
              value={moodBefore}
              onChange={setMoodBefore}
              prompt="Before you begin — how do you feel?"
              light
            />
          )}

          <Button size="lg" onClick={advance} className="min-w-[200px]">
            {isLast ? "Complete the offering" : "Next offering"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </>
      ) : !sealed ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-emerald-700">
            <Check className="h-4 w-4" /> Offering complete
          </span>
          <MoodCheck
            value={moodAfter}
            onChange={setMoodAfter}
            prompt="After the puja — how do you feel?"
            light
          />
          <Button size="lg" onClick={sealSession} className="min-w-[200px]">
            <Sparkles className="mr-2 h-4 w-4" />
            Seal this session
          </Button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          {moodBefore && moodAfter && (
            <p className="text-sm text-white/85">
              You moved from{" "}
              <span className="font-semibold text-white">
                {moodLabel(moodBefore)}
              </span>{" "}
              to{" "}
              <span className="font-semibold" style={{ color: "#FFD700" }}>
                {moodLabel(moodAfter)}
              </span>
              .
            </p>
          )}
          {karmaAwarded !== null && karmaAwarded > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
              <Sparkles className="h-4 w-4" /> +{karmaAwarded} karma earned
            </span>
          )}
          <NextPracticeCta justCompletedPillarSlug={SESSION_PILLAR} />
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" /> Offer again
          </Button>
        </div>
      )}
    </div>
  );
}
