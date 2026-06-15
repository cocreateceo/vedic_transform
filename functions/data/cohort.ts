import { Resource } from 'sst';
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent, generateId } from '../lib/utils';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function cohortIdFromDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function labelFor(cohortId: string): string {
  const [y, m] = cohortId.split('-').map(Number);
  return `${MONTHS[(m || 1) - 1]} ${y}`;
}

// GET /data/cohort — the user's "New Moon" cohort (the month they started
// their 48-day journey) + how many yatris share it. Membership is assigned
// lazily here, so the journey-start critical path is untouched.
export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, 'Unauthorized');

  // Existing membership?
  const mem = await db.send(new QueryCommand({
    TableName: Resource.CohortMembers.name,
    IndexName: 'userId-index',
    KeyConditionExpression: 'userId = :u',
    ExpressionAttributeValues: { ':u': user.id },
  }));
  let cohortId: string | undefined = mem.Items?.[0]?.cohortId;

  // Lazy-assign from the journey start month.
  if (!cohortId) {
    const jr = await db.send(new QueryCommand({
      TableName: Resource.Journeys.name,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: { ':u': user.id },
    }));
    const journey = (jr.Items || [])
      .slice()
      .sort((a: any, b: any) => (b.startDate || '').localeCompare(a.startDate || ''))[0];
    if (!journey?.startDate) return ok({ cohort: null });
    cohortId = cohortIdFromDate(journey.startDate);
    try {
      await db.send(new PutCommand({
        TableName: Resource.CohortMembers.name,
        Item: {
          id: generateId(),
          cohortId,
          userId: user.id,
          joinedAt: new Date().toISOString(),
        },
      }));
    } catch (e) {
      console.error('Cohort assign failed (non-fatal):', e);
    }
  }

  const counted = await db.send(new QueryCommand({
    TableName: Resource.CohortMembers.name,
    IndexName: 'cohortId-index',
    KeyConditionExpression: 'cohortId = :c',
    ExpressionAttributeValues: { ':c': cohortId },
    Select: 'COUNT',
  }));

  return ok({
    cohort: {
      cohortId,
      label: labelFor(cohortId),
      memberCount: counted.Count || 1,
    },
  });
}
