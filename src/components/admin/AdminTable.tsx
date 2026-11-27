"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  sortValue?: (row: T) => string | number;
  render: (row: T) => React.ReactNode;
}

export type RowTone = "default" | "selected" | "danger" | "warning";

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  toolbar?: React.ReactNode;
  rowTone?: (row: T) => RowTone;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleAll?: (ids: string[]) => void;
  bulkActions?: React.ReactNode;
  bulkSummary?: string;
}

export default function AdminTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = "Nothing here yet.",
  emptyAction,
  toolbar,
  rowTone,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  bulkActions,
  bulkSummary,
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

  const selectable = Boolean(selectedIds && onToggleSelect && onToggleAll);
  const visibleIds = useMemo(() => rows.map(rowKey), [rows, rowKey]);
  const allSelected =
    selectable &&
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedIds!.includes(id));

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-[24px] border border-admin-border/80 bg-white p-4 shadow-admin-card sm:p-5">
      {toolbar && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {toolbar}
        </div>
      )}

      {selectable && selectedIds && selectedIds.length > 0 && (
        <div
          role="region"
          aria-label="Bulk actions"
          className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-admin-forest px-4 py-2.5 text-white shadow-sm"
        >
          <div className="flex items-center gap-2.5 text-[13.5px] font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-admin-lime text-admin-forest">
              <Check size={14} strokeWidth={2.6} aria-hidden="true" />
            </span>
            <span className="tabular-nums">
              {selectedIds.length} selected
            </span>
            {bulkSummary && (
              <span className="hidden text-[#B4CEBE] sm:inline">
                · {bulkSummary}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">{bulkActions}</div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2.5 py-2" aria-busy="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl bg-admin-muted motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : !rows.length ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3.5 py-16 text-center">
          <p className="text-[14.5px] font-medium text-admin-sub">{emptyMessage}</p>
          {emptyAction}
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-y-2 text-left">
            <thead>
              <tr>
                {selectable && (
                  <th scope="col" className="w-11 pb-2 pl-3 pr-2">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={allSelected}
                      aria-label={allSelected ? "Deselect all rows" : "Select all rows"}
                      onClick={() => onToggleAll!(allSelected ? [] : visibleIds)}
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md border transition",
                        allSelected
                          ? "border-admin-forest bg-admin-forest text-admin-lime"
                          : "border-admin-border bg-white text-transparent hover:border-admin-forest"
                      )}
                    >
                      <Check size={12} strokeWidth={2.8} aria-hidden="true" />
                    </button>
                  </th>
                )}
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
                        "pb-2 pl-3 pr-3 text-[12px] font-semibold tracking-[0.02em] text-admin-sub",
                        col.className
                      )}
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(col.key)}
                          className="inline-flex items-center gap-1.5 transition hover:text-admin-ink"
                        >
                          {col.header}
                          {active ? (
                            sortDir === "asc" ? (
                              <ArrowUp size={13} className="text-admin-forest" aria-hidden="true" />
                            ) : (
                              <ArrowDown size={13} className="text-admin-forest" aria-hidden="true" />
                            )
                          ) : (
                            <ArrowUpDown size={12} className="opacity-45" aria-hidden="true" />
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
              {rows.map((row) => {
                const id = rowKey(row);
                const isSelected = selectable && selectedIds!.includes(id);
                const tone: RowTone = isSelected
                  ? "selected"
                  : rowTone?.(row) ?? "default";

                const rowBg =
                  tone === "selected"
                    ? "bg-admin-lime-soft/80"
                    : tone === "danger"
                      ? "bg-admin-danger-soft/75 hover:bg-admin-danger-soft"
                      : tone === "warning"
                        ? "bg-admin-amber-soft/50 hover:bg-admin-amber-soft/75"
                        : "bg-admin-muted/55 hover:bg-admin-muted";

                return (
                  <tr
                    key={id}
                    className={cn("transition-colors duration-150", rowBg)}
                  >
                    {selectable && (
                      <td className="rounded-l-2xl py-3 pl-3 pr-2 align-middle">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isSelected}
                          aria-label={`Select row ${id}`}
                          onClick={() => onToggleSelect!(id)}
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-md border transition",
                            isSelected
                              ? "border-admin-forest bg-admin-forest text-admin-lime"
                              : "border-admin-border bg-white text-transparent hover:border-admin-forest"
                          )}
                        >
                          <Check size={12} strokeWidth={2.8} aria-hidden="true" />
                        </button>
                      </td>
                    )}
                    {columns.map((col, idx) => {
                      const isFirst = !selectable && idx === 0;
                      const isLast = idx === columns.length - 1;
                      return (
                        <td
                          key={col.key}
                          className={cn(
                            "py-3 pl-3 pr-3 align-middle text-[14px] text-admin-ink",
                            isFirst && "rounded-l-2xl",
                            isLast && "rounded-r-2xl",
                            col.className
                          )}
                        >
                          {col.render(row)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
