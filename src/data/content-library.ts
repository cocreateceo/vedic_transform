export interface ContentItem {
  id: string;
  title: string;
  type: "video" | "audio" | "article" | "guide";
  pillarSlug: string;
  category: "body" | "mind" | "spirit";
  duration: string;
  url: string;
  audioUrl?: string; // For in-app audio playback
  thumbnail?: string;
  description: string;
}

export const CONTENT_LIBRARY: ContentItem[] = [
  {
    id: "content-morning-routine",
    title: "Designing Your Sacred Morning Routine",
    type: "video",
    pillarSlug: "morning-initiation",
    category: "body",
    duration: "12 min",
    url: "https://www.youtube.com/@vedic-s",
    description:
      "Learn how to craft a morning routine rooted in Vedic principles. This guide walks you through waking with intention, cleansing rituals, and setting the tone for a productive, mindful day. Discover why the Brahma Muhurta — the hour before sunrise — is considered the most powerful time for personal practice.",
  },
  {
    id: "content-vedic-nutrition",
    title: "Introduction to Sattvic Eating",
    type: "video",
    pillarSlug: "nutrition-fasting",
    category: "body",
    duration: "18 min",
    url: "https://www.youtube.com/@vedic-s",
    description:
      "Explore the Ayurvedic framework of Sattvic, Rajasic, and Tamasic foods. Understand how your diet directly influences your mental clarity, emotional balance, and spiritual receptivity. Includes practical meal guidelines and a simple Sattvic recipe to get started.",
  },
  {
    id: "content-thought-reset",
    title: "Mastering the Thought Reset Technique",
    type: "article",
    pillarSlug: "thoughts-intention",
    category: "mind",
    duration: "8 min read",
    url: "/library/article/thought-reset-technique",
    description:
      "Negative thought loops are one of the biggest barriers to transformation. This article teaches you the Vedic-inspired thought reset method — a practical technique for observing, interrupting, and redirecting unhelpful mental patterns using awareness and breath.",
  },
  {
    id: "content-breathing-meditation",
    title: "Pranayama Fundamentals: Breath as Medicine",
    type: "video",
    pillarSlug: "breathing-meditation",
    category: "mind",
    duration: "22 min",
    url: "https://www.youtube.com/@vedic-s",
    description:
      "A comprehensive introduction to Pranayama — the Vedic science of breath control. Learn Nadi Shodhana (alternate nostril breathing), Kapalabhati (skull-shining breath), and Bhramari (humming bee breath). Each technique is demonstrated with proper form and timing for beginners.",
  },
  {
    id: "content-movement",
    title: "Vedic Movement: Beyond Modern Exercise",
    type: "video",
    pillarSlug: "movement",
    category: "body",
    duration: "15 min",
    url: "https://www.youtube.com/@vedic-s",
    description:
      "Discover how traditional Vedic movement practices — including Surya Namaskar (sun salutations) and mindful walking — differ from conventional exercise. This session emphasizes the union of breath, awareness, and physical motion for holistic vitality.",
  },
  {
    id: "content-healing-meditation",
    title: "Guided Healing Meditation for Emotional Release",
    type: "audio",
    pillarSlug: "healing-meditation",
    category: "mind",
    duration: "20 min",
    url: "https://www.youtube.com/@vedic-s",
    audioUrl: "generated",
    description:
      "A gentle guided meditation designed to help you release stored emotional tension. Drawing from Yoga Nidra and Vedantic visualization practices, this session guides you through body scanning, emotional acknowledgment, and compassionate letting go.",
  },
  {
    id: "content-sandhya-meditation",
    title: "Sandhya Vandana: The Twilight Meditation Practice",
    type: "video",
    pillarSlug: "sandhya-meditation",
    category: "spirit",
    duration: "16 min",
    url: "https://www.youtube.com/@vedic-s",
    description:
      "Sandhya Vandana is the ancient practice of meditating at the junction points of the day — dawn, noon, and dusk. Learn why these transitional moments hold special spiritual significance and how to perform a simplified modern version of this timeless ritual.",
  },
  {
    id: "content-gratitude",
    title: "The Neuroscience and Vedic Roots of Gratitude",
    type: "article",
    pillarSlug: "gratitude",
    category: "mind",
    duration: "10 min read",
    url: "/library/article/gratitude-neuroscience-vedic",
    description:
      "Gratitude is both an ancient Vedic virtue and a scientifically validated practice for well-being. This article explores how regular gratitude practice rewires neural pathways, reduces cortisol, and aligns with the Vedic principle of Santosha (contentment).",
  },
  {
    id: "content-brahman-connection",
    title: "Understanding Brahman: The Universal Consciousness",
    type: "guide",
    pillarSlug: "brahman-connection",
    category: "spirit",
    duration: "14 min read",
    url: "/library/article/understanding-brahman",
    description:
      "An accessible introduction to the Vedantic concept of Brahman — the infinite, unchanging reality that underlies all existence. Learn how connecting with this universal consciousness through meditation and contemplation can bring profound peace and purpose to daily life.",
  },
  {
    id: "content-manifestation",
    title: "Sankalpa: The Vedic Science of Manifestation",
    type: "video",
    pillarSlug: "divine-manifestation",
    category: "spirit",
    duration: "13 min",
    url: "https://www.youtube.com/@vedic-s",
    description:
      "Sankalpa is the practice of setting a heartfelt intention aligned with your highest truth. Unlike modern goal-setting, Sankalpa works at the level of identity and consciousness. Learn how to formulate, plant, and nurture your Sankalpa through the 48-day Mandala journey.",
  },
  {
    id: "content-sleep-optimization",
    title: "Vedic Sleep Rituals for Deep Restoration",
    type: "video",
    pillarSlug: "sleep-optimization",
    category: "body",
    duration: "11 min",
    url: "https://www.youtube.com/@vedic-s",
    description:
      "Quality sleep is the foundation of transformation. This session covers Ayurvedic sleep hygiene — including optimal sleep timing, evening wind-down rituals, herbal recommendations, and a short Yoga Nidra practice to help you transition into deep, restorative rest.",
  },

  // ── Library Shorts (60-second pillar teachings) ─────────────────
  // Each short is a 60-second standalone teaching that also functions as
  // a trailer for the long-form video on the same pillar. Source briefs
  // in docs/MASTER_VIDEO_PLAN.md (Part A). Brahma Muhurta uses the v2 cut
  // (FvreaYh00Sg); v1 alternate (ujr4R9TMP2c) is available as a backup.

  {
    id: "short-brahma-muhurta",
    title: "Brahma Muhurta: The 96-Minute Window",
    type: "video",
    pillarSlug: "morning-initiation",
    category: "body",
    duration: "1 min",
    url: "https://youtu.be/FvreaYh00Sg",
    thumbnail: "https://img.youtube.com/vi/FvreaYh00Sg/maxresdefault.jpg",
    description:
      "The 96-minute pre-sunrise window ancient Ayurveda calls the most powerful hour. Why all three doshas balance here, what modern chronobiology says about morning cortisol, and the simplest 5 AM start: wake, warm water, three breaths.",
  },
  {
    id: "short-bhramari",
    title: "Bhramari: The 60-Second Anxiety Cure",
    type: "video",
    pillarSlug: "breathing-meditation",
    category: "mind",
    duration: "1 min",
    url: "https://youtu.be/HR0HwIixHDY",
    thumbnail: "https://img.youtube.com/vi/HR0HwIixHDY/maxresdefault.jpg",
    description:
      "The humming bee pranayama — an ancient anti-anxiety technique that works in under sixty seconds. Hand position, breath, and the vagus-nerve mechanism that quiets the mind almost immediately.",
  },
  {
    id: "short-sankalpa",
    title: "Sankalpa: Why Most Manifestation Advice Is Wrong",
    type: "video",
    pillarSlug: "divine-manifestation",
    category: "spirit",
    duration: "1 min",
    url: "https://youtu.be/P84Ib24a3Ng",
    thumbnail: "https://img.youtube.com/vi/P84Ib24a3Ng/maxresdefault.jpg",
    description:
      "The Vedic science of intention. Three rules a real Sankalpa must follow — present tense, affirmative, identity-based — and why manifestation that targets objects instead of identity reliably fails.",
  },
  {
    id: "short-sattvic-eating",
    title: "Sattvic Eating in 60 Seconds",
    type: "video",
    pillarSlug: "nutrition-fasting",
    category: "body",
    duration: "1 min",
    url: "https://youtu.be/RRxkLdgDegM",
    thumbnail: "https://img.youtube.com/vi/RRxkLdgDegM/maxresdefault.jpg",
    description:
      "The Ayurvedic three-guna food framework — Sattvic (clarity), Rajasic (stimulating), Tamasic (dulling). The 60-30-10 transition rule and the simplest principle of all: largest meal at noon when Agni is strongest.",
  },
  {
    id: "short-surya-namaskar",
    title: "Surya Namaskar: The Complete Morning Practice",
    type: "video",
    pillarSlug: "movement",
    category: "body",
    duration: "1 min",
    url: "https://youtu.be/qFhxKp9XfVY",
    thumbnail: "https://img.youtube.com/vi/qFhxKp9XfVY/maxresdefault.jpg",
    description:
      "Twelve poses, one breath cycle, the complete Vedic sun salutation. Why Ayurveda prescribes exercise to half capacity (ardha-shakti) and the smallest viable version you can start tomorrow morning.",
  },
  {
    id: "short-kritajnata",
    title: "Kritajnata: The Vedic Word for Gratitude",
    type: "video",
    pillarSlug: "gratitude",
    category: "mind",
    duration: "1 min",
    url: "https://youtu.be/NkpWu1H904Q",
    thumbnail: "https://img.youtube.com/vi/NkpWu1H904Q/maxresdefault.jpg",
    description:
      "Gratitude in Sanskrit means 'knowing what has been done for you' — a noticing word, not a thanking word. The Taittiriya Upanishad teaching plus the fMRI data on what 8 weeks of journaling does to the medial prefrontal cortex.",
  },
  {
    id: "short-sandhya",
    title: "Sandhya Vandana: The Twilight Practice",
    type: "video",
    pillarSlug: "sandhya-meditation",
    category: "spirit",
    duration: "1 min",
    url: "https://youtu.be/sJ5BzJawHr4",
    thumbnail: "https://img.youtube.com/vi/sJ5BzJawHr4/maxresdefault.jpg",
    description:
      "The Rig Veda's oldest practice happens three times daily — dawn, noon, dusk — the junctures the Rishis called Sandhi. The 2-minute simplified version: face east, three breaths, three Gayatris, sit thirty seconds.",
  },
  {
    id: "short-yoga-nidra",
    title: "Yoga Nidra: Yogic Sleep",
    type: "video",
    pillarSlug: "sleep-optimization",
    category: "body",
    duration: "1 min",
    url: "https://youtu.be/jzbePUfDQ1o",
    thumbnail: "https://img.youtube.com/vi/jzbePUfDQ1o/maxresdefault.jpg",
    description:
      "The tradition holds that one hour of Yoga Nidra equals four hours of regular sleep. Why the practice works at the theta-delta boundary, and how to use it tonight from bed in under ten minutes.",
  },
  {
    id: "short-tat-tvam-asi",
    title: "Tat Tvam Asi: That Thou Art",
    type: "video",
    pillarSlug: "brahman-connection",
    category: "spirit",
    duration: "1 min",
    url: "https://youtu.be/29OKHUGj7dw",
    thumbnail: "https://img.youtube.com/vi/29OKHUGj7dw/maxresdefault.jpg",
    description:
      "The most ambitious sentence in Vedic literature is three words long. From the Chandogya Upanishad — what you are looking for, you already are. Not a belief; an invitation to investigate.",
  },
  {
    id: "short-mahamrityunjaya",
    title: "Mahamrityunjaya: The Great Healing Mantra",
    type: "video",
    pillarSlug: "healing-meditation",
    category: "spirit",
    duration: "1 min",
    url: "https://youtu.be/MtfAgxcgveM",
    thumbnail: "https://img.youtube.com/vi/MtfAgxcgveM/maxresdefault.jpg",
    description:
      "The most powerful healing mantra in the Vedic canon, from the Rig Veda. The meaning of 'as a ripe cucumber falls from its vine' and how the practice has been used for physical healing and protection for three millennia.",
  },
  {
    id: "short-vrittis",
    title: "Vrittis: The Fluctuations of the Mind",
    type: "video",
    pillarSlug: "thoughts-intention",
    category: "mind",
    duration: "1 min",
    url: "https://youtu.be/T4qK3HKwc7g",
    thumbnail: "https://img.youtube.com/vi/T4qK3HKwc7g/maxresdefault.jpg",
    description:
      "The Yoga Sutras open with one definition: yoga is the cessation of the fluctuations of the mind. The four-step thought reset — notice, name, release, replace with a Sankalpa — applied to the worry loops you already know.",
  },

  // ── In-App Audio Meditations ────────────────────────────────────

  {
    id: "audio-om-chanting",
    title: "Om Chanting Meditation",
    type: "audio",
    pillarSlug: "breathing-meditation",
    category: "spirit",
    duration: "10 min",
    url: "#",
    audioUrl: "/audio/om-chanting.mp3",
    description:
      "Sacred Om chanting meditation to align your energy centers. The primordial sound of Om resonates with the frequency of the universe, calming the nervous system and deepening your connection to universal consciousness.",
  },
  {
    id: "audio-morning-mantra",
    title: "Morning Mantra & Intention Setting",
    type: "audio",
    pillarSlug: "morning-initiation",
    category: "body",
    duration: "8 min",
    url: "#",
    audioUrl: "generated",
    description:
      "Start your day with powerful Vedic mantras and guided intention setting. This short audio practice combines the Gayatri Mantra with a visualization exercise to set your daily Sankalpa.",
  },
  {
    id: "audio-pranayama-guided",
    title: "Guided Pranayama: Nadi Shodhana",
    type: "audio",
    pillarSlug: "breathing-meditation",
    category: "mind",
    duration: "15 min",
    url: "#",
    audioUrl: "generated",
    description:
      "Follow along with this guided alternate nostril breathing (Nadi Shodhana) session. Perfect for balancing the left and right hemispheres of the brain, reducing anxiety, and preparing for deeper meditation.",
  },
  {
    id: "audio-yoga-nidra",
    title: "Yoga Nidra: Yogic Sleep for Deep Rest",
    type: "audio",
    pillarSlug: "sleep-optimization",
    category: "body",
    duration: "25 min",
    url: "#",
    audioUrl: "generated",
    description:
      "A complete Yoga Nidra (yogic sleep) session that guides you through progressive relaxation, body scanning, and visualization. One hour of Yoga Nidra is said to equal 4 hours of regular sleep.",
  },
  {
    id: "audio-gratitude-meditation",
    title: "Gratitude & Heart Opening Meditation",
    type: "audio",
    pillarSlug: "gratitude",
    category: "mind",
    duration: "12 min",
    url: "#",
    audioUrl: "generated",
    description:
      "A gentle heart-centered meditation that cultivates deep gratitude. Using Vedic visualization of the heart chakra (Anahata), this practice opens you to appreciation, love, and contentment.",
  },
  {
    id: "audio-sandhya-evening",
    title: "Evening Sandhya: Twilight Meditation",
    type: "audio",
    pillarSlug: "sandhya-meditation",
    category: "spirit",
    duration: "10 min",
    url: "#",
    audioUrl: "generated",
    description:
      "A calming evening meditation performed at the sacred twilight hour. This practice helps you release the day, process experiences, and prepare your consciousness for restful sleep.",
  },
  {
    id: "audio-chakra-healing",
    title: "7 Chakra Healing Sound Bath",
    type: "audio",
    pillarSlug: "healing-meditation",
    category: "spirit",
    duration: "20 min",
    url: "#",
    audioUrl: "generated",
    description:
      "An immersive sound healing experience using frequencies aligned to each of the 7 chakras. Tibetan singing bowls, crystal bowls, and binaural beats guide energy through your subtle body for deep healing.",
  },
  {
    id: "audio-manifestation-visualization",
    title: "Sankalpa: Guided Manifestation",
    type: "audio",
    pillarSlug: "divine-manifestation",
    category: "spirit",
    duration: "15 min",
    url: "#",
    audioUrl: "generated",
    description:
      "A powerful guided visualization for manifesting your deepest intentions. Using the Vedic practice of Sankalpa combined with modern visualization techniques, this session helps you plant seeds of transformation in your subconscious.",
  },

  // ── Mantra Library ──────────────────────────────────────────────

  {
    id: "mantra-gayatri",
    title: "Gayatri Mantra — Oṁ Bhūr Bhuvaḥ Svaḥ",
    type: "audio",
    pillarSlug: "breathing-meditation",
    category: "spirit",
    duration: "11 min",
    url: "#",
    audioUrl: "/audio/gayatri-mantra.mp3",
    description:
      "The most sacred mantra in the Vedic tradition, the Gayatri Mantra is a universal prayer for illumination from the Rig Veda (3.62.10). Chanting 'Oṁ Bhūr Bhuvaḥ Svaḥ, Tat Savitur Vareṇyaṁ, Bhargo Devasya Dhīmahi, Dhiyo Yo Naḥ Pracodayāt' invokes the divine light of the Sun to awaken and guide the intellect. Traditionally chanted 108 times at sunrise.",
  },
  {
    id: "mantra-om-namah-shivaya",
    title: "Om Namah Shivaya — The Five-Syllable Mantra",
    type: "audio",
    pillarSlug: "sandhya-meditation",
    category: "spirit",
    duration: "10 min",
    url: "#",
    audioUrl: "/audio/om-namah-shivaya.mp3",
    description:
      "One of the most powerful mantras in Shaivism, Om Namah Shivaya ('I bow to Shiva') honors the transformative aspect of the divine. Each syllable — Na, Ma, Shi, Va, Ya — corresponds to one of the five elements: earth, water, fire, air, and ether. This chant dissolves the ego and reveals the inner Self.",
  },
  {
    id: "mantra-om-mani-padme-hum",
    title: "Om Mani Padme Hum — The Jewel in the Lotus",
    type: "audio",
    pillarSlug: "gratitude",
    category: "spirit",
    duration: "10 min",
    url: "#",
    audioUrl: "/audio/om-mani-padme-hum.mp3",
    description:
      "The six-syllable mantra of Avalokiteshvara, the bodhisattva of compassion. Each syllable purifies a different realm of suffering and cultivates generosity, ethics, patience, diligence, concentration, and wisdom. Chanting this mantra opens the heart to boundless compassion for all sentient beings.",
  },
  {
    id: "mantra-mahamrityunjaya",
    title: "Mahamrityunjaya Mantra — The Great Death-Conquering Mantra",
    type: "audio",
    pillarSlug: "healing-meditation",
    category: "spirit",
    duration: "12 min",
    url: "#",
    audioUrl: "/audio/mahamrityunjaya.mp3",
    description:
      "From the Rig Veda (7.59.12), the Mahamrityunjaya Mantra is the most potent healing mantra in the Vedic canon. Addressed to Lord Tryambaka (Shiva), it beseeches liberation from death and disease: 'Oṁ Tryambakaṁ Yajāmahe, Sugandhiṁ Puṣṭivardhanam, Urvārukamiva Bandhanān, Mṛtyor Mukṣīya Māmṛtāt.' Used for physical healing, protection, and spiritual liberation.",
  },
  {
    id: "mantra-shanti",
    title: "Shanti Mantra — Oṁ Shāntiḥ Shāntiḥ Shāntiḥ",
    type: "audio",
    pillarSlug: "thoughts-intention",
    category: "mind",
    duration: "8 min",
    url: "#",
    audioUrl: "/audio/shanti-mantra.mp3",
    description:
      "The peace invocation chanted at the beginning and end of Vedic teachings. The three repetitions of Shāntiḥ address the three sources of suffering: Ādhibhautika (physical), Ādhidaivika (divine/natural), and Ādhyātmika (spiritual/internal). This mantra calms the mind, stills the emotions, and brings deep peace to the entire being.",
  },
  {
    id: "mantra-guru",
    title: "Guru Mantra — Gurur Brahmā Gurur Viṣṇuḥ",
    type: "audio",
    pillarSlug: "gratitude",
    category: "spirit",
    duration: "9 min",
    url: "#",
    audioUrl: "/audio/guru-mantra.mp3",
    description:
      "The Guru Stotram honors the teacher as the embodied form of the divine trinity: 'Gurur Brahmā Gurur Viṣṇuḥ Gurur Devo Maheśvaraḥ, Gurur Sākṣāt Paraṁ Brahma Tasmai Śrī Gurave Namaḥ.' In the Vedic tradition, the Guru dispels the darkness of ignorance (gu = darkness, ru = remover). Chanting cultivates humility, devotion, and gratitude.",
  },
  {
    id: "mantra-lakshmi",
    title: "Lakshmi Mantra — Oṁ Śrīṁ Mahālakṣmyai Namaḥ",
    type: "audio",
    pillarSlug: "divine-manifestation",
    category: "spirit",
    duration: "10 min",
    url: "#",
    audioUrl: "/audio/lakshmi-mantra.mp3",
    description:
      "The bija (seed) mantra of Goddess Lakshmi, the divine embodiment of abundance, prosperity, and grace. 'Śrīṁ' is the seed sound of Lakshmi energy. Regular chanting removes financial obstacles, attracts material and spiritual prosperity, and cultivates the inner richness of contentment. Traditionally chanted on Fridays and during Diwali.",
  },
  {
    id: "mantra-saraswati",
    title: "Saraswati Mantra — Oṁ Aiṁ Saraswatyai Namaḥ",
    type: "audio",
    pillarSlug: "thoughts-intention",
    category: "mind",
    duration: "10 min",
    url: "#",
    audioUrl: "/audio/saraswati-mantra.mp3",
    description:
      "The mantra of Goddess Saraswati, the divine patron of wisdom, knowledge, music, and the arts. 'Aiṁ' is the bija (seed) syllable that activates the faculty of higher learning. Chanting sharpens the intellect, enhances memory and concentration, removes creative blocks, and awakens the flow of inspired knowledge.",
  },
  {
    id: "mantra-hanuman-chalisa",
    title: "Hanuman Chalisa Excerpt — Jai Hanuman Gyan Gun Sagar",
    type: "audio",
    pillarSlug: "movement",
    category: "body",
    duration: "11 min",
    url: "#",
    audioUrl: "/audio/hanuman-chalisa.mp3",
    description:
      "The opening doha of the 40-verse Hanuman Chalisa, composed by Tulsidas in Awadhi: 'Śrī Guru caraṇa saroja raja, nija mana mukuru sudhāri, baranauṁ Raghubara bimala jasu, jo dāyaku phala chāri' — After cleansing the mirror of my mind with the pollen-dust of the Guru's lotus feet, I profess the pure glory of Sri Raghuvar, which bestows the fourfold fruits of life: dharma, artha, kāma, and mokṣa. The chalisa then invokes Hanuman as the ocean of wisdom and the embodiment of supreme devotion (bhakti), selfless service (seva), and indomitable courage. Traditionally chanted to overcome fear, obstacles, and negative energies — and to build physical and mental fortitude.",
  },
  {
    id: "mantra-pavamana",
    title: "Pavamana Mantra — Asato Mā Sad Gamaya (Truth & Light)",
    type: "audio",
    pillarSlug: "brahman-connection",
    category: "spirit",
    duration: "9 min",
    url: "#",
    audioUrl: "/audio/library/mantra-pavamana.mp3",
    description:
      "From the Bṛhadāraṇyaka Upaniṣad (1.3.28), the Pavamana Mantra is a prayer for ultimate truth: 'Asato mā sadgamaya, tamaso mā jyotirgamaya, mṛtyor mā amṛtaṁ gamaya' — Lead me from the unreal to the real, from darkness to light, from death to immortality. One of the most profound expressions of the spiritual aspiration in all of Vedic literature.",
  },
  {
    id: "mantra-asato-ma",
    title: "Asato Ma Sadgamaya — Lead Me from Darkness to Light",
    type: "audio",
    pillarSlug: "sandhya-meditation",
    category: "spirit",
    duration: "10 min",
    url: "#",
    audioUrl: "/audio/asato-ma.mp3",
    description:
      "An extended chanting meditation on the three lines of the Asato Ma prayer. Each line is a complete spiritual journey: from unreality to reality (the path of knowledge), from darkness to light (the path of awakening), and from death to immortality (the path of liberation). This session guides you through slow, contemplative repetitions with pauses for inner reflection.",
  },
  {
    id: "mantra-purnamadah",
    title: "Om Purnamadah Purnamidam — The Wholeness Mantra",
    type: "audio",
    pillarSlug: "brahman-connection",
    category: "spirit",
    duration: "9 min",
    url: "#",
    audioUrl: "/audio/library/mantra-purnamadah.mp3",
    description:
      "The Shanti Mantra from the Isha Upanishad: 'Oṁ Pūrṇamadaḥ Pūrṇamidaṁ Pūrṇāt Pūrṇamudacyate, Pūrṇasya Pūrṇamādāya Pūrṇamevāvaśiṣyate' — That is whole, this is whole; from wholeness comes wholeness. When wholeness is taken from wholeness, wholeness alone remains. A profound meditation on the infinite, non-dual nature of Brahman.",
  },
  {
    id: "content-morning-routine-5-step",
    title: "The 5-Step Sankalpa Morning Routine",
    type: "article",
    pillarSlug: "morning-initiation",
    category: "body",
    duration: "8 min read",
    url: "/library/article/the-5-step-sankalpa-morning-routine",
    description:
      "Five Vedic steps — early waking, breath, awareness, gratitude, and visualization — that turn the first 15 minutes of the day into the engine of transformation.",
  },
  {
    id: "content-morning-sandhya-meditation",
    title: "Sandhya: The Vedic Practice of Sacred Threshold",
    type: "article",
    pillarSlug: "sandhya-meditation",
    category: "spirit",
    duration: "9 min read",
    url: "/library/article/sandhya-vedic-practice-of-sacred-threshold",
    description:
      "Sandhya means 'junction' — the meeting point where night becomes day. A practical guide to the seven-step morning sandhya the Rishis used for three thousand years.",
  },
  {
    id: "content-path-of-manifestation",
    title: "The Six-Step Patanjali Path to Manifestation",
    type: "article",
    pillarSlug: "divine-manifestation",
    category: "spirit",
    duration: "9 min read",
    url: "/library/article/six-step-path-to-manifestation",
    description:
      "Manifestation in the Vedic tradition is not magic — it is a sequence. Intention, belief, alignment, action, surrender, and gratitude, each rooted in a specific sutra.",
  },
  {
    id: "content-manifestation-secrets-patanjali",
    title: "Eight Secrets of Manifestation from the Yoga Sutras",
    type: "article",
    pillarSlug: "divine-manifestation",
    category: "spirit",
    duration: "10 min read",
    url: "/library/article/eight-secrets-of-manifestation-yoga-sutras",
    description:
      "Eight Patanjali principles — from chitta vritti nirodha to faith — that explain why some manifestation practices produce real change and most produce nothing at all.",
  },
  {
    id: "content-step-by-step-healing",
    title: "Step-by-Step Healing: A Vedic Self-Therapy",
    type: "article",
    pillarSlug: "healing-meditation",
    category: "mind",
    duration: "10 min read",
    url: "/library/article/step-by-step-vedic-self-therapy",
    description:
      "Nine sequenced steps — from quieting the mind to surrender — that the Vedic tradition prescribes for healing the body through the mind, supported by modern psychoneuroimmunology.",
  },
  {
    id: "content-ayurvedic-nutrition-fasting",
    title: "Eating With the Sun: Ayurvedic Nutrition and Intermittent Fasting",
    type: "article",
    pillarSlug: "nutrition-fasting",
    category: "body",
    duration: "9 min read",
    url: "/library/article/eating-with-the-sun-ayurveda-intermittent-fasting",
    description:
      "The Vedic tradition discovered intermittent fasting three thousand years before it became fashionable. Five practical principles for eating in rhythm with the digestive fire.",
  },
  {
    id: "content-vata-balancing-yoga",
    title: "Vata Balancing Yoga: Grounding the Wind Within",
    type: "article",
    pillarSlug: "movement",
    category: "body",
    duration: "9 min read",
    url: "/library/article/vata-balancing-yoga-grounding-the-wind",
    description:
      "Vata is the dosha of air and space — light, mobile, creative, and prone to anxiety when imbalanced. Ten asanas and a daily rhythm to ground the wind within.",
  },
  {
    id: "content-pitta-balancing-yoga",
    title: "Pitta Balancing Yoga: Cooling the Inner Fire",
    type: "article",
    pillarSlug: "movement",
    category: "body",
    duration: "9 min read",
    url: "/library/article/pitta-balancing-yoga-cooling-the-inner-fire",
    description:
      "Pitta is the dosha of fire and water — sharp, ambitious, intense, and prone to overheating. Five themed practices to cool the body, soften the heart, and balance the fire within.",
  },
  {
    id: "content-kapha-balancing-yoga",
    title: "Kapha Balancing Yoga: Awakening the Earth Element",
    type: "article",
    pillarSlug: "movement",
    category: "body",
    duration: "9 min read",
    url: "/library/article/kapha-balancing-yoga-awakening-the-earth",
    description:
      "Kapha is the dosha of earth and water — steady, nurturing, strong, and prone to heaviness. Ten energizing asanas to awaken the inner fire and lighten the body.",
  },
  {
    id: "content-pranayama-meditation-6-step",
    title: "Pranayama and Meditation: A Six-Step Daily Practice",
    type: "article",
    pillarSlug: "breathing-meditation",
    category: "mind",
    duration: "9 min read",
    url: "/library/article/pranayama-meditation-six-step-daily-practice",
    description:
      "Six sequenced steps — from quiet sitting to positive intention — that integrate Patanjali's breath and meditation practices into a 30-minute daily session.",
  },
];
