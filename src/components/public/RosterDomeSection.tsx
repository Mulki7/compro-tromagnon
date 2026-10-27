"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Disc } from "lucide-react";
import { Artist } from "@/types/models";
import { getArtists } from "@/lib/api/artists";
import { getMediaUrl, formatGenre } from "@/lib/utils";

export function RosterDomeSection() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-16 sm:mt-24">
        <div className="flex items-center justify-between border-b border-black pb-3 mb-6">
          <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded" />
          <div className="h-4 w-24 bg-neutral-100 animate-pulse rounded" />
        </div>
        <div className="w-full h-[400px] flex items-center justify-center">
          <Disc className="w-8 h-8 text-neutral-300 animate-spin" />
        </div>
      </section>
    );
  }

  if (artists.length === 0) return null;

  return (
    <section
      ref={containerRef}
      aria-label="Artists Roster"
      style={{
        background: "linear-gradient(180deg, #080808 0%, #0f0f0f 50%, #080808 100%)",
      }}
      className="w-full select-none py-16 sm:py-24 relative overflow-hidden"
    >
      {/* Radial ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(217,56,41,0.05) 0%, transparent 65%)",
        }}
      />
      {/* Top/bottom shimmer lines (watch bezel effect) */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.07) 50%, transparent 95%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.07) 50%, transparent 95%)",
        }}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-10 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-5 gap-4 border-b border-white/10">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase"
            style={{ color: "#f5f5f5", letterSpacing: "-0.02em" }}
          >
            The Roster
          </h2>
          <Link
            href="/artists"
            className="group flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-wider"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <span className="group-hover:text-white transition-colors duration-200">Explore All</span>
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:border-[#D93829] group-hover:text-[#D93829]"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </div>
      </div>

      {/* Apple Watch Honeycomb Grid */}
      <HoneycombGrid artists={artists} hoveredIdx={hoveredIdx} setHoveredIdx={setHoveredIdx} />

      {/* Top gloss reflection */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "30%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.012) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}

function HoneycombGrid({
  artists,
  hoveredIdx,
  setHoveredIdx,
}: {
  artists: Artist[];
  hoveredIdx: number | null;
  setHoveredIdx: (v: number | null) => void;
}) {
  // Icon size and gap constants
  const ICON_SIZE = 160; // px — big enough to feel watch-like
  const GAP = 12; // px between icons
  const STEP = ICON_SIZE + GAP; // horizontal step
  const V_OVERLAP = 0.15; // vertical overlap ratio (honeycomb closeness)

  // How many icons per row (responsive — we'll use CSS to scale)
  const ITEMS_PER_ROW = 4;
  const OFFSET_PER_ROW = ITEMS_PER_ROW - 1; // odd rows have one fewer

  // Build rows
  const rows: Artist[][] = [];
  let i = 0;
  let rowIdx = 0;
  while (i < artists.length) {
    const count = rowIdx % 2 === 0 ? ITEMS_PER_ROW : OFFSET_PER_ROW;
    rows.push(artists.slice(i, i + count));
    i += count;
    rowIdx++;
  }

  const verticalStep = ICON_SIZE * (1 - V_OVERLAP);
  const totalWidth = ITEMS_PER_ROW * STEP - GAP;
  const totalHeight = rows.length * verticalStep + ICON_SIZE - verticalStep;

  return (
    <div className="relative z-10 w-full flex justify-center px-4">
      <div
        style={{
          position: "relative",
          width: `${totalWidth}px`,
          height: `${totalHeight}px`,
          maxWidth: "100%",
        }}
      >
        {rows.map((row, rIdx) => {
          const isOffsetRow = rIdx % 2 !== 0;
          const yPos = rIdx * verticalStep;
          const xOffset = isOffsetRow ? STEP / 2 : 0;

          return row.map((artist, cIdx) => {
            const globalIdx = artists.findIndex((a) => a.slug === artist.slug);
            const xPos = xOffset + cIdx * STEP;

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                style={{
                  position: "absolute",
                  left: `${xPos}px`,
                  top: `${yPos}px`,
                  width: `${ICON_SIZE}px`,
                  height: `${ICON_SIZE}px`,
                }}
              >
                <WatchAppIcon
                  artist={artist}
                  size={ICON_SIZE}
                  isHovered={hoveredIdx === globalIdx}
                  isNeighborHovered={hoveredIdx !== null && hoveredIdx !== globalIdx}
                  onHover={() => setHoveredIdx(globalIdx)}
                  onLeave={() => setHoveredIdx(null)}
                />
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}

interface WatchAppIconProps {
  artist: Artist;
  size: number;
  isHovered: boolean;
  isNeighborHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function WatchAppIcon({ artist, isHovered, isNeighborHovered, onHover, onLeave }: WatchAppIconProps) {
  const photo =
    artist.photo_url && artist.photo_url.trim() !== ""
      ? getMediaUrl(artist.photo_url)
      : "/assets/placeholder-cover.jpg";

  return (
    <Link
      href={`/artists/${artist.slug}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative block w-full h-full cursor-pointer"
      style={{
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
        transform: isHovered ? "scale(1.18)" : isNeighborHovered ? "scale(0.92)" : "scale(1)",
        opacity: isNeighborHovered ? 0.55 : 1,
        zIndex: isHovered ? 30 : 1,
      }}
    >
      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          transition: "box-shadow 0.3s ease",
          boxShadow: isHovered
            ? "0 0 0 2.5px rgba(217,56,41,1), 0 0 20px rgba(217,56,41,0.55), 0 0 50px rgba(217,56,41,0.2)"
            : "0 0 0 1.5px rgba(255,255,255,0.09), 0 4px 16px rgba(0,0,0,0.9)",
        }}
      />

      {/* Circle image */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden"
        style={{ background: "#181818" }}
      >
        <Image
          src={photo}
          alt={artist.name}
          fill
          sizes="160px"
          className="object-cover"
          style={{
            transition: "transform 0.4s ease, filter 0.3s ease",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            filter: isHovered
              ? "brightness(1.1) saturate(1.15)"
              : "brightness(0.8) saturate(0.85)",
          }}
          unoptimized={photo.startsWith("http")}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: isHovered
              ? "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.62) 100%)"
              : "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.78) 100%)",
            transition: "background 0.3s ease",
          }}
        />

        {/* Text label */}
        <div
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end px-2 pb-3"
          style={{ pointerEvents: "none" }}
        >
          <span
            className="text-white font-black text-center leading-tight"
            style={{
              fontSize: "9.5px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              textShadow: "0 1px 6px rgba(0,0,0,1)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {artist.name}
          </span>
          {artist.genre && (
            <span
              className="font-mono font-bold tracking-widest mt-0.5"
              style={{
                fontSize: "6.5px",
                color: "#D93829",
                textTransform: "uppercase",
                textShadow: "0 0 8px rgba(217,56,41,0.7)",
              }}
            >
              {formatGenre(artist.genre)}
            </span>
          )}
        </div>

        {/* Hover arrow */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.2s ease",
            paddingBottom: "22px",
          }}
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: "32px",
              height: "32px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <ArrowUpRight size={15} className="text-white" />
          </div>
        </div>
      </div>

      {/* Top gloss shine on icon */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "45%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
          borderRadius: "50% 50% 0 0",
        }}
      />
    </Link>
  );
}
