import type {
  YesNoStep,
  YesNoConfig,
} from "@/components/features/pillars/yesno-reflection";

// One-step-at-a-time reflection content for the pillars that don't have
// custom interactive practice surfaces. Each pillar gets a short list of
// honest yes/no questions about today's habits, with tailored coaching
// for both answers — celebrating the wins and giving a concrete starter
// nudge on the gaps. Steps live here (rather than inline in the page)
// so the page file stays focused on layout and state.

export type PillarReflection = {
  steps: YesNoStep[];
  config: YesNoConfig;
};

const THOUGHTS_STEPS: YesNoStep[] = [
  {
    title: "Catch a Negative Thought",
    description:
      "Negative patterns repeat unless you catch them. The catch itself is the rewiring — you don't have to fix the thought, just notice it.",
    question:
      "Did you catch yourself in a negative thought today and consciously reframe it?",
    successMessage:
      "Beautiful. Every catch weakens the old pattern. Over weeks this is how the mind actually changes.",
    tryAgainMessage:
      "Tomorrow, set 2 phone reminders that just say \"What am I thinking right now?\" — that's the whole practice. Awareness is enough.",
  },
  {
    title: "Morning Sankalpa",
    description:
      "A sankalpa is a one-line intention for the day — calm, focused, kind, present. Spoken once in the morning, it quietly shapes your choices.",
    question: "Did you set a clear intention (sankalpa) for the day this morning?",
    successMessage:
      "Wonderful. Even one word — \"focus\", \"calm\", \"build\" — gives the mind a North Star for the day's decisions.",
    tryAgainMessage:
      "Tomorrow morning, before opening your phone, pick one word. Just one. That's your sankalpa for the day.",
  },
  {
    title: "Self-Talk Awareness",
    description:
      "The voice in your head is a voice you trained — and you can retrain it. The first step is just hearing it clearly.",
    question:
      "Did you notice how you talked to yourself today, and shift it to be kinder when needed?",
    successMessage:
      "Beautiful. You can't change a voice you don't hear. Today you heard it — that's the entire practice.",
    tryAgainMessage:
      "Tomorrow, after any small mistake, just ask: \"Would I say this to a friend?\" That question alone changes the tone.",
  },
  {
    title: "Affirmation",
    description:
      "Spoken affirmations rewire the default story you tell about yourself. Repetition, not perfection, is what works.",
    question:
      "Did you say or write at least one positive affirmation about yourself today?",
    successMessage:
      "Excellent. The brain doesn't distinguish well between rehearsed and real. Keep rehearsing the story you want to live.",
    tryAgainMessage:
      "Tomorrow, while brushing your teeth, look in the mirror and say one sentence — \"I am calm and capable.\" That's it.",
  },
  {
    title: "Worry Boundary",
    description:
      "Worry expands when you let it run free. Naming it or writing it down gives the mind something to hold instead of spin on.",
    question:
      "Did you stop yourself from spiraling on a worry today — e.g., by naming the fear or writing it down?",
    successMessage:
      "Wonderful. Naming the worry shrinks it. You traded a spiral for a thought you could actually work with.",
    tryAgainMessage:
      "Tomorrow, when a worry starts circling, write it down in one sentence and ask: \"Can I do anything about this in the next hour?\" If no, set it aside.",
  },
  {
    title: "Tomorrow's Intention",
    description:
      "Setting tomorrow's intention before sleep primes the subconscious overnight — you wake up already aligned.",
    question:
      "Did you take a moment tonight to set tomorrow's intention before sleep?",
    successMessage:
      "Beautiful. Your sleep does the integration work for free. You'll wake up clearer for having done this.",
    tryAgainMessage:
      "Tonight, before you put down the phone, ask: \"What do I want tomorrow to feel like?\" Answer in one word. Sleep on it.",
  },
];

