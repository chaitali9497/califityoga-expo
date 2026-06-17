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
      },

      note: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IMood>(
  "Mood",
  moodSchema
);