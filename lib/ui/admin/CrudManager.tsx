"use client";

import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { useCrud } from "./useCrud";
import Modal from "./Modal";
import ConfirmDialog from "../ConfirmDialog";
import EmptyState from "./EmptyState";
import ManagerToolbar from "./ManagerToolbar";
import { useToast } from "../Toast";

export type FormState<T> =
  | { type: "add"; form: Partial<T> }
  | { type: "edit"; id: string; form: Partial<T> };

type Props<T extends { id: string }> = {
  title: string;
  endpoint: string;
  addLabel: string;
  blank: Partial<T>;
  emptyIcon: ComponentType<{ className?: string }>;
  emptyTitle: string;
  emptyMessage?: string;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  formTitle: string;
  formSubtitle?: string;
  createBody: (form: Partial<T>) => Record<string, unknown>;
  updateBody: (form: Partial<T>) => Record<string, unknown>;
  renderRow: (item: T, actions: { onView?: () => void; onEdit: () => void; onDelete: () => void }) => ReactNode;
  renderForm: (form: Partial<T>, set: (patch: Partial<T>) => void) => ReactNode;
  renderView?: (item: T) => ReactNode;
  deleteConfirmTitle: string | ((item: T) => string);
  deleteConfirmMessage: string | ((item: T) => string);
  createSuccess?: string;
  updateSuccess?: string;
};

export default function CrudManager<T extends { id: string }>({
  title,
  endpoint,
  addLabel,
  blank,
  emptyIcon,
  emptyTitle,
  emptyMessage,
  searchKeys,
  searchPlaceholder,
  formTitle,
  formSubtitle,
  createBody,
  updateBody,
  renderRow,
  renderForm,
  renderView,
  deleteConfirmTitle,
  deleteConfirmMessage,
  createSuccess = "Added successfully",
  updateSuccess = "Saved changes",
}: Props<T>) {
  const { data, loading, error, setError, create, update, remove } = useCrud<T>({ endpoint });
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<FormState<T> | null>(null);
  const [viewing, setViewing] = useState<T | null>(null);
  const [confirm, setConfirm] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    if (!search.trim() || !searchKeys?.length) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((k) => String((item as Record<string, unknown>)[k as string] ?? "").toLowerCase().includes(q))
    );
  }, [data, search, searchKeys]);

  const openAdd = () => setModal({ type: "add", form: { ...blank } });
  const openEdit = (item: T) => setModal({ type: "edit", id: item.id, form: { ...item } });

  const setForm = (patch: Partial<T>) =>
    setModal((prev) => (prev ? { ...prev, form: { ...prev.form, ...patch } } : prev));

  const onSave = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.type === "add") {
        await create(createBody(modal.form));
        toast("success", createSuccess);
      } else {
        await update(modal.id, updateBody(modal.form));
        toast("success", updateSuccess);
      }
      setModal(null);
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm) return;
    try {
      await remove(confirm.id);
      toast("success", "Deleted");
    } catch (e) {
      setError((e as Error).message);
      toast("error", (e as Error).message);
    } finally {
      setConfirm(null);
    }
  };

  if (loading) return <p className="text-sm text-brand-deep/60">Loading...</p>;

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold">×</button>
        </div>
      )}

      <ManagerToolbar
        onAdd={openAdd}
        addLabel={addLabel}
        search={search}
        onSearch={searchKeys?.length ? setSearch : undefined}
        searchPlaceholder={searchPlaceholder}
      />

      {filtered.length === 0 ? (
        <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} actionLabel={addLabel} onAction={openAdd} />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white border border-line shadow-sm">
          <div className="divide-y divide-line">
            {filtered.map((item) =>
              renderRow(item, {
                onView: renderView ? () => setViewing(item) : undefined,
                onEdit: () => openEdit(item),
                onDelete: () => setConfirm(item),
              })
            )}
          </div>
        </div>
      )}

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={formTitle}
        subtitle={formSubtitle}
      >
        {modal && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave();
            }}
          >
            {renderForm(modal.form, setForm)}
            <div className="mt-6 flex items-center justify-end gap-2 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-brand-deep/80 hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : modal.type === "add" ? "Add" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={viewing !== null} onClose={() => setViewing(null)} title={title} subtitle="View details">
        {viewing && renderView?.(viewing)}
      </Modal>

      <ConfirmDialog
        open={confirm !== null}
        title={confirm ? (typeof deleteConfirmTitle === "function" ? deleteConfirmTitle(confirm) : deleteConfirmTitle) : ""}
        message={confirm ? (typeof deleteConfirmMessage === "function" ? deleteConfirmMessage(confirm) : deleteConfirmMessage) : ""}
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