const MOVEMENT_STEPS: YesNoStep[] = [
  {
    title: "30 Minutes of Movement",
    description:
      "Daily movement — yoga, walking, strength, anything deliberate — is the biggest single lever for metabolism, mood, and longevity.",
    practice: {
      kind: "image",
      pexelsSlug: "posture-outdoor",
      caption:
        "The form doesn't matter much — the consistency does. Pick what fits today and start.",
    },
    question:
      "Did you move for at least 30 minutes today (yoga, walk, strength, or any deliberate movement)?",
    successMessage:
      "Wonderful. Done daily, 30 minutes outperforms almost every other health intervention. You showed up — that's the whole game.",
    tryAgainMessage:
      "Tomorrow, just start with 10 minutes — a walk after lunch, a few sun salutations after waking. Streaks beat intensity.",
  },
  {
    title: "Morning Movement",
    description:
      "Moving within an hour of waking signals your circadian clock that the day has begun — energy, focus, and sleep all improve.",
    practice: {
      kind: "image",
      pexelsSlug: "posture-morning-stretch",
      caption:
        "Five slow stretches by a window with morning light — that's the entire entry-level practice.",
    },
    question: "Did you stretch or do any movement within an hour of waking?",
    successMessage:
      "Beautiful. Morning movement is one of the cleanest hacks for a sharp day and a deep sleep that night.",
    tryAgainMessage:
      "Tomorrow, just stand and do five slow stretches before opening your phone. That's it. Add from there over the weeks.",
  },
  {
    title: "Hourly Standing",
    description:
      "Sitting more than 60 minutes at a stretch is metabolically expensive. A 60-second stand-and-stretch every hour adds up to enormous benefit.",
    practice: {
      kind: "image",
      pexelsSlug: "posture-hourly-standing",
      caption:
        "Stand up, reach overhead, twist gently side to side, roll the shoulders. 30 seconds is enough.",
    },
    question:
      "Did you stand up and move at least once per hour during the day?",
    successMessage:
      "Excellent. Those micro-breaks add up to real metabolic protection — and they also reset your focus.",
    tryAgainMessage:
      "Tomorrow, set an hourly silent vibration on your watch or phone. When it buzzes, stand. 30 seconds is enough.",
  },
  {
    title: "Outdoor Time",
    description:
      "Outdoor movement adds sunlight, fresh air, and visual depth — combined benefits no gym can match.",
    practice: {
      kind: "image",
      pexelsSlug: "posture-outdoor",
      caption:
        "Even barefoot on grass counts. Sunlight on skin and earth underfoot — the most ancient practice we have.",
    },
    question: "Did you spend at least 15 minutes moving outdoors today?",
    successMessage:
      "Wonderful. Outdoor light alone resets your circadian rhythm and lifts your mood. Movement on top is a bonus.",
    tryAgainMessage:
      "Tomorrow, take one of today's indoor activities outside — a phone call on a walk, coffee on the balcony, lunch on a bench.",
  },
  {
    title: "Strength or Resistance",
    description:
      "Strength work preserves muscle, bone density, and metabolic health as you age — and it doesn't require a gym.",
    practice: {
      kind: "image",
      pexelsSlug: "posture-strength",
      caption:
        "Beginner circuit: 10 squats, 10 push-ups (knees down is fine), 30-second plank. Repeat 2-3 times. Three minutes total.",
    },
    question:
      "Did you do any strength or resistance work today (push-ups, planks, squats, weights)?",
    successMessage:
      "Excellent. Even 5-10 minutes a few times a week is enough to keep muscle and bone strong over the decades.",
    tryAgainMessage:
      "Tomorrow, try this: 10 squats, 10 push-ups (knees OK), 30-second plank. Three minutes total. Repeat daily.",
  },
  {
    title: "Post-Dinner Walk",
    description:
      "A 10-minute walk after dinner blunts the blood-sugar spike, supports digestion, and improves sleep quality.",
    practice: {
      kind: "image",
      pexelsSlug: "posture-walking",
      caption:
        "Just 10 minutes. Slow pace, full belly, ideally outside. Notice how different your evening feels.",
    },
    question: "Did you take a short walk after dinner?",
    successMessage:
      "Beautiful. The post-meal walk is one of the highest-leverage 10-minute habits for both blood sugar and sleep.",
    tryAgainMessage:
      "Tomorrow night, just 10 minutes after dinner — around the block, in the yard, even just pacing the room. Notice the difference.",
  },
];

