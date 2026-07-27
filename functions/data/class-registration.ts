// Public registration for the 10x Vedic live cohort (free, no auth).
// POST /class-registration — mirrors the newsletter.ts pattern.

import { Resource } from 'sst';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, parseBody } from '../lib/utils';
import { isSpam, normalizeRegistration } from '../lib/class-registration';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  if (event.requestContext?.http?.method !== 'POST')
    return err(405, 'Method not allowed');

  const body = parseBody(event);

  // Honeypot: pretend success so bots don't learn they were caught.
  if (isSpam(body)) return ok({ registered: true });

  const res = normalizeRegistration(body);
  if ('error' in res) return err(400, res.error);

  // email+cohortId is the primary key, so a double-submit is naturally
  // idempotent; the condition keeps the original registeredAt/source.
  try {
    await db.send(new PutCommand({
      TableName: Resource.ClassRegistrations.name,
      Item: { ...res.item, registeredAt: new Date().toISOString() },
      ConditionExpression:
        'attribute_not_exists(email) AND attribute_not_exists(cohortId)',
    }));
  } catch (e: any) {
    if (e?.name === 'ConditionalCheckFailedException') {
      // Already registered — treat as success so the form never leaks
      // whether an address is on the list.
      return ok({ registered: true });
    }
    throw e;
  }

  return ok({ registered: true });
}
