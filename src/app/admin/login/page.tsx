"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";

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
    if (!authLoading && authenticated) {
      router.replace("/admin");
    }
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
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        axiosErr.response?.data?.message ||
          "Could not connect to backend server. Make sure the API is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7]">
        <Loader2 size={20} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F5F7] px-4 py-12">
      <div className="w-full max-w-md space-y-6 border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 h-20 w-20">
            <Image
              src="/assets/logo-tromagnon.png"
              alt="Tromagnon Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            CMS Admin Control
          </h1>
          <p className="mt-1 font-mono text-xs text-neutral-500">
            TROMAGNON RECORDS MANAGEMENT SYSTEM
          </p>
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block font-mono text-xs font-semibold uppercase text-neutral-600">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 font-mono text-sm focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-xs font-semibold uppercase text-neutral-600">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 font-mono text-sm focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 bg-black py-3 font-mono text-xs font-bold uppercase text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Enter CMS Dashboard</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="font-mono text-xs text-neutral-500 transition hover:text-black"
          >
            ← Return to Tromagnon Records Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}
