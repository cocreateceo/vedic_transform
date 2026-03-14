import { Resource } from 'sst';
import { ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  if (method === 'GET') {
    // Fetch all badge definitions
    const allBadges = await db.send(new ScanCommand({
      TableName: Resource.Badges.name,
    }));

    // Fetch user's earned badges
    const userBadges = await db.send(new QueryCommand({
      TableName: Resource.UserBadges.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': user.id },
    }));

    const earnedBadgeIds = new Set((userBadges.Items || []).map((b: any) => b.badgeId));

    const badges = (allBadges.Items || []).map((badge: any) => ({
      ...badge,
      earned: earnedBadgeIds.has(badge.id),
      earnedAt: (userBadges.Items || []).find((ub: any) => ub.badgeId === badge.id)?.earnedAt || null,
    }));

    return ok({ badges, earnedCount: earnedBadgeIds.size, totalCount: allBadges.Items?.length || 0 });
  }

  return err(405, 'Method not allowed');
}
