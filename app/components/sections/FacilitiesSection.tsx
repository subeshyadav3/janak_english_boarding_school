import { FACILITIES } from "@/lib/constants";

export default function FacilitiesSection() {
  return (
    <section id="facilities" className="section-pad bg-surface-muted">
      <div className="container-site">
        <h2 className="section-title">Our Facilities</h2>
        <div className="section-title-line" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACILITIES.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-line bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand font-bold text-lg group-hover:bg-brand group-hover:text-white transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-brand-deep/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
