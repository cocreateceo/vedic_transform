import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Pillar } from "@/constants/pillars";
import type { PillarContent } from "@/data/pillar-content";

// Branded multi-page PDF for a single pillar. Rendered both server-side
// (via the /pillars/[slug]/pdf API route) and locally when running the
// generate-pillar-pdfs script for static caching.

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.55,
    color: "#1a1a1a",
    padding: 56,
    backgroundColor: "#fffdf9",
  },
  // ── Cover ──
  cover: {
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    paddingHorizontal: 24,
  },
  brand: {
    fontSize: 9,
    color: "#b45309",
    letterSpacing: 2,
    marginBottom: 32,
    fontFamily: "Helvetica-Bold",
  },
  pillarNumber: {
    fontSize: 14,
    color: "#92400e",
    marginBottom: 8,
  },
  pillarName: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: "#1c1917",
    marginBottom: 6,
    lineHeight: 1.15,
  },
  sanskrit: {
    fontSize: 20,
    color: "#b45309",
    fontFamily: "Helvetica-Oblique",
    marginBottom: 24,
  },
  meta: {
    flexDirection: "row",
    gap: 16,
    fontSize: 10,
    color: "#57534e",
    marginBottom: 32,
  },
  metaItem: {
    flexDirection: "row",
  },
  tagline: {
    fontSize: 14,
    color: "#44403c",
    lineHeight: 1.65,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e7e5e4",
    marginTop: 16,
  },
  // ── Content pages ──
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#a8a29e",
    marginBottom: 32,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e7e5e4",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#1c1917",
    marginBottom: 12,
  },
  sectionTitleAccent: {
    fontSize: 9,
    color: "#b45309",
    letterSpacing: 1.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 11,
    color: "#292524",
    marginBottom: 10,
    lineHeight: 1.6,
  },
  step: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#b45309",
    width: 18,
  },
  stepText: {
    fontSize: 11,
    color: "#292524",
    flex: 1,
    lineHeight: 1.5,
  },
  scriptureBlock: {
    marginBottom: 14,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: "#f59e0b",
  },
  scriptureText: {
    fontSize: 11,
    color: "#292524",
    fontFamily: "Helvetica-Oblique",
    marginBottom: 4,
    lineHeight: 1.5,
  },
  scriptureCite: {
    fontSize: 9,
    color: "#78716c",
  },
  obstacle: {
    marginBottom: 14,
  },
  obstacleQ: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1c1917",
    marginBottom: 3,
  },
  obstacleA: {
    fontSize: 11,
    color: "#44403c",
    lineHeight: 1.5,
  },
  closing: {
    fontSize: 11,
    color: "#44403c",
    lineHeight: 1.6,
    backgroundColor: "#fef3c7",
    padding: 16,
    borderRadius: 4,
    marginTop: 12,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#a8a29e",
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#e7e5e4",
  },
});

interface PillarPDFDocumentProps {
  pillar: Pillar;
  content: PillarContent;
}

export function PillarPDFDocument({ pillar, content }: PillarPDFDocumentProps) {
  const pageHeaderText = `${pillar.name} · ${pillar.sanskritName}`;

  return (
    <Document
      title={`${pillar.name} — 10X Vedic Transform`}
      author="10X Vedic Transform"
      subject={`Pillar ${pillar.id}: ${pillar.name}`}
      keywords={`${pillar.sanskritName}, ${pillar.category}, vedic, ayurveda, sadhana`}
    >
      {/* ── Cover page ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.cover}>
          <Text style={styles.brand}>10X VEDIC TRANSFORM · OFFLINE GUIDE</Text>
          <Text style={styles.pillarNumber}>Pillar {pillar.id} of 11</Text>
          <Text style={styles.pillarName}>{pillar.name}</Text>
          <Text style={styles.sanskrit}>{pillar.sanskritName}</Text>
          <View style={styles.meta}>
            <Text>
              Category: {pillar.category.charAt(0).toUpperCase() + pillar.category.slice(1)}
            </Text>
            <Text>·</Text>
            {pillar.defaultDurationMinutes > 0 && (
              <>
                <Text>{pillar.defaultDurationMinutes} min/day</Text>
                <Text>·</Text>
              </>
            )}
            <Text>{pillar.karmaPointsBase} karma points</Text>
          </View>
          <Text style={styles.tagline}>{content.tagline}</Text>
        </View>
        <View style={styles.footer}>
          <Text>10xvedictransform.com</Text>
          <Text>Cover</Text>
        </View>
      </Page>

      {/* ── Overview + Why it works ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text>{pageHeaderText}</Text>
          <Text>10X Vedic Transform</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleAccent}>OVERVIEW</Text>
          <Text style={styles.sectionTitle}>What is this practice?</Text>
          {content.overview.map((para, i) => (
            <Text key={i} style={styles.paragraph}>
              {para}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleAccent}>SCIENCE + TRADITION</Text>
          <Text style={styles.sectionTitle}>Why it works</Text>
          {content.whyItWorks.map((para, i) => (
            <Text key={i} style={styles.paragraph}>
              {para}
            </Text>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>10xvedictransform.com</Text>
          <Text>Page 2</Text>
        </View>
      </Page>

      {/* ── Daily practice ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text>{pageHeaderText}</Text>
          <Text>10X Vedic Transform</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleAccent}>DAILY GUIDE</Text>
          <Text style={styles.sectionTitle}>How to practice this today</Text>
          {content.dailyPractice.map((step, i) => (
            <View key={i} style={styles.step}>
              <Text style={styles.stepNumber}>{i + 1}.</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleAccent}>SCRIPTURE</Text>
          <Text style={styles.sectionTitle}>What the tradition says</Text>
          {content.scripture.map((s, i) => (
            <View key={i} style={styles.scriptureBlock}>
              <Text style={styles.scriptureText}>&ldquo;{s.text}&rdquo;</Text>
              <Text style={styles.scriptureCite}>— {s.verse}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>10xvedictransform.com</Text>
          <Text>Page 3</Text>
        </View>
      </Page>

      {/* ── Obstacles + closing ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text>{pageHeaderText}</Text>
          <Text>10X Vedic Transform</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleAccent}>TROUBLESHOOTING</Text>
          <Text style={styles.sectionTitle}>Common obstacles</Text>
          {content.obstacles.map((o, i) => (
            <View key={i} style={styles.obstacle}>
              <Text style={styles.obstacleQ}>{o.obstacle}</Text>
              <Text style={styles.obstacleA}>{o.remedy}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleAccent}>FOR YOUR DOSHA</Text>
          <Text style={styles.sectionTitle}>A note on constitution</Text>
          <Text style={styles.closing}>{content.closing}</Text>
        </View>

        <View style={styles.footer}>
          <Text>10xvedictransform.com</Text>
          <Text>Page 4 · End</Text>
        </View>
      </Page>
    </Document>
  );
}
