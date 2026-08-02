"use client";

import { Plus } from "lucide-react";

type Props = {
  onAdd: () => void;
  addLabel: string;
  search?: string;
  onSearch?: (v: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
};

export default function ManagerToolbar({ onAdd, addLabel, search, onSearch, searchPlaceholder, children }: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {onSearch && (
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder || "Search..."}
          className="admin-input w-full max-w-xs"
        />
      )}
      {children}
      <button
        onClick={onAdd}
        className="ml-auto inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark transition-colors"
      >
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </div>
  );
}
