import { DashboardClient } from "@/components/dashboard-client";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Team Task Manager</h1>
          <p className="text-sm text-gray-600">Track tasks, projects, and deadlines in one place.</p>
        </header>
        <DashboardClient />
      </div>
    </main>
  );
}
