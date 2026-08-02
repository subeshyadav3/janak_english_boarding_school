import { Quote } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  message: string;
};

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;
  return (
    <section id="testimonials" className="section-pad bg-brand-deep">
      <div className="container-site">
        <h2 className="section-title text-white">What Parents Say</h2>
        <div className="mx-auto w-20 h-1 bg-accent mb-10 rounded-full" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur hover:bg-white/10 transition-colors"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent mb-4">
                <Quote className="h-5 w-5" />
              </span>
              <p className="text-white/90 leading-relaxed italic">
                &ldquo;{t.message}&rdquo;
              </p>
              <p className="mt-5 font-bold text-accent">- {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
