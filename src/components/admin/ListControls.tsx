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
      aria-label="Filter items by status"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      {options.map((opt) => {
        const active = opt.key === value;
        const tone = opt.tone || "default";

        let cardClass =
          "border-admin-border/80 bg-white text-admin-ink hover:border-admin-forest/35";
        let labelClass = "text-admin-sub";
        let countClass = "text-admin-ink";

        if (active && tone === "lime") {
          cardClass =
            "border-admin-lime bg-admin-lime text-admin-forest shadow-admin-card";
          labelClass = "text-admin-forest/80";
          countClass = "text-admin-forest";
        } else if (active) {
          cardClass =
            "border-admin-forest bg-admin-forest text-white shadow-admin-card";
          labelClass = "text-[#B8D4C2]";
          countClass = "text-white";
        } else if (tone === "lime") {
          cardClass =
            "border-admin-lime/60 bg-admin-lime/80 text-admin-forest hover:bg-admin-lime";
          labelClass = "text-admin-forest/80";
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
              "group flex flex-col items-start justify-between rounded-[20px] border p-4 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-forest focus-visible:ring-offset-2",
              cardClass
            )}
          >
            <span className={cn("flex items-center gap-1.5 text-[12.5px] font-semibold", labelClass)}>
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
                "mt-2.5 text-[28px] font-bold leading-none tracking-[-0.03em] tabular-nums",
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
    <div role="tablist" className="flex flex-wrap items-center gap-1.5">
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
              "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors",
              active
                ? "bg-admin-forest text-white"
                : "bg-admin-muted text-admin-sub hover:bg-admin-sage/60 hover:text-admin-ink"
            )}
          >
            {opt.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
                active ? "bg-white/15 text-admin-lime" : "bg-white text-admin-sub"
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
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-sub"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-full border border-admin-border/70 bg-admin-muted pl-10 pr-8 text-[13.5px] text-admin-ink placeholder:text-admin-sub/75 transition focus:border-admin-forest focus:bg-white focus:outline-none focus:ring-2 focus:ring-admin-forest/15"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-admin-sub hover:bg-admin-border/50 hover:text-admin-ink"
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
        "relative shrink-0 overflow-hidden border border-admin-border/70 bg-admin-muted",
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
        <span className="flex h-full w-full items-center justify-center text-[13px] font-bold text-admin-sub">
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
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={editHref}
        aria-label={`Edit ${label}`}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-admin-border/80 bg-white text-admin-sub transition hover:border-admin-forest hover:bg-admin-forest hover:text-white"
      >
        <Pencil size={15} aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${label}`}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-admin-border/80 bg-white text-admin-sub transition hover:border-admin-danger/40 hover:bg-admin-danger-soft hover:text-admin-danger"
      >
        <Trash2 size={15} aria-hidden="true" />
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
        className="flex h-7 w-7 items-center justify-center rounded-full bg-admin-lime text-admin-forest transition-transform duration-150 group-hover:translate-x-0.5"
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
      className="inline-flex flex-wrap gap-1.5 rounded-2xl bg-admin-muted p-1.5"
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
              "rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-forest",
              active
                ? "bg-admin-forest text-white shadow-sm"
                : "text-admin-sub hover:bg-white hover:text-admin-ink"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
