/**
 * Email Service
 * Factory for creating email providers based on configuration
 */

import { siteConfig } from "@/config/site.config";
import { EmailProvider, EmailProviderType, SendEmailResult } from "./types";
import { ResendProvider } from "./providers/resend";
import { AWSSESProvider } from "./providers/aws-ses";
import { AzureEmailProvider } from "./providers/azure";
import fs from "fs";
import path from "path";

// Cache provider instance
let providerInstance: EmailProvider | null = null;

/**
 * Get the configured email provider
 */
function getEmailProvider(): EmailProvider {
  if (providerInstance) {
    return providerInstance;
  }

  const providerType: EmailProviderType = siteConfig.email.provider;

  switch (providerType) {
    case "resend":
      providerInstance = new ResendProvider();
      break;
    case "aws-ses":
      providerInstance = new AWSSESProvider();
      break;
    case "azure":
      providerInstance = new AzureEmailProvider();
      break;
    default:
      throw new Error(`Unknown email provider: ${providerType}`);
  }

  return providerInstance;
}

/**
 * Send welcome email with PDF attachment to new user
 */
export async function sendWelcomeEmail(
  to: string,
  userName: string
): Promise<SendEmailResult> {
  // Check if welcome email is enabled
  if (!siteConfig.welcomePdf.enabled) {
    console.log("Welcome email is disabled in config");
    return { success: true, messageId: "disabled" };
  }

  try {
    const provider = getEmailProvider();

    // Read PDF file
    const pdfPath = path.join(process.cwd(), "public", siteConfig.welcomePdf.path);
    let pdfBuffer: Buffer | undefined;

    if (fs.existsSync(pdfPath)) {
      pdfBuffer = fs.readFileSync(pdfPath);
    } else {
      console.warn(`Welcome PDF not found at: ${pdfPath}`);
    }

    // Generate email HTML
    const html = generateWelcomeEmailHtml(userName);

    // Send email
    const result = await provider.send({
      to,
      subject: "Welcome to 10X Vedic - Your 48-Day Transformation Begins!",
      html,
      text: generateWelcomeEmailText(userName),
      attachments: pdfBuffer
        ? [
            {
              filename: siteConfig.welcomePdf.attachmentName,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ]
        : undefined,
    });

    if (result.success) {
      console.log(`Welcome email sent to ${to}, messageId: ${result.messageId}`);
    } else {
      console.error(`Failed to send welcome email to ${to}: ${result.error}`);
    }

    return result;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send welcome email",
    };
  }
}

/**
 * Generate welcome email HTML content
 */
function generateWelcomeEmailHtml(userName: string): string {
  const name = userName || "Seeker";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to 10X Vedic</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF7ED;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px; background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%); text-align: center;">
        <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: bold;">
          10X Vedic
        </h1>
        <p style="margin: 10px 0 0; color: #FED7AA; font-size: 14px;">
          48-Day Transformation Program
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 40px 30px; background-color: #FFFFFF;">
        <h2 style="margin: 0 0 20px; color: #1F2937; font-size: 24px;">
          Namaste, ${name}!
        </h2>

        <p style="margin: 0 0 20px; color: #4B5563; font-size: 16px; line-height: 1.6;">
          Welcome to your transformational journey. You've taken the first step toward realigning your body, mind, and energy through the ancient wisdom of Vedic practices.
        </p>

        <p style="margin: 0 0 20px; color: #4B5563; font-size: 16px; line-height: 1.6;">
          Over the next <strong>48 days</strong>, you will:
        </p>

        <ul style="margin: 0 0 20px; padding-left: 20px; color: #4B5563; font-size: 16px; line-height: 1.8;">
          <li>Build strong discipline and emotional stability</li>
          <li>Improve your digestion and metabolism</li>
          <li>Develop a clear mind and sharp decision-making</li>
          <li>Experience rapid spiritual and material growth</li>
          <li>Activate your success energy</li>
        </ul>

        <p style="margin: 0 0 30px; color: #4B5563; font-size: 16px; line-height: 1.6;">
          Your commitment is simple: <strong>30 minutes for your mind</strong> and <strong>30 minutes for your body</strong> each day. Show up daily with an open mind, and transformation will follow.
        </p>

        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
          <tr>
            <td style="border-radius: 8px; background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%);">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login"
                 style="display: inline-block; padding: 16px 32px; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: bold;">
                Start Your Journey
              </a>
            </td>
          </tr>
        </table>

        <p style="margin: 30px 0 0; color: #9CA3AF; font-size: 14px; text-align: center;">
          We've attached your complimentary transformation guide to this email.
        </p>
      </td>
    </tr>

    <!-- The 11 Pillars Preview -->
    <tr>
      <td style="padding: 30px; background-color: #FFF7ED;">
        <h3 style="margin: 0 0 15px; color: #1F2937; font-size: 18px; text-align: center;">
          Your 11 Transformation Pillars
        </h3>
        <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.8; text-align: center;">
          5 AM Initiation | Vedic Nutrition | Movement | Sleep Optimization<br>
          Intention Reset | Pranayama | Healing Meditation | Gratitude<br>
          Sandhya Meditation | Connection to Brahman | Divine Manifestation
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; background-color: #1F2937; text-align: center;">
        <p style="margin: 0 0 10px; color: #9CA3AF; font-size: 14px;">
          May your journey be blessed with clarity and transformation.
        </p>
        <p style="margin: 0; color: #6B7280; font-size: 12px;">
          &copy; ${new Date().getFullYear()} 10X Vedic Transformation. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Generate welcome email plain text content
 */
function generateWelcomeEmailText(userName: string): string {
  const name = userName || "Seeker";

  return `
Namaste, ${name}!

Welcome to 10X Vedic - Your 48-Day Transformation Program

You've taken the first step toward realigning your body, mind, and energy through the ancient wisdom of Vedic practices.

Over the next 48 days, you will:
- Build strong discipline and emotional stability
- Improve your digestion and metabolism
- Develop a clear mind and sharp decision-making
- Experience rapid spiritual and material growth
- Activate your success energy

Your commitment is simple: 30 minutes for your mind and 30 minutes for your body each day. Show up daily with an open mind, and transformation will follow.

Start your journey: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login

Your 11 Transformation Pillars:
5 AM Initiation | Vedic Nutrition | Movement | Sleep Optimization
Intention Reset | Pranayama | Healing Meditation | Gratitude
Sandhya Meditation | Connection to Brahman | Divine Manifestation

We've attached your complimentary transformation guide to this email.

May your journey be blessed with clarity and transformation.

--
10X Vedic Transformation
`;
}

export * from "./types";
