"use client";

import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

type Base = { label: string; hint?: string };

export function TextInput({
  label,
  hint,
  ...props
}: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-brand-deep">{label}</span>
      <input className="admin-input w-full" {...props} />
      {hint && <span className="mt-1 block text-xs text-brand-deep/50">{hint}</span>}
    </label>
  );
}

export function Textarea({
  label,
  hint,
  ...props
}: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-brand-deep">{label}</span>
      <textarea className="admin-input w-full" {...props} />
      {hint && <span className="mt-1 block text-xs text-brand-deep/50">{hint}</span>}
    </label>
  );
}

export function Select({
  label,
  hint,
  children,
  ...props
}: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-brand-deep">{label}</span>
      <select className="admin-input w-full" {...props}>
        {children}
      </select>
      {hint && <span className="mt-1 block text-xs text-brand-deep/50">{hint}</span>}
    </label>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span>
        <span className="block text-sm font-semibold text-brand-deep">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-brand-deep/50">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-brand" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

export function FormRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 flex items-center justify-end gap-2 border-t border-line pt-4">
      {children}
    </div>
  );
}
