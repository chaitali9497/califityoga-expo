import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "@/src/types/Habit";

const KEY = "HABITS";

export const saveHabits = async (habits: Habit[]) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(habits));
};

export const loadHabits = async (): Promise<Habit[]> => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};
