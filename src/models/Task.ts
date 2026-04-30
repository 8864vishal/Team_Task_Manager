import mongoose, { Schema, Types } from "mongoose";
import { TaskStatus } from "@/types";

export interface ITask {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo: Types.ObjectId;
  projectId: Types.ObjectId;
  deadline: Date;
  createdBy: Types.ObjectId;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    deadline: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
