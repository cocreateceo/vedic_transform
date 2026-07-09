// Fires hourly. Scans users with an email + active journey, decides which
// lifecycle email (welcome / day-N milestone / completion / win-back) is due,
// renders it, sends it through the provider-agnostic sender, and records it on
// the user's ReminderSettings item so it never repeats.
//
// Provider defaults to "console" (logs only) until SES is wired — see
// functions/lib/email.ts. The pipeline is fully deployable in the meantime.

import { Resource } from "sst";
import { ScanCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../lib/utils";
import { getJourneyDayForUser, getStreakForUser } from "../lib/push-time";
import { decideLifecycleEmail } from "../lib/lifecycle";
import { renderLifecycleEmail } from "../lib/email-templates";
import { sendEmail } from "../lib/email";
import { unsubscribeToken } from "../lib/email-token";

const APP_URL = process.env.APP_URL || "https://10x.vedics.net";
const API_URL = process.env.API_URL || "";

interface UserRow {
  id: string;
  email?: string;
  name?: string;
}

interface ReminderRow {
  userId: string;
  emailOptOut?: boolean;
  emailsSent?: Set<string> | string[];
}

function sentSet(r: ReminderRow | undefined): Set<string> {
  const raw = r?.emailsSent;
  if (!raw) return new Set();
  return raw instanceof Set ? raw : new Set(raw);
}

export async function handler() {
  const scan = await db.send(
    new ScanCommand({ TableName: Resource.Users.name }),
  );
  const users = (scan.Items || []) as UserRow[];

  let sent = 0;
  for (const u of users) {
    try {
      if (!u.email) continue;

      const settings = await db.send(
        new GetCommand({
          TableName: Resource.ReminderSettings.name,
          Key: { userId: u.id },
        }),
      );
      const s = settings.Item as ReminderRow | undefined;
      if (s?.emailOptOut) continue;

      const journeyDay = await getJourneyDayForUser(u.id);
      if (journeyDay === 0) continue;

      const streak = await getStreakForUser(u.id);
      const lastCheckin: string | null = streak?.lastCheckin || null;
      const daysSinceLastCheckin =
        lastCheckin === null
          ? null
          : Math.floor((Date.now() - new Date(lastCheckin).getTime()) / 86400000);

      const key = decideLifecycleEmail({
        hasJourney: true,
        journeyDay,
        daysSinceLastCheckin,
        alreadySent: sentSet(s),
      });
      if (!key) continue;

      const token = unsubscribeToken(u.id);
      const email = renderLifecycleEmail(key, {
        name: u.name || "friend",
        journeyDay,
        appUrl: APP_URL,
        unsubscribeUrl: `${API_URL}/data/email/unsubscribe?u=${encodeURIComponent(u.id)}&t=${token}`,
      });

      const ok = await sendEmail({ to: u.email, ...email });
      if (!ok) continue;

      // Record the key so it never re-sends (DynamoDB string set).
      await db.send(
        new UpdateCommand({
          TableName: Resource.ReminderSettings.name,
          Key: { userId: u.id },
          UpdateExpression: "ADD emailsSent :k",
          ExpressionAttributeValues: { ":k": new Set([key]) },
        }),
      );
      sent++;
    } catch (e) {
      console.error("lifecycle-email error for user", u.id, e);
    }
  }

  console.log(`lifecycle-email: ${sent} sent`);
  return { sent };
}
