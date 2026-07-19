import { describe, expect, test } from "vitest";
import { normalizeEmail, normalizeSource } from "./newsletter";

describe("normalizeEmail", () => {
  test("valid email passes through", () => {
    expect(normalizeEmail("seeker@example.com")).toBe("seeker@example.com");
  });

  test("trims and lowercases", () => {
    expect(normalizeEmail("  Seeker@Example.COM ")).toBe("seeker@example.com");
  });

  test("rejects non-strings", () => {
    expect(normalizeEmail(undefined)).toBeNull();
    expect(normalizeEmail(null)).toBeNull();
    expect(normalizeEmail(42)).toBeNull();
    expect(normalizeEmail({ email: "a@b.co" })).toBeNull();
  });

  test("rejects malformed addresses", () => {
    expect(normalizeEmail("")).toBeNull();
    expect(normalizeEmail("not-an-email")).toBeNull();
    expect(normalizeEmail("missing@tld")).toBeNull();
    expect(normalizeEmail("two words@example.com")).toBeNull();
    expect(normalizeEmail("@example.com")).toBeNull();
    expect(normalizeEmail("a@.com")).toBeNull();
  });

  test("rejects addresses over 254 chars", () => {
    const long = `${"a".repeat(250)}@example.com`;
    expect(normalizeEmail(long)).toBeNull();
  });
});

describe("normalizeSource", () => {
  test("known sources pass through", () => {
    expect(normalizeSource("footer")).toBe("footer");
    expect(normalizeSource("blog")).toBe("blog");
    expect(normalizeSource("landing")).toBe("landing");
  });

  test("unknown or non-string sources collapse to 'unknown'", () => {
    expect(normalizeSource("evil-bucket")).toBe("unknown");
    expect(normalizeSource(undefined)).toBe("unknown");
    expect(normalizeSource(123)).toBe("unknown");
  });
});
