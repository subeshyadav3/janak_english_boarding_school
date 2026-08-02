import { Phone, MessageCircle } from "lucide-react";

type Props = {
  phone?: string;
  whatsapp?: string | null;
  title?: string | null;
  text?: string | null;
  callLabel?: string | null;
  whatsappLabel?: string | null;
  enabled?: boolean;
};

export default function AdmissionCta({
  phone,
  whatsapp,
  title,
  text,
  callLabel,
  whatsappLabel,
  enabled = true,
}: Props) {
  if (!enabled) return null;
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-brand to-brand-dark py-14">
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <div className="absolute -top-16 right-10 h-56 w-56 rounded-full bg-accent blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-white blur-3xl" />
      </div>
      <div className="container-site relative flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            {title || "Admissions Open — Nursery to Grade 8"}
          </h2>
          <p className="mt-2 text-white/80">
            {text ||
              "English medium, disciplined and caring environment. Enroll your child today for a brighter tomorrow."}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand shadow-lg hover:bg-brand-soft transition-colors"
            >
              <Phone className="h-4 w-4" /> {callLabel || "Call Us"}
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-orange-400 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-accent/30 hover:opacity-90 transition"
            >
              <MessageCircle className="h-4 w-4" /> {whatsappLabel || "WhatsApp Us"}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
