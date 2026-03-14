"use client";

const flowSteps = [
  { name: "Morning Routine", desc: "5AM — take control of your day", color: "#FFD700" },
  { name: "Food Intake", desc: "You are what you eat", color: "#4CAF50" },
  { name: "Thoughts", desc: "Replace negative with positive", color: "#9C27B0" },
  { name: "Breathing", desc: "Maximize breath — the primary life force", color: "#00BCD4" },
  { name: "Exercise", desc: "Part of day to day activities", color: "#FF5722" },
  { name: "Sandhya Meditation", desc: "10X yourself", color: "#FFC107" },
  { name: "Connection to Brahman", desc: "Connect with the creator", color: "#673AB7" },
  { name: "Gratitude", desc: "Reinforce positive pathways", color: "#8BC34A" },
  { name: "Healing", desc: "Heal yourself and others", color: "#E91E63" },
  { name: "Manifestation", desc: "Intention setting, creativity", color: "#A855F7" },
  { name: "Sleep", desc: "Deep rest for cellular repair", color: "#3F51B5" },
];

export function TransformationFlow() {
  return (
    <div className="max-w-lg mx-auto">
      {/* Title */}
      <div className="text-center mb-10">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Vedic Transformation
        </h3>
        <p className="text-amber-400 font-semibold text-lg">in 48 Days</p>
      </div>

      {/* Flow Steps */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
          style={{
            background: "linear-gradient(to bottom, #FFD700, #FF9933, #E91E63, #673AB7, #3F51B5)",
          }}
        />

        <div className="space-y-4">
          {flowSteps.map((step, i) => (
            <div key={step.name} className="relative flex flex-col items-center">
              {/* Step card */}
              <div
                className="relative z-10 px-6 py-3 rounded-xl text-center min-w-[260px] sm:min-w-[300px] border"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                  borderColor: `${step.color}40`,
                  boxShadow: `0 0 15px ${step.color}15`,
                }}
              >
                <div className="font-bold text-white text-sm sm:text-base">{step.name}</div>
                <div className="text-xs sm:text-sm mt-0.5" style={{ color: step.color }}>
                  {step.desc}
                </div>
              </div>

              {/* Arrow down (not on last) */}
              {i < flowSteps.length - 1 && (
                <div className="relative z-10 my-1 text-amber-500/60 text-lg">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom badge */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30">
          <span className="text-sm font-semibold text-amber-400">🕉 Vedic Transformation in 48 Days</span>
        </div>
      </div>
    </div>
  );
}
