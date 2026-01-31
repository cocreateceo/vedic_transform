/**
 * Azure Communication Services Email Provider
 * https://docs.microsoft.com/azure/communication-services/
 */

import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email";
import { EmailProvider, SendEmailOptions, SendEmailResult } from "../types";
import { siteConfig } from "@/config/site.config";

export class AzureEmailProvider implements EmailProvider {
  private client: EmailClient;

  constructor() {
    const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error("AZURE_COMMUNICATION_CONNECTION_STRING environment variable is not set");
    }
    this.client = new EmailClient(connectionString);
  }

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const message = {
        senderAddress: siteConfig.email.fromAddress,
        content: {
          subject: options.subject,
          html: options.html,
          plainText: options.text,
        },
        recipients: {
          to: [{ address: options.to }],
        },
        attachments: options.attachments?.map((att) => ({
          name: att.filename,
          contentType: att.contentType || "application/pdf",
          contentInBase64:
            att.content instanceof Buffer
              ? att.content.toString("base64")
              : Buffer.from(att.content).toString("base64"),
        })),
      };

      const poller = await this.client.beginSend(message);
      const result = await poller.pollUntilDone();

      if (result.status === KnownEmailSendStatus.Succeeded) {
        return { success: true, messageId: result.id };
      } else {
        return {
          success: false,
          error: `Email send failed with status: ${result.status}`,
        };
      }
    } catch (error) {
      console.error("Azure Email send error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  }
}
