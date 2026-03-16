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
    const date = event.queryStringParameters?.date || new Date().toISOString().split('T')[0];

    const result = await db.send(new QueryCommand({
      TableName: Resource.DailyCheckins.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'begins_with(checkinDate, :date)',
      ExpressionAttributeValues: {
        ':userId': user.id,
        ':date': date,
      },
    }));

    return ok({ checkins: result.Items || [] });
  }

  if (method === 'POST') {
    const body = parseBody(event);
    const { pillarId, durationMinutes, notes, moodBefore, moodAfter } = body;

    if (!pillarId) return err(400, 'pillarId is required');

    const now = new Date();
    const checkinDate = now.toISOString().split('T')[0];
    const id = generateId();

    await db.send(new PutCommand({
      TableName: Resource.DailyCheckins.name,
      Item: {
        id,
        userId: user.id,
        pillarId,
        checkinDate,
        completed: true,
        durationMinutes: durationMinutes || null,
        notes: notes || null,
        moodBefore: moodBefore || null,
        moodAfter: moodAfter || null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    }));

    // Update streak
    try {
      const streaks = await db.send(new QueryCommand({
        TableName: Resource.Streaks.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
        Limit: 1,
      }));

      const streak = streaks.Items?.[0];
      if (streak) {
        const lastCheckin = streak.lastCheckin ? new Date(streak.lastCheckin) : null;
        const today = new Date(checkinDate);
        const isConsecutive = lastCheckin &&
          (today.getTime() - lastCheckin.getTime()) <= 86400000 * 1.5;

        const newCurrent = isConsecutive ? streak.currentStreak + 1 : 1;
        const newLongest = Math.max(newCurrent, streak.longestStreak);

        await db.send(new UpdateCommand({
          TableName: Resource.Streaks.name,
          Key: { id: streak.id },
          UpdateExpression: 'SET currentStreak = :current, longestStreak = :longest, lastCheckin = :lastCheckin, updatedAt = :now',
          ExpressionAttributeValues: {
            ':current': newCurrent,
            ':longest': newLongest,
            ':lastCheckin': checkinDate,
            ':now': now.toISOString(),
          },
        }));
      }
    } catch (e) {
      console.error('Streak update error:', e);
    }

    // Add karma transaction
    try {
      await db.send(new PutCommand({
        TableName: Resource.KarmaTransactions.name,
        Item: {
          id: generateId(),
          userId: user.id,
          points: 10,
          reason: 'Pillar checkin completed',
          pillarId,
          badgeId: null,
          createdAt: now.toISOString(),
        },
      }));
    } catch (e) {
      console.error('Karma transaction error:', e);
    }

    return ok({ success: true, checkinId: id });
  }

  return err(405, 'Method not allowed');
}
