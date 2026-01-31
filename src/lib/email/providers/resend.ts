/**
 * Resend Email Provider
 * https://resend.com/docs
 */

import { Resend } from "resend";
import { EmailProvider, SendEmailOptions, SendEmailResult } from "../types";
import { siteConfig } from "@/config/site.config";

export class ResendProvider implements EmailProvider {
  private client: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    this.client = new Resend(apiKey);
  }

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const { data, error } = await this.client.emails.send({
        from: `${siteConfig.email.fromName} <${siteConfig.email.fromAddress}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments?.map((att) => ({
          filename: att.filename,
          content: att.content instanceof Buffer ? att.content : Buffer.from(att.content),
        })),
      });

      if (error) {
        console.error("Resend error:", error);
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error("Resend send error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  }
}
