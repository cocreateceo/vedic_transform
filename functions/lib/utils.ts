import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

export const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// CORS allow-origin / methods / headers are configured on the ApiGatewayV2
// resource in sst.config.ts. API Gateway v2 echoes the matched origin from its
// allowlist back to the browser and handles OPTIONS preflights automatically,
// so handlers do not (and must not) emit Access-Control-Allow-* headers
// themselves — those would override the gateway's restricted allowlist.
export const CORS_HEADERS = {
  'Content-Type': 'application/json',
};

export const ok = (data: any) => ({
  statusCode: 200,
  headers: CORS_HEADERS,
  body: JSON.stringify(data),
});

export const err = (status: number, message: string) => ({
  statusCode: status,
  headers: CORS_HEADERS,
  body: JSON.stringify({ error: message }),
});

function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(Resource.JwtSecret.value);
}

const JWT_ISSUER = 'vedic-transform';
const JWT_AUDIENCE = 'vedic-transform-api';

export async function createToken(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime('7d')
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return payload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

export function parseBody(event: any): any {
  let body = event.body || '{}';
  if (event.isBase64Encoded && typeof body === 'string') {
    body = Buffer.from(body, 'base64').toString('utf-8');
  }
  try {
    return JSON.parse(body);
  } catch (e) {
    // Surface malformed JSON in CloudWatch — handlers still see {} so a
    // missing-field check returns the usual 400, but ops can debug.
    console.error('parseBody: invalid JSON in request body', e, body);
    return {};
  }
}

export async function getUserFromEvent(event: any): Promise<any | null> {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  return verifyToken(authHeader.slice(7));
}
