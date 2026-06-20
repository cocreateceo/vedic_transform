import { describe, expect, test } from "vitest";
import { isActive, type SubscriptionRecord } from "./entitlement";

const NOW = 1_700_000_000_000;
const premium = (over: Partial<SubscriptionRecord> = {}): SubscriptionRecord => ({
  userId: "u1",
  plan: "premium",
  status: "active",
  ...over,
});

describe("isActive", () => {
  test("no subscription → false", () => {
    expect(isActive(null, NOW)).toBe(false);
    expect(isActive(undefined, NOW)).toBe(false);
  });

  test("free plan → false", () => {
    expect(isActive(premium({ plan: "free", status: "none" }), NOW)).toBe(false);
  });

  test("premium + active, no expiry → true", () => {
    expect(isActive(premium(), NOW)).toBe(true);
  });

  test("premium + active, period in the future → true", () => {
    expect(isActive(premium({ currentPeriodEnd: NOW + 86400000 }), NOW)).toBe(true);
  });

  test("premium + active, period already passed → false", () => {
    expect(isActive(premium({ currentPeriodEnd: NOW - 1 }), NOW)).toBe(false);
  });

  test("premium but canceled → false", () => {
    expect(isActive(premium({ status: "canceled" }), NOW)).toBe(false);
  });

  test("premium but past_due → false", () => {
    expect(isActive(premium({ status: "past_due" }), NOW)).toBe(false);
  });
});
