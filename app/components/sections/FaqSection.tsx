import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is the best boarding school in Gaur, Rautahat?",
    a: "Janak English Boarding School Pvt. Ltd. is one of the oldest, most respected, and top-rated boarding schools in Gaur, Rautahat, known for quality education and high discipline.",
  },
  {
    q: "Where is Janak English Boarding School located?",
    a: "Janak English Boarding School is located in Gaur-3, Rautahat, Nepal.",
  },
  {
    q: "What classes does Janak English Boarding School offer?",
    a: "Janak English Boarding School offers English-medium education from Nursery to Grade 8.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="section-pad bg-surface-muted">
      <div className="container-site max-w-3xl">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="section-title-line" />
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl bg-white border border-line p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                {f.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-accent group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-sm text-brand-deep/80 leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
