export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "getting-started" | "journey" | "account" | "technical";
}

export const FAQ_DATA: FAQItem[] = [
  // Getting Started (4)
  {
    id: "faq-gs-1",
    question: "What is the 48-day Mandala?",
    answer:
      "The 48-day Mandala is a structured transformation cycle rooted in Vedic tradition. In Sanskrit, a Mandala refers to a sacred period of sustained practice. Over 48 consecutive days, you engage with 11 pillars spanning Body, Mind, and Spirit — building habits that compound into lasting transformation. The number 48 is derived from ancient Vedic cycles that align with natural rhythms of personal change.",
    category: "getting-started",
  },
  {
    id: "faq-gs-2",
    question: "Do I need any prior meditation or yoga experience?",
    answer:
      "No prior experience is needed. The program is designed for complete beginners and experienced practitioners alike. Each pillar starts with foundational guidance and progressively deepens over the 48 days. You will receive clear instructions, guided sessions, and daily wisdom to support you at every step of the journey.",
    category: "getting-started",
  },
  {
    id: "faq-gs-3",
    question: "How much time do I need to dedicate each day?",
    answer:
      "The core daily practice takes approximately 45 to 90 minutes, depending on how deeply you engage with each pillar. Most participants start with the morning routine (15-20 minutes), add breathing and meditation (15-20 minutes), and gradually incorporate nutrition, movement, and evening practices. You can adjust the intensity to fit your schedule while maintaining consistency.",
    category: "getting-started",
  },
  {
    id: "faq-gs-4",
    question: "Is the 10X Vedic program free to use?",
    answer:
      "The foundational 48-day journey, including access to all 11 pillars, daily wisdom, and progress tracking, is free. We believe transformation should be accessible to everyone. Premium features such as personalized coaching, advanced content library access, and community events may be available through optional subscriptions in the future.",
    category: "getting-started",
  },

  // Journey (5)
  {
    id: "faq-j-1",
    question: "What are Karma Points and how do I earn them?",
    answer:
      "Karma Points are a reflection of your dedication and consistency throughout the journey. You earn them by completing daily pillar activities, maintaining streaks, engaging with wisdom content, and hitting milestones. They serve as positive reinforcement rather than competition — a way to visualize the energy you are investing in your own growth.",
    category: "journey",
  },
  {
    id: "faq-j-2",
    question: "How do streaks work?",
    answer:
      "A streak represents consecutive days of completing your daily practice. Each day you log at least your core activities — such as morning routine, breathing practice, or meditation — your streak counter increases. Missing a day resets your streak to zero. Streaks are a powerful motivational tool, and maintaining a 48-day unbroken streak is considered completing a full Mandala.",
    category: "journey",
  },
  {
    id: "faq-j-3",
    question: "Can I restart the 48-day Mandala if I miss days?",
    answer:
      "Absolutely. The Vedic tradition teaches that every moment is an opportunity to begin again. If you miss days and wish to restart, you can reset your Mandala from your dashboard. Your previous progress and Karma Points are preserved in your history, so nothing is truly lost. Many practitioners complete multiple Mandala cycles as part of their ongoing growth.",
    category: "journey",
  },
  {
    id: "faq-j-4",
    question: "What happens after I complete the 48 days?",
    answer:
      "Completing a 48-day Mandala is a significant achievement. After completion, you can start a new Mandala cycle to deepen your practice, focus on specific pillars you want to strengthen, or continue your daily routine at your own pace. Many practitioners find that the habits formed during the Mandala become a natural part of their lifestyle that continues indefinitely.",
    category: "journey",
  },
  {
    id: "faq-j-5",
    question: "What are the 11 pillars and which category do they belong to?",
    answer:
      "The 11 pillars are organized across three categories. Body includes Morning Routine, Vedic Nutrition, Movement, and Sleep Optimization. Mind includes Thought Reset, Breathing & Meditation, Healing Meditation, and Gratitude. Spirit includes Sandhya Meditation, Brahman Connection, and Manifestation. Together, they address every dimension of holistic transformation.",
    category: "journey",
  },

  // Account (3)
  {
    id: "faq-a-1",
    question: "How do I reset my password?",
    answer:
      "To reset your password, click the 'Forgot Password' link on the sign-in page. Enter the email address associated with your account, and you will receive a password reset link within a few minutes. If you do not see the email, check your spam folder. For further assistance, contact our support team through the Contact page.",
    category: "account",
  },
  {
    id: "faq-a-2",
    question: "Can I change my email address or username?",
    answer:
      "Yes, you can update your email address and display name from the Account Settings page in your dashboard. After changing your email, you will need to verify the new address before it becomes active. Your journey progress, Karma Points, and streak history will remain unchanged.",
    category: "account",
  },
  {
    id: "faq-a-3",
    question: "How is my personal data handled?",
    answer:
      "We take your privacy seriously. Your personal data is encrypted and stored securely. We do not sell or share your information with third parties. Your journey data — including progress, streaks, and Karma Points — is used solely to provide you with a personalized experience. You can request a full data export or account deletion at any time from your Account Settings.",
    category: "account",
  },

  // Technical (4)
  {
    id: "faq-t-1",
    question: "What browsers are supported?",
    answer:
      "The 10X Vedic platform works on all modern browsers including Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge. We recommend using the latest version of your browser for the best experience. The platform is fully responsive and works on desktop, tablet, and mobile devices.",
    category: "technical",
  },
  {
    id: "faq-t-2",
    question: "Is there a mobile app available?",
    answer:
      "Currently, the 10X Vedic platform is a progressive web application (PWA) optimized for mobile browsers. You can add it to your home screen on iOS or Android for an app-like experience with offline access to certain features. A dedicated native mobile app is on our roadmap for future development.",
    category: "technical",
  },
  {
    id: "faq-t-3",
    question: "Can I use the platform offline?",
    answer:
      "Certain features are available offline once you have loaded them, including daily wisdom quotes and previously accessed content. However, progress tracking, streak updates, and Karma Points require an internet connection to sync with your account. We recommend connecting at least once daily to ensure your progress is saved.",
    category: "technical",
  },
  {
    id: "faq-t-4",
    question: "I found a bug or have a feature request. How do I report it?",
    answer:
      "We appreciate your feedback. You can report bugs or suggest features through the Contact page on our website, or email us directly at support@10xvedic.com. Please include as much detail as possible — such as the browser you are using, steps to reproduce the issue, and any screenshots. Our team reviews all submissions and prioritizes improvements based on community feedback.",
    category: "technical",
  },
];
