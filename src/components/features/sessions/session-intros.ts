// Intro briefings for every guided session, in one place. Each entry feeds the
// <SessionIntro> shell (why → benefits → what you'll feel → setup → tradition →
// caution). Hero `mediaSlug` reuses an existing ambient video; `light` flags the
// sessions rendered on dark/coloured backgrounds.

import type { SessionIntroContent } from "./session-intro";

export type SessionIntroKey =
  | "meditation"
  | "sandhya"
  | "breathing"
  | "movement"
  | "brahman"
  | "manifestation"
  | "morning"
  | "fasting"
  | "sleep"
  | "yoga"
  | "nidra"
  | "dinacharya"
  | "mantra";

export const SESSION_INTROS: Record<SessionIntroKey, SessionIntroContent> = {
  meditation: {
    eyebrow: "Dhyana · ध्यान",
    title: "Healing Meditation",
    why: "A few minutes of stillness lowers the body's stress response, slows the breath, and clears mental noise — leaving the mind quieter and more focused than you found it.",
    benefits: [
      "Calms the nervous system and lowers stress hormones",
      "Sharpens focus and working memory",
      "Builds equanimity — less reactivity to thoughts and moods",
      "Improves sleep quality when practiced regularly",
    ],
    feel: "a settling in the chest, a slower breath, and widening gaps of quiet between thoughts.",
    setup: [
      "Sit upright but relaxed — cushion or chair, spine tall, shoulders soft.",
      "Rest your hands on your knees or in your lap; gently close the eyes.",
      "Let the breath be natural — don't control it, just notice it.",
      "When a thought arrives, label it 'thinking' and return to the breath.",
    ],
    tradition: "Dhyana is the seventh limb of Patanjali's eightfold yoga — sustained, effortless attention that ripens into samadhi.",
    formatLabel: "5–30 min · seated",
    mediaSlug: "meditation-ambient",
    beginLabel: "Set up my session",
  },

  sandhya: {
    eyebrow: "Sandhyavandana · सन्ध्यावन्दना",
    title: "Sandhya Meditation",
    why: "The day's three junctures — dawn, noon, and dusk — are the traditional moments to pause, face the sun, and recite the Gayatri mantra 108 times on the mala.",
    benefits: [
      "Anchors the day with three steady points of return",
      "108 repetitions train sustained, rhythmic concentration",
      "The Gayatri's meaning orients the mind toward clarity and light",
      "A portable ritual — needs only your breath and attention",
    ],
    feel: "a steadying rhythm as bead follows bead, and the mind narrowing to a single repeated sound.",
    setup: [
      "Face the right direction for this juncture (East at dawn, North at noon, West at dusk).",
      "Sit with the spine tall; hold a mala in the right hand, or simply tap along.",
      "Recite the Gayatri once per bead — aloud, whispered, or silent.",
      "Keep the attention at the space between the brows.",
    ],
    tradition: "Sandhyavandana is among the oldest daily rites in the Vedic tradition; the Gayatri is Rig Veda 3.62.10.",
    formatLabel: "108 repetitions · ~10 min",
    mediaSlug: "nature-flow",
    light: true,
  },

  breathing: {
    eyebrow: "Pranayama · प्राणायाम",
    title: "Breathwork",
    why: "Conscious control of the breath is the fastest lever you have on your nervous system. A few rounds can move you from stressed to calm in minutes.",
    benefits: [
      "Activates the parasympathetic 'rest and digest' response",
      "Steadies heart rate and lowers blood pressure",
      "Clears the head and improves focus before work",
      "The 4-7-8 pattern in particular helps with falling asleep",
    ],
    feel: "a slowing pulse, a loosening in the shoulders, and a noticeably longer, smoother exhale.",
    setup: [
      "Sit comfortably with the spine upright; let the belly be soft.",
      "Breathe in through the nose; let the exhale be slow and complete.",
      "Follow the lotus and countdown — in as it opens, out as it closes.",
      "Practice at least five full cycles, then tap Finish to log your session.",
    ],
    tradition: "Pranayama is the fourth limb of Patanjali's yoga — the bridge between body and mind.",
    caution: "If you feel dizzy or light-headed, return to normal breathing. Go easy on long breath-holds if pregnant or managing a heart condition.",
    formatLabel: "3 patterns · 5+ cycles",
    mediaSlug: "breathing-ambient",
  },

  movement: {
    eyebrow: "Vyayama · व्यायाम",
    title: "Movement",
    why: "The body is the first pillar — it needs daily movement to stay strong and mobile. This interval session alternates focused effort with recovery to build strength and stamina.",
    benefits: [
      "Builds cardiovascular fitness and muscular endurance",
      "Boosts energy, mood, and metabolism for hours after",
      "Strengthens the body that sits for meditation",
      "Short and scalable — adjust work, rest, and rounds to your level",
    ],
    feel: "a rising heart rate, warmth through the muscles, and a clear-headed lift once you finish.",
    setup: [
      "Clear a little space and have water nearby.",
      "Each round shows the exercise to do, with a demo loop and a form cue — just follow along.",
      "Set work, rest, and rounds to match your fitness today.",
      "Ease into the first round, then push through each work interval.",
    ],
    tradition: "Vyayama (physical exercise) is prescribed in Ayurveda's dinacharya for strength, lightness, and clarity.",
    caution: "Move within your limits and stop if you feel pain (not the same as effort). Check with a clinician before intense exercise if you have cardiac or joint concerns.",
    formatLabel: "Interval timer · ~10–20 min",
    mediaSlug: "movement-ambient",
  },

  brahman: {
    eyebrow: "Brahma Sambandha · ब्रह्म सम्बन्ध",
    title: "Brahman Connection",
    why: "A silent expansion meditation: rest attention on awareness itself and let the sense of a separate, bounded self soften into something larger.",
    benefits: [
      "Cultivates spaciousness and a sense of connection",
      "Loosens the grip of the small, worried self",
      "Deepens the stillness built in seated meditation",
      "A wordless practice — nothing to recite or count",
    ],
    feel: "edges dissolving, the breath almost disappearing, and a quiet sense of resting in open awareness.",
    setup: [
      "Sit or lie comfortably where you won't be disturbed.",
      "Close the eyes and let the body grow still and heavy.",
      "Release control of body, breath, and thought in turn.",
      "Simply be aware of being aware — let the rings guide the expansion.",
    ],
    tradition: "Brahma Sambandha — 'connection to Brahman', the infinite ground of being described in the Upanishads.",
    formatLabel: "5 min · seated or lying",
    mediaSlug: "starry-night",
    light: true,
  },

  manifestation: {
    eyebrow: "Sankalpa Shakti · सङ्कल्प शक्ति",
    title: "Divine Manifestation",
    why: "A sankalpa is a clear, heartfelt intention. Naming it, picturing it as already true, and then releasing it trains the mind to notice and move toward what you want.",
    benefits: [
      "Clarifies what you actually want in one clean sentence",
      "Primes attention to spot opportunities aligned with it",
      "Builds resolve and a sense of agency",
      "Pairs reflection with a recorded intention you can revisit",
    ],
    feel: "a focusing of desire into words, then a calm, almost-certain sense as you picture it fulfilled.",
    setup: [
      "Write your intention in one present-tense sentence, as if already true.",
      "Make it positive and specific — 'I am…', not 'I will stop…'.",
      "During visualization, see and feel it as real, not as a distant wish.",
      "When you seal it, let go of needing to control how it arrives.",
    ],
    tradition: "Sankalpa Shakti — 'the power of intention' — is central to yoga nidra and Vedic ritual.",
    formatLabel: "Write · visualize 60s · seal",
    mediaSlug: "candle-flame",
  },

  morning: {
    eyebrow: "Dinacharya · दिनचर्या",
    title: "Morning Routine",
    why: "How you start the day sets its tone. This guided routine moves you through waking, hydrating, breathing, awareness, gratitude, and intention — the Vedic dinacharya in a few minutes.",
    benefits: [
      "Replaces a groggy, reactive start with a calm, deliberate one",
      "Hydration and breath wake the body gently",
      "Gratitude and intention prime mood and focus for the day",
      "Builds a repeatable anchor habit that compounds over time",
    ],
    feel: "a gradual brightening — body waking, mind clearing, and a settled readiness for the day.",
    setup: [
      "Do this soon after waking, ideally before screens.",
      "Have a glass of water within reach.",
      "Move through each step at your own pace — there's no rush.",
      "Be honest in the gratitude and intention steps; that's where it works.",
    ],
    tradition: "Dinacharya is Ayurveda's daily routine; the pre-dawn window is Brahma Muhurta, prized for clarity.",
    formatLabel: "6 steps · ~15 min",
    mediaSlug: "morning-ambient",
    beginLabel: "Begin the routine",
  },

  fasting: {
    eyebrow: "Upavasa · उपवास",
    title: "Intermittent Fasting",
    why: "Time-restricted eating gives the digestive system a daily rest, which supports metabolic health and mental clarity. This timer tracks your eating and fasting windows.",
    benefits: [
      "Rests digestion and may improve insulin sensitivity",
      "Supports cellular repair (autophagy) during the fast",
      "Often steadies energy and sharpens focus",
      "Simple structure — choose the ratio that fits your life",
    ],
    feel: "after the adjustment period, a lighter, clearer feeling and steadier energy through the fasting window.",
    setup: [
      "Pick a ratio (e.g. 16:8) and a window that suits your schedule.",
      "Drink water, plain tea, or black coffee during the fast.",
      "Break the fast gently with something light.",
      "Start the timer when your eating or fasting window begins.",
    ],
    tradition: "Upavasa — fasting — is woven through Vedic and Ayurvedic practice for purification of body and mind.",
    caution: "Not suitable if pregnant, breastfeeding, underweight, or with a history of disordered eating or diabetes — check with a clinician first.",
    formatLabel: "Configurable window · e.g. 16:8",
    mediaSlug: "nature-flow",
  },

  sleep: {
    eyebrow: "Ratricharya · रात्रिचर्या",
    title: "Sleep Ritual",
    why: "Good sleep is built before you lie down. This wind-down ritual dims stimulation and walks you through the steps that prepare body and mind for deep rest.",
    benefits: [
      "Signals the body that it's time to power down",
      "Reduces late-night screen and stimulation load",
      "A consistent ritual trains faster, deeper sleep",
      "Sets your wake intention for tomorrow",
    ],
    feel: "a gradual settling — thoughts slowing, eyes growing heavy, the body sinking toward rest.",
    setup: [
      "Dim the lights and put screens away for the night.",
      "Make the room cool, dark, and quiet.",
      "Move through the checklist as you actually do each step.",
      "Set tonight's bed and wake times before you lie down.",
    ],
    tradition: "Ayurveda treats the night routine (ratricharya) as the mirror of the morning one — essential for ojas, vitality.",
    formatLabel: "Wind-down checklist",
    mediaSlug: "starry-night",
    light: true,
  },

  yoga: {
    eyebrow: "Asana · आसन",
    title: "Yoga Flow",
    why: "A gentle sequence of postures that stretches and strengthens the whole body, syncs movement with breath, and prepares you to sit comfortably for meditation.",
    benefits: [
      "Improves flexibility, balance, and posture",
      "Releases tension held in the hips, back, and shoulders",
      "Links breath and movement to calm the mind",
      "Strengthens the body gently, without impact",
    ],
    feel: "muscles lengthening, the breath deepening, and a warm, open ease through the spine.",
    setup: [
      "Use a mat or non-slip surface with a little space around you.",
      "Move slowly and breathe through the nose; never force a stretch.",
      "Hold each pose for the timer, following the demo and the cue.",
      "Ease off any pose that causes sharp pain — discomfort is fine, pain is not.",
    ],
    tradition: "Asana is the third limb of Patanjali's yoga — 'a steady, comfortable seat' that readies body and mind.",
    caution: "Move within your range. Skip or modify poses if pregnant or injured; ask a teacher or clinician if unsure.",
    formatLabel: "8 poses · ~5 min",
    mediaSlug: "yoga-downward-dog",
    beginLabel: "Begin the flow",
  },

  nidra: {
    eyebrow: "Yoga Nidra · योग निद्रा",
    title: "Yoga Nidra",
    why: "A guided 'yogic sleep' — you lie down and follow a slow body scan into deep relaxation. A single session is said to rest the body as much as hours of sleep.",
    benefits: [
      "Deeply relaxes the nervous system",
      "Relieves stress, fatigue, and tension",
      "Can improve sleep and emotional balance",
      "Takes no effort — you simply rest and follow",
    ],
    feel: "the body growing heavy and still, the mind drifting to the edge of sleep while staying gently aware.",
    setup: [
      "Lie flat on your back, arms a little away from the body, palms up.",
      "Cover yourself if you might get cold — the body cools as it relaxes.",
      "Let the eyes close and the whole body be supported.",
      "Follow the moving attention through the body — don't try, just notice.",
    ],
    tradition: "Yoga Nidra descends from the tantric practice of nyasa; it was systematised by Swami Satyananda Saraswati.",
    formatLabel: "~11 min · lying down",
    mediaSlug: "starry-night",
    light: true,
    beginLabel: "Begin the rest",
  },

  dinacharya: {
    eyebrow: "Dinacharya · दिनचर्या",
    title: "Ayurvedic Morning",
    why: "The classic Ayurvedic cleansing routine done on waking — scraping, rinsing, and oiling — to clear the night's build-up and start the day light and clear.",
    benefits: [
      "Clears the toxins (ama) that gather overnight",
      "Freshens the mouth, senses, and digestion",
      "Wakes the body gently and steadily",
      "A grounding sequence that sets a healthy daily rhythm",
    ],
    feel: "a clean, awake lightness in the mouth and body, and a calm readiness for the day.",
    setup: [
      "Do this first thing, before eating (water is fine).",
      "Have a tongue scraper, oil, and warm water ready.",
      "Work through each step and check it off as you go.",
      "Go gently — these are daily habits, not a deep cleanse.",
    ],
    tradition: "Dinacharya is Ayurveda's prescribed daily routine for preserving health and balancing the doshas.",
    formatLabel: "Morning checklist",
    mediaSlug: "morning-ambient",
  },

  mantra: {
    eyebrow: "Japa · जप",
    title: "Mantra Library",
    why: "Choose a sacred sound and repeat it — aloud, whispered, or silently. Mantra japa steadies the mind on a single vibration and is one of the simplest, deepest practices.",
    benefits: [
      "Focuses a scattered mind on one steady sound",
      "Calms the nervous system through rhythmic repetition",
      "Each mantra carries a specific intention and feeling",
      "Portable — practise anywhere, with or without a mala",
    ],
    feel: "the sound settling into a rhythm, and the gaps between repetitions growing quiet.",
    setup: [
      "Choose a mantra below and read its meaning.",
      "Sit tall; rest the eyes closed or softly lowered.",
      "Repeat the mantra, tapping once per repetition.",
      "A traditional round is 108 — but any number with attention counts.",
    ],
    tradition: "Japa — repetition of a mantra — runs through every school of Indian spirituality, from Vedic chant to bhakti.",
    formatLabel: "Choose a mantra · tap to count",
    mediaSlug: "candle-flame",
  },
};
