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
        title,
        description,
        category,
        frequency,
        color,
        icon,
      } = req.body;

      if (!title || !category) {
        return res.status(400).json({
          error:
            "Title and category are required",
        });
      }

      const habit = new Habit({
        userId: req.userId,

        title,

        description,

        category,

        frequency:
          frequency || "daily",

        color:
          color || "#2E7D32",

        icon: icon || "📝",
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
        title,
        description,
        category,
        frequency,
        color,
        icon,
      } = req.body;

      const habit =
        await Habit.findOneAndUpdate(
          {
            _id: req.params.id,
            userId: req.userId,
          },
          {
            title,
            description,
            category,
            frequency,
            color,
            icon,
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