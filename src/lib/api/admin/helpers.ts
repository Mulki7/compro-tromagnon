import { AxiosRequestConfig } from "axios";
import { apiClient } from "../client";
import { ApiResponse } from "@/types/models";

/** Send multipart FormData without forcing Content-Type (browser sets boundary). */
export async function postFormData<T>(
  url: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  const config: AxiosRequestConfig = {
    headers: { "Content-Type": undefined },
  };
  // Ensure axios does not keep the default application/json Content-Type
  const res = await apiClient.post<ApiResponse<T>>(url, formData, {
    ...config,
    transformRequest: [
      (data, headers) => {
        if (headers && typeof headers === "object") {
          delete (headers as Record<string, unknown>)["Content-Type"];
        }
        return data;
      },
    ],
  });
  return res.data;
}

export async function putFormData<T>(
  url: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  const res = await apiClient.put<ApiResponse<T>>(url, formData, {
    transformRequest: [
      (data, headers) => {
        if (headers && typeof headers === "object") {
          delete (headers as Record<string, unknown>)["Content-Type"];
        }
        return data;
      },
    ],
  });
  return res.data;
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await postFormData<{ url: string }>("/admin/upload", formData);
  if (!res.success || !res.data?.url) {
    throw new Error(res.message || "Upload failed");
  }
  return res.data.url;
}

export function appendIfPresent(
  formData: FormData,
  key: string,
  value: string | number | boolean | null | undefined
) {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, String(value));
}
