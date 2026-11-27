"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import {
  AdminAttentionItem,
  AdminNavCounts,
  AdminSearchEntry,
  AdminShellContext,
} from "@/components/admin/AdminShellContext";
import { getAdminArtists } from "@/lib/api/admin/artists";
import { getAdminReleases } from "@/lib/api/admin/releases";
import { getAdminNews } from "@/lib/api/admin/news";
import { getAdminLiveEvents } from "@/lib/api/admin/live";
import { getAdminHeroBanners } from "@/lib/api/admin/hero";

const EMPTY_COUNTS: AdminNavCounts = {
  releases: 0,
  publishedReleases: 0,
  draftReleases: 0,
  artists: 0,
  activeArtists: 0,
  news: 0,
  publishedNews: 0,
  upcomingLive: 0,
  totalLive: 0,
  activeHero: 0,
  totalHero: 0,
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, authenticated, logout } = useAuth({ requireAuth: true });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [counts, setCounts] = useState<AdminNavCounts>(EMPTY_COUNTS);
  const [attention, setAttention] = useState<AdminAttentionItem[]>([]);
  const [searchEntries, setSearchEntries] = useState<AdminSearchEntry[]>([]);

  const loadShellData = useCallback(async () => {
    try {
      const [artists, releases, news, live, hero] = await Promise.all([
        getAdminArtists().catch(() => []),
        getAdminReleases().catch(() => []),
        getAdminNews().catch(() => []),
        getAdminLiveEvents().catch(() => []),
        getAdminHeroBanners().catch(() => []),
      ]);

      const publishedReleases = releases.filter((r) => r.status === "published").length;
      const activeArtists = artists.filter((a) => a.status === "active").length;
      const publishedNews = news.filter((n) => n.status === "published").length;
      const upcomingLive = live.filter((e) => e.status === "upcoming").length;
      const activeHero = hero.filter((h) => h.is_active !== false).length;

      setCounts({
        releases: releases.length,
        publishedReleases,
        draftReleases: releases.length - publishedReleases,
        artists: artists.length,
        activeArtists,
        news: news.length,
        publishedNews,
        upcomingLive,
        totalLive: live.length,
        activeHero,
        totalHero: hero.length,
      });

      const nextAttention: AdminAttentionItem[] = [];
      releases.forEach((r) => {
        if (r.status === "draft") {
          nextAttention.push({
            key: `rd-${r.id}`,
            label: r.title,
            detail: "Draft release",
            href: `/admin/releases/${r.id}`,
            cta: "Edit",
            severity: "info",
          });
        }
        if (!r.artwork_url) {
          nextAttention.push({
            key: `ra-${r.id}`,
            label: r.title,
            detail: "No artwork",
            href: `/admin/releases/${r.id}`,
            cta: "Upload",
            severity: "warning",
          });
        }
      });
      artists.forEach((a) => {
        if (!a.photo_url) {
          nextAttention.push({
            key: `ap-${a.id}`,
            label: a.name,
            detail: "No artist photo",
            href: `/admin/artists/${a.id}`,
            cta: "Upload",
            severity: "warning",
          });
        }
      });
      news.forEach((n) => {
        if (n.status === "draft") {
          nextAttention.push({
            key: `nd-${n.id}`,
            label: n.title,
            detail: "Draft article",
            href: `/admin/news/${n.id}`,
            cta: "Edit",
            severity: "info",
          });
        }
      });
      if (activeHero === 0) {
        nextAttention.push({
          key: "hero-none",
          label: "Homepage banner",
          detail: "No active slide",
          href: "/admin/hero/create",
          cta: "Add",
          severity: "warning",
        });
      }
      setAttention(nextAttention);

      const entries: AdminSearchEntry[] = [
        ...releases.map((r) => ({
          id: r.id,
          type: "Release" as const,
          title: r.title,
          subtitle: `${r.artist?.name || "Tromagnon"} · ${r.release_year}`,
          href: `/admin/releases/${r.id}`,
        })),
        ...artists.map((a) => ({
          id: a.id,
          type: "Artist" as const,
          title: a.name,
          subtitle: `/${a.slug}`,
          href: `/admin/artists/${a.id}`,
        })),
        ...news.map((n) => ({
          id: n.id,
          type: "News" as const,
          title: n.title,
          subtitle: n.author || "Tromagnon",
          href: `/admin/news/${n.id}`,
        })),
        ...live.map((e) => ({
          id: e.id,
          type: "Live" as const,
          title: `${e.artist?.name || "Showcase"} @ ${e.venue}`,
          subtitle: `${e.city}, ${e.country}`,
          href: `/admin/live/${e.id}`,
        })),
        ...hero.map((h) => ({
          id: h.id,
          type: "Banner" as const,
          title: h.title,
          subtitle: h.subtitle || `Slide #${h.order}`,
          href: `/admin/hero/${h.id}`,
        })),
      ];
      setSearchEntries(entries);
    } catch {
      // Non-fatal shell metadata fetch
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadShellData();
    }
  }, [authenticated, loadShellData]);

  const contextValue = useMemo(
    () => ({
      onMenuClick: () => setMobileOpen(true),
      user,
      counts,
      attention,
      searchEntries,
      refreshShellData: loadShellData,
    }),
    [user, counts, attention, searchEntries, loadShellData]
  );

  if (loading || !authenticated) {
    return (
      <div className="font-admin flex min-h-dvh items-center justify-center bg-admin-canvas text-admin-sub">
        <div className="flex items-center gap-2.5 rounded-xl border border-admin-border bg-admin-surface px-5 py-3">
          <Loader2 size={16} className="animate-spin text-admin-forest-soft" aria-hidden="true" />
          <span className="font-display text-[15px] font-semibold text-admin-ink">
            Loading…
          </span>
        </div>
      </div>
    );
  }

  return (
    <AdminShellContext.Provider value={contextValue}>
      <div className="font-admin flex min-h-dvh bg-admin-canvas text-admin-ink selection:bg-admin-forest-soft selection:text-[#F1F2EE] lg:h-dvh lg:overflow-hidden lg:p-2.5 lg:gap-1">
        <a
          href="#admin-main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-admin-forest focus:px-4 focus:py-2 focus:font-display focus:text-[14px] focus:font-semibold focus:text-[#F1F2EE]"
        >
          Skip to content
        </a>

        <AdminSidebar
          counts={counts}
          onLogout={logout}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col lg:h-full lg:overflow-hidden">
          <AdminTopBar />
          <main
            id="admin-main-content"
            tabIndex={-1}
            className="flex min-h-0 flex-1 flex-col overflow-y-auto outline-none"
          >
            {children}
          </main>
        </div>
      </div>
    </AdminShellContext.Provider>
  );
}
