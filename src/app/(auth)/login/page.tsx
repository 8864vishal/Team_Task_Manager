import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <AuthForm mode="login" />
      <p className="mt-5 text-center text-sm text-slate-300">
        No account?{" "}
        <Link className="font-semibold text-cyan-300 transition hover:text-cyan-200" href="/signup">
          Create one
        </Link>
      </p>
    </main>
  );
}
