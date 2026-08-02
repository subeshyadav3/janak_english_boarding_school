import type { ComponentType } from "react";

type Props = {
  label: string;
  color?: string;
  icon?: ComponentType<{ className?: string }>;
};

const COLORS: Record<string, string> = {
  brand: "bg-brand-soft text-brand",
  accent: "bg-accent/15 text-accent",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  violet: "bg-violet-100 text-violet-700",
  rose: "bg-rose-100 text-rose-700",
  gray: "bg-surface-muted text-brand-deep/60",
};

export default function Badge({ label, color = "gray", icon: Icon }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${COLORS[color] || COLORS.gray}`}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </span>
  );
}
