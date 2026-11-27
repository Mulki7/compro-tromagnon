"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { getLiveEvents } from "@/lib/api/live";
import { LiveEvent } from "@/types/models";

export default function LivePage() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveEvents()
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        <h1 className="text-2xl font-bold mb-4">Live Events (Raw)</h1>
        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-neutral-500">No live events found.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {events.map((ev) => (
              <li key={ev.id} className="border-b border-neutral-200 pb-2">
                <strong>{ev.artist?.name || "Artist"}</strong> - {ev.venue}, {ev.city} ({ev.event_date})
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
