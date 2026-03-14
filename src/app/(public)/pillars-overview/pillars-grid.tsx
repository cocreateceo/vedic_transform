"use client";

import { useState } from "react";
import { Clock, Award, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { PILLARS, type PillarCategory } from "@/constants/pillars";
import Link from "next/link";

type Filter = "all" | PillarCategory;

const filterTabs: { key: Filter; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "🕉" },
  { key: "body", label: "Body", icon: "💪" },
  { key: "mind", label: "Mind", icon: "🧠" },
  { key: "spirit", label: "Spirit", icon: "✨" },
];

const categoryStyles: Record<string, { label: string; bg: string; text: string; glow: string }> = {
  body: { label: "Body", bg: "bg-red-500/20", text: "text-red-300", glow: "rgba(239,68,68,0.08)" },
  mind: { label: "Mind", bg: "bg-purple-500/20", text: "text-purple-300", glow: "rgba(168,85,247,0.08)" },
  spirit: { label: "Spirit", bg: "bg-amber-500/20", text: "text-amber-300", glow: "rgba(245,158,11,0.08)" },
};

const pillarDetails: Record<string, { fullDescription: string; benefits: string[]; practice: string; scienceBehind: string }> = {
  "morning-initiation": {
    fullDescription: "The Brahma Muhurta (approximately 96 minutes before sunrise) is considered the most auspicious time in Vedic tradition. Rising at 5 AM allows you to harness the sattvic (pure) energy that permeates the atmosphere during this period. This practice activates your circadian rhythm, setting the foundation for discipline, mental clarity, and emotional balance throughout the day.",
    benefits: ["Enhanced mental clarity and focus", "Stronger willpower and discipline", "Natural cortisol alignment", "Peaceful start before daily demands"],
    practice: "Wake calmly, hydrate with warm water, avoid phone for 20-30 minutes. Sit upright and center your breath before beginning morning practices.",
    scienceBehind: "Research in chronobiology shows early rising aligns with natural cortisol peaks, improving cognitive function and reducing stress hormones throughout the day."
  },
  "nutrition-fasting": {
    fullDescription: "Ahara Vidhi (the science of food intake) teaches that food is not just fuel — it shapes your mind, emotions, and energy. Vedic nutrition emphasizes Sattvic (pure, harmonious) foods that promote clarity and lightness, while minimizing Tamasic (heavy, processed) foods that cause lethargy. Combined with intermittent fasting (16:8 pattern), this pillar optimizes your metabolism and cellular repair.",
    benefits: ["Improved digestion and metabolism", "Mental clarity and emotional stability", "Natural weight management", "Enhanced cellular repair through autophagy"],
    practice: "Eat plant-forward meals during an 8-hour window. Choose fresh, organic foods. Avoid heavy meals after sunset. Practice mindful eating without distractions.",
    scienceBehind: "Studies on intermittent fasting show increased autophagy (cellular cleanup), improved insulin sensitivity, and enhanced brain-derived neurotrophic factor (BDNF) for cognitive health."
  },
  "thoughts-intention": {
    fullDescription: "Sankalpa is the Vedic practice of setting a conscious intention and aligning your thought patterns with your highest goals. This pillar focuses on mental nutrition — replacing negative thought patterns, limiting beliefs, and toxic mental inputs with constructive, empowering ones. By consciously choosing your mental diet, you rewire neural pathways toward resilience and positivity.",
    benefits: ["Cognitive reframing and mental strength", "Reduced anxiety and negative self-talk", "Clearer decision-making", "Stronger alignment with life purpose"],
    practice: "Start each day by setting one positive intention. Replace each negative thought with a constructive alternative. Limit exposure to news, gossip, and toxic conversations, especially in the first hour and after sunset.",
    scienceBehind: "Neuroplasticity research confirms that repeated positive thought patterns physically reshape neural connections, strengthening prefrontal cortex function and reducing amygdala reactivity."
  },
  "breathing-meditation": {
    fullDescription: "Pranayama (breath control) is one of the most powerful tools in the Vedic tradition. The 4:6 breathing ratio (inhale 4 seconds, exhale 6 seconds) activates the parasympathetic nervous system, immediately reducing stress hormones and creating a state of focused calm. Combined with meditation, this practice becomes the gateway to inner stillness and heightened awareness.",
    benefits: ["Immediate stress hormone reduction", "Improved focus and concentration", "Better emotional regulation", "Lower blood pressure and heart rate"],
    practice: "Sit upright in a quiet space. Inhale slowly for 4 seconds, exhale for 6 seconds. Repeat for 15 minutes. Focus on the breath as your anchor to the present moment.",
    scienceBehind: "The 4:6 breathing ratio stimulates the vagus nerve, shifting the autonomic nervous system from sympathetic (fight-or-flight) to parasympathetic (rest-and-digest), measurably reducing cortisol levels within minutes."
  },
  "movement": {
    fullDescription: "Vyayama encompasses all forms of mindful physical movement — yoga, walking, strength training, and flexibility work. Unlike intense exercise that depletes energy, Vedic movement emphasizes sustainable, daily practices that enhance metabolism, maintain youthful energy, and keep the body a worthy vessel for spiritual practice. The key is consistency over intensity.",
    benefits: ["Enhanced metabolism and energy", "Improved flexibility and strength", "Better sleep quality", "Reduced joint pain and stiffness"],
    practice: "Dedicate 30 minutes daily to movement. Combine yoga asanas, brisk walking, and light strength training. Move in nature when possible. Listen to your body — consistency matters more than intensity.",
    scienceBehind: "Regular moderate exercise increases mitochondrial density, improves cardiovascular health, boosts serotonin and dopamine production, and reduces systemic inflammation by up to 40%."
  },
  "healing-meditation": {
    fullDescription: "Dhyana (deep meditation) is the practice of creating space between stimulus and response — the space where inner rewiring begins. Unlike breathing meditation which focuses on calm, healing meditation goes deeper, dissolving reactive patterns, emotional blockages, and subconscious limiting beliefs. This is where true transformation of personality and emotional patterns occurs.",
    benefits: ["Dissolution of reactive emotional patterns", "Deep emotional healing", "Greater self-awareness", "Release of stored trauma and tension"],
    practice: "Sit in stillness for 20 minutes. Observe thoughts without engagement. When emotions arise, witness them with compassion rather than reacting. Allow the healing process to unfold naturally.",
    scienceBehind: "fMRI studies show that regular meditation physically increases gray matter density in the prefrontal cortex (decision-making) and reduces activity in the default mode network (rumination and anxiety)."
  },
  "gratitude": {
    fullDescription: "Kritajnata (gratitude practice) is the conscious act of recognizing and appreciating the positive elements in your life. This deceptively simple practice is one of the most powerful neural rewiring tools available. By consistently focusing on gratitude, you strengthen positive neural pathways and build emotional resilience that carries through challenges.",
    benefits: ["Strengthened positive neural pathways", "Increased emotional resilience", "Better relationships and empathy", "Improved sleep and overall well-being"],
    practice: "Each morning, mentally or in writing, list three specific things you are grateful for. Be detailed — not just 'family' but 'my daughter's laugh at breakfast today.' Feel the gratitude in your body.",
    scienceBehind: "Research from UC Berkeley shows that gratitude practice increases activity in the medial prefrontal cortex and anterior cingulate cortex, regions associated with moral cognition, value judgments, and emotional processing."
  },
  "sandhya-meditation": {
    fullDescription: "Sandhyavandana is a uniquely Vedic practice performed three times daily — at sunrise, solar noon, and sunset — the three 'junctions' (sandhya) of the day. These transitional moments are when the body's biological rhythms naturally shift, making them ideal for recalibration. This practice aligns your internal clock with the cosmic rhythms of nature.",
    benefits: ["Biological rhythm synchronization", "Heightened awareness and presence", "Three daily reset points", "Deep connection with natural cycles"],
    practice: "At sunrise, noon, and sunset, pause for 5 minutes. Face the sun (or its direction). Center your breath, express gratitude, and consciously align your energy with the transitional moment.",
    scienceBehind: "Chronobiology research shows that light exposure patterns at sunrise and sunset regulate melatonin and cortisol cycles, and brief meditative pauses at circadian transition points improve hormonal balance."
  },
  "brahman-connection": {
    fullDescription: "Brahma Sambandha is the practice of connecting with the universal consciousness (Brahman) — the source of all creation. This pillar moves beyond personal growth into the realm of consciousness expansion. Through dedicated practice, the boundaries of ego dissolve, revealing a deeper connection to all existence. This is the spiritual heart of the Vedic transformation.",
    benefits: ["Consciousness expansion beyond ego", "Deep sense of inner peace", "Connection to universal intelligence", "Dissolution of fear and separation"],
    practice: "Sit in complete stillness for 10 minutes. Release all thoughts of 'I' and 'mine.' Feel your awareness expand beyond your body, connecting with the infinite field of consciousness. Rest in that spaciousness.",
    scienceBehind: "Advanced meditators show increased gamma wave activity and synchronization across brain regions, correlating with experiences of expanded awareness, interconnectedness, and profound states of peace."
  },
  "divine-manifestation": {
    fullDescription: "Sankalpa Shakti is the power of conscious intention combined with visualization. Unlike wishful thinking, Vedic manifestation is a disciplined practice of clearly envisioning your goals, aligning your energy with them, and opening yourself to receive guidance and opportunities. This pillar transforms abstract desires into focused energy directed toward your highest purpose.",
    benefits: ["Clarity of purpose and direction", "Focused energy toward goals", "Receptivity to opportunities", "Alignment of actions with intentions"],
    practice: "Visualize your key goal for the 48-day journey for 2 minutes. See yourself already succeeding. Feel the emotions of achievement. Invite clarity, strength, and guidance — your 'energy download.' Hold that vision with conviction.",
    scienceBehind: "Visualization activates the same neural networks as actual performance, strengthening motor patterns and building confidence through mental rehearsal — a technique used by Olympic athletes and peak performers."
  },
  "sleep-optimization": {
    fullDescription: "Nidra (optimized sleep) is not merely the absence of wakefulness — it is an active process of cellular repair, memory consolidation, and emotional processing. The Vedic approach to sleep involves creating conditions for deep, restorative rest that maximizes the body's natural healing mechanisms. Quality sleep is the foundation upon which all other transformation pillars rest.",
    benefits: ["Deep cellular repair and regeneration", "Memory consolidation and learning", "Emotional stability and resilience", "Hormonal balance and immune function"],
    practice: "Avoid screens 60 minutes before bed. Create a cool, dark sleep environment. Practice 4:6 breathing for 5 minutes before sleep. Avoid heavy food after sunset. Aim for 7-8 hours of uninterrupted rest.",
    scienceBehind: "Sleep research shows that deep NREM sleep triggers growth hormone release for tissue repair, while REM sleep consolidates memories and processes emotions. Poor sleep increases cortisol by 37% and reduces immune function by 70%."
  },
};

