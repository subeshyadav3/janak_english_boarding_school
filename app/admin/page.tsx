"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LogOut,
  Users,
  Megaphone,
  Trophy,
  ImageIcon,
  Quote,
  Settings,
  Inbox,
  Plus,
  Trash2,
  Save,
  Eye,
  Home,
  LayoutDashboard,
  UserCog,
  Phone,
} from "lucide-react";
import { ToastProvider, useToast } from "@/lib/ui/Toast";
import ConfirmDialog from "@/lib/ui/ConfirmDialog";
import FileUpload from "@/lib/ui/FileUpload";

type Tab = "overview" | "teachers" | "notices" | "results" | "gallery" | "testimonials" | "enquiries" | "users" | "settings";

type Teacher = { id: string; name: string; position?: string; subject?: string; phone?: string; photo?: string; order: number };
type Notice = { id: string; title: string; description?: string; filePath?: string };
type Result = { id: string; title: string; driveLink?: string; filePath?: string };
type GalleryItem = { id: string; imagePath: string; title?: string };
type Testimonial = { id: string; name: string; message: string };
type Enquiry = { id: string; name: string; phone?: string; message: string; status: string };
type User = { id: string; username: string; name?: string; role: string; createdAt?: string };

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "teachers", label: "Teachers", icon: Users },
  { id: "notices", label: "Notices", icon: Megaphone },
  { id: "results", label: "Results", icon: Trophy },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "testimonials", label: "Testimonials", icon: Quote },
  { id: "enquiries", label: "Enquiries", icon: Inbox },
  { id: "users", label: "Users", icon: UserCog },
  { id: "settings", label: "Settings", icon: Settings },
];

async function j<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export default function AdminDashboard() {
  return (
    <ToastProvider>
      <AdminDashboardInner />
    </ToastProvider>
  );
}

