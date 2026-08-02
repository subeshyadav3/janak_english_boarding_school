"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

const FALLBACK_SLIDES = [
  "/assets/cover1.png",
  "/assets/cover2.png",
  "/assets/cover3.png",
  "/assets/cover4.png",
  "/assets/cover5.png",
  "/assets/cover6.png",
];

type HeroProps = {
  covers?: string[];
  schoolName: string;
  tagline: string;
  motto: string;
  address?: string;
  phone?: string;
};

export default function HeroSlider({
  covers = FALLBACK_SLIDES,
  schoolName,
  tagline,
  motto,
  address,
  phone,
}: HeroProps) {
  const slides = covers.filter(Boolean).length ? covers.filter(Boolean) : FALLBACK_SLIDES;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  const prev = () => setActive((v) => (v - 1 + slides.length) % slides.length);
  const next = () => setActive((v) => (v + 1) % slides.length);

  const goTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative h-screen max-h-[800px] min-h-[560px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((src, i) => (
        <div
          key={src + i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/80 via-brand-deep/60 to-brand-deep/85" />

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous photo"
        className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/30 sm:flex"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        aria-label="Next photo"
        className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/30 sm:flex"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="relative z-10 flex h-full items-center">
        <div className="container-site w-full">
          <div key={active} className="max-w-3xl hero-text">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent ring-1 ring-white/20 backdrop-blur">
              <Sparkles className="h-4 w-4" /> {motto}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              {schoolName}
            </h1>
            <p className="mt-4 text-lg font-medium text-white/90 sm:text-xl">
              &ldquo;{tagline}&rdquo;
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
              {address && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-accent" /> {address}
                </span>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                >
                  <Phone className="h-4 w-4 text-accent" /> {phone}
                </a>
              )}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => goTo("contact")}
                className="rounded-xl bg-gradient-to-r from-accent to-orange-400 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-accent/30 hover:opacity-90 transition"
              >
                Apply for Admission
              </button>
              <button
                onClick={() => goTo("about")}
                className="rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/20 transition"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls: counter + progress dots */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-4 pb-6 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-white">
            {String(active + 1).padStart(2, "0")}
            <span className="text-white/40"> / {String(slides.length).padStart(2, "0")}</span>
          </span>
          <div className="hidden gap-2 sm:flex">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-8 bg-accent"
                    : "w-3 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => goTo("about")}
          className="group inline-flex flex-col items-center gap-1 text-white/70 transition hover:text-white"
          aria-label="Scroll down"
        >
          <span className="text-[11px] font-semibold uppercase tracking-widest">
            Scroll
          </span>
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-current p-1">
            <span className="h-2 w-1 animate-scroll-dot rounded-full bg-current" />
          </span>
        </button>
      </div>
    </section>
  );
}
