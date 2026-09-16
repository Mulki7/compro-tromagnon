import { apiClient } from "./client";
import { ApiResponse, LiveEvent } from "@/types/models";

export async function getLiveEvents(): Promise<LiveEvent[]> {
  try {
    const res = await apiClient.get<ApiResponse<LiveEvent[]>>("/live");
    if (res.data?.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.warn("Could not fetch live events from API, returning empty list:", error);
    return [];
  }
}
