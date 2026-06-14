import { Resource } from 'sst';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, hashPassword, createToken, generateId, parseBody } from '../lib/utils';
import { emit, EventType } from '../lib/events';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  try {
    const { email, password, name, refCode } = parseBody(event);
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
        role: 'user',
        createdAt: now,
        updatedAt: now,
      },
    }));

    const token = await createToken({ id, email: email.toLowerCase(), name });
    void emit(id, EventType.AUTH_REGISTER, { email: email.toLowerCase() });

    // Referral credit — the referral code IS the referrer's user id. Record
    // the signup and award +100 karma to both sides. Best-effort: a failure
    // here must never block account creation.
    if (refCode && typeof refCode === 'string' && refCode !== id) {
      try {
        await db.send(new PutCommand({
          TableName: Resource.Referrals.name,
          Item: { id: generateId(), referrerUserId: refCode, refereeUserId: id, createdAt: now },
        }));
        await db.send(new PutCommand({
          TableName: Resource.KarmaTransactions.name,
          Item: { id: generateId(), userId: refCode, points: 100, type: 'referral', reason: 'Friend joined via your invite', createdAt: now },
        }));
        await db.send(new PutCommand({
          TableName: Resource.KarmaTransactions.name,
          Item: { id: generateId(), userId: id, points: 100, type: 'referral', reason: 'Welcome bonus — joined via invite', createdAt: now },
        }));
      } catch (refErr) {
        console.error('Referral credit failed (non-fatal):', refErr);
      }
    }

    return ok({ success: true, token, user: { id, email: email.toLowerCase(), name, onboardingCompleted: false } });
  } catch (e: any) {
    console.error('Registration error:', e);
    return err(500, 'Registration failed');
  }
}
