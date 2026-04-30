import { NextRequest } from "next/server";
import { fail, requireRole, withDb } from "@/lib/api";
import { projectSchema } from "@/lib/validation";
import { Project } from "@/models/Project";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await withDb();
  const authResult = await requireRole(request, "admin");
  if ("error" in authResult) return authResult.error;

  const { id } = await params;
  const body = await request.json();
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message || "Invalid payload", 422);
  }

  const project = await Project.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!project) return fail("Project not found", 404);
  return Response.json({ project });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await withDb();
  const authResult = await requireRole(request, "admin");
  if ("error" in authResult) return authResult.error;

  const { id } = await params;
  const deleted = await Project.findByIdAndDelete(id);
  if (!deleted) return fail("Project not found", 404);
  return Response.json({ message: "Project deleted" });
}
