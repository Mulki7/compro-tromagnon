"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
}

export default function AdminTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = "No items yet.",
}: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 border border-neutral-200 bg-white py-16 text-neutral-500">
        <Loader2 size={18} className="animate-spin" />
        <span className="font-mono text-xs uppercase tracking-wide">
          Loading…
        </span>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="border border-neutral-200 bg-white px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-neutral-500">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-neutral-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-500",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/80"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn("px-4 py-3 align-middle", col.className)}
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
