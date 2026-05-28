// Curated Vedic teaching posters. Each entry is hand-OCR'd from
// public/posters/<slug>.webp during Phase 2 of the integration plan;
// pillar/dosha tags reuse the canonical slugs from constants/pillars.ts
// and lib/dosha.ts so lookups stay aligned across the app.

import type { DoshaName } from "@/lib/dosha";

export type DoshaTag = DoshaName;
export type PosterCategory = "body" | "mind" | "spirit";
export type PosterKind = "yoga" | "pranayama" | "general";

export interface PosterScripture {
  sutra: string;
  sanskrit?: string;
  translation: string;
}

export interface PosterSection {
  number?: number;
  title: string;
  body: string;
  bullets?: string[];
}

export interface PosterImage {
  src: string;       // /posters/<slug>.webp
  src2x: string;     // /posters/<slug>@2x.webp
  thumb: string;     // /posters/<slug>.thumb.webp
  width: number;     // intrinsic width of <slug>.webp
  height: number;    // intrinsic height of <slug>.webp
  alt: string;
}

export interface Poster {
  slug: string;
  title: string;
  concept: string;
  pillarSlug?: string;
  dosha?: DoshaTag;
  kind: PosterKind;
  category: PosterCategory;
  image: PosterImage;
  scripture: PosterScripture[];
  sections: PosterSection[];
  tagline?: string;
}

