import { useEffect } from "react";
import { View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";
import { colors } from "@/theme";

export default function RootLayout() {
  const auth = useAuthProvider();
  // Cast through string[] — useSegments() under typed routes returns a
  // narrow tuple union we don't need to discriminate against.
  const segments = useSegments() as unknown as string[];
  const router = useRouter();

  // Auth gate. Mirrors the web's (main) layout: redirect to /(auth)/login
  // if there's no user, or out of /(auth) once we have one. Onboarding
  // status is checked too so we don't drop new users straight into tabs.
  useEffect(() => {
    if (auth.loading) return;
    const inAuthGroup = segments[0] === "(auth)";
    const onOnboarding = inAuthGroup && segments[1] === "onboarding";

    if (!auth.user && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (auth.user && !auth.user.onboardingCompleted && !onOnboarding) {
      router.replace("/(auth)/onboarding");
      return;
    }

    if (auth.user && auth.user.onboardingCompleted && inAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [auth.user, auth.loading, segments, router]);

  if (auth.loading) {
    return <View style={{ flex: 1, backgroundColor: colors.cream50 }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContext.Provider value={auth}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.cream50 },
            }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="more-menu"
              options={{ presentation: "modal", title: "More" }}
            />
          </Stack>
        </SafeAreaProvider>
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}
