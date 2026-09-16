"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
}

interface UseAuthOptions {
  /** When true, redirects to login if unauthenticated */
  requireAuth?: boolean;
  /** When true (login page), redirects to /admin if already authenticated */
  redirectIfAuthenticated?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { requireAuth = false, redirectIfAuthenticated = false } = options;
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("tromagnon_token");
    setUser(null);
    setAuthenticated(false);
    router.replace("/admin/login");
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("tromagnon_token")
          : null;

      if (!token) {
        if (!cancelled) {
          setUser(null);
          setAuthenticated(false);
          setLoading(false);
        }
        if (requireAuth) {
          router.replace("/admin/login");
        }
        return;
      }

      try {
        const res = await apiClient.get("/admin/me");
        if (cancelled) return;

        if (res.data?.success && res.data?.data) {
          setUser(res.data.data as AdminUser);
          setAuthenticated(true);
          if (redirectIfAuthenticated) {
            router.replace("/admin");
          }
        } else {
          localStorage.removeItem("tromagnon_token");
          setUser(null);
          setAuthenticated(false);
          if (requireAuth) {
            router.replace("/admin/login");
          }
        }
      } catch {
        if (cancelled) return;
        localStorage.removeItem("tromagnon_token");
        setUser(null);
        setAuthenticated(false);
        if (requireAuth) {
          router.replace("/admin/login");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [requireAuth, redirectIfAuthenticated, router]);

  return { user, loading, authenticated, logout };
}
