import { NextRequest } from "next/server";
import { withDb, fail, ok } from "@/lib/api";
import { signupSchema } from "@/lib/validation";
import { User } from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await withDb();
  const body = await request.json();
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message || "Invalid payload", 422);
  }

  const existing = await User.findOne({ email: parsed.data.email });
  if (existing) {
    return fail("Email already exists", 409);
  }

  const password = await hashPassword(parsed.data.password);
  const user = await User.create({
    name: parsed.data.name,
    email: parsed.data.email,
    password,
    role: parsed.data.role || "member",
  });

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return ok({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }, 201);
}
