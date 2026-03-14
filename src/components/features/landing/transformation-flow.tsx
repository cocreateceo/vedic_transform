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
            flowSteps.forEach((_, i) => {
              setTimeout(() => {
                setVisibleSteps((prev) => [...new Set([...prev, i])]);
              }, i * 200);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-4">
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      <div className="relative">
        {/* Center vertical glowing line — hidden on mobile */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] hidden md:block"
          style={{
            background: "linear-gradient(to bottom, #FFD700, #FF9933, #FF5722, #00BCD4, #FFC107, #8BC34A, #E91E63, #3F51B5)",
            boxShadow: "0 0 12px rgba(255,153,51,0.4), 0 0 24px rgba(255,153,51,0.1)",
          }}
        />

        {/* Mobile vertical line — left aligned */}
        <div
          className="absolute left-8 top-0 bottom-0 w-[2px] md:hidden"
          style={{
            background: "linear-gradient(to bottom, #FFD700, #FF9933, #FF5722, #FFC107, #FFD700)",
            boxShadow: "0 0 10px rgba(255,153,51,0.3)",
          }}
        />

        <div className="space-y-6 md:space-y-10">
          {flowSteps.map((step, i) => {
            const isVisible = visibleSteps.includes(i);
            const isLeft = i % 2 === 0;
            const Icon = step.icon;

            return (
              <div key={step.name} className="relative">
                {/* ── Desktop: Zig-zag layout ── */}
                <div
                  className="hidden md:flex items-center gap-0"
                  style={{
                    flexDirection: isLeft ? "row" : "row-reverse",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "translateX(0) translateY(0)"
                      : isLeft
                        ? "translateX(-60px) translateY(10px)"
                        : "translateX(60px) translateY(10px)",
                    transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1)`,
                  }}
                >
                  {/* Content card — takes up one side */}
                  <div className="w-[calc(50%-48px)]">
                    <div
                      className="px-6 py-5 rounded-2xl border"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(12px)",
                        borderColor: `${step.color}30`,
                        boxShadow: isVisible ? `0 4px 30px ${step.color}10, inset 0 1px 0 ${step.color}15` : "none",
                        transition: "box-shadow 0.8s ease",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: `${step.color}20`, color: step.color }}
                        >
                          Step {i + 1}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-lg">{step.name}</h4>
                      <p className="text-sm text-[#94a3b8] mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  {/* Center icon circle — on the line */}
                  <div className="flex flex-col items-center w-[96px] flex-shrink-0 relative z-10">
                    {/* Pulse dot above */}
                    {i > 0 && (
                      <div
                        className="w-2.5 h-2.5 rounded-full mb-2"
                        style={{
                          background: step.color,
                          boxShadow: `0 0 10px ${step.color}`,
                          animation: isVisible ? "pulseGlow 2.5s ease-in-out infinite" : "none",
                        }}
                      />
                    )}

                    <div
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center border-2"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${step.color}30, ${step.color}10)`,
                        borderColor: step.color,
                        boxShadow: isVisible
                          ? `0 0 20px ${step.color}30, 0 0 50px ${step.color}10, inset 0 0 15px ${step.color}10`
                          : "none",
                        transition: "box-shadow 1s ease",
                        animation: isVisible ? "floatIcon 3s ease-in-out infinite" : "none",
                        animationDelay: `${i * 0.2}s`,
                      }}
                    >
                      <Icon className="w-7 h-7 lg:w-9 lg:h-9" style={{ color: step.color }} />
                    </div>

                    {/* Pulse dot below */}
                    {i < flowSteps.length - 1 && (
                      <div
                        className="w-2.5 h-2.5 rounded-full mt-2"
                        style={{
                          background: step.color,
                          boxShadow: `0 0 10px ${step.color}`,
                          animation: isVisible ? "pulseGlow 2.5s ease-in-out infinite" : "none",
                          animationDelay: "0.5s",
                        }}
                      />
                    )}
                  </div>

                  {/* Empty space — other side */}
                  <div className="w-[calc(50%-48px)]" />
                </div>

                {/* ── Mobile: Left-aligned layout ── */}
                <div
                  className="flex md:hidden items-start gap-4 py-2"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateX(0)" : "translateX(-30px)",
                    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${step.color}30, ${step.color}10)`,
                      borderColor: step.color,
                      boxShadow: isVisible ? `0 0 15px ${step.color}25` : "none",
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: step.color }} />
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 px-4 py-3 rounded-xl border"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      borderColor: `${step.color}25`,
                    }}
                  >
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1"
                      style={{ background: `${step.color}20`, color: step.color }}
                    >
                      Step {i + 1}
                    </span>
                    <h4 className="font-bold text-white text-sm">{step.name}</h4>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom badge */}
      <div className="text-center mt-12">
        <div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border"
          style={{
            background: "linear-gradient(135deg, rgba(255,153,51,0.1), rgba(255,215,0,0.15))",
            borderColor: "rgba(255,153,51,0.3)",
            boxShadow: "0 0 30px rgba(255,153,51,0.1), 0 0 60px rgba(255,215,0,0.05)",
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
