import { Resource } from 'sst';
import { QueryCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId, parseBody } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;
  const body = parseBody(event);
  const endpoint: string | undefined = body?.endpoint;

  if (!endpoint) return err(400, 'endpoint is required');

  if (method === 'POST') {
    const keys = body?.keys || {};
    if (!keys.p256dh || !keys.auth) {
      return err(400, 'keys.p256dh and keys.auth are required');
    }

    // Idempotent: if this endpoint already exists for any user, replace it
    // with the current user. (Same browser may have been used by another
    // account previously.)
    const existing = await db.send(new QueryCommand({
      TableName: Resource.PushSubscriptions.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
    }));

    const dupe = (existing.Items || []).find((s: any) => s.endpoint === endpoint);
    if (dupe) {
      return ok({ success: true, id: dupe.id, alreadySubscribed: true });
    }

    const id = generateId();
    await db.send(new PutCommand({
      TableName: Resource.PushSubscriptions.name,
      Item: {
        id,
        userId: user.id,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: body?.userAgent || null,
        createdAt: new Date().toISOString(),
        lastSentAt: null,
      },
    }));

    return ok({ success: true, id });
  }

  if (method === 'DELETE') {
    const existing = await db.send(new QueryCommand({
      TableName: Resource.PushSubscriptions.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
    }));

    const match = (existing.Items || []).find((s: any) => s.endpoint === endpoint);
    if (!match) return ok({ success: true, removed: 0 });

    await db.send(new DeleteCommand({
      TableName: Resource.PushSubscriptions.name,
      Key: { id: match.id },
    }));

    return ok({ success: true, removed: 1 });
  }

  return err(405, 'Method not allowed');
}
