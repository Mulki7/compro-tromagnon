import React from "react";
import { Header } from "@/components/public/Header";
import { HeroBanner } from "@/components/public/HeroBanner";
import { LatestReleasesSection } from "@/components/public/LatestReleasesSection";
import { MusicPlayerEmbed } from "@/components/public/MusicPlayerEmbed";
import { RosterDomeSection } from "@/components/public/RosterDomeSection";
import { ManifestoBanner } from "@/components/public/ManifestoBanner";
import { Footer } from "@/components/public/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A]">
      {/* Top Header Navigation */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1 pb-12">
        {/* Section 1 & 2: Welcome + Hero Showcase */}
        <HeroBanner />

        {/* Section 1: Latest Releases (3D Cover Flow Showcase) */}
        <LatestReleasesSection />

        {/* Section 3: Dark Vinyl Deck & Playlist (with Spotify/Bandcamp Embeds) */}
        <MusicPlayerEmbed />

        {/* Section: Artists Roster (3D Spherical Apple Watch Dome Gallery) */}
        <RosterDomeSection />

        {/* Section 4: Manifesto & Open Demos Callout */}
        <ManifestoBanner />
      </main>

      {/* Editorial 4-Column Footer */}
      <Footer />
    </div>
  );
}
