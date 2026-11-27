"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";
import { btnPrimary, inputClass, labelClass } from "@/components/admin/formStyles";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loading: authLoading, authenticated } = useAuth({
    redirectIfAuthenticated: true,
  });
  const [email, setEmail] = useState("admin@tromagnon.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && authenticated) router.replace("/admin");
  }, [authLoading, authenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post("/admin/login", { email, password });
      if (res.data?.success && res.data?.data?.token) {
        localStorage.setItem("tromagnon_token", res.data.data.token);
        router.replace("/admin");
      } else {
        setError(res.data?.message || "Invalid credentials");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr.response?.data?.message ||
          "Could not reach the API. Make sure the backend is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-satelit-bg">
        <Loader2 size={20} className="animate-spin text-satelit-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-satelit-bg px-4 py-12 text-satelit-ink">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="relative h-12 w-12 shrink-0">
            <Image
              src="/assets/logo-tromagnon-nobg.png"
              alt="Tromagnon Records"
              fill
              sizes="48px"
              className="object-contain"
            />
          </span>
          <div>
            <h1 className="text-[28px] font-bold leading-none tracking-[-0.02em]">
              Sign in
            </h1>
            <p className="mt-1.5 text-[14px] text-satelit-muted">Tromagnon CMS</p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-satelit-danger/30 bg-satelit-danger/10 px-4 py-2.5 text-[14px] text-satelit-danger"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Signing in" : "Sign in"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 inline-block text-[14px] text-satelit-muted transition hover:text-satelit-accent"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
