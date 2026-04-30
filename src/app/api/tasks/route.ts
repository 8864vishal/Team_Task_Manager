import { NextRequest } from "next/server";
import { fail, requireAuth, requireRole, withDb } from "@/lib/api";
import { taskSchema } from "@/lib/validation";
import { Task } from "@/models/Task";

export async function GET(request: NextRequest) {
  await withDb();
  const authResult = await requireAuth(request);
  if ("error" in authResult) return authResult.error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const projectId = searchParams.get("projectId");

  const query: Record<string, unknown> = {};
  if (authResult.user.role !== "admin") {
    query.assignedTo = authResult.user.userId;
  }
  if (status) query.status = status;
  if (projectId) query.projectId = projectId;

  const tasks = await Task.find(query)
    .populate("assignedTo", "name email role")
    .populate("projectId", "name")
    .sort({ deadline: 1 });
  return Response.json({ tasks });
}

export async function POST(request: NextRequest) {
  await withDb();
  const authResult = await requireRole(request, "admin");
  if ("error" in authResult) return authResult.error;

  const body = await request.json();
  const parsed = taskSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message || "Invalid payload", 422);
  }

  const task = await Task.create({
    ...parsed.data,
    deadline: new Date(parsed.data.deadline),
    createdBy: authResult.user.userId,
  });
  return Response.json({ task }, { status: 201 });
}
