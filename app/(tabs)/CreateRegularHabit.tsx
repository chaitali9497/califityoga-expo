import { colors } from "@/src/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { useHabits } from "@/src/context/HabitContext";
import HabitForm from "@/src/components/HabitForm";
import { Habit } from "@/src/types/Habit";
import AppAlert from "@/src/components/AppAlert";

export default function CreateRegularHabit() {
  const router = useRouter();
  const { addHabit } = useHabits();

  const handleCreate = async (habit: Habit) => {
    try {
      await addHabit(habit);
      router.back();
    } catch (error) {
      console.error("Failed to create habit:", error);
      setAlert({
        visible: true,
        type: "error",
        title: "Failed to create habit",
        message:
          (error as any)?.message ||
          "Unable to create habit. Please try again.",
        confirmText: "OK",
      });
    }
  };

  const [alert, setAlert] = useState<{
    visible: boolean;
    type?: "success" | "warning" | "error" | "info";
    title?: string;
    message?: string;
    confirmText?: string;
  }>({ visible: false });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HabitForm
        title="Create New Habit"
        submitLabel="Create Habit"
        onSubmit={handleCreate}
      />

      <AppAlert
        visible={alert.visible}
        type={alert.type || "error"}
        title={alert.title || "Error"}
        message={alert.message || ""}
        confirmText={alert.confirmText || "OK"}
        onConfirm={() => setAlert({ visible: false })}
      />
    </View>
  );
}
