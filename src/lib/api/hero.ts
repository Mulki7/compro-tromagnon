import { apiClient } from "./client";
import { ApiResponse, HeroBanner } from "@/types/models";

export async function getHeroBanners(): Promise<HeroBanner[]> {
  try {
    const res = await apiClient.get<ApiResponse<HeroBanner[]>>("/hero-banners");
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.warn("Could not fetch hero banners from API, using fallback:", error);
    return [];
  }
}
