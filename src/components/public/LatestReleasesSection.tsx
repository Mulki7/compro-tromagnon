"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Release } from "@/types/models";
import { getReleases } from "@/lib/api/releases";

export function LatestReleasesSection() {
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    getReleases()
      .then((data) => {
        if (Array.isArray(data)) setReleases(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-8 border-b border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Releases (Raw)</h2>
        <Link href="/releases" className="text-sm underline">
          View all
        </Link>
      </div>
      {releases.length === 0 ? (
        <p className="text-sm text-neutral-500">No releases loaded.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {releases.map((rel) => (
            <li key={rel.id}>
              <Link href={`/releases/${rel.slug}`} className="underline">
                {rel.title}
              </Link>{" "}
              ({rel.release_year})
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
