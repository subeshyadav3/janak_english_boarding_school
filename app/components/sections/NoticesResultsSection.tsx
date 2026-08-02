import { Download, Megaphone, Trophy, Link2, Clock } from "lucide-react";

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
  createdAt?: string | Date;
};

function formatDate(d?: string | Date) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NoticesResultsSection({
  notices,
  results,
}: {
  notices: Notice[];
  results: Result[];
}) {
  return (
    <div className="section-pad">
      <div className="container-site grid lg:grid-cols-2 gap-10">
        <section id="notices">
          <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Megaphone className="h-5 w-5" />
            </span>
            Notices
          </h2>
          <div className="space-y-4">
            {notices.length === 0 && (
              <p className="text-sm text-brand-deep/60">No notices yet.</p>
            )}
            {notices.map((n) => (
              <div
                key={n.id}
                className="rounded-xl bg-white border border-line p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 text-xs text-brand-deep/50 mb-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDate(n.createdAt)}</span>
                </div>
                <h3 className="font-bold">{n.title || "Notice"}</h3>
                {n.description && (
                  <p className="mt-1.5 text-sm text-brand-deep/75 leading-relaxed">
                    {n.description}
                  </p>
                )}
                {n.filePath && (
                  <a
                    href={n.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                  >
                    <Download className="h-4 w-4" /> Download
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="results">
          <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Trophy className="h-5 w-5" />
            </span>
            Exam Results
          </h2>
          <div className="space-y-4">
            {results.length === 0 && (
              <p className="text-sm text-brand-deep/60">No results published yet.</p>
            )}
            {results.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl bg-white border border-line p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold">{r.title || "Result"}</h3>
                {r.driveLink ? (
                  <a
                    href={r.driveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-orange-400 px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition"
                  >
                    <Link2 className="h-4 w-4" /> View Result
                  </a>
                ) : (
                  <span className="text-xs text-brand-deep/50 italic">
                    Link pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
