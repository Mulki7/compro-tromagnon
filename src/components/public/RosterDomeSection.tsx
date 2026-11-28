"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Artist } from "@/types/models";
import { getArtists } from "@/lib/api/artists";

export function RosterDomeSection() {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    getArtists()
      .then((data) => {
        if (Array.isArray(data)) setArtists(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-8 border-b border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Artists (Raw)</h2>
        <Link href="/artists" className="text-sm underline">
          View all
        </Link>
      </div>
      {artists.length === 0 ? (
        <p className="text-sm text-neutral-500">No artists loaded.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {artists.map((artist) => (
            <li key={artist.id}>
              <Link href={`/artists/${artist.slug}`} className="underline">
                {artist.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
