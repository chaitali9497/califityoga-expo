import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import ProgressBar from "@/src/components/ProgressBar";
import { useOnboarding } from "@/src/context/OnboardingContext";
import GreenMaterialTimePicker from "@/src/components/GreenTimePicker";
import { colors } from "@/src/theme/colors";

export default function Step2() {
  const router = useRouter();
  const { wakeUpTime, setWakeUpTime } = useOnboarding();

  const [openPicker, setOpenPicker] = useState(false);

  const isValid = Boolean(wakeUpTime);

  return (
    <View style={styles.container}>
      <ProgressBar step={2} total={8} />

      <Text style={styles.title}>Wake up ⏰</Text>
      <Text style={styles.subtitle}>
        Setting your wake-up time helps us create your personalized habit schedule.
      </Text>

      {/* Time display */}
      <TouchableOpacity
        style={styles.timeBox}
        onPress={() => setOpenPicker(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.timeText}>
          {wakeUpTime ?? "07:00 AM"}
        </Text>
      </TouchableOpacity>

      {/* GREEN MATERIAL PICKER */}
      <GreenMaterialTimePicker
        visible={openPicker}
        onClose={() => setOpenPicker(false)}
        onConfirm={(time: string) => {
          setWakeUpTime(time);
        }}
      />

      {/* Continue */}
      <TouchableOpacity
        style={[styles.cta, !isValid && styles.ctaDisabled]}
        disabled={!isValid}
        onPress={() => router.push("./step3")}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primaryDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  timeBox: {
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  timeText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary,
  },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },
  ctaDisabled: {
    opacity: 0.4,
  },
  ctaText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
