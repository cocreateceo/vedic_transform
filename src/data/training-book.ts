// The "10x Vedic" training course — the book from docs/Training Materials/
// converted into structured data. Introduction + Chapters 1-2 are published;
// chapters 3-11 are outlined (title + description from the Introduction's
// chapter list) and marked coming-soon until authored.
//
// New chapters follow the content-incoming snippet workflow: draft a
// TrainingChapter entry, flip status to "published", append here.

export interface TrainingChapterSection {
  heading: string;
  paragraphs: string[];
}

export interface TrainingExercise {
  title: string; // e.g. "Daily Silence"
  steps: string[];
}

export interface TrainingChapter {
  slug: string;
  number: number; // 0 = Introduction, 1-11 = chapters
  title: string;
  subtitle?: string;
  description: string; // one-liner for cards / coming-soon entries
  status: "published" | "coming-soon";
  relatedPillarSlug?: string; // joins src/constants/pillars.ts
  image: string; // hero image, /training-media/hero-<slug>.webp, 1600x900
  sectionArt?: {
    exercises?: string;
    reflections?: string;
    summary?: string;
  }; // 800x500 card art, /training-media/<slug>-<section>.webp
  sections?: TrainingChapterSection[];
  exercises?: TrainingExercise[];
  reflectionQuestions?: string[];
  summary?: string[]; // paragraphs
}

