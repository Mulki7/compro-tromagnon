import React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import Image from "next/image";
import { getReleases } from "@/lib/api/releases";
import { getMediaUrl } from "@/lib/utils";
import { Release } from "@/types/models";

function parseFormats(format?: string | string[] | null): string[] {
  if (!format) return [];
  if (Array.isArray(format)) {
    return format.map((f) => f.trim()).filter(Boolean);
  }
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

type GridItem =
  | { type: "year"; year: number }
  | { type: "release"; release: Release };

function buildCatalogGrid(releases: Release[]): GridItem[] {
  const sorted = [...releases].sort((a, b) => {
    const yearDiff = (b.release_year || 0) - (a.release_year || 0);
    if (yearDiff !== 0) return yearDiff;
    return a.title.localeCompare(b.title);
  });

  const items: GridItem[] = [];
  let currentYear: number | null = null;

  for (const release of sorted) {
    const year = release.release_year || 0;
    if (year !== currentYear) {
      currentYear = year;
      items.push({ type: "year", year });
    }
    items.push({ type: "release", release });
  }

  return items;
}

export default async function ReleasesPage() {
  const releases = await getReleases();
  const gridItems = buildCatalogGrid(releases);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 w-full">
        <div className="mb-10 sm:mb-12 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-medium tracking-tight text-black">
            Explore our back catalogue
          </h1>
          <div className="mt-4 space-y-3 text-sm sm:text-[15px] leading-relaxed text-neutral-600">
            <p>
              Tromagnon Records releases music on vinyl, cassette, CD, and
              digital — from limited physical editions to archival masters.
            </p>
            <p>
              Browse the catalogue below by year. For press, licensing, or
              wholesale inquiries, get in touch with{" "}
              <a
                href="mailto:demos@tromagnon.com"
                className="underline underline-offset-2 hover:text-black"
              >
                us
              </a>
              .
            </p>
          </div>
        </div>

        {releases.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-neutral-200">
            <p className="text-sm font-mono text-neutral-500">
              No releases found in the catalog yet. Add releases via CMS Admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10">
            {gridItems.map((item) => {
              if (item.type === "year") {
                return (
                  <div
                    key={`year-${item.year}`}
                    className="aspect-square bg-black text-white flex items-center justify-center"
                    aria-label={`Year ${item.year}`}
                  >
                    <span className="text-2xl sm:text-3xl font-medium tracking-tight">
                      {item.year || "—"}
                    </span>
                  </div>
                );
              }

              const { release: rel } = item;
              const artwork =
                rel.artwork_url && rel.artwork_url.trim() !== ""
                  ? getMediaUrl(rel.artwork_url)
                  : "/assets/placeholder-cover.jpg";
              const artistName = rel.artist?.name || "Tromagnon Collective";
              const formats = parseFormats(rel.format);

              return (
                <Link
                  key={rel.id}
                  href={`/releases/${rel.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-square w-full bg-neutral-200 overflow-hidden">
                    <Image
                      src={artwork}
                      alt={rel.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-2.5 space-y-0.5">
                    <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wide text-[#D93829]">
                      {artistName}
                    </p>
                    <h2 className="text-sm font-bold text-black leading-snug group-hover:underline underline-offset-2">
                      {rel.title}
                    </h2>
                    {rel.release_year ? (
                      <p className="text-xs text-neutral-400">{rel.release_year}</p>
                    ) : null}
                  </div>

                  {formats.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {formats.map((fmt) => (
                        <span
                          key={`${rel.id}-${fmt}`}
                          className="inline-block border border-neutral-300 px-1.5 py-0.5 text-[10px] leading-none text-neutral-600 bg-neutral-50"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
