export type Habit = {
   _id?: string;
  id?: string;

  name: string;
  icon: string;
  color: string;

  habitType: "Regular" | "OneTime";

  repeat: "Daily" | "Weekly" | "Monthly";

  weeklyDays?: string[];

  monthlyDate?: number;

  monthlyDates?: number[];

  timeOfDay:
    | "Morning"
    | "Afternoon"
    | "Evening";

  reminderTime?: string;

  streak: number;

  longestStreak?: number;

  lastCompleted?: string | null;

  completionHistory?: string[];
};