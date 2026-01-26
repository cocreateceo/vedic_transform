import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create the 11 transformation pillars
  const pillars = [
    {
      slug: "morning-initiation",
      name: "5 AM Initiation",
      sanskritName: "Brahma Muhurta",
      description: "Wake before sunrise to harness the sacred morning hours",
      category: "body",
      icon: "Sunrise",
      color: "#FFD700",
      bgColor: "bg-amber-100",
      karmaPointsBase: 15,
      defaultDurationMinutes: 0,
      sortOrder: 1,
    },
    {
      slug: "nutrition-fasting",
      name: "Mindful Nutrition",
      sanskritName: "Ahara",
      description: "Practice conscious eating and intermittent fasting",
      category: "body",
      icon: "Apple",
      color: "#FF6B35",
      bgColor: "bg-orange-100",
      karmaPointsBase: 10,
      defaultDurationMinutes: 0,
      sortOrder: 2,
    },
    {
      slug: "movement",
      name: "Sacred Movement",
      sanskritName: "Vyayama",
      description: "30 minutes of physical exercise or yoga asanas",
      category: "body",
      icon: "Dumbbell",
      color: "#EF4444",
      bgColor: "bg-red-100",
      karmaPointsBase: 15,
      defaultDurationMinutes: 30,
      sortOrder: 3,
    },
    {
      slug: "sleep-optimization",
      name: "Sleep Mastery",
      sanskritName: "Nidra",
      description: "Optimize your sleep for physical and mental restoration",
      category: "body",
      icon: "Moon",
      color: "#6366F1",
      bgColor: "bg-indigo-100",
      karmaPointsBase: 10,
      defaultDurationMinutes: 0,
      sortOrder: 4,
    },
    {
      slug: "thoughts-intention",
      name: "Thought Power",
      sanskritName: "Sankalpa",
      description: "Set daily intentions and cultivate positive thought patterns",
      category: "mind",
      icon: "Brain",
      color: "#8B5CF6",
      bgColor: "bg-violet-100",
      karmaPointsBase: 10,
      defaultDurationMinutes: 5,
      sortOrder: 5,
    },
    {
      slug: "breathing-meditation",
      name: "Pranayama",
      sanskritName: "Prana Vidya",
      description: "Practice breath control and meditation techniques",
      category: "mind",
      icon: "Wind",
      color: "#06B6D4",
      bgColor: "bg-cyan-100",
      karmaPointsBase: 15,
      defaultDurationMinutes: 15,
      sortOrder: 6,
    },
    {
      slug: "healing-meditation",
      name: "Healing Meditation",
      sanskritName: "Chikitsa Dhyana",
      description: "Guided meditation for physical and emotional healing",
      category: "mind",
      icon: "Heart",
      color: "#EC4899",
      bgColor: "bg-pink-100",
      karmaPointsBase: 15,
      defaultDurationMinutes: 20,
      sortOrder: 7,
    },
    {
      slug: "gratitude",
      name: "Gratitude Practice",
      sanskritName: "Kritajna",
      description: "Express gratitude for three things each day",
      category: "mind",
      icon: "Sparkles",
      color: "#F59E0B",
      bgColor: "bg-yellow-100",
      karmaPointsBase: 10,
      defaultDurationMinutes: 5,
      sortOrder: 8,
    },
    {
      slug: "sandhya-meditation",
      name: "Sandhya Meditation",
      sanskritName: "Sandhyavandana",
      description: "Align body rhythms with nature (3x daily)",
      category: "spirit",
      icon: "Sun",
      color: "#FFC107",
      bgColor: "bg-amber-100",
      karmaPointsBase: 20,
      defaultDurationMinutes: 15,
      sortOrder: 9,
    },
    {
      slug: "brahman-connection",
      name: "Connection to Brahman",
      sanskritName: "Brahma Sambandha",
      description: "Expand consciousness, connect with universal energy",
      category: "spirit",
      icon: "Infinity",
      color: "#673AB7",
      bgColor: "bg-violet-100",
      karmaPointsBase: 15,
      defaultDurationMinutes: 10,
      sortOrder: 10,
    },
    {
      slug: "divine-manifestation",
      name: "Divine Manifestation",
      sanskritName: "Sankalpa Shakti",
      description: "Set intentions and manifest your highest goals",
      category: "spirit",
      icon: "Sparkles",
      color: "#A855F7",
      bgColor: "bg-purple-100",
      karmaPointsBase: 12,
      defaultDurationMinutes: 10,
      sortOrder: 11,
    },
  ];

  // Create badges
  const badges = [
    {
      slug: "day-1",
      name: "First Step",
      description: "Complete your first day",
      icon: "Footprints",
      color: "#FFD700",
      requirement: JSON.stringify({ type: "days_completed", value: 1 }),
      karmaBonus: 50,
      sortOrder: 1,
    },
    {
      slug: "day-7",
      name: "Week Warrior",
      description: "Complete 7 consecutive days",
      icon: "Calendar",
      color: "#C0C0C0",
      requirement: JSON.stringify({ type: "streak", value: 7 }),
      karmaBonus: 100,
      sortOrder: 2,
    },
    {
      slug: "day-21",
      name: "Habit Former",
      description: "Complete 21 consecutive days",
      icon: "Flame",
      color: "#FF6B35",
      requirement: JSON.stringify({ type: "streak", value: 21 }),
      karmaBonus: 250,
      sortOrder: 3,
    },
    {
      slug: "day-48",
      name: "Transformation Complete",
      description: "Complete the full 48-day journey",
      icon: "Trophy",
      color: "#FFD700",
      requirement: JSON.stringify({ type: "days_completed", value: 48 }),
      karmaBonus: 500,
      sortOrder: 4,
    },
    {
      slug: "perfect-day",
      name: "Perfect Day",
      description: "Complete all 11 pillars in one day",
      icon: "Star",
      color: "#A855F7",
      requirement: JSON.stringify({ type: "all_pillars_day", value: 11 }),
      karmaBonus: 75,
      sortOrder: 5,
    },
    {
      slug: "early-bird",
      name: "Early Bird",
      description: "Complete morning initiation 10 times before 5:30 AM",
      icon: "Sunrise",
      color: "#F59E0B",
      requirement: JSON.stringify({ type: "early_morning", value: 10 }),
      karmaBonus: 100,
      sortOrder: 6,
    },
  ];

  // Upsert pillars
  for (const pillar of pillars) {
    await prisma.pillar.upsert({
      where: { slug: pillar.slug },
      update: pillar,
      create: pillar,
    });
  }
  console.log(`Created ${pillars.length} pillars`);

  // Upsert badges
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: badge,
      create: badge,
    });
  }
  console.log(`Created ${badges.length} badges`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
