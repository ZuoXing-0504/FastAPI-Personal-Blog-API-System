import { apiRequest } from "@/lib/api/client";
import type {
  LoginRequest,
  LoginResponseData,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "@/types/auth";
import type { UserPublic } from "@/types/user";

export function registerUser(payload: RegisterRequest) {
  return apiRequest<UserPublic>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function loginUser(payload: LoginRequest) {
  return apiRequest<LoginResponseData>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function refreshUserTokens(payload: RefreshTokenRequest) {
  return apiRequest<LoginResponseData>("/auth/refresh", {
    method: "POST",
    body: payload,
  });
}

export function logoutUser(payload: LogoutRequest) {
  return apiRequest<null>("/auth/logout", {
    method: "POST",
    body: payload,
  });
}

export function getCurrentUser() {
  return apiRequest<UserPublic>("/users/me", {
    method: "GET",
    auth: true,
  });
}
