/**
 * AWS SES Email Provider
 * https://docs.aws.amazon.com/ses/
 */

import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import { EmailProvider, SendEmailOptions, SendEmailResult } from "../types";
import { siteConfig } from "@/config/site.config";

export class AWSSESProvider implements EmailProvider {
  private client: SESClient;

  constructor() {
    this.client = new SESClient({
      region: process.env.AWS_SES_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const boundary = `----=_Part_${Date.now()}`;
      const fromAddress = `${siteConfig.email.fromName} <${siteConfig.email.fromAddress}>`;

      // Build MIME message
      let rawMessage = [
        `From: ${fromAddress}`,
        `To: ${options.to}`,
        `Subject: ${options.subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        `Content-Type: text/html; charset=UTF-8`,
        `Content-Transfer-Encoding: 7bit`,
        "",
        options.html,
      ].join("\r\n");

      // Add attachments
      if (options.attachments && options.attachments.length > 0) {
        for (const attachment of options.attachments) {
          const content =
            attachment.content instanceof Buffer
              ? attachment.content.toString("base64")
              : Buffer.from(attachment.content).toString("base64");

          rawMessage += [
            "",
            `--${boundary}`,
            `Content-Type: ${attachment.contentType || "application/pdf"}; name="${attachment.filename}"`,
            `Content-Disposition: attachment; filename="${attachment.filename}"`,
            `Content-Transfer-Encoding: base64`,
            "",
            content,
          ].join("\r\n");
        }
      }

      rawMessage += `\r\n--${boundary}--`;

      const command = new SendRawEmailCommand({
        RawMessage: {
          Data: Buffer.from(rawMessage),
        },
      });

      const response = await this.client.send(command);

      return { success: true, messageId: response.MessageId };
    } catch (error) {
      console.error("AWS SES send error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  }
}
