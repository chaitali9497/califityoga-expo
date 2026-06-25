import express, {
  Request,
  Response,
} from "express";

import {
  generateToken,
  authenticateToken,
  AuthRequest,
} from "../middleware/auth";

import User from "../models/User";

const router = express.Router();

/**
 * REGISTER
 */
router.post(
  "/register",
  async (req: Request, res: Response) => {
    try {
      const {
        email,
        password,
        name,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error:
            "Email and password are required",
        });
      }

      const normalizedEmail =
        String(email)
          .toLowerCase()
          .trim();

      const existingUser =
        await User.findOne({
          email: normalizedEmail,
        });

      if (existingUser) {
        return res.status(409).json({
          error:
            "User already exists",
        });
      }

      const user = new User({
        email: normalizedEmail,
        password,
        name:
          typeof name === "string"
            ? name.trim()
            : "",
      });

      await user.save();

      const token =
        generateToken(
          user._id.toString()
        );

      return res.status(201).json({
        message:
          "User registered successfully",
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error: any) {
      console.error(
        "❌ REGISTER ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Registration failed",
      });
    }
  }
);

/**
 * LOGIN
 */
router.post(
  "/login",
  async (req: Request, res: Response) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error:
            "Email and password are required",
        });
      }

      const normalizedEmail =
        String(email)
          .toLowerCase()
          .trim();

      const user =
        await User.findOne({
          email: normalizedEmail,
        });

      if (!user) {
        return res.status(401).json({
          error:
            "Invalid credentials",
        });
      }

      const isPasswordValid =
        await user.comparePassword(
          password
        );

      if (!isPasswordValid) {
        return res.status(401).json({
          error:
            "Invalid credentials",
        });
      }

      const token =
        generateToken(
          user._id.toString()
        );

      return res.json({
        message:
          "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error: any) {
      console.error(
        "❌ LOGIN ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Login failed",
      });
    }
  }
);

/**
 * GET PROFILE
 */
router.get(
  "/profile",
  authenticateToken,
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const user = await User.findById(
        req.userId
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      return res.json({
        id: user._id,
        email: user.email,
        name: user.name,
      });
    } catch (error: any) {
      console.error(
        "❌ PROFILE ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Failed to fetch profile",
      });
    }
  }
);

export default router;