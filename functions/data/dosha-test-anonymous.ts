import { Resource } from 'sst';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, generateId, parseBody } from '../lib/utils';

// 90-day TTL on anonymous results — long enough for sharers to point a
// friend back, short enough that abandoned data doesn't pile up. Stored
// as an epoch-seconds attribute consumed by the table's TTL config.
const TTL_SECONDS = 60 * 60 * 24 * 90;

const ALLOWED_DOSHAS = new Set(['vata', 'pitta', 'kapha']);

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const method = event.requestContext?.http?.method;

  if (method === 'POST') {
    const body = parseBody(event);
    const { primary, secondary, scores, percentages } = body;

    if (!ALLOWED_DOSHAS.has(primary) || !ALLOWED_DOSHAS.has(secondary)) {
      return err(400, 'primary and secondary must be vata / pitta / kapha');
    }
    if (!scores || !percentages) {
      return err(400, 'scores and percentages are required');
    }

    const id = generateId();
    const now = new Date();
    const ttl = Math.floor(now.getTime() / 1000) + TTL_SECONDS;

    await db.send(new PutCommand({
      TableName: Resource.AnonymousDoshaResults.name,
      Item: {
        id,
        primary,
        secondary,
        scores,
        percentages,
        createdAt: now.toISOString(),
        ttl,
      },
    }));

    return ok({ id, primary, secondary });
  }

  if (method === 'GET') {
    const id = event.queryStringParameters?.id;
    if (!id) return err(400, 'id query parameter is required');

    const result = await db.send(new GetCommand({
      TableName: Resource.AnonymousDoshaResults.name,
      Key: { id },
    }));

    if (!result.Item) return err(404, 'Result not found or expired');

    // DynamoDB TTL is best-effort — defend against returning a TTL'd-but-
    // not-yet-reaped row by checking the timestamp ourselves.
    if (result.Item.ttl && Number(result.Item.ttl) * 1000 < Date.now()) {
      return err(410, 'Result has expired');
    }

    return ok(result.Item);
  }

  return err(405, 'Method not allowed');
}
