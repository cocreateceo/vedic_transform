// Fires every 15 minutes. For each user with push enabled whose configured
// morning time falls within the current 15-minute window in their local
// timezone, send a "today's practice" push.

import { Resource } from 'sst';
import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../lib/utils';
import { sendPushToUserSubscriptions, type PushSubscriptionRecord } from '../lib/push';
import { shouldFireAtUserLocalTime, getJourneyDayForUser } from '../lib/push-time';

export async function handler() {
  const subs = await db.send(new ScanCommand({
    TableName: Resource.PushSubscriptions.name,
  }));

  // Group push subscriptions by user.
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
      if (!s || !s.pushNotifications || !s.morningEnabled) continue;

      const timezone = s.timezone || 'UTC';
      const targetTime = s.morningTime || '05:00';

      if (!shouldFireAtUserLocalTime(targetTime, timezone)) continue;

      // Optional context — current journey day, so the message is specific.
      const day = await getJourneyDayForUser(userId);
      const body = day > 0
        ? `Day ${day} of 48 — your morning practice is waiting.`
        : 'Your morning practice is waiting.';

      const delivered = await sendPushToUserSubscriptions(userSubs, {
        title: 'Vedic Transform',
        body,
        url: '/dashboard',
        tag: 'vedic-morning',
      });
      totalSent += delivered;
    } catch (e) {
      console.error('morning-push error for user', userId, e);
    }
  }

  console.log(`morning-push: ${totalSent} delivered to ${byUser.size} users`);
  return { sent: totalSent };
}
