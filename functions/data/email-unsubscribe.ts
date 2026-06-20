// Public, no-auth unsubscribe endpoint reached from the link in every lifecycle
// email. Validates the signed token (HMAC of the userId), then flips
// emailOptOut on the user's ReminderSettings item. Returns a small HTML page.

import { Resource } from "sst";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../lib/utils";
import { verifyUnsubscribeToken } from "../lib/email-token";

function page(title: string, message: string, statusCode = 200) {
  return {
    statusCode,
    headers: { "content-type": "text/html; charset=utf-8" },
    body: `<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;background:#0f0d08;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0"><div style="max-width:420px;text-align:center;padding:24px"><div style="color:#fbbf24;letter-spacing:2px;font-size:13px;margin-bottom:16px">10X VEDIC TRANSFORM</div><h1 style="font-size:22px;margin:0 0 12px">${title}</h1><p style="color:#cbd5e1;line-height:1.6;margin:0">${message}</p></div></body></html>`,
  };
}

export async function handler(event: any) {
  const q = event.queryStringParameters || {};
  const userId: string | undefined = q.u;
  const token: string | undefined = q.t;

  if (!userId || !token || !verifyUnsubscribeToken(userId, token)) {
    return page(
      "Invalid link",
      "This unsubscribe link is invalid or has expired.",
      400,
    );
  }

  try {
    await db.send(
      new UpdateCommand({
        TableName: Resource.ReminderSettings.name,
        Key: { userId },
        UpdateExpression: "SET emailOptOut = :true",
        ExpressionAttributeValues: { ":true": true },
      }),
    );
  } catch (e) {
    console.error("unsubscribe error", e);
    return page(
      "Something went wrong",
      "We couldn't process that just now. Please try again later.",
      500,
    );
  }

  return page(
    "You're unsubscribed",
    "You won't receive lifecycle emails anymore. You can re-enable them anytime in your reminder settings.",
  );
}
