import jwt from "jsonwebtoken";

import {
  Request,
  Response,
  NextFunction,
} from "express";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "supersecretkey";

/**
 * Custom Request Type
 */
export interface AuthRequest
  extends Request {
  userId?: string;
}

/**
 * Generate JWT Token
 */
export const generateToken = (
  userId: string
): string => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/**
 * Authenticate JWT Middleware
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error:
          "Authorization token missing",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error:
          "Invalid token format",
      });
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as {
      userId: string;
    };

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error(
      "❌ JWT ERROR:",
      error
    );

    return res.status(401).json({
      error:
        "Invalid or expired token",
    });
  }
};