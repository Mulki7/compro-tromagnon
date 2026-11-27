"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Disc3,
  Download,
  Newspaper,
  Plus,
  Radio,
  Users,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { PrimaryCtaPill, Thumb } from "@/components/admin/ListControls";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import {
  btnSecondary,
  downloadCsv,
  parseStringArray,
} from "@/components/admin/formStyles";
import { getAdminArtists } from "@/lib/api/admin/artists";
import { getAdminReleases } from "@/lib/api/admin/releases";
import { getAdminNews } from "@/lib/api/admin/news";
import { getAdminLiveEvents } from "@/lib/api/admin/live";
import { getAdminHeroBanners } from "@/lib/api/admin/hero";
import { Artist, HeroBanner, LiveEvent, News, Release } from "@/types/models";
import { cn, formatDate, getMediaUrl } from "@/lib/utils";

type ScopeFilter = "all" | "published" | "draft";
type FeedTab = "releases" | "shows" | "journal";

interface ReadinessIssue {
  key: string;
  title: string;
  subtitle: string;
  thumb?: string | null;
  href: string;
  cta: string;
  urgent?: boolean;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function AdminDashboardPage() {
  const { user, refreshShellData } = useAdminShell();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [live, setLive] = useState<LiveEvent[]>([]);
  const [hero, setHero] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [feedTab, setFeedTab] = useState<FeedTab>("releases");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [a, r, n, l, h] = await Promise.all([
          getAdminArtists(),
          getAdminReleases(),
          getAdminNews(),
          getAdminLiveEvents(),
          getAdminHeroBanners(),
        ]);
        if (cancelled) return;
        setArtists(a);
        setReleases(r);
        setNews(n);
        setLive(l);
        setHero(h);
        refreshShellData();
      } catch {
        if (!cancelled) {
          setError(
            "Could not load dashboard metrics. Verify that the backend API is running."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [refreshShellData]);

  const operatorName = useMemo(() => {
    const raw = user?.name || user?.email?.split("@")[0] || "Operator";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [user]);

  const todayLong = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date());
    } catch {
      return "Today";
    }
  }, []);

  const publishedReleases = useMemo(
    () => releases.filter((r) => r.status === "published"),
    [releases]
  );
  const draftReleases = useMemo(
    () => releases.filter((r) => r.status === "draft"),
    [releases]
  );
  const activeArtists = useMemo(
    () => artists.filter((a) => a.status === "active"),
    [artists]
  );
  const upcomingShows = useMemo(
    () =>
      live
        .filter((e) => e.status === "upcoming")
        .sort(
          (a, b) =>
            new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
        ),
    [live]
  );
  const activeBanners = useMemo(
    () => hero.filter((h) => h.is_active !== false),
    [hero]
  );

  const heroBackdrop = useMemo(() => {
    const activeSlide = activeBanners.find((h) => h.image_url);
    if (activeSlide?.image_url) return getMediaUrl(activeSlide.image_url);
    const artRelease = releases.find((r) => r.artwork_url);
    if (artRelease?.artwork_url) return getMediaUrl(artRelease.artwork_url);
    return null;
  }, [activeBanners, releases]);

  const filteredReleases = useMemo(() => {
    const base =
      scope === "all"
        ? releases
        : releases.filter((r) => r.status === scope);
    return [...base].sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
  }, [releases, scope]);

  // Readiness calculation based on real catalog completeness
  const readiness = useMemo(() => {
    let totalChecks = 0;
    let passedChecks = 0;
    const issues: ReadinessIssue[] = [];

    releases.forEach((r) => {
      totalChecks += 2;
      if (r.artwork_url) passedChecks += 1;
      else {
        issues.push({
          key: `ra-${r.id}`,
          title: r.title,
          subtitle: "Missing cover artwork",
          thumb: r.artwork_url,
          href: `/admin/releases/${r.id}`,
          cta: "Add art",
          urgent: true,
        });
      }

      if (r.status === "published") passedChecks += 1;
      else {
        issues.push({
          key: `rd-${r.id}`,
          title: r.title,
          subtitle: `${r.artist?.name || "Tromagnon"} · Draft`,
          thumb: r.artwork_url,
          href: `/admin/releases/${r.id}`,
          cta: "Review",
        });
      }
    });

    artists.forEach((a) => {
      totalChecks += 1;
      if (a.photo_url) passedChecks += 1;
      else {
        issues.push({
          key: `ap-${a.id}`,
          title: a.name,
          subtitle: "Artist missing profile photo",
          thumb: a.photo_url,
          href: `/admin/artists/${a.id}`,
          cta: "Upload",
          urgent: true,
        });
      }
    });

    news.forEach((n) => {
      totalChecks += 1;
      if (n.status === "published") passedChecks += 1;
      else {
        issues.push({
          key: `nd-${n.id}`,
          title: n.title,
          subtitle: "Unpublished journal draft",
          thumb: n.cover_image_url,
          href: `/admin/news/${n.id}`,
          cta: "Publish",
        });
      }
    });

    totalChecks += 1;
    if (activeBanners.length > 0) passedChecks += 1;
    else {
      issues.push({
        key: "hero-missing",
        title: "Homepage Hero Banner",
        subtitle: "No active banner currently shown",
        href: "/admin/hero/create",
        cta: "Add slide",
        urgent: true,
      });
    }

    const score =
      totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

    return {
      score,
      passedChecks,
      totalChecks,
      issues,
    };
  }, [releases, artists, news, activeBanners]);

  const totalArchiveCount =
    releases.length + artists.length + news.length + live.length + hero.length;

  const segments = useMemo(() => {
    const safeTotal = Math.max(totalArchiveCount, 1);
    return [
      {
        label: "Releases",
        count: releases.length,
        pct: Math.max((releases.length / safeTotal) * 100, releases.length ? 8 : 0),
        color: "bg-white",
        dot: "bg-white",
      },
      {
        label: "Artists",
        count: artists.length,
        pct: Math.max((artists.length / safeTotal) * 100, artists.length ? 8 : 0),
        color: "bg-admin-lime",
        dot: "bg-admin-lime",
      },
      {
        label: "Journal",
        count: news.length,
        pct: Math.max((news.length / safeTotal) * 100, news.length ? 8 : 0),
        color: "bg-[#6EE7B7]",
        dot: "bg-[#6EE7B7]",
      },
      {
        label: "Shows",
        count: live.length,
        pct: Math.max((live.length / safeTotal) * 100, live.length ? 8 : 0),
        color: "bg-[#9DC0A9]",
        dot: "bg-[#9DC0A9]",
      },
      {
        label: "Banners",
        count: hero.length,
        pct: Math.max((hero.length / safeTotal) * 100, hero.length ? 8 : 0),
        color: "bg-white/40",
        dot: "bg-white/50",
      },
    ];
  }, [releases.length, artists.length, news.length, live.length, hero.length, totalArchiveCount]);

  const publishRate = releases.length
    ? Math.round((publishedReleases.length / releases.length) * 100)
    : 0;

  const handleExportCatalog = () => {
    downloadCsv(
      "tromagnon-catalog.csv",
      ["Title", "Artist", "Year", "Formats", "Status", "Slug"],
      releases.map((r) => [
        r.title,
        r.artist?.name || "Tromagnon",
        r.release_year,
        parseStringArray(r.format).join(" | "),
        r.status,
        r.slug,
      ])
    );
  };

  // SVG Donut dimensions
  const ringRadius = 46;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference - (readiness.score / 100) * ringCircumference;

  return (
    <div className="flex flex-1 flex-col pb-8">
      <AdminHeader
        eyebrow={`${todayLong} · ${totalArchiveCount} catalog items tracked`}
        title={`${getGreeting()}, ${operatorName}`}
        actions={
          <>
            <div
              role="group"
              aria-label="Filter dashboard release scope"
              className="hidden items-center rounded-full border border-admin-border/80 bg-white p-1 shadow-admin-card sm:inline-flex"
            >
              {(
                [
                  ["all", "All"],
                  ["published", "Live"],
                  ["draft", "Drafts"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setScope(key)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
                    scope === key
                      ? "bg-admin-forest text-white"
                      : "text-admin-sub hover:text-admin-ink"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExportCatalog}
              disabled={releases.length === 0}
              className={btnSecondary}
            >
              <Download size={14} aria-hidden="true" />
              <span>Export</span>
            </button>

            <PrimaryCtaPill href="/admin/releases/create" label="New release" />
          </>
        }
      />

      {error && (
        <div
          role="alert"
          className="mx-4 mb-4 rounded-2xl border border-admin-danger/25 bg-admin-danger-soft px-4 py-3 text-[13.5px] font-medium text-admin-danger sm:mx-6 lg:mx-7"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          aria-busy="true"
          className="grid gap-4 px-4 sm:px-6 lg:grid-cols-12 lg:px-7"
        >
          <div className="h-56 animate-pulse rounded-[24px] bg-white/80 motion-reduce:animate-none lg:col-span-6" />
          <div className="h-56 animate-pulse rounded-[24px] bg-admin-lime/60 motion-reduce:animate-none lg:col-span-3" />
          <div className="h-56 animate-pulse rounded-[24px] bg-admin-forest/80 motion-reduce:animate-none lg:col-span-3" />
          <div className="h-80 animate-pulse rounded-[24px] bg-white/80 motion-reduce:animate-none lg:col-span-7" />
          <div className="h-80 animate-pulse rounded-[24px] bg-admin-sage/80 motion-reduce:animate-none lg:col-span-5" />
        </div>
      ) : (
        <div className="space-y-4 px-4 sm:px-6 lg:px-7">
          {/* TOP BENTO ROW */}
          <div className="grid gap-4 lg:grid-cols-12">
            {/* Hero Photographic Catalog Pulse Card (6 cols) */}
            <section className="relative flex min-h-[218px] flex-col justify-between overflow-hidden rounded-[26px] bg-admin-forest p-5 text-white shadow-admin-card lg:col-span-6">
              {heroBackdrop && (
                <Image
                  src={heroBackdrop}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-50"
                />
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#072211]/95 via-[#0A2D17]/65 to-[#0D3B1E]/40"
              />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur-md">
                  <Radio size={13} className="text-admin-lime" aria-hidden="true" />
                  Label archive pulse
                </span>
                <Link
                  href="/admin/releases"
                  aria-label="Open full release catalog"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-admin-lime hover:text-admin-forest"
                >
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>

              <div className="relative z-10 mt-6">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-[46px] font-bold leading-none tracking-[-0.04em] tabular-nums">
                    {totalArchiveCount}
                  </span>
                  <div className="space-y-1">
                    <span className="inline-flex items-center rounded-full bg-admin-lime px-2.5 py-0.5 text-[11.5px] font-bold text-admin-forest tabular-nums">
                      {activeBanners.length} active hero
                    </span>
                    <p className="text-[13px] font-medium text-[#D6E8DC]">
                      entries across Tromagnon Records
                    </p>
                  </div>
                </div>

                {/* Segmented distribution bar */}
                <div
                  aria-hidden="true"
                  className="mt-4 flex h-2 w-full gap-1 overflow-hidden rounded-full bg-white/15 p-0.5"
                >
                  {segments.map((seg) =>
                    seg.count > 0 ? (
                      <div
                        key={seg.label}
                        className={cn("h-full rounded-full transition-all", seg.color)}
                        style={{ width: `${seg.pct}%` }}
                      />
                    ) : null
                  )}
                </div>

                <ul className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] font-medium text-[#D2E4D8]">
                  {segments.map((seg) => (
                    <li key={seg.label} className="inline-flex items-center gap-1.5 tabular-nums">
                      <span
                        aria-hidden="true"
                        className={cn("h-1.5 w-1.5 rounded-full", seg.dot)}
                      />
                      <span>
                        {seg.label} <strong className="font-bold text-white">{seg.count}</strong>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Vibrant Acid-Lime KPI Card (3 cols) */}
            <Link
              href="/admin/releases"
              className="group flex min-h-[218px] flex-col justify-between rounded-[26px] bg-admin-lime p-5 text-admin-forest shadow-admin-card transition-transform duration-150 hover:-translate-y-0.5 lg:col-span-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[13.5px] font-bold text-admin-forest/85">
                    Published Catalog
                  </p>
                  <p className="text-[12px] font-medium text-admin-forest/65">
                    Vinyl, tape & digital
                  </p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/75 text-admin-forest shadow-sm transition-transform group-hover:scale-105">
                  <Disc3 size={18} aria-hidden="true" />
                </span>
              </div>

              <div>
                <p className="text-[44px] font-bold leading-none tracking-[-0.04em] tabular-nums">
                  {publishedReleases.length}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-admin-forest px-2.5 py-1 text-[11.5px] font-bold text-admin-lime tabular-nums">
                    {publishRate}% live
                  </span>
                  <span className="text-[12px] font-semibold text-admin-forest/80 tabular-nums">
                    {draftReleases.length} in draft
                  </span>
                </div>
              </div>
            </Link>

            {/* Deep Forest KPI Card (3 cols) */}
            <Link
              href="/admin/live"
              className="group flex min-h-[218px] flex-col justify-between rounded-[26px] bg-admin-forest p-5 text-white shadow-admin-card transition-transform duration-150 hover:-translate-y-0.5 lg:col-span-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[13.5px] font-bold text-white">
                    Upcoming Shows
                  </p>
                  <p className="text-[12px] font-medium text-[#9DC0A9]">
                    Live calendar & tours
                  </p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-admin-forest-soft text-admin-lime transition-transform group-hover:scale-105">
                  <CalendarDays size={18} aria-hidden="true" />
                </span>
              </div>

              <div>
                <p className="text-[44px] font-bold leading-none tracking-[-0.04em] tabular-nums">
                  {upcomingShows.length}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-admin-lime px-2.5 py-1 text-[11.5px] font-bold text-admin-forest">
                    {upcomingShows[0]
                      ? formatDate(upcomingShows[0].event_date)
                      : "No dates yet"}
                  </span>
                  <span className="text-[12px] font-medium text-[#B5D2BF] tabular-nums">
                    {activeArtists.length} active roster
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* LOWER BENTO ROW */}
          <div className="grid gap-4 lg:grid-cols-12">
            {/* Catalog & Activity List Card (7 cols) */}
            <section className="flex flex-col rounded-[26px] border border-admin-border/80 bg-white p-5 shadow-admin-card lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-bold tracking-[-0.02em] text-admin-ink">
                    Label catalog & schedule
                  </h2>
                  <p className="mt-0.5 text-[12.5px] text-admin-sub">
                    {feedTab === "releases"
                      ? `Showing ${Math.min(filteredReleases.length, 6)} of ${filteredReleases.length} releases`
                      : feedTab === "shows"
                        ? `${upcomingShows.length} upcoming live dates`
                        : `${news.length} journal dispatches`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div
                    role="tablist"
                    aria-label="Dashboard activity tabs"
                    className="inline-flex rounded-full bg-admin-muted p-1"
                  >
                    {(
                      [
                        ["releases", "Releases"],
                        ["shows", "Shows"],
                        ["journal", "Journal"],
                      ] as const
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={feedTab === key}
                        onClick={() => setFeedTab(key)}
                        className={cn(
                          "rounded-full px-3 py-1 text-[12px] font-semibold transition-colors",
                          feedTab === key
                            ? "bg-admin-forest text-white"
                            : "text-admin-sub hover:text-admin-ink"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <Link
                    href={
                      feedTab === "releases"
                        ? "/admin/releases"
                        : feedTab === "shows"
                          ? "/admin/live"
                          : "/admin/news"
                    }
                    className="inline-flex h-8 items-center gap-1 rounded-full bg-admin-muted px-3 text-[12.5px] font-semibold text-admin-forest transition hover:bg-admin-lime-soft"
                  >
                    <span>All</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="mt-4 flex-1 space-y-2">
                {feedTab === "releases" &&
                  (filteredReleases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-admin-muted/60 py-12 text-center">
                      <p className="text-[14px] text-admin-sub">
                        No releases match this filter yet.
                      </p>
                      <Link
                        href="/admin/releases/create"
                        className="text-[13px] font-bold text-admin-forest hover:underline"
                      >
                        + Add first release
                      </Link>
                    </div>
                  ) : (
                    filteredReleases.slice(0, 6).map((r) => (
                      <Link
                        key={r.id}
                        href={`/admin/releases/${r.id}`}
                        className="group flex items-center justify-between gap-3 rounded-2xl bg-admin-muted/65 p-2.5 pr-3 transition-colors hover:bg-admin-lime-soft/55"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Thumb
                            src={r.artwork_url}
                            className="h-12 w-12 rounded-xl"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-bold text-admin-ink">
                              {r.title}
                            </p>
                            <p className="truncate text-[12.5px] text-admin-sub">
                              {r.artist?.name || "Tromagnon"} ·{" "}
                              {parseStringArray(r.format).join(", ") || "Format TBD"}
                            </p>
                          </div>
                        </div>

                        <div className="hidden text-right sm:block">
                          <p className="text-[13px] font-bold tabular-nums text-admin-ink">
                            {r.release_year}
                          </p>
                          <p className="text-[11.5px] text-admin-sub">
                            {r.artwork_url ? "Artwork ok" : "No artwork"}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <StatusBadge status={r.status} />
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-admin-sub shadow-sm transition group-hover:bg-admin-forest group-hover:text-admin-lime"
                          >
                            <ChevronRight size={15} />
                          </span>
                        </div>
                      </Link>
                    ))
                  ))}

                {feedTab === "shows" &&
                  (upcomingShows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-admin-muted/60 py-12 text-center">
                      <p className="text-[14px] text-admin-sub">
                        No upcoming shows scheduled.
                      </p>
                      <Link
                        href="/admin/live/create"
                        className="text-[13px] font-bold text-admin-forest hover:underline"
                      >
                        + Schedule show
                      </Link>
                    </div>
                  ) : (
                    upcomingShows.slice(0, 6).map((ev) => (
                      <Link
                        key={ev.id}
                        href={`/admin/live/${ev.id}`}
                        className="group flex items-center justify-between gap-3 rounded-2xl bg-admin-muted/65 p-3 transition-colors hover:bg-admin-lime-soft/55"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-admin-forest shadow-sm">
                            <CalendarDays size={18} aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-bold text-admin-ink">
                              {ev.artist?.name || "Tromagnon Showcase"}
                            </p>
                            <p className="truncate text-[12.5px] text-admin-sub">
                              {ev.venue} · {ev.city}, {ev.country}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2.5">
                          <span className="hidden text-[13px] font-semibold tabular-nums text-admin-ink sm:inline">
                            {formatDate(ev.event_date)}
                          </span>
                          <StatusBadge status={ev.status} />
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-admin-sub shadow-sm transition group-hover:bg-admin-forest group-hover:text-admin-lime"
                          >
                            <ChevronRight size={15} />
                          </span>
                        </div>
                      </Link>
                    ))
                  ))}

                {feedTab === "journal" &&
                  (news.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-admin-muted/60 py-12 text-center">
                      <p className="text-[14px] text-admin-sub">
                        No journal dispatches yet.
                      </p>
                      <Link
                        href="/admin/news/create"
                        className="text-[13px] font-bold text-admin-forest hover:underline"
                      >
                        + Write first article
                      </Link>
                    </div>
                  ) : (
                    news.slice(0, 6).map((n) => (
                      <Link
                        key={n.id}
                        href={`/admin/news/${n.id}`}
                        className="group flex items-center justify-between gap-3 rounded-2xl bg-admin-muted/65 p-2.5 pr-3 transition-colors hover:bg-admin-lime-soft/55"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Thumb
                            src={n.cover_image_url}
                            className="h-12 w-16 rounded-xl"
                            fallback={<Newspaper size={16} aria-hidden="true" />}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-bold text-admin-ink">
                              {n.title}
                            </p>
                            <p className="truncate text-[12.5px] text-admin-sub">
                              {n.author || "Tromagnon"} ·{" "}
                              {formatDate(n.published_at || n.created_at) || "Unscheduled"}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <StatusBadge status={n.status} />
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-admin-sub shadow-sm transition group-hover:bg-admin-forest group-hover:text-admin-lime"
                          >
                            <ChevronRight size={15} />
                          </span>
                        </div>
                      </Link>
                    ))
                  ))}
              </div>

              {/* Compact Roster Strip */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-admin-border/70 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {artists.slice(0, 6).map((a) => (
                      <Link
                        key={a.id}
                        href={`/admin/artists/${a.id}`}
                        title={a.name}
                        aria-label={`Edit artist ${a.name}`}
                        className="transition-transform hover:z-10 hover:scale-105"
                      >
                        <Thumb
                          src={a.photo_url}
                          className="h-9 w-9 rounded-full border-2 border-white"
                          fallback={a.name[0]?.toUpperCase()}
                        />
                      </Link>
                    ))}
                  </div>
                  <div className="text-[12.5px]">
                    <p className="font-bold text-admin-ink tabular-nums">
                      {artists.length} Artists on roster
                    </p>
                    <p className="text-admin-sub tabular-nums">
                      {activeArtists.length} active · {artists.length - activeArtists.length} archived
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/admin/artists"
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-admin-muted px-3.5 text-[12.5px] font-semibold text-admin-ink transition hover:bg-admin-sage/60"
                  >
                    <Users size={14} aria-hidden="true" />
                    Roster
                  </Link>
                  <Link
                    href="/admin/artists/create"
                    aria-label="Add artist"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-admin-forest text-admin-lime transition hover:bg-admin-forest-deep"
                  >
                    <Plus size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Sage Catalog Readiness Radar Card (5 cols) */}
            <aside className="flex flex-col rounded-[26px] bg-admin-sage p-5 text-admin-forest shadow-admin-card lg:col-span-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-bold tracking-[-0.02em] text-admin-forest">
                    Catalog readiness
                  </h2>
                  <p className="mt-0.5 text-[12.5px] font-medium text-admin-forest/75 tabular-nums">
                    {readiness.totalChecks} quality checks across archive
                  </p>
                </div>
                <Link
                  href="/admin/releases"
                  aria-label="Review catalog"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-admin-forest shadow-sm transition hover:bg-admin-forest hover:text-admin-lime"
                >
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>

              {/* Donut Chart + Big Percentage */}
              <div className="mt-5 flex items-center gap-5">
                <div
                  role="img"
                  aria-label={`Catalog readiness score ${readiness.score} percent (${readiness.passedChecks} of ${readiness.totalChecks} checks complete)`}
                  className="relative h-28 w-28 shrink-0"
                >
                  <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r={ringRadius}
                      fill="none"
                      stroke="rgba(255,255,255,0.65)"
                      strokeWidth="12"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r={ringRadius}
                      fill="none"
                      stroke="#0D3B1E"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      className="transition-all duration-500"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <p className="text-[44px] font-bold leading-none tracking-[-0.04em] text-admin-forest tabular-nums">
                    {readiness.score}%
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-admin-forest/80">
                    Readiness index
                  </p>
                  <span className="mt-2 inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-[12px] font-bold text-admin-forest tabular-nums shadow-sm">
                    {readiness.passedChecks} / {readiness.totalChecks} complete
                  </span>
                </div>
              </div>

              {/* Attention Queue Sub-cards */}
              <div className="mt-5 flex-1 space-y-2">
                {readiness.issues.length === 0 ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-white/85 p-4 text-admin-forest">
                    <CheckCircle2 size={20} className="shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-[14px] font-bold">Everything is in order</p>
                      <p className="text-[12.5px] text-admin-sub">
                        All releases, artists, and banners have full assets.
                      </p>
                    </div>
                  </div>
                ) : (
                  readiness.issues.slice(0, 4).map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="group flex items-center justify-between gap-3 rounded-2xl bg-white/85 p-2.5 pr-3 transition hover:bg-white"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Thumb
                          src={item.thumb}
                          className="h-10 w-10 rounded-xl"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-bold text-admin-ink">
                            {item.title}
                          </p>
                          <p className="truncate text-[12px] text-admin-sub">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-3 py-1 text-[11.5px] font-bold transition",
                          item.urgent
                            ? "bg-admin-amber-soft text-admin-amber group-hover:bg-admin-forest group-hover:text-admin-lime"
                            : "bg-admin-forest text-admin-lime"
                        )}
                      >
                        {item.cta}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
