import { describe, expect, test } from "vitest";
import nextConfig from "../../next.config";

// /register must redirect at the HTTP layer, not via a client-side
// useEffect — crawlers and no-JS agents otherwise see an empty shell.
// See fix(register) commit 1379820.
describe("next.config redirects", () => {
  test("/register redirects to the login signup tab", async () => {
    const redirects = await nextConfig.redirects!();
    const register = redirects.find((r) => r.source === "/register");
    expect(register).toBeDefined();
    expect(register!.destination).toBe("/login/?tab=signup");
    // Deliberately temporary: /register may return as a dedicated
    // enrollment page. Flip to permanent only once the IA is settled.
    expect(register!.permanent).toBe(false);
  });
});
