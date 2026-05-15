import { Resource } from 'sst';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';
import { analyzeInsights } from '../lib/insights';

const TOTAL_JOURNEY_DAYS = 48;

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;

  // Insights are now computed live on every GET from the user's current
  // state. The legacy UserInsights table is no longer read or written —
  // dismiss/seen state lives client-side in localStorage. POST and PATCH
  // remain as no-op success responses so older in-flight clients (which
  // still fire them on Refresh / Dismiss) don't see an error.
  if (method === 'GET') {
    const [checkinsRes, streaksRes, journeysRes, karmaRes] = await Promise.all([
      db.send(new QueryCommand({
        TableName: Resource.DailyCheckins.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': user.id },
      })),
      db.send(new QueryCommand({
        TableName: Resource.Streaks.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': user.id },
      })),
      db.send(new QueryCommand({
        TableName: Resource.Journeys.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': user.id },
      })),
      db.send(new QueryCommand({
        TableName: Resource.KarmaTransactions.name,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': user.id },
      })),
    ]);

    const streakItem =
      (streaksRes.Items || [])
        .slice()
        .sort((a: any, b: any) =>
          (b.updatedAt || '').localeCompare(a.updatedAt || ''),
        )[0] || null;
    const streakCurrent = streakItem?.currentStreak || 0;

    const activeJourney = (journeysRes.Items || []).find((j: any) => j.isActive);
    let journeyDay = 0;
    if (activeJourney?.startDate) {
      journeyDay = Math.min(
        Math.floor(
          (Date.now() - new Date(activeJourney.startDate).getTime()) / 86400000,
        ) + 1,
        TOTAL_JOURNEY_DAYS,
      );
    }

    const totalKarma = (karmaRes.Items || []).reduce(
      (sum: number, t: any) => sum + (t.points || 0),
      0,
    );

    const insights = analyzeInsights({
      checkins: checkinsRes.Items || [],
      streakCurrent,
      journeyDay,
      totalKarma,
    });

    // Match the legacy UserInsights row shape the page expects: insightType,
    // category, isRead, isDismissed, createdAt. isRead and isDismissed are
    // always false from the server — client filters by its own state.
    return ok({
      insights: insights.map((i) => ({
        id: i.id,
        insightType: i.type,
        category: i.category || null,
        title: i.title,
        description: i.description,
        data: i.data ? JSON.stringify(i.data) : null,
        isRead: false,
        isDismissed: false,
        createdAt: i.createdAt,
      })),
    });
  }

  // POST and PATCH used to write/update UserInsights rows. They're no-ops
  // now — keeping them as 200s so older client builds in flight don't
  // start failing with 405s after this deploys.
  if (method === 'POST' || method === 'PATCH') {
    return ok({ success: true, deprecated: true });
  }

  return err(405, 'Method not allowed');
}
