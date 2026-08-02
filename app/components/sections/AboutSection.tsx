import Image from "next/image";
import {
  ABOUT_PARAGRAPHS,
  FEATURES,
  MISSION_TEXT,
} from "@/lib/constants";
import { CheckCircle2, Target } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="section-pad">
      <div className="container-site">
        <h2 className="section-title">About Our School</h2>
        <div className="section-title-line" />

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-line">
              <Image
                src="/assets/cover3.png"
                alt="Janak English Boarding School"
                width={720}
                height={520}
                className="h-72 w-full object-cover sm:h-96"
              />
            </div>
            <div className="absolute -bottom-5 -right-3 hidden rounded-2xl bg-gradient-to-br from-brand to-brand-dark px-6 py-4 text-white shadow-xl sm:block">
              <p className="text-3xl font-extrabold text-accent">28+</p>
              <p className="text-xs font-medium text-white/85">
                Years of Trusted Education
              </p>
            </div>
          </div>

          <div>
            <div className="space-y-4 text-brand-deep/90 leading-relaxed">
              {ABOUT_PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {FEATURES.slice(0, 6).map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                  <p className="text-sm font-medium">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white p-8 md:p-10 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Target className="h-6 w-6 text-accent" />
            </span>
            <h3 className="text-2xl font-bold">Our Mission</h3>
          </div>
          <p className="text-white/90 leading-relaxed">{MISSION_TEXT}</p>
        </div>
      </div>
    </section>
  );
}
