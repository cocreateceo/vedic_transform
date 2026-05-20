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
