import { Resource } from 'sst';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const claims = await getUserFromEvent(event);
  if (!claims) return err(401, 'Unauthorized');

  try {
    const result = await db.send(new GetCommand({
      TableName: Resource.Users.name,
      Key: { id: claims.id },
    }));
    if (!result.Item) return err(404, 'User not found');

    const { passwordHash, ...profile } = result.Item;
    return ok({ user: profile });
  } catch (e: any) {
    console.error('GET /auth/me error:', e);
    return err(500, 'Failed to load user');
  }
}
