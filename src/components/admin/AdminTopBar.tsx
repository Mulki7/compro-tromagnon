"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useAdminShell } from "@/components/admin/AdminShellContext";

export default function AdminTopBar() {
  const router = useRouter();
  const { onMenuClick, user, attention, searchEntries } = useAdminShell();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  const todayLabel = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(new Date());
    } catch {
      return "Today";
    }
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchEntries
      .filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) ||
          entry.subtitle.toLowerCase().includes(q) ||
          entry.type.toLowerCase().includes(q)
      )
      .slice(0, 7);
  }, [query, searchEntries]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const rawName = (user?.name || user?.email?.split("@")[0] || "Admin")
    .replace(/^tromagnon\s+/i, "")
    .trim();
  const displayName = rawName || "Admin";
  const initials =
    displayName
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "A";

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 px-4 pt-2 sm:px-5 lg:px-6">
      {/* Left: Mobile drawer button + Global catalog search */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:max-w-sm">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-admin-border-strong bg-admin-surface text-admin-ink transition-colors duration-[120ms] hover:bg-admin-elevated lg:hidden"
        >
          <Menu size={18} aria-hidden="true" />
        </button>

        <div ref={searchRef} className="relative min-w-0 flex-1">
          <Search
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-sub"
          />
          <input
            type="search"
            value={query}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            placeholder="Quick search…"
            aria-label="Search catalog across releases, artists, news, and shows"
            className="h-10 w-full rounded-lg border border-admin-border-strong bg-admin-surface pl-9 pr-8 font-admin text-[14px] text-admin-ink placeholder:text-admin-sub/75 transition-colors duration-[120ms] hover:border-admin-forest focus:border-admin-forest focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSearchOpen(false);
              }}
              aria-label="Clear search"
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-admin-sub hover:bg-admin-elevated hover:text-admin-ink"
            >
              <X size={13} aria-hidden="true" />
            </button>
          )}

          {searchOpen && query.trim().length > 0 && (
            <div
              role="region"
              aria-label="Search results"
              className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 overflow-hidden rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-admin-pop"
            >
              {searchResults.length === 0 ? (
                <p className="px-3 py-3 text-center font-admin text-[13.5px] text-admin-sub">
                  No results for &ldquo;{query}&rdquo;
                </p>
              ) : (
                <ul className="space-y-0.5">
                  {searchResults.map((item) => (
                    <li key={`${item.type}-${item.id}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                          router.push(item.href);
                        }}
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-[120ms] hover:bg-admin-elevated"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-display text-[15px] font-semibold text-admin-ink">
                            {item.title}
                          </p>
                          <p className="truncate font-admin text-[12.5px] text-admin-sub">
                            {item.subtitle}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-md bg-admin-muted px-2 py-0.5 font-admin text-[11.5px] font-medium text-admin-forest-soft">
                          {item.type}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right utility controls */}
      <div className="flex items-center gap-2">
        <div className="hidden h-10 items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-3 font-admin text-[13px] font-medium text-admin-sub sm:inline-flex">
          <Calendar size={14} aria-hidden="true" className="text-admin-forest-soft" />
          <span className="tabular-nums text-admin-ink">{todayLabel}</span>
        </div>

        {/* Attention popover */}
        <div ref={bellRef} className="relative">
          <button
            type="button"
            onClick={() => setBellOpen((v) => !v)}
            aria-expanded={bellOpen}
            aria-label={
              attention.length > 0
                ? `${attention.length} items need attention`
                : "Notifications"
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-admin-border-strong bg-admin-surface text-admin-ink transition-colors duration-[120ms] hover:bg-admin-elevated"
          >
            <Bell size={16} aria-hidden="true" />
            {attention.length > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-2 top-2 h-2 w-2 rounded-full bg-admin-danger"
              />
            )}
          </button>

          {bellOpen && (
            <div
              role="region"
              aria-label="Items needing attention"
              className="absolute right-0 top-[calc(100%+6px)] z-40 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-admin-border-strong bg-admin-surface p-3 shadow-admin-pop"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="font-display text-[15px] font-bold text-admin-ink">
                  Attention
                </p>
                <span className="rounded-md bg-admin-muted px-2 py-0.5 font-admin text-[12px] font-medium tabular-nums text-admin-sub">
                  {attention.length}
                </span>
              </div>
              {attention.length === 0 ? (
                <div className="flex items-center gap-2 rounded-lg bg-admin-muted px-3 py-3 font-admin text-[13.5px] text-admin-sub">
                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-admin-success"
                    aria-hidden="true"
                  />
                  <span>All good — nothing pending.</span>
                </div>
              ) : (
                <ul className="max-h-64 space-y-1.5 overflow-y-auto">
                  {attention.slice(0, 6).map((item) => (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={() => setBellOpen(false)}
                        className="flex items-center justify-between gap-2.5 rounded-lg bg-admin-muted px-3 py-2 transition-colors duration-[120ms] hover:bg-admin-elevated"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-display text-[14.5px] font-semibold text-admin-ink">
                            {item.label}
                          </p>
                          <p className="truncate font-admin text-[12px] text-admin-sub">
                            {item.detail}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-md bg-admin-forest-soft px-2 py-0.5 font-display text-[12px] font-semibold text-[#F1F2EE]">
                          {item.cta}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* User profile chip */}
        <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-admin-border bg-admin-surface pl-1.5 pr-3">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-admin-forest-soft font-display text-[12.5px] font-bold uppercase text-[#F1F2EE]"
          >
            {initials}
          </span>
          <span className="hidden max-w-[110px] truncate font-display text-[14.5px] font-semibold capitalize text-admin-ink sm:inline">
            {displayName}
          </span>
        </div>
      </div>
    </div>
  );
}
