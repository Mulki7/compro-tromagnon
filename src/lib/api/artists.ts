import { apiClient } from "./client";
import { ApiResponse, Artist } from "@/types/models";

export async function getArtists(): Promise<Artist[]> {
  try {
    const res = await apiClient.get<ApiResponse<Artist[]>>("/artists");
    if (res.data?.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.warn("Could not fetch artists from API, returning empty list:", error);
    return [];
  }
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  try {
    const res = await apiClient.get<ApiResponse<Artist>>(`/artists/${slug}`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.warn(`Could not fetch artist with slug ${slug}:`, error);
    return null;
  }
}
