import React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import Image from "next/image";
import { getNews } from "@/lib/api/news";
import { getMediaUrl, formatDate } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export default async function NewsPage() {
  const newsList = await getNews();

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="border-b border-neutral-200 pb-6 mb-10">
          <span className="text-xs font-mono tracking-widest text-[#D93829] uppercase font-bold">
            JOURNAL & DISPATCHES
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-1 text-black">
            News & Editorial
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base mt-2 max-w-xl">
            Label announcements, liner note essays, and tour dispatches from the Tromagnon archive.
          </p>
        </div>

        {/* Empty State */}
        {newsList.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-neutral-200">
            <p className="text-sm font-mono text-neutral-500">
              No news articles published yet. Publish articles via CMS Admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsList.map((item) => {
              const cover =
                item.cover_image_url && item.cover_image_url.trim() !== ""
                  ? getMediaUrl(item.cover_image_url)
                  : "/assets/placeholder-cover.jpg";

              return (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group flex flex-col bg-neutral-50 overflow-hidden border border-neutral-200 hover:border-black transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] w-full bg-neutral-900 overflow-hidden">
                    <Image
                      src={cover}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 mb-2">
                        <span className="text-[#D93829] font-semibold">
                          {formatDate(item.published_at || item.created_at)}
                        </span>
                        <span>•</span>
                        <span>{item.author || "Editorial"}</span>
                      </div>

                      <h2 className="text-2xl font-bold text-black group-hover:underline">
                        {item.title}
                      </h2>

                      <p className="text-sm text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
                        {item.content}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-neutral-200/70 flex items-center justify-between text-xs font-mono text-neutral-500">
                      <span>READ DISPATCH</span>
                      <span className="text-black font-semibold">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
