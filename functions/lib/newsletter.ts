// Pure validation/normalization for newsletter signups — kept out of the
// handler so it can be unit-tested without SST resource bindings.

// Pragmatic RFC-5322-ish check — the real validation is the inbox itself.
// Rejects whitespace, missing @, and missing TLD without being so strict
// that legitimate addresses bounce off the form.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Where on the site the signup came from — bounded so a typo'd or hostile
// client can't mint arbitrary analytics buckets.
const ALLOWED_SOURCES = new Set(['footer', 'blog', 'landing', 'unknown']);

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) return null;
  return email;
}

export function normalizeSource(raw: unknown): string {
  return typeof raw === 'string' && ALLOWED_SOURCES.has(raw) ? raw : 'unknown';
}
