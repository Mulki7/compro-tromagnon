import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { getNewsBySlug } from "@/lib/api/news";
import { formatDate } from "@/lib/utils";

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const article = await getNewsBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 space-y-4">
        <Link href="/news" className="text-sm underline">
          Back to news
        </Link>
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <p className="text-sm text-neutral-600">
          {formatDate(article.published_at || article.created_at)} | {article.author || "Editorial"}
        </p>
        <div className="text-sm whitespace-pre-wrap">{article.content}</div>
      </main>
      <Footer />
    </div>
  );
}
