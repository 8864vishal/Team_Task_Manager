import { NextRequest } from "next/server";
import { fail, requireRole, withDb } from "@/lib/api";
import { Project } from "@/models/Project";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await withDb();
  const authResult = await requireRole(request, "admin");
  if ("error" in authResult) return authResult.error;

  const { id } = await params;
  const body = await request.json();
  if (!body.userId) return fail("userId is required", 422);

  const project = await Project.findByIdAndUpdate(
    id,
    { $addToSet: { teamMembers: body.userId } },
    { new: true },
  ).populate("teamMembers", "name email role");
  if (!project) return fail("Project not found", 404);
  return Response.json({ project });
}
