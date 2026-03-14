"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sunrise, Utensils, Brain, Wind, PersonStanding,
  Sun, HandHeart, Infinity, Sparkles, Heart, Moon,
} from "lucide-react";

const flowSteps = [
  { name: "Morning Routine", desc: "5AM — take control of your day", icon: Sunrise, color: "#FFD700" },
  { name: "Food Intake", desc: "You are what you eat", icon: Utensils, color: "#4CAF50" },
  { name: "Thoughts", desc: "Replace negative with positive", icon: Brain, color: "#FF9933" },
  { name: "Breathing", desc: "Maximize breath — the primary life force", icon: Wind, color: "#00BCD4" },
  { name: "Exercise", desc: "Part of day to day activities", icon: PersonStanding, color: "#FF5722" },
  { name: "Sandhya Meditation", desc: "10X yourself", icon: Sun, color: "#FFC107" },
  { name: "Connection to Brahman", desc: "Connect with the creator", icon: Infinity, color: "#FF9933" },
  { name: "Gratitude", desc: "Reinforce positive pathways", icon: HandHeart, color: "#8BC34A" },
  { name: "Healing", desc: "Heal yourself and others", icon: Heart, color: "#E91E63" },
  { name: "Manifestation", desc: "Intention setting, creativity", icon: Sparkles, color: "#FF9800" },
  { name: "Sleep", desc: "Deep rest for cellular repair", icon: Moon, color: "#3F51B5" },
];

export function TransformationFlow() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate steps one by one
            flowSteps.forEach((_, i) => {
              setTimeout(() => {
                setVisibleSteps((prev) => [...new Set([...prev, i])]);
              }, i * 150);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto">
      {/* Animated flow */}
      <div className="relative">
        {/* Glowing vertical line */}
        <div
          className="absolute left-8 sm:left-10 top-0 bottom-0 w-0.5"
          style={{
            background: "linear-gradient(to bottom, #FFD700, #FF9933, #FF5722, #FFC107, #FFD700)",
            boxShadow: "0 0 10px rgba(255,153,51,0.3)",
          }}
        />

        <div className="space-y-0">
          {flowSteps.map((step, i) => {
            const isVisible = visibleSteps.includes(i);
            const Icon = step.icon;
            return (
              <div
                key={step.name}
                className="relative flex items-start gap-4 sm:gap-6 py-4"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0)" : "translateX(-30px)",
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`,
                }}
              >
                {/* Icon circle on the line */}
                <div
                  className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}20, ${step.color}40)`,
                    borderColor: step.color,
                    boxShadow: isVisible ? `0 0 20px ${step.color}30, 0 0 40px ${step.color}10` : "none",
                    transition: "box-shadow 0.8s ease",
                  }}
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: step.color }} />
                </div>

                {/* Content card */}
                <div
                  className="flex-1 px-5 py-4 rounded-2xl border"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(8px)",
                    borderColor: `${step.color}25`,
                    boxShadow: isVisible ? `0 4px 20px ${step.color}08` : "none",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: `${step.color}20`,
                        color: step.color,
                      }}
                    >
                      Step {i + 1}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base sm:text-lg">{step.name}</h4>
                  <p className="text-sm text-[#94a3b8] mt-1">{step.desc}</p>
                </div>

                {/* Connecting pulse dot */}
                {i < flowSteps.length - 1 && (
                  <div
                    className="absolute left-[30px] sm:left-[38px] bottom-0 w-2 h-2 rounded-full"
                    style={{
                      background: step.color,
                      boxShadow: `0 0 8px ${step.color}`,
                      animation: isVisible ? "pulse 2s ease-in-out infinite" : "none",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Inline pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Bottom badge */}
      <div className="text-center mt-10">
        <div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border"
          style={{
            background: "linear-gradient(135deg, rgba(255,153,51,0.1), rgba(255,215,0,0.1))",
            borderColor: "rgba(255,153,51,0.3)",
            boxShadow: "0 0 30px rgba(255,153,51,0.1)",
          }}
        >
          <span className="text-2xl">{"\u0950"}</span>
          <span className="text-sm sm:text-base font-semibold text-amber-400">
            Complete the Mandala — Transform Forever
          </span>
        </div>
      </div>
    </div>
  );
}
