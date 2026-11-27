import React from "react";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { getArtists } from "@/lib/api/artists";

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        <h1 className="text-2xl font-bold mb-4">Artists (Raw)</h1>
        {artists.length === 0 ? (
          <p className="text-sm text-neutral-500">No artists found.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {artists.map((artist) => (
              <li key={artist.id} className="border-b border-neutral-200 pb-2">
                <Link href={`/artists/${artist.slug}`} className="underline font-medium">
                  {artist.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
