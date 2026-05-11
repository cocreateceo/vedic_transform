import { Resource } from 'sst';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';
import { sendPushToUserSubscriptions, type PushSubscriptionRecord } from '../lib/push';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  if (event.requestContext?.http?.method !== 'POST') {
    return err(405, 'Method not allowed');
  }

  const subs = await db.send(new QueryCommand({
    TableName: Resource.PushSubscriptions.name,
    IndexName: 'userId-index',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': user.id },
  }));

  const records = (subs.Items || []) as PushSubscriptionRecord[];

  if (!records.length) {
    return err(404, 'No push subscriptions found for this account on any device');
  }

  const delivered = await sendPushToUserSubscriptions(records, {
    title: 'Vedic Transform — Test',
    body: 'Push notifications are working. You will start receiving morning practice reminders.',
    url: '/dashboard',
    tag: 'vedic-test',
  });

  return ok({ success: true, attempted: records.length, delivered });
}