const HEALING_STEPS: YesNoStep[] = [
  {
    title: "Sitting Practice",
    description:
      "Formal sitting meditation builds the muscle you use during the day. 10 minutes daily compounds enormously over weeks.",
    practice: {
      kind: "image",
      pexelsSlug: "posture-sitting-meditation",
      caption:
        "Sukhasana (easy cross-legged) is the simplest seat. Spine tall but soft. Hands resting on knees or thighs. Eyes closed or softly lowered. If your knees rise above your hips, sit on a cushion until they sink below.",
    },
    question: "Did you sit for a formal meditation today (10+ minutes)?",
    successMessage:
      "Wonderful. The daily sit is the practice. Everything else in the day flows from this anchor.",
    tryAgainMessage:
      "Tomorrow, just five minutes. Set a timer. Sit comfortably. Breathe. When the mind wanders, return — that's the practice, not the goal.",
  },
  {
    title: "Healing Visualization",
    description:
      "Visualizing healing light or energy moving through the body activates a real physiological relaxation response.",
    question:
      "Did you spend a few minutes visualizing healing light or energy moving through your body?",
    successMessage:
      "Beautiful. The body responds to vivid imagery as if it were real. You gave it real rest today.",
    tryAgainMessage:
      "Try this tomorrow: lying in bed, picture a warm golden light entering through the crown of your head and slowly moving down to your toes. Two minutes is plenty.",
  },
  {
    title: "Emotional Release",
    description:
      "Suppressed emotions don't disappear — they go into the body. Letting yourself feel them, briefly and consciously, is the release.",
    question:
      "Did you let yourself feel and release any difficult emotion today (sadness, anger, grief) rather than push it down?",
    successMessage:
      "Beautiful. Feeling fully — even briefly — is what lets emotions move through. You did the brave thing today.",
    tryAgainMessage:
      "Tomorrow, when a hard emotion comes up, give it 60 seconds. Just feel it in the body. Don't analyze it. Then let it move.",
  },
  {
    title: "Forgiveness",
    description:
      "Forgiveness isn't condoning — it's releasing the energetic weight you carry. The person who benefits most is you.",
    question:
      "Did you offer forgiveness to someone today — including yourself — even silently?",
    successMessage:
      "Wonderful. Forgiveness is a daily practice, not a one-time event. Each time you offer it, you set yourself free a little more.",
    tryAgainMessage:
      "Tomorrow, think of one small thing you're holding against yourself or someone else, and silently say: \"I forgive you. I forgive myself.\" That's the practice.",
  },
  {
    title: "Loving-Kindness (Metta)",
    description:
      "Sending good wishes — even silently, even to strangers — measurably improves your own nervous system within minutes.",
    question:
      "Did you send a moment of loving-kindness to someone today (friend, stranger, or difficult person)?",
    successMessage:
      "Beautiful. The blessing you send out lands first in your own body. You changed your physiology today.",
    tryAgainMessage:
      "Tomorrow, while waiting in line or sitting in traffic, silently say toward someone nearby: \"May you be happy. May you be at peace.\" Try it with three different people.",
  },
  {
    title: "Body Scan",
    description:
      "A body scan reveals where you're holding tension you didn't know about — and naming it is most of the work of releasing it.",
    practice: {
      kind: "image",
      pexelsSlug: "posture-body-scan",
      caption:
        "Lie flat on your back (savasana) — arms a few inches from the body, palms up, legs hip-width apart. Slowly move attention from feet to crown, pausing wherever you find tension and breathing into it.",
    },
    question:
      "Did you do a body scan today — noticing tension and inviting it to soften?",
    successMessage:
      "Excellent. The body holds everything the mind tries to ignore. Today you listened — that's the entire practice.",
    tryAgainMessage:
      "Tomorrow night, before sleep, slowly move your attention from feet to head. Wherever you find tension, just breathe into it. Two minutes is enough.",
  },
];

