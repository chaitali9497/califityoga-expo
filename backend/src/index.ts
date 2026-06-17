import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes";
import habitRoutes from "./routes/habitRoutes";
import reportRoutes from "./routes/reportRoutes";
import moodRoutes from "./routes/moodRoutes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/califitoga";

console.log(
  "MongoDB URI source:",
  process.env.MONGODB_URI
    ? "environment variable"
    : "default localhost"
);

// Middleware
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Debug middleware
app.use((req, res, next) => {
  console.log(
    `➡️ ${req.method} ${req.url}`
  );

  console.log("📦 BODY:", req.body);

  next();
});

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/habits", habitRoutes);
app.use("/api/reports", reportRoutes);

// Health route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    dbConnection:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// Error middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("❌ SERVER ERROR:", err);

    res.status(err.status || 500).json({
      error:
        err.message ||
        "Internal server error",
    });
  }
);

// Mongo config
mongoose.set("strictQuery", false);

// Mongo events
mongoose.connection.on(
  "connected",
  () => {
    console.log(
      "✅ MongoDB connected"
    );
  }
);

mongoose.connection.on(
  "error",
  (err) => {
    console.error(
      "❌ MongoDB error:",
      err
    );
  }
);

mongoose.connection.on(
  "disconnected",
  () => {
    console.warn(
      "⚠️ MongoDB disconnected"
    );
  }
);

// Start server
const startServer = async () => {
  try {
    await mongoose.connect(
      MONGODB_URI,
      {
        serverSelectionTimeoutMS: 15000,
      }
    );

    console.log(
      "✅ Database connected"
    );

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to connect MongoDB:",
      error
    );

    process.exit(1);
  }
};

startServer();