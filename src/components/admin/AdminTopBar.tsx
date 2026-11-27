"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Disc3,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useAdminShell } from "@/components/admin/AdminShellContext";

export default function AdminTopBar() {
  const router = useRouter();
  const { onMenuClick, user, counts, attention, searchEntries } = useAdminShell();
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

  const displayName = user?.name || user?.email?.split("@")[0] || "Label Admin";
  const initials = displayName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "TR";

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pt-3 sm:px-6 lg:px-7 lg:pt-4">
      {/* Left: Mobile trigger + Global search pill */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:max-w-md">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-admin-border bg-white text-admin-ink shadow-sm transition hover:bg-admin-muted lg:hidden"
        >
          <Menu size={18} aria-hidden="true" />
        </button>

        <div ref={searchRef} className="relative min-w-0 flex-1">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-admin-sub"
          />
          <input
            type="search"
            value={query}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            placeholder="Search releases, artists, shows..."
            aria-label="Search catalog across releases, artists, news, and shows"
            className="h-11 w-full rounded-full border border-admin-border/80 bg-white pl-11 pr-9 text-[13.5px] text-admin-ink shadow-admin-card placeholder:text-admin-sub/75 transition focus:border-admin-forest focus:outline-none focus:ring-2 focus:ring-admin-forest/15"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSearchOpen(false);
              }}
              aria-label="Clear global search"
              className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-admin-sub hover:bg-admin-muted hover:text-admin-ink"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}

          {searchOpen && query.trim().length > 0 && (
            <div
              role="region"
              aria-label="Search results"
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-[22px] border border-admin-border bg-white p-2 shadow-admin-float"
            >
              {searchResults.length === 0 ? (
                <p className="px-3 py-4 text-center text-[13px] text-admin-sub">
                  No catalog matches for &ldquo;{query}&rdquo;
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
                        className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-admin-muted"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-semibold text-admin-ink">
                            {item.title}
                          </p>
                          <p className="truncate text-[12px] text-admin-sub">
                            {item.subtitle}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-admin-lime-soft px-2.5 py-0.5 text-[11px] font-semibold text-admin-forest">
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

      {/* Right utility pills */}
      <div className="flex items-center gap-2">
        <div className="hidden h-11 items-center gap-2 rounded-full border border-admin-border/80 bg-white px-4 text-[13px] font-medium text-admin-ink shadow-admin-card md:inline-flex">
          <Calendar size={15} aria-hidden="true" className="text-admin-sub" />
          <span className="tabular-nums">{todayLabel}</span>
        </div>

        <Link
          href="/admin/releases"
          className="hidden h-11 items-center gap-2 rounded-full border border-admin-border/80 bg-white px-4 text-[13px] font-medium text-admin-ink shadow-admin-card transition hover:border-admin-forest/30 xl:inline-flex"
        >
          <Disc3 size={15} aria-hidden="true" className="text-admin-forest" />
          <span className="tabular-nums">
            {counts.publishedReleases} live · {counts.activeArtists} roster
          </span>
        </Link>

        {/* Attention notifications popover */}
        <div ref={bellRef} className="relative">
          <button
            type="button"
            onClick={() => setBellOpen((v) => !v)}
            aria-expanded={bellOpen}
            aria-label={
              attention.length > 0
                ? `${attention.length} catalog items need attention`
                : "Catalog notifications"
            }
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-admin-border/80 bg-white text-admin-ink shadow-admin-card transition hover:bg-admin-muted"
          >
            <Bell size={17} aria-hidden="true" />
            {attention.length > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-admin-danger ring-2 ring-white"
              />
            )}
          </button>

          {bellOpen && (
            <div
              role="region"
              aria-label="Catalog attention items"
              className="absolute right-0 top-[calc(100%+8px)] z-40 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-[22px] border border-admin-border bg-white p-3 shadow-admin-float"
            >
              <div className="mb-2 flex items-center justify-between px-2">
                <p className="text-[13px] font-bold text-admin-ink">
                  Catalog Queue
                </p>
                <span className="rounded-full bg-admin-muted px-2 py-0.5 text-[11.5px] font-semibold tabular-nums text-admin-sub">
                  {attention.length} open
                </span>
              </div>
              {attention.length === 0 ? (
                <div className="flex items-center gap-2 rounded-2xl bg-admin-muted/70 px-3 py-4 text-[13px] text-admin-sub">
                  <CheckCircle2 size={16} className="shrink-0 text-admin-forest" aria-hidden="true" />
                  <span>All catalog assets are complete.</span>
                </div>
              ) : (
                <ul className="max-h-72 space-y-1.5 overflow-y-auto">
                  {attention.slice(0, 6).map((item) => (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={() => setBellOpen(false)}
                        className="flex items-center justify-between gap-2.5 rounded-2xl bg-admin-muted/65 px-3 py-2.5 transition hover:bg-admin-lime-soft/60"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-admin-ink">
                            {item.label}
                          </p>
                          <p className="truncate text-[12px] text-admin-sub">
                            {item.detail}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-semibold text-admin-forest shadow-sm">
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

        {/* User profile pill */}
        <div className="inline-flex h-11 items-center gap-2.5 rounded-full border border-admin-border/80 bg-white pl-1.5 pr-3.5 shadow-admin-card">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-admin-sage text-[12px] font-bold text-admin-forest"
          >
            {initials}
          </span>
          <div className="hidden min-w-0 leading-tight sm:block">
            <p className="max-w-[130px] truncate text-[13px] font-bold capitalize text-admin-ink">
              {displayName}
            </p>
            <p className="flex items-center gap-1 text-[11px] font-medium text-admin-sub">
              <Sparkles size={10} aria-hidden="true" className="text-admin-forest" />
              Label Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
