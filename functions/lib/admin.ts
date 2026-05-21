// Admin auth helper. Wraps getUserFromEvent + a Users.role check so admin
// routes don't have to re-implement role gating.
//
// Role is read from the Users row, not the JWT. That means a freshly-flipped
// admin gets effective access on their next request without having to log
// out and re-issue a token. The trade-off is one extra Users GetItem per
// admin call — fine because admin endpoints are low-volume.
//
// Bootstrap: see docs/ADMIN_BOOTSTRAP.md.

import { Resource } from 'sst';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { db, getUserFromEvent } from './utils';

export interface AdminContext {
  id: string;
  email: string;
  name: string | null;
  role: 'admin';
}

/**
 * Returns the admin context if the JWT is valid AND the user has
 * `role === 'admin'` on their Users row. Returns null otherwise — callers
 * should respond with 401/403 accordingly. We deliberately do not
 * distinguish "no JWT" from "not admin" in the public response; admin
 * routes should always 401 to avoid leaking which user IDs exist.
 */
export async function getAdminFromEvent(event: any): Promise<AdminContext | null> {
  const claims = await getUserFromEvent(event);
  if (!claims?.id) return null;

  const result = await db.send(
    new GetCommand({
      TableName: Resource.Users.name,
      Key: { id: claims.id },
    }),
  );
  const row: any = result.Item;
  if (!row) return null;
  if (row.role !== 'admin') return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name ?? null,
    role: 'admin',
  };
}
