import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApi } from "@/hooks/useApi";
import { colors, spacing, radius, typography } from "@/theme";

interface JournalGet {
  todayGratitude?: { gratitude1?: string; gratitude2?: string; gratitude3?: string } | null;
  todayIntention?: { intentionText?: string } | null;
}

export default function JournalScreen() {
  const { request } = useApi();
  const [g, setG] = useState<[string, string, string]>(["", "", ""]);
  const [intention, setIntention] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingG, setSavingG] = useState(false);
  const [savingI, setSavingI] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const load = async () => {
    const res = await request<JournalGet>("/data/journal");
    if (res.data?.todayGratitude) {
      const tg = res.data.todayGratitude;
      setG([tg.gratitude1 || "", tg.gratitude2 || "", tg.gratitude3 || ""]);
    }
    if (res.data?.todayIntention?.intentionText) {
      setIntention(res.data.todayIntention.intentionText);
    }
  };

  useEffect(() => {
    (async () => {
      await load();
      setLoading(false);
    })();
  }, []);

  const showSaved = (which: string) => {
    setSavedAt(which);
    setTimeout(() => setSavedAt(null), 2000);
  };

  const saveGratitude = async () => {
    setSavingG(true);
    await request("/data/journal", {
      method: "POST",
      body: {
        type: "gratitude",
        gratitude1: g[0] || null,
        gratitude2: g[1] || null,
        gratitude3: g[2] || null,
      },
    });
    // Credit the Gratitude pillar (server dedupes same-day).
    if (g.some((x) => x.trim())) {
      await request("/data/checkin", {
        method: "POST",
        body: { pillarSlug: "gratitude" },
      });
    }
    setSavingG(false);
    showSaved("gratitude");
  };

  const saveIntention = async () => {
    if (!intention.trim()) return;
    setSavingI(true);
    await request("/data/journal", {
      method: "POST",
      body: { type: "intention", intentionText: intention.trim() },
    });
    await request("/data/checkin", {
      method: "POST",
      body: { pillarSlug: "thoughts-intention" },
    });
    setSavingI(false);
    showSaved("intention");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ActivityIndicator color={colors.saffron} style={{ marginTop: spacing.xl }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={typography.h1}>Journal</Text>
        <Text style={[typography.caption, { marginTop: 2 }]}>
          Gratitude & intention for today
        </Text>

        {savedAt && (
          <View style={styles.savedBanner}>
            <Text style={styles.savedText}>
              Saved {savedAt === "gratitude" ? "gratitude" : "intention"} ✓
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={typography.h3}>Today's Gratitude</Text>
          {[0, 1, 2].map((i) => (
            <TextInput
              key={i}
              value={g[i]}
              onChangeText={(t) => {
                const next: [string, string, string] = [...g] as [string, string, string];
                next[i] = t;
                setG(next);
              }}
              placeholder={`I am grateful for...`}
              multiline
              style={styles.input}
            />
          ))}
          <TouchableOpacity
            onPress={saveGratitude}
            disabled={savingG}
            style={[styles.submit, savingG && { opacity: 0.6 }]}
          >
            {savingG ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Save Gratitude (+10 karma)</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={typography.h3}>Today's Intention</Text>
          <TextInput
            value={intention}
            onChangeText={setIntention}
            placeholder="My intention for today is..."
            multiline
            style={[styles.input, { minHeight: 80 }]}
          />
          <TouchableOpacity
            onPress={saveIntention}
            disabled={savingI || !intention.trim()}
            style={[styles.submit, (savingI || !intention.trim()) && { opacity: 0.6 }]}
          >
            {savingI ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Set Intention (+12 karma)</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream50 },
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  card: {
    backgroundColor: "#fff",
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray100,
    gap: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  submit: {
    backgroundColor: colors.saffron,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  submitText: { color: "#fff", fontWeight: "600" },
  savedBanner: {
    backgroundColor: "#DCFCE7",
    borderColor: colors.success,
    borderWidth: 1,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  savedText: { color: "#166534", fontWeight: "600" },
});
