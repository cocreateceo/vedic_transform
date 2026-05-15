import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/theme";

// Placeholder. Full ports of the 5 web session screens (Morning Routine,
// Meditation, Breathing, Fasting, Movement) come next — they need
// react-native equivalents for Web Audio API + setInterval timers.
export default function SessionsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <Text style={typography.h1}>Sessions</Text>
        <Text style={[typography.caption, { marginTop: 2 }]}>
          Guided meditation, breathing, fasting & movement timers
        </Text>

        <View style={styles.placeholder}>
          <MaterialCommunityIcons name="timer-sand" size={48} color={colors.amber600} />
          <Text style={[typography.h3, { marginTop: spacing.md }]}>Coming next</Text>
          <Text style={[typography.body, { textAlign: "center", marginTop: spacing.sm, color: colors.gray500 }]}>
            Native ports of the 5 guided session timers (Morning Routine,
            Meditation, Breathing, Fasting, Movement). Each one will use
            expo-av for audio cues and persist progress through the same
            /data/checkin API the web already uses.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream50 },
  container: { flex: 1, padding: spacing.lg },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
});
