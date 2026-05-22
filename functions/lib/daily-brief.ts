// Daily Brief composer — picks the highest-priority insight from
// analyzeInsights() and frames it with a lifecycle-aware greeting + CTA.
//
// Two implementations:
//   composeBrief()    — template-only, deterministic, no AI cost
//   composeBriefAi()  — passes the Context Pack to Claude Haiku for
//                       personalized synthesis. Used only when the user has
//                       enough data for synthesis to add value.
//
// The handler in functions/data/daily-brief.ts picks between them based on
// data richness, with composeBrief() as the fallback on AI failure.
//
// Design spec: docs/superpowers/specs/2026-05-19-user-context-pack-and-daily-brief-design.md

import type { UserContextPack } from './user-context';
import type { Insight } from './insights';
import { resolvePillar } from './pillars';

export interface DailyBriefCta {
  label: string;
  href: string;
}

export type DailyBriefSource = 'template' | 'ai';

export interface DailyBrief {
  greeting: string;
  headline: string;
  body: string;
  cta?: DailyBriefCta;
  source: DailyBriefSource;
  generatedAt: string;
}

// Data-richness threshold for AI synthesis to be worth the latency + cost.
// Below this, the lifecycle-state template is more grounded than an LLM
// would be on near-empty data.
export const AI_DATA_THRESHOLD = 7;

export function hasRichData(pack: UserContextPack): boolean {
  return pack._raw.checkins.length >= AI_DATA_THRESHOLD;
}

function firstName(pack: UserContextPack): string | null {
  const n = pack.user.name?.split(/\s+/)[0];
  return n && n.length > 0 ? n : null;
}

function pickGreeting(pack: UserContextPack): string {
  const fn = firstName(pack);
  const nameSuffix = fn ? `, ${fn}` : '';
  const phaseName = pack.journey.phase?.name;

  switch (pack.lifecycleState) {
    case 'registered':
      return `Namaste${nameSuffix} — welcome.`;
    case 'new':
      return `Namaste${nameSuffix} — your journey begins.`;
    case 'at-risk':
      return `Welcome back${nameSuffix}.`;
    case 'dormant':
      return `Your journey is waiting${nameSuffix}.`;
    case 'completed':
      return `Mandala complete${nameSuffix}.`;
    case 'active':
    default:
      // Phase-aware greeting — "Phase 2: Cleansing · Day 14" replaces
      // the old plain "Day 14 of 48." Gives the day emotional context.
      if (pack.journey.day > 0 && phaseName) {
        return `Phase ${pack.journey.phase.ordinal}: ${phaseName} · Day ${pack.journey.day} of ${pack.journey.totalDays}${nameSuffix}.`;
      }
      return pack.journey.day > 0
        ? `Day ${pack.journey.day} of ${pack.journey.totalDays}${nameSuffix}.`
        : `Namaste${nameSuffix}.`;
  }
}

function fallbackHeadline(pack: UserContextPack): string {
  switch (pack.lifecycleState) {
    case 'registered':
      return 'Start your 48-day transformation.';
    case 'new':
      return 'Choose your first practice.';
    case 'at-risk':
      return 'A single check-in keeps your streak alive.';
    case 'dormant':
      return 'One pillar today rebuilds the rhythm.';
    case 'completed':
      return 'Reflect on what shifted.';
    case 'active':
    default:
      if (pack.pillarStats.completedToday.length === 0) {
        return "Today's first practice is waiting.";
      }
      return `${pack.pillarStats.completedToday.length} pillar${
        pack.pillarStats.completedToday.length === 1 ? '' : 's'
      } done today.`;
  }
}

