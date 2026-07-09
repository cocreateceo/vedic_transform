// Lifecycle email copy + a tiny branded HTML wrapper. Plain template strings
// (no React-Email dep) keep the scaffold dependency-free; swap in richer
// templates later without touching the cron or the sender.

import type { LifecycleEmailKey } from "./lifecycle";

export interface EmailContext {
  name: string;
  journeyDay: number;
  appUrl: string;
  unsubscribeUrl: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const COPY: Record<
  LifecycleEmailKey,
  (c: EmailContext) => { subject: string; heading: string; body: string; cta: string }
> = {
  welcome: (c) => ({
    subject: "Your 48-day journey begins 🪷",
    heading: `Welcome, ${c.name}`,
    body: "Today is Day 1. One small practice, done consistently, is the whole path. Open your dashboard and take your first breath.",
    cta: "Begin Day 1",
  }),
  day3: () => ({
    subject: "Day 3 — the habit is forming",
    heading: "Three days in",
    body: "The first few days are the hardest. You've shown up — that's the practice. Keep the streak alive today.",
    cta: "Continue today",
  }),
  day7: () => ({
    subject: "One week of transformation 🔥",
    heading: "Seven days strong",
    body: "A full week. Notice what's already shifting in your mornings, your breath, your mind. Onward.",
    cta: "Open dashboard",
  }),
  day14: () => ({
    subject: "Two weeks — you're past the dropout cliff",
    heading: "Fourteen days",
    body: "Most people quit before now. You didn't. The pillars are becoming part of who you are.",
    cta: "Keep going",
  }),
  day21: () => ({
    subject: "Day 21 — momentum is yours",
    heading: "Three weeks in",
    body: "Real change compounds. Your consistency is the quiet engine behind it. Stay with it.",
    cta: "Continue",
  }),
  day30: () => ({
    subject: "30 days of practice 🙏",
    heading: "A full month",
    body: "Thirty days of showing up for yourself. The final stretch of your 48-day journey is where it deepens.",
    cta: "Finish strong",
  }),
  completion: (c) => ({
    subject: "You completed the 48-day journey 🎉",
    heading: `You did it, ${c.name}`,
    body: "Forty-eight days. Your Sutra Book is complete. Take a moment to honor the discipline it took — then choose what comes next.",
    cta: "View your certificate",
  }),
  winback: (c) => ({
    subject: "The path is still right here",
    heading: `We've missed you, ${c.name}`,
    body: "No guilt, no catching up. The journey didn't go anywhere. Take three quiet minutes today and simply begin again.",
    cta: "Take a 3-minute reset",
  }),
};

function wrap(c: EmailContext, parts: { heading: string; body: string; cta: string }): string {
  return `<!doctype html><html><body style="margin:0;background:#0f0d08;font-family:system-ui,-apple-system,sans-serif;color:#e2e8f0">
  <div style="max-width:520px;margin:0 auto;padding:40px 28px">
    <div style="color:#fbbf24;letter-spacing:2px;font-size:13px;margin-bottom:28px">10X VEDIC TRANSFORM</div>
    <h1 style="font-size:24px;color:#fbbf24;margin:0 0 12px">${parts.heading}</h1>
    <p style="font-size:16px;line-height:1.6;color:#cbd5e1;margin:0 0 28px">${parts.body}</p>
    <a href="${c.appUrl}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#f97316,#fbbf24);color:#1a1508;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:12px">${parts.cta}</a>
    <p style="font-size:12px;color:#64748b;margin:40px 0 0">
      You're receiving milestone nudges for your 48-day journey.
      <a href="${c.unsubscribeUrl}" style="color:#94a3b8">Unsubscribe</a>.
    </p>
  </div></body></html>`;
}

/** Render a lifecycle email to subject/html/text for the given user context. */
export function renderLifecycleEmail(
  key: LifecycleEmailKey,
  ctx: EmailContext,
): RenderedEmail {
  const parts = COPY[key](ctx);
  const text = `${parts.heading}\n\n${parts.body}\n\n${parts.cta}: ${ctx.appUrl}/dashboard\n\nUnsubscribe: ${ctx.unsubscribeUrl}`;
  return { subject: parts.subject, html: wrap(ctx, parts), text };
}
