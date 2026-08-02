"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Eye,
  Home,
  LayoutDashboard,
  UserCog,
  Phone,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import { ToastProvider, useToast } from "@/lib/ui/Toast";
import ConfirmDialog from "@/lib/ui/ConfirmDialog";
import FileUpload from "@/lib/ui/FileUpload";
import Badge from "@/lib/ui/admin/Badge";
import ListRow from "@/lib/ui/admin/ListRow";
import CrudManager from "@/lib/ui/admin/CrudManager";
import Modal from "@/lib/ui/admin/Modal";
import { DetailRow } from "@/lib/ui/admin/DetailRow";
import { TextInput, Textarea, Select, Toggle, FormRow } from "@/lib/ui/admin/Controls";

type Tab =
  | "overview"
  | "teachers"
  | "notices"
  | "results"
  | "events"
  | "gallery"
  | "testimonials"
  | "enquiries"
  | "users"
  | "settings";

type Teacher = {
  id: string;
  name: string;
  position?: string | null;
  subject?: string | null;
  qualification?: string | null;
  email?: string | null;
  phone?: string | null;
  photo?: string | null;
  order: number;
  active: boolean;
  joinedAt?: string | null;
  createdAt?: string;
};
type Notice = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  filePath?: string | null;
  published?: boolean;
  publishAt?: string | null;
  createdAt?: string;
};
type Result = {
  id: string;
  title: string;
  driveLink?: string | null;
  filePath?: string | null;
  createdAt?: string;
};
type Event = {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  time?: string | null;
  location?: string | null;
  createdAt?: string;
};
type GalleryItem = {
  id: string;
  imagePath: string;
  title?: string | null;
  album?: string | null;
  createdAt?: string;
};
type Testimonial = {
  id: string;
  name: string;
  message: string;
  role?: string | null;
  rating?: number;
  photo?: string | null;
  createdAt?: string;
};
type Enquiry = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  message: string;
  category?: string | null;
  status: string;
  read?: boolean;
  createdAt?: string;
};
type User = {
  id: string;
  username: string;
  name?: string | null;
  role: string;
  createdAt?: string;
};

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "teachers", label: "Teachers", icon: Users },
  { id: "notices", label: "Notices", icon: Megaphone },
  { id: "results", label: "Results", icon: Trophy },
  { id: "events", label: "Events", icon: CalendarDays },
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

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

function Stars({ value }: { value: number }) {
  return (
    <span className="text-sm tracking-tight text-accent">
      {"★".repeat(Math.max(0, Math.min(5, value)))}
      <span className="text-line">{"★".repeat(Math.max(0, 5 - Math.min(5, value)))}</span>
    </span>
  );
}

function FileBadge({ path }: { path?: string | null }) {
  if (!path) return null;
  return /\.pdf$/i.test(path) ? <Badge label="PDF" color="rose" /> : <Badge label="Image" color="violet" />;
}

