import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { colors, spacing, radius, typography } from "@/theme";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!email.trim() || !password) return;
    setBusy(true);
    setError(null);
    const { error: err } = await register(email.trim(), password, name.trim() || undefined);
    setBusy(false);
    if (err) setError(err);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.brand}>
          <Text style={styles.brandMark}>ॐ</Text>
          <Text style={styles.brandTitle}>10X Vedic</Text>
          <Text style={styles.brandSubtitle}>Begin your 48-day journey</Text>
        </View>

        <View style={styles.form}>
          <Text style={typography.h2}>Create your account</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name (optional)"
            autoCapitalize="words"
            style={styles.input}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            style={styles.input}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            onPress={onSubmit}
            disabled={busy || !email || !password}
            style={[
              styles.submit,
              (busy || !email || !password) && { opacity: 0.5 },
            ]}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={typography.caption}>Already have an account? </Text>
            <Link href="/(auth)/login" style={styles.link}>
              Sign in
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream50 },
  kav: { flex: 1, padding: spacing.lg, justifyContent: "center" },
  brand: { alignItems: "center", marginBottom: spacing.xl },
  brandMark: { fontSize: 64, color: colors.saffron, marginBottom: spacing.sm },
  brandTitle: { ...typography.h1, color: colors.amber700 },
  brandSubtitle: { ...typography.caption, marginTop: 2 },
  form: { gap: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  error: { color: colors.error, fontSize: 13 },
  submit: {
    backgroundColor: colors.saffron,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  submitText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  link: { color: colors.amber600, fontWeight: "600", fontSize: 13 },
});
