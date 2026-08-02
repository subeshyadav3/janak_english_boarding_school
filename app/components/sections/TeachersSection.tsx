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
        <h2 className="section-title">Our Teachers</h2>
        <div className="section-title-line" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-white border border-line overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="aspect-square bg-gradient-to-br from-brand-soft to-surface-muted flex items-center justify-center">
                {t.photo ? (
                  <Image
                    src={t.photo}
                    alt={t.name || "Teacher"}
                    width={320}
                    height={320}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-brand" />
                )}
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold">{t.name || "Teacher"}</h3>
                <p className="text-accent text-sm font-semibold uppercase tracking-wide">
                  {t.position || "Position pending"}
                </p>
                <p className="mt-1 text-sm text-brand-deep/70">
                  {t.subject || "Subject pending"}
                </p>
                {t.phone && (
                  <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-deep/80">
                    <Phone className="h-4 w-4" /> {t.phone}
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