const SANDHYA_STEPS: YesNoStep[] = [
  {
    title: "Sunrise Sandhya",
    description:
      "The transition at sunrise is the most powerful moment of the day — the mind is naturally meditative if you meet it there.",
    question:
      "Did you practice Sandhya at or near sunrise (within an hour after)?",
    successMessage:
      "Beautiful. Practicing at the transition aligns your nervous system with the day's natural rhythm. You'll feel the difference.",
    tryAgainMessage:
      "Tomorrow, set your alarm 15 minutes earlier and use those minutes to sit quietly facing east, just breathing. That's all.",
  },
  {
    title: "Midday Pause",
    description:
      "A 60-second pause at noon resets the nervous system and prevents afternoon fatigue.",
    question: "Did you pause at noon for a moment of stillness or breath?",
    successMessage:
      "Wonderful. Midday is where most days lose their thread. You held yours today.",
    tryAgainMessage:
      "Tomorrow, set a silent alarm for noon. When it goes off, just close your eyes for 10 slow breaths — wherever you are.",
  },
  {
    title: "Sunset Sandhya",
    description:
      "Sunset Sandhya releases the day's accumulated tension and prepares the body for deep evening rest.",
    question: "Did you practice Sandhya at or near sunset?",
    successMessage:
      "Beautiful. The sunset transition is the body's natural cue to soften. You honored it today.",
    tryAgainMessage:
      "Tomorrow, at sunset, just step outside for five minutes — face west, breathe slowly, watch the light shift. That's enough.",
  },
  {
    title: "Gayatri Mantra",
    description:
      "The Gayatri Mantra (Om Bhur Bhuvah Svaha…) is the most universal Sandhya prayer — chanted at the day's transitions for over 3,000 years.",
    question: "Did you chant or silently recite the Gayatri Mantra today?",
    successMessage:
      "Excellent. You joined a chain of practitioners stretching back millennia. The vibration alone changes the field.",
    tryAgainMessage:
      "Tomorrow, find a Gayatri recording — three rounds (about 90 seconds). Just listen. Familiarity comes with repetition.",
  },
  {
    title: "Pranayama in Sandhya",
    description:
      "Conscious breathwork — even just five rounds of alternate nostril — anchors the Sandhya practice in the body, not just the mind.",
    question:
      "Did you do conscious breathing as part of your Sandhya practice?",
    successMessage:
      "Wonderful. Breath plus mantra plus stillness — that's the full Sandhya. You did the complete practice.",
    tryAgainMessage:
      "Tomorrow, add three rounds of alternate nostril breathing before or after sitting. The technique amplifies the whole practice.",
  },
  {
    title: "Surya Namaskar",
    description:
      "One round of Surya Namaskar is twelve poses that work every major muscle and breath together — the most efficient warmup ever designed. Compare the GIF vs the video below — both show the same flow.",
    practice: {
      kind: "media-compare",
      gif: {
        src: "/images/pexels/posture-surya-namaskar.gif",
        caption: "GIF version · ~5.8 MB · animated image · auto-loops",
      },
      video: {
        src: "/videos/pexels/posture-surya-namaskar.mp4",
        caption: "MP4 version · ~570 KB · native player · smoother playback",
      },
      poseList: [
        "Pranamasana — Prayer pose, stand tall, palms together at heart",
        "Hasta Uttanasana — Inhale, arms overhead, gentle backbend",
        "Padahastasana — Exhale, forward fold, hands to feet",
        "Ashwa Sanchalanasana — Inhale, right leg back, low lunge",
        "Dandasana — Hold breath, plank, body straight",
        "Ashtanga Namaskara — Exhale, knees-chest-chin to floor",
        "Bhujangasana — Inhale, cobra, lift chest, hips down",
        "Adho Mukha Svanasana — Exhale, downward dog, hips up",
        "Ashwa Sanchalanasana — Inhale, right leg forward, low lunge",
        "Padahastasana — Exhale, forward fold, hands to feet",
        "Hasta Uttanasana — Inhale, rise, arms overhead, gentle backbend",
        "Pranamasana — Exhale, palms together at heart",
      ],
      attribution: {
        name: "Klaus Nielsen",
        url: "https://www.pexels.com/@klaus-nielsen",
        source: "Footage",
      },
    },
    question: "Did you do at least one Surya Namaskar (sun salutation) today?",
    successMessage:
      "Beautiful. One round daily keeps body and mind both supple. You honored the practice.",
    tryAgainMessage:
      "Tomorrow morning, just one round. Twelve poses, about 90 seconds. YouTube has hundreds of guided versions if you're new.",
  },
];

