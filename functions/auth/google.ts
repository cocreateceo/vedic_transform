import { Resource } from 'sst';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { OAuth2Client } from 'google-auth-library';
import { db, ok, err, CORS_HEADERS, createToken, generateId, parseBody } from '../lib/utils';
import { emit, EventType } from '../lib/events';

// Google sign-in handler. Frontend uses Google Identity Services (GIS),
// which produces a short-lived JWT credential. We verify that credential
// against Google's public keys, then either find or create our user row
// and mint our own application JWT just like /auth/login does.

const GOOGLE_CLIENT_ID = Resource.GoogleClientId.value;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  try {
    const { credential } = parseBody(event);
    if (!credential) return err(400, 'Google credential required');

    // Verify the ID token against Google's published keys. Throws on any
    // mismatch (audience, signature, expiry, issuer) — so a successful
    // call guarantees the payload came from Google for our client.
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) return err(401, 'Google credential missing email');
    if (!payload.email_verified) return err(401, 'Google email not verified');

    const email = payload.email.toLowerCase();
    const name = payload.name || payload.given_name || null;
    const avatarUrl = payload.picture || null;

    // Look up by email — same index used by the password login.
    const existing = await db.send(new QueryCommand({
      TableName: Resource.Users.name,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email },
      Limit: 1,
    }));

    let user = existing.Items?.[0];
    const now = new Date().toISOString();
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // First time signing in — create a passwordless user. We store
      // `googleSub` so future logins are matched by sub even if the
      // user later changes their Google email.
      const id = generateId();
      user = {
        id,
        email,
        passwordHash: null,
        googleSub: payload.sub,
        name,
        phone: null,
        avatarUrl,
        onboardingCompleted: false,
        role: 'user',
        createdAt: now,
        updatedAt: now,
      };
      await db.send(new PutCommand({
        TableName: Resource.Users.name,
        Item: user,
      }));
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    void emit(
      user.id,
      isNewUser ? EventType.AUTH_GOOGLE_REGISTER : EventType.AUTH_GOOGLE_LOGIN,
      { email: user.email },
    );

    return ok({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        onboardingCompleted: user.onboardingCompleted || false,
      },
    });
  } catch (e: any) {
    console.error('Google sign-in error:', e);
    return err(401, 'Google sign-in failed');
  }
}
