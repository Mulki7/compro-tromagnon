import React from "react";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { getNews } from "@/lib/api/news";
import { formatDate } from "@/lib/utils";

export default async function NewsPage() {
  const newsList = await getNews();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        <h1 className="text-2xl font-bold mb-4">News (Raw)</h1>
        {newsList.length === 0 ? (
          <p className="text-sm text-neutral-500">No news articles found.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {newsList.map((item) => (
              <li key={item.id} className="border-b border-neutral-200 pb-2">
                <Link href={`/news/${item.slug}`} className="underline font-medium">
                  {item.title}
                </Link>{" "}
                ({formatDate(item.published_at || item.created_at)})
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
