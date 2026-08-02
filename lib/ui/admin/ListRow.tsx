"use client";

import type { ReactNode } from "react";
import RowActions from "./RowActions";

type Props = {
  avatar?: string | null;
  fallbackText?: string;
  fallbackClass?: string;
  noAvatar?: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  badges?: ReactNode;
  meta?: ReactNode;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ListRow({
  avatar,
  fallbackText = "?",
  fallbackClass = "bg-brand-soft text-brand",
  noAvatar = false,
  title,
  subtitle,
  badges,
  meta,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center gap-4 px-4 py-4 sm:px-5">
      {!noAvatar && (
        avatar ? (
          <img
            src={avatar}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-line"
          />
        ) : (
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${fallbackClass}`}>
            {fallbackText}
          </span>
        )
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold text-brand-deep">{title}</p>
          {badges}
        </div>
        {subtitle && <div className="mt-0.5 truncate text-sm text-brand-deep/60">{subtitle}</div>}
      </div>
      {meta && <div className="hidden shrink-0 text-sm text-brand-deep/60 md:block">{meta}</div>}
      <RowActions onView={onView} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
