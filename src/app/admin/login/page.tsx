"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
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
        <Loader2 size={20} className="animate-spin text-admin-forest-soft" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="font-admin flex min-h-dvh items-center justify-center bg-admin-canvas px-4 py-8 text-admin-ink selection:bg-admin-forest-soft selection:text-[#F1F2EE]">
      <div className="grid w-full max-w-3xl overflow-hidden rounded-xl border border-admin-border-strong bg-admin-surface md:grid-cols-12">
        {/* Left Brand Panel */}
        <div className="flex flex-col justify-between bg-admin-forest p-7 text-[#F1F2EE] md:col-span-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#F1F2EE] p-1">
              <Image
                src="/assets/logo-tromagnon-nobg.png"
                alt="Tromagnon Records"
                width={26}
                height={26}
                className="object-contain"
              />
            </span>
            <span className="font-admin text-[19px] font-bold tracking-[-0.025em]">
              tromagnon<span className="text-admin-lime">.</span>
            </span>
          </div>

          <div className="my-10 space-y-3">
            <p className="font-admin text-[12px] font-semibold uppercase tracking-[0.08em] text-admin-lime">
              Tromagnon Archive
            </p>
            <h1 className="font-display text-[34px] font-normal leading-[0.98] tracking-[-0.02em]">
              Label catalog & archive.
            </h1>
            <p className="font-admin text-[15px] font-light leading-[1.6] text-[#DCE5E1]">
              Releases, artist roster, journal dispatches, and live dates.
            </p>
          </div>

          <p className="font-admin text-[12px] text-[#9CCBC1]">
            Tromagnon Records
          </p>
        </div>

        {/* Right Sign-In Form */}
        <div className="flex flex-col justify-center p-7 sm:p-9 md:col-span-7">
          <h2 className="font-admin text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-admin-ink">
            Sign in
          </h2>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-admin-danger bg-admin-danger-soft px-3.5 py-2.5 font-admin text-[13.5px] font-medium text-admin-danger"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
                  className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-admin-sub transition-colors duration-[120ms] hover:bg-admin-elevated hover:text-admin-ink"
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
              className={`${btnPrimaryPill} mt-1 h-11 w-full justify-between px-2 pl-4`}
            >
              <span className="flex items-center gap-2">
                {loading && (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                )}
                {loading ? "Signing in…" : "Sign in"}
              </span>
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-md bg-admin-lime text-admin-on-lime transition-transform duration-[120ms] group-hover:translate-x-0.5"
              >
                <ArrowRight size={14} strokeWidth={2.2} />
              </span>
            </button>
          </form>

          <div className="mt-6 border-t border-admin-border pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-admin text-[13.5px] font-semibold text-admin-forest-soft underline underline-offset-4 transition-colors duration-[120ms] hover:text-admin-forest"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
