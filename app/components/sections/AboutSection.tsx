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
        <div className="max-w-3xl mx-auto space-y-5 text-center text-brand-deep/90 leading-relaxed">
          {ABOUT_PARAGRAPHS.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {FEATURES.map((f) => (
            <div
              key={f}
              className="flex items-start gap-3 rounded-xl bg-white border border-line p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{f}</p>
            </div>
          ))}
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
