import { Resource } from 'sst';
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    const contentId = event.queryStringParameters?.contentId;

    const params: any = {
      TableName: Resource.ContentProgress.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
    };

    if (contentId) {
      params.FilterExpression = 'contentId = :contentId';
      params.ExpressionAttributeValues[':contentId'] = contentId;
    }

    const result = await db.send(new QueryCommand(params));
    return ok({ progress: result.Items || [] });
  }

  if (method === 'POST') {
    const body = parseBody(event);
    const { contentId, completed, progress } = body;

    if (!contentId) return err(400, 'contentId is required');

    const now = new Date().toISOString();

    // Check for existing record
    const existing = await db.send(new QueryCommand({
      TableName: Resource.ContentProgress.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'contentId = :contentId',
      ExpressionAttributeValues: {
        ':userId': user.id,
        ':contentId': contentId,
      },
      Limit: 1,
    }));

    const id = existing.Items?.[0]?.id || generateId();

    await db.send(new PutCommand({
      TableName: Resource.ContentProgress.name,
      Item: {
        id,
        userId: user.id,
        contentId,
        completed: completed ?? false,
        progress: progress ?? 0,
        lastAccessedAt: now,
      },
    }));

    return ok({ success: true, id });
  }

  return err(405, 'Method not allowed');
}
