import { apiClient } from "../client";
import { ApiResponse, Artist, ArtistSocialLinks } from "@/types/models";
import { appendIfPresent, postFormData, putFormData } from "./helpers";

export interface ArtistFormPayload {
  name: string;
  slug: string;
  bio: string;
  genre: string[];
  social_links: ArtistSocialLinks;
  status: "active" | "inactive";
  photo?: File | null;
}

function buildArtistFormData(payload: ArtistFormPayload): FormData {
  const fd = new FormData();
  appendIfPresent(fd, "name", payload.name);
  appendIfPresent(fd, "slug", payload.slug);
  appendIfPresent(fd, "bio", payload.bio);
  appendIfPresent(fd, "status", payload.status);
  fd.append("genre", JSON.stringify(payload.genre ?? []));
  fd.append("social_links", JSON.stringify(payload.social_links ?? {}));
  if (payload.photo) {
    fd.append("photo", payload.photo);
  }
  return fd;
}

export async function getAdminArtists(): Promise<Artist[]> {
  const res = await apiClient.get<ApiResponse<Artist[]>>("/admin/artists");
  if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
  return [];
}

export async function getAdminArtist(id: string): Promise<Artist | null> {
  const res = await apiClient.get<ApiResponse<Artist>>(`/admin/artists/${id}`);
  if (res.data?.success && res.data.data) return res.data.data;
  return null;
}

export async function createArtist(
  payload: ArtistFormPayload
): Promise<ApiResponse<Artist>> {
  return postFormData<Artist>("/admin/artists", buildArtistFormData(payload));
}

export async function updateArtist(
  id: string,
  payload: ArtistFormPayload
): Promise<ApiResponse<Artist>> {
  return putFormData<Artist>(
    `/admin/artists/${id}`,
    buildArtistFormData(payload)
  );
}

export async function patchArtist(
  id: string,
  data: Partial<Pick<Artist, "status">>
): Promise<ApiResponse<Artist>> {
  const res = await apiClient.patch<ApiResponse<Artist>>(
    `/admin/artists/${id}`,
    data
  );
  return res.data;
}

export async function deleteArtist(id: string): Promise<void> {
  await apiClient.delete(`/admin/artists/${id}`);
}
