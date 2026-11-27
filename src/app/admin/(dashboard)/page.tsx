"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Thumb } from "@/components/admin/ListControls";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import { btnPrimarySm } from "@/components/admin/formStyles";
import { getAdminArtists } from "@/lib/api/admin/artists";
import { getAdminReleases } from "@/lib/api/admin/releases";
import { getAdminNews } from "@/lib/api/admin/news";
import { getAdminLiveEvents } from "@/lib/api/admin/live";
import { getAdminHeroBanners } from "@/lib/api/admin/hero";
import { Artist, HeroBanner, LiveEvent, News, Release } from "@/types/models";
import { formatDate } from "@/lib/utils";

const sectionLabel =
  "text-[13px] font-semibold uppercase tracking-[0.08em] text-satelit-muted";

interface AttentionItem {
  key: string;
  text: string;
  href: string;
  cta: string;
}

export default function AdminDashboardPage() {
  const { onMenuClick } = useAdminShell();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [live, setLive] = useState<LiveEvent[]>([]);
  const [hero, setHero] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch {
        if (!cancelled) setError("Could not load the dashboard. Check that the API is running.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcoming = useMemo(
    () =>
      live
        .filter((e) => e.status === "upcoming")
        .sort(
          (a, b) =>
            new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
        ),
    [live]
  );

  const attention = useMemo(() => {
    const items: AttentionItem[] = [];
    releases.forEach((r) => {
      if (r.status === "draft")
        items.push({
          key: `rd-${r.id}`,
          text: `${r.title} is still a draft`,
          href: `/admin/releases/${r.id}`,
          cta: "Review",
        });
      if (!r.artwork_url)
        items.push({
          key: `ra-${r.id}`,
          text: `${r.title} has no artwork`,
          href: `/admin/releases/${r.id}`,
          cta: "Add",
        });
    });
    news.forEach((n) => {
      if (n.status === "draft")
        items.push({
          key: `nd-${n.id}`,
          text: `${n.title} is unpublished`,
          href: `/admin/news/${n.id}`,
          cta: "Review",
        });
    });
    artists.forEach((a) => {
      if (!a.photo_url)
        items.push({
          key: `ap-${a.id}`,
          text: `${a.name} has no photo`,
          href: `/admin/artists/${a.id}`,
          cta: "Add",
        });
    });
    if (hero.filter((h) => h.is_active !== false).length === 0)
      items.push({
        key: "hero",
        text: "No active banner on the homepage",
        href: "/admin/hero/create",
        cta: "Add",
      });
    return items;
  }, [releases, news, artists, hero]);

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:overflow-hidden">
      <AdminHeader
        title="Dashboard"
        subtitle={`${releases.length} releases, ${artists.length} artists, ${news.length} articles`}
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/releases/create" className={btnPrimarySm}>
            <Plus size={15} aria-hidden="true" />
            New release
          </Link>
        }
      />

      {error && (
        <div
          role="alert"
          className="mx-5 mb-4 rounded-lg border border-satelit-danger/30 bg-satelit-danger/10 px-4 py-2.5 text-[14px] text-satelit-danger sm:mx-7"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          aria-busy="true"
          className="grid flex-1 grid-cols-2 gap-4 px-5 pb-6 sm:grid-cols-4 sm:px-7"
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-lg bg-satelit-surface/70 motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 gap-8 px-5 pb-6 sm:px-7 lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)]">
          {/* Catalog: the label's actual product, front and centre */}
          <section className="flex min-h-0 flex-col lg:col-span-8">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className={sectionLabel}>Catalog</h2>
              <Link
                href="/admin/releases"
                className="text-[14px] font-semibold text-satelit-accent hover:text-satelit-accent-hover"
              >
                All releases
              </Link>
            </div>
            <ul className="-m-1 grid min-h-0 flex-1 auto-rows-min grid-cols-2 content-start gap-x-4 gap-y-5 overflow-y-auto p-1 pb-2 sm:grid-cols-3 xl:grid-cols-4">
              {releases.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/releases/${r.id}`} className="group block rounded-lg">
                    <div className="relative overflow-hidden rounded-lg">
                      <Thumb
                        src={r.artwork_url}
                        className="aspect-square w-full rounded-lg border-0"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-satelit-border transition group-hover:ring-2 group-hover:ring-satelit-accent"
                      />
                      {r.status === "draft" && (
                        <span className="absolute left-2 top-2 rounded bg-satelit-ink px-1.5 py-0.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-satelit-on-accent">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-2 truncate text-[15px] font-semibold text-satelit-ink">
                      {r.title}
                    </p>
                    <p className="truncate text-[13px] text-satelit-muted">
                      {r.artist?.name || "Tromagnon"} · {r.release_year}
                    </p>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin/releases/create"
                  className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-satelit-border text-satelit-muted transition hover:border-satelit-accent hover:text-satelit-accent"
                >
                  <Plus size={20} aria-hidden="true" />
                  <span className="text-[14px] font-semibold">Add release</span>
                </Link>
              </li>
            </ul>
          </section>

          {/* Right rail: what needs a human */}
          <aside className="flex min-h-0 flex-col gap-6 lg:col-span-4 lg:overflow-y-auto lg:pr-1">
            <section>
              <h2 className={sectionLabel}>
                Needs attention
                {attention.length > 0 && (
                  <span className="ml-2 tabular-nums text-satelit-accent">
                    {attention.length}
                  </span>
                )}
              </h2>
              {attention.length === 0 ? (
                <p className="mt-3 flex items-center gap-2 text-[15px] text-satelit-muted">
                  <CheckCircle2 size={17} className="text-satelit-accent" aria-hidden="true" />
                  Everything is in order.
                </p>
              ) : (
                <ul className="mt-2">
                  {attention.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-center justify-between gap-3 border-b border-satelit-border/70 py-2.5 last:border-0"
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-satelit-accent"
                        />
                        <span className="truncate text-[15px] text-satelit-ink">
                          {item.text}
                        </span>
                      </span>
                      <Link
                        href={item.href}
                        className="shrink-0 text-[14px] font-semibold text-satelit-accent hover:text-satelit-accent-hover"
                      >
                        {item.cta}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="border-t border-satelit-border pt-5">
              <div className="flex items-baseline justify-between">
                <h2 className={sectionLabel}>Next shows</h2>
                <Link
                  href="/admin/live/create"
                  className="text-[14px] font-semibold text-satelit-accent hover:text-satelit-accent-hover"
                >
                  Schedule
                </Link>
              </div>
              {upcoming.length === 0 ? (
                <p className="mt-3 text-[15px] text-satelit-muted">No upcoming shows.</p>
              ) : (
                <ul className="mt-2">
                  {upcoming.slice(0, 4).map((ev) => (
                    <li key={ev.id}>
                      <Link
                        href={`/admin/live/${ev.id}`}
                        className="flex items-baseline justify-between gap-3 border-b border-satelit-border/70 py-2.5 last:border-0 hover:text-satelit-accent"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] font-semibold">
                            {ev.artist?.name || "Showcase"}
                          </span>
                          <span className="block truncate text-[13px] text-satelit-muted">
                            {ev.venue}, {ev.city}
                          </span>
                        </span>
                        <span className="shrink-0 text-[14px] tabular-nums text-satelit-muted">
                          {formatDate(ev.event_date)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="border-t border-satelit-border pt-5">
              <div className="flex items-baseline justify-between">
                <h2 className={sectionLabel}>Roster</h2>
                <Link
                  href="/admin/artists"
                  className="text-[14px] font-semibold text-satelit-accent hover:text-satelit-accent-hover"
                >
                  All artists
                </Link>
              </div>
              <div className="mt-3 flex items-center">
                <ul className="flex -space-x-2">
                  {artists.slice(0, 7).map((a) => (
                    <li key={a.id}>
                      <Link href={`/admin/artists/${a.id}`} title={a.name} aria-label={a.name}>
                        <Thumb
                          src={a.photo_url}
                          className="h-9 w-9 rounded-full border-2 border-satelit-bg"
                          fallback={a.name[0]?.toUpperCase()}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
                {artists.length > 7 && (
                  <span className="ml-3 text-[14px] tabular-nums text-satelit-muted">
                    +{artists.length - 7}
                  </span>
                )}
                <Link
                  href="/admin/artists/create"
                  aria-label="Add artist"
                  className="ml-3 flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-satelit-border text-satelit-muted transition hover:border-satelit-accent hover:text-satelit-accent"
                >
                  <Plus size={15} />
                </Link>
              </div>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
