// Admin roster for live-cohort registrations.
// GET /admin/class-registrations — list registrants for the current cohort.
// Auth: requires Users.role === 'admin'. See functions/lib/admin.ts.

import { Resource } from 'sst';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS } from '../lib/utils';
import { getAdminFromEvent } from '../lib/admin';
import { COHORT_ID } from '../lib/class-registration';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const admin = await getAdminFromEvent(event);
  if (!admin) return err(401, 'Unauthorized');

  if (event.requestContext?.http?.method !== 'GET')
    return err(405, 'Method not allowed');

  const cohortId = event.queryStringParameters?.cohortId || COHORT_ID;

  // Paginate the GSI query fully — a cohort roster is small (hundreds).
  const items: any[] = [];
  let lastKey: Record<string, any> | undefined;
  do {
    const page = await db.send(new QueryCommand({
      TableName: Resource.ClassRegistrations.name,
      IndexName: 'cohortId-index',
      KeyConditionExpression: 'cohortId = :c',
      ExpressionAttributeValues: { ':c': cohortId },
      ExclusiveStartKey: lastKey,
    }));
    items.push(...(page.Items || []));
    lastKey = page.LastEvaluatedKey;
  } while (lastKey);

  items.sort((a, b) =>
    String(b.registeredAt || '').localeCompare(String(a.registeredAt || '')),
  );

  return ok({ registrations: items, total: items.length });
}
