import { Resource } from 'sst';
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId } from '../lib/utils';
import { emit, EventType } from '../lib/events';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    const result = await db.send(new QueryCommand({
      TableName: Resource.Journeys.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
    }));

    const activeJourney = result.Items?.find((j: any) => j.isActive);
    return ok({ journey: activeJourney || null, allJourneys: result.Items || [] });
  }

  if (method === 'POST') {
    // Check for existing active journey
    const existing = await db.send(new QueryCommand({
      TableName: Resource.Journeys.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
    }));

    const activeJourney = existing.Items?.find((j: any) => j.isActive);
    if (activeJourney) return err(409, 'You already have an active journey');

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 48);

    const journeyId = generateId();
    const journey = {
      id: journeyId,
      userId: user.id,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    await db.send(new PutCommand({
      TableName: Resource.Journeys.name,
      Item: journey,
    }));

    // Create initial streak record
    await db.send(new PutCommand({
      TableName: Resource.Streaks.name,
      Item: {
        id: generateId(),
        userId: user.id,
        journeyId,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckin: null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    }));

    void emit(user.id, EventType.JOURNEY_STARTED, { journeyId });

    return ok({ success: true, journey });
  }

  return err(405, 'Method not allowed');
}
