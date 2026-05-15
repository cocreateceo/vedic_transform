import { Resource } from 'sst';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';
import { BADGES } from '../lib/badges';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    // Badge definitions live in code (functions/lib/badges.ts) — the
    // legacy DynamoDB Badges table was never seeded, so the previous
    // Scan returned an empty array and the Achievements page showed
    // "No badges available yet" forever.
    const [userBadgesRes, karmaRes] = await Promise.all([
      db.send(new QueryCommand({
        TableName: Resource.UserBadges.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
      })),
      db.send(new QueryCommand({
        TableName: Resource.KarmaTransactions.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': user.id },
      })),
    ]);

    const userBadgeRows = userBadgesRes.Items || [];
    const earnedById = new Map<string, string>(); // badgeId → earnedAt
    for (const ub of userBadgeRows) {
      if (ub.badgeId) earnedById.set(String(ub.badgeId), ub.earnedAt);
    }

    const totalKarma = (karmaRes.Items || []).reduce(
      (sum: number, t: any) => sum + (t.points || 0),
      0,
    );

    const badges = BADGES.map((badge) => ({
      ...badge,
      earned: earnedById.has(badge.id),
      earnedAt: earnedById.get(badge.id) || null,
    }));

    return ok({
      badges,
      earnedCount: earnedById.size,
      totalCount: BADGES.length,
      totalKarma,
    });
  }

  return err(405, 'Method not allowed');
}
