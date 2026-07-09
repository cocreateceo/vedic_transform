// Provider-agnostic email sender. The lifecycle cron calls `sendEmail()` and
// never knows which backend delivers it. Until a real provider is wired, the
// default "console" adapter just logs — so the whole pipeline (decision →
// render → send → dedup) is deployable and testable without an account.
//
// To go live: set EMAIL_PROVIDER=ses (and EMAIL_FROM) on the cron, then fill in
// `sendViaSes` below (install @aws-sdk/client-ses and link an SES identity in
// sst.config.ts). A Resend/Postmark adapter would slot in the same switch.

export interface OutboundEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

type Provider = "console" | "ses";

function provider(): Provider {
  return (process.env.EMAIL_PROVIDER as Provider) || "console";
}

/** Logs the email instead of sending. The no-op default for the scaffold. */
function sendViaConsole(email: OutboundEmail): boolean {
  console.log(`[email:console] → ${email.to} :: ${email.subject}`);
  return true;
}

/**
 * Stub. Intentionally not importing @aws-sdk/client-ses so the build stays
 * green without the dependency. Wire this when SES is provisioned:
 *   const ses = new SESv2Client({});
 *   await ses.send(new SendEmailCommand({ FromEmailAddress: process.env.EMAIL_FROM, ... }));
 */
async function sendViaSes(email: OutboundEmail): Promise<boolean> {
  console.error(
    `[email:ses] NOT WIRED — would send to ${email.to} (${email.subject}). ` +
      "Implement sendViaSes() and set EMAIL_FROM.",
  );
  return false;
}

/**
 * Dispatch one email through the configured provider. Returns true only when
 * the message was actually handed off (console counts — it's the no-op
 * provider). The caller records a true result for dedup.
 */
export async function sendEmail(email: OutboundEmail): Promise<boolean> {
  try {
    switch (provider()) {
      case "ses":
        return await sendViaSes(email);
      case "console":
      default:
        return sendViaConsole(email);
    }
  } catch (e) {
    console.error("sendEmail error:", e);
    return false;
  }
}
