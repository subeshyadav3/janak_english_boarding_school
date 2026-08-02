"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

type Props = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
};

export default function RowActions({ onView, onEdit, onDelete, viewLabel, editLabel }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {onView && (
        <button
          onClick={onView}
          title={viewLabel || "View"}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-brand-deep/60 hover:border-brand hover:bg-brand-soft hover:text-brand transition-colors"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          title={editLabel || "Edit"}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-brand-deep/60 hover:border-brand hover:bg-brand-soft hover:text-brand transition-colors"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          title="Delete"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-brand-deep/60 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
