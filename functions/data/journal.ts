import { Resource } from 'sst';
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId ,parseBody } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    const type = event.queryStringParameters?.type; // gratitude, intention, manifestation
    const limit = parseInt(event.queryStringParameters?.limit || '30');

    const results: any = {};

    if (!type || type === 'gratitude') {
      const r = await db.send(new QueryCommand({
        TableName: Resource.GratitudeEntries.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
        ScanIndexForward: false,
        Limit: limit,
      }));
      results.gratitudeEntries = r.Items || [];
    }

    if (!type || type === 'intention') {
      const r = await db.send(new QueryCommand({
        TableName: Resource.Intentions.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
        ScanIndexForward: false,
        Limit: limit,
      }));
      results.intentions = r.Items || [];
    }

    if (!type || type === 'manifestation') {
      const r = await db.send(new QueryCommand({
        TableName: Resource.Manifestations.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
        ScanIndexForward: false,
        Limit: limit,
      }));
      results.manifestations = r.Items || [];
    }

    return ok(results);
  }

  if (method === 'POST') {
    const body = parseBody(event);
    const { type } = body;
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    if (type === 'gratitude') {
      const { gratitude1, gratitude2, gratitude3 } = body;
      const id = generateId();

      await db.send(new PutCommand({
        TableName: Resource.GratitudeEntries.name,
        Item: {
          id,
          userId: user.id,
          entryDate: today,
          gratitude1: gratitude1 || null,
          gratitude2: gratitude2 || null,
          gratitude3: gratitude3 || null,
          createdAt: now,
          updatedAt: now,
        },
      }));

      return ok({ success: true, id });
    }

    if (type === 'intention') {
      const { intentionText } = body;
      if (!intentionText) return err(400, 'intentionText is required');

      const id = generateId();

      await db.send(new PutCommand({
        TableName: Resource.Intentions.name,
        Item: {
          id,
          userId: user.id,
          intentionDate: today,
          intentionText,
          isCompleted: false,
          createdAt: now,
          updatedAt: now,
        },
      }));

      return ok({ success: true, id });
    }

    if (type === 'manifestation') {
      const { title, description, imageUrl } = body;
      if (!title) return err(400, 'title is required');

      const id = generateId();

      await db.send(new PutCommand({
        TableName: Resource.Manifestations.name,
        Item: {
          id,
          userId: user.id,
          title,
          description: description || null,
          imageUrl: imageUrl || null,
          isAchieved: false,
          achievedAt: null,
          createdAt: now,
          updatedAt: now,
        },
      }));

      return ok({ success: true, id });
    }

    return err(400, 'Invalid type. Use: gratitude, intention, manifestation');
  }

  return err(405, 'Method not allowed');
}
