import express, { Response } from "express";
import Habit from "../models/Habit";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get all habits for user
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json(habits);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch habits" });
  }
});

// Create habit
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, frequency, color, icon } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: "Title and category are required" });
    }

    const habit = new Habit({
      userId: req.userId,
      title,
      description,
      category,
      frequency: frequency || "daily",
      color: color || "#2E7D32",
      icon: icon || "📝",
    });

    await habit.save();

    res.status(201).json({
      message: "Habit created successfully",
      habit,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create habit" });
  }
});

// Get habit by ID
router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json(habit);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch habit" });
  }
});

// Update habit
router.put("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, frequency, color, icon } = req.body;

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        title,
        description,
        category,
        frequency,
        color,
        icon,
      },
      { new: true },
    );

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json({
      message: "Habit updated successfully",
      habit,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update habit" });
  }
});

// Delete habit
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json({ message: "Habit deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete habit" });
  }
});

export default router;
