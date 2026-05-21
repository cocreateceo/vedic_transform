// Event emission — fire-and-forget writes to the Events DynamoDB table.
//
// Every Lambda that mutates user state should call emit() so the eventual
// analytics layer has data to consume. Best-effort by design: failures are
// logged but never re-thrown, so an Events write can't break a check-in or
// a registration.
//
// Wiring: the route must `link` the `events` Dynamo resource in
// sst.config.ts. Unbound handlers will hit the catch path and log.

import { Resource } from 'sst';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, generateId } from './utils';

// Canonical event types. Use these constants instead of string literals at
// call sites so a typo doesn't quietly create a new bucket.
export const EventType = {
  AUTH_REGISTER: 'auth.register',
  AUTH_LOGIN: 'auth.login',
  AUTH_GOOGLE_LOGIN: 'auth.google_login',
  AUTH_GOOGLE_REGISTER: 'auth.google_register',
  CHECKIN_COMPLETED: 'checkin.completed',
  JOURNEY_STARTED: 'journey.started',
  JOURNEY_ADVANCED: 'journey.advanced',
  BRIEF_VIEWED: 'brief.viewed',
  DOSHA_COMPLETED_ANON: 'dosha.completed_anonymous',
  ADMIN_USER_VIEWED: 'admin.user_viewed',
} as const;

export type EventTypeLiteral = typeof EventType[keyof typeof EventType];

export interface EventProps {
  [key: string]: unknown;
}

/**
 * Fire-and-forget event write. Never throws. Returns true if the row was
 * written, false if it was suppressed (e.g. unbound Events resource).
 *
 * Pass `null` for userId on anonymous events (e.g. anonymous dosha test).
 */
export async function emit(
  userId: string | null,
  eventType: EventTypeLiteral | string,
  props: EventProps = {},
): Promise<boolean> {
  let tableName: string;
  try {
    tableName = Resource.Events.name;
  } catch (e) {
    // The Events resource isn't linked to this Lambda — log once and skip.
    // Bind it in sst.config.ts to start collecting.
    console.warn('events.emit: Events resource not linked, skipping', eventType);
    return false;
  }

  try {
    await db.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          id: generateId(),
          userId: userId ?? 'anonymous',
          eventType,
          props,
          createdAt: new Date().toISOString(),
        },
      }),
    );
    return true;
  } catch (e) {
    console.error('events.emit failed:', eventType, e);
    return false;
  }
}
