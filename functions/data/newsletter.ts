import { Resource } from 'sst';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, parseBody } from '../lib/utils';
import { emit, EventType } from '../lib/events';
import { normalizeEmail, normalizeSource } from '../lib/newsletter';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  if (event.requestContext?.http?.method !== 'POST')
    return err(405, 'Method not allowed');

  const body = parseBody(event);
  const email = normalizeEmail(body.email);
  const source = normalizeSource(body.source);

  if (!email) {
    return err(400, 'Please enter a valid email address');
  }

  // Email is the partition key, so re-subscribing is naturally idempotent.
  // The condition keeps the original subscribedAt/source on repeat signups —
  // without it a double-submit would silently rewrite attribution.
  try {
    await db.send(new PutCommand({
      TableName: Resource.NewsletterSubscribers.name,
      Item: {
        email,
        source,
        status: 'subscribed',
        subscribedAt: new Date().toISOString(),
      },
      ConditionExpression: 'attribute_not_exists(email)',
    }));
  } catch (e: any) {
    if (e?.name === 'ConditionalCheckFailedException') {
      // Already subscribed — treat as success so the form never leaks
      // whether an address is on the list.
      return ok({ subscribed: true });
    }
    throw e;
  }

  void emit(null, EventType.NEWSLETTER_SUBSCRIBED, { source });

  return ok({ subscribed: true });
}
