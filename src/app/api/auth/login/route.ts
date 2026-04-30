import { NextRequest } from "next/server";
import { withDb, fail, ok } from "@/lib/api";
import { loginSchema } from "@/lib/validation";
import { User } from "@/models/User";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await withDb();
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message || "Invalid payload", 422);
  }

  const user = await User.findOne({ email: parsed.data.email });
  if (!user) {
    return fail("Invalid email or password", 401);
  }

  const valid = await comparePassword(parsed.data.password, user.password);
  if (!valid) {
    return fail("Invalid email or password", 401);
  }

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
  });
}
