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
  GraduationCap,
  Clock,
  BookOpen,
} from "lucide-react";
import { ToastProvider } from "@/lib/ui/Toast";
import FileUpload from "@/lib/ui/FileUpload";
import Badge from "@/lib/ui/admin/Badge";
import ListRow from "@/lib/ui/admin/ListRow";
import CrudManager from "@/lib/ui/admin/CrudManager";
import { DetailRow } from "@/lib/ui/admin/DetailRow";
import { TextInput, Textarea, Select, Toggle, FormRow } from "@/lib/ui/admin/Controls";

type Tab = "overview" | "results" | "notices";
type Result = { id: string; title: string; driveLink?: string | null; filePath?: string | null; createdAt?: string };
type Notice = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  filePath?: string | null;
  published?: boolean;
  createdAt?: string;
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

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
    <ToastProvider>
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
          {tab === "overview" && <Overview name={me.name || me.username} onNavigate={setTab} />}
          {tab === "results" && <ResultsManager />}
          {tab === "notices" && <NoticesManager />}
        </main>
      </div>
    </ToastProvider>
  );
}

function Overview({ name, onNavigate }: { name: string; onNavigate: (t: Tab) => void }) {
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => onNavigate("results")}
          className="rounded-2xl bg-white border border-line p-5 shadow-sm text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Trophy className="h-5 w-5" />
          </span>
          <p className="mt-4 text-3xl font-extrabold text-brand-deep">{results.data.length}</p>
          <p className="text-sm text-brand-deep/60">Published Results</p>
        </button>
        <button
          onClick={() => onNavigate("notices")}
          className="rounded-2xl bg-white border border-line p-5 shadow-sm text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Megaphone className="h-5 w-5" />
          </span>
          <p className="mt-4 text-3xl font-extrabold text-brand-deep">{notices.data.length}</p>
          <p className="text-sm text-brand-deep/60">Active Notices</p>
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-white border border-line shadow-sm">
        <div className="border-b border-line px-6 py-4">
          <h3 className="font-bold">Quick Actions</h3>
        </div>
        <div className="grid gap-3 p-6 sm:grid-cols-2">
          <button
            onClick={() => onNavigate("results")}
            className="rounded-xl border border-line bg-surface p-5 text-left hover:border-brand hover:bg-brand-soft/50 transition"
          >
            <Trophy className="h-6 w-6 text-accent" />
            <p className="mt-3 font-bold">Publish Exam Results</p>
            <p className="mt-1 text-sm text-brand-deep/60">Share result links for parents and students.</p>
          </button>
          <button
            onClick={() => onNavigate("notices")}
            className="rounded-xl border border-line bg-surface p-5 text-left hover:border-brand hover:bg-brand-soft/50 transition"
          >
            <Megaphone className="h-6 w-6 text-brand" />
            <p className="mt-3 font-bold">Post a Notice</p>
            <p className="mt-1 text-sm text-brand-deep/60">Announce schedules, events and updates.</p>
          </button>
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
  return { data, loading };
}

function PageShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-deep">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-brand-deep/60">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function ResultsManager() {
  return (
    <PageShell title="Exam Results" subtitle="Share exam results with parents and students.">
      <CrudManager<Result>
        title="Result"
        endpoint="/api/admin/results"
        addLabel="Add Result"
        blank={{ title: "", driveLink: "", filePath: "" }}
        emptyIcon={Trophy}
        emptyTitle="No results yet"
        emptyMessage="Upload result files or share a Drive link."
        searchKeys={["title"]}
        searchPlaceholder="Search results..."
        formTitle="Result details"
        createBody={(f) => ({ title: f.title || "New Result", driveLink: f.driveLink ?? "", filePath: f.filePath ?? "" })}
        updateBody={(f) => ({ title: f.title || "New Result", driveLink: f.driveLink ?? "", filePath: f.filePath ?? "" })}
        renderRow={(r, { onView, onEdit, onDelete }) => (
          <ListRow
            title={r.title}
            subtitle={fmtDate(r.createdAt)}
            badges={<>{r.driveLink && <Badge label="Drive link" color="blue" />}</>}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        renderForm={(f, set) => (
          <div className="space-y-4">
            <TextInput label="Title" required value={f.title ?? ""} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. First Term 2083 - Grade 8" />
            <TextInput label="Google Drive link" value={f.driveLink ?? ""} onChange={(e) => set({ driveLink: e.target.value })} placeholder="https://drive.google.com/..." />
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-brand-deep">Result file (PDF / image)</span>
              <FileUpload value={f.filePath ?? ""} onChange={(v) => set({ filePath: v })} accept=".pdf,image/*" label="Upload PDF / Image" />
            </div>
          </div>
        )}
        renderView={(r) => (
          <div className="space-y-4">
            <DetailRow label="Title">{r.title}</DetailRow>
            <DetailRow label="Posted on">{fmtDate(r.createdAt) || "—"}</DetailRow>
            {r.filePath && (
              <DetailRow label="File">
                <a href={r.filePath} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-brand px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand/5 transition-colors">
                  Open result file
                </a>
              </DetailRow>
            )}
            {r.driveLink && (
              <DetailRow label="Drive link">
                <a href={r.driveLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-brand px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand/5 transition-colors">
                  Open Drive link
                </a>
              </DetailRow>
            )}
          </div>
        )}
        deleteConfirmTitle={(r) => `Delete "${r.title}"?`}
        deleteConfirmMessage="This will remove the result from the website."
      />
    </PageShell>
  );
}

function NoticesManager() {
  return (
    <PageShell title="Notices" subtitle="Post announcements for parents and students.">
      <CrudManager<Notice>
        title="Notice"
        endpoint="/api/admin/notices"
        addLabel="Add Notice"
        blank={{ title: "", description: "", category: "general", filePath: "", published: true }}
        emptyIcon={Megaphone}
        emptyTitle="No notices yet"
        emptyMessage="Publish announcements for parents and students."
        searchKeys={["title", "category"]}
        searchPlaceholder="Search notices..."
        formTitle="Notice details"
        createBody={(f) => ({
          title: f.title || "New Notice",
          description: f.description ?? "",
          category: f.category || "general",
          filePath: f.filePath ?? "",
          published: f.published ?? true,
        })}
        updateBody={(f) => ({
          title: f.title || "New Notice",
          description: f.description ?? "",
          category: f.category || "general",
          filePath: f.filePath ?? "",
          published: f.published ?? true,
        })}
        renderRow={(n, { onView, onEdit, onDelete }) => (
          <ListRow
            title={n.title}
            subtitle={fmtDate(n.createdAt)}
            badges={
              <>
                <Badge label={n.category || "general"} color="accent" />
                {n.published === false && <Badge label="Hidden" color="gray" />}
              </>
            }
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        renderForm={(f, set) => (
          <div className="space-y-4">
            <FormRow>
              <TextInput label="Title" required value={f.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
              <Select label="Category" value={f.category || "general"} onChange={(e) => set({ category: e.target.value })}>
                <option value="general">General</option>
                <option value="admission">Admission</option>
                <option value="exam">Exam</option>
                <option value="event">Event</option>
                <option value="meeting">Meeting</option>
              </Select>
            </FormRow>
            <Textarea label="Description" rows={3} value={f.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-brand-deep">Attachment (PDF / image)</span>
              <FileUpload value={f.filePath ?? ""} onChange={(v) => set({ filePath: v })} accept=".pdf,image/*" label={f.filePath ? "Replace File" : "Upload PDF / Image"} />
            </div>
            <Toggle label="Published" hint="Unpublished notices are hidden from the website." checked={f.published !== false} onChange={(v) => set({ published: v })} />
          </div>
        )}
        renderView={(n) => (
          <div className="space-y-4">
            <DetailRow label="Title">{n.title}</DetailRow>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Category">{n.category || "general"}</DetailRow>
              <DetailRow label="Status">{n.published === false ? "Hidden" : "Published"}</DetailRow>
            </div>
            <DetailRow label="Posted on">{fmtDate(n.createdAt) || "—"}</DetailRow>
            {n.description && <DetailRow label="Description">{n.description}</DetailRow>}
            {n.filePath && (
              <DetailRow label="Attachment">
                <a href={n.filePath} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-brand px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand/5 transition-colors">
                  Open attachment
                </a>
              </DetailRow>
            )}
          </div>
        )}
        deleteConfirmTitle={(n) => `Delete "${n.title}"?`}
        deleteConfirmMessage="This will remove the notice from the website."
      />
    </PageShell>
  );
}
