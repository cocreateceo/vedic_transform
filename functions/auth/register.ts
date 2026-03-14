import { Resource } from 'sst';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, hashPassword, createToken, generateId } from '../lib/utils';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  try {
    const { email, password, name } = JSON.parse(event.body || '{}');
    if (!email || !password) return err(400, 'Email and password required');

    // Check existing user
    const existing = await db.send(new QueryCommand({
      TableName: Resource.Users.name,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email.toLowerCase() },
      Limit: 1,
    }));
    if (existing.Items?.length) return err(409, 'Email already registered');

    const id = generateId();
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();

    await db.send(new PutCommand({
      TableName: Resource.Users.name,
      Item: {
        id,
        email: email.toLowerCase(),
        passwordHash,
        name: name || null,
        phone: null,
        avatarUrl: null,
        onboardingCompleted: false,
        createdAt: now,
        updatedAt: now,
      },
    }));

    const token = await createToken({ id, email: email.toLowerCase(), name });
    return ok({ success: true, token, user: { id, email: email.toLowerCase(), name, onboardingCompleted: false } });
  } catch (e: any) {
    console.error('Registration error:', e);
    return err(500, 'Registration failed');
  }
}
