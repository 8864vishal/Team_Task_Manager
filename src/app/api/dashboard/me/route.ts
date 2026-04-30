import { NextRequest } from "next/server";
import { requireAuth, withDb } from "@/lib/api";
import { Task } from "@/models/Task";

export async function GET(request: NextRequest) {
  await withDb();
  const authResult = await requireAuth(request);
  if ("error" in authResult) return authResult.error;

  const baseQuery =
    authResult.user.role === "admin" ? {} : { assignedTo: authResult.user.userId };
  const now = new Date();

  const [tasks, pending, completed, overdue] = await Promise.all([
    Task.find(baseQuery).populate("projectId", "name").sort({ deadline: 1 }),
    Task.countDocuments({ ...baseQuery, status: "pending" }),
    Task.countDocuments({ ...baseQuery, status: "completed" }),
    Task.countDocuments({ ...baseQuery, status: { $ne: "completed" }, deadline: { $lt: now } }),
  ]);

  return Response.json({
    tasks,
    summary: {
      pending,
      completed,
      overdue,
      total: tasks.length,
    },
  });
}
