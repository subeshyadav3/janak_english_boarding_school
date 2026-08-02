import type { SiteSettings } from "@/lib/constants";

export default function HomeSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="home" className="relative bg-brand-deep text-center py-20">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-brand blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent blur-3xl" />
      </div>
      <div className="container-site relative">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          {settings.schoolName}
        </h1>
        <p className="mt-5 text-xl md:text-2xl text-accent italic">
          &ldquo;{settings.tagline}&rdquo;
        </p>
        <p className="mt-4 text-white/80 text-sm md:text-base">
          {settings.address}
          {settings.phone ? ` | ${settings.phone}` : ""}
          {settings.email ? ` | ${settings.email}` : ""}
        </p>
      </div>
    </section>
  );
}
