import { useAuth } from "@/src/context/AuthContext";
import React, { createContext, useContext, useEffect, useState } from "react";

import { Habit } from "@/src/types/Habit";

import {
    completeHabit as completeHabitAPI,
    createHabit as createHabitAPI,
    deleteHabit as deleteHabitAPI,
    getAllHabits,
} from "@/src/services/habitService";

type HabitContextType = {
  habits: Habit[];
  loading: boolean;
  refreshHabits: () => Promise<void>;
  addHabit: (habit: Habit) => Promise<void>;
  completeHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
};

const HabitContext = createContext<HabitContextType>(null as any);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  const [loading, setLoading] = useState(true);

  const refreshHabits = async () => {
    try {
      const data = await getAllHabits();

      const habitList = Array.isArray(data) ? data : data?.habits || [];

      setHabits(habitList);
    } catch (error) {
      console.error("Failed to load habits:", error);
      setHabits([]);
    }
  };

  const { isLoading: authLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        if (authLoading) {
          return;
        }

        if (!isLoggedIn) {
          setHabits([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        await refreshHabits();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [authLoading, isLoggedIn]);

  const addHabit = async (habit: Habit) => {
    try {
      await createHabitAPI(habit);
      await refreshHabits();
    } catch (error) {
      console.error("Failed to create habit:", error);
      throw error;
    }
  };

  const completeHabit = async (id: string) => {
    if (!id) {
      console.warn("completeHabit called without id");
      return;
    }

    try {
      await completeHabitAPI(id);
      await refreshHabits();
    } catch (error) {
      console.error("Failed to complete habit:", error);
      throw error;
    }
  };

  const deleteHabit = async (id: string) => {
    if (!id) {
      console.warn("deleteHabit called without id");
      return;
    }

    try {
      await deleteHabitAPI(id);
      await refreshHabits();
    } catch (error) {
      console.error("Failed to delete habit:", error);
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
        deleteHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => useContext(HabitContext);
