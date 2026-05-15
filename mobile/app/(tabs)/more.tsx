import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { colors, spacing, radius, typography } from "@/theme";

interface RowDef {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  description?: string;
  status?: "stub" | "ready";
}

// All the menu items that don't fit in the bottom tab bar. Each links to a
// placeholder for now; the implementations come in follow-up commits.
const SECTIONS: { title: string; rows: RowDef[] }[] = [
  {
    title: "Track",
    rows: [
      { label: "Goals", icon: "target", description: "Weekly goals + focus pillars", status: "stub" },
      { label: "Progress", icon: "chart-line", description: "Charts & 48-day heatmap", status: "stub" },
      { label: "Mood", icon: "emoticon-happy-outline", description: "Daily check-in", status: "stub" },
    ],
  },
  {
    title: "Discover",
    rows: [
      { label: "Library", icon: "library-shelves", description: "Mantras, articles, guides", status: "stub" },
      { label: "Wisdom", icon: "book-open-page-variant", description: "Daily quote", status: "stub" },
      { label: "Dosha Quiz", icon: "yin-yang", description: "Ayurvedic constitution", status: "stub" },
    ],
  },
  {
    title: "Achievements",
    rows: [
      { label: "Achievements", icon: "trophy-outline", description: "Badges + karma", status: "stub" },
      { label: "Insights", icon: "lightbulb-outline", description: "Personalized insights", status: "stub" },
      { label: "Reports", icon: "file-document-outline", description: "Export progress as CSV", status: "stub" },
    ],
  },
  {
    title: "Settings",
    rows: [
      { label: "Reminders", icon: "bell-outline", description: "Push reminder times", status: "stub" },
      { label: "Settings", icon: "cog-outline", description: "Profile + account", status: "stub" },
    ],
  },
];

export default function MoreScreen() {
  const { user, logout } = useAuth();

  const handleRowPress = (label: string) => {
    Alert.alert(
      label,
      "This screen is coming next. The web version is live and feature-complete; the mobile port lands in a follow-up commit.",
      [{ text: "OK" }],
    );
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Sign out of your account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={typography.h1}>More</Text>
        {user?.email && (
          <Text style={[typography.caption, { marginTop: 2 }]}>{user.email}</Text>
        )}

        {SECTIONS.map((section) => (
          <View key={section.title} style={{ marginTop: spacing.lg }}>
            <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
            <View style={styles.card}>
              {section.rows.map((row, idx) => (
                <TouchableOpacity
                  key={row.label}
                  onPress={() => handleRowPress(row.label)}
                  style={[
                    styles.row,
                    idx < section.rows.length - 1 && styles.rowBorder,
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconBox}>
                    <MaterialCommunityIcons name={row.icon} size={20} color={colors.amber600} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.bodyBold}>{row.label}</Text>
                    {row.description && <Text style={typography.caption}>{row.description}</Text>}
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={colors.gray400} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={handleSignOut} style={styles.signOut}>
          <MaterialCommunityIcons name="logout" size={18} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream50 },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: colors.gray400,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray100,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.cream100,
    alignItems: "center",
    justifyContent: "center",
  },
  signOut: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: radius.md,
  },
  signOutText: { color: colors.error, fontWeight: "600" },
});
