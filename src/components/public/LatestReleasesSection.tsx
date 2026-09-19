"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Disc, ExternalLink, ArrowUpRight } from "lucide-react";
import { Release } from "@/types/models";
import { getReleases } from "@/lib/api/releases";
import { getMediaUrl } from "@/lib/utils";

function parseFormats(format?: string | string[] | null): string[] {
  if (!format) return [];
  if (Array.isArray(format)) {
    return format.map((f) => f.trim()).filter(Boolean);
  }
  if (typeof format === "string") {
    if (format.startsWith("[") && format.endsWith("]")) {
      return format
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
    }
    return format
      .split(/[,/|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function LatestReleasesSection() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const stageRef = useRef<HTMLDivElement>(null);
  const wheelAccumulator = useRef<number>(0);
  const isThrottled = useRef<boolean>(false);
  const directionCountRef = useRef<number>(0);
  const lastDirRef = useRef<number>(0);
  const pointerStartX = useRef<number | null>(null);
  const pointerStartY = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);

  // Fetch strictly only from real releases API (no dummy injection)
  useEffect(() => {
    let isMounted = true;
    async function loadReleases() {
      try {
        const data = await getReleases();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            const sorted = [...data].sort((a, b) => {
              const yearDiff = (b.release_year || 0) - (a.release_year || 0);
              if (yearDiff !== 0) return yearDiff;
              return (
                new Date(b.created_at || "").getTime() -
                new Date(a.created_at || "").getTime()
              );
            });
            setReleases(sorted);
          } else {
            setReleases([]);
          }
        }
      } catch (err) {
        console.error("Failed to load releases:", err);
        if (isMounted) setReleases([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadReleases();
    return () => {
      isMounted = false;
    };
  }, []);

  const total = releases.length;

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Non-passive wheel listener: PREVENT horizontal Mac swipe-back, ALLOW normal vertical scroll
  // Direction tracking: macOS trackpad sends rubber-band deltas in wrong direction first.
  // We require 3+ consistent same-direction events before triggering a slide change.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);

      // Block macOS two-finger horizontal swipe history navigation
      if (absX > 2) {
        e.preventDefault();
        if (total <= 1) return;

        const dir = Math.sign(e.deltaX); // +1 or -1

        // Track direction consistency: reset counter on direction change
        if (dir === lastDirRef.current) {
          directionCountRef.current++;
        } else {
          directionCountRef.current = 1;
          lastDirRef.current = dir;
          wheelAccumulator.current = 0; // reset accumulator on direction change
        }

        wheelAccumulator.current += e.deltaX;

        // Only trigger after 3+ consistent events in same direction AND threshold crossed
        // This skips the initial Mac rubber-band events that go in the wrong direction
        if (
          directionCountRef.current >= 3 &&
          Math.abs(wheelAccumulator.current) > 30 &&
          !isThrottled.current
        ) {
          if (wheelAccumulator.current > 0) {
            handleNext();
          } else {
            handlePrev();
          }
          isThrottled.current = true;
          wheelAccumulator.current = 0;
          directionCountRef.current = 0;
          setTimeout(() => {
            isThrottled.current = false;
          }, 500);
        }
      } else {
        // Pure vertical scroll: Allow normal page scrolling
        wheelAccumulator.current = 0;
        directionCountRef.current = 0;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [total, handleNext, handlePrev]);

  // Pointer/touch drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    pointerStartY.current = e.clientY;
    isDragging.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (
      !isDragging.current ||
      pointerStartX.current === null ||
      pointerStartY.current === null ||
      total <= 1
    )
      return;

    const diffX = e.clientX - pointerStartX.current;
    const diffY = Math.abs(e.clientY - pointerStartY.current);

    // Only swipe if horizontal drag is dominant
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > diffY) {
      if (diffX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
      pointerStartX.current = e.clientX;
      pointerStartY.current = e.clientY;
      isDragging.current = false;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    pointerStartX.current = null;
    pointerStartY.current = null;
  };

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-12 sm:mt-16">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-6">
          <div className="h-5 w-40 bg-neutral-200 animate-pulse rounded" />
          <div className="h-4 w-20 bg-neutral-100 animate-pulse rounded" />
        </div>
        <div className="w-full h-64 flex items-center justify-center">
          <Disc className="w-8 h-8 text-neutral-300 animate-spin" />
        </div>
      </section>
    );
  }

  // If no releases in database yet, don't show dummy section
  if (releases.length === 0) {
    return null;
  }

  const currentRelease = releases[activeIndex] || releases[0];
  const formats = parseFormats(currentRelease.format);
  const artistName = currentRelease.artist?.name || "Tromagnon Collective";

  return (
    <section
      aria-label="Latest Releases"
      className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-12 sm:mt-16 select-none"
    >
      {/* Clean Minimal Section Header */}
      <div className="flex items-baseline justify-between border-b border-neutral-200 pb-3">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#D93829] uppercase font-semibold">
            Section 01 // Audio Archive
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0A0A0A] mt-0.5">
            Latest Releases
          </h2>
        </div>

        <Link
          href="/releases"
          className="group flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
        >
          <span>View All</span>
          <ArrowUpRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#D93829]"
          />
        </Link>
      </div>

      {/* ─── 3D COVER FLOW STAGE (Direct Canvas) ─────────────────────────── */}
      <div
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full pt-10 pb-4 overflow-hidden flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: "1000px",
          perspectiveOrigin: "50% 50%",
          touchAction: "pan-y",
          overscrollBehaviorX: "contain",
        }}
      >
        {/* 3D Track Container */}
        <div
          className="relative w-full h-64 sm:h-72 md:h-80 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {releases.map((rel, index) => {
            let diff = index - activeIndex;

            if (total > 3) {
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;
            }

            const isCenter = diff === 0;
            const absDiff = Math.abs(diff);

            if (absDiff > 3) return null;

            const stepX = 140;
            const centerGap = 65;
            const translateX =
              diff === 0
                ? 0
                : diff > 0
                  ? diff * stepX + centerGap
                  : diff * stepX - centerGap;

            const translateZ = isCenter ? 25 : -absDiff * 100;
            const rotateY = isCenter ? 0 : diff > 0 ? -40 : 40;
            const scale = isCenter ? 1.05 : Math.max(0.75, 1 - absDiff * 0.12);
            const zIndex = 30 - absDiff;
            const opacity = isCenter ? 1 : Math.max(0.35, 1 - absDiff * 0.25);
            const brightness = isCenter ? 1 : Math.max(0.6, 0.9 - absDiff * 0.18);

            const artwork =
              rel.artwork_url && rel.artwork_url.trim() !== ""
                ? getMediaUrl(rel.artwork_url)
                : "/assets/placeholder-cover.jpg";

            return (
              <div
                key={rel.id || rel.slug || index}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isCenter) setActiveIndex(index);
                }}
                className={`absolute top-0 bottom-0 m-auto w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center cursor-pointer`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                  filter: `brightness(${brightness}) drop-shadow(0 ${isCenter ? "18px 25px" : "10px 14px"
                    } rgba(0,0,0,0.18))`,
                  transformStyle: "preserve-3d",
                  WebkitBoxReflect:
                    "below 8px linear-gradient(to bottom, transparent 65%, rgba(0,0,0,0.16) 100%)",
                }}
              >
                {/* Album Cover Card Wrap */}
                <div className="relative w-full h-full group/card">
                  {/* Vinyl Record Disc Peek on Active Hover */}
                  <div
                    className={`absolute inset-y-1.5 right-0 w-[94%] h-[94%] my-auto rounded-full bg-neutral-900 border-2 border-neutral-700 shadow-lg transition-all duration-500 pointer-events-none flex items-center justify-center overflow-hidden ${isCenter
                        ? "translate-x-5 sm:translate-x-8 group-hover/card:translate-x-10 sm:group-hover/card:translate-x-14 rotate-12"
                        : "translate-x-0 opacity-0"
                      }`}
                    style={{ zIndex: -1 }}
                  >
                    <div className="absolute inset-1 rounded-full border border-neutral-700/50" />
                    <div className="absolute inset-3 rounded-full border border-neutral-800/80" />
                    <div className="absolute inset-6 rounded-full border border-neutral-700/40" />
                    <div className="w-12 h-12 rounded-full bg-[#D93829] flex items-center justify-center text-[7px] font-mono text-white font-bold border-4 border-neutral-950">
                      TMR
                    </div>
                  </div>

                  {/* Album Cover Sleeve */}
                  <div className="relative w-full h-full bg-neutral-100 border border-neutral-200/90 shadow-lg overflow-hidden">
                    <Image
                      src={artwork}
                      alt={rel.title}
                      fill
                      sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      priority={isCenter}
                      unoptimized={artwork.startsWith("http")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 pointer-events-none" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── DOTS INDICATOR (Under Album Covers) ────────────────────── */}
        <div className="flex items-center justify-center gap-1.5 mt-8 mb-5">
          {releases.map((r, idx) => (
            <button
              key={r.id || idx}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(idx);
              }}
              aria-label={`Go to release ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${idx === activeIndex
                  ? "w-6 h-1.5 bg-[#D93829]"
                  : "w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-400"
                }`}
            />
          ))}
        </div>

        {/* ─── COMPACT UNIFIED DETAILS & CTA ──────────────────────────── */}
        <div className="text-center max-w-lg mx-auto space-y-2 px-4 transition-all duration-300">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#D93829]">
            {artistName}
          </p>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#0A0A0A] leading-tight">
            {currentRelease.title}
          </h3>

          {/* Formats & Release Year */}
          <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-neutral-500 font-mono pt-0.5">
            {currentRelease.release_year && (
              <span>{currentRelease.release_year}</span>
            )}
            {formats.length > 0 && <span>·</span>}
            {formats.map((fmt) => (
              <span
                key={fmt}
                className="border border-neutral-300 px-1.5 py-0.5 rounded text-[10px] uppercase font-sans text-neutral-700 bg-neutral-50"
              >
                {fmt}
              </span>
            ))}
          </div>

          {/* Action Button CTA */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href={`/releases/${currentRelease.slug}`}
              className="inline-flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all shadow-sm active:scale-95"
            >
              <span>Explore Release</span>
              <ArrowUpRight size={13} />
            </Link>

            {currentRelease.streaming_links?.bandcamp && (
              <a
                href={currentRelease.streaming_links.bandcamp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-semibold px-3.5 py-2.5 rounded-full transition-all"
              >
                <ExternalLink size={12} className="text-[#1DA0C3]" />
                <span>Bandcamp</span>
              </a>
            )}

            {currentRelease.streaming_links?.spotify && (
              <a
                href={currentRelease.streaming_links.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-semibold px-3.5 py-2.5 rounded-full transition-all"
              >
                <ExternalLink size={12} className="text-[#1DB954]" />
                <span>Spotify</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
