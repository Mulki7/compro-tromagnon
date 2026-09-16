"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroBanner as HeroBannerType } from "@/types/models";
import { getHeroBanners } from "@/lib/api/hero";
import { getMediaUrl } from "@/lib/utils";

export function HeroBanner() {
  const [banners, setBanners] = useState<HeroBannerType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadBanners() {
      try {
        const data = await getHeroBanners();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setBanners(data);
        }
      } catch (err) {
        console.error("Failed to load hero banners from API:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-advance banner every 6 seconds if multiple
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] bg-neutral-900 animate-pulse" />
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
            Welcome to Tromagnon Records
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 font-normal">
            We are an independent record label and music publisher based in Bogor, Indonesia.
          </p>
        </div>
      </section>
    );
  }

  const current = banners[currentIndex];
  const imageUrl = current.image_url && current.image_url.trim() !== ""
    ? getMediaUrl(current.image_url)
    : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=85";

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === 1 ? banners.length - 1 : prev - 1));
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-6">
      {/* Welcome Headline */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
          Welcome to Tromagnon Records
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 mt-2 font-normal">
          We are an independent record label and music publisher based in Bogor, Indonesia.
        </p>
      </div>

      {/* Hero Showcase Container */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden shadow-sm bg-neutral-950 group">
        {/* Background Image */}
        <Image
          src={imageUrl}
          alt={current.title}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Text Overlay */}
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 max-w-3xl pr-4">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none drop-shadow-md">
            {current.title}
          </h2>
          {current.subtitle && (
            <p className="text-white/80 text-sm sm:text-lg mt-2 font-medium tracking-wide">
              {current.subtitle}
            </p>
          )}

          {current.cta_link && current.cta_text && (
            <div className="mt-4">
              <Link
                href={current.cta_link}
                className="inline-block bg-white text-black hover:bg-neutral-200 text-xs sm:text-sm font-semibold tracking-wider uppercase px-5 py-2 rounded-full transition shadow-md"
              >
                {current.cta_text}
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Arrows if more than 1 banner */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous Banner"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
              aria-label="Next Banner"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <ChevronRight size={20} />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 right-6 flex items-center gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-6 bg-white" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
