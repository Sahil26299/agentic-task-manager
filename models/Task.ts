import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  body: string;
  reminder?: Date;
  tags: string[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, default: "" },
    reminder: { type: Date },
    tags: { type: [String], default: [] },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
