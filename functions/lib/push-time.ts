// Shared helpers for time/journey lookups used by the push crons.

import { Resource } from 'sst';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db } from './utils';

/**
 * True if `targetTime` (HH:MM in user's timezone) falls within the current
 * 15-minute cron window. Crons run every 15 minutes; this answers "did this
 * user's target tick over since the previous run?"
 */
export function shouldFireAtUserLocalTime(targetTime: string, timezone: string): boolean {
  const [hStr, mStr] = (targetTime || '').split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return false;
  const targetMinutes = h * 60 + m;

  let localH: number;
  let localM: number;
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone || 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    localH = Number(parts.find((p) => p.type === 'hour')?.value);
    localM = Number(parts.find((p) => p.type === 'minute')?.value);
  } catch {
    // Bad/unknown IANA zone — fall back to UTC.
    const now = new Date();
    localH = now.getUTCHours();
    localM = now.getUTCMinutes();
  }

  if (!Number.isFinite(localH) || !Number.isFinite(localM)) return false;
  const localMinutes = localH * 60 + localM;

  const diff = ((localMinutes - targetMinutes) % 1440 + 1440) % 1440;
  return diff < 15;
}

/** Compute the user's `journeyDay` (1..48) from their active journey, or 0 if none. */
export async function getJourneyDayForUser(userId: string): Promise<number> {
  try {
    const journeys = await db.send(new QueryCommand({
      TableName: Resource.Journeys.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
    }));
    const active = (journeys.Items || []).find((j: any) => j.isActive);
    if (!active) return 0;
    const start = new Date(active.startDate).getTime();
    const day = Math.floor((Date.now() - start) / 86400000) + 1;
    return Math.min(Math.max(day, 0), 48);
  } catch {
    return 0;
  }
}

/** Returns the user's most-recently-updated streak row, or null. */
export async function getStreakForUser(userId: string): Promise<any | null> {
  try {
    const streaks = await db.send(new QueryCommand({
      TableName: Resource.Streaks.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
    }));
    return (streaks.Items || [])
      .slice()
      .sort((a: any, b: any) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))[0] || null;
  } catch {
    return null;
  }
}
