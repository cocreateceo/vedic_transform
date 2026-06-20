// Signed, stateless unsubscribe tokens. HMAC-SHA256(userId) with the existing
// JwtSecret — no new secret, no DB lookup to validate. Used by the lifecycle
// cron (to build the link) and the unsubscribe handler (to verify it).

import { createHmac, timingSafeEqual } from "crypto";
import { Resource } from "sst";

export function unsubscribeToken(userId: string): string {
  const secret = Resource.JwtSecret.value;
  return createHmac("sha256", secret).update(`unsub:${userId}`).digest("hex");
}

export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  const expected = unsubscribeToken(userId);
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
