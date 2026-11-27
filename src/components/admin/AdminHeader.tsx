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
    <header className="flex shrink-0 flex-wrap items-end justify-between gap-4 px-4 pb-4 pt-5 sm:px-6 lg:px-7">
      <div className="min-w-0">
        {(backHref || eyebrow || subtitle) && (
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[12.5px] font-medium text-admin-sub">
            {backHref && (
              <Link
                href={backHref}
                className="inline-flex items-center gap-1 rounded-full font-semibold text-admin-forest transition hover:text-admin-forest-deep hover:underline"
              >
                <ChevronLeft size={14} aria-hidden="true" />
                {backLabel || "Back"}
              </Link>
            )}
            {backHref && (eyebrow || subtitle) && (
              <span aria-hidden="true" className="text-admin-border">
                •
              </span>
            )}
            {(eyebrow || subtitle) && <span>{eyebrow || subtitle}</span>}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-balance text-[26px] font-bold leading-[1.1] tracking-[-0.03em] text-admin-ink sm:text-[32px]">
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
