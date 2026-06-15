import express, { Response } from "express";
import Habit from "../models/Habit";

import {
  authenticateToken,
  AuthRequest,
} from "../middleware/auth";

const router = express.Router();

/**
 * GET ALL HABITS
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
        }).sort({
          createdAt: -1,
        });

      return res.json(habits);
    } catch (error: any) {
      console.error(
        "❌ GET HABITS ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Failed to fetch habits",
      });
    }
  }
);

/**
 * CREATE HABIT
 */
router.post(
  "/",
  authenticateToken,
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      console.log(
        "📥 CREATE HABIT BODY:",
        req.body
      );

      const {
        name,
        icon,
        color,
        habitType,
        repeat,
        weeklyDays,
        monthlyDate,
        monthlyDates,
        timeOfDay,
        reminderTime,
        streak,
        lastCompleted,
      } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Habit name is required",
        });
      }

      const habit = new Habit({
        userId: req.userId,

        name,

        icon: icon || "📝",

        color:
          color || "#2E7D32",

        habitType:
          habitType || "Regular",

        repeat:
          repeat || "Daily",

        weeklyDays:
          weeklyDays || [],

        monthlyDate,

        monthlyDates:
          monthlyDates || [],

        timeOfDay:
          timeOfDay || "Morning",

        reminderTime,

        streak:
          streak ?? 0,

        lastCompleted:
          lastCompleted ?? null,
      });

      await habit.save();

      return res.status(201).json({
        message:
          "Habit created successfully",

        habit,
      });
    } catch (error: any) {
      console.error(
        "❌ CREATE HABIT ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Failed to create habit",
      });
    }
  }
);

/**
 * GET HABIT BY ID
 */
router.get(
  "/:id",
  authenticateToken,
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const habit =
        await Habit.findOne({
          _id: req.params.id,
          userId: req.userId,
        });

      if (!habit) {
        return res.status(404).json({
          error: "Habit not found",
        });
      }

      return res.json(habit);
    } catch (error: any) {
      console.error(
        "❌ GET HABIT ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Failed to fetch habit",
      });
    }
  }
);

/**
 * UPDATE HABIT
 */
router.put(
  "/:id",
  authenticateToken,
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const {
        name,
        icon,
        color,
        habitType,
        repeat,
        weeklyDays,
        monthlyDate,
        monthlyDates,
        timeOfDay,
        reminderTime,
        streak,
        lastCompleted,
      } = req.body;

      const habit =
        await Habit.findOneAndUpdate(
          {
            _id: req.params.id,
            userId: req.userId,
          },
          {
            name,
            icon,
            color,
            habitType,
            repeat,
            weeklyDays,
            monthlyDate,
            monthlyDates,
            timeOfDay,
            reminderTime,
            streak,
            lastCompleted,
          },
          {
            new: true,
          }
        );

      if (!habit) {
        return res.status(404).json({
          error: "Habit not found",
        });
      }

      return res.json({
        message:
          "Habit updated successfully",
        habit,
      });
    } catch (error: any) {
      console.error(
        "❌ UPDATE HABIT ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Failed to update habit",
      });
    }
  }
);

/**
 * COMPLETE HABIT
 */
/**

* COMPLETE HABIT
  */
  router.patch(
  "/:id/complete",
  authenticateToken,
  async (
  req: AuthRequest,
  res: Response
  ) => {
  try {
  const habit =
  await Habit.findOne({
  _id: req.params.id,
  userId: req.userId,
  });

  if (!habit) {
  return res.status(404).json({
  error: "Habit not found",
  });
  }

  const today =
  new Date().toISOString();

  habit.streak =
  (habit.streak || 0) + 1;

  habit.longestStreak = Math.max(
  habit.longestStreak || 0,
  habit.streak
  );

  habit.lastCompleted =
  today;

  if (!habit.completionHistory) {
  habit.completionHistory = [];
  }

  habit.completionHistory.push(
  new Date()
  );

  await habit.save();

  return res.json({
  message:
  "Habit completed successfully",
  habit,
  });
  } catch (error: any) {
  console.error(
  "❌ COMPLETE HABIT ERROR:",
  error
  );

  return res.status(500).json({
  error:
  error.message ||
  "Failed to complete habit",
  });
  }
  }
  );




/**
 * DELETE HABIT
 */
router.delete(
  "/:id",
  authenticateToken,
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const habit =
        await Habit.findOneAndDelete({
          _id: req.params.id,
          userId: req.userId,
        });

      if (!habit) {
        return res.status(404).json({
          error: "Habit not found",
        });
      }

      return res.json({
        message:
          "Habit deleted successfully",
      });
    } catch (error: any) {
      console.error(
        "❌ DELETE HABIT ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Failed to delete habit",
      });
    }
  }
);

export default router;