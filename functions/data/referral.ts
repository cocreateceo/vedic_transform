import { Resource } from 'sst';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';

// GET /data/referral — the user's invite code (== their user id), how many
// friends joined, and the karma they've earned from it.
export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const res = await db.send(new QueryCommand({
    TableName: Resource.Referrals.name,
    IndexName: 'referrerUserId-index',
    KeyConditionExpression: 'referrerUserId = :u',
    ExpressionAttributeValues: { ':u': user.id },
  }));

  const count = (res.Items || []).length;
  return ok({ code: user.id, count, karmaEarned: count * 100 });
}