export const TRAINING_CHAPTERS: TrainingChapter[] = [
  {
    slug: "introduction",
    number: 0,
    title: "10x Vedic Transformation",
    subtitle:
      "Ancient Wisdom. Conscious Leadership. Measurable Outcomes. Science-Powered Transformation.",
    description:
      "Why 10x Vedic exists, the five dimensions of evolution, and the 48-day journey ahead.",
    status: "published",
    image: "/training-media/hero-introduction.webp",
    sectionArt: {
      summary: "/training-media/introduction-summary.webp",
    },
    sections: [
      {
        heading: "A Profound Shift",
        paragraphs: [
          "The world is entering a profound shift. Artificial Intelligence is transforming industries. Human attention is fragmented. Stress, anxiety, loneliness, and disconnection are rising despite unprecedented technological advancement.",
          "At the same time, humanity is searching again for meaning, consciousness, healing, purpose, and inner alignment.",
          "10x Vedic serves us at the intersection of these two worlds: Timeless Vedic wisdom. Science-enabled measurable transformation.",
          "This is not about escaping the modern world. It is about mastering it consciously.",
          "This book is a practical framework for living, leading, healing, creating, and scaling life from higher awareness while embracing the opportunities of life and universal global connection.",
          "The Vedic tradition teaches that every human being carries infinite potential within. It reminds us that the same universal intelligence that governs creation also exists inside us. When we align thought, emotion, energy, action, and purpose, life begins to move with clarity, synchronicity, peace, abundance, and service.",
        ],
      },
      {
        heading: "Five Dimensions of Evolution",
        paragraphs: [
          "10x Vedic is designed to help individuals evolve in five dimensions: Consciousness. Health & Energy. Relationships & Service. Leadership & Creation. Wealth & Purpose.",
          "This Vedic journey combines: Energy, Gratitude, and Alignment. Meditation and healing. Energy and self awareness. Infinite mindset, dharma-centered leadership. Breath, rest, food, and exercise. Conscious co-creation. Evolution through action and awareness.",
          "The goal is not merely success. The goal is aligned expansion.",
          "A Vedic life is not about intensity, it’s about alignment. It emerges when intuition, clarity, purpose, systems, and energy work together in harmony. When you operate from this elevated state of awareness, life stops feeling like a struggle and starts becoming a deliberate, meaningful creation.",
        ],
      },
      {
        heading: "Who This Book Is For",
        paragraphs: [
          "This book is written for: Leaders. Builders. Healers. Professionals. Entrepreneurs. Creators. Seekers. Families. Communities. Anyone seeking a deeper meaningful connection with themselves and the universe.",
          "Each chapter builds upon the next, creating a practical roadmap toward conscious living and purposeful impact. These 48 days of focus will transform your life.",
        ],
      },
      {
        heading: "The 11 Chapters of 10x Vedic",
        paragraphs: [
          "Chapter 1: Connect to the Self and the Universe. Understanding the self, higher self, universal consciousness, energy, vibration, frequencies, intuition, and creator-spiritual connection.",
          "Chapter 2: Consciousness & Self-Awareness. Awakening awareness, observing thought patterns, ego vs higher consciousness, emotional intelligence, and inner alignment.",
          "Chapter 3: Meditation & Healing. Meditation, breathwork, energy healing, chakra awareness, manifestation, subconscious transformation, and practices inspired by Vedic science. Align physical body rhythms with nature.",
          "Chapter 4: Dharma & Purpose. Discovering life purpose, soul alignment, service to humanity, values-based living, and purposeful decision-making.",
          "Chapter 5: Health, Energy & Balance. The connection between body, mind, food, sleep, emotions, movement, energy systems, and sustainable vitality.",
          "Chapter 6: Relationships, Family & Community. Sacred relationships, emotional safety, communication, compassion, shared growth, family harmony, and conscious communities.",
          "Chapter 7: Healing, Service and Leadership Through Consciousness. Servant leadership, trust, integrity, wisdom-based influence, decision-making, calm leadership under pressure, and conscious organizational culture.",
          "Chapter 8: Nutrition and Fasting. Sattvic eating, mindful fasting, digestion as inner fire, and the food-energy connection that fuels clarity and vitality.",
          "Chapter 9: Movement, Exercise and Sleep Optimization. Key yoga, micro-movements every 90 minutes, strength, exercise, and sleep optimization.",
          "Chapter 10: Creation, Manifestation & Transformation. Manifestation through clarity, intention, frequency, aligned action, subconscious reprogramming, visualization, gratitude, and disciplined execution.",
          "Chapter 11: Living the 10x Vedic Life. Integrating spirituality, leadership, technology, healing, family, wealth, and service into one harmonious life journey dedicated to personal evolution and collective upliftment.",
        ],
      },
      {
        heading: "A 48-Day Journey Into Conscious Living",
        paragraphs: [
          "Each chapter builds upon the next, forming a practical roadmap toward conscious living and purposeful impact. Over 48 days, you’ll shift from unconscious patterns to intentional creation, one insight, one practice, one transformation at a time.",
          "This is your invitation to reconnect with your inner intelligence and universal energy, enable your highest potential, align with your purpose, and create impact that is authentic and sustainable.",
          "Give yourself these 48 days of focused awareness, and realize your full potential — a more meaningful, and profoundly powerful life.",
        ],
      },
    ],
    summary: [
      "The future belongs to the most conscious. Technology without consciousness creates imbalance. Spirituality without action limits impact.",
      "10x Vedic is about bringing both together. A new generation of conscious creators, healers, leaders, and innovators is emerging.",
      "This is an invitation to become one of them.",
    ],
  },
  {
    slug: "connect-to-the-universe",
    number: 1,
    title: "Connect to the Self and the Universe",
    subtitle: "Remembering Who You Truly Are",
    description:
      "Understanding the self, higher self, universal consciousness, energy, vibration, frequencies, intuition, and creator-spiritual connection.",
    status: "published",
    relatedPillarSlug: "brahman-connection",
    image: "/training-media/hero-connect-to-the-universe.webp",
    sectionArt: {
      exercises: "/training-media/connect-to-the-universe-exercises.webp",
      reflections: "/training-media/connect-to-the-universe-reflections.webp",
      summary: "/training-media/connect-to-the-universe-summary.webp",
    },
    sections: [
      {
        heading: "The Forgotten Power Within",
        paragraphs: [
          "One of the most inspiring moments in the Ramayana occurs on the shores of the ocean separating India from Sri-Lanka. The Vanara army stood facing an impossible challenge. Somewhere across the vast ocean, Sita waited to be rescued. Rama’s mission depended upon someone finding the courage to cross the seemingly impossible distance.",
          "Among the warriors stood Hanuman. Today, Hanuman is revered as a symbol of strength, devotion, courage, and unwavering faith. Yet in that moment, he hesitated. Not because he lacked power. Because he had forgotten it.",
          "The ancient story tells us that Hanuman had been blessed with extraordinary abilities from birth. Yet due to circumstances in his early life, he temporarily forgot his divine nature. Like many human beings, he became identified with limitation rather than possibility.",
          "Then the wise elder Jambavan reminded him of who he truly was. He reminded Hanuman of his strength. He reminded Hanuman of his purpose. He reminded Hanuman of his connection to the divine.",
          "In that instant, everything changed. The ocean did not become smaller. The challenge did not become easier. The circumstances did not change. Only Hanuman’s awareness changed.",
          "The moment he remembered who he truly was, he accomplished what moments earlier seemed impossible. This story is not merely about Hanuman. It is about every one of us.",
          "Most people spend their lives trying to become something they already are. The journey of transformation is rarely about acquiring power. It is about remembering reconnecting and realizing our full potential.",
        ],
      },
      {
        heading: "The Central Question of Human Life",
        paragraphs: [
          "For thousands of years, spiritual seekers have asked one question: “Who am I?”",
          "Most people answer this question using external identities. I am a parent. I am a leader. I am an entrepreneur.",
          "I am a teacher. I am successful. I am struggling. I am wealthy.",
          "I am poor. I am young. I am old.",
          "Yet the Ancient Vedic sages challenged these answers. They asked: Who are you when every role is removed? Who are you beneath your achievements? Who are you beneath your failures?",
          "Who are you beneath your fears? Who are you beneath your thoughts?",
          "The Upanishads teach that our deepest identity is not the body, mind, emotions, possessions, or social status. Our deepest identity is consciousness itself. This consciousness is not separate from the intelligence that governs the universe.",
          "The sages called this intelligence ‘Brahman’. Modern language may call it universal intelligence, source energy, divine consciousness, or universal awareness. The name matters less than the experience. The experience is one of connection.",
        ],
      },
      {
        heading: "The Great Illusion of Separation",
        paragraphs: [
          "Imagine a wave rising from the ocean. For a brief moment, the wave appears separate. It has its own shape. Its own size. Its own movement.",
          "Yet its essence remains ocean. The wave is never truly separate.",
          "Similarly, every human being appears separate. We have unique bodies, personalities, experiences, and journeys. Yet according to Vedic wisdom, our essence remains connected to the same universal consciousness.",
          "The illusion of separation creates fear. When we feel disconnected from others, loneliness emerges. When we feel disconnected from nature, imbalance emerges.",
          "When we feel disconnected from purpose, confusion emerges. When we feel disconnected from the divine, suffering emerges. The first step of transformation is recognizing connection.",
        ],
      },
      {
        heading: "My Own Journey",
        paragraphs: [
          "Growing up in India, I was surrounded and influenced by various spiritual traditions, temples, churches and mosques; stories from the Ramayana and Mahabharata, and teachings that spoke of something greater than individual achievement. Like many people, I later became immersed in career growth, technology leadership, business transformation, and the demands of modern life.",
          "Success brought opportunities. It brought learning. It brought growth. Yet I repeatedly noticed something interesting.",
          "The greatest breakthroughs never came solely from strategy. They came from alignment. The most important decisions often emerged from intuition.",
          "The strongest leadership moments emerged from service. The most meaningful successes emerged when purpose aligned with action.",
          "Over time, I began to see that spirituality and leadership were not separate paths. They were expressions of the same journey. The more connected we become to universal intelligence, the more effective we become in serving others and aligned to our purpose.",
        ],
      },
      {
        heading: "Arjuna’s Crisis",
        paragraphs: [
          "The Mahabharata offers another profound example. On the battlefield of Kurukshetra, Arjuna stood facing an impossible situation. He was one of the greatest warriors of his time. Yet at the moment of action, he became overwhelmed.",
          "Confusion replaced clarity. Emotion replaced purpose. Fear replaced confidence.",
          "Arjuna’s challenge was not a lack of skill. His challenge was a loss of perspective.",
          "Krishna did not teach Arjuna new combat techniques. Instead, Krishna expanded Arjuna’s consciousness. He helped Arjuna see reality from a higher perspective. Only then could Arjuna fulfill his purpose.",
          "This lesson remains relevant today. Many people are not suffering from a lack of capability. They are suffering from a lack of clarity.",
          "The solution is not always more information. The solution is expanded awareness.",
        ],
      },
      {
        heading: "Energy and Frequency",
        paragraphs: [
          "Everything in the universe exists as energy. Modern physics confirms what ancient sages intuitively understood. Matter itself is a form of energy.",
          "The Vedic tradition teaches that human beings continuously emit and receive energy through thoughts, emotions, actions, and intentions. Consider entering a room where two people have been arguing. Often you can feel the tension immediately. No one needs to explain it. You sense it.",
          "Similarly, when you meet someone filled with enthusiasm, peace, or joy, their energy influences the environment around them. This is why consciousness matters. Your internal state influences your external reality.",
          "Fear attracts fearful decisions. Confidence attracts courageous action. Gratitude attracts opportunity.",
          "Service attracts trust. Love attracts connection.",
        ],
      },
      {
        heading: "Modern Examples",
        paragraphs: [
          "Many successful individuals speak openly about intuition and connection. Oprah Winfrey often describes following intuition and connection as one of the most important factors in her success. Steve Jobs spoke about connecting the dots and trusting inner wisdom.",
          "Many elite athletes describe entering states of flow where action feels effortless and connected to something greater than themselves. They may use different language. Yet the experience remains remarkably similar. At their highest moments, they feel connected to a larger intelligence.",
        ],
      },
      {
        heading: "A Healing Story",
        paragraphs: [
          "Several years ago, a professional leader came seeking help. By every external measure, he was successful. Strong career. Financial security. Professional recognition.",
          "Yet internally he felt exhausted. Disconnected. Unfulfilled.",
          "During our conversations, a pattern emerged. Every major decision in his life had been driven by external expectations. He had spent decades trying to become what others expected him to become.",
          "Very little attention had been given to what his soul desired. Through meditation, reflection, and self-awareness practices, he gradually reconnected with his deeper purpose.",
          "Nothing dramatic happened overnight. Yet slowly, clarity emerged. His stress decreased. His relationships improved. His work became more meaningful.",
          "The transformation began when he reconnected with himself.",
        ],
      },
      {
        heading: "Nature as a Teacher",
        paragraphs: [
          "One of the easiest ways to reconnect with the universe is through nature. Nature operates according to universal laws. The sun rises without anxiety. Trees grow without comparison. Rivers flow without resistance.",
          "Birds do not worry about social status. Nature demonstrates alignment.",
          "Human beings suffer when they resist natural principles. When we force what should flow, frustration emerges. When we trust life while taking responsible action, harmony emerges.",
          "Spending time in nature reminds us that we are part of something much larger than ourselves.",
        ],
      },
    ],
    exercises: [
      {
        title: "Daily Silence",
        steps: [
          "Spend ten minutes each morning in silence.",
          "No phone.",
          "No email.",
          "No distractions.",
          "Simply observe.",
          "Allow awareness to deepen.",
        ],
      },
      {
        title: "Gratitude Practice",
        steps: [
          "Write down three things you appreciate each day.",
          "Gratitude shifts attention from scarcity to abundance.",
        ],
      },
      {
        title: "Nature Connection",
        steps: [
          "Spend time outdoors without headphones or devices.",
          "Observe the intelligence present in nature.",
        ],
      },
      {
        title: "Intuition Journal",
        steps: [
          "Record intuitive insights.",
          "Notice patterns.",
          "Trust grows through practice.",
        ],
      },
      {
        title: "Meditation Practice",
        steps: [
          "Close your eyes.",
          "Take slow breaths.",
          "Imagine a brilliant light above your head.",
          "Feel this light flowing through your body.",
          "Recognize that the same intelligence that powers stars, galaxies, oceans, and forests also flows through you.",
          "Repeat silently:",
          "“I am connected.”",
          "“I am guided.”",
          "“I am supported.”",
          "“I am part of something greater.”",
          "Remain in this awareness for several minutes.",
        ],
      },
    ],
    reflectionQuestions: [
      "Who am I beyond my roles and titles?",
      "Where in my life do I feel disconnected?",
      "What activities help me feel connected to something greater?",
      "What fears arise when I forget my true nature?",
      "What becomes possible when I remember it?",
    ],
    summary: [
      "The first pillar of the 10x Vedic journey is connection. Before we can transform our health, leadership, wealth, relationships, or purpose, we must reconnect with the source from which all transformation emerges.",
      "Hanuman’s power existed long before he remembered it. Arjuna’s greatness existed before Krishna revealed it. The same is true for us.",
      "We are not disconnected beings searching for power. We are powerful beings rediscovering connection. The journey of 10x Vedic begins with a simple truth:",
      "You are not separate from the universe. You are an expression of it. The infinite conscious universal intelligence that created the universe is within you.",
      "When you remember that truth, everything begins to change.",
    ],
  },
  {
    slug: "consciousness-and-self-awareness",
    number: 2,
    title: "Consciousness & Self-Awareness",
    subtitle: "The Foundation of Every Transformation",
    description:
      "Awakening awareness, observing thought patterns, ego vs higher consciousness, emotional intelligence, and inner alignment.",
    status: "published",
    relatedPillarSlug: "thoughts-intention",
    image: "/training-media/hero-consciousness-and-self-awareness.webp",
    sectionArt: {
      exercises:
        "/training-media/consciousness-and-self-awareness-exercises.webp",
      reflections:
        "/training-media/consciousness-and-self-awareness-reflections.webp",
      summary:
        "/training-media/consciousness-and-self-awareness-summary.webp",
    },
    sections: [
      {
        heading: "The Warrior Who Could Not Fight",
        paragraphs: [
          "The Bhagavad Gita begins with a paradox. The greatest warrior of his age could not lift his bow. Arjuna stood on the battlefield of Kurukshetra, facing an army filled with teachers, relatives, friends, and former allies.",
          "His body trembled. His mind raced. His confidence disappeared. His purpose became clouded.",
          "Arjuna was not weak. He was not unskilled. He was not unprepared. He was unconscious.",
          "Not unconscious in the physical sense. He had become overwhelmed by fear, emotion, attachment, and confusion.",
          "At that moment, Arjuna represents all of humanity. Every person eventually encounters a Kurukshetra. A moment when knowledge is insufficient. A moment when talent is insufficient. A moment when experience is insufficient.",
          "A moment when clarity becomes more important than capability. The battlefield may be a marriage. A business. A health challenge. A financial setback.",
          "A difficult decision. A personal loss. In these moments, success depends upon consciousness.",
          "Before Krishna offered Arjuna any strategy, he expanded Arjuna’s awareness. The lesson is profound.",
          "Transformation begins not with action. Transformation begins with awareness.",
        ],
      },
      {
        heading: "What Is Consciousness?",
        paragraphs: [
          "Many people think consciousness means being awake. The Vedic sages taught something much deeper. Consciousness is awareness itself.",
          "It is the ability to observe. It is the silent witness behind every thought. Behind every emotion. Behind every experience.",
          "Most people spend their lives identified with their thoughts. They believe every thought is true. Every fear is real. Every emotional reaction is justified.",
          "Self-awareness begins when we realize: I am not my thoughts. I am the observer of my thoughts.",
          "I am not my emotions. I am the observer of my emotions. I am not my circumstances. I am the observer of my circumstances.",
          "This realization changes everything.",
        ],
      },
      {
        heading: "The Chariot of Life",
        paragraphs: [
          "The ancient Katha Upanishad offers a powerful metaphor. The body is the chariot. The senses are the horses. The mind holds the reins. The intellect serves as the charioteer.",
          "The soul is the passenger. Most people allow the horses to run wild. Desire pulls them in one direction.",
          "Fear pulls them in another. Anger pulls them somewhere else. The result is chaos.",
          "Self-awareness allows the intellect to guide the mind. The mind guides the senses. The senses serve the soul. This creates alignment.",
        ],
      },
      {
        heading: "The Ego’s Greatest Trick",
        paragraphs: [
          "The ego is not the enemy. The ego is a tool. Problems arise when we mistake the tool for our identity.",
          "The ego constantly seeks validation. It compares. Competes. Judges. Defends.",
          "Blames. Seeks approval. Fears rejection.",
          "The ego says: “I am my success.” “I am my title.” “I am my possessions.” “I am what others think of me.”",
          "Consciousness says: “I am awareness itself.”",
          "The ego creates separation. Consciousness creates connection. The ego seeks control. Consciousness seeks understanding.",
          "The ego reacts. Consciousness responds.",
        ],
      },
      {
        heading: "My Own Leadership Lessons",
        paragraphs: [
          "Throughout my career leading technology transformations, I observed something fascinating. Technical problems were rarely the biggest challenge. People were.",
          "Not because people are difficult. Because people bring emotions, beliefs, fears, expectations, and identities into every situation.",
          "The most successful leaders were not always the smartest. They were often the most self-aware. They understood their triggers. They recognized their biases.",
          "They managed their emotions. They listened deeply. They responded thoughtfully. They remained calm when others panicked.",
          "These leaders operated from consciousness rather than reaction.",
        ],
      },
      {
        heading: "Yudhishthira and Emotional Stability",
        paragraphs: [
          "In the Mahabharata, Yudhishthira is often criticized for being too calm. Yet his calmness became one of his greatest strengths. During exile, humiliation, uncertainty, and loss, he maintained perspective.",
          "He did not allow temporary circumstances to dictate permanent decisions. This is emotional mastery. Many people lose years of progress because they make permanent decisions based on temporary emotions.",
          "Self-awareness creates space between stimulus and response. Within that space lies wisdom.",
        ],
      },
      {
        heading: "The Modern Epidemic of Distraction",
        paragraphs: [
          "We live in the most connected age in history. Yet many people have never felt more disconnected from themselves. Notifications compete for attention. Social media competes for attention. News competes for attention.",
          "Advertising competes for attention. Artificial intelligence competes for attention. The result is fragmented awareness.",
          "Many people know what is happening everywhere except within themselves. The ancient sages would likely consider attention to be humanity’s most valuable asset.",
          "Where attention goes, energy flows. Where energy flows, results emerge. If we cannot direct our attention, we cannot direct our lives.",
        ],
      },
      {
        heading: "A Client’s Transformation",
        paragraphs: [
          "A senior executive once shared a common frustration. “My life feels successful on paper, but I don’t feel successful.” As we explored his situation, a pattern emerged.",
          "His entire identity was built around achievement. Every accomplishment brought temporary satisfaction. Then another goal appeared.",
          "Another target. Another milestone. Another chase. He had become addicted to external validation.",
          "Through mindfulness practices, journaling, and meditation, he began observing his patterns. Not judging them. Observing them.",
          "Awareness gradually weakened the unconscious habits driving his behavior. Within months, he reported greater peace than he had experienced in years.",
          "Nothing outside changed dramatically. His awareness changed.",
        ],
      },
      {
        heading: "The Mirror Principle",
        paragraphs: [
          "The world often acts as a mirror. Situations reveal hidden beliefs. Relationships reveal hidden wounds. Challenges reveal hidden fears. Success reveals hidden attachments.",
          "When something repeatedly triggers us, the trigger often points toward an opportunity for growth.",
          "Conscious people ask: “What is this situation teaching me?” Unconscious people ask: “Why is this happening to me?”",
          "The first question creates empowerment. The second creates victimhood.",
        ],
      },
      {
        heading: "Developing Self-Awareness",
        paragraphs: [
          "Self-awareness is not a talent. It is a practice. Like strength training develops muscles, awareness training develops consciousness. Simple practices create profound results.",
        ],
      },
    ],
    exercises: [
      {
        title: "Daily Reflection",
        steps: [
          "At the end of each day, ask:",
          "What went well today?",
          "What triggered me today?",
          "What lesson did I learn today?",
          "What can I improve tomorrow?",
        ],
      },
      {
        title: "Conscious Listening",
        steps: [
          "Listen to understand rather than respond.",
          "Most people hear words.",
          "Few hear emotions.",
          "Even fewer hear intentions.",
        ],
      },
      {
        title: "Emotional Observation",
        steps: [
          "When emotions arise, observe them.",
          "Instead of saying:",
          "“I am angry.”",
          "Try saying:",
          "“I notice anger arising.”",
          "This creates separation between awareness and reaction.",
        ],
      },
      {
        title: "Meditation for Self-Awareness",
        steps: [
          "Sit comfortably.",
          "Close your eyes.",
          "Observe your breath.",
          "Do not control it.",
          "Simply observe.",
          "Thoughts will arise.",
          "Do not fight them.",
          "Do not follow them.",
          "Simply notice them.",
          "Become aware of the observer behind the thoughts.",
          "Become aware of the awareness itself.",
          "Rest there.",
          "This simple practice gradually strengthens consciousness.",
        ],
      },
    ],
    reflectionQuestions: [
      "Who am I when no one is watching?",
      "What patterns repeatedly appear in my life?",
      "What fears most often influence my decisions?",
      "What emotional triggers control my reactions?",
      "What would change if I responded from awareness rather than habit?",
    ],
    summary: [
      "Most people believe transformation comes from learning something new. Often transformation comes from seeing something clearly. Awareness precedes change.",
      "Consciousness precedes growth. Clarity precedes action. Arjuna did not need more weapons. He needed expanded awareness.",
      "The same is true for us. The second pillar of the 10x Vedic journey is self-awareness. Because when we become aware of our thoughts, emotions, beliefs, and patterns, we gain the power to transform them.",
      "And when we transform ourselves, we transform our lives. The greatest journey is not outward. It is inward.",
      "The greatest victory is not over others. It is over unconsciousness.",
    ],
  },
  {
    slug: "vedic-meditation-and-healing",
    number: 3,
    title: "Meditation & Healing",
    description:
      "Meditation, breathwork, energy healing, chakra awareness, manifestation, subconscious transformation, and practices inspired by Vedic science. Align physical body rhythms with nature.",
    status: "coming-soon",
    relatedPillarSlug: "healing-meditation",
    image: "/training-media/hero-vedic-meditation-and-healing.webp",
  },
  {
    slug: "dharma-and-purpose",
    number: 4,
    title: "Dharma & Purpose",
    description:
      "Discovering life purpose, soul alignment, service to humanity, values-based living, and purposeful decision-making.",
    status: "coming-soon",
    image: "/training-media/hero-dharma-and-purpose.webp",
  },
  {
    slug: "health-energy-and-balance",
    number: 5,
    title: "Health, Energy & Balance",
    description:
      "The connection between body, mind, food, sleep, emotions, movement, energy systems, and sustainable vitality.",
    status: "coming-soon",
    image: "/training-media/hero-health-energy-and-balance.webp",
  },
  {
    slug: "relationships-family-and-community",
    number: 6,
    title: "Relationships, Family & Community",
    description:
      "Sacred relationships, emotional safety, communication, compassion, shared growth, family harmony, and conscious communities.",
    status: "coming-soon",
    relatedPillarSlug: "gratitude",
    image: "/training-media/hero-relationships-family-and-community.webp",
  },
  {
    slug: "leadership-through-consciousness",
    number: 7,
    title: "Healing, Service and Leadership Through Consciousness",
    description:
      "Servant leadership, trust, integrity, wisdom-based influence, decision-making, calm leadership under pressure, and conscious organizational culture.",
    status: "coming-soon",
    image: "/training-media/hero-leadership-through-consciousness.webp",
  },
  {
    slug: "nutrition-and-fasting",
    number: 8,
    title: "Nutrition and Fasting",
    description:
      "Sattvic eating, mindful fasting, digestion as inner fire, and the food-energy connection that fuels clarity and vitality.",
    status: "coming-soon",
    relatedPillarSlug: "nutrition-fasting",
    image: "/training-media/hero-nutrition-and-fasting.webp",
  },
  {
    slug: "movement-exercise-and-sleep-optimization",
    number: 9,
    title: "Movement, Exercise and Sleep Optimization",
    description:
      "Key yoga, micro-movements every 90 minutes, strength, exercise, and sleep optimization.",
    status: "coming-soon",
    relatedPillarSlug: "movement",
    image: "/training-media/hero-movement-exercise-and-sleep-optimization.webp",
  },
  {
    slug: "creation-manifestation-and-transformation",
    number: 10,
    title: "Creation, Manifestation & Transformation",
    description:
      "Manifestation through clarity, intention, frequency, aligned action, subconscious reprogramming, visualization, gratitude, and disciplined execution.",
    status: "coming-soon",
    relatedPillarSlug: "divine-manifestation",
    image: "/training-media/hero-creation-manifestation-and-transformation.webp",
  },
  {
    slug: "living-the-10x-vedic-life",
    number: 11,
    title: "Living the 10x Vedic Life",
    description:
      "Integrating spirituality, leadership, technology, healing, family, wealth, and service into one harmonious life journey dedicated to personal evolution and collective upliftment.",
    status: "coming-soon",
    image: "/training-media/hero-living-the-10x-vedic-life.webp",
  },
];

export const getTrainingChapterBySlug = (slug: string) =>
  TRAINING_CHAPTERS.find((c) => c.slug === slug);

export const getPublishedChapters = () =>
  TRAINING_CHAPTERS.filter((c) => c.status === "published");

export const trainingContentId = (slug: string) => `training-${slug}`;
