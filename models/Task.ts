import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  body: string;
  reminder?: Date;
  reminderSent?: boolean;
  tags: string[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, default: "" },
    reminder: { type: Date },
    reminderSent: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    isCompleted: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