export const POSTERS: Poster[] = [
  // Populated in Phase 2 via manual OCR. Order is presentation order in
  // the gallery; pillar/dosha lookups use the helpers below regardless.
  {
    slug: "morning-routine-5-step",
    title: "5-Step Morning Routine for Manifestation",
    concept: "morning-routine",
    pillarSlug: "morning-initiation",
    kind: "general",
    category: "body",
    image: {
      src: "/poster-images/morning-routine-5-step.webp",
      src2x: "/poster-images/morning-routine-5-step@2x.webp",
      thumb: "/poster-images/morning-routine-5-step.thumb.webp",
      width: 768,
      height: 512,
      alt: "Five-panel infographic showing a morning routine for manifestation: wake up early, center your breath, connect to awareness, gratitude and thought alignment, and visualization for energy alignment.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.2",
        sanskrit: "योगश्चित्तवृत्तिनिरोधः । Yogaḥ chitta vṛtti nirodhaḥ.",
        translation: "When the mind becomes still, inner clarity awakens.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Wake Up Early (5 AM or 20 mins earlier than usual)",
        body: "Rise calmly and consciously. Drink a glass of warm water. Avoid phone use for the first 20–30 minutes. Begin the day with silence, not distraction.",
        bullets: [
          "Sets a peaceful tone for the day",
          "Boosts energy and metabolism",
          "Improves focus and productivity",
          "Strengthens willpower and discipline",
        ],
      },
      {
        number: 2,
        title: "Center Your Breath (2–5 minutes)",
        body: "Sit upright. Inhale for 4 seconds, deep and slow. Exhale for 6 seconds, gentle and steady. Calm the nervous system and the mind.",
        bullets: [
          "Reduces stress and anxiety",
          "Improves oxygen flow and energy",
          "Enhances concentration",
          "Brings balance to body and mind",
        ],
      },
      {
        number: 3,
        title: "Connect to Awareness / Source (1–2 minutes)",
        body: "Sit quietly in stillness. Bring attention to the present moment. Gently become aware of your inner state. Feel the connection to universal energy (Brahman).",
        bullets: [
          "Deepens self-awareness",
          "Creates inner peace and stability",
          "Cultivates spiritual connection",
          "Aligns you with higher wisdom",
        ],
      },
      {
        number: 4,
        title: "Gratitude & Thought Alignment (1–2 minutes)",
        body: "Mentally list three things you're grateful for. Set one positive intention for the day. Replace any negative thought with a constructive one.",
        bullets: [
          "Improves mood and happiness",
          "Rewires the mind for positivity",
          "Builds emotional resilience",
          "Attracts positive experiences",
        ],
      },
      {
        number: 5,
        title: "Manifestation & Energy Alignment (2 minutes)",
        body: "Visualize your key goal for the next 48 days. See yourself already succeeding. Invite clarity, strength, and guidance. Hold that image for a few breaths.",
        bullets: [
          "Clarifies purpose and direction",
          "Boosts confidence and motivation",
          "Aligns energy with goals",
          "Invites divine guidance and support",
        ],
      },
    ],
    tagline: "Inspired by the wisdom of Patanjali Yoga Sutras.",
  },
  {
    slug: "morning-sandhya-meditation",
    title: "Morning Sandhya Meditation",
    concept: "sandhya-meditation",
    pillarSlug: "sandhya-meditation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/poster-images/morning-sandhya-meditation.webp",
      src2x: "/poster-images/morning-sandhya-meditation@2x.webp",
      thumb: "/poster-images/morning-sandhya-meditation.thumb.webp",
      width: 768,
      height: 512,
      alt: "Three-panel infographic on Morning Sandhya Meditation — why morning sandhya, seven practice steps, and the benefits of the practice.",
    },
    scripture: [],
    sections: [
      {
        number: 1,
        title: "Why Morning Sandhya",
        body: "Start your day in light and awareness. The sacred time between night and day — Brahma Muhurta to sunrise — is when the mind is calm, pure, and highly receptive.",
        bullets: [
          "Sacred time between night and day (Brahma Muhurta to sunrise)",
          "Mind is calm, pure, and highly receptive",
          "Positive energy for the whole day",
          "Connects you with nature and the Divine",
        ],
      },
      {
        number: 2,
        title: "Practice Steps",
        body: "Seven steps to settle into morning sandhya.",
        bullets: [
          "Wake early during Brahma Muhurta (90 minutes before sunrise).",
          "Cleanse & prepare — freshen up, wear clean clothes, sit in a quiet place facing East.",
          "Sit with a straight spine in a comfortable posture, eyes closed.",
          "Deep breathing — slow, deep breaths; inhale positivity, exhale stress.",
          "Chant a mantra — OM or the Gayatri Mantra with devotion.",
          "Meditate in silence — observe your breath and thoughts; stay in silence.",
          "Gratitude & Sankalpa — offer gratitude and set a positive intention for the day.",
        ],
      },
      {
        number: 3,
        title: "Amazing Benefits",
        body: "What a consistent morning sandhya practice brings.",
        bullets: [
          "Improves concentration and memory",
          "Reduces stress and anxiety",
          "Brings emotional balance and inner peace",
          "Increases energy and enthusiasm",
          "Strengthens immunity and overall health",
          "Enhances spiritual growth and self-awareness",
          "Creates positivity, clarity, and happiness all day",
        ],
      },
    ],
    tagline: "A peaceful morning, a powerful life.",
  },
  {
    slug: "path-of-manifestation",
    title: "The Path of Manifestation",
    concept: "manifestation-6-steps",
    pillarSlug: "divine-manifestation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/poster-images/path-of-manifestation.webp",
      src2x: "/poster-images/path-of-manifestation@2x.webp",
      thumb: "/poster-images/path-of-manifestation.thumb.webp",
      width: 768,
      height: 1152,
      alt: "Six-step Path of Manifestation infographic — clarity of intention, believe and visualize, align thoughts and emotions, take inspired action, surrender and trust the divine, receive and be grateful.",
    },
    scripture: [],
    sections: [
      {
        number: 1,
        title: "Clarity of Intention",
        body: "Get clear about what you truly want. A clear intention is the first step of manifestation — your intention is the seed that creates your reality.",
      },
      {
        number: 2,
        title: "Believe & Visualize",
        body: "Believe in your dream and see it as already yours. Visualization creates the blueprint in your subconscious mind. What you visualize with feeling, you attract with ease.",
      },
      {
        number: 3,
        title: "Align Your Thoughts & Emotions",
        body: "Think positive, feel grateful, and raise your vibration. Your inner state attracts your outer reality. Emotions are the energy behind manifestation.",
      },
      {
        number: 4,
        title: "Take Inspired Action",
        body: "Take consistent, inspired action towards your goals. Action turns intention into reality. Small steps daily create massive transformation.",
      },
      {
        number: 5,
        title: "Surrender & Trust the Divine",
        body: "Let go of doubt and attachment. Trust the universe and divine timing. Everything happens for you, not to you. Trust creates flow and miracles.",
      },
      {
        number: 6,
        title: "Receive & Be Grateful",
        body: "Be open to receive blessings. Gratitude multiplies abundance and keeps the flow continuous. Appreciate what you have to attract even more.",
      },
    ],
    tagline: "Your mind is the seed. Your energy is the water. Your actions are the soil. Your reality is the result.",
  },
  {
    slug: "five-principles-of-manifestation",
    title: "5 Principles of Manifestation",
    concept: "manifestation-principles",
    pillarSlug: "divine-manifestation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/poster-images/five-principles-of-manifestation.webp",
      src2x: "/poster-images/five-principles-of-manifestation@2x.webp",
      thumb: "/poster-images/five-principles-of-manifestation.thumb.webp",
      width: 768,
      height: 1152,
      alt: "Portrait infographic on the 5 Principles of Manifestation according to Patanjali Yoga Sutras — mental stillness, sankalpa, dharana, non-attachment, and samskaras.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.2",
        sanskrit: "योगश्चित्तवृत्तिनिरोधः । Yogaḥ chitta vṛtti nirodhaḥ.",
        translation: "Yoga is the stilling of the fluctuations of the mind.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Mental Stillness (Chitta Vritti Nirodha)",
        body: "When thoughts are focused and peaceful, energy aligns with intention. Sit for ten minutes daily, observe thoughts, breathe deeply, and reduce mental noise.",
      },
      {
        number: 2,
        title: "Sankalpa — Power of Intention",
        body: "A clear intention is a seed planted in the subconscious mind. Whatever is repeatedly imagined begins shaping reality. Light a diya, write your intention, and affirm it daily.",
      },
      {
        number: 3,
        title: "Dharana — One-Pointed Concentration",
        body: "Sustained focus creates magnetic energy. Concentrate on one thought or object for 5–10 minutes daily.",
      },
      {
        number: 4,
        title: "Ishvara Pranidhana — Non-Attachment",
        body: "Patanjali teaches surrender to the divine. Detach from the outcome, trust the process, and let go.",
      },
      {
        number: 5,
        title: "Samskaras — Subconscious Programming",
        body: "Repeated thoughts become subconscious patterns, and the subconscious shapes reality. Use positive affirmations, gratitude, and awareness to rewrite samskaras.",
      },
    ],
    tagline: "Pure mind • Clear intention • Focused action • Divine trust • Your reality.",
  },
  {
    slug: "manifestation-secrets-patanjali",
    title: "Manifestation Secrets by Patanjali Yoga Sutra",
    concept: "manifestation-secrets",
    pillarSlug: "divine-manifestation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/poster-images/manifestation-secrets-patanjali.webp",
      src2x: "/poster-images/manifestation-secrets-patanjali@2x.webp",
      thumb: "/poster-images/manifestation-secrets-patanjali.thumb.webp",
      width: 768,
      height: 1152,
      alt: "Portrait infographic with eight Patanjali-rooted manifestation secrets: control the mind, sankalpa, dharana, dhyana, samskaras, pranayama, sattvic lifestyle, and faith in the divine.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.2",
        sanskrit: "योगश्चित्तवृत्तिनिरोधः । Yogaḥ chitta vṛtti nirodhaḥ.",
        translation: "Yoga is the stilling of the fluctuations of the mind.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Control the Mind (Chitta Vritti Nirodha)",
        body: "A calm mind manifests powerfully. Sit quietly for ten minutes; observe and release each thought as it arises.",
      },
      {
        number: 2,
        title: "Sankalpa — Power of Intention",
        body: "A clear, focused intention activates inner power. Visualize, repeat, and believe — daily.",
      },
      {
        number: 3,
        title: "Dharana — Concentration Creates Energy",
        body: "A focused mind is a magnetic mind. Hold one image or thought for 5–10 minutes to gather your energy.",
      },
      {
        number: 4,
        title: "Dhyana — Meditation Raises Consciousness",
        body: "Higher awareness allows higher manifestation. Sit in meditation for at least 15 minutes daily.",
      },
      {
        number: 5,
        title: "Samskaras Shape Reality",
        body: "Repeated thoughts shape the subconscious, and the subconscious shapes reality. Replace negative samskaras with positive ones through awareness and affirmation.",
      },
      {
        number: 6,
        title: "Pranayama Increases Life Force",
        body: "Controlled breath amplifies prana. Practice ten minutes of nadi shodhana (alternate-nostril breathing) daily.",
      },
      {
        number: 7,
        title: "Sattvic Lifestyle Raises Vibration",
        body: "A sattvic diet, a clean environment, and positive company raise your baseline frequency. Choose pure food and peaceful surroundings.",
      },
      {
        number: 8,
        title: "Faith & Divine Connection",
        body: "Trust in a higher power completes the work. Surrender, pray, and live in gratitude.",
      },
    ],
    tagline: "Live in awareness, act in alignment, surrender to the divine.",
  },
  {
    slug: "step-by-step-healing",
    title: "Step-by-Step Guide to Manifest Healing & Get Rid of Disease",
    concept: "healing",
    pillarSlug: "healing-meditation",
    kind: "general",
    category: "mind",
    image: {
      src: "/poster-images/step-by-step-healing.webp",
      src2x: "/poster-images/step-by-step-healing@2x.webp",
      thumb: "/poster-images/step-by-step-healing.thumb.webp",
      width: 768,
      height: 1152,
      alt: "Portrait infographic with nine Patanjali-rooted steps to manifest healing — calm the mind, sankalpa, pranayama, meditation, release samskaras, sattvic lifestyle, gratitude, surrender, and consistency.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.2",
        sanskrit: "योगश्चित्तवृत्तिनिरोधः । Yogaḥ chitta vṛtti nirodhaḥ.",
        translation: "Yoga is the stilling of the fluctuations of the mind — the ground on which healing begins.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Calm the Mind (Chitta Vritti Nirodha)",
        body: "Healing begins when mental noise quiets. Sit for ten minutes of meditation daily and let the breath settle the mind.",
      },
      {
        number: 2,
        title: "Create a Healing Sankalpa",
        body: "Set a clear healing intention. Visualize yourself in full health and write the affirmation as if it is already true.",
      },
      {
        number: 3,
        title: "Practice Pranayama",
        body: "Breath control purifies the body and mind. Practice nadi shodhana and kapalabhati daily for cleansing prana.",
      },
      {
        number: 4,
        title: "Meditation (Dhyana)",
        body: "Deep stillness allows the nervous system to repair. Meditate for 15–20 minutes daily.",
      },
      {
        number: 5,
        title: "Release Negative Samskaras",
        body: "Replace harmful subconscious patterns. Use gratitude and positive affirmation to rewrite the imprint.",
      },
      {
        number: 6,
        title: "Follow a Sattvic Lifestyle",
        body: "Pure food, clean environment, and positive company support healing. Choose simple sattvic meals and a peaceful daily rhythm.",
      },
      {
        number: 7,
        title: "Practice Gratitude",
        body: "Gratitude activates the body's healing response. Note three things you are grateful for each morning and evening.",
      },
      {
        number: 8,
        title: "Surrender & Trust the Divine",
        body: "Faith calms fear, and fear blocks healing. Pray, surrender outcomes, and trust the body's wisdom.",
      },
      {
        number: 9,
        title: "Consistency Creates Transformation",
        body: "Healing follows daily discipline. Hold the routine without exception and trust the slow shift.",
      },
    ],
    tagline: "Heal your mind. Balance your emotions. Purify your body. Transform your life. Om Shanti.",
  },
  {
    slug: "gratitude-way-of-life",
    title: "Gratitude — A Way of Life",
    concept: "gratitude",
    pillarSlug: "gratitude",
    kind: "general",
    category: "mind",
    image: {
      src: "/poster-images/gratitude-way-of-life.webp",
      src2x: "/poster-images/gratitude-way-of-life@2x.webp",
      thumb: "/poster-images/gratitude-way-of-life.thumb.webp",
      width: 768,
      height: 512,
      alt: "Triptych infographic on Gratitude — its place in Patanjali Yoga Sutras, the science and yogic wisdom behind it, and gratitude as a way of life.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 2.42",
        sanskrit: "सन्तोषादनुत्तमः सुखलाभः । Santoṣād anuttamaḥ sukha-lābhaḥ.",
        translation: "From contentment (santosha), supreme happiness is attained.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Gratitude in Patanjali Yoga Sutras",
        body: "Cultivate contentment, gratitude, and surrender — the mind becomes peaceful and pure. Gratitude is woven through Santosha (contentment), Ahimsa (a grateful heart is kind), Ishvara Pranidhana (gratitude strengthens trust in the divine), and Chatta Prasadanam (gratitude purifies the mind and removes negativity).",
        bullets: [
          "Creates inner peace",
          "Reduces stress",
          "Improves emotional balance",
          "Strengthens spiritual growth",
          "Generates positive energy",
          "Improves relationships, mental clarity, and sleep",
        ],
      },
      {
        number: 2,
        title: "The Science & Yogic Wisdom",
        body: "Gratitude changes the mind, brain, and life. Science: it reduces stress hormones, improves mood and emotional balance, strengthens positive neural pathways, and boosts immunity. Yogic wisdom: repeated emotions become samskaras (mental impressions), and gratitude lays down positive samskaras in the subconscious.",
        bullets: [
          "Sit quietly and take deep breaths",
          "Think of five things you are grateful for",
          "Feel the gratitude emotionally, not just intellectually",
          "Silently repeat: 'Thank you for health, peace, and wisdom'",
          "Rest in peace and inner balance",
        ],
      },
      {
        number: 3,
        title: "A Way of Life",
        body: "A grateful mind lives in the present, appreciates the moment, and trusts the divine. Replace dissatisfaction, comparison, and complaint with emotional stability, compassion, patience, and faith.",
        bullets: [
          "Thank before meals",
          "Appreciate nature",
          "Speak kindly",
          "Maintain a gratitude journal",
          "Avoid unnecessary complaints",
          "End the day with thankful thoughts",
        ],
      },
    ],
    tagline: "Gratitude turns what we have into enough.",
  },
  {
    slug: "ayurvedic-nutrition-fasting",
    title: "Nutrition & Fasting — Ayurvedic Eating & Intermittent Fasting",
    concept: "nutrition-fasting",
    pillarSlug: "nutrition-fasting",
    kind: "general",
    category: "body",
    image: {
      src: "/poster-images/ayurvedic-nutrition-fasting.webp",
      src2x: "/poster-images/ayurvedic-nutrition-fasting@2x.webp",
      thumb: "/poster-images/ayurvedic-nutrition-fasting.thumb.webp",
      width: 768,
      height: 768,
      alt: "Square infographic on Ayurvedic eating and intermittent fasting — eat during the sun's power window, start with warm water, choose sattvic food, follow the 80% full rule, and hydrate the Vedic way.",
    },
    scripture: [
      {
        sutra: "Bhagavad Gita 6.17",
        sanskrit: "युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु । युक्तस्वप्नावबोधस्य योगो भवति दुःखहा ॥",
        translation: "For one who is moderate in food and recreation, moderate in effort, and regulated in sleep and wakefulness, yoga becomes the destroyer of sorrow.",
      },
      {
        sutra: "Yoga Sutra 2.40",
        sanskrit: "शौचात्स्वाङ्गजुगुप्सा परैरसंसर्गः ॥",
        translation: "Purity in body and mind leads to dispassion toward what is impure and unnecessary.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Eat During the Sun's Power Window",
        body: "Digestive fire (Agni) is at peak when the sun is strongest. Take the main meal between 10:30 AM and 2:00 PM, a light dinner before sunset (6 PM at the latest), and after 6 PM drink water or eat under 20-calorie items only.",
      },
      {
        number: 2,
        title: "Start the Day with Warm Water",
        body: "Drink 1–2 glasses of warm water on waking. It helps the body detox, starts digestion, and improves elimination — a simple ritual with outsized benefits.",
      },
      {
        number: 3,
        title: "Eat Fresh, Sattvic, Simple Food",
        body: "Prefer freshly cooked, plant-forward meals. Include vegetables, fruits, whole grains (rice, millets), lentils, ghee, nuts, and seeds. Avoid heavy fried foods, processed items, sugar, and stale food.",
      },
      {
        number: 4,
        title: "Follow the 80% Full Rule",
        body: "Stop eating when you feel satisfied, not stuffed. The remaining 20% allows proper digestion, prevents lethargy, and keeps the mind clear.",
      },
      {
        number: 5,
        title: "Hydrate the Vedic Way",
        body: "Sip warm water or herbal teas throughout the day. Avoid iced drinks — they weaken Agni — and don't drown meals in water; small sips only. Add ginger + lime before lunch to boost Agni, turmeric + pepper at night for immunity, and pause five seconds before eating to bring presence.",
      },
    ],
    tagline: "Let food be your medicine. Let awareness be your guru. Let yoga be your way of life.",
  },
  {
    slug: "mind-purification-5-step",
    title: "5 Steps to a Pure Mind",
    concept: "mind-purification",
    pillarSlug: "thoughts-intention",
    kind: "general",
    category: "mind",
    image: {
      src: "/poster-images/mind-purification-5-step.webp",
      src2x: "/poster-images/mind-purification-5-step@2x.webp",
      thumb: "/poster-images/mind-purification-5-step.thumb.webp",
      width: 768,
      height: 1152,
      alt: "Portrait infographic with five steps to a pure mind — start the day with positive inputs, consume positive mental nutrition, avoid tamasic intake, remove negative people, and add high-vibration influences.",
    },
    scripture: [],
    sections: [
      {
        number: 1,
        title: "Start the Day with Positive Inputs (Before 8 AM)",
        body: "What you feed your mind in the first hour shapes your whole day. Read or listen to uplifting content — a scripture verse or five minutes of positive philosophy. Avoid news, social media, and arguments in the first hour.",
      },
      {
        number: 2,
        title: "Consume Positive Mental Nutrition",
        body: "Just as the body digests food, the mind digests what you expose it to. Choose inputs that create clarity, peace, and inspiration — mantras, spiritual texts, inspirational books, nature, silence, and conversations with kind people.",
      },
      {
        number: 3,
        title: "Avoid Tamasic Mental Intake (Especially After Sunset)",
        body: "Just as we don't eat heavy food late, avoid heavy mental food after evening. Violent content, gossip, toxic conversations, doom-scrolling, and complaints weaken the mind exactly like junk food weakens the body.",
      },
      {
        number: 4,
        title: "Remove Negative People & Energies",
        body: "Reduce interaction with people who drain, criticize, or manipulate. Limit exposure to phones, media, or groups that pull you down. Create healthy boundaries — satsang transforms, dussang destroys.",
      },
      {
        number: 5,
        title: "Add Positive, High-Vibration Influences",
        body: "Feed your mind what lifts you. Surround yourself with supportive people, inspiring teachers, peaceful environments, and the daily practice of silence, prayer, and meditation — your mental superfoods.",
      },
    ],
    tagline: "A pure mind sees clearly. A positive mind creates miracles.",
  },
  {
    slug: "vata-balancing-yoga",
    title: "Vata Balancing Yoga",
    concept: "dosha-yoga",
    pillarSlug: "movement",
    dosha: "vata",
    kind: "yoga",
    category: "body",
    image: {
      src: "/poster-images/vata-balancing-yoga.webp",
      src2x: "/poster-images/vata-balancing-yoga@2x.webp",
      thumb: "/poster-images/vata-balancing-yoga.thumb.webp",
      width: 768,
      height: 512,
      alt: "Landscape infographic showing ten Vata-balancing yoga asanas with their Sanskrit names, sutra citations, and benefits, plus grounding lifestyle tips.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 2.46",
        sanskrit: "स्थिरसुखमासनम् । Sthira-sukham āsanam.",
        translation: "Asana is that posture which is steady (stable) and comfortable.",
      },
    ],
    sections: [
      {
        title: "Ground • Calm • Nourish • Stabilize",
        body: "Vata is balanced by warmth, grounding, and steady rhythm. Move slowly, breathe deeply, hold longer, and let the practice settle the nervous system. Ten asanas, each rooted in a Patanjali sutra.",
      },
      {
        number: 1,
        title: "Child's Pose (Balasana)",
        body: "Yoga Sutra 2.46 — a steady, comfortable posture. Calms the nervous system, relieves stress, and stretches the back and hips gently.",
      },
      {
        number: 2,
        title: "Cat-Cow Stretch (Marjaryasana–Bitilasana)",
        body: "Yoga Sutra 1.14 — practice rooted in time, devotion, and continuity. Improves spinal flexibility, relieves stiffness, and balances Vata movement.",
      },
      {
        number: 3,
        title: "Seated Forward Bend (Paschimottanasana)",
        body: "Yoga Sutra 2.29 — the eight limbs of yoga. Calms the mind, stretches spine and hamstrings, improves digestion, and relieves fatigue.",
      },
      {
        number: 4,
        title: "Supine Twist (Supta Matsyendrasana)",
        body: "Yoga Sutra 2.1 — discipline, self-study, and surrender are the path of inner transformation. Releases spinal tension, improves digestion, and calms the nervous system.",
      },
      {
        number: 5,
        title: "Legs Up the Wall (Viparita Karani)",
        body: "Yoga Sutra 1.33 — friendliness, compassion, joy, and equanimity bring purity to the mind. Improves circulation, calms the mind, and supports deep relaxation.",
      },
      {
        number: 6,
        title: "Cobra Pose (Bhujangasana)",
        body: "Strengthens the spine, opens chest and lungs, improves posture, and relieves back stiffness.",
      },
      {
        number: 7,
        title: "Bridge Pose (Setu Bandhasana)",
        body: "Strengthens back and hips, improves circulation, opens the heart, and reduces anxiety.",
      },
      {
        number: 8,
        title: "Tree Pose (Vrikshasana)",
        body: "Yoga Sutra 2.45 — through relaxation of effort and meditation on the infinite, steadiness is attained. Improves balance, strengthens legs, and grounds the mind.",
      },
      {
        number: 9,
        title: "Butterfly Pose (Baddha Konasana)",
        body: "Yoga Sutra 2.46 — steady and comfortable posture. Opens hips gently, improves circulation, and relieves stress.",
      },
      {
        number: 10,
        title: "Corpse Pose (Savasana)",
        body: "Yoga Sutra 1.3 — then the Seer abides in their true nature. Deep relaxation, reduces stress and anxiety, restores body and mind.",
      },
      {
        title: "Vata Balancing Tips",
        body: "Daily habits that anchor a Vata constitution.",
        bullets: [
          "Follow a regular routine",
          "Eat warm, nourishing foods",
          "Use warm oil for abhyanga (self-massage)",
          "Practice gentle yoga daily",
          "Sleep early, wake early",
          "Stay in warmth and comfort",
          "Avoid overthinking and worry",
        ],
      },
    ],
    tagline: "Move slowly. Breathe deeply. Stay grounded. Stay grateful.",
  },
  {
    slug: "pitta-balancing-yoga",
    title: "Pitta Balancing Yoga",
    concept: "dosha-yoga",
    pillarSlug: "movement",
    dosha: "pitta",
    kind: "yoga",
    category: "body",
    image: {
      src: "/poster-images/pitta-balancing-yoga.webp",
      src2x: "/poster-images/pitta-balancing-yoga@2x.webp",
      thumb: "/poster-images/pitta-balancing-yoga.thumb.webp",
      width: 768,
      height: 512,
      alt: "Landscape infographic with five Pitta-balancing yoga themes — cool & calm, soothe & release, cool the body, balance & harmony, restore & renew — each with a sutra, five asanas, benefits, and a practice tip.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.33",
        sanskrit: "मैत्री करुणा मुदितोपेक्षाणां सुखदुःखपुण्यापुण्यविषयाणां भावनातश्चित्तप्रसादनम् ।",
        translation: "Cultivate friendliness, compassion, joy, and equanimity to purify the mind.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Cool & Calm — Balance Heat & Emotions",
        body: "Yoga Sutra 1.33 — cultivate friendliness, compassion, joy, and equanimity. Best asanas: Moon Salutation, Child's Pose, Forward Fold (Uttanasana), Butterfly Pose, Seated Twist. Cools body and mind, reduces irritation, improves patience, promotes peace.",
        bullets: ["Practice in a cool place, early morning or evening. Avoid overheating."],
      },
      {
        number: 2,
        title: "Soothe & Release — Let Go of Intensity",
        body: "Yoga Sutra 1.15 — detachment from seen and heard objects is Vairagya. Best asanas: Child's Pose, Reclined Butterfly (Supta Baddha Konasana), Legs Up the Wall, Seated Forward Bend, Supported Bridge. Releases tension, calms the nervous system, improves sleep.",
        bullets: ["Slow down, breathe deeply, and release the need to control."],
      },
      {
        number: 3,
        title: "Cool the Body — Balance Fire Within",
        body: "Yoga Sutra 1.14 — practice rooted in time, continuity, and devotion. Best asanas: Cobra Pose, Camel Pose (Ustrasana), Fish Pose (Matsyasana), Seated Side Stretch (Parsva Sukhasana), Cooling Spinal Twist. Cools body heat, supports digestion, reduces inflammation, enhances clarity.",
        bullets: ["Hydrate well, eat cooling foods, and avoid excess sun and heat."],
      },
      {
        number: 4,
        title: "Balance & Harmony — Develop Compassion",
        body: "Yoga Sutra 2.33 — a calm mind is obtained by cultivating friendliness, compassion, joy, and equanimity. Best asanas: Seated Twist (Ardha Matsyendrasana), Garland Pose (Malasana), Wide-Leg Forward Fold, Low Lunge (Anjaneyasana), Corpse Pose. Builds compassion, balances emotions, improves focus, supports heart health.",
        bullets: ["Practice gratitude, forgive easily, and stay in nature."],
      },
      {
        number: 5,
        title: "Restore & Renew — Deep Relaxation",
        body: "Yoga Sutra 1.36 — from the purified mind arises intuitive knowledge and deeper understanding. Best asanas: Legs Up the Wall, Corpse Pose, Supported Fish Pose, Happy Baby Pose (Ananda Balasana), Yoga Nidra. Deep relaxation, restores energy, calms the mind, improves sleep.",
        bullets: ["End your day with relaxation, breath awareness, and peace."],
      },
    ],
    tagline: "Yoga is the journey of the self, through the self, to the self.",
  },
  {
    slug: "vata-pranayama",
    title: "Pranayama for Vata Dosha",
    concept: "dosha-pranayama",
    pillarSlug: "breathing-meditation",
    dosha: "vata",
    kind: "pranayama",
    category: "mind",
    image: {
      src: "/poster-images/vata-pranayama.webp",
      src2x: "/poster-images/vata-pranayama@2x.webp",
      thumb: "/poster-images/vata-pranayama.thumb.webp",
      width: 768,
      height: 1152,
      alt: "Portrait infographic on pranayama for the Vata dosha — Nadi Shodhana, Ujjayi, and deep belly breathing, with grounding lifestyle tips.",
    },
    scripture: [],
    sections: [
      {
        title: "About Vata Dosha",
        body: "Vata is Air + Space — light, dry, cold, mobile, rough, subtle. When imbalanced: anxiety, restlessness, insomnia, dry skin, constipation, irregular energy. Goal of pranayama for Vata: calm the nervous system, create warmth and inner grounding, support digestion, and promote restful sleep.",
      },
      {
        number: 1,
        title: "Nadi Shodhana (Alternate Nostril Breathing)",
        body: "Sit comfortably with a straight spine. Close the right nostril and inhale slowly through the left. Close both briefly, then exhale through the right. Inhale right, close both, exhale left — that's one round. Practice 5–10 minutes.",
        bullets: [
          "Balances left and right energy channels",
          "Calms the nervous system",
          "Reduces anxiety and overthinking",
          "Improves focus and mental clarity",
          "Best time: early morning or evening (avoid during cold or congestion)",
        ],
      },
      {
        number: 2,
        title: "Ujjayi Pranayama (Victorious Breath)",
        body: "Sit comfortably. Inhale slowly through the nose with the throat slightly constricted — as if whispering 'ha' softly. Exhale through the nose with the same gentle sound. Keep the breath smooth, long, and even for 5–10 minutes.",
        bullets: [
          "Produces inner warmth",
          "Grounds scattered energy",
          "Improves concentration",
          "Helps with insomnia and anxiety",
          "Best time: morning, evening, before meditation or sleep",
        ],
      },
      {
        number: 3,
        title: "Deep Belly Breathing (Dirgha Shvasana)",
        body: "Sit or lie down comfortably with one hand on chest and one on belly. Inhale slowly through the nose, expanding the belly. Exhale slowly, softening the belly. Keep the breath deep, slow, and natural for 5–10 minutes.",
        bullets: [
          "Calms the mind instantly",
          "Improves oxygen flow",
          "Relaxes the nervous system",
          "Reduces fear and restlessness",
          "Supports digestion and elimination",
        ],
      },
      {
        title: "Guidelines & Lifestyle for Vata",
        body: "Anchor the practice with daily habits that warm and steady the body.",
        bullets: [
          "Practice in a warm, quiet place",
          "Sit with support if needed; keep the breath slow and gentle",
          "Avoid forceful or fast breathing",
          "Eat warm, nourishing, cooked foods; hydrate with warm water or herbal tea",
          "Lengthen the exhale to calm Vata",
          "Pair pranayama with breath-awareness or mantra meditation",
        ],
      },
    ],
    tagline: "For Vata, breath is the anchor. When breath becomes slow and steady, life becomes peaceful and balanced.",
  },
  {
    slug: "kapha-pranayama",
    title: "Pranayama for Kapha Dosha",
    concept: "dosha-pranayama",
    pillarSlug: "breathing-meditation",
    dosha: "kapha",
    kind: "pranayama",
    category: "mind",
    image: {
      src: "/poster-images/kapha-pranayama.webp",
      src2x: "/poster-images/kapha-pranayama@2x.webp",
      thumb: "/poster-images/kapha-pranayama.thumb.webp",
      width: 768,
      height: 1152,
      alt: "Portrait infographic on pranayama for the Kapha dosha — Kapalabhati, Bhastrika, and Surya Bhedana — with energising lifestyle tips.",
    },
    scripture: [],
    sections: [
      {
        title: "About Kapha Dosha",
        body: "Kapha is Earth + Water — heavy, slow, cold, stable, oily, dense. When imbalanced: lethargy, low motivation, excess sleep, weight gain, congestion, mucus. Goal of pranayama for Kapha: increase energy and motivation, stimulate metabolism, clear congestion, and bring lightness and joy.",
      },
      {
        number: 1,
        title: "Kapalabhati Pranayama (Skull-Shining Breath)",
        body: "Sit comfortably with a straight spine. Inhale normally, then exhale forcefully through the nose by contracting the abdomen — inhalation is passive. Start at 20–30 strokes and gradually build to 60–120. Rest, then repeat 3 rounds.",
        bullets: [
          "Increases energy and alertness",
          "Clears mucus and congestion",
          "Improves digestion and metabolism",
          "Removes laziness and heaviness",
          "Best time: early morning on an empty stomach",
        ],
      },
      {
        number: 2,
        title: "Bhastrika Pranayama (Bellows Breath)",
        body: "Sit in a comfortable posture. Inhale deeply and exhale forcefully through both nostrils — equal, powerful, rhythmic. One round is 10 breaths. Start with 3 rounds and rest between rounds.",
        bullets: [
          "Generates heat and vitality",
          "Improves circulation and oxygenation",
          "Removes lethargy and dullness",
          "Strengthens the lungs and respiratory system",
          "Boosts immunity and willpower",
        ],
      },
      {
        number: 3,
        title: "Surya Bhedana Pranayama (Right-Nostril Breathing)",
        body: "Close the left nostril with the ring finger; inhale slowly through the right. Close the right with the thumb; exhale through the left. Inhale right, exhale left — that is one round. Practice 5–10 minutes.",
        bullets: [
          "Increases internal heat and energy",
          "Activates digestion and metabolism",
          "Removes cold, heaviness, and lethargy",
          "Improves concentration and confidence",
          "Best time: morning or when feeling dull or heavy",
        ],
      },
      {
        title: "Guidelines & Lifestyle for Kapha",
        body: "Pair pranayama with an active, light lifestyle to keep Kapha balanced.",
        bullets: [
          "Practice on an empty stomach in a well-ventilated place",
          "Keep the spine straight and the body alert; breath powerful but comfortable",
          "Stay active: exercise, yoga, walking, Surya Namaskar daily",
          "Eat light, warm, dry, spicy foods; avoid sweets, cold drinks, heavy meals",
          "Drink warm water and herbal teas (ginger, tulsi, cinnamon)",
          "Wake early, avoid daytime sleep, get sunlight and fresh air",
        ],
      },
    ],
    tagline: "For Kapha, breath is the fire that awakens. Strong, conscious breath makes Kapha light, active, and balanced.",
  },
  {
    slug: "three-sandhyas-daily-rhythm",
    title: "Morning · Midday · Evening Sandhya Meditation",
    concept: "three-sandhyas",
    pillarSlug: "sandhya-meditation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/poster-images/three-sandhyas-daily-rhythm.webp",
      src2x: "/poster-images/three-sandhyas-daily-rhythm@2x.webp",
      thumb: "/poster-images/three-sandhyas-daily-rhythm.thumb.webp",
      width: 768,
      height: 512,
      alt: "Three vertical poster panels under a glowing Om — a sunrise Morning Sandhya panel titled 'Start Your Day with Light & Awareness', a blue noon Midday Sandhya panel titled 'Harmonize Yourself at Noon', and a violet sunset Evening Sandhya panel titled 'Release, Relax and Renew', each listing numbered practice steps with a benefits block and a lotus-tagline footer.",
    },
    scripture: [],
    sections: [
      {
        number: 1,
        title: "Morning Sandhya Meditation — Practice Steps",
        body: "Start your day with light and awareness. Greet the sunrise as a sacred threshold and let breath, mantra and intention set the tone of your day.",
        bullets: [
          "Wake up before sunrise (Brahma Muhurta)",
          "Sit facing East with a straight spine",
          "Practice deep breathing & Pranayama",
          "Chant OM or Gayatri Mantra",
          "Meditate in silence for a few minutes",
          "Visualize positive energy & sunlight",
          "Feel gratitude and set positive intention",
          "Carry awareness into your day",
        ],
      },
      {
        number: 2,
        title: "Morning Sandhya — Benefits",
        body: "A consistent morning sandhya rewires the day's emotional and energetic baseline.",
        bullets: [
          "Boosts energy & enthusiasm",
          "Improves focus & concentration",
          "Purifies mind & emotions",
          "Strengthens immunity & health",
          "Creates positivity all day",
          "Enhances spiritual growth",
          "Improves decision making",
          "Helps in better discipline",
          "Connects with nature",
          "Increases inner peace",
        ],
      },
      {
        number: 3,
        title: "Midday Sandhya Meditation — Practice Steps",
        body: "Harmonize yourself at noon. A short pause at solar peak restores clarity, gratitude and emotional balance before the second half of the day.",
        bullets: [
          "Pause your work for a few minutes",
          "Sit quietly and relax the body",
          "Observe your natural breath",
          "Chant OM silently",
          "Bring awareness to the present moment",
          "Offer gratitude for your blessings",
          "Drink water mindfully and refresh",
        ],
      },
      {
        number: 4,
        title: "Midday Sandhya — Benefits",
        body: "A mindful noon resets the nervous system and supports a balanced afternoon.",
        bullets: [
          "Recharges energy",
          "Improves productivity",
          "Maintains emotional balance",
          "Reduces stress & fatigue",
          "Enhances clarity & creativity",
          "Improves digestion",
          "Prevents burnout",
          "Keeps mind calm",
          "Strengthens focus",
          "Supports overall well-being",
        ],
      },
      {
        number: 5,
        title: "Evening Sandhya Meditation — Practice Steps",
        body: "Release, relax and renew. As the sun sets, surrender the day, forgive and prepare the mind for restful sleep.",
        bullets: [
          "Sit during sunset in a quiet place",
          "Observe your breath slowly",
          "Release stress, worry and negative thoughts",
          "Chant OM or Peace Mantra",
          "Meditate in silence",
          "Feel gratitude and forgiveness",
          "Let go of the day and surrender",
        ],
      },
      {
        number: 6,
        title: "Evening Sandhya — Benefits",
        body: "Closing the day with sandhya prepares mind and body for deep, restorative sleep.",
        bullets: [
          "Relaxes the nervous system",
          "Releases tension and anxiety",
          "Improves sleep quality",
          "Emotional healing & balance",
          "Brings inner peace & happiness",
          "Cleanses mind of negativity",
          "Strengthens relationships",
          "Increases patience & calm",
          "Prepares for restful night",
          "Supports inner growth",
        ],
      },
    ],
    tagline: "A positive morning, a powerful life. A mindful noon, a balanced life. A peaceful evening, a restful sleep.",
  },
  {
    slug: "sandhya-meditation-three-sacred-times",
    title: "Sandhya Meditation — Harmonize Yourself with Nature at the Three Sacred Times",
    concept: "three-sacred-times",
    pillarSlug: "sandhya-meditation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/poster-images/sandhya-meditation-three-sacred-times.webp",
      src2x: "/poster-images/sandhya-meditation-three-sacred-times@2x.webp",
      thumb: "/poster-images/sandhya-meditation-three-sacred-times.thumb.webp",
      width: 768,
      height: 512,
      alt: "A three-panel poster: an orange Morning Sandhya panel with four practice icons and a sunrise meditator, a cream-colored central panel introducing 'The Three Sandhyas' with sunrise/noon/sunset photos, five Patanjali benefits and daily practice guidelines, and a warm sunset Evening Sandhya panel with four reflection prompts, ending in 'Om Shanti Shanti Shantih'.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.2",
        translation: "Yoga is the stilling of the fluctuations of the mind. — Patanjali Yoga Sutra 1.2",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Morning Sandhya — Connect · Purify · Awaken",
        body: "Start your day in light and awareness. Greet Brahma Muhurta with breath, mantra and a positive sankalpa so the soul shines in its true nature.",
        bullets: [
          "Sacred Time — Brahma Muhurta to Sunrise",
          "Calm Your Breath — Pranayama brings balance and energy",
          "Chant & Meditate — OM, Gayatri Mantra and silent meditation",
          "Gratitude & Sankalpa — Begin the day with positivity and purpose",
        ],
      },
      {
        title: "The Three Sandhyas",
        body: "Sandhya means 'junction' — the sacred meeting points of the day when nature shifts. Morning Sandhya is Sunrise (Awakening & Purification), Midday Sandhya is Noon (Balance & Clarity), Evening Sandhya is Sunset (Release & Gratitude).",
      },
      {
        title: "Benefits of Sandhya Meditation",
        body: "Sandhya meditation calms the mind, regulates the body's rhythms and aligns the soul with the cycle of nature.",
        bullets: [
          "Calms the Mind",
          "Reduces Stress",
          "Improves Focus",
          "Enhances Spirituality",
          "Brings Inner Peace",
        ],
      },
      {
        title: "Daily Practice Guidelines",
        body: "Keep the practice simple, consistent and reverent. The same four habits apply at all three sandhyas.",
        bullets: [
          "Choose a quiet place",
          "Sit with a straight spine",
          "Breathe consciously",
          "Chant, meditate & reflect",
          "Stay consistent",
          "Live with awareness",
        ],
      },
      {
        title: "Evening Sandhya — Let Go of the Day, Embrace Inner Peace",
        body: "Close the day by releasing what no longer serves you and inviting peace, love and divine light inward.",
        bullets: [
          "Release Stress — Let go of worries and negativity",
          "Find Inner Silence — Observe your breath and be present",
          "Cultivate Gratitude — Thank life for all experiences",
          "Positive Sankalpa — Invite peace, love and divine light",
        ],
      },
      {
        title: "Outcomes of Evening Sandhya",
        body: "Practiced consistently at sunset, sandhya brings rest, balance and inner happiness.",
        bullets: [
          "Better Sleep",
          "Emotional Balance",
          "Mental Relaxation",
          "Strong Immunity",
          "Inner Happiness",
        ],
      },
    ],
    tagline: "Body Balanced · Mind Calm · Soul Awakened — Discipline today, peace forever. Surrender the day, surrender to the divine. Om Shanti Shanti Shantih.",
  },
  {
    slug: "ten-manifestation-secrets-patanjali",
    title: "10 Manifestation Secrets by Patanjali Yoga Sutra",
    concept: "manifestation-10-secret",
    pillarSlug: "divine-manifestation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/poster-images/ten-manifestation-secrets-patanjali.webp",
      src2x: "/poster-images/ten-manifestation-secrets-patanjali@2x.webp",
      thumb: "/poster-images/ten-manifestation-secrets-patanjali.thumb.webp",
      width: 768,
      height: 512,
      alt: "A warm amber ten-tile grid poster titled '10 Manifestation Secrets by Patanjali Yoga Sutra', each numbered card pairing a glowing illustration with a Sanskrit principle and a short practice — from Chitta Vritti Nirodha through Sankalpa, Dharana, Dhyana, Samskaras, Pranayama, Detachment, Sattvic Lifestyle, Faith & Divine Connection to the Final Teaching of Patanjali.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.2",
        sanskrit: "योगश्चित्तवृत्तिनिरोधः । Yogaḥ chitta vṛtti nirodhaḥ.",
        translation: "Yoga is the stilling of the fluctuations of the mind.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Control the Mind (Chitta Vritti Nirodha)",
        body: "A restless mind weakens manifestation; a calm and focused mind increases inner power. Your external reality reflects your inner mental state.",
      },
      {
        number: 2,
        title: "Sankalpa — Power of Intention",
        body: "A clear intention becomes powerful when repeated with faith, emotion and consistency. Speak your intention daily, visualize clearly and feel the emotion deeply.",
        bullets: [
          "Example: 'I align myself with peace, health, abundance and divine success.'",
        ],
      },
      {
        number: 3,
        title: "Dharana — Concentration Creates Energy",
        body: "Scattered thoughts weaken energy; focused awareness strengthens manifestation. Concentration Formula: Manifestation ∝ Focus × Intention.",
        bullets: [
          "Clarity",
          "Focus",
          "Energy",
          "Success",
        ],
      },
      {
        number: 4,
        title: "Dhyana — Meditation Raises Consciousness",
        body: "Meditation removes subconscious negativity, reduces stress, increases intuition and creates emotional balance. The subconscious mind becomes receptive during deep relaxation and meditation.",
      },
      {
        number: 5,
        title: "Samskaras Shape Reality",
        body: "Repeated thoughts → samskaras → habits → reality. According to Patanjali, repeated thoughts become subconscious patterns.",
        bullets: [
          "Negative samskaras create: fear, doubt, anxiety, self-sabotage",
          "Positive samskaras create: confidence, discipline, prosperity mindset, inner peace",
        ],
      },
      {
        number: 6,
        title: "Pranayama Increases Life Force",
        body: "Breath controls energy, emotions and mental state. Powerful practices include Nadi Shodhana, Bhramari and deep breathing.",
        bullets: [
          "Energy boost",
          "Calm mind",
          "Better focus",
          "Emotional healing",
        ],
      },
      {
        number: 7,
        title: "Detachment Removes Resistance",
        body: "Patanjali teaches non-attachment: do the effort (your duty) and release obsession over results. Attachment creates fear and tension; detachment creates flow and trust. Manifestation becomes easier when the mind is peaceful.",
      },
      {
        number: 8,
        title: "Sattvic Lifestyle Raises Vibration",
        body: "Pure living strengthens manifestation power. Sattvic habits — healthy food, positive speech, good company, discipline, gratitude, early rising, spiritual study — purify the mind and emotions.",
      },
      {
        number: 9,
        title: "Faith & Divine Connection",
        body: "True manifestation is not only material success — it also includes wisdom, peace, spiritual growth, dharma and service to others. When ego reduces, intuition increases.",
      },
      {
        number: 10,
        title: "Final Teaching of Patanjali",
        body: "Inner Alignment Formula: Pure Thoughts + Calm Mind + Disciplined Action = Higher Reality.",
        bullets: [
          "Your mind is the creator.",
          "Your breath is the bridge.",
          "Your consciousness shapes your reality.",
        ],
      },
    ],
    tagline: "Your mind is the creator. Your breath is the bridge. Your consciousness shapes your reality.",
  },
  {
    slug: "sandhya-meditation-three-phase-ritual",
    title: "Sandhya Meditation — Preparation, Mantra, Closing",
    concept: "sandhya-three-phase-ritual",
    pillarSlug: "sandhya-meditation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/poster-images/sandhya-meditation-three-phase-ritual.webp",
      src2x: "/poster-images/sandhya-meditation-three-phase-ritual@2x.webp",
      thumb: "/poster-images/sandhya-meditation-three-phase-ritual.thumb.webp",
      width: 768,
      height: 915,
      alt: "Three numbered vertical panels of the same Sandhya Meditation ritual: panel 1 (Preparation & Breath Purification) lists four icon-tagged steps over a sunrise meditator, panel 2 (Mantra & Meditation) shows the Gayatri Mantra in Sanskrit transliteration with a meditation card, and panel 3 (Closing & Gratitude) closes with gratitude and the Peace Mantra over a sunset silhouette.",
    },
    scripture: [
      {
        sutra: "Gayatri Mantra",
        sanskrit: "ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥",
        translation: "Chant 9, 27 or 108 times — it purifies the intellect and brings divine light.",
      },
      {
        sutra: "Peace Mantra",
        sanskrit: "ॐ शान्तिः शान्तिः शान्तिः । Om Shanti Shanti Shantih.",
        translation: "Peace within, peace around, peace everywhere.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Preparation",
        body: "Cleanse yourself and sit in a quiet place.",
      },
      {
        number: 2,
        title: "OM Chanting",
        body: "Chant OM 3 or 9 times to calm the mind.",
      },
      {
        number: 3,
        title: "Pranayama",
        body: "Practice Nadi Shodhana for 9 rounds.",
      },
      {
        number: 4,
        title: "Sankalpa",
        body: "Set a positive intention in your heart.",
      },
      {
        number: 5,
        title: "Gayatri Mantra",
        body: "Chant the Gayatri Mantra 9, 27 or 108 times. It purifies the intellect and brings divine light.",
      },
      {
        number: 6,
        title: "Meditation (Dhyana)",
        body: "Sit in silence. Observe your breath and be aware. Stay in stillness. Let the mind become calm.",
      },
      {
        number: 7,
        title: "Gratitude",
        body: "Thank nature, parents, teachers and the divine within.",
      },
      {
        number: 8,
        title: "Peace Mantra",
        body: "Close with Om Shanti Shanti Shantih — peace within, peace around, peace everywhere.",
      },
    ],
    tagline: "Calm Breath. Clear Mind. Pure Intent. — Peace in Mind. Peace in Life. Peace in All.",
  },
  {
    slug: "noon-sandhya-meditation-benefits",
    title: "Noon Sandhya Meditation — Recharge · Rebalance · Realign",
    concept: "noon-sandhya",
    pillarSlug: "sandhya-meditation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/poster-images/noon-sandhya-meditation-benefits.webp",
      src2x: "/poster-images/noon-sandhya-meditation-benefits@2x.webp",
      thumb: "/poster-images/noon-sandhya-meditation-benefits.thumb.webp",
      width: 768,
      height: 512,
      alt: "Three vertical panels: a golden 'Why Noon Sandhya?' opening panel with a meditator and four reasons, a cream-and-teal 'Benefits for Emotional Health' panel with five icon-tagged outcomes and a stack of balancing stones, and a violet 'Energetic & Spiritual Benefits' panel with five chakra-tagged outcomes over a glowing lotus figure.",
    },
    scripture: [],
    sections: [
      {
        title: "Why Noon Sandhya?",
        body: "A sacred midday pause for clarity, balance and inner power. The noon sandhya catches the day at its solar peak and restores equilibrium before the second half.",
        bullets: [
          "Midday is the peak of solar energy and mental activity.",
          "A short pause brings calm, clarity and reset.",
          "Balances emotions, energy and improves productivity.",
          "Aligns you with your spiritual goals and higher purpose.",
        ],
      },
      {
        title: "Benefits for Emotional Health",
        body: "Noon sandhya soothes the emotional body and restores composure for the rest of the day.",
        bullets: [
          "Calms Overthinking — creates a mental pause and reduces stress and anxiety.",
          "Emotional Balance — helps you stay composed, patient and centered.",
          "Release Negativity — lets go of tension, anger and emotional heaviness.",
          "Increases Positivity — fills your mind with peace, gratitude and optimism.",
          "Builds Inner Resilience — strengthens emotional stability for daily challenges.",
        ],
      },
      {
        title: "Energetic & Spiritual Benefits",
        body: "At the solar peak, sandhya recharges the energy body and deepens spiritual connection.",
        bullets: [
          "Energy Balance — balances solar energy and restores vitality and enthusiasm.",
          "Boosts Inner Power — recharges your willpower and motivation.",
          "Enhances Spiritual Awareness — deepens your connection with your higher self and intuition.",
          "Supports Manifestation — aligns thoughts and energy with your goals and desires.",
          "Brings Inner Peace — connects you with divine energy and universal harmony.",
        ],
      },
    ],
    tagline: "Awareness at noon · Power for life. Calm mind · Happy heart · Balanced life. Balanced energy. Higher consciousness. Divine alignment.",
  },
  {
    slug: "pranayama-meditation-6-step",
    title: "Pranayama & Meditation According to Patanjali Yoga Sutras",
    concept: "pranayama-meditation-6-step",
    pillarSlug: "breathing-meditation",
    kind: "pranayama",
    category: "mind",
    image: {
      src: "/poster-images/pranayama-meditation-6-step.webp",
      src2x: "/poster-images/pranayama-meditation-6-step@2x.webp",
      thumb: "/poster-images/pranayama-meditation-6-step.thumb.webp",
      width: 768,
      height: 1152,
      alt: "A cream-and-forest-green poster that walks through six numbered breath-and-meditation steps with illustrated seated figures on the left, a benefits column on the right grouped into Physical / Mental / Emotional / Spiritual benefits, and a 'Why It Works' footer beside a Daily Practice Benefits strip.",
    },
    scripture: [
      {
        sutra: "Patanjali Yoga Sutras",
        translation: "When breath is regulated, mind becomes still.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Sit Quietly (2 minutes)",
        body: "Settle into a comfortable seated posture and let the body soften before practice.",
        bullets: [
          "Sit comfortably with straight spine",
          "Close your eyes",
          "Observe your natural breath",
        ],
      },
      {
        number: 2,
        title: "Deep Breathing (5 minutes)",
        body: "Lengthen the inhale and exhale, using the full lung capacity to oxygenate the system.",
        bullets: [
          "Inhale slowly through nose",
          "Exhale slowly through nose",
          "Use abdomen, chest and lungs fully",
          "Relax shoulders and face",
        ],
      },
      {
        number: 3,
        title: "Nadi Shodhana (5–10 minutes)",
        body: "Alternate-nostril breathing balances the left and right channels of subtle energy.",
        bullets: [
          "Inhale through left nostril",
          "Exhale through right nostril",
          "Inhale through right nostril",
          "Exhale through left nostril",
          "Continue gently",
        ],
      },
      {
        number: 4,
        title: "Bhramari Pranayama (5 minutes)",
        body: "The bee-breath hum calms the nervous system and softens the head and heart.",
        bullets: [
          "Inhale deeply",
          "Exhale with a gentle humming sound 'mmm…'",
          "Feel the vibration in head and heart",
          "Repeat several times",
        ],
      },
      {
        number: 5,
        title: "Meditation (10–20 minutes)",
        body: "Remain still and observe thoughts without attachment. Choose any focus — breath, OM, silence, gratitude or connection to Brahman.",
        bullets: [
          "Breath awareness",
          "Om chanting",
          "Awareness of silence",
          "Gratitude meditation",
          "Connection to Brahman",
        ],
      },
      {
        number: 6,
        title: "Positive Intention (2 minutes)",
        body: "End practice with gratitude and set a positive intention. Example: 'May my mind become calm, clear, and connected to higher consciousness.'",
      },
    ],
    tagline: "Calm breath creates calm mind. Calm mind creates conscious living.",
  },
  {
    slug: "vata-balancing-yoga-5-themes",
    title: "Vata Balancing Yoga — 5 Themed Practices",
    concept: "vata-yoga-5-themes",
    pillarSlug: "movement",
    dosha: "vata",
    kind: "yoga",
    category: "body",
    image: {
      src: "/poster-images/vata-balancing-yoga-5-themes.webp",
      src2x: "/poster-images/vata-balancing-yoga-5-themes@2x.webp",
      thumb: "/poster-images/vata-balancing-yoga-5-themes.thumb.webp",
      width: 768,
      height: 512,
      alt: "Five-panel Vata yoga poster covering grounding, nourishing, calming, strengthening and restoring practices with sutras and recommended asanas.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.14",
        sanskrit: "स तु दीर्घकालनैरन्तर्यसत्कारासेवितो दृढभूमिः । Sa tu dīrgha-kāla-nairantarya-satkārāsevito dṛḍha-bhūmiḥ.",
        translation: "Practice becomes firmly rooted when done for a long time, without break and with devotion.",
      },
      {
        sutra: "Yoga Sutra 2.46",
        sanskrit: "स्थिरसुखमासनम् । Sthira-sukham āsanam.",
        translation: "Asana is that posture which is steady and comfortable.",
      },
      {
        sutra: "Yoga Sutra 1.2",
        sanskrit: "योगश्चित्तवृत्तिनिरोधः । Yogaś-citta-vṛtti-nirodhaḥ.",
        translation: "Yoga is the stilling of the fluctuations of the mind.",
      },
      {
        sutra: "Yoga Sutra 1.12",
        sanskrit: "अभ्यासवैराग्याभ्यां तन्निरोधः । Abhyāsa-vairāgyābhyāṁ tan-nirodhaḥ.",
        translation: "The fluctuations of mind are restrained through practice and detachment.",
      },
      {
        sutra: "Yoga Sutra 1.33",
        sanskrit: "मैत्रीकरुणामुदितोपेक्षाणां सुखदुःखपुण्यापुण्यविषयाणां भावनातश्चित्तप्रसादनम् ।",
        translation: "Friendliness, compassion, joy and equanimity bring purity to the mind.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Ground & Stabilize",
        body: "Focus: grounding, calmness, stability. Best time: early morning or sunset. Move slow, breathe deep, stay warm.",
        bullets: [
          "Mountain Pose (Tadasana)",
          "Child's Pose (Balasana)",
          "Tree Pose (Vrikshasana)",
          "Seated Forward Bend (Paschimottanasana)",
          "Legs Up the Wall (Viparita Karani)",
        ],
      },
      {
        number: 2,
        title: "Nourish & Rejuvenate",
        body: "Focus: nourishment, flexibility, rejuvenation. Best time: morning. Nourish body, mind and soul with self-love.",
        bullets: [
          "Cat-Cow Stretch (Marjaryasana-Bitilasana)",
          "Cobra Pose (Bhujangasana)",
          "Butterfly Pose (Baddha Konasana)",
          "Bridge Pose (Setu Bandhasana)",
          "Supine Twist (Supta Matsyendrasana)",
        ],
      },
      {
        number: 3,
        title: "Calm the Mind & Breath",
        body: "Focus: calm mind, balance breath, awareness. Best time: anytime, ideally morning. Breath is the bridge to inner peace.",
        bullets: [
          "Easy Pose (Sukhasana)",
          "Alternate Nostril Breathing (Nadi Shodhana)",
          "Supported Child's Pose",
          "Seated Side Stretch",
          "Corpse Pose (Savasana)",
        ],
      },
      {
        number: 4,
        title: "Build Inner Strength",
        body: "Focus: strength, endurance, determination. Best time: morning. Consistency creates transformation.",
        bullets: [
          "Warrior II (Virabhadrasana II)",
          "Chair Pose (Utkatasana)",
          "Plank Pose (Phalakasana)",
          "Low Lunge (Anjaneyasana)",
          "Bridge Pose (Setu Bandhasana)",
        ],
      },
      {
        number: 5,
        title: "Restore & Renew",
        body: "Focus: deep rest, healing, restoration. Best time: evening. Rest is productive — honor your energy.",
        bullets: [
          "Legs Up the Wall",
          "Reclined Butterfly",
          "Supported Forward Fold",
          "Happy Baby Pose",
          "Yoga Nidra (deep relaxation)",
        ],
      },
    ],
    tagline: "Yoga is the journey of the Self, through the Self, to the Self. — Patanjali",
  },
  {
    slug: "pitta-pranayama",
    title: "Pranayama for Pitta Dosha",
    concept: "pitta-pranayama",
    pillarSlug: "breathing-meditation",
    dosha: "pitta",
    kind: "pranayama",
    category: "mind",
    image: {
      src: "/poster-images/pitta-pranayama.webp",
      src2x: "/poster-images/pitta-pranayama@2x.webp",
      thumb: "/poster-images/pitta-pranayama.thumb.webp",
      width: 768,
      height: 1152,
      alt: "Pitta pranayama poster showing Sheetali, Sheetkari and Chandra Bhedana with how-to-practice steps, benefits and lifestyle guidance.",
    },
    scripture: [],
    sections: [
      {
        title: "About Pitta Dosha",
        body: "Elements: Fire + Water. Qualities: hot, sharp, intense, light, liquid, spreading, slightly oily. When Pitta is imbalanced you may experience anger, irritability, frustration, excess body heat, acidity, inflammation, impatience, criticism, perfectionism, overworking, burning sensations and rashes.",
      },
      {
        title: "Goal of Pranayama for Pitta",
        body: "Cool the body and mind, reduce anger and irritation, promote calmness and compassion, support healthy digestion and clarity, and bring emotional balance and inner peace.",
      },
      {
        number: 1,
        title: "Sheetali Pranayama (Cooling Breath)",
        body: "Roll your tongue into a tube (if not possible, keep tongue slightly out); inhale slowly through the rolled tongue; close your mouth and exhale slowly through the nose; practice 10–15 rounds. Best time: morning or evening — avoid in cold, cough, or when feeling very cold.",
        bullets: [
          "Reduces excess heat in body and mind",
          "Calms anger, irritation and frustration",
          "Helps in acidity, heartburn and inflammation",
          "Brings emotional cooling and relaxation",
          "Improves concentration and patience",
        ],
      },
      {
        number: 2,
        title: "Sheetkari Pranayama (Hissing Breath)",
        body: "Open your mouth slightly and bring your teeth together; inhale slowly through the gaps between your teeth (a hissing sound will occur); close your mouth and exhale slowly through the nose; practice 10–15 rounds. Best time: mid-morning or evening — avoid in cold, cough, or when feeling very cold.",
        bullets: [
          "Cools the entire system",
          "Relieves stress, anger and impatience",
          "Helps in maintaining healthy skin",
          "Soothes the nerves and mind",
          "Promotes calm and satisfaction",
        ],
      },
      {
        number: 3,
        title: "Chandra Bhedana (Left Nostril Breathing)",
        body: "Close your right nostril with right thumb; inhale slowly through the left nostril; close both nostrils gently (optional small retention if comfortable); open right nostril and exhale slowly through it; practice for 5–10 minutes. Best time: evening or before bed — excellent for cooling and calming.",
        bullets: [
          "Activates the cooling lunar energy",
          "Reduces body heat and anger",
          "Calms the mind and emotions",
          "Improves sleep and relaxation",
          "Supports emotional stability",
        ],
      },
      {
        title: "General Guidelines for Pitta Practice",
        body: "Practice in a cool, clean and peaceful environment. Better in early morning or evening. Sit in a comfortable posture with a straight spine. Never force the breath — keep it slow and smooth. Avoid practicing immediately after heavy meals. Stop if you feel discomfort or dizziness. Follow with meditation or relaxation.",
      },
      {
        title: "Lifestyle Support for Pitta Balance",
        body: "Eat cooling foods: cucumber, coconut, sweet fruits, leafy greens, ghee. Drink plenty of cool (not ice-cold) water. Avoid excessive spices, fried food, alcohol and caffeine. Practice compassion, forgiveness and patience. Spend time in nature, near water and under the moonlight.",
      },
      {
        title: "Remember",
        body: "A calm breath cools the fire within; a calm mind creates a beautiful life. Through regular pranayama, Pitta becomes balanced and we experience clarity, contentment and inner peace.",
      },
    ],
    tagline: "Consistency · Awareness · Moderation — these are the keys to lasting balance and transformation.",
  },
  {
    slug: "manifestation-process-patanjali",
    title: "Manifestation by Patanjali Yoga Sutra",
    concept: "manifestation-process",
    pillarSlug: "divine-manifestation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/poster-images/manifestation-process-patanjali.webp",
      src2x: "/poster-images/manifestation-process-patanjali@2x.webp",
      thumb: "/poster-images/manifestation-process-patanjali.thumb.webp",
      width: 768,
      height: 512,
      alt: "Triptych poster: Patanjali manifestation process, eight-limbs manifestation path, and manifestation formula with daily practices.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.2",
        sanskrit: "योगश्चित्तवृत्तिनिरोधः । Yogaḥ chitta vṛtti nirodhaḥ.",
        translation: "Yoga is the stilling of the fluctuations of the mind.",
      },
      {
        sutra: "Yoga Sutra 1.14",
        translation: "Consistent practice with devotion leads to perfection.",
      },
      {
        sutra: "Yoga Sutra 1.33",
        translation: "Positive emotions purify the mind.",
      },
      {
        sutra: "Yoga Sutra 2.48",
        translation: "Discipline, self-study and surrender bring transformation.",
      },
      {
        sutra: "Yoga Sutra 1.3",
        translation: "When the seer rests in his own form, then true manifestation happens.",
      },
    ],
    sections: [
      {
        title: "Align Your Mind, Energy & Consciousness to Create Your Reality",
        body: "Yogaḥ chitta vṛtti nirodhaḥ — yoga is the stilling of the fluctuations of the mind (Yoga Sutra 1.2). Your inner world creates your outer world.",
      },
      {
        title: "The Manifestation Process",
        body: "Five-stage inner flow: Thought → Emotion → Focus → Meditation → Manifestation.",
        bullets: [
          "Thought — choose your thoughts wisely",
          "Emotion — elevate your emotions",
          "Focus — practice dharana",
          "Meditation — deepen into dhyana",
          "Manifestation — reality reflects inner state",
        ],
      },
      {
        title: "Key Sutras for Manifestation",
        body: "Four foundational sutras for the manifestor.",
        bullets: [
          "1.2 — Stilling the mind is the foundation",
          "1.14 — Consistent practice with devotion leads to perfection",
          "1.33 — Positive emotions purify the mind",
          "2.48 — Discipline, self-study and surrender bring transformation",
        ],
      },
      {
        title: "Manifestation Through the Eight Limbs",
        body: "Transform within, manifest without. Each of Patanjali's eight limbs supports a stage of manifestation.",
        bullets: [
          "Yama — ethical living purifies your energy",
          "Niyama — discipline aligns your intentions",
          "Asana — stable body, stable mind",
          "Pranayama — breath control energizes your manifestation power",
          "Pratyahara — withdraw from distractions and go within",
          "Dharana — focus your mind on your goal",
          "Dhyana — meditate with pure awareness",
          "Samadhi — union with higher consciousness; creation flows",
        ],
      },
      {
        title: "Manifestation Formula",
        body: "Pure Thoughts + Positive Emotions + Steady Concentration + Deep Meditation = Manifested Reality. Through consistent practice and detachment, the mind becomes a powerful instrument of creation (Yoga Sutra 1.14).",
      },
      {
        title: "Daily Practice for Manifestation",
        body: "A simple daily rhythm to embody the formula.",
        bullets: [
          "Morning meditation",
          "Sankalpa (intention)",
          "Breath awareness",
          "Visualization",
          "Gratitude",
          "Surrender to Ishvara",
        ],
      },
    ],
    tagline: "Pure Mind · Strong Intention · Divine Alignment · Manifestation — your inner world creates your outer world.",
  },
  {
    slug: "kapha-balancing-yoga",
    title: "Kapha Balancing Yoga",
    concept: "kapha-yoga-10-asana",
    pillarSlug: "movement",
    dosha: "kapha",
    kind: "yoga",
    category: "body",
    image: {
      src: "/poster-images/kapha-balancing-yoga.webp",
      src2x: "/poster-images/kapha-balancing-yoga@2x.webp",
      thumb: "/poster-images/kapha-balancing-yoga.thumb.webp",
      width: 768,
      height: 512,
      alt: "Kapha Balancing Yoga poster with 10 asanas — Sun Salutation, Warrior II, Chair, Plank, Boat, Triangle, Bow, Seated Twist, Dynamic Lunge, Corpse — each with Patanjali Yoga Sutra references and benefits.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.2",
        sanskrit: "योगश्चित्तवृत्तिनिरोधः",
        translation: "Yoga is the stilling of the fluctuations of the mind.",
      },
      {
        sutra: "Yoga Sutra 2.1",
        translation: "Discipline, self-study and surrender to the Divine purify the body and mind.",
      },
      {
        sutra: "Yoga Sutra 1.14",
        translation: "Practice becomes firmly rooted when done for a long time, without break, and with devotion.",
      },
      {
        sutra: "Yoga Sutra 2.46",
        translation: "Asana is that posture which is steady (stable) and comfortable.",
      },
      {
        sutra: "Yoga Sutra 1.3",
        translation: "Then the Seer abides in his true nature.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Sun Salutation (Surya Namaskar)",
        body: "Discipline, self-study and surrender purify body and mind. (YS 2.1)",
        bullets: [
          "Boosts metabolism",
          "Increases energy & stamina",
          "Improves circulation",
          "Reduces lethargy & heaviness",
          "Supports weight management",
        ],
      },
      {
        number: 2,
        title: "Warrior II Pose (Virabhadrasana II)",
        body: "Practice becomes rooted when done over a long time, without break, with devotion. (YS 1.14)",
        bullets: [
          "Builds strength & endurance",
          "Improves focus & determination",
          "Opens chest & lungs",
          "Burns calories",
          "Enhances willpower",
        ],
      },
      {
        number: 3,
        title: "Chair Pose (Utkatasana)",
        body: "Asana is that posture which is steady and comfortable. (YS 2.46)",
        bullets: [
          "Strengthens legs & back",
          "Tones abdomen & hips",
          "Improves posture",
          "Increases stamina",
          "Activates inner fire (Agni)",
        ],
      },
      {
        number: 4,
        title: "Plank Pose (Phalakasana)",
        body: "Restrain mental fluctuations through steady practice and detachment.",
        bullets: [
          "Strengthens whole body",
          "Improves core stability",
          "Increases endurance",
          "Burns fat",
          "Builds determination",
        ],
      },
      {
        number: 5,
        title: "Boat Pose (Navasana)",
        body: "Cultivate friendliness, compassion, joy and equanimity to clear the mind.",
        bullets: [
          "Strengthens core & digestion",
          "Improves balance",
          "Reduces abdominal fat",
          "Boosts confidence",
          "Enhances mental clarity",
        ],
      },
      {
        number: 6,
        title: "Triangle Pose (Trikonasana)",
        body: "Practice of the limbs of yoga destroys impurities; the light of knowledge arises.",
        bullets: [
          "Improves digestion",
          "Tones waist & legs",
          "Opens chest & shoulders",
          "Improves flexibility",
          "Stimulates energy flow",
        ],
      },
      {
        number: 7,
        title: "Bow Pose (Dhanurasana)",
        body: "Discipline, self-study and surrender bring transformation.",
        bullets: [
          "Strengthens back & spine",
          "Improves posture",
          "Opens chest & lungs",
          "Stimulates metabolism",
          "Enhances energy",
        ],
      },
      {
        number: 8,
        title: "Seated Twist (Ardha Matsyendrasana)",
        body: "Yoga frees us from clinging and brings lightness.",
        bullets: [
          "Detoxifies the body",
          "Improves digestion",
          "Tones abdominal organs",
          "Relieves stiffness",
          "Brings lightness",
        ],
      },
      {
        number: 9,
        title: "Dynamic Lunge (Anjaneyasana)",
        body: "Practice with faith, energy, memory, focus and wisdom leads to success.",
        bullets: [
          "Strengthens legs & hips",
          "Improves balance",
          "Opens chest",
          "Increases stamina",
          "Reduces heaviness",
        ],
      },
      {
        number: 10,
        title: "Corpse Pose (Savasana)",
        body: "Then the Seer abides in his true nature. (YS 1.3)",
        bullets: [
          "Deep relaxation",
          "Reduces stress",
          "Restores energy",
          "Integrates practice",
          "Settles mind",
        ],
      },
      {
        title: "Kapha Balancing Tips",
        body: "Daily anchors that pair with the practice.",
        bullets: [
          "Wake up early",
          "Stay active",
          "Eat light & warm food",
          "Avoid day sleep",
          "Drink warm water",
          "Keep moving",
        ],
      },
    ],
    tagline: "Lighten the Body · Clear the Mind · Awaken the Spirit. Steady practice with right understanding leads to inner transformation.",
  },
  {
    slug: "pitta-balancing-yoga-10-asanas",
    title: "Pitta Balancing Yoga — 10 Cooling Asanas",
    concept: "pitta-yoga-10-asana",
    pillarSlug: "movement",
    dosha: "pitta",
    kind: "yoga",
    category: "body",
    image: {
      src: "/poster-images/pitta-balancing-yoga-10-asanas.webp",
      src2x: "/poster-images/pitta-balancing-yoga-10-asanas@2x.webp",
      thumb: "/poster-images/pitta-balancing-yoga-10-asanas.thumb.webp",
      width: 768,
      height: 512,
      alt: "Pitta Balancing Yoga poster with 10 asanas — Moon Salutation, Forward Fold, Camel, Seated Twist, Butterfly, Supine Twist, Child's Pose, Cooling Spinal Stretch, Legs Up the Wall, Corpse — each with Patanjali Yoga Sutra references and benefits.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.33",
        translation: "Friendliness, compassion, joy and equanimity bring purity to the mind.",
      },
      {
        sutra: "Yoga Sutra 2.46",
        translation: "Asana is that posture which is steady and comfortable.",
      },
      {
        sutra: "Yoga Sutra 1.3",
        translation: "Then the Seer abides in his true nature.",
      },
    ],
    sections: [
      {
        number: 1,
        title: "Moon Salutation (Chandra Namaskar)",
        body: "Practice becomes firmly rooted over time, without break and with devotion.",
        bullets: [
          "Cools body and mind",
          "Reduces irritability & anger",
          "Improves flexibility",
          "Supports hormonal balance",
          "Brings emotional calmness",
        ],
      },
      {
        number: 2,
        title: "Forward Fold (Paschimottanasana)",
        body: "Friendliness, compassion, joy and equanimity bring purity to the mind.",
        bullets: [
          "Calms the nervous system",
          "Reduces stress & tension",
          "Improves digestion",
          "Relieves headache & fatigue",
          "Promotes inner quietness",
        ],
      },
      {
        number: 3,
        title: "Camel Pose (Ustrasana)",
        body: "Asana is that posture which is steady and comfortable.",
        bullets: [
          "Opens chest & throat",
          "Relieves acidity & stress",
          "Improves spinal flexibility",
          "Enhances respiratory health",
          "Builds emotional stability",
        ],
      },
      {
        number: 4,
        title: "Seated Twist (Ardha Matsyendrasana)",
        body: "Discipline, self-study and surrender are the path of inner transformation.",
        bullets: [
          "Improves digestion & metabolism",
          "Detoxifies the body",
          "Relieves back pain",
          "Reduces liver congestion",
          "Enhances mental clarity",
        ],
      },
      {
        number: 5,
        title: "Butterfly Pose (Baddha Konasana)",
        body: "Mental fluctuations are restrained through practice and non-attachment.",
        bullets: [
          "Reduces stress & anxiety",
          "Improves reproductive health",
          "Opens hips & groin",
          "Improves blood circulation",
          "Promotes relaxation",
        ],
      },
      {
        number: 6,
        title: "Supine Twist (Supta Matsyendrasana)",
        body: "By regulation of inhalation and exhalation, mind becomes still.",
        bullets: [
          "Relaxes the spine",
          "Releases tension",
          "Improves digestion",
          "Calms the mind",
          "Supports detoxification",
        ],
      },
      {
        number: 7,
        title: "Child's Pose (Balasana)",
        body: "When the mind becomes calm, the intellect becomes clear and steady.",
        bullets: [
          "Calms anger & frustration",
          "Relieves fatigue",
          "Stretches the back gently",
          "Eases headache & stress",
          "Promotes emotional healing",
        ],
      },
      {
        number: 8,
        title: "Cooling Spinal Stretch (Matsyasana Variation)",
        body: "Steady practice removes obstacles on the inner path.",
        bullets: [
          "Cools the system",
          "Opens the throat & chest",
          "Relieves stress & anxiety",
          "Improves posture",
          "Stimulates thyroid function",
        ],
      },
      {
        number: 9,
        title: "Legs Up the Wall (Viparita Karani)",
        body: "Cultivate friendliness, compassion, joy and equanimity towards all.",
        bullets: [
          "Reduces inflammation",
          "Improves circulation",
          "Relieves tired legs",
          "Calms the nervous system",
          "Promotes deep relaxation",
        ],
      },
      {
        number: 10,
        title: "Corpse Pose (Savasana)",
        body: "Then the Seer abides in his true nature. (YS 1.3)",
        bullets: [
          "Deep relaxation",
          "Reduces stress & blood pressure",
          "Improves mental clarity",
          "Rejuvenates the body",
          "Connects to inner peace",
        ],
      },
      {
        title: "Pitta Balancing Tips",
        body: "Daily anchors that complement the cooling practice.",
        bullets: [
          "Eat cooling foods",
          "Stay hydrated",
          "Avoid excess heat",
          "Practice forgiveness",
          "Meditate daily",
          "Sleep well",
        ],
      },
    ],
    tagline: "Cool · Calm · Balanced. Steady practice with devotion leads to a calm mind and inner freedom.",
  },
  {
    slug: "manifestation-triptych-inner-to-outer",
    title: "Manifestation — Inner Transformation to Outer Reality",
    concept: "manifestation-inner-outer",
    pillarSlug: "divine-manifestation",
    kind: "general",
    category: "spirit",
    image: {
      src: "/poster-images/manifestation-triptych-inner-to-outer.webp",
      src2x: "/poster-images/manifestation-triptych-inner-to-outer@2x.webp",
      thumb: "/poster-images/manifestation-triptych-inner-to-outer.thumb.webp",
      width: 768,
      height: 512,
      alt: "Triptych poster on manifestation by Patanjali: Science of Manifestation panel, 3 Steps of Manifestation (Dharana, Dhyana, Samadhi), and Inner Transformation to Outer Manifestation mapping the 8 limbs of yoga to outer life results.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 1.2",
        translation: "Yoga is the stilling of the fluctuations of the mind.",
      },
    ],
    sections: [
      {
        title: "The Science of Manifestation According to Patanjali",
        body: "Your outer world is a reflection of your inner world. Change within, and life transforms.",
        bullets: [
          "Yoga is the stilling of the fluctuations of the mind. (YS 1.2)",
          "A calm mind creates clarity. Clarity creates intention. Intention creates reality.",
          "Discipline the mind, elevate consciousness, manifest your highest life.",
        ],
      },
      {
        number: 1,
        title: "Dharana (Concentration)",
        body: "Focus the mind on one goal.",
        bullets: [
          "Mental clarity",
          "Strong intention",
          "Eliminate distractions",
        ],
      },
      {
        number: 2,
        title: "Dhyana (Meditation)",
        body: "Continuous flow of awareness.",
        bullets: [
          "Emotional healing",
          "Inner peace",
          "Manifestation energy increases",
        ],
      },
      {
        number: 3,
        title: "Samadhi (Higher Consciousness)",
        body: "Union with the Divine.",
        bullets: [
          "Wisdom",
          "Divine guidance",
          "Effortless manifestation",
        ],
      },
      {
        title: "Key Practices for Manifestation",
        body: "When the mind becomes one-pointed, it gains the power to create.",
        bullets: [
          "Meditation",
          "Pranayama",
          "Sankalpa (intention)",
          "Visualization",
          "Affirmations",
          "Gratitude",
        ],
      },
      {
        title: "Inner Purification → Outer Manifestation",
        body: "The Patanjali Way — the eight limbs cultivated within yield expressed results without.",
        bullets: [
          "Yama & Niyama (Ethical Living) → Peace & Joy",
          "Asana (Physical Balance) → Healthy Body",
          "Pranayama (Energy Balance) → Strong Relationships",
          "Pratyahara (Withdrawal) → Abundance & Prosperity",
          "Dharana (Concentration) → Purpose & Fulfillment",
          "Dhyana (Meditation) → Spiritual Awakening",
          "Samadhi (Union) → Service to Humanity",
        ],
      },
      {
        title: "Remember",
        body: "You don't manifest what you want, you manifest what you are. Be the energy of your desires.",
        bullets: [
          "Pure Thoughts",
          "Positive Emotions",
          "Right Actions",
          "Divine Connection",
          "Manifested Reality",
        ],
      },
    ],
    tagline: "You are the creator of your reality. Align, believe, receive.",
  },
  {
    slug: "nutrition-fasting-ayurvedic-guide",
    title: "Nutrition & Fasting — Ayurvedic Eating & Intermittent Fasting",
    concept: "nutrition-fasting-ayurvedic",
    pillarSlug: "nutrition-fasting",
    kind: "general",
    category: "body",
    image: {
      src: "/poster-images/nutrition-fasting-ayurvedic-guide.webp",
      src2x: "/poster-images/nutrition-fasting-ayurvedic-guide@2x.webp",
      thumb: "/poster-images/nutrition-fasting-ayurvedic-guide.thumb.webp",
      width: 768,
      height: 1152,
      alt: "Nutrition & Fasting poster — three types of food (Sattvic, Rajasic, Tamasic), intermittent fasting practice and schedule, ayurvedic eating principles, dosha-specific food for Vata/Pitta/Kapha, daily yogic nutrition routine, spiritual benefits and mindful eating practice.",
    },
    scripture: [
      {
        sutra: "Yoga Sutra 2.40",
        translation: "When food is right, medicine is of no need. Balanced eating purifies the body, calms the mind and prepares us for higher awareness.",
      },
    ],
    sections: [
      {
        title: "The Yogic View of Food",
        body: "According to Patanjali Yoga Sutra, food influences our body, mind, emotions and consciousness. Right eating with discipline and awareness leads to health, clarity, balance and liberation.",
      },
      {
        title: "The Three Types of Food",
        body: "Sattvic, Rajasic and Tamasic foods carry different energies and produce different states of mind.",
        bullets: [
          "Sattvic (Pure & Balanced): fresh fruits, vegetables, whole grains, nuts and seeds, herbal teas — creates calmness, clarity and lightness.",
          "Rajasic (Active & Stimulating): spicy foods, coffee, garlic & onion, fried foods — creates restlessness and agitation.",
          "Tamasic (Heavy & Dull): processed foods, leftovers, fermented and stale food, alcohol — creates dullness, heaviness and laziness.",
        ],
      },
      {
        title: "Intermittent Fasting — A Modern Yogic Practice",
        body: "Fasting is a form of Tapas (discipline) that purifies the body, supports digestion and awakens spiritual awareness.",
        bullets: [
          "16:8 — Daily fast",
          "12:12 — Beginner fast",
          "24-hour weekly fast",
          "Detoxifies the body",
          "Improves mental clarity",
          "Boosts immunity and energy",
          "Helps weight management",
          "Slows aging and inflammation",
          "Awakens spiritual awareness",
        ],
      },
      {
        title: "Ayurvedic Eating Principles",
        body: "Foundational habits that align eating with nature.",
        bullets: [
          "Eat according to your dosha",
          "Eat at regular times",
          "Eat fresh, local and seasonal",
          "Eat slowly and mindfully",
          "Avoid overeating and snacking",
          "Cook food with love and gratitude",
        ],
      },
      {
        title: "Ayurvedic Food According to Dosha",
        body: "Tune your plate to your constitution.",
        bullets: [
          "Vata — warm, moist, grounding: cooked grains, root vegetables, ghee, warm milk, soups, herbal teas.",
          "Pitta — cool, calming, sweet: leafy greens, cucumbers, melons, coconut, dairy, sweet fruits.",
          "Kapha — light, warm, spicy: legumes, bitter greens, ginger, turmeric, light grains, herbal teas.",
        ],
      },
      {
        title: "Daily Yogic Nutrition Routine",
        body: "Eat with the rhythm of the sun.",
        bullets: [
          "Morning — warm water with lemon, light sattvic breakfast",
          "Afternoon — main meal between 10:30 AM and 2:00 PM when Agni is strongest",
          "Evening — light dinner before sunset",
          "Night — herbal tea, no heavy food",
        ],
      },
      {
        title: "Spiritual Benefits of Mindful Eating",
        body: "Why how we eat matters as much as what we eat.",
        bullets: [
          "Calms the mind",
          "Improves meditation",
          "Builds gratitude",
          "Strengthens self-discipline",
          "Deepens connection to nature and the Divine",
        ],
      },
      {
        title: "Mindful Eating Practice",
        body: "Bring presence to every meal.",
        bullets: [
          "Gratitude — pause and thank before eating",
          "Awareness — observe taste, texture, smell",
          "Chew slowly — let saliva mix with food",
          "Moderation — eat to 80% fullness",
          "Silence — eat without distraction",
          "Right portion — light enough to keep mind clear",
        ],
      },
    ],
    tagline: "Eat to Nourish. Fast to Purify. Live to Realize. This is the Yogic way of life.",
  },
];

export function getPostersByPillar(slug: string): Poster[] {
  return POSTERS.filter((p) => p.pillarSlug === slug);
}

export function getPosterByDosha(
  dosha: DoshaTag,
  kind: PosterKind,
): Poster | undefined {
  return POSTERS.find((p) => p.dosha === dosha && p.kind === kind);
}

export function getPosterBySlug(slug: string): Poster | undefined {
  return POSTERS.find((p) => p.slug === slug);
}
