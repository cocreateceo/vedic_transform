import { Resource } from 'sst';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    try {
      // Fetch journey data
      const journeys = await db.send(new QueryCommand({
        TableName: Resource.Journeys.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
      }));
      const activeJourney = journeys.Items?.find((j: any) => j.isActive);

      // Fetch checkins
      const checkins = await db.send(new QueryCommand({
        TableName: Resource.DailyCheckins.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
      }));

      // Fetch karma total
      const karma = await db.send(new QueryCommand({
        TableName: Resource.KarmaTransactions.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
      }));
      const totalKarma = (karma.Items || []).reduce((sum: number, t: any) => sum + (t.points || 0), 0);

      // Fetch streak — return the most-recently-updated row when a user has
      // multiple (e.g. across journeys). Matches checkin.ts / buy-shield.ts.
      const streaks = await db.send(new QueryCommand({
        TableName: Resource.Streaks.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
      }));
      const streak =
        (streaks.Items || [])
          .slice()
          .sort((a: any, b: any) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))[0] ||
        null;

      // Fetch user badges
      const badges = await db.send(new QueryCommand({
        TableName: Resource.UserBadges.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
      }));

      // Calculate journey day
      let journeyDay = 0;
      if (activeJourney) {
        const start = new Date(activeJourney.startDate);
        const now = new Date();
        journeyDay = Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
      }

      // Pillar completion stats
      const pillarStats: Record<string, number> = {};
      for (const c of checkins.Items || []) {
        const pid = String(c.pillarId);
        pillarStats[pid] = (pillarStats[pid] || 0) + 1;
      }

      return ok({
        journey: activeJourney || null,
        journeyDay,
        totalCheckins: checkins.Items?.length || 0,
        totalKarma,
        streak,
        badgesEarned: badges.Items?.length || 0,
        pillarStats,
      });
    } catch (e: any) {
      console.error('Reports error:', e);
      return err(500, 'Failed to generate report');
    }
  }

  return err(405, 'Method not allowed');
}
