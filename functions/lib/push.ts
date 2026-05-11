// Shared Web Push helper. Wraps the `web-push` library with our VAPID
// credentials (loaded from SST secrets at runtime) and cleans up dead
// subscriptions automatically.

import { Resource } from 'sst';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import webpush from 'web-push';
import { db } from './utils';

let vapidConfigured = false;

function configureVapid(): boolean {
  if (vapidConfigured) return true;
  try {
    const publicKey = Resource.VapidPublicKey.value;
    const privateKey = Resource.VapidPrivateKey.value;
    // The contact email is required by spec — push services may reach out
    // here if our endpoint misbehaves.
    webpush.setVapidDetails(
      'mailto:cocreateceo@gmail.com',
      publicKey,
      privateKey,
    );
    vapidConfigured = true;
    return true;
  } catch (e) {
    console.error('VAPID keys not configured:', e);
    return false;
  }
}

export interface PushSubscriptionRecord {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
  createdAt: string;
  lastSentAt?: string;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

/**
 * Send a push to one subscription. Returns `true` on success, `false` if the
 * subscription endpoint is dead (410 Gone) — in which case it has already been
 * removed from the PushSubscriptions table.
 */
export async function sendPush(
  subscription: PushSubscriptionRecord,
  payload: PushPayload,
): Promise<boolean> {
  if (!configureVapid()) return false;

  const webPushSub = {
    endpoint: subscription.endpoint,
    keys: { p256dh: subscription.p256dh, auth: subscription.auth },
  };

  try {
    await webpush.sendNotification(webPushSub, JSON.stringify(payload));
    return true;
  } catch (e: any) {
    // 404 / 410 → subscription is gone (uninstalled, denied, etc.). Clean it
    // up so we don't keep paying to fail.
    if (e?.statusCode === 404 || e?.statusCode === 410) {
      try {
        await db.send(new DeleteCommand({
          TableName: Resource.PushSubscriptions.name,
          Key: { id: subscription.id },
        }));
      } catch (cleanupErr) {
        console.error('Subscription cleanup failed:', cleanupErr);
      }
      return false;
    }
    console.error('Push send error:', e?.statusCode, e?.body || e?.message);
    return false;
  }
}

/**
 * Helper: send the same payload to every subscription a user owns
 * (phone + laptop, etc.). Returns count of successful deliveries.
 */
export async function sendPushToUserSubscriptions(
  subscriptions: PushSubscriptionRecord[],
  payload: PushPayload,
): Promise<number> {
  if (!subscriptions.length) return 0;
  const results = await Promise.all(subscriptions.map((s) => sendPush(s, payload)));
  return results.filter(Boolean).length;
}
