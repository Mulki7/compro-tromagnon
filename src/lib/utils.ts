import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMediaUrl(path?: string | null): string {
  if (!path) return "/assets/placeholder-cover.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const serverOrigin = process.env.NEXT_PUBLIC_SERVER_ORIGIN || "http://localhost:8080";
  return `${serverOrigin}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatGenre(genre?: string | string[] | null): string {
  if (!genre) return "Independent / Alternative";
  if (Array.isArray(genre)) {
    return genre
      .map((g) => g.replace(/^\[|\]$/g, "").replace(/"/g, "").trim())
      .filter(Boolean)
      .join(" · ");
  }
  if (typeof genre === "string") {
    if (genre.startsWith("[") && genre.endsWith("]")) {
      return genre
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .filter(Boolean)
        .join(" · ");
    }
    return genre;
  }
  return "Independent / Alternative";
}
