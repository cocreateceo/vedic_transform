"use client";

import { useState } from "react";
import { Clock, Award, ArrowRight, Sparkles } from "lucide-react";
import { PILLARS, type PillarCategory } from "@/constants/pillars";
import Link from "next/link";

type Filter = "all" | PillarCategory;

const filterTabs: { key: Filter; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "🕉" },
  { key: "body", label: "Body", icon: "💪" },
  { key: "mind", label: "Mind", icon: "🧠" },
  { key: "spirit", label: "Spirit", icon: "✨" },
];

const categoryStyles: Record<string, { label: string; bg: string; text: string; border: string; glow: string }> = {
  body: { label: "Body", bg: "bg-red-500/20", text: "text-red-300", border: "border-red-500/25", glow: "rgba(239,68,68,0.08)" },
  mind: { label: "Mind", bg: "bg-purple-500/20", text: "text-purple-300", border: "border-purple-500/25", glow: "rgba(168,85,247,0.08)" },
  spirit: { label: "Spirit", bg: "bg-amber-500/20", text: "text-amber-300", border: "border-amber-500/25", glow: "rgba(245,158,11,0.08)" },
};

// Rich detailed descriptions for each pillar
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
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered =
    activeFilter === "all"
      ? PILLARS
      : PILLARS.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* ═══ Filter Tabs ═══ */}
      <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveFilter(tab.key); setExpandedId(null); }}
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

      {/* ═══ Category Summary (when filtered) ═══ */}
      {activeFilter !== "all" && (
        <div className="text-center mb-10">
          <p className="text-[#94a3b8] text-sm max-w-2xl mx-auto">
            {activeFilter === "body" && "Body pillars focus on physical vitality — optimizing your daily rhythms, nutrition, movement, and rest for peak energy and health."}
            {activeFilter === "mind" && "Mind pillars develop mental strength — rewiring thought patterns, building focus through meditation, and cultivating emotional resilience."}
            {activeFilter === "spirit" && "Spirit pillars awaken your deeper connection — aligning with cosmic rhythms, expanding consciousness, and manifesting your highest purpose."}
          </p>
        </div>
      )}

      {/* ═══ Pillar Cards ═══ */}
      <div className="space-y-6">
        {filtered.map((pillar) => {
          const IconComp = pillar.icon;
          const cat = categoryStyles[pillar.category];
          const details = pillarDetails[pillar.slug];
          const isExpanded = expandedId === pillar.id;

          return (
            <div
              key={pillar.id}
              className="rounded-2xl bg-white/[0.02] backdrop-blur-sm border transition-all overflow-hidden"
              style={{
                borderColor: isExpanded ? `${pillar.color}40` : `${pillar.color}15`,
                boxShadow: isExpanded ? `0 8px 40px ${cat.glow}, 0 0 60px ${cat.glow}` : "none",
              }}
            >
              {/* Card Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : pillar.id)}
                className="w-full p-6 sm:p-8 text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-5">
                  {/* Large icon */}
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                    style={{
                      background: `linear-gradient(135deg, ${pillar.color}15, ${pillar.color}25)`,
                      borderColor: `${pillar.color}30`,
                    }}
                  >
                    <IconComp className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: pillar.color }} />
                  </div>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{pillar.name}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full ${cat.bg} ${cat.text} font-semibold`}>
                        {cat.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium mt-1" style={{ color: pillar.color }}>
                      {pillar.sanskritName}
                    </p>
                    <p className="text-sm text-[#94a3b8] mt-2">{pillar.description}</p>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 mt-3">
                      {pillar.defaultDurationMinutes > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8]">
                          <Clock className="w-3.5 h-3.5" />
                          {pillar.defaultDurationMinutes} min/session
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-400/80">
                        <Award className="w-3.5 h-3.5" />
                        +{pillar.karmaPointsBase} Karma
                      </span>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border transition-all"
                    style={{
                      borderColor: isExpanded ? `${pillar.color}40` : "rgba(255,255,255,0.1)",
                      background: isExpanded ? `${pillar.color}15` : "transparent",
                    }}
                  >
                    <ArrowRight
                      className="w-5 h-5 transition-transform duration-300"
                      style={{
                        color: isExpanded ? pillar.color : "#64748b",
                        transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    />
                  </div>
                </div>
              </button>

              {/* Expanded Detail */}
              {isExpanded && details && (
                <div className="px-6 sm:px-8 pb-8 border-t border-white/[0.06]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
                    {/* Left: Description + Science */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: pillar.color }} />
                          About This Pillar
                        </h4>
                        <p className="text-sm text-[#b0b8c8] leading-relaxed">
                          {details.fullDescription}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: pillar.color }} />
                          The Science
                        </h4>
                        <div
                          className="text-sm text-[#b0b8c8] leading-relaxed p-4 rounded-xl border"
                          style={{
                            background: `${pillar.color}05`,
                            borderColor: `${pillar.color}15`,
                          }}
                        >
                          <Sparkles className="w-4 h-4 inline mr-2" style={{ color: pillar.color }} />
                          {details.scienceBehind}
                        </div>
                      </div>
                    </div>

                    {/* Right: Benefits + Practice */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: pillar.color }} />
                          Key Benefits
                        </h4>
                        <ul className="space-y-2.5">
                          {details.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-[#b0b8c8]">
                              <span
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                                style={{ background: `${pillar.color}20`, color: pillar.color }}
                              >
                                ✓
                              </span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: pillar.color }} />
                          How to Practice
                        </h4>
                        <div
                          className="text-sm text-[#b0b8c8] leading-relaxed p-4 rounded-xl border-l-2"
                          style={{
                            borderLeftColor: pillar.color,
                            background: "rgba(255,255,255,0.02)",
                          }}
                        >
                          {details.practice}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full ${cat.bg} ${cat.text} font-semibold`}>
                        {cat.label}
                      </span>
                      <span className="text-xs text-[#64748b]">
                        Pillar {pillar.id} of 11
                      </span>
                    </div>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
                    >
                      Start Practicing
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
