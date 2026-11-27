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
  emptyMessage = "No items yet.",
  emptyAction,
  toolbar,
  rowTone,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  bulkActions,
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-admin-border bg-admin-surface p-4">
      {toolbar && (
        <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2.5 border-b border-admin-border pb-3">
          {toolbar}
        </div>
      )}

      {selectable && selectedIds && selectedIds.length > 0 && (
        <div
          role="region"
          aria-label="Bulk actions"
          className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-lg bg-admin-forest px-3.5 py-2 text-[#F1F2EE]"
        >
          <div className="flex items-center gap-2 font-admin text-[13.5px] font-medium">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-admin-lime text-admin-on-lime">
              <Check size={13} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="font-semibold tabular-nums">
              {selectedIds.length} selected
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">{bulkActions}</div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2 py-1" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-lg bg-admin-muted motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : !rows.length ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
          <p className="font-admin text-[14.5px] text-admin-sub">{emptyMessage}</p>
          {emptyAction}
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-y-1.5 text-left">
            <thead>
              <tr>
                {selectable && (
                  <th scope="col" className="sticky top-0 z-10 w-11 bg-admin-surface pb-1.5 pl-3 pr-2">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={allSelected}
                      aria-label={allSelected ? "Deselect all rows" : "Select all rows"}
                      onClick={() => onToggleAll!(allSelected ? [] : visibleIds)}
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md border transition-colors duration-[120ms]",
                        allSelected
                          ? "border-admin-forest bg-admin-forest-soft text-[#F1F2EE]"
                          : "border-admin-border-strong bg-admin-canvas text-transparent hover:border-admin-forest"
                      )}
                    >
                      <Check size={12} strokeWidth={2.6} aria-hidden="true" />
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
                        "sticky top-0 z-10 bg-admin-surface pb-1.5 pl-3 pr-3 font-admin text-[12px] font-medium text-admin-sub",
                        col.className
                      )}
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(col.key)}
                          className="inline-flex items-center gap-1.5 transition-colors duration-[120ms] hover:text-admin-ink"
                        >
                          {col.header}
                          {active ? (
                            sortDir === "asc" ? (
                              <ArrowUp size={12} className="text-admin-forest-soft" aria-hidden="true" />
                            ) : (
                              <ArrowDown size={12} className="text-admin-forest-soft" aria-hidden="true" />
                            )
                          ) : (
                            <ArrowUpDown size={12} className="opacity-50" aria-hidden="true" />
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
                    ? "bg-admin-success-soft"
                    : tone === "danger"
                      ? "bg-admin-danger-soft/85 hover:bg-admin-danger-soft"
                      : tone === "warning"
                        ? "bg-admin-amber-soft/75 hover:bg-admin-amber-soft"
                        : "bg-admin-canvas hover:bg-admin-elevated";

                return (
                  <tr
                    key={id}
                    className={cn("transition-colors duration-[120ms]", rowBg)}
                  >
                    {selectable && (
                      <td className="rounded-l-lg border-y border-l border-admin-border py-2.5 pl-3 pr-2 align-middle">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isSelected}
                          aria-label={`Select row ${id}`}
                          onClick={() => onToggleSelect!(id)}
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-md border transition-colors duration-[120ms]",
                            isSelected
                              ? "border-admin-forest bg-admin-forest-soft text-[#F1F2EE]"
                              : "border-admin-border-strong bg-admin-surface text-transparent hover:border-admin-forest"
                          )}
                        >
                          <Check size={12} strokeWidth={2.6} aria-hidden="true" />
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
                            "border-y border-admin-border py-2.5 pl-3 pr-3 align-middle font-admin text-[14px] text-admin-ink",
                            isFirst && "rounded-l-lg border-l",
                            isLast && "rounded-r-lg border-r",
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
