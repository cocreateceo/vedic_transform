// Live-origin routing smoke test — asserts the HTTP-layer contracts that
// crawlers and no-JS agents depend on. Currently:
//   1. /register/ answers 307 → /login/?tab=signup (never an empty shell)
//   2. /login/ serves the sign-in form in its initial HTML
//
// Usage: node scripts/e2e-smoke-routing.mjs  (BASE_URL env to override)

const BASE_URL = process.env.BASE_URL || "https://10x.vedics.net";

let failures = 0;
function check(label, ok, detail) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

// 1. /register/ must redirect at the HTTP layer.
const reg = await fetch(`${BASE_URL}/register/`, { redirect: "manual" });
const location = reg.headers.get("location") || "";
check("/register/ returns 307", reg.status === 307, `got ${reg.status}`);
check(
  "/register/ Location points at login signup tab",
  location.includes("/login/?tab=signup"),
  `got ${JSON.stringify(location)}`,
);

// 2. /login/ must ship the sign-in form in server-rendered HTML.
const login = await fetch(`${BASE_URL}/login/`);
const html = await login.text();
check("/login/ returns 200", login.status === 200, `got ${login.status}`);
for (const needle of ["Email", "Password", "Sign In", "Create one"]) {
  check(`/login/ initial HTML contains "${needle}"`, html.includes(needle));
}

// process.exit() here trips a libuv assertion on Windows while undici's
// keep-alive sockets are still closing — set exitCode and let Node drain.
process.exitCode = failures === 0 ? 0 : 1;
