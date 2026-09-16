import React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/api/news";
import { getMediaUrl, formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const cover =
    article.cover_image_url && article.cover_image_url.trim() !== ""
      ? getMediaUrl(article.cover_image_url)
      : "/assets/placeholder-cover.jpg";

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-6 w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-black transition"
          >
            <ArrowLeft size={14} />
            <span>BACK TO ALL DISPATCHES</span>
          </Link>
        </div>

        {/* Article Meta */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
            <span className="text-[#D93829] font-bold uppercase">
              {formatDate(article.published_at || article.created_at)}
            </span>
            <span>•</span>
            <span>By {article.author || "Editorial"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-black leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Cover Photo */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-xl bg-black mb-10">
          <Image
            src={cover}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <article className="prose prose-neutral max-w-none text-base sm:text-lg leading-relaxed text-neutral-800 space-y-6">
          {article.content.split("\n\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </article>
      </main>

      <Footer />
    </div>
  );
}
