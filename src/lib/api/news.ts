import { apiClient } from "./client";
import { ApiResponse, News } from "@/types/models";

export async function getNews(): Promise<News[]> {
  try {
    const res = await apiClient.get<ApiResponse<News[]>>("/news");
    if (res.data?.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.warn("Could not fetch news from API, returning empty list:", error);
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  try {
    const res = await apiClient.get<ApiResponse<News>>(`/news/${slug}`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.warn(`Could not fetch news article with slug ${slug}:`, error);
    return null;
  }
}
