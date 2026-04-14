import React, { createContext, useContext, useEffect, useState } from "react";
import { Habit } from "@/src/types/Habit";
import { loadHabits, saveHabits } from "@/src/store/habitStorage";

type HabitContextType = {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  completeHabit: (id: string) => void;
};

const HabitContext = createContext<HabitContextType>(null as any);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      const stored = await loadHabits();
      if (stored) {
        setHabits(stored);
      }
      setIsLoaded(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveHabits(habits);
    }
  }, [habits, isLoaded]);

  const addHabit = (habit: Habit) => {
    setHabits((prev) => [...prev, habit]);
  };

  const completeHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              streak: h.streak + 1,
              lastCompleted: new Date().toISOString(),
            }
          : h
      )
    );
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, completeHabit }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => useContext(HabitContext);