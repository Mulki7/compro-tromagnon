"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-[#F5F5F7] border-t border-neutral-200/80 mt-20 pt-16 pb-12 text-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Newsletter (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-extrabold tracking-tight text-lg text-black">
                TROMAGNON RECORDS
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase border border-neutral-400 px-2 py-0.5 text-neutral-700">
                CAT. ARCHIVE
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md font-mono">
              Independent record imprint established in 2018. Archiving post-punk, modular ambient, avant-jazz, and mechanical minimalism pressed on high-fidelity wax.
            </p>

            {/* Newsletter Bulletin Form */}
            <div className="space-y-2 pt-2">
              <label
                htmlFor="newsletter-email"
                className="block text-[11px] font-mono tracking-widest uppercase text-neutral-600 font-semibold"
              >
                NEWSLETTER BULLETIN
              </label>

              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="archive@tromagnon.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white border border-neutral-300 px-3.5 py-2.5 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black font-mono"
                />
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white text-xs font-mono tracking-wider font-semibold uppercase px-5 py-2.5 transition shrink-0"
                >
                  {subscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-emerald-600 font-mono flex items-center gap-1 mt-1">
                  <Check size={12} /> Thank you for subscribing to our bulletin archive.
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Navigation (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono tracking-widest uppercase text-neutral-500 font-semibold">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-800">
              <li>
                <Link href="/releases" className="hover:text-black hover:underline transition">
                  Releases
                </Link>
              </li>
              <li>
                <Link href="/artists" className="hover:text-black hover:underline transition">
                  Artists
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-black hover:underline transition">
                  News & Journal
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-black hover:underline transition">
                  Tour Dates
                </Link>
              </li>
              <li>
                <button
                  onClick={() => alert("Vinyl & Tape shop coming soon.")}
                  className="hover:text-black hover:underline transition text-left"
                >
                  Vinyl & Tape Shop
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Network (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono tracking-widest uppercase text-neutral-500 font-semibold">
              NETWORK
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-800">
              <li>
                <a
                  href="https://bandcamp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black hover:underline transition"
                >
                  Bandcamp
                </a>
              </li>
              <li>
                <a
                  href="https://spotify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black hover:underline transition"
                >
                  Spotify Hub
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black hover:underline transition"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black hover:underline transition"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://soundcloud.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black hover:underline transition"
                >
                  SoundCloud
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Imprint & Office (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono tracking-widest uppercase text-neutral-500 font-semibold">
              IMPRINT & OFFICE
            </h4>
            <div className="space-y-1.5 text-xs font-mono text-neutral-700 leading-relaxed">
              <p className="font-semibold text-black">Tromagnon Sound Systems</p>
              <p>Jl. Pajajaran Indah V No. 12</p>
              <p>16143 Bogor, Indonesia</p>
              <p className="pt-2">
                Demos:{" "}
                <a
                  href="mailto:demos@tromagnon.com"
                  className="text-black underline hover:text-neutral-600"
                >
                  demos@tromagnon.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="border-t border-neutral-300/70 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <p>© 2018-2026 Tromagnon Records. All rights reserved. Physical audio preservation.</p>
          <p className="text-neutral-400">Bogor · Jakarta · Vienna · Tokyo</p>
        </div>
      </div>
    </footer>
  );
}
