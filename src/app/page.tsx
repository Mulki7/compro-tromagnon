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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        <HeroBanner />
        <LatestReleasesSection />
        <MusicPlayerEmbed />
        <RosterDomeSection />
        <ManifestoBanner />
      </main>
      <Footer />
    </div>
  );
}
