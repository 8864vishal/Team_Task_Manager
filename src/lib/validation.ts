import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "member"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  assignedTo: z.string().min(1),
  projectId: z.string().min(1),
  deadline: z.string().min(1),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
});
