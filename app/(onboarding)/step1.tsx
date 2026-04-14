import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import ProgressBar from "@/src/components/ProgressBar";
import { useOnboarding, SleepDuration } from "@/src/context/OnboardingContext";

const OPTIONS: Exclude<SleepDuration, null>[] = [
  "Less than 6 hours",
  "6 - 7 hours",
  "7 - 8 hours",
  "8 - 9 hours",
  "More than 9 hours",
];

export default function Step1() {
  const router = useRouter();
  const { sleepDuration, setSleepDuration } = useOnboarding();
  const [selected, setSelected] =
    useState<SleepDuration>(sleepDuration);

  const handleSelect = (item: SleepDuration) => {
    setSelected(item);
    setSleepDuration(item);
  };

  const isValid = Boolean(selected);

  return (
    <View style={styles.container}>
      <ProgressBar step={1} total={8} />

      <Text style={styles.title}>
        How long do you usually sleep at night? 😴
      </Text>

      <Text style={styles.subtitle}>
        Understanding your sleep patterns helps us tailor your experience.
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
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        );
      })}

      {/* ✅ Continue Button */}
      <TouchableOpacity
        style={[
          styles.cta,
          !isValid && styles.ctaDisabled,
        ]}
        disabled={!isValid}
        onPress={() => router.push("./step2")}
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
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F7A1F",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7C6B",
    marginBottom: 28,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8F5E8",
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },

  optionSelected: {
    borderColor: "#7C7CF2", // highlight like image
    backgroundColor: "#F4F5FF",
  },

  optionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2E7D32",
  },

  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },

  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  ctaDisabled: {
  opacity: 0.5,
},

});
