import mongoose, { Schema, Types } from "mongoose";

export interface IProject {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  teamMembers: Types.ObjectId[];
  createdBy: Types.ObjectId;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    teamMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
