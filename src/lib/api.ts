import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { UserRole } from "@/types";

export async function withDb() {
  await connectDb();
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export async function requireAuth(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return { error: fail("Unauthorized", 401) };
  }
  try {
    const user = verifyToken(token);
    return { user };
  } catch {
    return { error: fail("Invalid token", 401) };
  }
}

export async function requireRole(request: NextRequest, role: UserRole) {
  const authResult = await requireAuth(request);
  if ("error" in authResult) {
    return authResult;
  }
  if (authResult.user.role !== role) {
    return { error: fail("Forbidden", 403) };
  }
  return authResult;
}
