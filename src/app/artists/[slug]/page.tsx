import React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArtistBySlug } from "@/lib/api/artists";
import { getMediaUrl, formatGenre } from "@/lib/utils";
import { ArrowLeft, ExternalLink, Music2, Calendar } from "lucide-react";

interface ArtistDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const { slug } = params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  const photo =
    artist.photo_url && artist.photo_url.trim() !== ""
      ? getMediaUrl(artist.photo_url)
      : "/assets/placeholder-cover.jpg";

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-black transition"
          >
            <ArrowLeft size={14} />
            <span>BACK TO ALL ARTISTS</span>
          </Link>
        </div>

        {/* Artist Profile Header Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-50 rounded-3xl p-6 sm:p-10 border border-neutral-200">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono tracking-widest text-[#D93829] uppercase font-bold">
              {formatGenre(artist.genre)}
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-black">
              {artist.name}
            </h1>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed max-w-xl">
              {artist.bio || "Artist roster under Tromagnon Records."}
            </p>

            {/* Social Links */}
            {artist.social_links && (
              <div className="pt-4 flex flex-wrap gap-2">
                {Object.entries(artist.social_links).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-300 text-xs font-mono uppercase text-neutral-800 hover:bg-black hover:text-white transition"
                    >
                      <span>{platform}</span>
                      <ExternalLink size={12} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-black">
              <Image
                src={photo}
                alt={artist.name}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Discography & Tour Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Discography */}
          <div className="p-8 border border-neutral-200 rounded-2xl bg-white space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
              <Music2 size={18} className="text-neutral-500" />
              <h3 className="font-bold text-lg text-black">Catalog Discography</h3>
            </div>
            <p className="text-xs text-neutral-500 font-mono">
              Releases and physical editions by {artist.name}.
            </p>
            <div className="pt-2">
              <Link
                href="/releases"
                className="inline-block text-xs font-mono text-black font-semibold underline hover:text-neutral-600"
              >
                Browse releases in catalog →
              </Link>
            </div>
          </div>

          {/* Shows */}
          <div className="p-8 border border-neutral-200 rounded-2xl bg-white space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
              <Calendar size={18} className="text-neutral-500" />
              <h3 className="font-bold text-lg text-black">Live Tour & Appearances</h3>
            </div>
            <p className="text-xs text-neutral-500 font-mono">
              Check scheduled tour dates and ticketing availability.
            </p>
            <div className="pt-2">
              <Link
                href="/live"
                className="inline-block text-xs font-mono text-black font-semibold underline hover:text-neutral-600"
              >
                View upcoming tour dates →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
