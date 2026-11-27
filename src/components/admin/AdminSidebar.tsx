"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Disc3,
  Users,
  Newspaper,
  CalendarDays,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminNavCounts } from "@/components/admin/AdminShellContext";

interface AdminSidebarProps {
  counts: AdminNavCounts;
  onLogout: () => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  counts,
  onLogout,
  mobileOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, onClose]);

  const navItems = [
    {
      href: "/admin",
      label: "Overview",
      icon: LayoutGrid,
      exact: true,
      badge: undefined as number | undefined,
    },
    {
      href: "/admin/releases",
      label: "Releases",
      icon: Disc3,
      badge: counts.releases > 0 ? counts.releases : undefined,
    },
    {
      href: "/admin/artists",
      label: "Artists",
      icon: Users,
      badge: counts.artists > 0 ? counts.artists : undefined,
    },
    {
      href: "/admin/news",
      label: "Journal",
      icon: Newspaper,
      badge: counts.news > 0 ? counts.news : undefined,
    },
    {
      href: "/admin/live",
      label: "Live Shows",
      icon: CalendarDays,
      badge: counts.upcomingLive > 0 ? counts.upcomingLive : undefined,
    },
    {
      href: "/admin/hero",
      label: "Hero Banners",
      icon: ImageIcon,
      badge: counts.totalHero > 0 ? counts.totalHero : undefined,
    },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-admin-forest-deep/55 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Primary admin navigation"
        className={cn(
          "fixed inset-y-3 left-3 z-50 flex w-[248px] shrink-0 flex-col rounded-[26px] bg-admin-forest text-white shadow-admin-float transition-transform duration-200 ease-out lg:static lg:inset-auto lg:h-full lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+24px)]"
        )}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between px-5 pb-6 pt-6">
          <Link
            href="/admin"
            onClick={onClose}
            className="inline-flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-lime"
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-admin-lime p-1.5 shadow-sm">
              <Image
                src="/assets/logo-tromagnon-nobg.png"
                alt=""
                width={26}
                height={26}
                className="object-contain"
              />
            </span>
            <span className="flex items-center gap-1.5 text-[19px] font-bold tracking-[-0.03em] text-white">
              tromagnon
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-admin-lime"
              />
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-admin-forest-soft hover:text-white lg:hidden"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Main navigation */}
        <div className="flex-1 overflow-y-auto px-3.5">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8EB09A]">
            Catalog
          </p>
          <nav aria-label="Catalog sections" className="space-y-1">
            {navItems.map(({ href, label, icon: Icon, exact, badge }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex h-11 items-center justify-between gap-3 rounded-full px-3.5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-lime",
                    active
                      ? "bg-admin-lime font-semibold text-admin-forest shadow-sm"
                      : "text-[#D4E6DA] hover:bg-admin-forest-soft hover:text-white"
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.1 : 1.75}
                      aria-hidden="true"
                      className={cn(
                        "shrink-0 transition-colors",
                        active ? "text-admin-forest" : "text-[#9DC0A9] group-hover:text-white"
                      )}
                    />
                    <span className="truncate">{label}</span>
                  </span>
                  {typeof badge === "number" && (
                    <span
                      className={cn(
                        "flex h-5 min-w-[22px] shrink-0 items-center justify-center rounded-full px-1.5 text-[11.5px] font-bold tabular-nums",
                        active
                          ? "bg-admin-forest text-admin-lime"
                          : "bg-admin-forest-soft text-[#D4E6DA]"
                      )}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-7 border-t border-white/10 pt-5">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8EB09A]">
              Label
            </p>
            <div className="space-y-1">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center gap-3 rounded-full px-3.5 text-[14px] font-medium text-[#D4E6DA] transition-colors hover:bg-admin-forest-soft hover:text-white"
              >
                <ExternalLink size={17} strokeWidth={1.75} aria-hidden="true" className="text-[#9DC0A9]" />
                <span>Public Website</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Separated destructive sign-out footer */}
        <div className="mt-auto border-t border-white/10 p-3.5">
          <button
            type="button"
            onClick={onLogout}
            className="flex h-11 w-full items-center gap-3 rounded-full px-3.5 text-[14px] font-medium text-[#D4E6DA] transition-colors hover:bg-red-500/15 hover:text-[#FCA5A5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-lime"
          >
            <LogOut size={17} strokeWidth={1.75} aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
