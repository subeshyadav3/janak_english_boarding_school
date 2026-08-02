"use client";

import { useCallback, useEffect, useState } from "react";

async function j<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json();
}

type CrudOptions = {
  endpoint: string;
  prependNew?: boolean;
};

export function useCrud<T extends { id: string }>({ endpoint, prependNew = true }: CrudOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const d = await j<T[]>(endpoint);
      setData(d);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await j<T[]>(endpoint);
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  const create = useCallback(
    async (body: Record<string, unknown>): Promise<T> => {
      const created = await j<T>(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setData((prev) => (prependNew ? [created, ...prev] : [...prev, created]));
      return created;
    },
    [endpoint, prependNew]
  );

  const update = useCallback(
    async (id: string, body: Record<string, unknown>): Promise<T> => {
      const updated = await j<T>(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setData((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      return updated;
    },
    [endpoint]
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await j(`${endpoint}/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((item) => item.id !== id));
    },
    [endpoint]
  );

  return { data, setData, loading, error, setError, load, create, update, remove };
}
