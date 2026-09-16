import { apiClient } from "../client";
import { ApiResponse, HeroBanner } from "@/types/models";
import { appendIfPresent, postFormData, putFormData } from "./helpers";

export interface HeroFormPayload {
  title: string;
  subtitle?: string;
  cta_text?: string;
  cta_link?: string;
  order: number;
  is_active: boolean;
  banner_image?: File | null;
}

function buildHeroFormData(payload: HeroFormPayload): FormData {
  const fd = new FormData();
  appendIfPresent(fd, "title", payload.title);
  appendIfPresent(fd, "subtitle", payload.subtitle);
  appendIfPresent(fd, "cta_text", payload.cta_text);
  appendIfPresent(fd, "cta_link", payload.cta_link);
  appendIfPresent(fd, "order", payload.order);
  fd.append("is_active", String(payload.is_active));
  if (payload.banner_image) {
    fd.append("banner_image", payload.banner_image);
  }
  return fd;
}

export async function getAdminHeroBanners(): Promise<HeroBanner[]> {
  const res = await apiClient.get<ApiResponse<HeroBanner[]>>(
    "/admin/hero-banners"
  );
  if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
  return [];
}

export async function getAdminHeroBanner(
  id: string
): Promise<HeroBanner | null> {
  const res = await apiClient.get<ApiResponse<HeroBanner>>(
    `/admin/hero-banners/${id}`
  );
  if (res.data?.success && res.data.data) return res.data.data;
  return null;
}

export async function createHeroBanner(
  payload: HeroFormPayload
): Promise<ApiResponse<HeroBanner>> {
  return postFormData<HeroBanner>(
    "/admin/hero-banners",
    buildHeroFormData(payload)
  );
}

export async function updateHeroBanner(
  id: string,
  payload: HeroFormPayload
): Promise<ApiResponse<HeroBanner>> {
  return putFormData<HeroBanner>(
    `/admin/hero-banners/${id}`,
    buildHeroFormData(payload)
  );
}

export async function deleteHeroBanner(id: string): Promise<void> {
  await apiClient.delete(`/admin/hero-banners/${id}`);
}
