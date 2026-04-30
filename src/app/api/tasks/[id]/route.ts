import { NextRequest } from "next/server";
import { fail, requireAuth, withDb } from "@/lib/api";
import { Task } from "@/models/Task";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await withDb();
  const authResult = await requireAuth(request);
  if ("error" in authResult) return authResult.error;
  const { id } = await params;

  const body = await request.json();
  const task = await Task.findById(id);
  if (!task) return fail("Task not found", 404);

  const isOwner = task.assignedTo.toString() === authResult.user.userId;
  const isAdmin = authResult.user.role === "admin";
  if (!isAdmin && !isOwner) return fail("Forbidden", 403);

  if (!isAdmin) {
    task.status = body.status || task.status;
  } else {
    Object.assign(task, {
      title: body.title ?? task.title,
      description: body.description ?? task.description,
      status: body.status ?? task.status,
      assignedTo: body.assignedTo ?? task.assignedTo,
      projectId: body.projectId ?? task.projectId,
      deadline: body.deadline ? new Date(body.deadline) : task.deadline,
    });
  }

  await task.save();
  return Response.json({ task });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await withDb();
  const authResult = await requireAuth(request);
  if ("error" in authResult) return authResult.error;
  if (authResult.user.role !== "admin") return fail("Forbidden", 403);

  const { id } = await params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) return fail("Task not found", 404);
  return Response.json({ message: "Task deleted" });
}
