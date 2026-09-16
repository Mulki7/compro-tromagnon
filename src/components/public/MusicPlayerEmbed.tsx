"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, Music } from "lucide-react";

// ─── Real Tromagnon Records Releases ────────────────────────────────────────
// Source: https://tromagnonrecords.bandcamp.com/music
// Bandcamp embed format:
//   album → https://bandcamp.com/EmbeddedPlayer/album={ID}/size=large/...
//   track → https://bandcamp.com/EmbeddedPlayer/track={ID}/size=large/...
// ─────────────────────────────────────────────────────────────────────────────

interface BandcampRelease {
  id: string;
  type: "album" | "track";
  bcId: number;
  title: string;
  artist: string;
  artwork: string; // f4.bcbits.com image
  pageUrl: string; // path on tromagnonrecords.bandcamp.com
}

const TROMAGNON_RELEASES: BandcampRelease[] = [
  {
    id: "1",
    type: "album",
    bcId: 2195294392,
    title: "Pressure",
    artist: "Pineline",
    artwork: "https://f4.bcbits.com/img/a3927116639_2.jpg",
    pageUrl: "/album/pressure",
  },
  {
    id: "2",
    type: "album",
    bcId: 370145199,
    title: "Elusive Things",
    artist: "Georgia Querer",
    artwork: "https://f4.bcbits.com/img/a1544934823_2.jpg",
    pageUrl: "/album/elusive-things",
  },
  {
    id: "3",
    type: "album",
    bcId: 1921573022,
    title: "Karet",
    artist: "Swellow",
    artwork: "https://f4.bcbits.com/img/a2169479640_2.jpg",
    pageUrl: "/album/karet",
  },
  {
    id: "4",
    type: "album",
    bcId: 2360440041,
    title: "Bayang",
    artist: "Rrag",
    artwork: "https://f4.bcbits.com/img/a2129205594_2.jpg",
    pageUrl: "/album/bayang",
  },
  {
    id: "5",
    type: "album",
    bcId: 1365893113,
    title: "She's || 20's || Greedy Hands",
    artist: "ACV",
    artwork: "https://f4.bcbits.com/img/a1569549033_2.jpg",
    pageUrl: "/album/shes-20s-greedy-hands",
  },
  {
    id: "6",
    type: "album",
    bcId: 3122334990,
    title: "Kumpulan Tembang Dadakan #1",
    artist: "Various",
    artwork: "https://f4.bcbits.com/img/a4133985718_2.jpg",
    pageUrl: "/album/kumpulan-tembang-dadakan-1",
  },
  {
    id: "7",
    type: "track",
    bcId: 3849753697,
    title: "Karam",
    artist: "The Basement Dry",
    artwork: "https://f4.bcbits.com/img/a2686098887_2.jpg",
    pageUrl: "/track/karam",
  },
  {
    id: "8",
    type: "track",
    bcId: 3988966688,
    title: "Something in Between",
    artist: "Georgia Querer",
    artwork: "https://f4.bcbits.com/img/a2786247868_2.jpg",
    pageUrl: "/track/something-in-between",
  },
  {
    id: "9",
    type: "album",
    bcId: 1699898558,
    title: "Kangaroo / Low",
    artist: "Buff",
    artwork: "https://f4.bcbits.com/img/a1577494262_2.jpg",
    pageUrl: "/album/kangaroo-low",
  },
  {
    id: "10",
    type: "track",
    bcId: 852858302,
    title: "Bahkan Bayanganku Pun Pergi",
    artist: "Pastula",
    artwork: "https://f4.bcbits.com/img/a2871460731_2.jpg",
    pageUrl: "/track/bahkan-bayanganku-pun-pergi",
  },
  {
    id: "11",
    type: "album",
    bcId: 3358590184,
    title: "Tight! Tight! Tight!",
    artist: "Tight! Tight! Tight!",
    artwork: "https://f4.bcbits.com/img/a2404356895_2.jpg",
    pageUrl: "/album/tight-tight-tight",
  },
  {
    id: "12",
    type: "album",
    bcId: 3684359921,
    title: "Both sides",
    artist: "Telly Blue",
    artwork: "https://f4.bcbits.com/img/a0323710220_2.jpg",
    pageUrl: "/album/both-sides-hi-heels-stumble-friday-holy-inhaler",
  },
];

