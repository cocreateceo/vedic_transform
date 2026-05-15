// Fires every 15 minutes. Sandhya Vandana is the 3x-daily Vedic practice
// — dawn, noon, dusk. Single cron that checks all three configured times
// per user and fires whichever one falls in the current local window.

import { Resource } from 'sst';
import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../lib/utils';
import { sendPushToUserSubscriptions, type PushSubscriptionRecord } from '../lib/push';
import { shouldFireAtUserLocalTime } from '../lib/push-time';

type SandhyaSlot = 'morning' | 'noon' | 'evening';

const SLOT_COPY: Record<SandhyaSlot, { title: string; body: string; tag: string }> = {
  morning: {
    title: 'Pratah Sandhya',
    body: 'The first sandhya — meet the day with awareness.',
    tag: 'vedic-sandhya-morning',
  },
  noon: {
    title: 'Madhyahna Sandhya',
    body: 'The noon sandhya — pause and re-center.',
    tag: 'vedic-sandhya-noon',
  },
  evening: {
    title: 'Sayam Sandhya',
    body: 'The evening sandhya — close the day with gratitude.',
    tag: 'vedic-sandhya-evening',
  },
};

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
      if (!s || !s.pushNotifications || !s.sandhyaEnabled) continue;

      const timezone = s.timezone || 'UTC';
      const slots: Array<[SandhyaSlot, string]> = [
        ['morning', s.sandhyaMorningTime || '06:00'],
        ['noon', s.sandhyaNoonTime || '12:00'],
        ['evening', s.sandhyaEveningTime || '18:00'],
      ];

      // Find the first slot whose window is open right now. Slots are
      // 6 hours apart so at most one fires per cron tick.
      const match = slots.find(([, time]) => shouldFireAtUserLocalTime(time, timezone));
      if (!match) continue;

      const [slot] = match;
      const copy = SLOT_COPY[slot];

      const delivered = await sendPushToUserSubscriptions(userSubs, {
        title: copy.title,
        body: copy.body,
        url: '/dashboard',
        tag: copy.tag,
      });
      totalSent += delivered;
    } catch (e) {
      console.error('sandhya-push error for user', userId, e);
    }
  }

  console.log(`sandhya-push: ${totalSent} delivered to ${byUser.size} users`);
  return { sent: totalSent };
}
