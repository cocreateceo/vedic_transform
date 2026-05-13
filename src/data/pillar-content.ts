// Long-form per-pillar content used by the offline PDF download. Each
// entry is rendered as a standalone 2-3 page guide so users can read on
// a flight, in retreat, or without their phone unlocked. Keep prose
// short, scripture-grounded, and practical.

export interface PillarObstacle {
  obstacle: string;
  remedy: string;
}

export interface PillarScripture {
  verse: string;
  text: string;
}

export interface PillarContent {
  slug: string;
  /** 1-2 sentence hook for the PDF cover. */
  tagline: string;
  /** 2-3 paragraphs explaining the practice. */
  overview: string[];
  /** Modern + traditional rationale, 1-2 paragraphs. */
  whyItWorks: string[];
  /** Concrete numbered steps the user can follow today. */
  dailyPractice: string[];
  /** Canonical citations with the user-facing translation. */
  scripture: PillarScripture[];
  /** Common obstacles + their direct remedies. */
  obstacles: PillarObstacle[];
  /** Closing note — usually a dosha hint or encouragement. */
  closing: string;
}

export const PILLAR_CONTENT: Record<string, PillarContent> = {
  "morning-initiation": {
    slug: "morning-initiation",
    tagline:
      "Wake before the world wakes. Brahma Muhurta is the 96-minute window before sunrise — the hour when all three doshas rest in equilibrium and the mind is uniquely receptive.",
    overview: [
      "5 AM Initiation (Brahma Muhurta) is the practice of rising in the last quarter of the night — roughly 90 minutes before sunrise — and using that window for sadhana: meditation, study, or simply silence. Ayurveda calls this the most auspicious time of day, when the atmosphere itself favours sattva (clarity).",
      "The promise is simple: how you start the day is how you live the day. By winning the first 30 minutes — before phone, news, or obligation — you train the nervous system that you, not external pressure, set the tone.",
      "This is the foundation pillar. Every other practice in the 48-day journey is easier when you begin from a quiet, claimed morning.",
    ],
    whyItWorks: [
      "Cortisol naturally peaks 30-45 minutes after waking. Use it. Light exposure within the first 15 minutes of waking anchors circadian rhythm, improves nighttime melatonin release, and stabilises mood throughout the day (Huberman, Stanford).",
      "Vagbhata, the 7th-century Ayurvedic acharya, prescribed waking at this hour in the Dinacarya chapter of the Ashtanga Hridaya — not as ritual, but as physiology. The body's metabolic systems are primed for elimination, hydration, and movement at this hour.",
    ],
    dailyPractice: [
      "Set an alarm 96 minutes before local sunrise (typically 4:30-5:00 AM).",
      "Drink 500ml warm water immediately on waking — flushes overnight metabolic waste.",
      "Scrape the tongue, rinse the mouth, splash cold water on the face.",
      "Sit for 5 minutes of silent breath observation before opening any screen.",
      "Write one Sankalpa (intention) for the day on paper, not on a phone.",
      "Step outside or to a window within 15 minutes — get natural light on the eyes.",
      "Move the body gently for 5 minutes before any other obligation.",
    ],
    scripture: [
      {
        verse: "Ashtanga Hridaya, Sutra Sthana 2 (Dinacarya Adhyaya)",
        text: "One should rise from bed 96 minutes before sunrise. This is the suitable time to study and obtain knowledge — the hour when all three doshas rest in equilibrium.",
      },
      {
        verse: "Katha Upanishad 1.3.14",
        text: "Arise! Awake! Approach the great and learn. Like the sharp edge of a razor is that path — hard to tread and difficult to cross, so the wise say.",
      },
      {
        verse: "Rig Veda 1.35.9",
        text: "May Savitar, the golden-handed, drive away sickness and bid the Sun approach us, spreading the bright sky through the darksome region.",
      },
    ],
    obstacles: [
      {
        obstacle: "I can't fall asleep early enough to wake at 5 AM.",
        remedy:
          "Don't try. Shift the wake time first, even if you only sleep 5 hours for the first week — the body will demand earlier sleep within 4-5 days. Trying to shift bedtime first almost never works.",
      },
      {
        obstacle: "I wake up groggy and want to scroll.",
        remedy:
          "Place the phone in another room. Keep a glass of water and a journal next to the bed. The first 60 seconds determine the next 16 hours.",
      },
      {
        obstacle: "Weekends destroy the rhythm.",
        remedy:
          "Allow a maximum 60-minute drift on weekends. More than that creates 'social jet lag' and you're rebuilding the rhythm every Monday.",
      },
    ],
    closing:
      "Vata types: this pillar grounds you. Pitta types: it harnesses your fire before the world hijacks it. Kapha types: this is the single most important pillar for you — Kapha rises from 6 AM, and waking before 6 AM means waking before the heaviness sets in.",
  },

  "nutrition-fasting": {
    slug: "nutrition-fasting",
    tagline:
      "Eat with the sun. Vedic nutrition is not about restriction — it's about alignment: warm, fresh, plant-forward food eaten in the body's peak digestive window.",
    overview: [
      "Vedic Nutrition + Fasting (Ahara Vidhi) combines two ancient principles with modern metabolic science. First: eat sattvic food — fresh, plant-forward, mildly spiced, eaten warm. Second: confine eating to an 8-10 hour window aligned with daylight (16:8 fasting).",
      "Ayurveda classifies food by its effect on the mind, not just the body: sattvic (clarifying), rajasic (activating), tamasic (dulling). The same calorie load can either stabilise or destabilise the nervous system depending on what it is and when it's eaten.",
      "This pillar is about energy — not appearance. The goal is to wake up sharp, finish work without crashes, and end the day without sugar cravings.",
    ],
    whyItWorks: [
      "The body's digestive fire (Agni) peaks at midday when the sun is highest, matching modern circadian research showing insulin sensitivity is best between 10 AM and 2 PM. The same meal eaten at 8 PM produces measurably higher glucose response than at 1 PM.",
      "16:8 intermittent fasting activates autophagy — cellular self-cleaning. Sushruta described this 2,500 years ago as the body 'consuming its own ama (toxic residue)' during fasting hours. The mechanism is the same; the language has caught up.",
    ],
    dailyPractice: [
      "Skip breakfast or keep it light (fruit, warm water with lemon) — break the fast around 10-11 AM.",
      "Make lunch the largest meal of the day, eaten between 12 PM and 1 PM.",
      "Dinner should be light, warm, and finished by 7 PM — never within 3 hours of sleep.",
      "Favour cooked over raw, warm over cold, fresh over packaged.",
      "Include all six tastes (sweet, sour, salty, pungent, bitter, astringent) across the day.",
      "Sit down, no screens, chew each bite at least 20 times.",
      "Drink most of your water between meals, not during meals.",
    ],
    scripture: [
      {
        verse: "Ashtanga Hridaya, Sutra Sthana 4.36",
        text: "One who always resorts to desirable food and regimen, is objective, generous, straightforward, honest, has patience and values traditional wisdom — will never be affected by diseases.",
      },
      {
        verse: "Bhagavad Gita 6.16-17",
        text: "Yoga is not for one who eats too much, nor for one who fasts excessively; not for one who sleeps too much, nor for one who stays awake too long. Yoga arises in one who is moderate in eating, rest, work, and recreation.",
      },
      {
        verse: "Sushruta Samhita, Sutra Sthana",
        text: "Health and strength reside latent in the Ojah-dhatu, as butter lies latent in milk. He who guards his ojah through wholesome diet, sleep, and conduct guards life itself.",
      },
    ],
    obstacles: [
      {
        obstacle: "I get hungry by 10 AM.",
        remedy:
          "Drink warm water with lemon. Add a teaspoon of ghee to morning tea. Hunger before 11 AM is usually habit, not need — it passes within 3 days.",
      },
      {
        obstacle: "Family eats dinner at 9 PM.",
        remedy:
          "Eat your real meal at 6 PM. Sit with the family for a light bowl of soup or warm milk at 9. Don't fight social structures — augment them.",
      },
      {
        obstacle: "I need coffee in the morning.",
        remedy:
          "Drink water first. Coffee after the first glass of water is fine; coffee on an empty, dehydrated stomach spikes cortisol unnecessarily.",
      },
    ],
    closing:
      "Vata types: never skip lunch, eat warm and oily. Pitta types: avoid spicy and fried, never eat when angry. Kapha types: this is your weight loss pillar — extend the fast to 18:6 and skip dinner one night a week.",
  },

  "thoughts-intention": {
    slug: "thoughts-intention",
    tagline:
      "You are what you think. Sankalpa is the daily practice of catching, naming, and replacing the thought patterns that drive your life.",
    overview: [
      "Thoughts & Intention Reset (Sankalpa) is the discipline of mental hygiene. Most thoughts are recycled — modern research suggests 90% of today's thoughts are the same as yesterday's. The same negative loops, the same fears, the same self-talk.",
      "Sankalpa is the Vedic technology for interrupting that loop. It's not positive thinking. It's a stated, written, repeated intention — a deep groove that overwrites the surface chatter.",
      "This pillar is short (5 minutes a day) but compounds faster than any other. By Day 30, most practitioners report a noticeable shift in self-talk that they couldn't engineer with effort alone.",
    ],
    whyItWorks: [
      "Hebb's law: neurons that fire together wire together. Every repetition of a thought strengthens its neural pathway. Negative loops are not personality flaws — they are practiced grooves. They can be re-grooved.",
      "Brihadaranyaka Upanishad 4.4.5 states the principle bluntly: 'You are what your deepest desire is. As your desire is, so is your intention. As your intention is, so is your will. As your will is, so is your deed. As your deed is, so is your destiny.'",
    ],
    dailyPractice: [
      "Sit for 2 minutes and observe your dominant thought patterns without judgment.",
      "Identify ONE recurring negative loop (e.g. 'I never have enough time').",
      "Write a Sankalpa that is the opposite, in positive present-tense ('I move through my day with ease').",
      "Repeat the Sankalpa silently 3 times with eyes closed at the start of each day.",
      "Whenever the old loop arises during the day, say the Sankalpa to yourself instead.",
      "At night, note one moment when the new pattern showed up unprompted.",
      "Use the same Sankalpa for 21 consecutive days before changing it.",
    ],
    scripture: [
      {
        verse: "Brihadaranyaka Upanishad 4.4.5",
        text: "You are what your deepest desire is. As your desire is, so is your intention. As your intention is, so is your will. As your will is, so is your deed.",
      },
      {
        verse: "Bhagavad Gita 6.5",
        text: "Let a man lift himself by himself; let him not degrade himself; for the Self alone is the friend of the self, and the Self alone is the enemy of the self.",
      },
      {
        verse: "Yoga Sutras 2.33",
        text: "Vitarka-bādhane pratipakṣa-bhāvanam — When negative thoughts disturb the mind, cultivate the opposite.",
      },
    ],
    obstacles: [
      {
        obstacle: "My Sankalpa feels fake when I say it.",
        remedy:
          "It will. Belief is the result of practice, not the prerequisite for it. Say it anyway. The brain doesn't distinguish well between rehearsal and reality.",
      },
      {
        obstacle: "I keep forgetting to do it.",
        remedy:
          "Anchor it to an existing habit: every time you sit down for coffee, you say it. Habit-stacking is more reliable than willpower.",
      },
      {
        obstacle: "Negative thoughts feel more 'real' than the Sankalpa.",
        remedy:
          "They feel real because they're old. Frequency, not intensity, is what wires neural pathways. A whispered Sankalpa repeated 21 days beats a screamed one repeated once.",
      },
    ],
    closing:
      "Vata types: write the Sankalpa down to give it weight. Pitta types: choose a Sankalpa about softness, not ambition. Kapha types: this pillar lifts you out of inertia — make the Sankalpa active and bright.",
  },

  "breathing-meditation": {
    slug: "breathing-meditation",
    tagline:
      "Where the breath goes, the mind follows. Pranayama is the most direct lever ever discovered for the nervous system.",
    overview: [
      "Breathing + Meditation (Pranayama) is the conscious control of breath to regulate prana — the life force. In modern terms: it is the only autonomic system you can intervene in directly, which makes it the only conscious lever you have on the vagus nerve.",
      "Most stress in modern life is not psychological — it is respiratory. Shallow chest breathing keeps the body in low-grade sympathetic activation all day. Slowing the breath to 4-6 breaths per minute flips the switch to parasympathetic in under 90 seconds.",
      "This is the most practical pillar for anyone with anxiety, insomnia, or focus problems. Results are felt within one session.",
    ],
    whyItWorks: [
      "Heart rate variability (HRV) — the gold-standard measure of nervous system flexibility — increases dramatically with 4:6 breathing (4 seconds in, 6 seconds out). This single ratio activates the vagus nerve more reliably than any drug or supplement.",
      "Svatmarama's Hatha Yoga Pradipika 2.2 states the principle simply: 'When the breath wanders the mind is unsteady, but when the breath is still so is the mind.' Modern research has confirmed every word of that sentence.",
    ],
    dailyPractice: [
      "Sit upright, spine straight, hands resting on the knees.",
      "Begin with 3 deep belly breaths to settle the system.",
      "Inhale through the nose for 4 counts.",
      "Exhale through the nose for 6 counts. The exhale longer than the inhale is the key.",
      "Continue for 5 minutes minimum — work up to 15 minutes.",
      "For energising practice (mornings): try Bhastrika (rapid bellows breath) for 60 seconds first, then settle into 4:6.",
      "For sleep (evenings): try Bhramari (humming breath on the exhale) — drops the heart rate within 4-5 cycles.",
    ],
    scripture: [
      {
        verse: "Hatha Yoga Pradipika 2.2 (Svatmarama)",
        text: "When the breath is disturbed, the mind is disturbed. By restraining respiration, the yogi gets steadiness of mind.",
      },
      {
        verse: "Hatha Yoga Pradipika 2.3 (Svatmarama)",
        text: "So long as the breathing air stays in the body, it is called life. Death consists in the passing out of the air. It is therefore necessary to restrain the breath.",
      },
      {
        verse: "Yoga Sutras 2.49 (Patanjali)",
        text: "Tasmin sati śvāsa-praśvāsayor gati-vicchedaḥ prāṇāyāmaḥ — Asana being accomplished, pranayama is the regulation of the incoming and outgoing breath.",
      },
    ],
    obstacles: [
      {
        obstacle: "I can't extend my exhale to 6 seconds.",
        remedy:
          "Start with 3:4 and add a count each week. The ratio matters more than the count — 3:4 is more parasympathetic than 4:4.",
      },
      {
        obstacle: "My mind wanders constantly.",
        remedy:
          "That is the practice. Notice it wandered, return to the breath. The 'return' is the rep — not the steadiness.",
      },
      {
        obstacle: "I feel dizzy after a few minutes.",
        remedy:
          "You are likely over-breathing or holding tension. Loosen the jaw and shoulders. Breathing should be soft enough that someone next to you can't hear it.",
      },
    ],
    closing:
      "Vata types: long exhales calm your scattered mind — never skip this pillar. Pitta types: cooling breath (Sheetali) before bed reduces irritability. Kapha types: energising breath (Bhastrika) in the morning melts your heaviness.",
  },

  movement: {
    slug: "movement",
    tagline:
      "The body was built to move daily. Vyayama is not exercise — it is the maintenance ritual of being human.",
    overview: [
      "Movement Everyday (Vyayama) is the principle that the body must be challenged daily — but not destroyed. Ayurveda distinguishes vyayama (rejuvenating exercise) from ati-vyayama (depleting overexercise). The goal is not maximum output; it is consistent input.",
      "30 minutes a day, every day, beats 90 minutes three times a week. This pillar emphasises walking, yoga, mobility, and strength — in that order of priority.",
      "Movement is also the most accessible mood regulator. A 20-minute walk produces measurably more antidepressant effect than most prescriptions, with effect onset in under an hour.",
    ],
    whyItWorks: [
      "Daily walking — particularly outdoor walking — produces BDNF (brain-derived neurotrophic factor), the molecule most strongly correlated with new neuron growth and resistance to depression. The effect requires only 7,000-10,000 steps daily.",
      "The Hatha Yoga tradition (codified by Svatmarama and Gheranda) prescribes asana not for fitness but for steadiness — the body must be capable of sitting motionless for meditation. Movement is the foundation, not the goal.",
    ],
    dailyPractice: [
      "Begin with 5 minutes of gentle joint rotation (neck, shoulders, hips, ankles).",
      "10-15 minutes of yoga: Surya Namaskar (Sun Salutation) is the universal sequence.",
      "20-30 minute walk — outdoor light is non-negotiable. Pre-breakfast is ideal.",
      "Twice a week: add 15 minutes of strength work (bodyweight is enough).",
      "Once a week: a longer 60-90 minute session — hike, swim, dance, sport.",
      "Never train hard if you slept under 6 hours — walk instead.",
      "Always close with 2 minutes of stillness (Savasana).",
    ],
    scripture: [
      {
        verse: "Hatha Yoga Pradipika 1.1 (Svatmarama)",
        text: "Salutation to Adinatha (Shiva) who expounded the knowledge of Hatha Yoga, which like a staircase leads the aspirant to the high-pinnacled Raja Yoga.",
      },
      {
        verse: "Hatha Yoga Pradipika 1.65 (Svatmarama)",
        text: "Success comes to him who is engaged in the practice. How can one get success without practice? By merely reading books on Yoga, one can never get success.",
      },
      {
        verse: "Bhagavad Gita 6.17",
        text: "Yoga arises in one who is moderate in eating, rest, work, and recreation — destroying all sorrow.",
      },
    ],
    obstacles: [
      {
        obstacle: "I don't have 30 minutes.",
        remedy:
          "Walk for 10. Three 10-minute walks beat zero 30-minute walks. The barrier is starting, not continuing.",
      },
      {
        obstacle: "I keep getting injured.",
        remedy:
          "You are doing ati-vyayama (overexertion). Drop intensity by half for two weeks. Yoga and walking only. The body must adapt, not survive.",
      },
      {
        obstacle: "I'm bored of my routine.",
        remedy:
          "Variety is part of the practice. Rotate three modalities across the week: yoga + walking + strength. Boredom is usually a signal to add — not subtract.",
      },
    ],
    closing:
      "Vata types: choose gentle, rhythmic, grounding (yoga, swimming, walking) — avoid running on hard surfaces. Pitta types: cooling and non-competitive (swimming, hiking, gentle yoga). Kapha types: vigorous and sweat-inducing — running, HIIT, dance.",
  },

  "healing-meditation": {
    slug: "healing-meditation",
    tagline:
      "What you don't process, you replay. Healing meditation creates space between stimulus and response — and between past wound and present moment.",
    overview: [
      "Healing Meditation (Dhyana) is the deeper application of meditation: not for productivity or focus, but for the conscious processing of unresolved emotional material. It is the pillar that distinguishes 10X Vedic Transform from a habit tracker.",
      "Trauma, grief, anger — these are not 'thoughts' that meditation 'clears.' They are stored patterns that require gentle, repeated witnessing to integrate. The Vedic tradition has known this for millennia; modern trauma research has confirmed it in the last 30 years.",
      "Approach this pillar slowly. Five minutes daily for 21 days produces deeper results than an hour once a week. Healing is rhythm, not effort.",
    ],
    whyItWorks: [
      "Bessel van der Kolk's research (The Body Keeps the Score) confirms what Patanjali wrote 2,000 years ago — emotional patterns are stored somatically, and meditation that includes body awareness (vipassana, yoga nidra) is among the most reliable interventions.",
      "The Yoga Sutras 2.3 names the five obstacles (kleshas): ignorance, ego, attachment, aversion, clinging to life. Healing meditation is the practical method for loosening their grip — not by force, but by light.",
    ],
    dailyPractice: [
      "Sit comfortably, close the eyes, take 3 settling breaths.",
      "Scan the body slowly from head to feet — no fixing, just noticing.",
      "When you find tension or discomfort, breathe into it for 3-4 cycles.",
      "If a memory or emotion surfaces, allow it without engaging the story — feel the sensation in the body.",
      "Repeat silently: 'This too. This too. This too.' Do not push anything away.",
      "Close with 5 minutes of rest in stillness.",
      "If something heavy arises, journal for 10 minutes immediately after — do not carry it forward.",
    ],
    scripture: [
      {
        verse: "Yoga Sutras 2.3 (Patanjali)",
        text: "The pain-bearing obstructions are five: ignorance, egoism, attachment, aversion, and clinging to life. Ignorance is the mother of all the rest.",
      },
      {
        verse: "Yoga Sutras 2.1 (Patanjali)",
        text: "Mortification, study, and surrendering fruits of work to God are called Kriya Yoga — the preliminary practice that prepares the seeker for Samadhi.",
      },
      {
        verse: "Bhagavad Gita 6.19",
        text: "When meditation is mastered, the mind is unwavering like the flame of a candle in a windless place.",
      },
    ],
    obstacles: [
      {
        obstacle: "I cry every time I meditate.",
        remedy:
          "Good. Tears are evidence of release, not failure. Sit through them. If they recur for more than 2 weeks, work with a trauma-informed practitioner alongside.",
      },
      {
        obstacle: "Old memories keep surfacing — I want to stop.",
        remedy:
          "The body is offering what is ready to be integrated. Slow down (5 min daily, not 20). Do not bypass; do not force. If overwhelm sets in, return to breath only.",
      },
      {
        obstacle: "I feel nothing during meditation.",
        remedy:
          "That is also data. Numbness is a protective layer — be gentle with it. Try yoga nidra (guided body scan) instead of silent sitting for 2 weeks.",
      },
    ],
    closing:
      "Vata types: keep sessions short and grounded — use a weighted blanket if helpful. Pitta types: avoid setting goals around emotional 'progress.' Kapha types: this pillar moves stagnant emotional material — don't be surprised by what surfaces.",
  },

  gratitude: {
    slug: "gratitude",
    tagline:
      "Gratitude is not a feeling. It is a practice that, repeated, rewires the brain's default state from threat-scanning to appreciation.",
    overview: [
      "Gratitude Practice (Kritajnata) is the simplest pillar with the most research behind it. The premise: the brain's default network scans constantly for threat, lack, and comparison. Deliberate gratitude — written, specific, daily — is the most reliable counterweight ever measured.",
      "This is not about being positive or grateful for hardship. It is about training perception. Most days contain more good than the brain notices. Gratitude practice is how you notice it.",
      "Five minutes a day. Three specific things. That is the whole protocol.",
    ],
    whyItWorks: [
      "Dr. Robert Emmons' research at UC Davis shows that 21 days of daily gratitude journaling produces measurable changes in cortisol, sleep quality, and immune markers — comparable to several pharmacological interventions.",
      "The Taittiriya Upanishad opens with 'Saha nāv avatu, saha nau bhunaktu' — 'May we be protected together, may we be nourished together.' Gratitude in the Vedic tradition is relational, not individualistic. The 'I' practising gratitude is connecting to a 'we.'",
    ],
    dailyPractice: [
      "End of day: open a physical journal (not a phone).",
      "Write 3 specific things you are grateful for that happened today.",
      "Specific = 'My daughter laughed at my joke at dinner,' not 'My family.'",
      "For each, write one sentence about why it mattered.",
      "Read aloud one entry from a week ago — let the past gratitude land again.",
      "Close with one person you'd like to thank tomorrow.",
      "Once a week: write and send an actual thank-you message to someone.",
    ],
    scripture: [
      {
        verse: "Taittiriya Upanishad (Shanti Mantra)",
        text: "May we be protected together. May we be nourished together. May we work together with great vigour. May our study be illuminating. May there be no hatred between us. Om. Peace, peace, peace.",
      },
      {
        verse: "Isha Upanishad 18",
        text: "O Fire, lead us by the good path to the enjoyment of the fruit of our action. You know, O god, all our deeds.",
      },
      {
        verse: "Bhagavad Gita 9.22",
        text: "To those who are constantly devoted and who worship Me with love, I give the understanding by which they can come to Me.",
      },
    ],
    obstacles: [
      {
        obstacle: "I run out of things to be grateful for.",
        remedy:
          "Get more specific. 'Hot shower' counts. 'The way the light came through the window at 7 AM' counts. Specificity is the practice.",
      },
      {
        obstacle: "It feels forced.",
        remedy:
          "It will, for 1-2 weeks. The brain takes ~21 days to re-pattern. The shift is sudden — you wake up one morning already in a different mode.",
      },
      {
        obstacle: "Hard times — nothing feels worth gratitude.",
        remedy:
          "Then practice gratitude for the smallest things: breath, gravity, the cup. The harder the season, the more this pillar is for you.",
      },
    ],
    closing:
      "Vata types: this pillar is grounding — writing by hand is essential. Pitta types: include people you are critical of in the gratitude. Kapha types: this pillar lifts emotional heaviness — pair it with morning light.",
  },

  "sandhya-meditation": {
    slug: "sandhya-meditation",
    tagline:
      "Three times a day — sunrise, noon, sunset — the body's chemistry shifts. Sandhya is the practice of pausing to meet those shifts consciously.",
    overview: [
      "Sandhya Meditation (Sandhyavandana) is the ancient Vedic practice of meeting the three sandhis (junctions) of the day — sunrise, midday, and sunset — with a brief pause. Each junction marks a hormonal and energetic shift in the body, and the tradition observed that consciously meeting these shifts compounds clarity over time.",
      "This is not a long practice. 5-10 minutes per junction. The cost is small; the effect — by week 3 — is a sense of natural rhythm and ease that doesn't come from any single longer session.",
      "Sandhya is also the pillar that anchors the others. Once you meet the sun three times a day, you begin to live in cooperation with light, not in opposition to it.",
    ],
    whyItWorks: [
      "Circadian biology research (Satchin Panda, Salk Institute) shows that the body has approximately 30 distinct hormonal phases across the day. The three transitions Vedic tradition named are real and biologically marked — cortisol peaks around sunrise, digestive fire peaks near noon, melatonin begins its rise near sunset.",
      "The Gayatri Mantra (Rig Veda 3.62.10) was chanted at these junctions specifically because the receptive state of the body at these transitions amplified the practice. Chanting at sunrise vs midnight is not equivalent.",
    ],
    dailyPractice: [
      "Sunrise sandhya: 5 minutes — face east, breathe deeply, set the day's intention.",
      "Noon sandhya: 5 minutes — pause from work, look at the sky, eat consciously.",
      "Sunset sandhya: 5 minutes — face west, breathe slowly, release the day.",
      "Optional: chant the Gayatri Mantra 3 times at sunrise and sunset.",
      "If you cannot do all three, sunrise and sunset are the two most important.",
      "Use a sand timer or a quiet alarm so the practice doesn't intrude on tasks.",
      "Don't worry about exact sun times — within 30 minutes is fine.",
    ],
    scripture: [
      {
        verse: "Rig Veda 3.62.10 (Gayatri Mantra)",
        text: "Om bhūr bhuvaḥ svaḥ tat savitur vareṇyaṁ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt — May we meditate on the brilliant light of the Sun; may it inspire our thoughts.",
      },
      {
        verse: "Chandogya Upanishad 3.11.1",
        text: "The sun, indeed, never sets nor rises. When people think the sun is setting, it is not so; for it only changes about after reaching the end of the day and makes night below and day on the other side.",
      },
      {
        verse: "Bhagavad Gita 7.8",
        text: "I am the light of the sun and the moon. I am the syllable Om in the Vedic mantras; I am the sound in space and the strength in human beings.",
      },
    ],
    obstacles: [
      {
        obstacle: "I'm in meetings at noon.",
        remedy:
          "1 minute on the way to the bathroom counts. The pause is the practice; the duration is secondary.",
      },
      {
        obstacle: "I can't see the sun where I work.",
        remedy:
          "Step outside the building. If impossible, face an east-facing window. Awareness of the sun's position matters more than seeing it directly.",
      },
      {
        obstacle: "I forget the noon one.",
        remedy:
          "Anchor it to lunch. Standing up to eat = sandhya. Two practices, one ritual.",
      },
    ],
    closing:
      "Vata types: the rhythm itself soothes you. Pitta types: noon sandhya cools the midday fire. Kapha types: sunset sandhya prevents the after-5-PM slump into heaviness.",
  },

  "brahman-connection": {
    slug: "brahman-connection",
    tagline:
      "Beyond the body, beyond the mind, beyond personality — there is a field of universal consciousness. This pillar is the daily contact with it.",
    overview: [
      "Connection to Brahman (Brahma Sambandha) is the practice of regularly entering the elevated state of awareness where the boundary between the individual self and the universal field dissolves. The Upanishads call this Brahman — the infinite, unchanging reality that underlies all existence.",
      "This is a practical philosophy for self-understanding, inner transformation, and spiritual evolution — not a religious doctrine. The practice has no religious affiliation and welcomes people of all backgrounds, beliefs, and traditions. What you call the source — God, Creator, Universal Consciousness, Source Energy, the Universe — is your language. The experience is universal.",
      "The only requirement is openness to the idea that an intelligent universal energy flows through all things. From that openness, through guided meditation and subconscious-awareness techniques, the practitioner learns to connect to that energy, experience inner stillness and bliss, and develop a daily practice of presence.",
    ],
    whyItWorks: [
      "Modern neuroscience has begun mapping what the Upanishads described: in deep meditation, brain wave states shift from beta (alert thinking) to alpha (relaxed awareness) to theta (subconscious access) to delta (deep stillness). The subconscious mind — which holds most stored memory and pattern — becomes available for healing and transformation in these states.",
      "Mundaka Upanishad 2.2.4 gives the precise instruction: 'Om is the bow; the atman is the arrow; Brahman is said to be the mark. It is to be struck by an undistracted mind. Then the atman becomes one with Brahman, as the arrow with the target.' The technology is 3,000 years old; the experience is available today.",
    ],
    dailyPractice: [
      "Sit upright in a quiet place where you won't be interrupted.",
      "Close the eyes, take 3 deep breaths, soften the body.",
      "Repeat the syllable 'Om' silently or aloud — 7 times.",
      "Drop into silence and observe what arises without engaging it.",
      "When the mind wanders, gently return to 'Om' or to the breath.",
      "Hold the silence for 10 minutes. Beginners: 5 minutes is enough.",
      "Close with the wholeness mantra: 'Purnam adah, purnam idam' — That is whole, this is whole.",
    ],
    scripture: [
      {
        verse: "Mundaka Upanishad 2.2.4",
        text: "Om is the bow; the atman is the arrow; Brahman is said to be the mark. It is to be struck by an undistracted mind. Then the atman becomes one with Brahman, as the arrow with the target.",
      },
      {
        verse: "Brihadaranyaka Upanishad 1.4.10",
        text: "Aham Brahmasmi — I am Brahman. The individual consciousness is identical with the ultimate reality.",
      },
      {
        verse: "Isha Upanishad — Shanti Mantra",
        text: "Pūrṇam adaḥ, pūrṇam idam, pūrṇāt pūrṇam udacyate, pūrṇasya pūrṇam ādāya, pūrṇam evāvaśiṣyate — That is whole, this is whole. From the whole, the whole has been projected. When the whole is taken from the whole, the whole alone remains.",
      },
      {
        verse: "Chandogya Upanishad 6.8.7",
        text: "Tat tvam asi — You are That. The individual self and the universal Self are one.",
      },
    ],
    obstacles: [
      {
        obstacle: "I don't believe in any god — does this still apply?",
        remedy:
          "Yes. Replace 'Brahman' with 'universal consciousness,' 'field,' or 'source.' The practice is empirical, not theological. Do it for 21 days; let your direct experience be the test.",
      },
      {
        obstacle: "Nothing happens when I meditate.",
        remedy:
          "Then 'nothing happening' is the experience. Most people expect drama. The real shift is subtle and shows up off the cushion — in patience, in how you greet strangers, in what you eat.",
      },
      {
        obstacle: "I feel my mind expanding and it scares me.",
        remedy:
          "Open the eyes, place hands on the floor, take 5 grounding breaths. The fear is the personality contracting at the moment of expansion. It passes. Be gentle — don't force the next session.",
      },
    ],
    closing:
      "Many participants begin experiencing meaningful shifts and a deeper connection within the first week of sincere practice. Vata types: this pillar grounds your scattered awareness. Pitta types: it cools the constant 'doing' fire. Kapha types: it lifts you out of routine into possibility.",
  },

  "divine-manifestation": {
    slug: "divine-manifestation",
    tagline:
      "Sankalpa Shakti — the power of intention. Set the destination clearly, align with universal flow, and let the path emerge.",
    overview: [
      "Divine Manifestation (Sankalpa Shakti) is the Vedic technology for setting intentions and aligning daily action with deeper purpose. It is not 'manifestation' in the pop-culture sense — there is no magical attraction of objects. There is, instead, a precise practice of attention, alignment, and action.",
      "The Vedic understanding: an intention held consistently across the three states of waking, dreaming, and deep sleep — and reinforced by aligned action — operates at a layer below conscious decision-making. It shapes what you notice, who you meet, what opportunities you take.",
      "This is the pillar of dharma — finding and following your particular path. It works best when you stop asking 'what do I want' and start asking 'what wants to come through me.'",
    ],
    whyItWorks: [
      "Reticular activating system (RAS) research shows that a clearly held intention literally changes what the brain filters into awareness. Once you set a Sankalpa for, say, learning a skill — you start noticing teachers, books, and conversations you would have ignored before. The world didn't change; your filter did.",
      "Bhagavad Gita 2.47 names the deeper principle: 'You have the right to perform your duty, but you are not entitled to the fruits of your actions.' Sankalpa is set without attachment to outcome — paradoxically, this is what makes outcomes more likely.",
    ],
    dailyPractice: [
      "Once a week, sit quietly and write down your longest-term Sankalpa (1 year+).",
      "Daily morning: read it aloud, then write today's single most-aligned action.",
      "Take that action before any reactive task (no email, no calls until it's done).",
      "Evening: note whether the action moved you toward or away from the Sankalpa.",
      "Once a month, review the Sankalpa — does it still feel true? Refine if not.",
      "Never share your Sankalpa with anyone for the first 21 days — premature sharing dilutes the energy.",
      "Pair Sankalpa with surrender: 'Let this happen, or something better.'",
    ],
    scripture: [
      {
        verse: "Bhagavad Gita 2.47",
        text: "You have the right to perform your duty, but you are not entitled to the fruits of your actions. Never let the fruits be your motive, but do not be attached to inaction either.",
      },
      {
        verse: "Bhagavad Gita 3.30 (Gandhi translation)",
        text: "Dedicate every action to the indwelling Self. With mind fixed on the Atman, and without any thought of fruit or sense of 'mine,' shake off thy fever and act.",
      },
      {
        verse: "Mundaka Upanishad 1.2.12",
        text: "Let a man, after having examined all these worlds that are gained by works, acquire freedom from desires: nothing that is eternal can be produced by what is not eternal.",
      },
    ],
    obstacles: [
      {
        obstacle: "I don't know what my Sankalpa should be.",
        remedy:
          "Start with a question, not an answer: 'What would I do if no one was watching?' Sit with the question for a week. The Sankalpa will surface.",
      },
      {
        obstacle: "I set a Sankalpa and nothing happened.",
        remedy:
          "Sankalpa is not a wishlist. It works through aligned daily action. If you set it and didn't act on it, the field has nothing to respond to.",
      },
      {
        obstacle: "Doubt keeps eroding my Sankalpa.",
        remedy:
          "Doubt is information. Either the Sankalpa is wrong (refine it) or the doubt is old fear (treat it as a thought to observe, not obey). Sit with it; ask which it is.",
      },
    ],
    closing:
      "Vata types: write it down and re-read often — your mind moves too fast otherwise. Pitta types: include surrender in the Sankalpa, not just ambition. Kapha types: this pillar pulls you out of stagnation — set a Sankalpa that scares you a little.",
  },

  "sleep-optimization": {
    slug: "sleep-optimization",
    tagline:
      "Sleep is not the absence of activity. It is the most important active practice of the day — the time the body and mind do their deepest work.",
    overview: [
      "Sleep Optimization (Nidra) is the pillar most people undervalue and most people need most. Modern research from Dr. Matthew Walker and others has confirmed what Ayurveda described 2,500 years ago: sleep is not a passive recovery — it is the most metabolically active and neurologically critical phase of the 24-hour cycle.",
      "Memory consolidation, glymphatic clearance of brain waste, growth-hormone release, immune-system priming, emotional regulation — all happen during sleep, and all degrade dramatically when sleep is short or fragmented.",
      "The good news: sleep responds quickly to small changes. Most people see measurable shifts within 3-7 days of correcting the basics.",
    ],
    whyItWorks: [
      "Sleep timing matters as much as sleep duration. The first 4 hours of sleep contain the majority of deep (delta-wave) sleep — the phase responsible for physical repair. Going to bed at 10 PM gives you significantly more deep sleep than the same 7 hours starting at 1 AM, regardless of total time.",
      "Ashtanga Hridaya, Sutra Sthana 7 categorises sleep as one of the 'three pillars of life' (along with food and brahmacharya). Sleeping at the wrong times is named as a leading cause of disease — a claim modern circadian research has confirmed in detail.",
    ],
    dailyPractice: [
      "Aim for bed by 10 PM, asleep by 10:30 PM.",
      "No screens 60 minutes before bed — or use blue-light filters religiously.",
      "Dim all household lights after sunset (use lamps, not overhead lights).",
      "Last meal 3 hours before sleep. Last sip of water 1 hour before.",
      "Cool the room to 65-68°F (18-20°C). Cool > warm for deep sleep.",
      "5-minute wind-down: gentle yoga, warm bath, or 4:6 breathing.",
      "If wake at 3 AM and mind races: sit up, breathe slowly, no screens. Sleep returns.",
    ],
    scripture: [
      {
        verse: "Ashtanga Hridaya, Sutra Sthana 7 (Vagbhata)",
        text: "Sleep, food, and brahmacharya — these three are the pillars of life. Practiced correctly, they sustain the body; abused, they destroy it.",
      },
      {
        verse: "Bhagavad Gita 6.17",
        text: "He who is regulated in habits of eating, sleeping, work, and recreation can mitigate all material sorrows by practicing the yoga system.",
      },
      {
        verse: "Mandukya Upanishad 5",
        text: "When one falls asleep desiring nothing, seeing no dreams — this is deep sleep. It is non-dual, a mass of consciousness, blissful and the enjoyer of bliss.",
      },
    ],
    obstacles: [
      {
        obstacle: "I can't fall asleep until midnight or later.",
        remedy:
          "Wake at 5 AM regardless. Within 5-7 days the body will demand earlier sleep. Trying to fix bedtime first almost never works.",
      },
      {
        obstacle: "I wake up at 3 AM and can't go back to sleep.",
        remedy:
          "Often a Vata imbalance or a 9 PM caffeine. Reduce caffeine after noon. Try warm milk with nutmeg before bed. If persistent, journal the racing thoughts at 3 AM — sleep often returns within 20 minutes.",
      },
      {
        obstacle: "I sleep 8 hours but wake exhausted.",
        remedy:
          "Quality matters more than quantity. Likely causes: late bedtime (post-11 PM), warm room, late eating, alcohol, or undiagnosed sleep apnea. Address one at a time.",
      },
    ],
    closing:
      "Vata types: irregular sleep is your default — strict consistent bedtime is non-negotiable. Pitta types: avoid screens and intense work after 9 PM. Kapha types: never nap after 3 PM, and never sleep past 6 AM — even on weekends.",
  },
};
