import { NextRequest } from "next/server";
import { requireRole, withDb } from "@/lib/api";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  await withDb();
  const authResult = await requireRole(request, "admin");
  if ("error" in authResult) return authResult.error;

  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
  return Response.json({ users });
}