function getBandcampEmbedUrl(release: BandcampRelease): string {
  const base = "https://bandcamp.com/EmbeddedPlayer";
  const params =
    "size=large/bgcol=111111/linkcol=ffffff/tracklist=false/transparent=true/";

  if (release.type === "album") {
    return `${base}/album=${release.bcId}/${params}`;
  } else {
    return `${base}/track=${release.bcId}/${params}`;
  }
}

export function MusicPlayerEmbed() {
  const [selectedId, setSelectedId] = useState<string>(TROMAGNON_RELEASES[0].id);

  const selectedRelease =
    TROMAGNON_RELEASES.find((r) => r.id === selectedId) ?? TROMAGNON_RELEASES[0];

  const embedUrl = getBandcampEmbedUrl(selectedRelease);
  const bandcampPageUrl = `https://tromagnonrecords.bandcamp.com${selectedRelease.pageUrl}`;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-12">
      {/* Section Header */}
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
            Now Streaming
          </span>
          <h2 className="text-lg font-bold tracking-tight text-[#0A0A0A] mt-0.5">
            Tromagnon Records on Bandcamp
          </h2>
        </div>
        <a
          href="https://tromagnonrecords.bandcamp.com/music"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
        >
          <ExternalLink size={12} />
          View all releases
        </a>
      </div>

      {/* Main Dark Card */}
      <div className="bg-[#111111] text-white overflow-hidden border border-neutral-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* Left: Track List */}
          <div className="lg:col-span-5 flex flex-col border-b lg:border-b-0 lg:border-r border-neutral-800">
            {/* Playlist Header */}
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center gap-2">
              <Music size={13} className="text-neutral-500" />
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                Releases
              </span>
            </div>

            {/* Track List – scrollable */}
            <div className="overflow-y-auto flex-1 divide-y divide-neutral-900/80">
              {TROMAGNON_RELEASES.map((release) => {
                const isSelected = release.id === selectedId;

                return (
                  <button
                    key={release.id}
                    onClick={() => setSelectedId(release.id)}
                    className={`w-full px-5 py-3.5 flex items-center gap-3.5 text-left transition-colors group ${
                      isSelected
                        ? "bg-[#1a1a1a]"
                        : "hover:bg-neutral-900/60"
                    }`}
                  >
                    {/* Artwork Thumbnail */}
                    <div
                      className={`relative w-11 h-11 overflow-hidden flex-shrink-0 border ${
                        isSelected ? "border-white/20" : "border-neutral-800"
                      }`}
                    >
                      <Image
                        src={release.artwork}
                        alt={release.title}
                        fill
                        sizes="44px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold truncate ${
                          isSelected ? "text-white" : "text-neutral-300 group-hover:text-white"
                        }`}
                      >
                        {release.title}
                      </p>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">
                        {release.artist} ·{" "}
                        <span className="capitalize">{release.type}</span>
                      </p>
                    </div>

                    {/* Active indicator */}
                    <div className="flex-shrink-0">
                      {isSelected ? (
                        <div className="w-2 h-2 rounded-full bg-[#D93829]" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-neutral-700/60" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Bandcamp Embed Player */}
          <div className="lg:col-span-7 flex flex-col bg-[#111111]">
            {/* Now Playing Header */}
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                  Now Playing
                </span>
                <p className="text-sm font-semibold text-white truncate mt-0.5">
                  {selectedRelease.title}{" "}
                  <span className="font-normal text-neutral-400">
                    — {selectedRelease.artist}
                  </span>
                </p>
              </div>
              <a
                href={bandcampPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 flex-shrink-0 flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-400 px-3 py-1.5 rounded transition-all"
              >
                <ExternalLink size={10} />
                BANDCAMP
              </a>
            </div>

            {/* Bandcamp iFrame Embed */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 relative min-h-[400px]">
                <iframe
                  key={selectedRelease.id}
                  src={embedUrl}
                  seamless
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay"
                  title={`${selectedRelease.title} by ${selectedRelease.artist} on Bandcamp`}
                />
              </div>

              {/* Footer Strip */}
              <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Bandcamp Logo Mark */}
                  <svg
                    viewBox="0 0 14 14"
                    width="18"
                    height="18"
                    className="text-[#1DA0C3]"
                    fill="currentColor"
                  >
                    <path d="M0 10l5.5-10h8.5L8.5 10z" />
                  </svg>
                  <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                    Powered by Bandcamp
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {TROMAGNON_RELEASES.slice(0, 6).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      title={r.title}
                      className={`w-1.5 h-1.5 transition-all ${
                        r.id === selectedId ? "bg-[#D93829] w-4" : "bg-neutral-700 hover:bg-neutral-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
