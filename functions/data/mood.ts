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
    const days = parseInt(event.queryStringParameters?.days || '30');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await db.send(new QueryCommand({
      TableName: Resource.MoodLogs.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'logDate >= :cutoff',
      ExpressionAttributeValues: {
        ':userId': user.id,
        ':cutoff': cutoffDate.toISOString().split('T')[0],
      },
    }));

    return ok({ moodLogs: result.Items || [] });
  }

  if (method === 'POST') {
    const body = parseBody(event);
    const { moodScore, energy, stress, sleepQuality, notes } = body;

    if (!moodScore || moodScore < 1 || moodScore > 5) {
      return err(400, 'moodScore (1-5) is required');
    }

    const now = new Date().toISOString();
    const today = now.split('T')[0];
    const id = generateId();

    await db.send(new PutCommand({
      TableName: Resource.MoodLogs.name,
      Item: {
        id,
        userId: user.id,
        logDate: today,
        moodScore,
        energy: energy || null,
        stress: stress || null,
        sleepQuality: sleepQuality || null,
        notes: notes || null,
        createdAt: now,
      },
    }));

    return ok({ success: true, id });
  }

  return err(405, 'Method not allowed');
}
