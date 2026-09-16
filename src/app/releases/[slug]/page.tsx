import React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getReleaseBySlug } from "@/lib/api/releases";
import { getMediaUrl } from "@/lib/utils";
import { ArrowLeft, ExternalLink, Disc3 } from "lucide-react";

interface ReleaseDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ReleaseDetailPage({ params }: ReleaseDetailPageProps) {
  const { slug } = params;
  const release = await getReleaseBySlug(slug);

  if (!release) {
    notFound();
  }

  const artwork =
    release.artwork_url && release.artwork_url.trim() !== ""
      ? getMediaUrl(release.artwork_url)
      : "/assets/placeholder-cover.jpg";

  const artistName = release.artist?.name || "Tromagnon Artist";
  const artistSlug = release.artist?.slug || "#";
  const formatText = Array.isArray(release.format) ? release.format.join(" / ") : release.format;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full">
        <div className="mb-6">
          <Link
            href="/releases"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-500 hover:text-black transition"
          >
            <ArrowLeft size={14} />
            <span>Back to all releases</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-neutral-50 p-6 sm:p-10 border border-neutral-200">
          <div className="lg:col-span-6">
            <div className="relative aspect-square w-full overflow-hidden bg-black">
              <Image
                src={artwork}
                alt={release.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-neutral-500 mb-2">
                <span className="text-[#D93829] font-semibold">{formatText}</span>
                <span>•</span>
                <span>{release.release_year}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black">
                {release.title}
              </h1>

              <div className="mt-2">
                <Link
                  href={`/artists/${artistSlug}`}
                  className="text-lg sm:text-xl font-semibold text-neutral-800 hover:underline inline-flex items-center gap-1.5"
                >
                  <span>{artistName}</span>
                  <ExternalLink size={14} className="text-neutral-400" />
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1.5">
                Liner notes
              </h3>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                {release.description || "Official release pressed and mastered under Tromagnon Records."}
              </p>
            </div>

            {release.streaming_links && (
              <div className="pt-4 border-t border-neutral-200/80">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-3">
                  Listen on streaming platforms
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {Object.entries(release.streaming_links).map(([platform, url]) => {
                    if (!url) return null;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 text-xs uppercase tracking-wide text-neutral-900 bg-white hover:bg-black hover:text-white transition"
                      >
                        <Disc3 size={14} />
                        <span>{platform.replace("_", " ")}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
