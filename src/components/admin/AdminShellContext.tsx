"use client";

import { createContext, useContext } from "react";
import type { AdminUser } from "@/hooks/useAuth";

export interface AdminNavCounts {
  releases: number;
  publishedReleases: number;
  draftReleases: number;
  artists: number;
  activeArtists: number;
  news: number;
  publishedNews: number;
  upcomingLive: number;
  totalLive: number;
  activeHero: number;
  totalHero: number;
}

export interface AdminAttentionItem {
  key: string;
  label: string;
  detail: string;
  href: string;
  cta: string;
  severity: "warning" | "info";
}

export interface AdminSearchEntry {
  id: string;
  type: "Release" | "Artist" | "News" | "Live" | "Banner";
  title: string;
  subtitle: string;
  href: string;
}

export interface AdminShellContextValue {
  onMenuClick: () => void;
  user: AdminUser | null;
  counts: AdminNavCounts;
  attention: AdminAttentionItem[];
  searchEntries: AdminSearchEntry[];
  refreshShellData: () => void;
}

const DEFAULT_COUNTS: AdminNavCounts = {
  releases: 0,
  publishedReleases: 0,
  draftReleases: 0,
  artists: 0,
  activeArtists: 0,
  news: 0,
  publishedNews: 0,
  upcomingLive: 0,
  totalLive: 0,
  activeHero: 0,
  totalHero: 0,
};

export const AdminShellContext = createContext<AdminShellContextValue>({
  onMenuClick: () => {},
  user: null,
  counts: DEFAULT_COUNTS,
  attention: [],
  searchEntries: [],
  refreshShellData: () => {},
});

export function useAdminShell() {
  return useContext(AdminShellContext);
}