function LinkOut({ href, label = "Open" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-brand px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand/5 transition-colors"
    >
      <ExternalLink className="h-3.5 w-3.5" /> {label}
    </a>
  );
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
        {tab === "overview" && <Overview onNavigate={setTab} />}
        {tab === "teachers" && <TeachersManager />}
        {tab === "notices" && <NoticesManager />}
        {tab === "results" && <ResultsManager />}
        {tab === "events" && <EventsManager />}
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

// ---------- Overview ----------
function Overview({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const teachers = useFetch<Teacher>("/api/admin/teachers");
  const notices = useFetch<Notice>("/api/admin/notices");
  const results = useFetch<Result>("/api/admin/results");
  const events = useFetch<Event>("/api/admin/events");
  const gallery = useFetch<GalleryItem>("/api/admin/gallery");
  const testimonials = useFetch<Testimonial>("/api/admin/testimonials");
  const enquiries = useFetch<Enquiry>("/api/admin/enquiries");

  const cards = [
    { label: "Teachers", count: teachers.data.length, icon: Users, color: "from-brand to-brand-dark", tab: "teachers" as Tab },
    { label: "Notices", count: notices.data.length, icon: Megaphone, color: "from-accent to-orange-400", tab: "notices" as Tab },
    { label: "Results", count: results.data.length, icon: Trophy, color: "from-violet-600 to-purple-500", tab: "results" as Tab },
    { label: "Events", count: events.data.length, icon: CalendarDays, color: "from-amber-500 to-yellow-400", tab: "events" as Tab },
    { label: "Gallery Photos", count: gallery.data.length, icon: ImageIcon, color: "from-teal-600 to-emerald-500", tab: "gallery" as Tab },
    { label: "Testimonials", count: testimonials.data.length, icon: Quote, color: "from-pink-600 to-rose-500", tab: "testimonials" as Tab },
    { label: "New Enquiries", count: enquiries.data.filter((e) => e.status === "new").length, icon: Inbox, color: "from-sky-600 to-blue-500", tab: "enquiries" as Tab },
    { label: "Users", count: 0, icon: UserCog, color: "from-slate-600 to-slate-500", tab: "users" as Tab },
  ];

  const recentEnquiries = enquiries.data.slice(0, 5);

  return (
    <PageShell title="Overview" subtitle="Quick summary of your school website content.">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <button
            key={c.label}
            onClick={() => onNavigate(c.tab)}
            className="rounded-2xl bg-white border border-line p-5 shadow-sm text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white`}>
              <c.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-3xl font-extrabold text-brand-deep">{c.count}</p>
            <p className="text-sm text-brand-deep/60">{c.label}</p>
          </button>
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
  return (
    <PageShell title="Teachers" subtitle="Manage the teaching staff shown on the website.">
      <CrudManager<Teacher>
        title="Teacher"
        endpoint="/api/admin/teachers"
        addLabel="Add Teacher"
        blank={{ name: "", position: "", subject: "", qualification: "", email: "", phone: "", photo: "", order: 1, active: true }}
        emptyIcon={Users}
        emptyTitle="No teachers yet"
        emptyMessage="Add your first teacher to show them on the website."
        searchKeys={["name", "position", "subject", "phone"]}
        searchPlaceholder="Search teachers..."
        formTitle="Teacher details"
        formSubtitle="Fill in the details and save."
        createBody={(f) => ({
          name: f.name || "New Teacher",
          position: f.position ?? "",
          subject: f.subject ?? "",
          qualification: f.qualification ?? "",
          email: f.email ?? "",
          phone: f.phone ?? "",
          photo: f.photo ?? "",
          order: Number(f.order ?? 1),
          active: f.active ?? true,
        })}
        updateBody={(f) => ({
          name: f.name || "New Teacher",
          position: f.position ?? "",
          subject: f.subject ?? "",
          qualification: f.qualification ?? "",
          email: f.email ?? "",
          phone: f.phone ?? "",
          photo: f.photo ?? "",
          order: Number(f.order ?? 1),
          active: f.active ?? true,
        })}
        renderRow={(t, { onView, onEdit, onDelete }) => (
          <ListRow
            avatar={t.photo}
            fallbackText={(t.name || "?").charAt(0).toUpperCase()}
            title={t.name}
            subtitle={`${t.position || "Teacher"}${t.subject ? ` • ${t.subject}` : ""}`}
            badges={<>{t.active === false && <Badge label="Inactive" color="gray" />}</>}
            meta={t.phone || undefined}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        renderForm={(f, set) => (
          <div className="space-y-4">
            <FormRow>
              <TextInput label="Full name" required value={f.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
              <TextInput label="Position" value={f.position ?? ""} onChange={(e) => set({ position: e.target.value })} placeholder="e.g. Principal, Class Teacher" />
            </FormRow>
            <FormRow>
              <TextInput label="Subject" value={f.subject ?? ""} onChange={(e) => set({ subject: e.target.value })} placeholder="e.g. Mathematics" />
              <TextInput label="Qualification" value={f.qualification ?? ""} onChange={(e) => set({ qualification: e.target.value })} />
            </FormRow>
            <FormRow>
              <TextInput label="Email" type="email" value={f.email ?? ""} onChange={(e) => set({ email: e.target.value })} />
              <TextInput label="Phone" value={f.phone ?? ""} onChange={(e) => set({ phone: e.target.value })} />
            </FormRow>
            <FormRow>
              <TextInput label="Display order" type="number" value={String(f.order ?? 1)} onChange={(e) => set({ order: Number(e.target.value) })} />
              <div className="flex items-end">
                <Toggle label="Show on website" checked={f.active !== false} onChange={(v) => set({ active: v })} />
              </div>
            </FormRow>
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-brand-deep">Photo</span>
              <FileUpload value={f.photo ?? ""} onChange={(v) => set({ photo: v })} accept="image/*" label="Upload Photo" />
            </div>
          </div>
        )}
        renderView={(t) => (
          <div className="space-y-4">
            {t.photo && (
              <div className="flex justify-center">
                <img src={t.photo} alt={t.name} className="h-32 w-32 rounded-2xl object-cover ring-1 ring-line" />
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Name">{t.name}</DetailRow>
              <DetailRow label="Position">{t.position || "—"}</DetailRow>
              <DetailRow label="Subject">{t.subject || "—"}</DetailRow>
              <DetailRow label="Qualification">{t.qualification || "—"}</DetailRow>
              <DetailRow label="Email">{t.email || "—"}</DetailRow>
              <DetailRow label="Phone">{t.phone || "—"}</DetailRow>
              <DetailRow label="Status">{t.active === false ? "Inactive" : "Active"}</DetailRow>
              <DetailRow label="Joined">{fmtDate(t.joinedAt) || "—"}</DetailRow>
            </div>
          </div>
        )}
        deleteConfirmTitle={(t) => `Delete ${t.name}?`}
        deleteConfirmMessage="This will remove the teacher from the website."
      />
    </PageShell>
  );
}

// ---------- Notices ----------
function NoticesManager() {
  return (
    <PageShell title="Notices" subtitle="Publish announcements for parents and students.">
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
        formSubtitle="Optionally attach a PDF/image."
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
                {n.filePath && <Badge label="File" color="rose" />}
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
            <DetailRow label="Published on">{fmtDate(n.createdAt) || "—"}</DetailRow>
            {n.description && <DetailRow label="Description">{n.description}</DetailRow>}
            {n.filePath && (
              <DetailRow label="Attachment">
                <LinkOut href={n.filePath} label="Open attachment" />
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

// ---------- Results ----------
function ResultsManager() {
  return (
    <PageShell title="Exam Results" subtitle="Upload result files (PDF/image) or paste a Drive link for parents.">
      <CrudManager<Result>
        title="Result"
        endpoint="/api/admin/results"
        addLabel="Add Result"
        blank={{ title: "", driveLink: "", filePath: "" }}
        emptyIcon={Trophy}
        emptyTitle="No results yet"
        emptyMessage="Upload result files or share a Drive link for parents."
        searchKeys={["title"]}
        searchPlaceholder="Search results..."
        formTitle="Result details"
        createBody={(f) => ({ title: f.title || "New Result", driveLink: f.driveLink ?? "", filePath: f.filePath ?? "" })}
        updateBody={(f) => ({ title: f.title || "New Result", driveLink: f.driveLink ?? "", filePath: f.filePath ?? "" })}
        renderRow={(r, { onView, onEdit, onDelete }) => (
          <ListRow
            title={r.title}
            subtitle={fmtDate(r.createdAt)}
            badges={
              <>
                <FileBadge path={r.filePath} />
                {r.driveLink && <Badge label="Drive link" color="blue" />}
              </>
            }
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        renderForm={(f, set) => (
          <div className="space-y-4">
            <TextInput label="Title" required value={f.title ?? ""} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. First Term 2083 - Grade 8" />
            <TextInput label="Google Drive link (optional)" value={f.driveLink ?? ""} onChange={(e) => set({ driveLink: e.target.value })} placeholder="https://drive.google.com/..." />
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-brand-deep">Result file (PDF / image)</span>
              <FileUpload value={f.filePath ?? ""} onChange={(v) => set({ filePath: v })} accept=".pdf,image/*" label={f.filePath ? "Replace File" : "Upload PDF / Image"} />
            </div>
          </div>
        )}
        renderView={(r) => (
          <div className="space-y-4">
            <DetailRow label="Title">{r.title}</DetailRow>
            <DetailRow label="Posted on">{fmtDate(r.createdAt) || "—"}</DetailRow>
            {r.filePath && (
              <DetailRow label="File">
                <LinkOut href={r.filePath} label="Open result file" />
              </DetailRow>
            )}
            {r.driveLink && (
              <DetailRow label="Drive link">
                <LinkOut href={r.driveLink} label="Open Drive link" />
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

// ---------- Events ----------
function EventsManager() {
  const eventDate = (f: Partial<Event>) => {
    const d = f.date ? new Date(f.date) : new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  return (
    <PageShell title="Events" subtitle="Manage school events shown on the website.">
      <CrudManager<Event>
        title="Event"
        endpoint="/api/admin/events"
        addLabel="Add Event"
        blank={{ title: "", description: "", date: "", time: "", location: "" }}
        emptyIcon={CalendarDays}
        emptyTitle="No events yet"
        emptyMessage="Add upcoming school events for parents and students."
        searchKeys={["title", "location"]}
        searchPlaceholder="Search events..."
        formTitle="Event details"
        createBody={(f) => ({ title: f.title || "New Event", description: f.description ?? "", date: f.date || new Date().toISOString(), time: f.time ?? "", location: f.location ?? "" })}
        updateBody={(f) => ({ title: f.title || "New Event", description: f.description ?? "", date: f.date || new Date().toISOString(), time: f.time ?? "", location: f.location ?? "" })}
        renderRow={(e, { onView, onEdit, onDelete }) => (
          <ListRow
            title={e.title}
            subtitle={`${fmtDate(e.date)}${e.time ? ` at ${e.time}` : ""}`}
            badges={<>{e.location && <Badge label={e.location} color="green" />}</>}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        renderForm={(f, set) => (
          <div className="space-y-4">
            <TextInput label="Title" required value={f.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
            <FormRow>
              <TextInput label="Date" type="date" value={eventDate(f)} onChange={(e) => set({ date: e.target.value })} />
              <TextInput label="Time (optional)" type="time" value={f.time ?? ""} onChange={(e) => set({ time: e.target.value })} />
            </FormRow>
            <TextInput label="Location (optional)" value={f.location ?? ""} onChange={(e) => set({ location: e.target.value })} />
            <Textarea label="Description (optional)" rows={3} value={f.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        )}
        renderView={(e) => (
          <div className="space-y-4">
            <DetailRow label="Title">{e.title}</DetailRow>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Date">{fmtDate(e.date)}</DetailRow>
              <DetailRow label="Time">{e.time || "—"}</DetailRow>
            </div>
            <DetailRow label="Location">{e.location || "—"}</DetailRow>
            {e.description && <DetailRow label="Description">{e.description}</DetailRow>}
          </div>
        )}
        deleteConfirmTitle={(e) => `Delete "${e.title}"?`}
        deleteConfirmMessage="This will remove the event from the website."
      />
    </PageShell>
  );
}

// ---------- Gallery ----------
function GalleryManager() {
  return (
    <PageShell title="Gallery" subtitle="Upload and manage school photos.">
      <CrudManager<GalleryItem>
        title="Photo"
        endpoint="/api/admin/gallery"
        addLabel="Add Photo"
        blank={{ imagePath: "", title: "", album: "" }}
        emptyIcon={ImageIcon}
        emptyTitle="No photos yet"
        emptyMessage="Upload school photos to show in the gallery."
        searchKeys={["title", "album"]}
        searchPlaceholder="Search photos..."
        formTitle="Photo details"
        createBody={(f) => ({ imagePath: f.imagePath || "", title: f.title ?? "", album: f.album ?? "" })}
        updateBody={(f) => ({ imagePath: f.imagePath || "", title: f.title ?? "", album: f.album ?? "" })}
        renderRow={(g, { onView, onEdit, onDelete }) => (
          <ListRow
            avatar={g.imagePath}
            title={g.title || "Untitled photo"}
            subtitle={fmtDate(g.createdAt)}
            badges={<>{g.album && <Badge label={g.album} color="violet" />}</>}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        renderForm={(f, set) => (
          <div className="space-y-4">
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-brand-deep">Photo</span>
              <FileUpload value={f.imagePath ?? ""} onChange={(v) => set({ imagePath: v })} accept="image/*" label="Upload Photo" />
            </div>
            <TextInput label="Title (optional)" value={f.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
            <TextInput label="Album (optional)" value={f.album ?? ""} onChange={(e) => set({ album: e.target.value })} />
          </div>
        )}
        renderView={(g) => (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl bg-surface-muted">
              <img src={g.imagePath} alt={g.title || "Gallery"} className="w-full max-h-96 object-contain" />
            </div>
            <DetailRow label="Title">{g.title || "—"}</DetailRow>
            <DetailRow label="Album">{g.album || "—"}</DetailRow>
            <DetailRow label="Uploaded on">{fmtDate(g.createdAt) || "—"}</DetailRow>
          </div>
        )}
        deleteConfirmTitle={() => "Delete this photo?"}
        deleteConfirmMessage="This will remove the photo from the gallery."
      />
    </PageShell>
  );
}

// ---------- Testimonials ----------
function TestimonialsManager() {
  return (
    <PageShell title="Testimonials" subtitle="Show what parents and students say.">
      <CrudManager<Testimonial>
        title="Testimonial"
        endpoint="/api/admin/testimonials"
        addLabel="Add Testimonial"
        blank={{ name: "", message: "", role: "parent", rating: 5, photo: "" }}
        emptyIcon={Quote}
        emptyTitle="No testimonials yet"
        emptyMessage="Add reviews from parents and students."
        searchKeys={["name", "role"]}
        searchPlaceholder="Search testimonials..."
        formTitle="Testimonial details"
        createBody={(f) => ({ name: f.name || "Parent", message: f.message || "", role: f.role ?? "parent", rating: Number(f.rating ?? 5), photo: f.photo ?? "" })}
        updateBody={(f) => ({ name: f.name || "Parent", message: f.message || "", role: f.role ?? "parent", rating: Number(f.rating ?? 5), photo: f.photo ?? "" })}
        renderRow={(t, { onView, onEdit, onDelete }) => (
          <ListRow
            avatar={t.photo}
            fallbackText={(t.name || "?").charAt(0).toUpperCase()}
            title={t.name}
            subtitle={t.role || undefined}
            badges={<Stars value={t.rating ?? 5} />}
            meta={
              <span className="max-w-[220px] truncate italic text-brand-deep/50">&ldquo;{t.message}&rdquo;</span>
            }
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        renderForm={(f, set) => (
          <div className="space-y-4">
            <FormRow>
              <TextInput label="Name" required value={f.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
              <Select label="Role" value={f.role || "parent"} onChange={(e) => set({ role: e.target.value })}>
                <option value="parent">Parent</option>
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </Select>
            </FormRow>
            <Select label="Rating" value={String(f.rating ?? 5)} onChange={(e) => set({ rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
              ))}
            </Select>
            <Textarea label="Message" rows={3} required value={f.message ?? ""} onChange={(e) => set({ message: e.target.value })} />
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-brand-deep">Photo (optional)</span>
              <FileUpload value={f.photo ?? ""} onChange={(v) => set({ photo: v })} accept="image/*" label="Upload Photo" />
            </div>
          </div>
        )}
        renderView={(t) => (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {t.photo && <img src={t.photo} alt={t.name} className="h-14 w-14 rounded-full object-cover ring-1 ring-line" />}
              <div>
                <p className="font-bold">{t.name}</p>
                {t.role && <p className="text-sm text-brand-deep/60">{t.role}</p>}
                <Stars value={t.rating ?? 5} />
              </div>
            </div>
            <DetailRow label="Message">{t.message}</DetailRow>
            <DetailRow label="Posted on">{fmtDate(t.createdAt) || "—"}</DetailRow>
          </div>
        )}
        deleteConfirmTitle={(t) => `Delete ${t.name}'s testimonial?`}
        deleteConfirmMessage="This will remove the testimonial from the website."
      />
    </PageShell>
  );
}

// ---------- Enquiries ----------
function EnquiriesManager() {
  const [data, setData] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Enquiry | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await j<Enquiry[]>("/api/admin/enquiries");
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = search.trim()
    ? data.filter((e) =>
        [e.name, e.phone, e.email, e.subject, e.message]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const setStatus = async (id: string, status: string) => {
    try {
      const updated = await j<Enquiry>(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setData((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setViewing((v) => (v && v.id === updated.id ? updated : v));
      toast("success", `Marked as ${status}`);
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    }
  };

  const remove = async (id: string) => {
    try {
      await j(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((e) => e.id !== id));
      setConfirmId(null);
      setViewing(null);
      toast("success", "Enquiry deleted");
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    }
  };

  if (loading) return <p className="text-sm text-brand-deep/60">Loading...</p>;

  return (
    <PageShell title="Enquiries" subtitle="Messages sent through the contact form.">
      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold">×</button>
        </div>
      )}
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search enquiries..."
          className="admin-input w-full max-w-xs"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <Inbox className="h-6 w-6" />
          </span>
          <h3 className="mt-4 font-bold text-brand-deep">No enquiries yet</h3>
          <p className="mt-1 max-w-sm text-sm text-brand-deep/60">Messages from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white border border-line shadow-sm">
          <div className="divide-y divide-line">
            {filtered.map((e) => (
              <div key={e.id} className="flex items-center gap-4 px-4 py-4 sm:px-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand font-bold">
                  {e.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-brand-deep">{e.name}</p>
                    <Badge
                      label={e.status}
                      color={e.status === "new" ? "accent" : e.status === "contacted" ? "blue" : "green"}
                    />
                  </div>
                  <p className="mt-0.5 truncate text-sm text-brand-deep/60">
                    {e.subject || e.message}
                    {e.phone && ` • ${e.phone}`}
                  </p>
                </div>
                <span className="hidden shrink-0 text-sm text-brand-deep/60 md:block">{fmtDate(e.createdAt)}</span>
                <button
                  onClick={() => setViewing(e)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-brand-deep/60 hover:border-brand hover:bg-brand-soft hover:text-brand transition-colors"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setConfirmId(e.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-brand-deep/60 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={viewing !== null} onClose={() => setViewing(null)} title="Enquiry details" subtitle="Message from the contact form">
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand font-bold">
                {viewing.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="font-bold">{viewing.name}</p>
                <Badge
                  label={viewing.status}
                  color={viewing.status === "new" ? "accent" : viewing.status === "contacted" ? "blue" : "green"}
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailRow label="Phone">{viewing.phone || "—"}</DetailRow>
              <DetailRow label="Email">{viewing.email || "—"}</DetailRow>
              <DetailRow label="Subject">{viewing.subject || "—"}</DetailRow>
              <DetailRow label="Received on">{fmtDate(viewing.createdAt)}</DetailRow>
            </div>
            <DetailRow label="Message">{viewing.message}</DetailRow>
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
              {viewing.status !== "contacted" && (
                <button
                  onClick={() => setStatus(viewing.id, "contacted")}
                  className="rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Mark contacted
                </button>
              )}
              {viewing.status !== "resolved" && (
                <button
                  onClick={() => setStatus(viewing.id, "resolved")}
                  className="rounded-lg border border-green-600 px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-50"
                >
                  Mark resolved
                </button>
              )}
              <button
                onClick={() => {
                  const id = viewing.id;
                  setViewing(null);
                  setConfirmId(id);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-red-700 ml-auto"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete enquiry?"
        message="This will permanently remove the enquiry."
        onConfirm={() => confirmId && remove(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </PageShell>
  );
}

// ---------- Users ----------
function UsersManager() {
  return (
    <PageShell title="Users" subtitle="Create and manage staff login accounts.">
      <CrudManager<User & { password?: string }>
        title="User"
        endpoint="/api/admin/users"
        addLabel="Add User"
        blank={{ username: "", name: "", password: "", role: "teacher" }}
        emptyIcon={UserCog}
        emptyTitle="No users yet"
        emptyMessage="Create login accounts for staff."
        searchKeys={["username", "name", "role"]}
        searchPlaceholder="Search users..."
        formTitle="User account"
        formSubtitle="Teachers can manage results and notices."
        createBody={(f) => ({
          username: f.username || "",
          name: f.name ?? "",
          password: f.password || "",
          role: f.role === "admin" ? "admin" : "teacher",
        })}
        updateBody={(f) => ({
          name: f.name ?? "",
          role: f.role === "admin" ? "admin" : "teacher",
          ...(f.password ? { password: f.password } : {}),
        })}
        renderRow={(u, { onEdit, onDelete }) => (
          <ListRow
            fallbackText={(u.name || u.username).charAt(0).toUpperCase()}
            fallbackClass={u.role === "admin" ? "bg-brand text-white" : "bg-accent text-white"}
            title={u.name || u.username}
            subtitle={`@${u.username}`}
            badges={<Badge label={u.role} color={u.role === "admin" ? "brand" : "accent"} />}
            meta={fmtDate(u.createdAt)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        renderForm={(f, set) => (
          <div className="space-y-4">
            <TextInput
              label="Username"
              required
              value={f.username ?? ""}
              onChange={(e) => set({ username: e.target.value })}
              hint="Used to log in."
            />
            <TextInput label="Full name" value={f.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
            <TextInput
              label={f.password !== undefined ? "Password (leave blank to keep current)" : "Password"}
              type="password"
              value={f.password ?? ""}
              onChange={(e) => set({ password: e.target.value })}
              hint="At least 4 characters."
            />
            <Select label="Role" value={f.role || "teacher"} onChange={(e) => set({ role: e.target.value })}>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
        )}
        deleteConfirmTitle={(u) => `Delete user ${u.username}?`}
        deleteConfirmMessage="This will remove their login access."
      />
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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold">×</button>
        </div>
      )}
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
          {saving ? "Saving..." : "Save Settings"}
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
