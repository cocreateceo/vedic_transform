import { describe, expect, test } from "vitest";
import {
  COHORT_ID,
  isSpam,
  normalizeRegistration,
} from "./class-registration";

const valid = {
  name: "Asha Rao",
  email: "Asha@Example.com",
  phone: " +91 98765 43210 ",
  region: "india",
  source: "friend",
};

describe("isSpam", () => {
  test("empty or missing honeypot is not spam", () => {
    expect(isSpam({})).toBe(false);
    expect(isSpam({ website: "" })).toBe(false);
  });

  test("filled honeypot is spam", () => {
    expect(isSpam({ website: "https://spam.example" })).toBe(true);
  });
});

describe("normalizeRegistration", () => {
  test("valid body produces a full item", () => {
    const res = normalizeRegistration(valid);
    expect(res).toEqual({
      item: {
        email: "asha@example.com",
        cohortId: COHORT_ID,
        name: "Asha Rao",
        phone: "+91 98765 43210",
        region: "india",
        referralSource: "friend",
        referredBy: null,
        status: "registered",
      },
    });
  });

  test("referredBy is normalized when present", () => {
    const res = normalizeRegistration({ ...valid, referredBy: " Ravi@Example.COM " });
    expect("item" in res && res.item.referredBy).toBe("ravi@example.com");
  });

  test("invalid referredBy errors, blank is null", () => {
    expect(normalizeRegistration({ ...valid, referredBy: "nope" })).toEqual({
      error: "Please enter a valid email for who referred you",
    });
    const res = normalizeRegistration({ ...valid, referredBy: "  " });
    expect("item" in res && res.item.referredBy).toBeNull();
  });

  test("self-referral collapses to null", () => {
    const res = normalizeRegistration({ ...valid, referredBy: "asha@example.com" });
    expect("item" in res && res.item.referredBy).toBeNull();
  });

  test("phone is optional and null when blank", () => {
    const res = normalizeRegistration({ ...valid, phone: "  " });
    expect("item" in res && res.item.phone).toBeNull();
  });

  test("missing or short name errors", () => {
    expect(normalizeRegistration({ ...valid, name: "" })).toEqual({
      error: "Please enter your name",
    });
    expect(normalizeRegistration({ ...valid, name: undefined })).toEqual({
      error: "Please enter your name",
    });
  });

  test("name is trimmed and capped at 100 chars", () => {
    const res = normalizeRegistration({ ...valid, name: `  ${"x".repeat(150)}  ` });
    expect("item" in res && res.item.name).toBe("x".repeat(100));
  });

  test("invalid email errors", () => {
    expect(normalizeRegistration({ ...valid, email: "nope" })).toEqual({
      error: "Please enter a valid email address",
    });
  });

  test("overlong phone errors", () => {
    expect(
      normalizeRegistration({ ...valid, phone: "9".repeat(31) }),
    ).toEqual({ error: "Please enter a valid phone number" });
  });

  test("unknown region and source collapse to 'unknown'", () => {
    const res = normalizeRegistration({
      ...valid,
      region: "mars",
      source: 42,
    });
    expect("item" in res && res.item.region).toBe("unknown");
    expect("item" in res && res.item.referralSource).toBe("unknown");
  });
});
