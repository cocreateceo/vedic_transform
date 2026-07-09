// Authed subscription endpoint.
//   GET  /data/subscription           → the user's plan + computed entitlement
//   POST /data/subscription/checkout  → start an upgrade (501 until a gateway
//                                        is wired — payments is scaffold-only)

import { Resource } from "sst";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { db, ok, err, CORS_HEADERS, getUserFromEvent } from "../lib/utils";
import {
  isActive,
  FREE_SUBSCRIPTION,
  type SubscriptionRecord,
} from "../lib/entitlement";
import {
  createCheckout,
  PaymentsNotConfiguredError,
  paymentsProvider,
} from "../lib/payments";

export async function handler(event: any) {
  if (event.requestContext?.http?.method === "OPTIONS")
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };

  const user = await getUserFromEvent(event);
  if (!user) return err(401, "Unauthorized");

  const method = event.requestContext?.http?.method;

  const res = await db.send(
    new GetCommand({
      TableName: Resource.Subscriptions.name,
      Key: { userId: user.id },
    }),
  );
  const sub: SubscriptionRecord =
    (res.Item as SubscriptionRecord | undefined) ?? {
      userId: user.id,
      ...FREE_SUBSCRIPTION,
    };

  if (method === "GET") {
    return ok({
      plan: sub.plan,
      status: sub.status,
      isPremium: isActive(sub, Date.now()),
      currentPeriodEnd: sub.currentPeriodEnd ?? null,
    });
  }

  if (method === "POST") {
    try {
      const checkout = await createCheckout({ userId: user.id, plan: "premium" });
      return ok({ url: checkout.url, provider: checkout.provider });
    } catch (e) {
      if (e instanceof PaymentsNotConfiguredError) {
        return err(
          501,
          `Payments not configured (provider: ${paymentsProvider()}). Scaffold only — wire a gateway in functions/lib/payments.ts to enable checkout.`,
        );
      }
      console.error("checkout error", e);
      return err(500, "Checkout failed");
    }
  }

  return err(405, "Method not allowed");
}
