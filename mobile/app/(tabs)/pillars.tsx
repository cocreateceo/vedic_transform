import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useApi } from "@/hooks/useApi";
import { PILLARS, type Pillar } from "@/lib/pillars";
import { colors, spacing, radius, typography } from "@/theme";

export default function PillarsScreen() {
  const { request } = useApi();
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  const loadCompleted = useCallback(async () => {
    const res = await request<{ completedPillars?: string[] }>("/data/checkin");
    setCompleted(res.data?.completedPillars || []);
  }, [request]);

  useEffect(() => {
    (async () => {
      await loadCompleted();
      setLoading(false);
    })();
  }, [loadCompleted]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCompleted();
    setRefreshing(false);
  };

  const checkIn = async (p: Pillar) => {
    if (checkingIn || completed.includes(p.slug)) return;
    setCheckingIn(p.slug);
    const res = await request("/data/checkin", {
      method: "POST",
      body: { pillarSlug: p.slug },
    });
    if (!res.error) await loadCompleted();
    setCheckingIn(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={typography.h1}>11 Pillars</Text>
        <Text style={[typography.caption, { marginTop: 2 }]}>
          {completed.length} of {PILLARS.length} completed today
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.saffron} style={{ marginTop: spacing.xl }} />
        ) : (
          <View style={styles.grid}>
            {PILLARS.map((p) => {
              const done = completed.includes(p.slug);
              const busy = checkingIn === p.slug;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => checkIn(p)}
                  disabled={done || busy}
                  style={[styles.card, done && styles.cardDone]}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.iconBubble,
                      { backgroundColor: `${p.color}22` },
                    ]}
                  >
                    <MaterialCommunityIcons name={p.icon as any} size={24} color={p.color} />
                  </View>
                  <Text style={styles.cardName} numberOfLines={2}>
                    {p.name}
                  </Text>
                  <Text style={styles.cardSanskrit}>{p.sanskritName}</Text>
                  <View style={styles.footerRow}>
                    <Text style={styles.karma}>+{p.karmaPointsBase} karma</Text>
                    {done && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={18}
                        color={colors.success}
                      />
                    )}
                    {busy && <ActivityIndicator size="small" color={colors.saffron} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream50 },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  card: {
    width: "48.5%",
    backgroundColor: "#fff",
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  cardDone: {
    borderColor: colors.success,
    backgroundColor: "#F0FDF4",
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  cardName: { ...typography.bodyBold, fontSize: 14 },
  cardSanskrit: { ...typography.caption, color: colors.amber600, marginTop: 2 },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  karma: { fontSize: 11, color: colors.amber700, fontWeight: "600" },
});
