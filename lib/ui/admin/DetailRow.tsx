"use client";

import type { ReactNode } from "react";

export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-brand-deep/40">{label}</p>
      <div className="mt-1 text-sm text-brand-deep">{children}</div>
    </div>
  );
}
