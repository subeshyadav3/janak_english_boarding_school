"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/constants";

function useCountUp(target: number, start: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value;
}

function StatItem({
  number,
  suffix,
  label,
  started,
}: {
  number: number;
  suffix: string;
  label: string;
  started: boolean;
}) {
  const value = useCountUp(number, started);
  return (
    <div className="relative">
      <p className="text-4xl font-extrabold text-white md:text-5xl">
        {String(value)}
        <span className="text-2xl align-top text-accent">{suffix}</span>
      </p>
      <p className="mt-2 text-sm font-medium text-white/85">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-brand-deep py-14">
      <div
        ref={ref}
        className="container-site grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
      >
        {STATS.map((s) => (
          <StatItem
            key={s.label}
            number={s.number}
            suffix={s.suffix}
            label={s.label}
            started={started}
          />
        ))}
      </div>
    </section>
  );
}
