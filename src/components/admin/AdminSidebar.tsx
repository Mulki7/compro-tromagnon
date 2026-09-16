"use client";

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
  { href: "/admin/hero", label: "Hero", icon: ImageIcon },
  { href: "/admin/artists", label: "Artists", icon: Users },
  { href: "/admin/releases", label: "Releases", icon: Disc3 },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/live", label: "Live", icon: CalendarDays },
];

interface AdminSidebarProps {
  onLogout: () => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  onLogout,
  mobileOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-neutral-200 bg-black text-white transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            Tromagnon Records
          </p>
          <h1 className="mt-1 text-lg font-semibold tracking-tight">CMS Admin</h1>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 font-mono text-xs uppercase tracking-wide transition",
                isActive(href, exact)
                  ? "bg-white text-black"
                  : "text-neutral-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-neutral-400 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={16} strokeWidth={1.75} />
            Public Site
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-neutral-400 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
