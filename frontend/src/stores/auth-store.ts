import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { UserPublic } from "@/types/user";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserPublic | null;
  hasHydrated: boolean;
  setSession: (payload: {
    accessToken: string;
    refreshToken: string;
    user: UserPublic;
  }) => void;
  clearSession: () => void;
  markHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({
          accessToken,
          refreshToken,
          user,
        }),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        }),
      markHydrated: (value) =>
        set({
          hasHydrated: value,
        }),
    }),
    {
      name: "fastapi-personal-blog-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated(true);
      },
    },
  ),
);
