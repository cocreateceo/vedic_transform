import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { colors, spacing, radius, typography } from "@/theme";

interface ReportsResp {
  journeyDay: number;
  currentDay: number;
  totalKarma: number;
  todayEarned: number;
  badgesEarned: number;
  streak?: { currentStreak?: number; longestStreak?: number; shields?: number };
}

function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Pre-dawn blessings";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const { request } = useApi();
  const [data, setData] = useState<ReportsResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const res = await request<ReportsResp>("/data/reports");
    if (res.data) setData(res.data);
  };

  useEffect(() => {
    (async () => {
      await load();
      setLoading(false);
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const firstName = user?.name?.split(/\s+/)[0];
  const greeting = firstName ? `${timeOfDayGreeting()}, ${firstName}!` : `${timeOfDayGreeting()}!`;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={typography.h1}>{greeting}</Text>
        <Text style={[typography.caption, { marginTop: 2 }]}>
          Your 48-day transformation
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.saffron} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>Day</Text>
              <Text style={styles.heroNumber}>
                {data?.currentDay ?? 0}
                <Text style={styles.heroDenom}> / 48</Text>
              </Text>
            </View>

            <View style={styles.statRow}>
              <Stat label="Karma" value={data?.totalKarma ?? 0} accent={data?.todayEarned ? `+${data.todayEarned} today` : undefined} />
              <Stat label="Streak" value={data?.streak?.currentStreak ?? 0} accent={`best ${data?.streak?.longestStreak ?? 0}`} />
              <Stat label="Badges" value={data?.badgesEarned ?? 0} />
            </View>

            <Text style={styles.note}>
              Pull to refresh. Open the Pillars tab to start today's check-ins.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {accent && <Text style={styles.statAccent}>{accent}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream50 },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  heroCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.saffron,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  heroLabel: { ...typography.caption, textTransform: "uppercase", letterSpacing: 1.2 },
  heroNumber: { fontSize: 48, fontWeight: "700", color: colors.amber700, marginTop: 4 },
  heroDenom: { fontSize: 22, color: colors.gray400, fontWeight: "500" },
  statRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  statCard: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: "#fff",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  statValue: { fontSize: 22, fontWeight: "700", color: colors.gray800 },
  statLabel: { ...typography.caption, marginTop: 2 },
  statAccent: { fontSize: 11, color: colors.amber600, marginTop: 4, fontWeight: "600" },
  note: { ...typography.caption, marginTop: spacing.xl, textAlign: "center" },
});
