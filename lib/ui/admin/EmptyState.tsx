"use client";

import type { ComponentType } from "react";

type Props = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ icon: Icon, title, message, actionLabel, onAction }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-bold text-brand-deep">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-brand-deep/60">{message}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
