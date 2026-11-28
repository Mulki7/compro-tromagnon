import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { getArtistBySlug } from "@/lib/api/artists";
import { formatGenre } from "@/lib/utils";

interface ArtistDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const artist = await getArtistBySlug(params.slug);

  if (!artist) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 space-y-4">
        <Link href="/artists" className="text-sm underline">
          Back to artists
        </Link>
        <h1 className="text-2xl font-bold">{artist.name}</h1>
        <p className="text-sm text-neutral-600">Genre: {formatGenre(artist.genre)}</p>
        <p className="text-sm">{artist.bio}</p>
      </main>
      <Footer />
    </div>
  );
}
