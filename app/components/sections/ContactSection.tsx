"use client";

import { useState } from "react";
import { CheckCircle2, Mail, MessageCircle } from "lucide-react";

type ContactSettings = {
  email: string;
  whatsapp?: string | null;
};

export default function ContactSection({ settings }: { settings: ContactSettings }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setPhone("");
    setMessage("");
  };

  const sendWhatsApp = () => {
    if (!name || !message) {
      setError("Please fill name and message.");
      return;
    }
    const text = encodeURIComponent(`Name: ${name}%0APhone: ${phone}%0AMessage: ${message}`);
    window.open(`https://wa.me/${settings.whatsapp}?text=${text}`, "_blank");
  };

  const sendEmail = () => {
    if (!name || !message) {
      setError("Please fill name and message.");
      return;
    }
    const subject = encodeURIComponent(`Enquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nMessage: ${message}`
    );
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
        body: JSON.stringify({ name, phone, message }),
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
          Have a question about admission? Send us a message directly on WhatsApp or
          Email.
        </p>

        <form
          onSubmit={submit}
          className="mx-auto mt-10 max-w-xl space-y-4 rounded-2xl border border-line bg-white p-6 md:p-8 shadow-sm"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            type="tel"
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
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

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={sendWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Send via WhatsApp
            </button>
            <button
              type="button"
              onClick={sendEmail}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent to-orange-400 px-4 py-3 text-sm font-bold text-white hover:opacity-90 transition"
            >
              <Mail className="h-4 w-4" /> Send via Email
            </button>
          </div>

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
