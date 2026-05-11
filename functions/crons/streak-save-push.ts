// Fires every 15 minutes. For each user with push enabled whose configured
// streakWarningTime (default 20:00 local) falls within the current window,
// AND whose streak is at risk (>= 3 day streak AND no check-in today),
// nudge them.

import { Resource } from 'sst';
import { ScanCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../lib/utils';
import { sendPushToUserSubscriptions, type PushSubscriptionRecord } from '../lib/push';
import { shouldFireAtUserLocalTime, getStreakForUser } from '../lib/push-time';

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
      if (!s || !s.pushNotifications || !s.streakWarningEnabled) continue;

      const timezone = s.timezone || 'UTC';
      const targetTime = s.streakWarningTime || '20:00';
      if (!shouldFireAtUserLocalTime(targetTime, timezone)) continue;

      const streak = await getStreakForUser(userId);
      if (!streak || (streak.currentStreak || 0) < 3) continue;

      // Has the user already checked in today (in their local timezone)?
      const todayLocal = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());

      const checkins = await db.send(new QueryCommand({
        TableName: Resource.DailyCheckins.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        FilterExpression: 'begins_with(checkinDate, :date)',
        ExpressionAttributeValues: { ':userId': userId, ':date': todayLocal },
      }));
      if ((checkins.Items || []).length > 0) continue;

      const delivered = await sendPushToUserSubscriptions(userSubs, {
        title: 'Save your streak',
        body: `Your ${streak.currentStreak}-day streak is at risk — one pillar is enough.`,
        url: '/dashboard',
        tag: 'vedic-streak-save',
      });
      totalSent += delivered;
    } catch (e) {
      console.error('streak-save-push error for user', userId, e);
    }
  }

  console.log(`streak-save-push: ${totalSent} delivered`);
  return { sent: totalSent };
}
