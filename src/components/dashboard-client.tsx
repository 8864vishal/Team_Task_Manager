"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api";

type DashboardData = {
  tasks: TaskItem[];
  summary: { pending: number; completed: number; overdue: number; total: number };
};

type Project = { _id: string; name: string };
type User = { _id: string; name: string; role: string };
type TaskItem = {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  deadline: string;
  projectId?: { name?: string };
};

export function DashboardClient() {
  const router = useRouter();
  const [token] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("ttm_token") : null,
  );
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    projectId: "",
    deadline: "",
  });
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  const role = useMemo(() => {
    if (!token) return "member";
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role as "admin" | "member";
  }, [token]);

  const refresh = async (authToken: string, status = "", projectId = "") => {
    const [dashboardData, projectData] = await Promise.all([
      apiFetch<DashboardData>("/dashboard/me", {}, authToken),
      apiFetch<{ projects: Project[] }>("/projects", {}, authToken),
    ]);
    setDashboard(dashboardData);
    setProjects(projectData.projects);

    if (role === "admin") {
      const userData = await apiFetch<{ users: User[] }>("/users", {}, authToken);
      setUsers(userData.users);
    }

    const query = new URLSearchParams();
    if (status) query.set("status", status);
    if (projectId) query.set("projectId", projectId);
    const filtered = await apiFetch<{ tasks: TaskItem[] }>(
      `/tasks?${query.toString()}`,
      {},
      authToken,
    );
    setDashboard((prev) => (prev ? { ...prev, tasks: filtered.tasks } : prev));
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

  useEffect(() => {
    if (!token) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh(token).catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const updateStatus = async (taskId: string, status: string) => {
    if (!token) return;
    await apiFetch(`/tasks/${taskId}`, { method: "PATCH", body: JSON.stringify({ status }) }, token);
    await refresh(token, statusFilter, projectFilter);
  };

  const createProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await apiFetch("/projects", { method: "POST", body: JSON.stringify(projectForm) }, token);
    setProjectForm({ name: "", description: "" });
    await refresh(token, statusFilter, projectFilter);
  };

  const createTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await apiFetch("/tasks", { method: "POST", body: JSON.stringify(taskForm) }, token);
    setTaskForm({ title: "", description: "", assignedTo: "", projectId: "", deadline: "" });
    await refresh(token, statusFilter, projectFilter);
  };

  if (!dashboard) {
    return <p className="rounded-xl border border-indigo-200/20 bg-slate-900/60 p-6 text-sm text-slate-300">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-4">
        {Object.entries(dashboard.summary).map(([key, value]) => (
          <div key={key} className="rounded-xl border border-indigo-200/15 bg-slate-900/60 p-4 shadow-lg shadow-indigo-950/30 backdrop-blur">
            <p className="text-sm capitalize text-slate-300">{key}</p>
            <p className="text-2xl font-bold text-slate-100">{value}</p>
          </div>
        ))}
      </section>

      {role === "admin" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <form onSubmit={createProject} className="space-y-2 rounded-xl border border-indigo-200/15 bg-slate-900/60 p-4 shadow-lg shadow-indigo-950/30 backdrop-blur">
            <h2 className="font-semibold text-slate-100">Create Project</h2>
            <input className="w-full rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20" placeholder="Project name" value={projectForm.name} onChange={(e) => setProjectForm((p) => ({ ...p, name: e.target.value }))} required />
            <textarea className="w-full rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20" placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))} />
            <button className="rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-2 text-white transition hover:from-indigo-400 hover:to-cyan-400">Create Project</button>
          </form>
          <form onSubmit={createTask} className="space-y-2 rounded-xl border border-indigo-200/15 bg-slate-900/60 p-4 shadow-lg shadow-indigo-950/30 backdrop-blur">
            <h2 className="font-semibold text-slate-100">Create Task</h2>
            <input className="w-full rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20" placeholder="Task title" value={taskForm.title} onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))} required />
            <textarea className="w-full rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20" placeholder="Description" value={taskForm.description} onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))} />
            <select className="w-full rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20" value={taskForm.projectId} onChange={(e) => setTaskForm((p) => ({ ...p, projectId: e.target.value }))} required>
              <option value="">Select project</option>
              {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
            </select>
            <select className="w-full rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20" value={taskForm.assignedTo} onChange={(e) => setTaskForm((p) => ({ ...p, assignedTo: e.target.value }))} required>
              <option value="">Assign user</option>
              {users.map((user) => <option key={user._id} value={user._id}>{user.name} ({user.role})</option>)}
            </select>
            <input type="date" className="w-full rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20" value={taskForm.deadline} onChange={(e) => setTaskForm((p) => ({ ...p, deadline: e.target.value }))} required />
            <button className="rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-2 text-white transition hover:from-indigo-400 hover:to-cyan-400">Create Task</button>
          </form>
        </section>
      )}

      <section className="rounded-xl border border-indigo-200/15 bg-slate-900/60 p-4 shadow-lg shadow-indigo-950/30 backdrop-blur">
        <div className="mb-4 flex flex-wrap gap-2">
          <select className="rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20" value={statusFilter} onChange={async (e) => {
            setStatusFilter(e.target.value);
            if (token) await refresh(token, e.target.value, projectFilter);
          }}>
            <option value="">All status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select className="rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20" value={projectFilter} onChange={async (e) => {
            setProjectFilter(e.target.value);
            if (token) await refresh(token, statusFilter, e.target.value);
          }}>
            <option value="">All projects</option>
            {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          {dashboard.tasks.map((task) => {
            const overdue = task.status !== "completed" && new Date(task.deadline) < new Date();
            return (
              <article key={task._id} className="rounded-xl border border-slate-600/50 bg-slate-800/65 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-100">{task.title}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${overdue ? "bg-rose-500/20 text-rose-300" : "bg-slate-700 text-slate-200"}`}>
                    {overdue ? "Overdue" : task.status}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{task.description}</p>
                <p className="text-xs text-slate-400">Project: {task.projectId?.name || "N/A"} | Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                {(role === "member" || role === "admin") && (
                  <select
                    className="mt-2 rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                )}
              </article>
            );
          })}
        </div>
      </section>
      {error && <p className="rounded-lg border border-rose-300/40 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}
    </div>
  );
}
