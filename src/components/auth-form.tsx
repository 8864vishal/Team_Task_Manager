"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api";

type AuthMode = "login" | "signup";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/signup";
      const payload =
        mode === "login" ? { email, password } : { name, email, password, role };
      const data = await apiFetch<{ token: string }>(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      localStorage.setItem("ttm_token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-indigo-200/20 bg-slate-900/70 p-7 shadow-2xl shadow-indigo-950/50 backdrop-blur-md"
    >
      <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
        {mode === "login" ? "Login" : "Create account"}
      </h1>
      <p className="text-sm text-slate-300/80">
        {mode === "login"
          ? "Welcome back. Continue managing your team tasks."
          : "Create your workspace account to start collaborating."}
      </p>
      {mode === "signup" && (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2.5 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "member")}
            className="w-full rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </>
      )}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="w-full rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2.5 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        className="w-full rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2.5 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 font-medium text-white transition hover:from-indigo-400 hover:to-cyan-400 disabled:cursor-not-allowed disabled:from-indigo-300 disabled:to-cyan-300"
      >
        {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
      </button>
    </form>
  );
}
