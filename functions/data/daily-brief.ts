// GET /data/daily-brief — composes a personalized brief from the User
// Context Pack. AI synthesis for users with rich data; template fallback
// for everyone else and on any AI failure.
//
// Design spec: docs/superpowers/specs/2026-05-19-user-context-pack-and-daily-brief-design.md

import { Resource } from 'sst';
import { ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';
import { getUserContextPack } from '../lib/user-context';
import { analyzeInsights } from '../lib/insights';
import {
  composeBrief,
  composeBriefAi,
  hasRichData,
  type DailyBrief,
} from '../lib/daily-brief';
import { emit, EventType } from '../lib/events';

function getAnthropicKey(): string | null {
  try {
    return Resource.AnthropicApiKey.value;
  } catch {
    return null;
  }
}

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const pack = await getUserContextPack(user.id);

  const insights = analyzeInsights({
    checkins: pack._raw.checkins,
    streakCurrent: pack.streak.current,
    journeyDay: pack.journey.day,
    totalKarma: pack.karma.total,
  });

  // Try AI when data is rich AND the API key is linked. Any error falls
  // back to the deterministic template — the user always sees a brief.
  let brief: DailyBrief;
  const apiKey = getAnthropicKey();
  if (apiKey && hasRichData(pack)) {
    try {
      brief = await composeBriefAi(pack, apiKey);
    } catch (e: any) {
      console.error('daily-brief: AI generation failed, falling back', e?.message);
      brief = composeBrief(pack, insights);
    }
  } else {
    brief = composeBrief(pack, insights);
  }

  // _raw is internal — strip before returning.
  const { _raw, ...publicPack } = pack;
  void _raw;

  void emit(user.id, EventType.BRIEF_VIEWED, {
    source: brief.source,
    lifecycleState: pack.lifecycleState,
    journeyDay: pack.journey.day,
  });

  return ok({ brief, contextPack: publicPack });
}
