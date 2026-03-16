import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

export const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
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

export async function createToken(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
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
  } catch {
    return {};
  }
}

export async function getUserFromEvent(event: any): Promise<any | null> {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  return verifyToken(authHeader.slice(7));
}
