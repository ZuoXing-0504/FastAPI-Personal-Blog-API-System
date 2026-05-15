"use client";

import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  return {
    accessToken,
    refreshToken,
    user,
    hasHydrated,
    isAuthenticated: Boolean(accessToken && user),
    setSession,
    clearSession,
  };
}
