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

function formatShortFormats(raw: string | string[] | null | undefined): string {
  const list = parseStringArray(raw);
  if (list.length === 0) return "No format";
  if (list.length <= 2) return list.join(", ");
  return `${list.slice(0, 2).join(", ")} +${list.length - 2}`;
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
          setError("Could not load dashboard. Make sure the API is running.");
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

  const greetingTitle = useMemo(() => {
    const base = getGreeting();
    const raw = (user?.name || user?.email?.split("@")[0] || "")
      .replace(/tromagnon|admin/gi, "")
      .trim();
    if (!raw) return base;
    const first = raw.split(/[\s._-]+/)[0];
    return first ? `${base}, ${first.charAt(0).toUpperCase() + first.slice(1)}` : base;
  }, [user]);

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
          subtitle: "No cover artwork",
          thumb: r.artwork_url,
          href: `/admin/releases/${r.id}`,
          cta: "Upload",
          urgent: true,
        });
      }

      if (r.status === "published") passedChecks += 1;
      else {
        issues.push({
          key: `rd-${r.id}`,
          title: r.title,
          subtitle: "Draft release",
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
          subtitle: "No artist photo",
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
          subtitle: "Draft article",
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
        title: "Homepage banner",
        subtitle: "No active slide",
        href: "/admin/hero/create",
        cta: "Add",
        urgent: true,
      });
    }

    const score =
      totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

    return { score, passedChecks, totalChecks, issues };
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
        color: "bg-[#F1F2EE]",
        dot: "bg-[#F1F2EE]",
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
        color: "bg-[#9CCBC1]",
        dot: "bg-[#9CCBC1]",
      },
      {
        label: "Shows",
        count: live.length,
        pct: Math.max((live.length / safeTotal) * 100, live.length ? 8 : 0),
        color: "bg-[#CFD3CA]",
        dot: "bg-[#CFD3CA]",
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

  const ringRadius = 38;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference - (readiness.score / 100) * ringCircumference;

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-3 lg:overflow-hidden">
      <AdminHeader
        title={greetingTitle}
        actions={
          <>
            <div
              role="group"
              aria-label="Filter releases"
              className="hidden items-center gap-1.5 rounded-lg border border-admin-border-strong bg-admin-surface p-1 sm:inline-flex"
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
                    "h-8 rounded-md px-3.5 font-admin text-[13px] font-semibold transition-colors duration-[120ms]",
                    scope === key
                      ? "bg-admin-forest-soft text-[#F1F2EE]"
                      : "text-admin-sub hover:bg-admin-elevated hover:text-admin-ink"
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
          className="mx-4 mb-3 shrink-0 rounded-lg border border-admin-danger bg-admin-danger-soft px-4 py-2.5 font-admin text-[13.5px] font-medium text-admin-danger sm:mx-5 lg:mx-6"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          aria-busy="true"
          className="grid flex-1 gap-3.5 px-4 sm:px-5 lg:grid-cols-12 lg:px-6"
        >
          <div className="h-44 animate-pulse rounded-xl bg-admin-muted motion-reduce:animate-none lg:col-span-6" />
          <div className="h-44 animate-pulse rounded-xl bg-admin-muted motion-reduce:animate-none lg:col-span-3" />
          <div className="h-44 animate-pulse rounded-xl bg-admin-forest/80 motion-reduce:animate-none lg:col-span-3" />
          <div className="min-h-[260px] animate-pulse rounded-xl bg-admin-surface motion-reduce:animate-none lg:col-span-7" />
          <div className="min-h-[260px] animate-pulse rounded-xl bg-admin-muted motion-reduce:animate-none lg:col-span-5" />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-3.5 px-4 sm:px-5 lg:px-6">
          {/* TOP BENTO ROW */}
          <div className="grid shrink-0 gap-3.5 lg:grid-cols-12">
            {/* Hero Archive Card (6 cols) */}
            <section className="relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-xl border border-[#16302C] bg-admin-forest p-4 text-[#F1F2EE] lg:col-span-6">
              {heroBackdrop && (
                <Image
                  src={heroBackdrop}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-40"
                />
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101412]/95 via-[#16302C]/75 to-[#224540]/50"
              />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-[#101412]/50 px-2.5 py-1 font-admin text-[12.5px] font-medium tracking-[0.015em] text-[#ECEEE9]">
                  <Radio size={13} className="text-admin-lime" aria-hidden="true" />
                  Archive
                </span>
                <Link
                  href="/admin/releases"
                  aria-label="Open releases"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/25 bg-[#101412]/45 text-[#F1F2EE] transition-colors duration-[120ms] hover:bg-admin-lime hover:text-admin-on-lime"
                >
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <div className="relative z-10 mt-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-admin text-[40px] font-bold leading-none tracking-[-0.03em] tabular-nums">
                    {totalArchiveCount}
                  </span>
                  <span className="font-admin text-[13.5px] text-[#DCE5E1]">
                    catalog entries
                  </span>
                </div>

                {/* Segmented distribution bar */}
                <div
                  aria-hidden="true"
                  className="mt-3 flex h-2 w-full gap-1 overflow-hidden rounded-full bg-white/15 p-0.5"
                >
                  {segments.map((seg) =>
                    seg.count > 0 ? (
                      <div
                        key={seg.label}
                        className={cn("h-full rounded-full", seg.color)}
                        style={{ width: `${seg.pct}%` }}
                      />
                    ) : null
                  )}
                </div>

                <ul className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 font-admin text-[12px] text-[#DCE5E1]">
                  {segments.map((seg) => (
                    <li key={seg.label} className="inline-flex items-center gap-1.5 tabular-nums">
                      <span
                        aria-hidden="true"
                        className={cn("h-1.5 w-1.5 rounded-full", seg.dot)}
                      />
                      <span>
                        {seg.label} <strong className="font-semibold text-white">{seg.count}</strong>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Published KPI Card (3 cols) */}
            <Link
              href="/admin/releases"
              className="group flex min-h-[168px] flex-col justify-between rounded-xl border border-admin-forest-soft bg-admin-lime p-4 text-admin-on-lime transition-colors duration-[120ms] hover:bg-admin-lime-hover lg:col-span-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-admin text-[15px] font-bold tracking-[-0.01em] text-admin-on-lime">
                  Published
                </p>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-admin-forest text-[#F1F2EE]">
                  <Disc3 size={17} aria-hidden="true" />
                </span>
              </div>

              <div>
                <p className="font-admin text-[40px] font-bold leading-none tracking-[-0.03em] tabular-nums">
                  {publishedReleases.length}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-admin-forest px-2 py-0.5 font-admin text-[12px] font-semibold text-[#F1F2EE] tabular-nums">
                    {publishRate}% live
                  </span>
                  {draftReleases.length > 0 && (
                    <span className="font-admin text-[12.5px] font-medium text-admin-on-lime/80 tabular-nums">
                      {draftReleases.length} draft
                    </span>
                  )}
                </div>
              </div>
            </Link>

            {/* Upcoming Shows KPI Card (3 cols) */}
            <Link
              href="/admin/live"
              className="group flex min-h-[168px] flex-col justify-between rounded-xl border border-[#16302C] bg-admin-forest p-4 text-[#F1F2EE] transition-colors duration-[120ms] hover:bg-admin-forest-deep lg:col-span-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-admin text-[15px] font-bold tracking-[-0.01em] text-[#F1F2EE]">
                  Upcoming shows
                </p>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-admin-forest-soft text-admin-lime">
                  <CalendarDays size={17} aria-hidden="true" />
                </span>
              </div>

              <div>
                <p className="font-admin text-[40px] font-bold leading-none tracking-[-0.03em] tabular-nums">
                  {upcomingShows.length}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-admin-lime px-2 py-0.5 font-admin text-[12px] font-semibold text-admin-on-lime">
                    {upcomingShows[0]
                      ? formatDate(upcomingShows[0].event_date)
                      : "None scheduled"}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* LOWER BENTO ROW (Full-height flex-1 on desktop) */}
          <div className="grid min-h-0 flex-1 gap-3.5 lg:grid-cols-12">
            {/* Activity List Card (7 cols) */}
            <section className="flex min-h-0 flex-col rounded-xl border border-admin-border bg-admin-surface p-4 lg:col-span-7">
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2.5 pb-3">
                <h2 className="font-admin text-[18px] font-bold leading-[1.2] tracking-[-0.015em] text-admin-ink">
                  Recent
                </h2>

                <div className="flex flex-wrap items-center gap-2">
                  <div
                    role="tablist"
                    aria-label="Activity tabs"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-admin-border-strong bg-admin-muted p-1"
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
                          "h-7 rounded-md px-3 font-admin text-[13px] font-semibold transition-colors duration-[120ms]",
                          feedTab === key
                            ? "bg-admin-forest-soft text-[#F1F2EE]"
                            : "text-admin-sub hover:bg-admin-surface hover:text-admin-ink"
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
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-admin-border-strong px-3 font-admin text-[13px] font-semibold text-admin-ink transition-colors duration-[120ms] hover:bg-admin-elevated"
                  >
                    <span>All</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
                {feedTab === "releases" &&
                  (filteredReleases.length === 0 ? (
                    <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 rounded-lg border border-admin-border bg-admin-canvas p-6 text-center">
                      <p className="font-admin text-[14px] text-admin-sub">
                        No releases yet.
                      </p>
                      <Link
                        href="/admin/releases/create"
                        className="font-admin text-[13.5px] font-semibold text-admin-forest-soft underline underline-offset-4 hover:text-admin-forest"
                      >
                        + Add release
                      </Link>
                    </div>
                  ) : (
                    filteredReleases.slice(0, 6).map((r) => (
                      <Link
                        key={r.id}
                        href={`/admin/releases/${r.id}`}
                        className="group flex items-center justify-between gap-3 rounded-lg border border-admin-border bg-admin-canvas p-2.5 pr-3 transition-colors duration-[120ms] hover:bg-admin-elevated"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Thumb
                            src={r.artwork_url}
                            className="aspect-square h-11 w-11 rounded-md"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-admin text-[15px] font-semibold leading-[1.25] tracking-[-0.01em] text-admin-ink group-hover:text-admin-forest-soft">
                              {r.title}
                            </p>
                            <p className="mt-0.5 truncate font-admin text-[12.5px] text-admin-sub">
                              {r.artist?.name || "Tromagnon"} · {formatShortFormats(r.format)}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2.5">
                          <span className="hidden font-admin text-[13px] font-medium tabular-nums text-admin-sub sm:inline">
                            {r.release_year}
                          </span>
                          <StatusBadge status={r.status} />
                          <ChevronRight
                            size={15}
                            aria-hidden="true"
                            className="text-admin-sub transition-transform duration-[120ms] group-hover:translate-x-0.5 group-hover:text-admin-ink"
                          />
                        </div>
                      </Link>
                    ))
                  ))}

                {feedTab === "shows" &&
                  (upcomingShows.length === 0 ? (
                    <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 rounded-lg border border-admin-border bg-admin-canvas p-6 text-center">
                      <p className="font-admin text-[14px] text-admin-sub">
                        No upcoming shows.
                      </p>
                      <Link
                        href="/admin/live/create"
                        className="font-admin text-[13.5px] font-semibold text-admin-forest-soft underline underline-offset-4 hover:text-admin-forest"
                      >
                        + Schedule show
                      </Link>
                    </div>
                  ) : (
                    upcomingShows.slice(0, 6).map((ev) => (
                      <Link
                        key={ev.id}
                        href={`/admin/live/${ev.id}`}
                        className="group flex items-center justify-between gap-3 rounded-lg border border-admin-border bg-admin-canvas p-2.5 pr-3 transition-colors duration-[120ms] hover:bg-admin-elevated"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-admin-border bg-admin-surface text-admin-forest-soft">
                            <CalendarDays size={16} aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-admin text-[15px] font-semibold leading-[1.25] tracking-[-0.01em] text-admin-ink">
                              {ev.artist?.name || "Showcase"}
                            </p>
                            <p className="mt-0.5 truncate font-admin text-[12.5px] text-admin-sub">
                              {ev.venue}, {ev.city}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2.5">
                          <span className="hidden font-admin text-[13px] tabular-nums text-admin-sub sm:inline">
                            {formatDate(ev.event_date)}
                          </span>
                          <StatusBadge status={ev.status} />
                          <ChevronRight
                            size={15}
                            aria-hidden="true"
                            className="text-admin-sub transition-transform duration-[120ms] group-hover:translate-x-0.5 group-hover:text-admin-ink"
                          />
                        </div>
                      </Link>
                    ))
                  ))}

                {feedTab === "journal" &&
                  (news.length === 0 ? (
                    <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 rounded-lg border border-admin-border bg-admin-canvas p-6 text-center">
                      <p className="font-admin text-[14px] text-admin-sub">
                        No articles yet.
                      </p>
                      <Link
                        href="/admin/news/create"
                        className="font-admin text-[13.5px] font-semibold text-admin-forest-soft underline underline-offset-4 hover:text-admin-forest"
                      >
                        + Write article
                      </Link>
                    </div>
                  ) : (
                    news.slice(0, 6).map((n) => (
                      <Link
                        key={n.id}
                        href={`/admin/news/${n.id}`}
                        className="group flex items-center justify-between gap-3 rounded-lg border border-admin-border bg-admin-canvas p-2.5 pr-3 transition-colors duration-[120ms] hover:bg-admin-elevated"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Thumb
                            src={n.cover_image_url}
                            className="h-11 w-14 rounded-md"
                            fallback={<Newspaper size={15} aria-hidden="true" />}
                          />
                          <div className="min-w-0">
                            <p className="truncate font-admin text-[15px] font-semibold leading-[1.25] tracking-[-0.01em] text-admin-ink">
                              {n.title}
                            </p>
                            <p className="mt-0.5 truncate font-admin text-[12.5px] text-admin-sub">
                              {n.author || "Tromagnon"} ·{" "}
                              {formatDate(n.published_at || n.created_at) || "Draft"}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <StatusBadge status={n.status} />
                          <ChevronRight
                            size={15}
                            aria-hidden="true"
                            className="text-admin-sub transition-transform duration-[120ms] group-hover:translate-x-0.5 group-hover:text-admin-ink"
                          />
                        </div>
                      </Link>
                    ))
                  ))}
              </div>

              {/* Compact Roster Strip — always anchored cleanly at bottom */}
              <div className="mt-3 flex shrink-0 items-center justify-between gap-3 border-t border-admin-border pt-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1.5">
                    {artists.slice(0, 6).map((a) => (
                      <Link
                        key={a.id}
                        href={`/admin/artists/${a.id}`}
                        title={a.name}
                        aria-label={`Edit ${a.name}`}
                        className="transition-transform duration-[120ms] hover:z-10 hover:scale-105"
                      >
                        <Thumb
                          src={a.photo_url}
                          className="h-8 w-8 rounded-md border-2 border-admin-surface"
                          fallback={a.name[0]?.toUpperCase()}
                        />
                      </Link>
                    ))}
                  </div>
                  <span className="font-admin text-[13px] font-medium text-admin-sub tabular-nums">
                    <strong className="font-semibold text-admin-ink">{activeArtists.length}</strong>{" "}
                    artists on roster
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href="/admin/artists"
                    className="inline-flex h-8 items-center rounded-lg border border-admin-border-strong px-3 font-admin text-[13px] font-semibold text-admin-ink transition-colors duration-[120ms] hover:bg-admin-elevated"
                  >
                    Roster
                  </Link>
                  <Link
                    href="/admin/artists/create"
                    aria-label="Add artist"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-admin-forest-soft text-[#F1F2EE] transition-colors duration-[120ms] hover:bg-admin-forest"
                  >
                    <Plus size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Health / Readiness Card (5 cols) */}
            <aside className="flex min-h-0 flex-col rounded-xl border border-admin-border bg-admin-muted p-4 text-admin-ink lg:col-span-5">
              <div className="flex shrink-0 items-center justify-between gap-3">
                <h2 className="font-admin text-[18px] font-bold leading-[1.2] tracking-[-0.015em] text-admin-ink">
                  Catalog health
                </h2>
                <Link
                  href="/admin/releases"
                  aria-label="Review catalog"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-admin-border-strong bg-admin-surface text-admin-ink transition-colors duration-[120ms] hover:bg-admin-forest-soft hover:text-[#F1F2EE]"
                >
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>

              {/* Compact Donut + Percentage */}
              <div className="mt-3 flex shrink-0 items-center gap-4 border-b border-admin-border pb-3.5">
                <div
                  role="img"
                  aria-label={`Catalog health ${readiness.score} percent`}
                  className="relative h-20 w-20 shrink-0"
                >
                  <svg viewBox="0 0 92 92" className="h-full w-full -rotate-90">
                    <circle
                      cx="46"
                      cy="46"
                      r={ringRadius}
                      fill="none"
                      stroke="#CFD3CA"
                      strokeWidth="10"
                    />
                    <circle
                      cx="46"
                      cy="46"
                      r={ringRadius}
                      fill="none"
                      stroke="#31605A"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      className="transition-all duration-[320ms] ease-tromagnon"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <p className="font-admin text-[36px] font-bold leading-none tracking-[-0.03em] text-admin-ink tabular-nums">
                    {readiness.score}%
                  </p>
                  <p className="mt-1 font-admin text-[12.5px] font-medium text-admin-sub tabular-nums">
                    {readiness.passedChecks} of {readiness.totalChecks} checks complete
                  </p>
                </div>
              </div>

              {/* Issues / Status */}
              <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
                {readiness.issues.length === 0 ? (
                  <div className="flex items-center gap-2.5 rounded-lg border border-admin-border bg-admin-surface px-3.5 py-3 text-admin-ink">
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-admin-success"
                      aria-hidden="true"
                    />
                    <p className="font-admin text-[13.5px] font-medium text-admin-ink">
                      All catalog assets complete.
                    </p>
                  </div>
                ) : (
                  readiness.issues.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="group flex items-center justify-between gap-3 rounded-lg border border-admin-border bg-admin-surface p-2.5 pr-3 transition-colors duration-[120ms] hover:bg-admin-elevated"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Thumb
                          src={item.thumb}
                          className="h-9 w-9 rounded-md"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-admin text-[14.5px] font-semibold leading-[1.25] tracking-[-0.01em] text-admin-ink">
                            {item.title}
                          </p>
                          <p className="truncate font-admin text-[12px] text-admin-sub">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-md px-2.5 py-1 font-admin text-[12px] font-semibold transition-colors duration-[120ms]",
                          item.urgent
                            ? "bg-admin-amber-soft text-admin-amber group-hover:bg-admin-forest-soft group-hover:text-[#F1F2EE]"
                            : "bg-admin-forest-soft text-[#F1F2EE] group-hover:bg-admin-forest"
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
