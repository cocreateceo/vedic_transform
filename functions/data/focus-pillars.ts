import { Resource } from 'sst';
import { QueryCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId ,parseBody } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    const result = await db.send(new QueryCommand({
      TableName: Resource.FocusPillars.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
    }));

    return ok({ focusPillars: result.Items || [] });
  }

  if (method === 'POST') {
    const body = parseBody(event);
    // Two request shapes are accepted:
    //   simple: { pillarIds: ["1","3","7"] }   — Goals UI uses this
    //   full:   { pillars: [{ pillarId, priority, reason }, ...] }
    // The simple form synthesizes priority from array order so the
    // selector doesn't need to know about it.
    let pillars: Array<{ pillarId: any; priority: number; reason?: string | null }>;
    if (Array.isArray(body.pillarIds)) {
      pillars = body.pillarIds.map((pid: any, i: number) => ({
        pillarId: pid,
        priority: i + 1,
        reason: null,
      }));
    } else if (Array.isArray(body.pillars)) {
      pillars = body.pillars;
    } else {
      return err(400, 'Provide pillarIds or pillars');
    }

    if (pillars.length === 0 || pillars.length > 3) {
      return err(400, 'Provide 1-3 focus pillars');
    }

    // Delete existing focus pillars for this user
    const existing = await db.send(new QueryCommand({
      TableName: Resource.FocusPillars.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
    }));

    if (existing.Items?.length) {
      for (const item of existing.Items) {
        await db.send(new DeleteCommand({
          TableName: Resource.FocusPillars.name,
          Key: { id: item.id },
        }));
      }
    }

    // Create new focus pillars
    const now = new Date().toISOString();
    const created: any[] = [];

    for (const p of pillars) {
      const id = generateId();
      const item = {
        id,
        userId: user.id,
        pillarId: p.pillarId,
        priority: p.priority,
        reason: p.reason || null,
        createdAt: now,
        updatedAt: now,
      };

      await db.send(new PutCommand({
        TableName: Resource.FocusPillars.name,
        Item: item,
      }));

      created.push(item);
    }

    return ok({ success: true, focusPillars: created });
  }

  return err(405, 'Method not allowed');
}
