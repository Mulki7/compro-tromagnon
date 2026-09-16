import { apiClient } from "../client";
import { ApiResponse, News } from "@/types/models";
import { appendIfPresent, postFormData, putFormData } from "./helpers";

export interface NewsFormPayload {
  title: string;
  slug: string;
  content: string;
  author?: string;
  related_artist_id?: string | null;
  related_release_id?: string | null;
  status: "draft" | "published";
  cover?: File | null;
}

function buildNewsFormData(payload: NewsFormPayload): FormData {
  const fd = new FormData();
  appendIfPresent(fd, "title", payload.title);
  appendIfPresent(fd, "slug", payload.slug);
  appendIfPresent(fd, "content", payload.content);
  appendIfPresent(fd, "author", payload.author);
  appendIfPresent(fd, "status", payload.status);
  if (payload.related_artist_id) {
    fd.append("related_artist_id", payload.related_artist_id);
  } else {
    fd.append("related_artist_id", "");
  }
  if (payload.related_release_id) {
    fd.append("related_release_id", payload.related_release_id);
  } else {
    fd.append("related_release_id", "");
  }
  if (payload.cover) {
    fd.append("cover", payload.cover);
  }
  return fd;
}

export async function getAdminNews(): Promise<News[]> {
  const res = await apiClient.get<ApiResponse<News[]>>("/admin/news");
  if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
  return [];
}

export async function getAdminNewsItem(id: string): Promise<News | null> {
  const res = await apiClient.get<ApiResponse<News>>(`/admin/news/${id}`);
  if (res.data?.success && res.data.data) return res.data.data;
  return null;
}

export async function createNews(
  payload: NewsFormPayload
): Promise<ApiResponse<News>> {
  return postFormData<News>("/admin/news", buildNewsFormData(payload));
}

export async function updateNews(
  id: string,
  payload: NewsFormPayload
): Promise<ApiResponse<News>> {
  return putFormData<News>(`/admin/news/${id}`, buildNewsFormData(payload));
}

export async function deleteNews(id: string): Promise<void> {
  await apiClient.delete(`/admin/news/${id}`);
}
