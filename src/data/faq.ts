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
  // Batch 2 — Q&A derived from the teaching-poster set (sandhya, dosha,
  // pranayama, sankalpa, brahma muhurta, 80% rule, etc.).
  {
    id: "faq-gs-sandhya",
  question: "What is Sandhya Meditation?",
  answer:
    "Sandhya means 'junction' — the sacred meeting points of the day when nature shifts between night, day, and night again. Sandhya Meditation is the practice of pausing at these transitions (sunrise, noon, sunset) to settle the breath, chant a mantra, set an intention, and align yourself with natural rhythms. Practiced daily, it calms the nervous system, sharpens awareness, and grounds the day in stillness.",
  category: "getting-started",
},
{
  id: "faq-gs-three-sandhyas",
  question: "What is the difference between the three sandhyas?",
  answer:
    "Morning Sandhya (sunrise) is for awakening and purification — you set a positive sankalpa and meet the day with light. Midday Sandhya (noon) is for balance and clarity — a brief recharge at the solar peak that restores composure before the second half of the day. Evening Sandhya (sunset) is for release and gratitude — you let go of the day's residue and prepare the mind and body for restorative sleep. Together they form a daily rhythm of awakening, balancing, and surrendering.",
  category: "getting-started",
},
{
  id: "faq-gs-know-dosha",
  question: "How do I know my dosha?",
  answer:
    "Your dosha is your unique mind-body constitution — Vata (air and space), Pitta (fire and water), or Kapha (earth and water) — and most people are a blend with one or two dominant. You can identify yours by observing physical traits (frame, skin, digestion, sleep), mental tendencies (Vata is quick and changeable, Pitta is focused and sharp, Kapha is steady and calm), and how you respond to stress. The 10X Vedic dosha assessment in the onboarding flow gives you a personalized profile and matching practices.",
  category: "getting-started",
},
{
  id: "faq-gs-dosha-yoga",
  question: "What yoga poses balance my Vata, Pitta, or Kapha dosha?",
  answer:
    "Vata is balanced by grounding, slow, warming poses — Child's Pose, Mountain Pose, Cat-Cow, gentle Seated Forward Bend, and long-held Corpse Pose. Pitta is balanced by cooling, non-competitive poses — Moon Salutation, Butterfly, Seated Twists, Camel, and Fish Pose. Kapha is balanced by energizing, heating poses — Sun Salutations, Warrior series, Boat Pose, backbends, and any vigorous flow. Match the pace and temperature of your practice to what your dosha needs.",
  category: "getting-started",
},
{
  id: "faq-gs-nadi-shodhana",
  question: "What is Nadi Shodhana breathing and when should I practice it?",
  answer:
    "Nadi Shodhana is alternate-nostril breathing — you inhale through one nostril, close it, and exhale through the other, then reverse. It cleanses the energy channels (nadis), balances the two hemispheres of the brain, and quickly settles an agitated mind. Practice 5 to 10 minutes in the morning before meditation, before any important task that needs focus, or before bed to calm the nervous system.",
  category: "getting-started",
},
{
  id: "faq-gs-bhramari",
  question: "What is Bhramari pranayama and what does it do?",
  answer:
    "Bhramari is the 'bee breath' — you inhale deeply, then exhale with a soft humming sound while gently closing the ears. The vibration soothes the vagus nerve, lowers blood pressure, and quiets mental chatter almost immediately. It is especially helpful for anxiety, insomnia, headaches, and any moment you need to drop into stillness fast. Five to seven rounds is enough to feel the effect.",
  category: "getting-started",
},
{
  id: "faq-gs-cooling-pitta",
  question: "What pranayama is best for cooling Pitta?",
  answer:
    "Sheetali (rolled-tongue breath) and Sheetkari (teeth-hissing breath) are the classical cooling pranayamas — both draw cool air across the tongue and lower internal heat. Chandra Bhedana (left-nostril breathing) is also excellent because the left nostril is the lunar, cooling channel. Practice in the afternoon, on hot days, or whenever Pitta feels aggravated by irritability, acidity, or heat. Avoid these in cold weather or when Kapha is dominant.",
  category: "getting-started",
},
{
  id: "faq-gs-sankalpa",
  question: "What is Sankalpa and how do I set one?",
  answer:
    "Sankalpa is a heartfelt intention or vow — a short, positive, present-tense statement that anchors your practice and your day. Frame it as something already true ('I am calm and clear,' 'I act with compassion') rather than a wish or a future goal. Set it during morning sandhya, repeat it silently three times, and let it surface again whenever your mind drifts. Over time, a sincere sankalpa shapes your samskaras and your reality.",
  category: "getting-started",
},
{
  id: "faq-jr-samskaras",
  question: "What are samskaras?",
  answer:
    "Samskaras are the subtle mental impressions left by every thought, emotion, and action you take — the grooves in your mind that shape your habits, reactions, and personality. Repeated patterns deepen the groove; conscious practice carves new ones. The work of yoga is to weaken the samskaras that cause suffering and strengthen the ones that lead to clarity, peace, and freedom.",
  category: "journey",
},
{
  id: "faq-gs-80-percent-rule",
  question: "What is the Ayurvedic 80% rule for eating?",
  answer:
    "Stop eating when you feel satisfied, not stuffed — fill the stomach roughly half with food, a quarter with water, and leave a quarter empty for digestion. The remaining 20% gives your digestive fire (Agni) the space it needs to work properly, prevents post-meal lethargy, and keeps the mind clear. This single habit is one of the most powerful weight, energy, and clarity interventions in Ayurveda.",
  category: "getting-started",
},
{
  id: "faq-gs-best-time-to-eat",
  question: "When is the best time to eat according to Ayurveda?",
  answer:
    "Eat your largest meal between 10:30 AM and 2:00 PM, when the sun is strongest and your digestive fire (Agni) is at its peak. Keep dinner light and finish it before sunset, ideally by 6 PM. After 6 PM, stick to warm water or very light foods so your body can rest and repair overnight rather than digest. This solar-aligned rhythm supports better sleep, weight balance, and mental clarity.",
  category: "getting-started",
},
{
  id: "faq-gs-brahma-muhurta",
  question: "What is Brahma Muhurta and why does it matter?",
  answer:
    "Brahma Muhurta is the sacred 96-minute window before sunrise — a time when all three doshas rest in equilibrium and the mind is naturally calm, pure, and highly receptive. Waking and practicing during this window makes meditation, study, and sankalpa-setting dramatically more effective than at any other hour. Ayurveda considers a daily Brahma Muhurta wake-up one of the most powerful habits for long-term health, clarity, and spiritual progress.",
  category: "getting-started",
},
];
