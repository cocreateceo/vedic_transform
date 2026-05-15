import { Resource } from 'sst';
import { QueryCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId ,parseBody } from '../lib/utils';

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

    const items = result.Items || [];
    // `logs` is the canonical field name the Mood page reads. `moodLogs`
    // is kept as a back-compat alias for any older client builds still
    // in flight.
    return ok({ logs: items, moodLogs: items });
  }

  if (method === 'POST') {
    const body = parseBody(event);
    const { moodScore, energy, stress, sleepQuality, notes } = body;

    if (!moodScore || moodScore < 1 || moodScore > 5) {
      return err(400, 'moodScore (1-5) is required');
    }

    const now = new Date().toISOString();
    const today = now.split('T')[0];

    // Same-day upsert — previously every "Log Today's Mood" click inserted
    // a new row, so the chart showed two dots and weekly averages double-
    // counted. Find today's existing row first; update if present, else insert.
    const existing = await db.send(new QueryCommand({
      TableName: Resource.MoodLogs.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'logDate = :today',
      ExpressionAttributeValues: { ':userId': user.id, ':today': today },
    }));

    if ((existing.Items || []).length > 0) {
      const row = existing.Items![0];
      await db.send(new UpdateCommand({
        TableName: Resource.MoodLogs.name,
        Key: { id: row.id },
        UpdateExpression:
          'SET moodScore = :m, energy = :e, stress = :s, sleepQuality = :sq, notes = :n, updatedAt = :now',
        ConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':m': moodScore,
          ':e': energy ?? null,
          ':s': stress ?? null,
          ':sq': sleepQuality ?? null,
          ':n': notes ?? null,
          ':now': now,
          ':userId': user.id,
        },
      }));
      return ok({
        ...row,
        moodScore,
        energy: energy ?? null,
        stress: stress ?? null,
        sleepQuality: sleepQuality ?? null,
        notes: notes ?? null,
        updatedAt: now,
      });
    }

    const id = generateId();
    // Build the item once so we can both persist it and return the full
    // record. The Mood page does an optimistic `setLogs(prev => [newLog, ...])`
    // from this response — returning just `{ success, id }` left newLog
    // without a logDate, which broke the chart and same-day dedupe filter.
    const item = {
      id,
      userId: user.id,
      logDate: today,
      moodScore,
      energy: energy ?? null,
      stress: stress ?? null,
      sleepQuality: sleepQuality ?? null,
      notes: notes ?? null,
      createdAt: now,
    };

    await db.send(new PutCommand({
      TableName: Resource.MoodLogs.name,
      Item: item,
    }));

    return ok(item);
  }

  return err(405, 'Method not allowed');
}
