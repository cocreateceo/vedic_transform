// Provider-agnostic checkout. The subscription endpoint calls createCheckout()
// to start an upgrade and never knows the gateway. Default provider is "none"
// → throws PaymentsNotConfiguredError so the endpoint returns a clean 501. Wire
// Razorpay or Stripe by filling in the matching case (set PAYMENTS_PROVIDER +
// the gateway keys as SST secrets).

export type CheckoutProvider = "none" | "razorpay" | "stripe";

export interface CheckoutRequest {
  userId: string;
  plan: "premium";
}

export interface CheckoutResult {
  url: string;
  provider: CheckoutProvider;
  externalId: string;
}

export class PaymentsNotConfiguredError extends Error {
  constructor() {
    super("Payments provider not configured");
    this.name = "PaymentsNotConfiguredError";
  }
}

export function paymentsProvider(): CheckoutProvider {
  return (process.env.PAYMENTS_PROVIDER as CheckoutProvider) || "none";
}

/**
 * Create a hosted-checkout session for the given plan. Stub until a gateway is
 * wired — each real branch should create the session and return its URL +
 * external id (then a webhook handler flips the Subscriptions row to active).
 */
export async function createCheckout(
  _req: CheckoutRequest,
): Promise<CheckoutResult> {
  switch (paymentsProvider()) {
    case "razorpay":
      // TODO: create a Razorpay Payment Link / Subscription with
      // RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET, return { url, externalId }.
      throw new PaymentsNotConfiguredError();
    case "stripe":
      // TODO: stripe.checkout.sessions.create({ mode: "subscription", ... }).
      throw new PaymentsNotConfiguredError();
    case "none":
    default:
      throw new PaymentsNotConfiguredError();
  }
}
