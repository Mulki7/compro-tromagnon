import { apiClient } from "../client";
import { ApiResponse, LiveEvent } from "@/types/models";

export interface LiveFormPayload {
  artist_id?: string;
  event_date: string;
  city: string;
  venue: string;
  country: string;
  ticket_url: string;
  status: "upcoming" | "past" | "cancelled";
}

export async function getAdminLiveEvents(): Promise<LiveEvent[]> {
  const res = await apiClient.get<ApiResponse<LiveEvent[]>>("/admin/live");
  if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
  return [];
}

export async function getAdminLiveEvent(id: string): Promise<LiveEvent | null> {
  const res = await apiClient.get<ApiResponse<LiveEvent>>(`/admin/live/${id}`);
  if (res.data?.success && res.data.data) return res.data.data;
  return null;
}

export async function createLiveEvent(
  payload: LiveFormPayload
): Promise<ApiResponse<LiveEvent>> {
  const res = await apiClient.post<ApiResponse<LiveEvent>>(
    "/admin/live",
    payload
  );
  return res.data;
}

export async function updateLiveEvent(
  id: string,
  payload: LiveFormPayload
): Promise<ApiResponse<LiveEvent>> {
  const res = await apiClient.put<ApiResponse<LiveEvent>>(
    `/admin/live/${id}`,
    payload
  );
  return res.data;
}

export async function deleteLiveEvent(id: string): Promise<void> {
  await apiClient.delete(`/admin/live/${id}`);
}