const BRAHMAN_STEPS: YesNoStep[] = [
  {
    title: "Silent Sitting",
    description:
      "Silence is the doorway. Even 10 minutes of just being — not doing, not seeking — is where the deepest reset happens.",
    practice: {
      kind: "image",
      pexelsSlug: "posture-sitting-meditation",
      caption:
        "Sit comfortably — cross-legged on a cushion, or in a chair with feet flat on the floor. Spine upright but soft. Hands resting. Eyes closed or softly lowered. Just sit. That's the whole practice.",
    },
    question:
      "Did you spend at least 10 minutes in silent meditation today, simply being?",
    successMessage:
      "Wonderful. Just being is the rarest skill in modern life. You practiced it today.",
    tryAgainMessage:
      "Tomorrow, set a 10-minute timer. Sit. Don't try to meditate — just sit. That's it. The depth comes from showing up, not effort.",
  },
  {
    title: "Witness Awareness",
    description:
      "Behind every thought, feeling, and sensation is the awareness watching them. Resting in that awareness — even briefly — is the doorway home.",
    question:
      "Did you take a moment today to notice — \"I am the awareness watching this\" — and rest there?",
    successMessage:
      "Beautiful. That one shift in perspective — from thinker to watcher — is the entire path in a single move.",
    tryAgainMessage:
      "Tomorrow, in any quiet moment, ask: \"Who is aware of all this?\" Don't answer with words. Just notice the awareness itself.",
  },
  {
    title: "So Ham Practice",
    description:
      "So Ham — \"I am that\" — is the natural sound of the breath. Inhale silent \"so\", exhale silent \"ham\". A practice as old as the Upanishads.",
    question:
      "Did you practice So Ham — silent inhale \"so\", silent exhale \"ham\" — for a few minutes today?",
    successMessage:
      "Excellent. So Ham aligns the breath with the deepest mantra in the tradition. The mind quiets quickly with this one.",
    tryAgainMessage:
      "Tomorrow, try three minutes. Lying in bed before sleep is perfect. Silent \"so\" in, silent \"ham\" out. Notice what changes.",
  },
  {
    title: "Nature Connection",
    description:
      "Truly seeing nature — without the filter of thought — is itself a connection to Brahman. A tree, the sky, a leaf. Just look.",
    question:
      "Did you spend a moment today truly seeing nature — a tree, the sky, the breath of wind?",
    successMessage:
      "Beautiful. The tree and the seer are made of the same substance. You felt that today, even briefly.",
    tryAgainMessage:
      "Tomorrow, stand at a window for 60 seconds and just look at one tree, cloud, or patch of sky. Don't think — just look.",
  },
  {
    title: "Mantra Japa",
    description:
      "Mantra repetition — Om, So Ham, Aham Brahmasmi — is the most direct technique for quieting the mind and feeling the underlying field.",
    question:
      "Did you chant or silently repeat a mantra (Om, So Ham, Aham Brahmasmi) for 5+ minutes?",
    successMessage:
      "Wonderful. Mantra is one of the oldest and most reliable doorways. You walked through it today.",
    tryAgainMessage:
      "Tomorrow, pick one mantra and silently repeat it for five minutes — while walking, in the shower, before sleep. Repetition is the whole practice.",
  },
  {
    title: "Surrender",
    description:
      "The deepest spiritual move is the smallest — letting go of needing to control something. Once a day is enough to remember who's really driving.",
    question: "Did you let go of needing to control something today, even briefly?",
    successMessage:
      "Beautiful. Surrender doesn't mean inaction — it means trusting the larger intelligence. You touched that today.",
    tryAgainMessage:
      "Tomorrow, find one situation you're trying to force and say: \"I release this to the larger plan.\" Then take the next right step without attachment.",
  },
];

