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
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="border border-neutral-200 p-2 text-black lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-black sm:text-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
