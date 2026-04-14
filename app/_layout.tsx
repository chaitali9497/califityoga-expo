import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { OnboardingProvider } from "@/src/context/OnboardingContext";
import { HabitProvider } from "@/src/context/HabitContext";

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <HabitProvider>
        <View style={styles.page}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </HabitProvider>
    </OnboardingProvider>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    marginTop: 25,
    marginBottom: 50,
  },
});
