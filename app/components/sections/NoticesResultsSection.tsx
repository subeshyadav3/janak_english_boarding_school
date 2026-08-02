"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Megaphone,
  Trophy,
  X,
  Loader2,
  Eye,
} from "lucide-react";

type Notice = {
  id: string;
  title: string;
  description?: string | null;
  filePath?: string | null;
  createdAt?: string | Date;
};

type Result = {
  id: string;
  title: string;
  driveLink?: string | null;
  filePath?: string | null;
  createdAt?: string | Date;
};

const NOTICES_PER_PAGE = 5;

function formatDate(d?: string | Date) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isImage(url?: string | null) {
  return url ? /\.(png|jpe?g|webp|gif)$/i.test(url) : false;
}

function isPdf(url?: string | null) {
  return url ? /\.pdf$/i.test(url) : false;
}

function NoticesList({ notices }: { notices: Notice[] }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(notices.length / NOTICES_PER_PAGE));
  const current = Math.min(page, totalPages - 1);
  const pageItems = notices.slice(
    current * NOTICES_PER_PAGE,
    current * NOTICES_PER_PAGE + NOTICES_PER_PAGE
  );

  useEffect(() => {
    if (notices.length === 0) return;
    const t = setInterval(() => setPage((v) => (v + 1) % totalPages), 6000);
    return () => clearInterval(t);
  }, [notices.length, totalPages]);

  return (
    <div className="relative">
      <div className="space-y-3">
        {pageItems.map((n, i) => (
          <div
            key={n.id}
            style={{ animationDelay: `${i * 60}ms` }}
            className="notice-card flex items-start gap-3 rounded-xl border border-line bg-white p-4 shadow-sm hover:border-brand/40 hover:shadow-md transition-all"
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Megaphone className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-brand-deep/50">
                <span className="font-semibold text-accent">
                  {current * NOTICES_PER_PAGE + i + 1}.
                </span>
                <span>{formatDate(n.createdAt)}</span>
              </div>
              <h3 className="mt-0.5 font-bold leading-snug">
                {n.title || "Notice"}
              </h3>
              {n.description && (
                <p className="mt-1 text-sm leading-relaxed text-brand-deep/75 line-clamp-2">
                  {n.description}
                </p>
              )}
              {n.filePath && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <FileViewer compact title={n.title || "Notice"} filePath={n.filePath} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => setPage((v) => (v - 1 + totalPages) % totalPages)}
            disabled={totalPages <= 1}
            className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-brand-deep/80 hover:border-brand hover:text-brand disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Newer
          </button>
          <span className="text-sm font-medium text-brand-deep/60">
            Page {current + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((v) => (v + 1) % totalPages)}
            disabled={totalPages <= 1}
            className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-brand-deep/80 hover:border-brand hover:text-brand disabled:opacity-40 transition-colors"
          >
            Older <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function FileViewer({
  title,
  filePath,
  compact = false,
}: {
  title: string;
  filePath: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const showViewer = isImage(filePath) || isPdf(filePath);

  const openViewer = () => {
    setLoading(true);
    setOpen(true);
  };

  const btn = compact
    ? "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors"
    : "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-colors";

  const iconBtn = compact
    ? "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
    : "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors";

  return (
    <>
      <button
        onClick={openViewer}
        className={`${btn} bg-brand text-white hover:bg-brand-dark`}
      >
        <Eye className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} /> View
      </button>
      <a
        href={filePath}
        target="_blank"
        rel="noreferrer"
        className={`${btn} border border-line bg-white text-brand-deep/80 hover:border-brand hover:text-brand`}
      >
        <ExternalLink className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} /> Open
      </a>
      <a
        href={filePath}
        download
        title="Download"
        aria-label="Download"
        className={`${iconBtn} bg-gradient-to-r from-accent to-orange-400 text-white hover:opacity-90`}
      >
        <Download className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </a>

      {open && showViewer && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-deep/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-toast-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <h3 className="truncate pr-4 font-bold">{title}</h3>
              <div className="flex items-center gap-2">
                <a
                  href={filePath}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-bold text-brand-deep/70 hover:border-brand hover:text-brand transition-colors"
                >
                  <ExternalLink className="h-4 w-4" /> Open
                </a>
                <a
                  href={filePath}
                  download
                  title="Download"
                  aria-label="Download"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-dark transition-colors"
                >
                  <Download className="h-4 w-4" />
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-brand-deep/60 hover:bg-surface hover:text-brand transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-surface-muted">
              {loading && (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-brand" />
                </div>
              )}
              {isPdf(filePath) ? (
                <iframe
                  src={`${filePath}#toolbar=1`}
                  title={title}
                  className="h-full w-full border-0"
                  onLoad={() => setLoading(false)}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={filePath}
                  alt={title}
                  onLoad={() => setLoading(false)}
                  className="mx-auto max-h-full w-auto object-contain p-2"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function NoticesResultsSection({
  notices,
  results,
}: {
  notices: Notice[];
  results: Result[];
}) {
  const noticeCount = useMemo(() => notices.length, [notices.length]);

  return (
    <div className="section-pad">
      <div className="container-site grid gap-10 lg:grid-cols-2">
        <section id="notices" className="scroll-mt-24">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Megaphone className="h-5 w-5" />
            </span>
            Notices
            {noticeCount > 0 && (
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-sm font-bold text-accent">
                {noticeCount}
              </span>
            )}
          </h2>
          {noticeCount === 0 ? (
            <p className="text-sm text-brand-deep/60">No notices yet.</p>
          ) : (
            <NoticesList notices={notices} />
          )}
        </section>

        <section id="results" className="scroll-mt-24">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Trophy className="h-5 w-5" />
            </span>
            Exam Results
            {results.length > 0 && (
              <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-sm font-bold text-brand">
                {results.length}
              </span>
            )}
          </h2>
          <div className="space-y-4">
            {results.length === 0 && (
              <p className="text-sm text-brand-deep/60">
                No results published yet.
              </p>
            )}
            {results.map((r) => (
              <div
                key={r.id}
                className="rounded-xl bg-white border border-line p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="min-w-0">
                  <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand/70">
                    <FileText className="h-3.5 w-3.5" /> Result Sheet
                  </span>
                  <h3 className="font-bold">{r.title || "Result"}</h3>
                  {r.createdAt && (
                    <p className="mt-0.5 text-xs text-brand-deep/50">
                      {formatDate(r.createdAt)}
                    </p>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {r.filePath ? (
                    <FileViewer title={r.title || "Result"} filePath={r.filePath} />
                  ) : (
                    <>
                      {r.driveLink && (
                        <a
                          href={r.driveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-brand-deep/80 hover:border-brand hover:text-brand transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" /> Drive Link
                        </a>
                      )}
                      {!r.driveLink && (
                        <span className="text-xs text-brand-deep/50 italic">Link pending</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
