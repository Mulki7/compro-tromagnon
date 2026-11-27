"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Disc3, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { cn, getMediaUrl } from "@/lib/utils";
import { btnPrimarySm } from "@/components/admin/formStyles";

export interface KpiFilterOption<T extends string> {
  key: T;
  label: string;
  count: number;
  dotColor?: string;
  tone?: "forest" | "lime" | "default";
}

export function KpiFilterRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: KpiFilterOption<T>[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter by status"
      className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      {options.map((opt) => {
        const active = opt.key === value;
        const tone = opt.tone || "default";

        let cardClass =
          "border-admin-border bg-admin-surface text-admin-ink hover:bg-admin-elevated";
        let labelClass = "text-admin-sub";
        let countClass = "text-admin-ink";

        if (active && tone === "lime") {
          cardClass = "border-admin-forest bg-admin-lime text-admin-on-lime";
          labelClass = "text-admin-on-lime/80";
          countClass = "text-admin-on-lime";
        } else if (active) {
          cardClass = "border-admin-forest bg-admin-forest text-[#F1F2EE]";
          labelClass = "text-[#B8D0C9]";
          countClass = "text-[#F1F2EE]";
        } else if (tone === "lime") {
          cardClass =
            "border-admin-forest-soft/30 bg-admin-success-soft text-admin-ink hover:bg-admin-lime/45";
          labelClass = "text-admin-forest";
          countClass = "text-admin-forest";
        }

        return (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.key)}
            className={cn(
              "group flex flex-col items-start justify-between rounded-xl border px-4 py-3 text-left transition-colors duration-[120ms] ease-tromagnon",
              cardClass
            )}
          >
            <span
              className={cn(
                "flex items-center gap-1.5 font-admin text-[12.5px] font-medium",
                labelClass
              )}
            >
              {opt.dotColor && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-2 w-2 rounded-full",
                    active && tone !== "lime" ? "bg-admin-lime" : opt.dotColor
                  )}
                />
              )}
              <span className="truncate">{opt.label}</span>
            </span>
            <span
              className={cn(
                "mt-1.5 font-display text-[28px] font-bold leading-none tracking-[-0.02em] tabular-nums",
                countClass
              )}
            >
              {opt.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

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
    <div
      role="tablist"
      className="inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-admin-border-strong bg-admin-muted p-1"
    >
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
              "inline-flex h-8 items-center gap-1.5 rounded-md px-3 font-display text-[13.5px] font-semibold transition-colors duration-[120ms]",
              active
                ? "bg-admin-forest-soft text-[#F1F2EE]"
                : "text-admin-sub hover:bg-admin-elevated hover:text-admin-ink"
            )}
          >
            {opt.label}
            <span
              className={cn(
                "rounded px-1.5 py-0.5 font-admin text-[11.5px] tabular-nums",
                active ? "bg-admin-forest text-admin-lime" : "bg-admin-surface text-admin-sub"
              )}
            >
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
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full sm:w-72", className)}>
      <Search
        size={15}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-admin-sub"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-lg border border-admin-border-strong bg-admin-canvas pl-9 pr-8 font-admin text-[14px] text-admin-ink placeholder:text-admin-sub/75 transition-colors duration-[120ms] hover:border-admin-forest focus:border-admin-forest focus:bg-admin-surface focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-admin-sub hover:bg-admin-elevated hover:text-admin-ink"
        >
          <X size={13} aria-hidden="true" />
        </button>
      )}
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
        "relative shrink-0 overflow-hidden border border-admin-border bg-admin-muted",
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
        <span className="flex h-full w-full items-center justify-center font-display text-[13.5px] font-bold text-admin-sub">
          {fallback ?? <Disc3 size={15} aria-hidden="true" />}
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
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={editHref}
        aria-label={`Edit ${label}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-admin-border-strong bg-admin-surface text-admin-ink transition-colors duration-[120ms] hover:border-admin-forest hover:bg-admin-forest-soft hover:text-[#F1F2EE]"
      >
        <Pencil size={14} aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${label}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-admin-border-strong bg-admin-surface text-admin-ink transition-colors duration-[120ms] hover:border-admin-danger hover:bg-admin-danger-soft hover:text-admin-danger"
      >
        <Trash2 size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

export function PrimaryCtaPill({
  href,
  label,
  icon = "plus",
}: {
  href: string;
  label: string;
  icon?: "plus" | "none";
}) {
  return (
    <Link href={href} className={btnPrimarySm}>
      {icon === "plus" && <Plus size={15} aria-hidden="true" />}
      <span>{label}</span>
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center rounded-md bg-admin-lime text-admin-on-lime transition-transform duration-[120ms] ease-tromagnon group-hover:translate-x-0.5"
      >
        <ArrowRight size={14} strokeWidth={2.2} />
      </span>
    </Link>
  );
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-admin-border-strong bg-admin-muted p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "h-8 rounded-md px-3.5 font-display text-[13.5px] font-semibold tracking-[0.01em] transition-colors duration-[120ms]",
              active
                ? "bg-admin-forest-soft text-[#F1F2EE]"
                : "text-admin-sub hover:bg-admin-surface hover:text-admin-ink"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
