import type { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
  hint?: string;
};

export default function Field({ label, children, hint }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-brand-deep">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-brand-deep/50">{hint}</span>}
    </label>
  );
}
