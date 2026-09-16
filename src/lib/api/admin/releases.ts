import { apiClient } from "../client";
import { ApiResponse, Release, ReleaseStreamingLinks } from "@/types/models";
import { appendIfPresent, postFormData, putFormData } from "./helpers";

export interface ReleaseFormPayload {
  artist_id: string;
  title: string;
  slug: string;
  release_year: number;
  format: string[];
  description: string;
  streaming_links: ReleaseStreamingLinks;
  status: "published" | "draft";
  artwork?: File | null;
}

function buildReleaseFormData(payload: ReleaseFormPayload): FormData {
  const fd = new FormData();
  appendIfPresent(fd, "artist_id", payload.artist_id);
  appendIfPresent(fd, "title", payload.title);
  appendIfPresent(fd, "slug", payload.slug);
  appendIfPresent(fd, "release_year", payload.release_year);
  appendIfPresent(fd, "description", payload.description);
  appendIfPresent(fd, "status", payload.status);
  fd.append("format", JSON.stringify(payload.format ?? []));
  fd.append("streaming_links", JSON.stringify(payload.streaming_links ?? {}));
  if (payload.artwork) {
    fd.append("artwork", payload.artwork);
  }
  return fd;
}

export async function getAdminReleases(): Promise<Release[]> {
  const res = await apiClient.get<ApiResponse<Release[]>>("/admin/releases");
  if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
  return [];
}

export async function getAdminRelease(id: string): Promise<Release | null> {
  const res = await apiClient.get<ApiResponse<Release>>(
    `/admin/releases/${id}`
  );
  if (res.data?.success && res.data.data) return res.data.data;
  return null;
}

export async function createRelease(
  payload: ReleaseFormPayload
): Promise<ApiResponse<Release>> {
  return postFormData<Release>(
    "/admin/releases",
    buildReleaseFormData(payload)
  );
}

export async function updateRelease(
  id: string,
  payload: ReleaseFormPayload
): Promise<ApiResponse<Release>> {
  return putFormData<Release>(
    `/admin/releases/${id}`,
    buildReleaseFormData(payload)
  );
}

export async function deleteRelease(id: string): Promise<void> {
  await apiClient.delete(`/admin/releases/${id}`);
}
