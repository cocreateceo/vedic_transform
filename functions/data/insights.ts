import { Resource } from 'sst';
import { QueryCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    const unreadOnly = event.queryStringParameters?.unreadOnly === 'true';

    const params: any = {
      TableName: Resource.UserInsights.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
      ScanIndexForward: false,
    };

    if (unreadOnly) {
      params.FilterExpression = 'isRead = :false AND isDismissed = :false';
      params.ExpressionAttributeValues[':false'] = false;
    }

    const result = await db.send(new QueryCommand(params));
    return ok({ insights: result.Items || [] });
  }

  if (method === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const { insightType, category, title, description, data, priority, expiresAt } = body;

    if (!insightType || !title || !description) {
      return err(400, 'insightType, title, and description are required');
    }

    const now = new Date().toISOString();
    const id = generateId();

    await db.send(new PutCommand({
      TableName: Resource.UserInsights.name,
      Item: {
        id,
        userId: user.id,
        insightType,
        category: category || null,
        title,
        description,
        data: data || null,
        priority: priority || 0,
        isRead: false,
        isDismissed: false,
        expiresAt: expiresAt || null,
        createdAt: now,
      },
    }));

    return ok({ success: true, id });
  }

  if (method === 'PATCH') {
    const body = JSON.parse(event.body || '{}');
    const { id, isRead, isDismissed } = body;

    if (!id) return err(400, 'id is required');

    const updates: string[] = [];
    const values: Record<string, any> = { ':userId': user.id };

    if (isRead !== undefined) { updates.push('isRead = :isRead'); values[':isRead'] = isRead; }
    if (isDismissed !== undefined) { updates.push('isDismissed = :isDismissed'); values[':isDismissed'] = isDismissed; }

    if (updates.length === 0) return err(400, 'No fields to update');

    await db.send(new UpdateCommand({
      TableName: Resource.UserInsights.name,
      Key: { id },
      UpdateExpression: `SET ${updates.join(', ')}`,
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: values,
    }));

    return ok({ success: true });
  }

  return err(405, 'Method not allowed');
}
