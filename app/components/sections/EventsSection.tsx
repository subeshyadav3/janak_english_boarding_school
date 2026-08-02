import { CalendarDays, Clock, MapPin } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description?: string | null;
  date: string | Date;
  time?: string | null;
  location?: string | null;
};

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventsSection({ events }: { events: Event[] }) {
  const upcoming = events.filter((e) => new Date(e.date) >= new Date());
  const list = upcoming.length ? upcoming : events;

  if (list.length === 0) return null;

  return (
    <section className="section-pad bg-surface-muted">
      <div className="container-site">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-bold text-brand">
            <CalendarDays className="h-4 w-4" /> Upcoming Events
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-brand-deep md:text-4xl">
            School Events &amp; Important Dates
          </h2>
          <p className="mt-3 text-brand-deep/60">
            Stay updated on the events, celebrations and important dates at Janak English Boarding School.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.slice(0, 4).map((e) => (
            <div
              key={e.id}
              className="group flex flex-col rounded-2xl bg-white border border-line p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-brand/40"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold text-brand-deep/50">
                  {formatDate(e.date)}
                </span>
              </div>
              <h3 className="mt-4 font-bold leading-snug">{e.title}</h3>
              {e.description && (
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-brand-deep/70">
                  {e.description}
                </p>
              )}
              <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs text-brand-deep/60">
                {e.time && (
                  <p className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-accent" /> {e.time}
                  </p>
                )}
                {e.location && (
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-accent" /> {e.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
