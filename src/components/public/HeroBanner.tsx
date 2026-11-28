"use client";

import React, { useEffect, useState } from "react";
import { HeroBanner as HeroBannerType } from "@/types/models";
import { getHeroBanners } from "@/lib/api/hero";

export function HeroBanner() {
  const [banners, setBanners] = useState<HeroBannerType[]>([]);

  useEffect(() => {
    getHeroBanners()
      .then((data) => {
        if (Array.isArray(data)) setBanners(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-8 border-b border-neutral-200">
      <h1 className="text-2xl font-bold">Hero Section (Raw)</h1>
      {banners.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {banners.map((b) => (
            <li key={b.id}>
              <strong>{b.title}</strong> {b.subtitle ? `- ${b.subtitle}` : ""}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
