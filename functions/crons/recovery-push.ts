// Fires every 15 minutes. For each user with push enabled at user-local
// 12:00 (noon) who has an active journey AND has not checked in for 2+
// days, send a gentle re-engagement push.

import { Resource } from 'sst';
import { ScanCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../lib/utils';
import { sendPushToUserSubscriptions, type PushSubscriptionRecord } from '../lib/push';
import { shouldFireAtUserLocalTime, getStreakForUser, getJourneyDayForUser } from '../lib/push-time';

const NOON = '12:00';
const STALE_DAYS = 2;

export async function handler() {
  const subs = await db.send(new ScanCommand({
    TableName: Resource.PushSubscriptions.name,
  }));

  const byUser = new Map<string, PushSubscriptionRecord[]>();
  for (const sub of (subs.Items || []) as PushSubscriptionRecord[]) {
    const list = byUser.get(sub.userId) || [];
    list.push(sub);
    byUser.set(sub.userId, list);
  }

  let totalSent = 0;
  for (const [userId, userSubs] of byUser) {
    try {
      const settings = await db.send(new GetCommand({
        TableName: Resource.ReminderSettings.name,
        Key: { userId },
      }));
      const s = settings.Item;
      if (!s || !s.pushNotifications) continue;

      const timezone = s.timezone || 'UTC';
      if (!shouldFireAtUserLocalTime(NOON, timezone)) continue;

      // Active journey + days-since-last-checkin gate.
      const day = await getJourneyDayForUser(userId);
      if (day === 0) continue;

      const streak = await getStreakForUser(userId);
      const lastCheckin: string | null = streak?.lastCheckin || null;
      if (!lastCheckin) continue; // Never checked in — skip rather than nag.

      const last = new Date(lastCheckin).getTime();
      const daysSince = Math.floor((Date.now() - last) / 86400000);
      if (daysSince < STALE_DAYS) continue;

      const body = daysSince >= 7
        ? 'Your journey is waiting whenever you are. One breath is enough today.'
        : `It's been ${daysSince} days. One breath is all today asks.`;

      const delivered = await sendPushToUserSubscriptions(userSubs, {
        title: 'Welcome back',
        body,
        url: '/dashboard',
        tag: 'vedic-recovery',
      });
      totalSent += delivered;
    } catch (e) {
      console.error('recovery-push error for user', userId, e);
    }
  }

  console.log(`recovery-push: ${totalSent} delivered`);
  return { sent: totalSent };
}
