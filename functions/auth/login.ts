import { Resource } from 'sst';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, verifyPassword, createToken } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  try {
    const { email, password } = JSON.parse(event.body || '{}');
    if (!email || !password) return err(400, 'Email and password required');

    const result = await db.send(new QueryCommand({
      TableName: Resource.Users.name,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email.toLowerCase() },
      Limit: 1,
    }));

    const user = result.Items?.[0];
    if (!user) return err(401, 'Invalid email or password');

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return err(401, 'Invalid email or password');

    const token = await createToken({ id: user.id, email: user.email, name: user.name });
    return ok({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (e: any) {
    console.error('Login error:', e);
    return err(500, 'Login failed');
  }
}
