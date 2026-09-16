import { apiClient } from "./client";
import { ApiResponse, Release } from "@/types/models";

export async function getReleases(): Promise<Release[]> {
  try {
    const res = await apiClient.get<ApiResponse<Release[]>>("/releases");
    if (res.data?.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.warn("Could not fetch releases from API, returning empty list:", error);
    return [];
  }
}

export async function getReleaseBySlug(slug: string): Promise<Release | null> {
  try {
    const res = await apiClient.get<ApiResponse<Release>>(`/releases/${slug}`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.warn(`Could not fetch release with slug ${slug}:`, error);
    return null;
  }
}