function AdminDashboardInner() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");

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
              <LayoutDashboard className="h-5 w-5 text-accent" />
            </span>
            <div>
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-white/60">Janak English Boarding School</p>
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
          {TABS.map((t) => (
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
        {tab === "overview" && <Overview />}
        {tab === "teachers" && <TeachersManager />}
        {tab === "notices" && <NoticesManager />}
        {tab === "results" && <ResultsManager />}
        {tab === "gallery" && <GalleryManager />}
        {tab === "testimonials" && <TestimonialsManager />}
        {tab === "enquiries" && <EnquiriesManager />}
        {tab === "users" && <UsersManager />}
        {tab === "settings" && <SettingsManager />}
      </main>
    </div>
  );
}

function useFetch<T>(url: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const d = await j<T[]>(url);
      setData(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [url]);
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
  return { data, setData, loading, load };
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

function ErrorBanner({ error, onClose }: { error: string; onClose: () => void }) {
  if (!error) return null;
  return (
    <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
      <span>{error}</span>
      <button onClick={onClose} className="font-bold">×</button>
    </div>
  );
}

// ---------- Overview ----------
function Overview() {
  const teachers = useFetch<Teacher>("/api/admin/teachers");
  const notices = useFetch<Notice>("/api/admin/notices");
  const results = useFetch<Result>("/api/admin/results");
  const gallery = useFetch<GalleryItem>("/api/admin/gallery");
  const testimonials = useFetch<Testimonial>("/api/admin/testimonials");
  const enquiries = useFetch<Enquiry>("/api/admin/enquiries");

  const cards = [
    { label: "Teachers", count: teachers.data.length, icon: Users, color: "from-brand to-brand-dark" },
    { label: "Notices", count: notices.data.length, icon: Megaphone, color: "from-accent to-orange-400" },
    { label: "Results", count: results.data.length, icon: Trophy, color: "from-violet-600 to-purple-500" },
    { label: "Gallery Photos", count: gallery.data.length, icon: ImageIcon, color: "from-teal-600 to-emerald-500" },
    { label: "Testimonials", count: testimonials.data.length, icon: Quote, color: "from-pink-600 to-rose-500" },
    { label: "New Enquiries", count: enquiries.data.filter((e) => e.status === "new").length, icon: Inbox, color: "from-sky-600 to-blue-500" },
  ];

  const recentEnquiries = enquiries.data.slice(0, 5);

  return (
    <PageShell title="Overview" subtitle="Quick summary of your school website content.">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white border border-line p-5 shadow-sm">
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white`}>
              <c.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-3xl font-extrabold text-brand-deep">{c.count}</p>
            <p className="text-sm text-brand-deep/60">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white border border-line shadow-sm">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h3 className="font-bold">Recent Enquiries</h3>
          <span className="text-xs font-semibold rounded-full bg-accent/15 text-accent px-3 py-1">
            {enquiries.data.filter((e) => e.status === "new").length} new
          </span>
        </div>
        {recentEnquiries.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-brand-deep/50">No enquiries yet.</p>
        ) : (
          <div className="divide-y divide-line">
            {recentEnquiries.map((e) => (
              <div key={e.id} className="flex items-center gap-4 px-6 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand font-bold">
                  {e.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{e.name}</p>
                  <p className="text-sm text-brand-deep/60 truncate">{e.message}</p>
                </div>
                {e.phone && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-sm text-brand-deep/60">
                    <Phone className="h-3.5 w-3.5" /> {e.phone}
                  </span>
                )}
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                  e.status === "new" ? "bg-accent/15 text-accent"
                  : e.status === "contacted" ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
                }`}>
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

// ---------- Teachers ----------
function TeachersManager() {
  const { data, setData, loading } = useFetch<Teacher>("/api/admin/teachers");
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  const save = async (item: Teacher) => {
    try {
      const updated = await j<Teacher>(`/api/admin/teachers/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      setData((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      toast("success", "Teacher saved");
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    }
  };

  const add = async () => {
    try {
      const created = await j<Teacher>("/api/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Teacher", order: data.length + 1 }),
      });
      setData((prev) => [...prev, created]);
      toast("success", "Teacher added");
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    }
  };

  const remove = async (id: string) => {
    try {
      await j(`/api/admin/teachers/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((t) => t.id !== id));
      setConfirmId(null);
      toast("success", "Teacher deleted");
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    }
  };

  const set = (id: string, field: keyof Teacher, value: string | number) =>
    setData((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));

  if (loading) return <p className="text-sm text-brand-deep/60">Loading...</p>;

  return (
    <PageShell title="Teachers" subtitle="Manage the teaching staff shown on the website.">
      <ErrorBanner error={error} onClose={() => setError("")} />
      <button
        onClick={add}
        className="mb-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark"
      >
        <Plus className="h-4 w-4" /> Add Teacher
      </button>
      <div className="grid gap-4 md:grid-cols-2">
        {data.map((t) => (
          <div key={t.id} className="rounded-xl bg-white border border-line p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <input value={t.name} onChange={(e) => set(t.id, "name", e.target.value)}
                placeholder="Name" className="admin-input flex-1" />
              <input value={t.position ?? ""} onChange={(e) => set(t.id, "position", e.target.value)}
                placeholder="Position" className="admin-input flex-1" />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input value={t.subject ?? ""} onChange={(e) => set(t.id, "subject", e.target.value)}
                placeholder="Subject" className="admin-input flex-1" />
              <input value={t.phone ?? ""} onChange={(e) => set(t.id, "phone", e.target.value)}
                placeholder="Phone" className="admin-input flex-1" />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input type="number" value={t.order} onChange={(e) => set(t.id, "order", Number(e.target.value))}
                placeholder="Order" className="admin-input w-24" />
              <span className="text-sm font-medium text-brand-deep/60">Photo:</span>
              <FileUpload value={t.photo} onChange={(v) => set(t.id, "photo", v)} label="Upload Photo" />
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => save(t)}
                className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark">
                <Save className="h-4 w-4" /> Save
              </button>
              <button onClick={() => setConfirmId(t.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog
        open={confirmId !== null}
        title="Delete teacher?"
        message="This will remove the teacher from the website."
        onConfirm={() => confirmId && remove(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </PageShell>
  );
}

// ---------- Notices ----------
function NoticesManager() {
  const { data, setData, loading } = useFetch<Notice>("/api/admin/notices");
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  const save = async (item: Notice) => {
    try {
      const updated = await j<Notice>(`/api/admin/notices/${item.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      setData((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      toast("success", "Notice saved");
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    }
  };
  const add = async () => {
    try {
      const created = await j<Notice>("/api/admin/notices", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Notice" }),
      });
      setData((prev) => [created, ...prev]);
      toast("success", "Notice added");
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    }
  };
  const remove = async (id: string) => {
    try {
      await j(`/api/admin/notices/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((n) => n.id !== id));
      setConfirmId(null);
      toast("success", "Notice deleted");
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    }
  };
  const set = (id: string, field: keyof Notice, value: string) =>
    setData((prev) => prev.map((n) => (n.id === id ? { ...n, [field]: value } : n)));

  if (loading) return <p className="text-sm text-brand-deep/60">Loading...</p>;

  return (
    <PageShell title="Notices" subtitle="Publish announcements for parents and students. Optionally attach a PDF/image.">
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
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-brand-deep/60">
                {n.filePath ? "Attachment:" : "Attach a file (optional):"}
              </span>
              <FileUpload
                value={n.filePath}
                onChange={(v) => set(n.id, "filePath", v)}
                accept=".pdf,image/*"
                label={n.filePath ? "Replace File" : "Upload PDF / Image"}
              />
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => save(n)} className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark">
                <Save className="h-4 w-4" /> Save
              </button>
              <button onClick={() => setConfirmId(n.id)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog
        open={confirmId !== null}
        title="Delete notice?"
        message="This will remove the notice from the website."
        onConfirm={() => confirmId && remove(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </PageShell>
  );
}

// ---------- Results ----------
function ResultsManager() {
  const { data, setData, loading } = useFetch<Result>("/api/admin/results");
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  const save = async (item: Result) => {
    try {
      const updated = await j<Result>(`/api/admin/results/${item.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast("success", "Result saved");
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    }
  };
  const add = async () => {
    try {
      const created = await j<Result>("/api/admin/results", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Result" }),
      });
      setData((prev) => [created, ...prev]);
      toast("success", "Result added");
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    }
  };
  const remove = async (id: string) => {
    try {
      await j(`/api/admin/results/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((r) => r.id !== id));
      setConfirmId(null);
      toast("success", "Result deleted");
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    }
  };
  const set = (id: string, field: keyof Result, value: string) =>
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  if (loading) return <p className="text-sm text-brand-deep/60">Loading...</p>;

  return (
    <PageShell title="Exam Results" subtitle="Upload result files (PDF/image) or paste a Drive link for parents.">
      <ErrorBanner error={error} onClose={() => setError("")} />
      <button onClick={add} className="mb-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark">
        <Plus className="h-4 w-4" /> Add Result
      </button>
      <div className="space-y-3">
        {data.map((r) => (
          <div key={r.id} className="rounded-xl bg-white border border-line p-4 shadow-sm">
            <input value={r.title} onChange={(e) => set(r.id, "title", e.target.value)}
              placeholder="Result Title (e.g. First Term 2083 - Grade 8)" className="admin-input w-full" />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-brand-deep/60">
                {r.filePath ? "Result file:" : "Upload result file:"}
              </span>
              <FileUpload
                value={r.filePath}
                onChange={(v) => set(r.id, "filePath", v)}
                accept=".pdf,image/*"
                label={r.filePath ? "Replace File" : "Upload PDF / Image"}
              />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm font-medium text-brand-deep/60">Drive link (optional):</span>
              <input value={r.driveLink ?? ""} onChange={(e) => set(r.id, "driveLink", e.target.value)}
                placeholder="https://drive.google.com/..." className="admin-input flex-1" />
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => save(r)} className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark">
                <Save className="h-4 w-4" /> Save
              </button>
              <button onClick={() => setConfirmId(r.id)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog
        open={confirmId !== null}
        title="Delete result?"
        message="This will remove the result from the website."
        onConfirm={() => confirmId && remove(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </PageShell>
  );
}

// ---------- Gallery ----------
function GalleryManager() {
  const { data, setData, loading } = useFetch<GalleryItem>("/api/admin/gallery");
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const d = await res.json();
      const created = await j<GalleryItem>("/api/admin/gallery", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: d.url, title: "" }),
      });
      setData((prev) => [created, ...prev]);
    } catch (e) { setError((e as Error).message); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await j(`/api/admin/gallery/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((g) => g.id !== id));
    } catch (e) { setError((e as Error).message); }
  };

  if (loading) return <p className="text-sm text-brand-deep/60">Loading...</p>;

  return (
    <PageShell title="Gallery" subtitle="Upload and manage school photos.">
      <ErrorBanner error={error} onClose={() => setError("")} />
      <label className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark">
        <Plus className="h-4 w-4" /> Upload New Photo
        <input type="file" accept="image/*" className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data.map((g) => (
          <div key={g.id} className="group relative aspect-square overflow-hidden rounded-xl border border-line">
            <Image src={g.imagePath} alt={g.title || "Gallery"} fill className="object-cover" />
            <button onClick={() => remove(g.id)}
              className="absolute right-2 top-2 rounded-lg bg-red-600 p-2 text-white opacity-0 group-hover:opacity-100 transition">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------- Testimonials ----------
function TestimonialsManager() {
  const { data, setData, loading } = useFetch<Testimonial>("/api/admin/testimonials");
  const [error, setError] = useState("");

  const save = async (item: Testimonial) => {
    try {
      const updated = await j<Testimonial>(`/api/admin/testimonials/${item.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      setData((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) { setError((e as Error).message); }
  };
  const add = async () => {
    try {
      const created = await j<Testimonial>("/api/admin/testimonials", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Parent", message: "Testimonial message" }),
      });
      setData((prev) => [created, ...prev]);
    } catch (e) { setError((e as Error).message); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await j(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((t) => t.id !== id));
    } catch (e) { setError((e as Error).message); }
  };
  const set = (id: string, field: keyof Testimonial, value: string) =>
    setData((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));

  if (loading) return <p className="text-sm text-brand-deep/60">Loading...</p>;

  return (
    <PageShell title="Testimonials" subtitle="Show what parents and students say.">
      <ErrorBanner error={error} onClose={() => setError("")} />
      <button onClick={add} className="mb-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark">
        <Plus className="h-4 w-4" /> Add Testimonial
      </button>
      <div className="space-y-3">
        {data.map((t) => (
          <div key={t.id} className="rounded-xl bg-white border border-line p-4 shadow-sm">
            <input value={t.name} onChange={(e) => set(t.id, "name", e.target.value)}
              placeholder="Name" className="admin-input w-full" />
            <textarea value={t.message} onChange={(e) => set(t.id, "message", e.target.value)}
              placeholder="Message" rows={2} className="admin-input mt-2 w-full" />
            <div className="mt-2 flex gap-2">
              <button onClick={() => save(t)} className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark">
                <Save className="h-4 w-4" /> Save
              </button>
              <button onClick={() => remove(t.id)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------- Enquiries ----------
function EnquiriesManager() {
  const { data, setData, loading } = useFetch<Enquiry>("/api/admin/enquiries");
  const [error, setError] = useState("");

  const setStatus = async (id: string, status: string) => {
    try {
      const updated = await j<Enquiry>(`/api/admin/enquiries/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setData((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } catch (e) { setError((e as Error).message); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await j(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((e) => e.id !== id));
    } catch (e) { setError((e as Error).message); }
  };

  if (loading) return <p className="text-sm text-brand-deep/60">Loading...</p>;

  return (
    <PageShell title="Enquiries" subtitle="Messages sent through the contact form.">
      <ErrorBanner error={error} onClose={() => setError("")} />
      <div className="space-y-3">
        {data.length === 0 && (
          <p className="text-sm text-brand-deep/60">No enquiries yet.</p>
        )}
        {data.map((e) => (
          <div key={e.id} className="rounded-xl bg-white border border-line p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-bold">{e.name}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                e.status === "new" ? "bg-accent/15 text-accent"
                : e.status === "contacted" ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
              }`}>
                {e.status}
              </span>
            </div>
            {e.phone && <p className="mt-1 text-sm text-brand-deep/70">Phone: {e.phone}</p>}
            <p className="mt-2 text-sm leading-relaxed">{e.message}</p>
            <div className="mt-3 flex gap-2">
              {e.status !== "contacted" && (
                <button onClick={() => setStatus(e.id, "contacted")}
                  className="rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">
                  Mark contacted
                </button>
              )}
              {e.status !== "resolved" && (
                <button onClick={() => setStatus(e.id, "resolved")}
                  className="rounded-lg border border-green-600 px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-50">
                  Mark resolved
                </button>
              )}
              <button onClick={() => remove(e.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-red-700">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------- Users ----------
function UsersManager() {
  const { data, setData, loading } = useFetch<User>("/api/admin/users");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", name: "", password: "", role: "teacher" });

  const addUser = async () => {
    try {
      const created = await j<User>("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setData((prev) => [created, ...prev]);
      setShowForm(false);
      setForm({ username: "", name: "", password: "", role: "teacher" });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await j(`/api/admin/users/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (loading) return <p className="text-sm text-brand-deep/60">Loading...</p>;

  return (
    <PageShell title="Users" subtitle="Create and manage staff login accounts.">
      <ErrorBanner error={error} onClose={() => setError("")} />
      <button onClick={() => setShowForm((v) => !v)}
        className="mb-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark">
        <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Add User"}
      </button>

      {showForm && (
        <div className="mb-6 max-w-lg rounded-xl bg-white border border-line p-5 shadow-sm">
          <div className="space-y-3">
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username" className="admin-input w-full" />
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name" className="admin-input w-full" />
            <input value={form.password} type="password" onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password (min 4 chars)" className="admin-input w-full" />
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="radio" checked={form.role === "teacher"} onChange={() => setForm({ ...form, role: "teacher" })} /> Teacher
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="radio" checked={form.role === "admin"} onChange={() => setForm({ ...form, role: "admin" })} /> Admin
              </label>
            </div>
            <button onClick={addUser}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark">
              Create User
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-white border border-line shadow-sm overflow-hidden">
        <div className="divide-y divide-line">
          {data.map((u) => (
            <div key={u.id} className="flex items-center gap-4 px-5 py-4">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold ${
                u.role === "admin" ? "bg-brand" : "bg-accent"
              }`}>
                {(u.name || u.username).charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{u.name || u.username}</p>
                <p className="text-sm text-brand-deep/60">@{u.username}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                u.role === "admin" ? "bg-brand-soft text-brand" : "bg-accent-soft text-accent"
              }`}>
                {u.role}
              </span>
              <button onClick={() => remove(u.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ---------- Settings ----------
const SETTING_FIELDS = [
  { key: "schoolName", label: "School Name" },
  { key: "tagline", label: "Tagline" },
  { key: "motto", label: "Motto" },
  { key: "address", label: "Address" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "facebook", label: "Facebook URL" },
  { key: "whatsapp", label: "WhatsApp Number (with country code, no +)" },
  { key: "logo", label: "Logo", image: true },
  { key: "cover1", label: "Cover 1", image: true },
  { key: "cover2", label: "Cover 2", image: true },
  { key: "cover3", label: "Cover 3", image: true },
  { key: "cover4", label: "Cover 4", image: true },
  { key: "cover5", label: "Cover 5", image: true },
  { key: "cover6", label: "Cover 6", image: true },
] as const;

function SettingsManager() {
  const [settings, setSettings] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const d = await j<Record<string, string | null>>("/api/admin/settings");
        if (d) setSettings(d);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await j("/api/admin/settings", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      toast("success", "Settings saved");
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string, value: string) => setSettings((prev) => ({ ...prev, [key]: value }));

  if (loading) return <p className="text-sm text-brand-deep/60">Loading...</p>;

  return (
    <PageShell title="Site Settings" subtitle="Update school info, contact details and images.">
      <ErrorBanner error={error} onClose={() => setError("")} />
      <div className="max-w-2xl space-y-4">
        {SETTING_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-semibold">{f.label}</label>
            {"image" in f && f.image ? (
              <FileUpload value={settings[f.key] ?? ""} onChange={(v) => set(f.key, v)} label="Upload Image" />
            ) : (
              <textarea value={settings[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}
                rows={f.key === "schoolName" ? 1 : 2} className="admin-input w-full" />
            )}
          </div>
        ))}
        <button onClick={save} disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
        </button>
        {saved && <span className="ml-3 text-sm font-semibold text-green-700">Saved!</span>}
        <p className="text-xs text-brand-deep/50">
          <Eye className="inline h-3 w-3 mr-1" />
          Refresh the homepage to see changes.
        </p>
      </div>
    </PageShell>
  );
}
