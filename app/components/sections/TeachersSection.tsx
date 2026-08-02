import Image from "next/image";
import { Phone, User } from "lucide-react";

type Teacher = {
  id: string;
  name: string;
  position?: string | null;
  subject?: string | null;
  phone?: string | null;
  photo?: string | null;
};

export default function TeachersSection({ teachers }: { teachers: Teacher[] }) {
  return (
    <section id="teachers" className="section-pad">
      <div className="container-site">
        <h2 className="section-title">Meet Our Teachers</h2>
        <div className="section-title-line" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <div
              key={t.id}
              className="group rounded-2xl bg-white border border-line overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-soft to-surface-muted">
                {t.photo ? (
                  <Image
                    src={t.photo}
                    alt={t.name || "Teacher"}
                    width={320}
                    height={320}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <User className="h-16 w-16 text-brand" />
                  </div>
                )}
                {t.phone && (
                  <a
                    href={`tel:${t.phone}`}
                    className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white opacity-0 shadow-lg translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                    aria-label={`Call ${t.name}`}
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div className="p-5 text-center">
                <span className="inline-block rounded-full bg-accent-soft px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-accent">
                  {t.position || "Position pending"}
                </span>
                <h3 className="mt-2 text-lg font-bold">{t.name || "Teacher"}</h3>
                <p className="mt-0.5 text-sm text-brand-deep/70">
                  {t.subject || "Subject pending"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
