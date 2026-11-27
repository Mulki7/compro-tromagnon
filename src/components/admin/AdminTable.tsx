"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  sortValue?: (row: T) => string | number;
  render: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}

export default function AdminTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = "Nothing here yet.",
  emptyAction,
}: AdminTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const rows = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return data;
    const get = col.sortValue;
    return [...data].sort((a, b) => {
      const va = get(a);
      const vb = get(b);
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, columns, sortKey, sortDir]);

  if (loading) {
    return (
      <div className="min-h-0 flex-1 space-y-2 px-5 pt-4 sm:px-7" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-lg bg-satelit-surface/70 motion-reduce:animate-none"
          />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-5 py-16 text-center">
        <p className="text-[15px] text-satelit-muted">{emptyMessage}</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto px-5 sm:px-7">
      <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            {columns.map((col) => {
              const sortable = Boolean(col.sortValue);
              const active = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={
                    sortable
                      ? active
                        ? sortDir === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                      : undefined
                  }
                  className={cn(
                    "sticky top-0 z-10 border-b border-satelit-border bg-satelit-bg py-3 pr-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-satelit-muted",
                    col.className
                  )}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1.5 uppercase tracking-[0.08em] transition hover:text-satelit-ink"
                    >
                      {col.header}
                      {active ? (
                        sortDir === "asc" ? (
                          <ArrowUp size={12} className="text-satelit-accent" />
                        ) : (
                          <ArrowDown size={12} className="text-satelit-accent" />
                        )
                      ) : (
                        <ArrowUpDown size={12} className="opacity-50" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="transition-colors hover:bg-satelit-surface/50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "border-b border-satelit-border/70 py-3 pr-4 align-middle text-[15px] text-satelit-ink",
                    col.className
                  )}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