const MANIFESTATION_STEPS: YesNoStep[] = [
  {
    title: "Daily Vision",
    description:
      "Visualizing your goal as already achieved — in vivid sensory detail — trains the subconscious to look for the path.",
    question:
      "Did you visualize your 48-day goal as already achieved today (in vivid sensory detail)?",
    successMessage:
      "Wonderful. The subconscious doesn't distinguish well between vivid imagination and reality. You're training it to find the way.",
    tryAgainMessage:
      "Tomorrow, before bed, close your eyes for 60 seconds and picture one specific moment of your goal achieved. What do you see? Hear? Feel?",
  },
  {
    title: "Written Intention",
    description:
      "Writing the goal in present tense — \"I am calm and successful\" — is dramatically more powerful than thinking it.",
    question:
      "Did you write down your goal or intention today, in present tense?",
    successMessage:
      "Beautiful. The hand engages the brain more deeply than the keyboard. Daily writing rewires the path forward.",
    tryAgainMessage:
      "Tomorrow morning, write one sentence: \"I am _____\" — your goal in present tense. One sentence. That's it.",
  },
  {
    title: "Inspired Action",
    description:
      "Manifestation without action is daydreaming. The smallest concrete step today compounds across the 48 days.",
    question:
      "Did you take at least one small action today that moves you toward your goal?",
    successMessage:
      "Excellent. Vision plus daily action is the formula. You showed up for yourself today.",
    tryAgainMessage:
      "Tomorrow, pick one tiny thing — 15 minutes of work, one phone call, one email. Done is better than perfect.",
  },
  {
    title: "Gratitude for the Future",
    description:
      "Feeling grateful for what you're creating — as if it's already real — pulls it forward more powerfully than wanting ever does.",
    question:
      "Did you feel gratitude today for what you're manifesting — as if it's already real?",
    successMessage:
      "Beautiful. Gratitude is the receiving frequency. You're already in the energy of having what you want.",
    tryAgainMessage:
      "Tomorrow, say one sentence aloud: \"Thank you for my _____\" — as if you already have it. Notice how the body feels different.",
  },
  {
    title: "Spoken Affirmation",
    description:
      "Saying your goal aloud — in present tense, with feeling — engages both voice and ear and rewires faster than silent thought.",
    question:
      "Did you speak your goal aloud today as a present-tense affirmation?",
    successMessage:
      "Wonderful. The voice plus the ear plus the body — that's a complete neural circuit. You activated it today.",
    tryAgainMessage:
      "Tomorrow, in the shower or driving alone, say aloud three times: \"I am _____\" — your goal in one sentence. Mean it.",
  },
  {
    title: "Release Attachment",
    description:
      "The paradox of manifestation: hold the vision tightly, hold the how loosely. The universe usually has a better path than yours.",
    question:
      "Did you release attachment to *how* the goal manifests — trusting the universe's timing?",
    successMessage:
      "Beautiful. The vision is yours; the path is the universe's. You held both correctly today.",
    tryAgainMessage:
      "Tomorrow, if you catch yourself forcing a particular outcome, say: \"This or something better. Show me the way.\" Then keep walking.",
  },
];

