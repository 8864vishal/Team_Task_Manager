import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <AuthForm mode="signup" />
      <p className="mt-4 text-center text-sm text-gray-600">
        Already registered? <Link className="text-blue-600" href="/login">Login</Link>
      </p>
    </main>
  );
}
