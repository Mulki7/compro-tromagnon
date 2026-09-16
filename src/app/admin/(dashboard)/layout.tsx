"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminShellContext } from "@/components/admin/AdminShellContext";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, authenticated, logout } = useAuth({ requireAuth: true });
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7]">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-neutral-500">
          <Loader2 size={18} className="animate-spin" />
          Verifying session…
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <AdminSidebar
        onLogout={logout}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminShellContext.Provider
          value={{ onMenuClick: () => setMobileOpen(true) }}
        >
          {children}
        </AdminShellContext.Provider>
      </div>
    </div>
  );
}