const SLEEP_STEPS: YesNoStep[] = [
  {
    title: "Wind-Down Routine",
    description:
      "The 30 minutes before bed largely determine sleep quality. Dim lights, slow activity, no work.",
    question:
      "Did you start winding down at least 30 minutes before bed (dimmer lights, no work)?",
    successMessage:
      "Wonderful. A 30-minute runway into sleep dramatically improves how fast you fall asleep and how deep you go.",
    tryAgainMessage:
      "Tomorrow night, set a phone alarm 30 minutes before your target bedtime. When it goes off, dim the lights and shift to slow activity.",
  },
  {
    title: "Screen Cutoff",
    description:
      "Blue light from screens suppresses melatonin for up to 90 minutes. Even a 30-minute cutoff helps significantly.",
    question: "Did you stop using screens at least 30 minutes before sleep?",
    successMessage:
      "Excellent. Your pineal gland thanks you. The melatonin you produced tonight is the sleep architecture of tomorrow's brilliance.",
    tryAgainMessage:
      "Tomorrow, charge your phone in another room and read a physical book or magazine for 30 minutes before bed. Try it for one week.",
  },
  {
    title: "Cool, Dark Room",
    description:
      "65-68°F (18-20°C) and as dark as possible — these are the lab-confirmed conditions for deep sleep.",
    question:
      "Did you sleep in a cool, dark room (65-68°F / 18-20°C, blackout-level dark)?",
    successMessage:
      "Beautiful. Cool and dark is the body's preferred state for deep sleep. You're sleeping in the optimal environment.",
    tryAgainMessage:
      "Tomorrow, drop your thermostat by 2-3 degrees overnight and add blackout curtains or a sleep mask. Then notice how you feel in the morning.",
  },
  {
    title: "Pre-Sleep Breath",
    description:
      "Slow breathing in bed activates the parasympathetic nervous system — the \"rest and digest\" mode that lets you fall asleep. The pacer below is 4-7-8, the classic bedtime pattern.",
    practice: {
      kind: "breathing",
      pattern: {
        inhaleSeconds: 4,
        holdSeconds: 7,
        exhaleSeconds: 8,
        rounds: 3,
      },
    },
    question: "Did you do slow breathing or a body scan in bed before sleep?",
    successMessage:
      "Wonderful. You signaled your nervous system that the day is done. Sleep onset is faster, sleep is deeper.",
    tryAgainMessage:
      "Tonight, try 4-7-8 in bed — inhale 4, hold 7, exhale 8. Three rounds. Most people are asleep before the third round.",
  },
  {
    title: "7-8 Hours",
    description:
      "Less than 7 hours, consistently, undoes most of the benefit of every other practice in this app. Sleep is not optional.",
    question: "Did you get 7-8 hours of sleep last night?",
    successMessage:
      "Excellent. Sleep is the most important supplement, the most important medicine, the most important investment. You took it.",
    tryAgainMessage:
      "Tonight, target an earlier bedtime — even 30 minutes earlier. Compound it: one week of 30 minutes extra is a full night of catch-up.",
  },
  {
    title: "Consistent Schedule",
    description:
      "Going to bed and waking up around the same time daily — even on weekends — locks in your circadian rhythm. It's worth more than the extra Saturday sleep-in.",
    question:
      "Did you go to bed and wake up around the same time as the previous day?",
    successMessage:
      "Beautiful. Consistent timing is one of the highest-ROI habits for sleep, hormones, energy, and mood.",
    tryAgainMessage:
      "Tomorrow, pick a target bedtime and a target wake time and hold them within ±30 minutes. Weekends included. One week to feel the difference.",
  },
];

