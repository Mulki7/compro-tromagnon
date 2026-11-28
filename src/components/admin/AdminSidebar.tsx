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
      label: "Shows",
      icon: CalendarDays,
      badge: counts.upcomingLive > 0 ? counts.upcomingLive : undefined,
    },
    {
      href: "/admin/hero",
      label: "Banners",
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
          className="fixed inset-0 z-40 bg-[#111111]/45 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Primary admin navigation"
        className={cn(
          "fixed inset-y-2.5 left-2.5 z-50 flex w-[224px] shrink-0 flex-col rounded-xl border border-[#16302C] bg-admin-forest text-[#F1F2EE] shadow-admin-pop transition-transform duration-[200ms] ease-tromagnon lg:static lg:inset-auto lg:mt-2 lg:mb-3 lg:h-[calc(100%-1.25rem)] lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+20px)]"
        )}
      >
        {/* Brand lockup */}
        <div className="flex items-center justify-between px-3.5 pb-4 pt-5">
          <Link
            href="/admin"
            onClick={onClose}
            className="inline-flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-lime"
          >
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#F1F2EE] p-1">
              <Image
                src="/assets/logo-tromagnon-nobg.png"
                alt=""
                width={24}
                height={24}
                className="object-contain"
              />
            </span>
            <span className="truncate font-display text-[24px] font-normal leading-[1.05] tracking-[-0.015em] text-[#F1F2EE]">
              tromagnon<span className="text-admin-lime">.</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#E4ECE9] transition-colors duration-[120ms] hover:bg-admin-forest-soft hover:text-white lg:hidden"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Main navigation */}
        <nav aria-label="Catalog sections" className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {navItems.map(({ href, label, icon: Icon, exact, badge }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex h-10 items-center justify-between gap-2.5 rounded-lg px-3 font-admin text-[14px] font-medium transition-colors duration-[120ms] ease-tromagnon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-lime",
                  active
                    ? "bg-admin-lime font-semibold text-admin-on-lime"
                    : "text-[#ECEEE9] hover:bg-admin-forest-soft hover:text-white"
                )}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.1 : 1.75}
                    aria-hidden="true"
                    className={cn(
                      "shrink-0",
                      active ? "text-admin-on-lime" : "text-[#9CCBC1] group-hover:text-white"
                    )}
                  />
                  <span className="truncate">{label}</span>
                </span>
                {typeof badge === "number" && (
                  <span
                    className={cn(
                      "flex h-5 min-w-[22px] shrink-0 items-center justify-center rounded-md px-1.5 font-admin text-[12.5px] font-semibold tabular-nums",
                      active
                        ? "bg-admin-forest text-[#F1F2EE]"
                        : "bg-admin-forest-soft text-[#ECEEE9]"
                    )}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Clean footer links */}
        <div className="mt-auto space-y-1 border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 items-center gap-2.5 rounded-lg px-3 font-admin text-[13.5px] font-medium text-[#D6E6DF] transition-colors duration-[120ms] hover:bg-admin-forest-soft hover:text-white"
          >
            <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" className="text-[#9CCBC1]" />
            <span>View site</span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="flex h-10 w-full items-center gap-2.5 rounded-lg px-3 font-admin text-[13.5px] font-medium text-[#D6E6DF] transition-colors duration-[120ms] hover:bg-[#A3261F]/25 hover:text-[#F0A29B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-lime"
          >
            <LogOut size={16} strokeWidth={1.75} aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
