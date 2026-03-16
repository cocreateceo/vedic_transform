import { Resource } from 'sst';
import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    const unreadOnly = event.queryStringParameters?.unreadOnly === 'true';
    const limit = parseInt(event.queryStringParameters?.limit || '50');

    const params: any = {
      TableName: Resource.Notifications.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
      ScanIndexForward: false,
      Limit: limit,
    };

    if (unreadOnly) {
      params.FilterExpression = 'isRead = :false';
      params.ExpressionAttributeValues[':false'] = false;
    }

    const result = await db.send(new QueryCommand(params));
    return ok({ notifications: result.Items || [] });
  }

  if (method === 'PATCH') {
    const body = parseBody(event);
    const { id, isRead } = body;

    if (!id) return err(400, 'id is required');

    await db.send(new UpdateCommand({
      TableName: Resource.Notifications.name,
      Key: { id },
      UpdateExpression: 'SET isRead = :isRead',
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':isRead': isRead !== undefined ? isRead : true,
        ':userId': user.id,
      },
    }));

    return ok({ success: true });
  }

  return err(405, 'Method not allowed');
}
