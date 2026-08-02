"use client";

import { useEffect, useState } from "react";

const FALLBACK_SLIDES = [
  "/assets/cover1.png",
  "/assets/cover2.png",
  "/assets/cover3.png",
  "/assets/cover4.png",
  "/assets/cover5.png",
  "/assets/cover6.png",
];

export default function HeroSlider({ covers = FALLBACK_SLIDES }: { covers?: string[] }) {
  const slides = covers.filter(Boolean).length ? covers.filter(Boolean) : FALLBACK_SLIDES;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((v) => (v + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="relative h-[50vh] md:h-[65vh] min-h-[380px] overflow-hidden">
      {slides.map((src, i) => (
        <div
          key={src + i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/70 via-brand-deep/50 to-brand-deep/80" />
      <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 pb-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-8 bg-accent" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
