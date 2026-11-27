"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Disc3, Eye, EyeOff, Loader2, Radio } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";
import { btnPrimaryPill, inputClass, labelClass } from "@/components/admin/formStyles";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loading: authLoading, authenticated } = useAuth({
    redirectIfAuthenticated: true,
  });
  const [email, setEmail] = useState("admin@tromagnon.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="font-admin flex min-h-dvh items-center justify-center bg-admin-canvas">
        <Loader2 size={22} className="animate-spin text-admin-forest" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="font-admin flex min-h-dvh items-center justify-center bg-admin-canvas px-4 py-10 text-admin-ink selection:bg-admin-lime selection:text-admin-forest">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[30px] border border-admin-border/80 bg-white shadow-admin-float md:grid-cols-12">
        {/* Left Forest Brand Panel */}
        <div className="relative flex flex-col justify-between bg-admin-forest p-7 text-white md:col-span-5 md:p-9">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-admin-lime p-1.5">
              <Image
                src="/assets/logo-tromagnon-nobg.png"
                alt="Tromagnon Records"
                width={28}
                height={28}
                className="object-contain"
              />
            </span>
            <span className="flex items-center gap-1.5 text-[20px] font-bold tracking-[-0.03em]">
              tromagnon
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-admin-lime" />
            </span>
          </div>

          <div className="my-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-admin-forest-soft px-3 py-1 text-[12px] font-semibold text-admin-lime">
              <Radio size={13} aria-hidden="true" />
              Record Label Console
            </span>
            <h1 className="text-[28px] font-bold leading-[1.12] tracking-[-0.03em]">
              Manage releases, roster, and live archives.
            </h1>
            <p className="text-[13.5px] leading-relaxed text-[#B2D0BC]">
              Centralized catalog control for Tromagnon Records pressings, artist
              profiles, dispatches, and tour schedules.
            </p>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl bg-admin-forest-soft/80 p-3.5 text-[12.5px] text-[#CBE2D3]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-admin-lime text-admin-forest">
              <Disc3 size={17} aria-hidden="true" />
            </span>
            <span>Satelit Archive & Independent Audio Catalog</span>
          </div>
        </div>

        {/* Right Sign-In Form */}
        <div className="flex flex-col justify-center p-7 sm:p-10 md:col-span-7">
          <div>
            <p className="text-[12.5px] font-semibold text-admin-sub">
              Admin authentication
            </p>
            <h2 className="mt-1 text-[28px] font-bold tracking-[-0.03em] text-admin-ink">
              Sign in to Tromagnon
            </h2>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-2xl border border-admin-danger/25 bg-admin-danger-soft px-4 py-3 text-[13.5px] font-medium text-admin-danger"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-admin-sub transition hover:bg-admin-muted hover:text-admin-ink"
                >
                  {showPassword ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${btnPrimaryPill} mt-2 h-12 w-full justify-between px-2 pl-5`}
            >
              <span className="flex items-center gap-2">
                {loading && (
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                )}
                {loading ? "Signing in..." : "Sign in to console"}
              </span>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-lime text-admin-forest transition-transform group-hover:translate-x-0.5"
              >
                <ArrowRight size={15} strokeWidth={2.2} />
              </span>
            </button>
          </form>

          <div className="mt-7 border-t border-admin-border/70 pt-5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-admin-sub transition hover:text-admin-forest"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
