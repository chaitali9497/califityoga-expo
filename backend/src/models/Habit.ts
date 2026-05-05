import mongoose, { Schema, Document } from "mongoose";

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: string;
  frequency: "daily" | "weekly" | "monthly";
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    color: {
      type: String,
      default: "#2E7D32",
    },
    icon: {
      type: String,
      default: "📝",
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
habitSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IHabit>("Habit", habitSchema);
