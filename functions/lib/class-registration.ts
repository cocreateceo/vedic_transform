// Pure validation/normalization for live-cohort registrations — kept out of
// the handler so it can be unit-tested without SST resource bindings.

import { normalizeEmail } from './newsletter';

export const COHORT_ID = '2026-08';

// Single "where are you joining from" dropdown — region+timezone combined.
// Bounded so a hostile client can't mint arbitrary analytics buckets.
export const ALLOWED_REGIONS = [
  'india',
  'us-eastern',
  'us-central',
  'us-pacific',
  'uk-europe',
  'middle-east',
  'southeast-asia',
  'australia-nz',
  'other',
] as const;

export const ALLOWED_SOURCES = [
  'friend',
  'social',
  'search',
  'email',
  'other',
] as const;

export interface RegistrationItem {
  email: string;
  cohortId: string;
  name: string;
  phone: string | null;
  region: string;
  referralSource: string;
  status: 'registered';
}

export function isSpam(body: any): boolean {
  return typeof body?.website === 'string' && body.website.trim().length > 0;
}

const PHONE_RE = /^[+\d][\d\s\-().]{4,29}$/;

export function normalizeRegistration(
  body: any,
): { item: RegistrationItem } | { error: string } {
  const name =
    typeof body?.name === 'string' ? body.name.trim().slice(0, 100) : '';
  if (!name) return { error: 'Please enter your name' };

  const email = normalizeEmail(body?.email);
  if (!email) return { error: 'Please enter a valid email address' };

  let phone: string | null = null;
  if (typeof body?.phone === 'string' && body.phone.trim()) {
    const trimmed = body.phone.trim();
    if (!PHONE_RE.test(trimmed))
      return { error: 'Please enter a valid phone number' };
    phone = trimmed;
  }

  const region = (ALLOWED_REGIONS as readonly string[]).includes(body?.region)
    ? body.region
    : 'unknown';
  const referralSource = (ALLOWED_SOURCES as readonly string[]).includes(
    body?.source,
  )
    ? body.source
    : 'unknown';

  return {
    item: {
      email,
      cohortId: COHORT_ID,
      name,
      phone,
      region,
      referralSource,
      status: 'registered',
    },
  };
}
