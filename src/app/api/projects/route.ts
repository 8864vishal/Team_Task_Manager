import { NextRequest } from "next/server";
import { fail, requireAuth, requireRole, withDb } from "@/lib/api";
import { projectSchema } from "@/lib/validation";
import { Project } from "@/models/Project";

export async function GET(request: NextRequest) {
  await withDb();
  const authResult = await requireAuth(request);
  if ("error" in authResult) return authResult.error;

  const query =
    authResult.user.role === "admin" ? {} : { teamMembers: { $in: [authResult.user.userId] } };
  const projects = await Project.find(query).populate("teamMembers", "name email role");
  return Response.json({ projects });
}

export async function POST(request: NextRequest) {
  await withDb();
  const authResult = await requireRole(request, "admin");
  if ("error" in authResult) return authResult.error;

  const body = await request.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message || "Invalid payload", 422);
  }

  const project = await Project.create({
    ...parsed.data,
    teamMembers: body.teamMembers || [],
    createdBy: authResult.user.userId,
  });

  return Response.json({ project }, { status: 201 });
}
