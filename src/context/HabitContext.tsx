import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Habit } from "@/src/types/Habit";

import {
  getAllHabits,
  createHabit as createHabitAPI,
  completeHabit as completeHabitAPI,
} from "@/src/services/habitService";

type HabitContextType = {
  habits: Habit[];
  loading: boolean;
  refreshHabits: () => Promise<void>;
  addHabit: (
    habit: Habit
  ) => Promise<void>;
  completeHabit: (
    id: string
  ) => Promise<void>;
};

const HabitContext =
  createContext<HabitContextType>(
    null as any
  );

export const HabitProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [habits, setHabits] =
    useState<Habit[]>([]);

  const [loading, setLoading] =
    useState(true);

  const refreshHabits =
    async () => {
      try {
        const data =
          await getAllHabits();

        const habitList =
          Array.isArray(data)
            ? data
            : data?.habits || [];

        setHabits(habitList);
      } catch (error) {
        console.error(
          "Failed to load habits:",
          error
        );
        setHabits([]);
      }
    };

  useEffect(() => {
    const init = async () => {
      try {
        await refreshHabits();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const addHabit = async (
    habit: Habit
  ) => {
    try {
      await createHabitAPI(habit);
      await refreshHabits();
    } catch (error) {
      console.error(
        "Failed to create habit:",
        error
      );
      throw error;
    }
  };

  const completeHabit =
    async (id: string) => {
      if (!id) {
        console.warn(
          "completeHabit called without id"
        );
        return;
      }

      try {
        await completeHabitAPI(id);
        await refreshHabits();
      } catch (error) {
        console.error(
          "Failed to complete habit:",
          error
        );
        throw error;
      }
    };

  return (
    <HabitContext.Provider
      value={{
        habits,
        loading,
        refreshHabits,
        addHabit,
        completeHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () =>
  useContext(HabitContext);