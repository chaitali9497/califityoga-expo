import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import ProgressBar from "@/src/components/ProgressBar";
import { useOnboarding } from "@/src/context/OnboardingContext";
import GreenMaterialTimePicker from "@/src/components/GreenTimePicker";
import { colors } from "@/src/theme/colors";

export default function Step3() {
  const router = useRouter();
  const { endDayTime, setEndDayTime } = useOnboarding();

  const [showClock, setShowClock] = useState(false);

  const isValid = Boolean(endDayTime);

  return (
    <View style={styles.container}>
      <ProgressBar step={3} total={8} />

      {/* ---------- TITLE ---------- */}
      <Text style={styles.title}>
        What time do you usually end your day? 🌙
      </Text>

      <Text style={styles.subtitle}>
        Let us know when you typically end your day to optimize your habit
        tracking.
      </Text>

      {/* ---------- TIME PICKER TRIGGER ---------- */}
      <TouchableOpacity
        style={styles.timeBox}
        onPress={() => setShowClock(true)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.timeText,
            !endDayTime && styles.timePlaceholder,
          ]}
        >
          {endDayTime || "11:00 PM"}
        </Text>
      </TouchableOpacity>

      {/* ---------- TIME PICKER MODAL ---------- */}
      <GreenMaterialTimePicker
        visible={showClock}
        onClose={() => setShowClock(false)}
        onConfirm={(time) => {
          setEndDayTime(time);
          setShowClock(false);
        }}
      />

      {/* ---------- CONTINUE ---------- */}
      <TouchableOpacity
        style={[styles.cta, !isValid && styles.ctaDisabled]}
        disabled={!isValid}
        onPress={() => router.push("./step4")}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 28,
    lineHeight: 20,
  },

  /* ---------- Time Display ---------- */

  timeBox: {
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    marginBottom: 40,
  },

  timeText: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
  },

  timePlaceholder: {
    color: colors.textSecondary,
    fontWeight: "500",
  },

  /* ---------- CTA ---------- */

  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    elevation: 4,
  },

  ctaDisabled: {
    backgroundColor: colors.border,
  },

  ctaText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
