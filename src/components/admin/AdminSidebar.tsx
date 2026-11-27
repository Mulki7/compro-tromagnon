"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Users,
  Disc3,
  Newspaper,
  CalendarDays,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/releases", label: "Releases", icon: Disc3 },
  { href: "/admin/artists", label: "Artists", icon: Users },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/live", label: "Live", icon: CalendarDays },
  { href: "/admin/hero", label: "Banners", icon: ImageIcon },
];

interface AdminSidebarProps {
  userEmail?: string;
  onLogout: () => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  userEmail,
  onLogout,
  mobileOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const itemBase =
    "flex h-10 items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-colors";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-satelit-ink/30 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-satelit-border bg-satelit-bg transition-transform duration-200 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-5 pb-6 pt-6">
          <Link href="/admin" className="inline-flex items-center gap-2.5">
            <span className="relative h-9 w-9 shrink-0">
              <Image
                src="/assets/logo-tromagnon-nobg.png"
                alt=""
                fill
                sizes="36px"
                className="object-contain"
              />
            </span>
            <span className="text-[21px] font-bold tracking-[-0.02em] text-satelit-ink">
              tromagnon<span className="text-satelit-accent">.</span>
            </span>
          </Link>
        </div>

        <nav aria-label="Admin" className="flex-1 space-y-0.5 px-3">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  itemBase,
                  active
                    ? "bg-satelit-accent text-satelit-on-accent"
                    : "text-satelit-ink/80 hover:bg-satelit-surface hover:text-satelit-ink"
                )}
              >
                <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-0.5 px-3 pb-4">
          <Link
            href="/"
            target="_blank"
            className={cn(itemBase, "text-satelit-muted hover:bg-satelit-surface hover:text-satelit-ink")}
          >
            <ExternalLink size={17} strokeWidth={1.75} aria-hidden="true" />
            View site
          </Link>
          <div className="mt-2 flex items-center gap-2.5 border-t border-satelit-border px-1 pt-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-satelit-ink text-[13px] font-bold uppercase text-satelit-on-accent">
              {(userEmail?.[0] || "A").toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate text-[14px] text-satelit-ink">
              {userEmail || "admin"}
            </span>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Log out"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-satelit-muted transition hover:bg-satelit-surface hover:text-satelit-danger"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
