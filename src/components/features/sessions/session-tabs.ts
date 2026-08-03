// The catalogue of guided sessions, in one place.
//
// Lifted out of the page so the index (SessionsIndex) and the router
// (/sessions) read the same list instead of restating it. Order MUST stay in
// lockstep with SESSION_KEYS in src/lib/practice-routes.ts for the first nine
// entries — sessionKeyToTabIndex() resolves ?practice= by position.
//
// The nine pillar practices carry a `key` (their SessionKey, which is also
// what fires the pillar check-in). The six later additions have no pillar, so
// they carry a `slug` instead; both are addressable as ?practice=<value>.

import {
  Sun,
  Timer,
  Wind,
  UtensilsCrossed,
  Dumbbell,
  SunMedium,
  Infinity as InfinityIcon,
  Sparkles,
  Moon,
  PersonStanding,
  Waves,
  Sunrise,
  Music2,
  Leaf,
  Flame,
} from "lucide-react";
import type { SessionKey } from "@/lib/practice-routes";
import { MorningRoutine } from "./morning-routine";
import { MeditationTimer } from "./meditation-timer";
import { BreathingPatterns } from "./breathing-patterns";
import { FastingTimer } from "./fasting-timer";
import { MovementTimer } from "./movement-timer";
import { SandhyaPractice } from "./sandhya-practice";
import { BrahmanPractice } from "./brahman-practice";
import { ManifestationPractice } from "./manifestation-practice";
import { SleepPractice } from "./sleep-practice";
import { YogaFlow } from "./yoga-flow";
import { NidraPractice } from "./nidra-practice";
import { DinacharyaPractice } from "./dinacharya-practice";
import { MantraPractice } from "./mantra-practice";
import { ManasicPractice } from "./manasic-practice";
import { DoshaQuiz } from "./dosha-quiz";

export interface SessionTab {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  /** SessionKey for the nine pillar practices. */
  key?: SessionKey;
  /** URL token for the six non-pillar practices. */
  slug?: string;
  /** Shown on the index so a learner can pick by time available. */
  duration: string;
}

export const SESSION_TABS: SessionTab[] = [
  // The nine pillar practices — order locked to SESSION_KEYS.
  { name: "Morning Routine", icon: Sun, component: MorningRoutine, key: "morning-routine", duration: "12 min" },
  { name: "Fasting", icon: UtensilsCrossed, component: FastingTimer, key: "fasting", duration: "16 h window" },
  { name: "Breathing", icon: Wind, component: BreathingPatterns, key: "breathing", duration: "6 min" },
  { name: "Movement", icon: Dumbbell, component: MovementTimer, key: "movement", duration: "15 min" },
  { name: "Meditation", icon: Timer, component: MeditationTimer, key: "meditation", duration: "10 min" },
  { name: "Sandhya", icon: SunMedium, component: SandhyaPractice, key: "sandhya", duration: "8 min" },
  { name: "Brahman", icon: InfinityIcon, component: BrahmanPractice, key: "brahman", duration: "5 min" },
  { name: "Manifest", icon: Sparkles, component: ManifestationPractice, key: "manifestation", duration: "7 min" },
  { name: "Sleep", icon: Moon, component: SleepPractice, key: "sleep", duration: "10 min" },
  // Later additions — appended so the pillar indices above stay valid.
  { name: "Yoga Flow", icon: PersonStanding, component: YogaFlow, slug: "yoga", duration: "15 min" },
  { name: "Yoga Nidra", icon: Waves, component: NidraPractice, slug: "nidra", duration: "20 min" },
  { name: "Dinacharya", icon: Sunrise, component: DinacharyaPractice, slug: "dinacharya", duration: "daily rhythm" },
  { name: "Mantra", icon: Music2, component: MantraPractice, slug: "mantra", duration: "11 min" },
  { name: "Manasic Puja", icon: Flame, component: ManasicPractice, slug: "manasic", duration: "5–10 min" },
  { name: "Dosha Quiz", icon: Leaf, component: DoshaQuiz, slug: "dosha", duration: "3 min" },
];

/**
 * Resolves ?practice=<token> to a session.
 *
 * Returns undefined for a missing or unknown token so /sessions can show the
 * index rather than silently opening an arbitrary practice — which is what it
 * used to do, defaulting every unrecognised link to Morning Routine.
 */
export function sessionTabForParam(
  param: string | null | undefined,
): SessionTab | undefined {
  if (!param) return undefined;
  return SESSION_TABS.find((t) => t.key === param || t.slug === param);
}
