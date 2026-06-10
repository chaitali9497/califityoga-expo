import mongoose, { Schema, Document } from "mongoose";

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;

  name: string;
  icon: string;
  color: string;

  habitType: "Regular" | "OneTime";
  repeat: "Daily" | "Weekly" | "Monthly";

  weeklyDays?: string[];
  monthlyDate?: number;
  monthlyDates?: number[];

  timeOfDay: "Morning" | "Afternoon" | "Evening";
  reminderTime?: string;

  streak: number;
  lastCompleted?: string | null;

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

    name: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "📝",
    },

    color: {
      type: String,
      default: "#2E7D32",
    },

    habitType: {
      type: String,
      enum: ["Regular", "OneTime"],
      default: "Regular",
    },

    repeat: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      default: "Daily",
    },

    weeklyDays: {
      type: [String],
      default: [],
    },

    monthlyDate: {
      type: Number,
    },

    monthlyDates: {
      type: [Number],
      default: [],
    },

    timeOfDay: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
      default: "Morning",
    },

    reminderTime: {
      type: String,
    },

    streak: {
      type: Number,
      default: 0,
    },

    lastCompleted: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

habitSchema.index({
  userId: 1,
  createdAt: -1,
});

const Habit =
  mongoose.models.Habit ||
  mongoose.model<IHabit>("Habit", habitSchema);

export default Habit;