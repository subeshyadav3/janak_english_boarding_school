import { Megaphone } from "lucide-react";

type Notice = {
  id: string;
  title: string;
  description?: string | null;
};

export default function NoticeTicker({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) return null;
  const loop = [...notices, ...notices, ...notices];

  return (
    <div className="relative overflow-hidden bg-accent text-white">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center gap-2 bg-accent px-3 sm:px-4">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
          <Megaphone className="h-4 w-4" />
        </span>
        <span className="hidden text-sm font-bold uppercase tracking-wider sm:block">
          Notice
        </span>
      </div>
      <div className="flex overflow-hidden pl-40 sm:pl-52">
        <div className="ticker-track flex shrink-0 items-center py-2.5">
          {loop.map((n, i) => (
            <a
              key={`${n.id}-${i}`}
              href="#notices"
              className="whitespace-nowrap px-6 text-sm font-medium text-white transition-colors hover:text-brand-light"
            >
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-white/70 align-middle" />
              {n.title || n.description || "Notice"}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
