"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { getLiveEvents } from "@/lib/api/live";
import { LiveEvent } from "@/types/models";
import { getMediaUrl } from "@/lib/utils";

interface ArtistTourGroup {
  key: string;
  artistId?: string;
  name: string;
  slug?: string;
  photo?: string | null;
  events: LiveEvent[];
}

function formatLiveDate(dateString?: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function groupByArtist(events: LiveEvent[]): ArtistTourGroup[] {
  const map = new Map<string, ArtistTourGroup>();

  for (const event of events) {
    const key = event.artist_id || event.artist?.slug || event.artist?.name || "unknown";
    const existing = map.get(key);
    if (existing) {
      existing.events.push(event);
    } else {
      map.set(key, {
        key,
        artistId: event.artist_id || event.artist?.id,
        name: event.artist?.name || "Tromagnon Artist",
        slug: event.artist?.slug,
        photo: event.artist?.photo_url,
        events: [event],
      });
    }
  }

  return Array.from(map.values())
    .map((group) => ({
      ...group,
      events: [...group.events].sort(
        (a, b) =>
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function distributeColumns(groups: ArtistTourGroup[], columnCount: number) {
  const columns: ArtistTourGroup[][] = Array.from({ length: columnCount }, () => []);
  const weights = Array.from({ length: columnCount }, () => 0);

  for (const group of groups) {
    let target = 0;
    for (let i = 1; i < columnCount; i++) {
      if (weights[i] < weights[target]) target = i;
    }
    columns[target].push(group);
    weights[target] += group.events.length + 1;
  }

  return columns;
}

function ArtistTourColumn({ group }: { group: ArtistTourGroup }) {
  const photo =
    group.photo && group.photo.trim() !== ""
      ? getMediaUrl(group.photo)
      : "/assets/placeholder-cover.jpg";

  const nameEl = group.slug ? (
    <Link href={`/artists/${group.slug}`} className="hover:underline underline-offset-2">
      {group.name}
    </Link>
  ) : (
    <span>{group.name}</span>
  );

  return (
    <section className="relative mb-14 break-inside-avoid">
      {/* Sticky artist header */}
      <div className="sticky top-0 z-20 flex items-center gap-4 bg-white/95 backdrop-blur-sm py-3 -mx-1 px-1">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-full bg-neutral-200 ring-2 ring-white">
          <Image
            src={photo}
            alt={group.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-black leading-tight">
          {nameEl}
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative pl-10 sm:pl-12 mt-1">
        <div
          className="absolute left-10 sm:left-12 top-0 bottom-2 w-px border-l border-dashed border-neutral-400"
          aria-hidden
        />

        <ul className="space-y-8 pt-4 pb-2">
          {group.events.map((show) => {
            const placeParts = [show.country, show.city].filter(Boolean);
            const placeLine = placeParts.join(" — ");
            const venueLine = show.venue
              ? placeLine
                ? `${placeLine}, ${show.venue}`
                : show.venue
              : placeLine;

            return (
              <li key={show.id} className="relative pl-8">
                <span
                  className="absolute left-0 top-2 h-1.5 w-1.5 -translate-x-[3.5px] rounded-full bg-neutral-500"
                  aria-hidden
                />

                <div className="inline-block bg-black text-white text-xs font-medium px-2.5 py-1">
                  {formatLiveDate(show.event_date)}
                </div>

                <p className="mt-2 text-sm text-neutral-600 leading-snug">
                  {venueLine || "Venue TBA"}
                </p>

                {show.status === "cancelled" ? (
                  <p className="mt-1.5 text-sm text-[#D93829]">Cancelled</p>
                ) : show.ticket_url ? (
                  <a
                    href={show.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-block text-sm text-black underline underline-offset-2 hover:text-[#D93829]"
                  >
                    Tickets
                  </a>
                ) : show.status === "upcoming" ? (
                  <p className="mt-1.5 text-sm text-neutral-400">No tickets yet</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default function LivePage() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const apiEvents = await getLiveEvents();
        if (Array.isArray(apiEvents)) {
          setEvents(apiEvents);
        }
      } catch (err) {
        console.error("Failed to load live events from API:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const filteredEvents = events.filter((e) => {
    if (activeTab === "upcoming") return e.status === "upcoming";
    return e.status === "past" || e.status === "cancelled";
  });

  const groups = useMemo(() => groupByArtist(filteredEvents), [filteredEvents]);
  const columns = useMemo(() => distributeColumns(groups, 3), [groups]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 w-full">
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-black">
              Live tour dates
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 mt-2 leading-relaxed">
              Upcoming and past shows from Tromagnon Records artists — grouped by
              band so you can follow each roster on the road.
            </p>
          </div>

          <div className="flex items-center gap-1 border border-neutral-200 p-1 bg-neutral-50 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wide transition font-medium ${
                activeTab === "upcoming"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wide transition font-medium ${
                activeTab === "past"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-400 animate-pulse">
            Loading tour dates…
          </div>
        ) : groups.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-neutral-200">
            <p className="text-sm text-neutral-500">
              No {activeTab} dates found. Add events via CMS Admin.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: single column */}
            <div className="md:hidden space-y-2">
              {groups.map((group) => (
                <ArtistTourColumn key={group.key} group={group} />
              ))}
            </div>

            {/* Desktop: 3 columns, sticky headers per artist */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-14">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="min-w-0">
                  {column.map((group) => (
                    <ArtistTourColumn key={group.key} group={group} />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
