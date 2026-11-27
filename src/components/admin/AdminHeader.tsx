"use client";

import { Menu } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
}

export default function AdminHeader({
  title,
  subtitle,
  onMenuClick,
  actions,
}: AdminHeaderProps) {
  return (
    <header className="flex shrink-0 flex-wrap items-end justify-between gap-4 px-5 pb-5 pt-6 sm:px-7">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-satelit-border text-satelit-ink transition hover:bg-satelit-surface lg:hidden"
          >
            <Menu size={18} />
          </button>
        )}
        <div>
          <h1 className="text-[32px] font-bold leading-none tracking-[-0.02em] text-satelit-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-[14px] text-satelit-muted">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
