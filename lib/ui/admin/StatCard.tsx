import type { ComponentType } from "react";

type Props = {
  label: string;
  count: number;
  icon: ComponentType<{ className?: string }>;
  gradient: string;
  onClick?: () => void;
};

export default function StatCard({ label, count, icon: Icon, gradient, onClick }: Props) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-white border border-line p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-surface-muted" />
      <span
        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-3xl font-extrabold text-brand-deep">{count}</p>
      <p className="text-sm font-medium text-brand-deep/60">{label}</p>
    </Comp>
  );
}
