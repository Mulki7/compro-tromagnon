"use client";

import { createContext, useContext } from "react";

export const AdminShellContext = createContext<{ onMenuClick: () => void }>({
  onMenuClick: () => {},
});

export function useAdminShell() {
  return useContext(AdminShellContext);
}
