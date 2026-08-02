"use client";

import { useState } from "react";
import { CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { ENQUIRY_CATEGORIES, ENQUIRY_CATEGORY_LABELS } from "@/lib/constants";

type ContactSettings = {
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
};

export default function ContactSection({ settings }: { settings: ContactSettings }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("admission");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCategory("admission");
    setMessage("");
  };

  const prefilled = () => {
    const lines = [];
    if (name) lines.push(`Name: ${name}`);
    if (email) lines.push(`Email: ${email}`);
    if (phone) lines.push(`Phone: ${phone}`);
    lines.push(`Topic: ${ENQUIRY_CATEGORY_LABELS[category] || category}`);
    if (message) lines.push(`Message: ${message}`);
    return lines.length ? lines.join("\n") : "";
  };

  const openWhatsApp = () => {
    if (!settings.whatsapp) return;
    const text = encodeURIComponent(prefilled() || "Hello, I would like to know more about admission.");
    window.open(`https://wa.me/${settings.whatsapp}?text=${text}`, "_blank");
  };

  const openEmail = () => {
    const subject = encodeURIComponent(name ? `Enquiry from ${name}` : "Enquiry from website");
    const body = encodeURIComponent(prefilled());
    window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !message) {
      setError("Please fill name and message.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, category, message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
      reset();
      setTimeout(() => setSent(false), 4000);
    } catch {
      setError("Something went wrong. Please try again or use WhatsApp/Email.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-pad bg-white">
      <div className="container-site">
        <h2 className="section-title">Contact Us / Enquiry</h2>
        <div className="section-title-line" />
        <p className="text-center text-brand-deep/70 max-w-xl mx-auto">
          Reach us directly on WhatsApp or Email, or send an enquiry using the
          form below.
        </p>

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
          <button
            onClick={openWhatsApp}
            className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <MessageCircle className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-bold text-brand-deep">Chat on WhatsApp</span>
              <span className="mt-0.5 block text-sm text-brand-deep/60">
                {settings.phone || "Instant reply on WhatsApp"}
              </span>
            </span>
          </button>

          <button
            onClick={openEmail}
            className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Mail className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-bold text-brand-deep">Send an Email</span>
              <span className="mt-0.5 block break-all text-sm text-brand-deep/60">{settings.email}</span>
            </span>
          </button>
        </div>

        <form
          onSubmit={submit}
          className="mx-auto mt-6 max-w-xl space-y-4 rounded-2xl border border-line bg-white p-6 md:p-8 shadow-sm"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              type="email"
              className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              type="tel"
              className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            aria-label="Enquiry topic"
          >
            {ENQUIRY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {ENQUIRY_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message / Enquiry"
            required
            rows={4}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 resize-none"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {sent && (
            <p className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" /> Enquiry sent. We will contact you
              soon.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg border-2 border-brand px-4 py-3 text-sm font-bold text-brand hover:bg-brand/10 transition-colors disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </section>
  );
}
