import { create } from "zustand";

type UserSummary = {
  id: number;
  username: string;
  email: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserSummary | null;
  setSession: (payload: {
    accessToken: string;
    refreshToken: string;
    user: UserSummary;
  }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
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
}));
