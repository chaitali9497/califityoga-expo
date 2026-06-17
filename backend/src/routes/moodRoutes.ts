import express, {
  Response,
} from "express";

import Mood from "../models/Mood";

import {
  authenticateToken,
  AuthRequest,
} from "../middleware/auth";

const router =
  express.Router();

/**
 * SAVE MOOD
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

      const existing =
        await Mood.findOne({
          userId: req.userId,
          date,
        });

      if (existing) {
        existing.mood = mood;
        existing.feeling =
          feeling;
        existing.note = note;

        await existing.save();

        return res.json(
          existing
        );
      }

      const moodEntry =
        await Mood.create({
          userId: req.userId,
          date,
          mood,
          feeling,
          note,
        });

      res.status(201).json(
        moodEntry
      );
    } catch (error: any) {
      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

/**
 * GET MOODS
 */
router.get(
  "/",
  authenticateToken,
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const moods =
      await Mood.find({
        userId: req.userId,
      });

    res.json(moods);
  }
);

export default router;