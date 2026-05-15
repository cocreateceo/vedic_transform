// Fires every 15 minutes. For each user with push enabled whose configured
// evening time falls within the current 15-minute window in their local
// timezone, send an evening-reflection push. Mirror of morning-push.

import { Resource } from 'sst';
import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../lib/utils';
import { sendPushToUserSubscriptions, type PushSubscriptionRecord } from '../lib/push';
import { shouldFireAtUserLocalTime, getJourneyDayForUser } from '../lib/push-time';

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
      if (!s || !s.pushNotifications || !s.eveningEnabled) continue;

      const timezone = s.timezone || 'UTC';
      const targetTime = s.eveningTime || '21:00';

      if (!shouldFireAtUserLocalTime(targetTime, timezone)) continue;

      const day = await getJourneyDayForUser(userId);
      const body = day > 0
        ? `Day ${day} of 48 — take a moment to reflect on your practice.`
        : "Take a moment to reflect on today's practice.";

      const delivered = await sendPushToUserSubscriptions(userSubs, {
        title: 'Evening Reflection',
        body,
        url: '/dashboard',
        tag: 'vedic-evening',
      });
      totalSent += delivered;
    } catch (e) {
      console.error('evening-push error for user', userId, e);
    }
  }

  console.log(`evening-push: ${totalSent} delivered to ${byUser.size} users`);
  return { sent: totalSent };
}
