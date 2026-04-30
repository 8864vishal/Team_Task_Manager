import { NextRequest } from "next/server";
import { fail, requireRole, withDb } from "@/lib/api";
import { Project } from "@/models/Project";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  await withDb();
  const authResult = await requireRole(request, "admin");
  if ("error" in authResult) return authResult.error;

  const { id, userId } = await params;
  const project = await Project.findByIdAndUpdate(
    id,
    { $pull: { teamMembers: userId } },
    { new: true },
  ).populate("teamMembers", "name email role");
  if (!project) return fail("Project not found", 404);
  return Response.json({ project });
}