export function PillarsGrid() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [activePillarId, setActivePillarId] = useState<number>(1);

  const filtered =
    activeFilter === "all"
      ? PILLARS
      : PILLARS.filter((p) => p.category === activeFilter);

  // When filter changes, select first pillar in that filter
  const handleFilterChange = (key: Filter) => {
    setActiveFilter(key);
    const newFiltered = key === "all" ? PILLARS : PILLARS.filter((p) => p.category === key);
    if (newFiltered.length > 0) setActivePillarId(newFiltered[0].id);
  };

  const activePillar = PILLARS.find((p) => p.id === activePillarId) || PILLARS[0];
  const details = pillarDetails[activePillar.slug];
  const cat = categoryStyles[activePillar.category];
  const IconComp = activePillar.icon;

  // Navigation
  const currentIndex = filtered.findIndex((p) => p.id === activePillarId);
  const prevPillar = currentIndex > 0 ? filtered[currentIndex - 1] : null;
  const nextPillar = currentIndex < filtered.length - 1 ? filtered[currentIndex + 1] : null;

  return (
    <>
      {/* ═══ Category Filter Tabs ═══ */}
      <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
            className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeFilter === tab.key
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-105"
                : "bg-white/[0.03] border border-white/[0.08] text-[#94a3b8] hover:border-orange-500/30 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            <span className="text-xs opacity-70">
              ({tab.key === "all" ? PILLARS.length : PILLARS.filter(p => p.category === tab.key).length})
            </span>
          </button>
        ))}
      </div>

      {/* ═══ Pillar Sub-Tabs ═══ */}
      <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
        {filtered.map((pillar) => {
          const PIcon = pillar.icon;
          const isActive = pillar.id === activePillarId;
          return (
            <button
              key={pillar.id}
              onClick={() => setActivePillarId(pillar.id)}
              className="cursor-pointer transition-all"
              style={{
                padding: "8px 16px",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: isActive ? 700 : 500,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: isActive ? `${pillar.color}20` : "rgba(255,255,255,0.02)",
                border: `1px solid ${isActive ? `${pillar.color}50` : "rgba(255,255,255,0.06)"}`,
                color: isActive ? pillar.color : "#94a3b8",
                boxShadow: isActive ? `0 0 15px ${pillar.color}15` : "none",
                transform: isActive ? "scale(1.05)" : "scale(1)",
              }}
            >
              <PIcon style={{ width: 16, height: 16 }} />
              <span className="hidden sm:inline">{pillar.name}</span>
              <span className="sm:hidden">{pillar.name.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ═══ Active Pillar Full Detail ═══ */}
      {details && (
        <div
          className="rounded-3xl border overflow-hidden"
          style={{
            borderColor: `${activePillar.color}25`,
            boxShadow: `0 8px 60px ${cat.glow}, 0 0 80px ${cat.glow}`,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {/* Header */}
          <div
            className="p-8 sm:p-10 border-b"
            style={{
              borderBottomColor: `${activePillar.color}15`,
              background: `linear-gradient(135deg, ${activePillar.color}08, transparent)`,
            }}
          >
            <div className="flex items-center gap-6">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center flex-shrink-0 border-2"
                style={{
                  background: `linear-gradient(135deg, ${activePillar.color}15, ${activePillar.color}30)`,
                  borderColor: `${activePillar.color}40`,
                  boxShadow: `0 0 30px ${activePillar.color}15`,
                }}
              >
                <IconComp className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: activePillar.color }} />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">{activePillar.name}</h2>
                  <span className={`text-xs px-3 py-1 rounded-full ${cat.bg} ${cat.text} font-semibold`}>
                    {cat.label}
                  </span>
                </div>
                <p className="text-base font-medium" style={{ color: activePillar.color }}>
                  {activePillar.sanskritName}
                </p>
                <p className="text-sm text-[#94a3b8] mt-2">{activePillar.description}</p>
                <div className="flex items-center gap-5 mt-3">
                  {activePillar.defaultDurationMinutes > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-[#94a3b8]">
                      <Clock className="w-4 h-4" /> {activePillar.defaultDurationMinutes} min/session
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-sm text-amber-400">
                    <Award className="w-4 h-4" /> +{activePillar.karmaPointsBase} Karma Points
                  </span>
                  <span className="text-sm text-[#64748b]">Pillar {activePillar.id} of 11</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: activePillar.color }} />
                    About This Pillar
                  </h3>
                  <p className="text-[15px] text-[#b0b8c8] leading-relaxed">
                    {details.fullDescription}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: activePillar.color }} />
                    The Science Behind It
                  </h3>
                  <div
                    className="text-[15px] text-[#b0b8c8] leading-relaxed p-5 rounded-xl border"
                    style={{ background: `${activePillar.color}05`, borderColor: `${activePillar.color}15` }}
                  >
                    <Sparkles className="w-4 h-4 inline mr-2 -mt-0.5" style={{ color: activePillar.color }} />
                    {details.scienceBehind}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: activePillar.color }} />
                    Key Benefits
                  </h3>
                  <ul className="space-y-3">
                    {details.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[15px] text-[#b0b8c8]">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                          style={{ background: `${activePillar.color}20`, color: activePillar.color }}
                        >
                          ✓
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: activePillar.color }} />
                    How to Practice
                  </h3>
                  <div
                    className="text-[15px] text-[#b0b8c8] leading-relaxed p-5 rounded-xl border-l-3"
                    style={{ borderLeftColor: activePillar.color, borderLeftWidth: "3px", background: "rgba(255,255,255,0.02)" }}
                  >
                    {details.practice}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation + CTA */}
            <div className="mt-10 pt-8 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                {prevPillar && (
                  <button
                    onClick={() => setActivePillarId(prevPillar.id)}
                    className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {prevPillar.name}
                  </button>
                )}
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
              >
                Start Practicing <ArrowRight className="w-4 h-4" />
              </Link>
              <div>
                {nextPillar && (
                  <button
                    onClick={() => setActivePillarId(nextPillar.id)}
                    className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                  >
                    {nextPillar.name}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
