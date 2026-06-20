// Pure entitlement logic shared by the subscription endpoint. Decides whether a
// stored subscription grants premium access right now. No AWS imports so it is
// unit-testable.

export type Plan = "free" | "premium";
export type SubStatus = "active" | "canceled" | "past_due" | "none";

export interface SubscriptionRecord {
  userId: string;
  plan: Plan;
  status: SubStatus;
  /** Epoch ms the paid period ends; undefined = no expiry tracked. */
  currentPeriodEnd?: number;
  provider?: string;
  externalId?: string;
  updatedAt?: string;
}

/** True when the subscription grants premium access at `nowMs`. */
export function isActive(
  sub: SubscriptionRecord | null | undefined,
  nowMs: number,
): boolean {
  if (!sub) return false;
  if (sub.plan !== "premium") return false;
  if (sub.status !== "active") return false;
  if (sub.currentPeriodEnd != null && sub.currentPeriodEnd < nowMs) return false;
  return true;
}

/** The free-tier default returned when a user has no subscription row. */
export const FREE_SUBSCRIPTION: Omit<SubscriptionRecord, "userId"> = {
  plan: "free",
  status: "none",
};