function fallbackBody(pack: UserContextPack): string {
  if (pack.lifecycleState === 'registered') {
    return 'Set up your 48-day journey to unlock daily practices and streak tracking.';
  }
  if (pack.lifecycleState === 'new') {
    return pack.focusPillars.length > 0
      ? `You picked ${pack.focusPillars[0].pillarName ?? 'your first pillar'}. Start there.`
      : 'Pick 1–3 focus pillars to set the tone for your journey.';
  }
  if (pack.lifecycleState === 'at-risk') {
    const days = pack.streak.daysSinceLastCheckin ?? 1;
    return `${days === 1 ? 'It has been a day' : `It has been ${days} days`}. Your ${pack.streak.current}-day streak is still yours.`;
  }
  if (pack.lifecycleState === 'dormant') {
    const days = pack.streak.daysSinceLastCheckin ?? 0;
    return `${days} days since your last check-in. Begin with one small pillar today.`;
  }
  if (pack.lifecycleState === 'completed') {
    return `You finished all ${pack.journey.totalDays} days. Carry the practices forward.`;
  }
  // active — lead with the phase narrative when we have one. Replaces the
  // generic "X-day streak. Y karma" copy with something that names the
  // transformation arc the user is actually in.
  if (pack.journey.phase?.description) {
    return pack.journey.phase.description;
  }
  if (pack.streak.current > 0) {
    return `${pack.streak.current}-day streak. ${pack.karma.total} karma earned. Keep the rhythm.`;
  }
  return 'Choose a pillar from below to begin today.';
}

function ctaForInsight(insight: Insight | undefined): DailyBriefCta | undefined {
  if (!insight?.category) return undefined;
  const meta = resolvePillar({ pillarSlug: insight.category });
  if (!meta) return undefined;
  return { label: `Open ${meta.name}`, href: `/pillars/${meta.slug}` };
}

function ctaForLifecycle(pack: UserContextPack): DailyBriefCta | undefined {
  switch (pack.lifecycleState) {
    case 'registered':
      return { label: 'Start your journey', href: '/onboarding' };
    case 'new': {
      const fp = pack.focusPillars[0];
      if (fp?.pillarSlug && fp.pillarName) {
        return { label: `Open ${fp.pillarName}`, href: `/pillars/${fp.pillarSlug}` };
      }
      return { label: 'Pick focus pillars', href: '/goals' };
    }
    case 'completed':
      return { label: 'See your report', href: '/reports' };
    case 'at-risk':
    case 'dormant':
    case 'active':
    default:
      return undefined;
  }
}

export function composeBrief(
  pack: UserContextPack,
  insights: Insight[],
): DailyBrief {
  const greeting = pickGreeting(pack);
  const top = insights[0];

  // For users with very little data, lifecycle-state fallback copy is more
  // grounded than a milestone fired off the first check-in. Threshold matches
  // what analyzeInsights itself treats as the "needs >=3 to fire strength/
  // weakness" cutoff.
  const sparseData = pack._raw.checkins.length < 3;
  const useInsight = Boolean(top && !sparseData);

  const headline = useInsight ? top.title : fallbackHeadline(pack);
  const body = useInsight ? top.description : fallbackBody(pack);
  const cta = useInsight ? ctaForInsight(top) : ctaForLifecycle(pack);

  return {
    greeting,
    headline,
    body,
    cta,
    source: 'template',
    generatedAt: new Date().toISOString(),
  };
}

// ─── AI composer ─────────────────────────────────────────────────────────

