import { colors } from "@/src/theme";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useHabits } from "@/src/context/HabitContext";
import HabitForm from "@/src/components/HabitForm";
import { Habit } from "@/src/types/Habit";

export default function CreateRegularHabit() {
  const router = useRouter();
  const { addHabit } = useHabits();

  const handleCreate = async (habit: Habit) => {
    await addHabit(habit);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HabitForm
        title="Create New Habit"
        submitLabel="Create Habit"
        onSubmit={handleCreate}
      />
    </View>
  );
}
