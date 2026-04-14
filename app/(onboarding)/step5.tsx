import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import ProgressBar from "@/src/components/ProgressBar";
import { colors } from "@/src/theme/colors";

/* ---------- Options ---------- */

const OPTIONS = [
  { id: "healthy", label: "Build Healthy Habits", emoji: "🥗" },
  { id: "productivity", label: "Boost Productivity", emoji: "⚡" },
  { id: "personal_goals", label: "Achieve Personal Goals", emoji: "🏆" },
  { id: "stress", label: "Manage Stress & Anxiety", emoji: "🧘" },
  { id: "other", label: "Other (Specify)", emoji: "✨" },
] as const;

export default function Step5() {
  const router = useRouter();

  // ✅ LOCAL STATE (no context)
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const isValid = selected.length > 0;

  const continueNext = () => {
    // 🔹 Optionally pass data to next screen
    // router.push({ pathname: "./step6", params: { goals: selected.join(",") } });

    router.push("./step6");
  };

  return (
    <View style={styles.container}>
      <ProgressBar step={5} total={8} />

      <Text style={styles.title}>
        What do you want to achieve with Califitoga? 🎯
      </Text>

      <Text style={styles.subtitle}>
        Select all that apply. We’ll personalize your journey.
      </Text>

      <View style={styles.list}>
        {OPTIONS.map((option) => {
          const active = selected.includes(option.id);

          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => toggleOption(option.id)}
              activeOpacity={0.85}
            >
              <Text style={styles.emoji}>{option.emoji}</Text>

              <Text
                style={[styles.label, active && styles.labelActive]}
              >
                {option.label}
              </Text>

              {active && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.cta, !isValid && styles.ctaDisabled]}
        disabled={!isValid}
        onPress={continueNext}
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
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },

  list: {
    gap: 14,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },

  cardActive: {
    backgroundColor: colors.primary + "15",
    borderColor: colors.primary,
  },

  emoji: {
    fontSize: 20,
    marginRight: 12,
  },

  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  labelActive: {
    color: colors.primaryDark,
  },

  check: {
    fontSize: 18,
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
