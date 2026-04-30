import { DashboardClient } from "@/components/dashboard-client";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-transparent p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-2xl border border-indigo-200/20 bg-slate-900/65 p-6 shadow-2xl shadow-indigo-950/50 backdrop-blur-md">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Team Task Manager</h1>
          <p className="mt-1 text-sm text-slate-300">Track tasks, projects, and deadlines in one place.</p>
        </header>
        <DashboardClient />
      </div>
    </main>
  );
}
