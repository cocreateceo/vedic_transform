// Admin user search + detail endpoints.
//
// GET /admin/users           — list users, optional ?q= prefix match on email
// GET /admin/users/{userId}  — full Context Pack snapshot for that user
//
// Auth: requires Users.role === 'admin'. See functions/lib/admin.ts.

import { Resource } from 'sst';
import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS } from '../lib/utils';
import { getAdminFromEvent } from '../lib/admin';
import { getUserContextPack } from '../lib/user-context';
import { emit, EventType } from '../lib/events';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const admin = await getAdminFromEvent(event);
  if (!admin) return err(401, 'Unauthorized');

  const method = event.requestContext?.http?.method;
  if (method !== 'GET') return err(405, 'Method not allowed');

  // ── Detail path: /admin/users/{userId} ──────────────────────
  const targetUserId: string | undefined = event.pathParameters?.userId;
  if (targetUserId) {
    const userRes = await db.send(
      new GetCommand({
        TableName: Resource.Users.name,
        Key: { id: targetUserId },
      }),
    );
    if (!userRes.Item) return err(404, 'User not found');

    const pack = await getUserContextPack(targetUserId);
    const { _raw, ...publicPack } = pack;
    void _raw;

    void emit(admin.id, EventType.ADMIN_USER_VIEWED, { targetUserId });

    return ok({ user: stripSensitive(userRes.Item), contextPack: publicPack });
  }

  // ── List path: /admin/users?q=email-prefix ──────────────────
  // Scan is fine at current scale (low thousands). When we hit ~50k users,
  // swap to an email-prefix GSI or a search index — but YAGNI for now.
  const q = (event.queryStringParameters?.q || '').toLowerCase();
  const limit = Math.min(
    parseInt(event.queryStringParameters?.limit || String(DEFAULT_LIMIT), 10) ||
      DEFAULT_LIMIT,
    MAX_LIMIT,
  );

  const scan = await db.send(
    new ScanCommand({
      TableName: Resource.Users.name,
      Limit: 500, // scan budget, then filter+slice in memory
      ProjectionExpression:
        'id, email, #n, onboardingCompleted, createdAt, updatedAt, doshaType, #r',
      ExpressionAttributeNames: { '#n': 'name', '#r': 'role' },
    }),
  );

  const all = (scan.Items || []) as any[];
  const filtered = q
    ? all.filter((u) => typeof u.email === 'string' && u.email.startsWith(q))
    : all;

  filtered.sort((a, b) =>
    String(b.createdAt || '').localeCompare(String(a.createdAt || '')),
  );

  return ok({
    users: filtered.slice(0, limit),
    total: filtered.length,
    truncated: filtered.length >= 500,
  });
}

function stripSensitive(row: any) {
  const { passwordHash, googleSub, ...safe } = row;
  void passwordHash;
  void googleSub;
  return safe;
}
