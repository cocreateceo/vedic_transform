// Soft prioritization for the Pillars page.
//
// All 11 pillars are always visible and tappable. The hierarchy is purely
// visual: focus pillars are "Active today", phase-recommended ones get
// gentle emphasis, the rest are "Quietly present". Nothing is locked.
//
// Day 1 stops feeling like 11 equal options. The system communicates
// where the user is without dictating what they can do.

import { getJourneyPhase, type JourneyPhase } from "./journey-phases";

export type PillarTier = "active" | "recommended" | "quiet";

export interface PillarTiers {
  active: Set<string>;        // user's focus pillars (priority order preserved by caller)
  recommended: Set<string>;   // phase-appropriate non-focus
  quiet: Set<string>;          // everything else
  phase: JourneyPhase;
}

/**
 * Buckets every pillar slug into one of three visual tiers given the
 * user's focus pillars and current journey day. Focus pillars always
 * win — even if a focus pillar is also "recommended by phase," it stays
 * in `active` (avoids double-counting).
 */
export function computePillarTiers(args: {
  allPillarSlugs: string[];
  focusPillarSlugs: string[];
  journeyDay: number;
}): PillarTiers {
  const phase = getJourneyPhase(args.journeyDay);

  const active = new Set(args.focusPillarSlugs);
  const recommended = new Set<string>(
    phase.recommendedPillars.filter((s) => !active.has(s)),
  );
  const quiet = new Set<string>(
    args.allPillarSlugs.filter((s) => !active.has(s) && !recommended.has(s)),
  );

  return { active, recommended, quiet, phase };
}

export function tierForPillar(
  pillarSlug: string,
  tiers: PillarTiers,
): PillarTier {
  if (tiers.active.has(pillarSlug)) return "active";
  if (tiers.recommended.has(pillarSlug)) return "recommended";
  return "quiet";
}