export const PILLAR_REFLECTIONS_BY_SLUG: Record<string, PillarReflection> = {
  "thoughts-intention": {
    steps: THOUGHTS_STEPS,
    config: {
      headerTitle: "Today's Thoughts & Intention Reflection",
      headerSubtitle:
        "One question at a time. Honest answers — there's no wrong one.",
      summaryTitle: "Today's Thoughts & Intention Reflection",
      summaryStatLabel: "habits",
      summaryClosingNote:
        "The mind is a muscle. Every catch, every reframe, every kind word to yourself is one rep. Over weeks, the default voice changes. Mark this pillar complete to record your karma for today.",
    },
  },
  movement: {
    steps: MOVEMENT_STEPS,
    config: {
      headerTitle: "Today's Movement Reflection",
      headerSubtitle:
        "One question at a time. Honest answers — there's no wrong one.",
      summaryTitle: "Today's Movement Reflection",
      summaryStatLabel: "habits",
      summaryClosingNote:
        "The body is built for motion. Every walk, stretch, and squat is a small vote for the version of you you're building. Mark this pillar complete to record your karma for today.",
    },
  },
  "healing-meditation": {
    steps: HEALING_STEPS,
    config: {
      headerTitle: "Today's Healing Meditation Reflection",
      headerSubtitle:
        "One question at a time. Honest answers — there's no wrong one.",
      summaryTitle: "Today's Healing Meditation Reflection",
      summaryStatLabel: "practices",
      summaryClosingNote:
        "Healing isn't something you do once. It's a daily attention — to the body, to the emotions, to the forgiveness you owe yourself. Mark this pillar complete to record your karma for today.",
    },
  },
  "sandhya-meditation": {
    steps: SANDHYA_STEPS,
    config: {
      headerTitle: "Today's Sandhya Reflection",
      headerSubtitle:
        "Sandhya means \"junction\" — sunrise, noon, sunset. Three sacred transitions, three chances to align body with nature.",
      summaryTitle: "Today's Sandhya Reflection",
      summaryStatLabel: "transitions honored",
      summaryStatVerb: "honored",
      summaryClosingNote:
        "The sun doesn't move; we turn. Honoring those turns three times daily is the oldest spiritual technology on earth. Mark this pillar complete to record your karma for today.",
    },
  },
  "brahman-connection": {
    steps: BRAHMAN_STEPS,
    config: {
      headerTitle: "Today's Brahman Reflection",
      headerSubtitle:
        "Brahma Sambandha — connection to the field that holds everything. One question at a time.",
      summaryTitle: "Today's Brahman Reflection",
      summaryStatLabel: "doorways opened",
      summaryStatVerb: "opened",
      summaryClosingNote:
        "You are not in the universe — the universe is in you. Each of these practices is just remembering that. Mark this pillar complete to record your karma for today.",
    },
  },
  "divine-manifestation": {
    steps: MANIFESTATION_STEPS,
    config: {
      headerTitle: "Today's Manifestation Reflection",
      headerSubtitle:
        "Vision plus daily action plus surrender — the three legs of every manifestation that actually arrives.",
      summaryTitle: "Today's Manifestation Reflection",
      summaryStatLabel: "habits",
      summaryClosingNote:
        "Hold the vision tightly. Hold the how loosely. Take the next right step. The universe usually has a better path than you do. Mark this pillar complete to record your karma for today.",
    },
  },
  "sleep-optimization": {
    steps: SLEEP_STEPS,
    config: {
      headerTitle: "Today's Sleep Reflection",
      headerSubtitle:
        "Sleep undoes everything when it's bad and amplifies everything when it's good. One question at a time.",
      summaryTitle: "Today's Sleep Reflection",
      summaryStatLabel: "habits",
      summaryClosingNote:
        "There is no biohack, supplement, or practice that beats sleep. Protect it like the foundational asset it is. Mark this pillar complete to record your karma for today.",
    },
  },
};
