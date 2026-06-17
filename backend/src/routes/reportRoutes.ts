import express, { Response } from "express";
import Habit from "../models/Habit";
import {
authenticateToken,
AuthRequest,
} from "../middleware/auth";

const router = express.Router();

/**

* GET REPORT DATA
  */
  router.get(
  "/",
  authenticateToken,
  async (
  req: AuthRequest,
  res: Response
  ) => {
  try {
  const habits =
  await Habit.find({
  userId: req.userId,
  });

  const totalHabits =
  habits.length;

  const today =
  new Date()
  .toISOString()
  .split("T")[0];

  const completedToday =
  habits.filter(
  (habit) =>
  habit.lastCompleted &&
  habit.lastCompleted.startsWith(
  today
  )
  ).length;

  const completionRate =
  totalHabits > 0
  ? Math.round(
  (completedToday /
  totalHabits) *
  100
  )
  : 0;

  const currentStreak =
  habits.length > 0
  ? Math.max(
  ...habits.map(
  (h) =>
  h.streak || 0
  )
  )
  : 0;

  const longestStreak =
  habits.length > 0
  ? Math.max(
  ...habits.map(
  (h) =>
  h.longestStreak ||
  0
  )
  )
  : 0;

  const perfectDays =
  habits.filter(
  (h) =>
  (h.streak || 0) >= 7
  ).length;

  return res.json({
  totalHabits,
  completedToday,
  completionRate,
  currentStreak,
  longestStreak,
  perfectDays,
  });
  } catch (error: any) {
  console.error(
  "❌ REPORT ERROR:",
  error
  );

  return res.status(500).json({
  error:
  error.message ||
  "Failed to generate report",
  });
  }
  }
  );

export default router;
