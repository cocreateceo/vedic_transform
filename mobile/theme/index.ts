// 10X Vedic Transform — mobile theme
// Saffron + amber on cream/white. Matches the web app's brand palette
// (see src/app/globals.css). Light theme by default; the web is light too.

export const colors = {
  // Saffron / amber — primary brand spectrum
  saffron: "#FF9933",
  amber500: "#F59E0B",
  amber600: "#D97706",
  amber700: "#B45309",
  gold: "#DAA520",
  goldLight: "#FFD700",

  // Cream / paper backgrounds
  cream50: "#FFFEF5",
  cream100: "#FEF7E5",
  cream200: "#FFF3D1",

  // Greys (Tailwind-ish)
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",

  // Functional
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // Pillar accents (matches src/constants/pillars.ts)
  body: "#FF5722",
  mind: "#9C27B0",
  spirit: "#FFC107",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: "700" as const, color: colors.gray900 },
  h2: { fontSize: 22, fontWeight: "700" as const, color: colors.gray900 },
  h3: { fontSize: 18, fontWeight: "600" as const, color: colors.gray900 },
  body: { fontSize: 15, color: colors.gray700 },
  bodyBold: { fontSize: 15, fontWeight: "600" as const, color: colors.gray800 },
  caption: { fontSize: 12, color: colors.gray500 },
} as const;
