import HabitForm from "@/src/components/HabitForm";
import { getHabitById, updateHabit } from "@/src/services/habitService";
import { colors } from "@/src/theme";
import { Habit } from "@/src/types/Habit";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Habit ID not provided.");
      setLoading(false);
      return;
    }

    const loadHabit = async () => {
      try {
        const data = await getHabitById(id);
        const fetchedHabit = data?.habit || data;
        setHabit(fetchedHabit);
      } catch (err) {
        console.error("Failed to load habit:", err);
        setError("Unable to load habit.");
      } finally {
        setLoading(false);
      }
    };

    loadHabit();
  }, [id]);

  const handleSave = async (updatedHabit: Habit) => {
    if (!id) return;
    await updateHabit(id, updatedHabit);
    router.back();
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !habit) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
          padding: 24,
        }}
      >
        <Text
          style={{ color: colors.textPrimary, fontSize: 16, marginBottom: 12 }}
        >
          {error || "Habit not found."}
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          Please return to the habits list and try again.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HabitForm
        initialValues={habit}
        title="Edit Habit"
        submitLabel="Save Changes"
        onSubmit={handleSave}
      />
    </View>
  );
}
