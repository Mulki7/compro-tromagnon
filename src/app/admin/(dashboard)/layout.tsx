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
  const { user, loading, authenticated, logout } = useAuth({ requireAuth: true });
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-satelit-bg text-satelit-muted">
        <span className="flex items-center gap-2.5 text-[14px] font-medium">
          <Loader2 size={16} className="animate-spin text-satelit-accent" />
          Verifying session
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-satelit-bg text-satelit-ink lg:h-screen lg:overflow-hidden">
      <AdminSidebar
        userEmail={user?.email}
        onLogout={logout}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <main className="flex min-w-0 flex-1 flex-col lg:h-screen lg:overflow-y-auto">
        <AdminShellContext.Provider value={{ onMenuClick: () => setMobileOpen(true) }}>
          {children}
        </AdminShellContext.Provider>
      </main>
    </div>
  );
}
