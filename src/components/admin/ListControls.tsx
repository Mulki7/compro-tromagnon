"use client";

import Image from "next/image";
import Link from "next/link";
import { Disc3, Pencil, Search, Trash2 } from "lucide-react";
import { cn, getMediaUrl } from "@/lib/utils";

export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string; count: number }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div role="tablist" className="flex items-center gap-6">
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.key)}
            className={cn(
              "-mb-px border-b-2 pb-3 pt-2 text-[15px] font-semibold transition-colors",
              active
                ? "border-satelit-accent text-satelit-ink"
                : "border-transparent text-satelit-muted hover:text-satelit-ink"
            )}
          >
            {opt.label}
            <span className="ml-1.5 text-[13px] font-medium tabular-nums text-satelit-muted">
              {opt.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full sm:w-60">
      <Search
        size={15}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-satelit-muted"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full rounded-lg border border-satelit-border bg-transparent pl-9 pr-3 text-[14px] text-satelit-ink placeholder:text-satelit-muted/80 focus:border-satelit-accent focus:outline-none"
      />
    </div>
  );
}

export function Thumb({
  src,
  className,
  fallback,
}: {
  src?: string | null;
  className?: string;
  fallback?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden border border-satelit-border bg-satelit-surface",
        className
      )}
    >
      {src ? (
        <Image
          src={getMediaUrl(src)}
          alt=""
          fill
          unoptimized
          sizes="160px"
          className="object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-[13px] font-bold text-satelit-muted">
          {fallback ?? <Disc3 size={16} aria-hidden="true" />}
        </span>
      )}
    </div>
  );
}

export function RowActions({
  editHref,
  onDelete,
  label,
}: {
  editHref: string;
  onDelete: () => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={editHref}
        aria-label={`Edit ${label}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-satelit-muted transition hover:bg-satelit-surface hover:text-satelit-ink"
      >
        <Pencil size={16} />
      </Link>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${label}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-satelit-muted transition hover:bg-satelit-danger/10 hover:text-satelit-danger"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
