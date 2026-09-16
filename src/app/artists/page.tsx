import React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import Image from "next/image";
import { getArtists } from "@/lib/api/artists";
import { getMediaUrl } from "@/lib/utils";

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 w-full">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-[2rem] font-medium tracking-tight text-black">
            Please meet our artists
          </h1>
          <p className="text-sm sm:text-base text-neutral-700 mt-2 max-w-2xl">
            For bookings, offers or other ideas please feel free to get in touch
            with{" "}
            <a
              href="mailto:demos@tromagnon.com"
              className="underline underline-offset-2 hover:text-black"
            >
              us
            </a>
            .
          </p>
        </div>

        {artists.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-neutral-200">
            <p className="text-sm font-mono text-neutral-500">
              No artists registered in the database yet. Add artists via CMS Admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
            {artists.map((artist) => {
              const photo =
                artist.photo_url && artist.photo_url.trim() !== ""
                  ? getMediaUrl(artist.photo_url)
                  : "/assets/placeholder-cover.jpg";

              return (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden bg-neutral-200"
                >
                  <Image
                    src={photo}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute top-0 left-0 z-10 bg-white/95 border border-black/10 px-2 py-1 text-[11px] sm:text-xs leading-tight text-black">
                    {artist.name}
                  </span>
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
