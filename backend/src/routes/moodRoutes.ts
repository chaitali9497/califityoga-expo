import express, { Response } from "express";
import Mood from "../models/Mood";
import {
  authenticateToken,
  AuthRequest,
} from "../middleware/auth";

const router = express.Router();

/**
 * SAVE OR UPDATE MOOD
 */
router.post(
  "/",
  authenticateToken,
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const {
        date,
        mood,
        feeling,
        note,
      } = req.body;

      // Validation
      if (!date || !mood) {
        return res.status(400).json({
          error: "date and mood are required",
        });
      }

      const existing = await Mood.findOne({
        userId: req.userId,
        date,
      });

      if (existing) {
        existing.mood = mood;
        existing.feeling = feeling || "";
        existing.note = note || "";

        await existing.save();

        return res.json({
          message: "Mood updated successfully",
          mood: existing,
        });
      }

      const moodEntry = await Mood.create({
        userId: req.userId,
        date,
        mood,
        feeling: feeling || "",
        note: note || "",
      });

      return res.status(201).json({
        message: "Mood saved successfully",
        mood: moodEntry,
      });
    } catch (error: any) {
      console.error("❌ SAVE MOOD ERROR:", error);

      return res.status(500).json({
        error:
          error.message || "Failed to save mood",
      });
    }
  }
);

/**
 * GET ALL MOODS
 */
router.get(
  "/",
  authenticateToken,
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const moods = await Mood.find({
        userId: req.userId,
      }).sort({ date: -1 });

      return res.json(moods);
    } catch (error: any) {
      console.error("❌ GET MOODS ERROR:", error);

      return res.status(500).json({
        error:
          error.message || "Failed to fetch moods",
      });
    }
  }
);

export default router;