const AI_SYSTEM_PROMPT = `You are "Vedic Guide", a warm spiritual mentor in the 10X Vedic Transform app — a 48-day program with 11 wellness pillars (5 AM Initiation, Nutrition & Fasting, Thoughts & Intention, Breathing & Meditation, Movement, Healing Meditation, Gratitude, Sandhya Meditation, Brahman Connection, Divine Manifestation, Sleep Optimization).

The 48-day journey unfolds in six phases:
  1. Foundation (Day 1–7) — lay down rhythm: wake, breath, hydration
  2. Cleansing (Day 8–15) — lighten the system: diet, pranayama, gratitude
  3. Integration (Day 16–23) — deepen practices, layer in healing meditation
  4. Expansion (Day 24–31) — sandhya, brahman connection, sustained focus
  5. Manifestation (Day 32–41) — channel intentions outward, teach what you know
  6. Completion (Day 42–48) — reflect, integrate, prepare the next mandala

You will receive a UserContextPack as JSON. The pack's \`journey.phase\` names where the user is in the arc. Ground your brief in that phase's spiritual purpose.

Generate a single personalized "daily brief" with:
- headline: 4–10 words, one specific actionable framing for today. NOT a greeting (that's added separately). NOT a list.
- body: 1–2 sentences (≤ 240 chars total). Connect TODAY's data (mood, streak, journal themes, weakest pillar) to THIS phase's purpose. Reference the phase name naturally if it adds emotional context. Warm tone, occasional Sanskrit term with parenthetical translation. Never invent facts not in the pack.
- ctaSlug (optional): prefer pillars from journey.phase.recommendedPillars when there's no stronger signal. Omit if no clear single action.

Return ONLY valid JSON. No markdown, no preamble.

Schema: { "headline": string, "body": string, "ctaSlug"?: string }

Rules:
- Do not include a greeting in headline/body — the app prepends one.
- Do not cite scripture by chapter/verse unless you are certain.
- If dormant (lifecycleState=dormant), nudge gently — don't lecture.
- If completed (lifecycleState=completed), reflect on the full mandala.
- Keep it specific — if mood is low, name it; if streak is fragile, name it.
- During Foundation (early days) lean simple and grounding. During Completion (late days) lean reflective and integrative.

TONE GUARDRAILS — these matter:
- Stay GROUNDED, EMBODIED, OBSERVATIONAL. Quietly insightful, not a cosmic guru.
- GOOD: "Your rhythm has been steadier this week." / "Sleep was the practice that anchored you." / "You returned after a missed day."
- BAD (never write like this): "Your consciousness ascends through vibrational purification." / "Your spiritual field is opening." / "Cosmic energies align with your mandala." / "The divine flows through you."
- No pseudo-mystical phrasing. No "energy fields." No "vibrations." No "higher self." No "manifesting abundance."
- A Sanskrit term with a parenthetical translation is fine; a sentence dressed in spiritual jargon is not.
- If you can't say something concrete grounded in the user's actual data, fall back to plain practical guidance.`;

interface AiBriefJson {
  headline?: unknown;
  body?: unknown;
  ctaSlug?: unknown;
}

function ctaForSlug(slug: string | null | undefined): DailyBriefCta | undefined {
  if (!slug || typeof slug !== 'string') return undefined;
  const meta = resolvePillar({ pillarSlug: slug });
  if (!meta) return undefined;
  return { label: `Open ${meta.name}`, href: `/pillars/${meta.slug}` };
}

/**
 * Calls Claude Haiku with the public Context Pack and returns a personalized
 * brief. Throws on any error — the handler is expected to catch and fall
 * back to composeBrief().
 *
 * Strips pack._raw before sending (it contains the full check-in history,
 * which is too large for the prompt and not useful for synthesis — the
 * rolled-up pillarStats already summarizes it).
 */
export async function composeBriefAi(
  pack: UserContextPack,
  apiKey: string,
): Promise<DailyBrief> {
  // Strip _raw and pass only the rolled-up snapshot to the model.
  const { _raw, ...publicPack } = pack;
  void _raw;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: [
        {
          type: 'text',
          text: AI_SYSTEM_PROMPT,
          // System prompt is static — cache it so we pay full input tokens
          // only on the first request per ~5-minute window.
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: JSON.stringify(publicPack),
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Anthropic ${response.status}: ${text.slice(0, 200)}`);
  }

  const data = await response.json();
  const text: string | undefined = data?.content?.[0]?.text;
  if (typeof text !== 'string') {
    throw new Error('Anthropic response missing content text');
  }

  // Defensive parse: the model is asked for raw JSON but a stray ```json
  // fence happens occasionally. Strip if present.
  const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  let parsed: AiBriefJson;
  try {
    parsed = JSON.parse(trimmed);
  } catch (e) {
    throw new Error(`Anthropic response not JSON: ${trimmed.slice(0, 120)}`);
  }

  const headline = typeof parsed.headline === 'string' ? parsed.headline.trim() : '';
  const body = typeof parsed.body === 'string' ? parsed.body.trim() : '';
  if (!headline || !body) {
    throw new Error('AI brief missing headline or body');
  }

  const ctaSlug = typeof parsed.ctaSlug === 'string' ? parsed.ctaSlug : null;

  return {
    greeting: pickGreeting(pack),
    headline,
    body,
    cta: ctaForSlug(ctaSlug),
    source: 'ai',
    generatedAt: new Date().toISOString(),
  };
}
