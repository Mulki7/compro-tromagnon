"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  backHref?: string;
  backLabel?: string;
  badge?: React.ReactNode;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
}

export default function AdminHeader({
  title,
  subtitle,
  eyebrow,
  backHref,
  backLabel,
  badge,
  actions,
}: AdminHeaderProps) {
  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-3.5 sm:px-5 lg:px-6">
      <div className="min-w-0">
        {(backHref || eyebrow || subtitle) && (
          <div className="mb-1 flex flex-wrap items-center gap-1.5 font-admin text-[12.5px] font-medium text-admin-sub">
            {backHref && (
              <Link
                href={backHref}
                className="inline-flex items-center gap-0.5 font-semibold text-admin-forest-soft underline underline-offset-4 transition-colors duration-[120ms] hover:text-admin-forest"
              >
                <ChevronLeft size={14} aria-hidden="true" />
                {backLabel || "Back"}
              </Link>
            )}
            {backHref && (eyebrow || subtitle) && (
              <span aria-hidden="true" className="text-admin-border-strong">
                ·
              </span>
            )}
            {(eyebrow || subtitle) && <span>{eyebrow || subtitle}</span>}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-display text-balance text-[26px] font-bold leading-none tracking-[-0.02em] text-admin-ink sm:text-[30px]">
            {title}
          </h1>
          {badge}
        </div>
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
