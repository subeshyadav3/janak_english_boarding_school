import { STATS } from "@/lib/constants";

export default function StatsSection() {
  return (
    <section className="bg-brand-deep py-14">
      <div className="container-site grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent">
              {s.number}
              <span className="text-2xl align-top">{s.suffix}</span>
            </p>
            <p className="mt-2 text-white/85 text-sm font-medium">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
