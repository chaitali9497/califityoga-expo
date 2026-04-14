import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import ProgressBar from "@/src/components/ProgressBar";
import {
  useOnboarding,
  ProcrastinationLevel,
} from "@/src/context/OnboardingContext";
import { colors } from "@/src/theme/colors";

const OPTIONS: Exclude<ProcrastinationLevel, null>[] = [
  "Always",
  "Sometimes",
  "Rarely",
  "Never",
];

export default function Step4() {
  const router = useRouter();
  const { procrastination, setProcrastination } = useOnboarding();

  const [selected, setSelected] =
    useState<ProcrastinationLevel>(procrastination);

  const handleSelect = (value: ProcrastinationLevel) => {
    setSelected(value);
    setProcrastination(value);
  };

  const isValid = Boolean(selected);

  return (
    <View style={styles.container}>
      <ProgressBar step={4} total={8} />

      <Text style={styles.title}>
        Do you often procrastinate? 👀
      </Text>

      <Text style={styles.subtitle}>
        Understanding this helps us tailor strategies for you.
      </Text>

      {OPTIONS.map((item) => {
        const isSelected = selected === item;

        return (
          <TouchableOpacity
            key={item}
            style={[
              styles.option,
              isSelected && styles.optionSelected,
            ]}
            onPress={() => handleSelect(item)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[styles.cta, !isValid && styles.ctaDisabled]}
        disabled={!isValid}
        onPress={() => router.push("./step5")}
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
    marginBottom: 24,
    lineHeight: 20,
  },

  /* ---------- Options ---------- */

  option: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: 12,
  },

  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.inputBg,
  },

  optionText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimary,
  },

  optionTextSelected: {
    fontWeight: "600",
    color: colors.primaryDark,
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
    fontWeight: "600",
    fontSize: 16,
  },
});
