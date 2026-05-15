import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { colors, spacing, radius, typography } from "@/theme";

// Lightweight onboarding stub. Web has a 6-step quiz that flows into the
// dosha test; mobile can launch with just a "I'm ready, take me in" button
// and the deeper survey can ship later.
export default function OnboardingScreen() {
  const { request } = useApi();
  const { refreshUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const beginJourney = async () => {
    setBusy(true);
    setError(null);

    // 1) Mark onboarding complete so the root layout releases the gate.
    const userRes = await request("/data/user", {
      method: "PATCH",
      body: { onboardingCompleted: true, onboardingData: { source: "mobile" } },
    });
    if (userRes.error) {
      setBusy(false);
      setError(userRes.error);
      return;
    }

    // 2) Start the 48-day journey (no-op if one is already active).
    await request("/data/journey", {
      method: "POST",
      body: { action: "start" },
    });

    await refreshUser();
    setBusy(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.mark}>ॐ</Text>
        <Text style={typography.h1}>Welcome to your journey</Text>
        <Text style={[typography.body, { textAlign: "center", marginTop: spacing.md, lineHeight: 22 }]}>
          The 10X Vedic Transformation is a 48-day commitment across 11
          ancient practices for body, mind, and spirit.
        </Text>
        <Text style={[typography.body, { textAlign: "center", marginTop: spacing.sm, lineHeight: 22 }]}>
          Daily check-ins build streaks, unlock badges, and grow karma. Begin
          when you're ready — tomorrow morning at dawn is the traditional time.
        </Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          onPress={beginJourney}
          disabled={busy}
          style={[styles.cta, busy && { opacity: 0.6 }]}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaText}>Begin my 48-day journey</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream50 },
  container: {
    flex: 1,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  mark: { fontSize: 72, color: colors.saffron, marginBottom: spacing.md },
  error: { color: colors.error, marginTop: spacing.sm },
  cta: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.saffron,
    borderRadius: radius.pill,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
