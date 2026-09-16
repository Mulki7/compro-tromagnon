"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Disc3,
  Newspaper,
  CalendarDays,
  Image as ImageIcon,
  Plus,
  Loader2,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import { getAdminArtists } from "@/lib/api/admin/artists";
import { getAdminReleases } from "@/lib/api/admin/releases";
import { getAdminNews } from "@/lib/api/admin/news";
import { getAdminLiveEvents } from "@/lib/api/admin/live";
import { getAdminHeroBanners } from "@/lib/api/admin/hero";
import { btnPrimary } from "@/components/admin/formStyles";

interface Stats {
  artists: number;
  releases: number;
  newsPublished: number;
  liveUpcoming: number;
  heroActive: number;
}

const QUICK = [
  { href: "/admin/artists/create", label: "Add Artist", icon: Users },
  { href: "/admin/releases/create", label: "Add Release", icon: Disc3 },
  { href: "/admin/news/create", label: "Create News", icon: Newspaper },
  { href: "/admin/live/create", label: "Schedule Live", icon: CalendarDays },
  { href: "/admin/hero/create", label: "Add Banner", icon: ImageIcon },
];

export default function AdminDashboardPage() {
  const { onMenuClick } = useAdminShell();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [artists, releases, news, live, hero] = await Promise.all([
          getAdminArtists(),
          getAdminReleases(),
          getAdminNews(),
          getAdminLiveEvents(),
          getAdminHeroBanners(),
        ]);
        if (cancelled) return;
        setStats({
          artists: artists.length,
          releases: releases.length,
          newsPublished: news.filter((n) => n.status === "published").length,
          liveUpcoming: live.filter((e) => e.status === "upcoming").length,
          heroActive: hero.filter((h) => h.is_active !== false).length,
        });
      } catch {
        if (!cancelled) setError("Could not load dashboard stats.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = stats
    ? [
        { label: "Artists", value: stats.artists, href: "/admin/artists" },
        { label: "Releases", value: stats.releases, href: "/admin/releases" },
        {
          label: "Published News",
          value: stats.newsPublished,
          href: "/admin/news",
        },
        {
          label: "Upcoming Live",
          value: stats.liveUpcoming,
          href: "/admin/live",
        },
        {
          label: "Active Banners",
          value: stats.heroActive,
          href: "/admin/hero",
        },
      ]
    : [];

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="Tromagnon Records CMS"
        onMenuClick={onMenuClick}
      />
      <div className="space-y-8 p-4 sm:p-6">
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-neutral-500">
            <Loader2 size={18} className="animate-spin" />
            <span className="font-mono text-xs uppercase">Loading stats…</span>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="border border-neutral-200 bg-white p-5 transition hover:border-black"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                  {c.label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-black">
                  {c.value}
                </p>
              </Link>
            ))}
          </div>
        )}

        <section>
          <h2 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-2">
            {QUICK.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={btnPrimary}>
                <Plus size={14} />
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
