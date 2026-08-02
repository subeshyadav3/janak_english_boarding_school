import {
  BookOpen,
  Globe,
  Shield,
  HeartHandshake,
  Trophy,
  Home,
} from "lucide-react";
import { FACILITIES } from "@/lib/constants";

const ICONS = [BookOpen, Globe, Shield, HeartHandshake, Trophy, Home];
const ACCENTS = [
  "bg-brand-soft text-brand group-hover:bg-brand",
  "bg-accent-soft text-accent group-hover:bg-accent",
  "bg-green-100 text-green-700 group-hover:bg-green-600",
  "bg-pink-100 text-pink-600 group-hover:bg-pink-500",
  "bg-violet-100 text-violet-600 group-hover:bg-violet-500",
  "bg-teal-100 text-teal-600 group-hover:bg-teal-500",
];

export default function FacilitiesSection() {
  return (
    <section id="facilities" className="section-pad bg-surface-muted">
      <div className="container-site">
        <h2 className="section-title">Why Choose Janak School</h2>
        <div className="section-title-line" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FACILITIES.map((f, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-line bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${ACCENTS[i % ACCENTS.length]} group-hover:text-white`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-brand-deep/70">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
