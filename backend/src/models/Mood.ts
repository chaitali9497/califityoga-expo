import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IMood
  extends Document {
  userId: mongoose.Types.ObjectId;

  date: string;
  mood: string;
  feeling?: string;
  note?: string;

  createdAt: Date;
  updatedAt: Date;
}

const moodSchema =
  new Schema<IMood>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      date: {
        type: String,
        required: true,
      },

      mood: {
        type: String,
        required: true,
      },

      feeling: {
        type: String,
        default: "",
      },

      note: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

// One mood entry per user per date
moodSchema.index(
  { userId: 1, date: 1 },
  { unique: true }
);

const Mood =
  mongoose.models.Mood ||
  mongoose.model<IMood>(
    "Mood",
    moodSchema
  );

export default Mood;