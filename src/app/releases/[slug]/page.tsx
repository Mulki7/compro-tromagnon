import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { getReleaseBySlug } from "@/lib/api/releases";

interface ReleaseDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ReleaseDetailPage({ params }: ReleaseDetailPageProps) {
  const release = await getReleaseBySlug(params.slug);

  if (!release) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 space-y-4">
        <Link href="/releases" className="text-sm underline">
          Back to releases
        </Link>
        <h1 className="text-2xl font-bold">{release.title}</h1>
        <p className="text-sm text-neutral-600">
          Artist: {release.artist?.name || "Unknown"} | Year: {release.release_year}
        </p>
        <p className="text-sm">{release.description}</p>
      </main>
      <Footer />
    </div>
  );
}
