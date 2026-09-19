"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Disc } from "lucide-react";
import { Artist } from "@/types/models";
import { getArtists } from "@/lib/api/artists";
import { getMediaUrl, formatGenre } from "@/lib/utils";

const ROWS = 4;
const CARD_SIZE = 120;
const GAP = 12;
const NUM_CARDS_PER_ROW = 24;

export function RosterDomeSection() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredArtist, setHoveredArtist] = useState<Artist | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const userScrollingRef = useRef(false);
  const userScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await getArtists();
        if (isMounted) setArtists(Array.isArray(data) && data.length > 0 ? data : []);
      } catch {
        if (isMounted) setArtists([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  // Build row data
  const rowsData = useMemo(() => {
    if (artists.length === 0) return [];
    return Array.from({ length: ROWS }, (_, rowIdx) =>
      Array.from({ length: NUM_CARDS_PER_ROW }, (_, colIdx) =>
        artists[(rowIdx * NUM_CARDS_PER_ROW + colIdx) % artists.length]
      )
    );
  }, [artists]);

  // Fisheye scale and auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let raf: number;

    const onScroll = () => {
      userScrollingRef.current = true;
      if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
      userScrollTimeoutRef.current = setTimeout(() => {
        userScrollingRef.current = false;
      }, 2500);
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    const updateFisheye = () => {
      if (!userScrollingRef.current && el) {
        el.scrollLeft += 0.4;
      }

      if (el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const maxDist = Math.max(rect.width, rect.height) * 0.7;

        cardsRef.current.forEach((card) => {
          if (!card) return;
          const cardRect = card.getBoundingClientRect();
          const cardCx = cardRect.left + cardRect.width / 2;
          const cardCy = cardRect.top + cardRect.height / 2;

          const dx = cardCx - cx;
          const dy = cardCy - cy;
          // Apply an elliptical distance bias so edges shrink nicely
          const dist = Math.sqrt(dx * dx + dy * dy * 1.5);
          
          // Fisheye formula: closer to center = scale 1, further = scale smaller, fade opacity
          const factor = Math.max(0, 1 - Math.pow(dist / maxDist, 1.8));
          const scale = 0.5 + 0.5 * factor;
          const opacity = 0.1 + 0.9 * factor;

          card.style.transform = `scale(${scale})`;
          card.style.opacity = `${opacity}`;
          // Add a subtle z-index adjustment so center items stay on top
          card.style.zIndex = `${Math.round(factor * 100)}`;
        });
      }

      raf = requestAnimationFrame(updateFisheye);
    };
    raf = requestAnimationFrame(updateFisheye);

    // Start with some initial scroll offset so we're not at the very left edge
    el.scrollLeft = 300;

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
    };
  }, [artists]); // re-run if artists load

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-16 sm:mt-24">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-6">
          <div className="h-5 w-40 bg-neutral-200 animate-pulse rounded" />
          <div className="h-4 w-20 bg-neutral-100 animate-pulse rounded" />
        </div>
        <div className="w-full h-96 flex items-center justify-center">
          <Disc className="w-8 h-8 text-neutral-300 animate-spin" />
        </div>
      </section>
    );
  }

  if (artists.length === 0) return null;

  const staggerOffset = (CARD_SIZE + GAP) / 2;
  const totalWidth = NUM_CARDS_PER_ROW * (CARD_SIZE + GAP) + staggerOffset + 200;

  return (
    <section
      aria-label="Artists Roster"
      className="w-full bg-white text-[#0A0A0A] select-none pt-16 sm:pt-24 pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-neutral-200 pb-4 mb-6">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#D93829] uppercase font-semibold">
              SECTION 02 // ARTISTS ROSTER
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-black mt-0.5">
              The Roster
            </h2>
          </div>
          <Link
            href="/artists"
            className="group flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-[#D93829] transition-colors bg-neutral-100 hover:bg-neutral-200 px-3.5 py-1.5 rounded-full border border-neutral-200"
          >
            <span>Explore All ({artists.length})</span>
            <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#D93829]" />
          </Link>
        </div>
      </div>

      {/* Honeycomb Fisheye Grid */}
      <div className="relative h-[560px] sm:h-[600px] flex items-center overflow-hidden">
        {/* Edge fades for seamless blend */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />

        <div
          ref={scrollRef}
          className="roster-scroll-container w-full h-full overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing flex items-center"
          style={{
            overscrollBehaviorX: "contain",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          } as React.CSSProperties}
        >
          <div
            className="flex flex-col mx-auto"
            style={{ width: `${totalWidth}px`, gap: `${GAP}px`, padding: "40px 0" }}
          >
            {rowsData.map((rowArtists, rowIdx) => {
              const isOdd = rowIdx % 2 === 1;
              return (
                <div
                  key={rowIdx}
                  className="flex"
                  style={{
                    gap: `${GAP}px`,
                    paddingLeft: isOdd ? `${staggerOffset}px` : "0",
                  }}
                >
                  {rowArtists.map((artist, colIdx) => {
                    const globalIdx = rowIdx * NUM_CARDS_PER_ROW + colIdx;
                    const photo =
                      artist.photo_url && artist.photo_url.trim() !== ""
                        ? getMediaUrl(artist.photo_url)
                        : "/assets/placeholder-cover.jpg";

                    return (
                      <Link
                        key={`${rowIdx}-${colIdx}`}
                        href={`/artists/${artist.slug}`}
                        onMouseEnter={() => setHoveredArtist(artist)}
                        onMouseLeave={() => setHoveredArtist(null)}
                        ref={(el) => {
                          cardsRef.current[globalIdx] = el;
                        }}
                        className="group relative block flex-shrink-0 rounded-[28px] sm:rounded-[32px] overflow-hidden bg-neutral-100 shadow-xl border border-neutral-200/80 will-change-transform transition-shadow duration-300 hover:shadow-2xl hover:border-black/30 cursor-pointer"
                        style={{
                          width: `${CARD_SIZE}px`,
                          height: `${CARD_SIZE}px`,
                          transformOrigin: "center center",
                        }}
                      >
                        <Image
                          src={photo}
                          alt={artist.name}
                          fill
                          sizes="140px"
                          className="object-cover pointer-events-none"
                          unoptimized={photo.startsWith("http")}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <div className="absolute bottom-2 left-2 right-2 flex flex-col pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white line-clamp-1 drop-shadow-md">
                            {artist.name}
                          </span>
                          <span className="text-[8px] font-mono text-neutral-300 line-clamp-1">
                            {formatGenre(artist.genre)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-2 flex items-center justify-center min-h-[44px]">
        {hoveredArtist ? (
          <div className="flex items-center gap-3 bg-black text-white px-5 py-2.5 rounded-full shadow-2xl border border-neutral-800 z-20 relative">
            <span className="w-2 h-2 rounded-full bg-[#D93829] animate-pulse" />
            <div className="text-left pr-2">
              <p className="text-xs font-mono font-bold uppercase tracking-wider">{hoveredArtist.name}</p>
              <p className="text-[10px] text-neutral-400 font-mono">{formatGenre(hoveredArtist.genre)}</p>
            </div>
            <Link
              href={`/artists/${hoveredArtist.slug}`}
              className="text-[10px] font-mono font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1"
            >
              <span>View</span>
              <ArrowUpRight size={11} />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 bg-neutral-100 px-4 py-1.5 rounded-full border border-neutral-200 z-20 relative">
            <span>Swipe left/right to explore the roster</span>
          </div>
        )}
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .roster-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
