/**
 * Site Configuration
 * Centralized configuration for customizable features
 */

export const siteConfig = {
  // Site Info
  name: "10X Vedic",
  description: "48-Day Vedic Transformation Program",

  // Intro Video (YouTube embed on landing page)
  introVideo: {
    enabled: true,
    // YouTube video ID (e.g., for https://youtube.com/watch?v=ABC123, use "ABC123")
    youtubeVideoId: "inpok4MKVLM", // Sample: "5 minute meditation" - Replace with your video
    title: "Welcome to 10X Vedic Transformation",
    // Set to true to autoplay (muted)
    autoplay: false,
  },

  // Welcome Email PDF
  welcomePdf: {
    enabled: true,
    // Path relative to public folder
    path: "/instructions/welcome-guide.pdf",
    // Filename shown in email attachment
    attachmentName: "10X-Vedic-Transformation-Guide.pdf",
  },

  // Email Configuration
  email: {
    // Provider: "resend" | "aws-ses" | "azure"
    provider: (process.env.EMAIL_PROVIDER || "resend") as "resend" | "aws-ses" | "azure",
    // From address (must be verified with your provider)
    fromAddress: process.env.EMAIL_FROM || "welcome@10xvedic.com",
    fromName: "10X Vedic",
  },

  // Social Links
  social: {
    youtube: "https://www.youtube.com/@vedic-s",
  },
};

export type SiteConfig = typeof siteConfig;
