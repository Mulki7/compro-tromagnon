import React from "react";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { getReleases } from "@/lib/api/releases";

export default async function ReleasesPage() {
  const releases = await getReleases();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        <h1 className="text-2xl font-bold mb-4">Releases (Raw)</h1>
        {releases.length === 0 ? (
          <p className="text-sm text-neutral-500">No releases found.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {releases.map((rel) => (
              <li key={rel.id} className="border-b border-neutral-200 pb-2">
                <Link href={`/releases/${rel.slug}`} className="underline font-medium">
                  {rel.title}
                </Link>{" "}
                — {rel.artist?.name || "Unknown Artist"} ({rel.release_year})
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
