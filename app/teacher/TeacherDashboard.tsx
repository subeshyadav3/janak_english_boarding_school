"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Megaphone,
  Trophy,
  LayoutDashboard,
  Home,
  Plus,
  Save,
  Trash2,
  GraduationCap,
  Clock,
  BookOpen,
  FileText,
} from "lucide-react";

type Tab = "overview" | "results" | "notices";
type Result = { id: string; title: string; driveLink?: string; createdAt?: string };
type Notice = { id: string; title: string; description?: string; filePath?: string; createdAt?: string };

async function j<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export default function TeacherDashboard({ username }: { username: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [me, setMe] = useState<{ username: string; name?: string }>({ username });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const users = await j<{ username: string; name?: string }[]>("/api/admin/users");
        if (!cancelled) {
          const found = users.find((u) => u.username === username);
          setMe(found || { username });
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const logout = async () => {
    await fetch("/api/admin/session", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-brand-deep text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <GraduationCap className="h-5 w-5 text-accent" />
            </span>
            <div>
              <h1 className="text-lg font-bold">Teacher Dashboard</h1>
              <p className="text-xs text-white/60">
                {me.name || `@${me.username}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20 transition"
            >
              <Home className="h-4 w-4" /> View Site
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600/90 px-3 py-2 text-sm hover:bg-red-600 transition"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
        <nav className="mx-auto max-w-7xl flex gap-1 overflow-x-auto px-4 pb-2">
          {(
            [
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "results", label: "My Results", icon: Trophy },
              { id: "notices", label: "Notices", icon: Megaphone },
            ] as { id: Tab; label: string; icon: typeof Trophy }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-surface text-brand-deep"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {tab === "overview" && <Overview name={me.name || me.username} />}
        {tab === "results" && <ResultsManager />}
        {tab === "notices" && <NoticesManager />}
      </main>
    </div>
  );
}

function Overview({ name }: { name: string }) {
  const results = useFetch<Result>("/api/admin/results");
  const notices = useFetch<Notice>("/api/admin/notices");

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white shadow-lg">
        <p className="text-sm text-white/70">Welcome back,</p>
        <h2 className="mt-1 text-2xl font-bold">{name} 👋</h2>
        <p className="mt-2 text-sm text-white/80">{today}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm ring-1 ring-white/20">
            <BookOpen className="h-4 w-4 text-accent" /> Nursery - Grade 8
          </span>
          <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm ring-1 ring-white/20">
            <Clock className="h-4 w-4 text-accent" /> English Medium
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white border border-line p-5 shadow-sm">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Trophy className="h-5 w-5" />
          </span>
          <p className="mt-4 text-3xl font-extrabold text-brand-deep">{results.data.length}</p>
          <p className="text-sm text-brand-deep/60">Published Results</p>
        </div>
        <div className="rounded-2xl bg-white border border-line p-5 shadow-sm">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Megaphone className="h-5 w-5" />
          </span>
          <p className="mt-4 text-3xl font-extrabold text-brand-deep">{notices.data.length}</p>
          <p className="text-sm text-brand-deep/60">Active Notices</p>
        </div>
        <div className="rounded-2xl bg-white border border-line p-5 shadow-sm">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <FileText className="h-5 w-5" />
          </span>
          <p className="mt-4 text-3xl font-extrabold text-brand-deep">-</p>
          <p className="text-sm text-brand-deep/60">My Subjects</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white border border-line shadow-sm">
        <div className="border-b border-line px-6 py-4">
          <h3 className="font-bold">Quick Actions</h3>
        </div>
        <div className="grid gap-3 p-6 sm:grid-cols-2">
          <Link href="/teacher" className="rounded-xl border border-line bg-surface p-5 hover:border-brand hover:bg-brand-soft/50 transition">
            <Trophy className="h-6 w-6 text-accent" />
            <p className="mt-3 font-bold">Publish Exam Results</p>
            <p className="mt-1 text-sm text-brand-deep/60">Share result links for parents and students.</p>
          </Link>
          <Link href="/teacher" className="rounded-xl border border-line bg-surface p-5 hover:border-brand hover:bg-brand-soft/50 transition">
            <Megaphone className="h-6 w-6 text-brand" />
            <p className="mt-3 font-bold">Post a Notice</p>
            <p className="mt-1 text-sm text-brand-deep/60">Announce schedules, events and updates.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function useFetch<T>(url: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await j<T[]>(url);
        if (!cancelled) setData(d);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);
  return { data, setData, loading };
}

function ErrorBanner({ error, onClose }: { error: string; onClose: () => void }) {
  if (!error) return null;
  return (
    <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
      <span>{error}</span>
      <button onClick={onClose} className="font-bold">×</button>
    </div>
  );
}

function ResultsManager() {
  const { data, setData, loading } = useFetch<Result>("/api/admin/results");
  const [error, setError] = useState("");

  const save = async (item: Result) => {
    try {
      const updated = await j<Result>(`/api/admin/results/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: item.title, driveLink: item.driveLink }),
      });
      setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const add = async () => {
    try {
      const created = await j<Result>("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Result" }),
      });
      setData((prev) => [created, ...prev]);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this result?")) return;
    try {
      await j(`/api/admin/results/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const set = (id: string, field: keyof Result, value: string) =>
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  if (loading) return <p className="text-sm text-brand-deep/60">Loading...</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-deep">Exam Results</h2>
        <p className="mt-1 text-sm text-brand-deep/60">Share exam result links with parents and students.</p>
      </div>
      <ErrorBanner error={error} onClose={() => setError("")} />
      <button onClick={add} className="mb-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark">
        <Plus className="h-4 w-4" /> Add Result
      </button>
      <div className="space-y-3">
        {data.map((r) => (
          <div key={r.id} className="rounded-xl bg-white border border-line p-4 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input value={r.title} onChange={(e) => set(r.id, "title", e.target.value)}
                placeholder="Result Title (e.g. First Term 2083)" className="admin-input flex-1" />
              <input value={r.driveLink ?? ""} onChange={(e) => set(r.id, "driveLink", e.target.value)}
                placeholder="Google Drive Link" className="admin-input flex-1" />
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => save(r)} className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark">
                <Save className="h-4 w-4" /> Save
              </button>
              <button onClick={() => remove(r.id)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoticesManager() {
  const { data, setData, loading } = useFetch<Notice>("/api/admin/notices");
  const [error, setError] = useState("");

  const save = async (item: Notice) => {
    try {
      const updated = await j<Notice>(`/api/admin/notices/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: item.title, description: item.description, filePath: item.filePath }),
      });
      setData((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const add = async () => {
    try {
      const created = await j<Notice>("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Notice" }),
      });
      setData((prev) => [created, ...prev]);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    try {
      await j(`/api/admin/notices/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const set = (id: string, field: keyof Notice, value: string) =>
    setData((prev) => prev.map((n) => (n.id === id ? { ...n, [field]: value } : n)));

  if (loading) return <p className="text-sm text-brand-deep/60">Loading...</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-deep">Notices</h2>
        <p className="mt-1 text-sm text-brand-deep/60">Post announcements for parents and students.</p>
      </div>
      <ErrorBanner error={error} onClose={() => setError("")} />
      <button onClick={add} className="mb-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark">
        <Plus className="h-4 w-4" /> Add Notice
      </button>
      <div className="space-y-3">
        {data.map((n) => (
          <div key={n.id} className="rounded-xl bg-white border border-line p-4 shadow-sm">
            <input value={n.title} onChange={(e) => set(n.id, "title", e.target.value)}
              placeholder="Notice Title" className="admin-input w-full" />
            <textarea value={n.description ?? ""} onChange={(e) => set(n.id, "description", e.target.value)}
              placeholder="Description" rows={2} className="admin-input mt-2 w-full" />
            <input value={n.filePath ?? ""} onChange={(e) => set(n.id, "filePath", e.target.value)}
              placeholder="File Link (optional)" className="admin-input mt-2 w-full" />
            <div className="mt-2 flex gap-2">
              <button onClick={() => save(n)} className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark">
                <Save className="h-4 w-4" /> Save
              </button>
              <button onClick={() => remove(n.id)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
