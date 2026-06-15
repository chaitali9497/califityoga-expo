import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { OnboardingProvider } from "@/src/context/OnboardingContext";
import { HabitProvider } from "@/src/context/HabitContext";
import { AuthProvider } from "@/src/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <HabitProvider>
          <View style={styles.page}>
            <Stack screenOptions={{ headerShown: false }} />
          </View>
        </HabitProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    marginTop: 25,
    marginBottom: 50,
  },
});
