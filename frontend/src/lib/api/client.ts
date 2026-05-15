import { API_BASE_URL } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginResponseData } from "@/types/auth";
import type { ApiResponse } from "@/types/api";

type JsonBody = Record<string, unknown>;

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  auth?: boolean;
  body?: BodyInit | JsonBody | null;
  retryOnUnauthorized?: boolean;
};

type ApiEnvelope<T> = ApiResponse<T>;

type ApiEnvelopeShape = {
  code?: number;
  msg?: string;
  data?: unknown;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let refreshPromise: Promise<string | null> | null = null;

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function isJsonBody(body: BodyInit | JsonBody | null | undefined): body is JsonBody {
  if (!body || typeof body !== "object") {
    return false;
  }

  return !(body instanceof FormData) && !(body instanceof URLSearchParams);
}

async function parseEnvelope(response: Response) {
  try {
    return (await response.json()) as ApiEnvelopeShape;
  } catch {
    return null;
  }
}

function extractError(response: Response, payload: ApiEnvelopeShape | null) {
  const message = payload?.msg ?? "请求失败，请稍后重试。";
  const code = payload?.code ?? response.status;
  return new ApiError(message, response.status, code, payload?.data);
}

async function rawRequest<T>(
  path: string,
  {
    auth = false,
    body,
    headers,
    retryOnUnauthorized = true,
    ...init
  }: ApiRequestOptions,
): Promise<T> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  const token = auth ? useAuthStore.getState().accessToken : null;
  if (auth && token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  let requestBody: BodyInit | null | undefined;
  if (isJsonBody(body)) {
    requestHeaders.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  } else {
    requestBody = body;
  }

  const response = await fetch(`${API_BASE_URL}${normalizePath(path)}`, {
    ...init,
    headers: requestHeaders,
    body: requestBody,
  });

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const nextToken = await refreshAccessToken();

    if (nextToken) {
      return rawRequest<T>(path, {
        ...init,
        headers,
        body,
        auth: true,
        retryOnUnauthorized: false,
      });
    }

    useAuthStore.getState().clearSession();
  }

  const payload = await parseEnvelope(response);
  if (!response.ok || !payload) {
    throw extractError(response, payload);
  }

  return (payload as ApiEnvelope<T>).data;
}

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const store = useAuthStore.getState();

    if (!store.refreshToken) {
      store.clearSession();
      return null;
    }

    try {
      const session = await rawRequest<LoginResponseData>("/auth/refresh", {
        method: "POST",
        body: {
          refresh_token: store.refreshToken,
        },
        retryOnUnauthorized: false,
      });

      store.setSession({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        user: session.user,
      });

      return session.access_token;
    } catch {
      store.clearSession();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  return rawRequest<T>(path, options);
}
