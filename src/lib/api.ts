import type { AuthResponse } from "@/helper/auth";
import { translateBackendError } from "@/helper/errors";
import { clearAuth, getAccessToken, getRefreshToken, setSession } from "@/lib/token-store";

// Re-export da fonte única de token, para manter a superfície pública estável.
export { clearAuth, getAccessToken, getRefreshToken, setSession } from "@/lib/token-store";

const _apiUrl = import.meta.env.VITE_API_URL as string | undefined;
if (!_apiUrl) throw new Error("[Config] VITE_API_URL is not set. All API calls will fail.");
export const BASE_URL: string = _apiUrl;

// Secret known only to this module — prevents external scripts from triggering auth:unauthorized
const AUTH_EVENT_SECRET = crypto.randomUUID();

/**
 * Registers a handler for the internal "auth:unauthorized" event.
 * Returns a cleanup function to remove the listener.
 */
export function onAuthUnauthorized(handler: () => void): () => void {
  const listener = (e: Event) => {
    if ((e as CustomEvent<{ secret: string }>).detail?.secret !== AUTH_EVENT_SECRET) return;
    handler();
  };
  window.addEventListener("auth:unauthorized", listener);
  return () => window.removeEventListener("auth:unauthorized", listener);
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// Single-flight refresh: concurrent 401s share one refresh call. The backend rotates
// the refresh token on each use, so parallel refreshes would invalidate each other.
let refreshPromise: Promise<boolean> | null = null;

/**
 * Exchanges the (possibly expired) access token + stored refresh token for a new pair.
 * Uses raw fetch — must NOT go through authFetch, or a 401 here would recurse.
 * Returns false (without throwing) when refresh isn't possible, so callers fall back to logout.
 */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken || !getAccessToken()) return false;

  try {
    const response = await fetch(`${BASE_URL}/Auth/RefreshToken`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) return false;

    const data = (await response.json()) as AuthResponse;
    if (!data?.accessToken) return false;

    setSession(data);
    return true;
  } catch {
    return false;
  }
}

function refreshOnce(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function failAuth(): void {
  clearAuth();
  window.dispatchEvent(new CustomEvent("auth:unauthorized", { detail: { secret: AUTH_EVENT_SECRET } }));
}

function withAuthHeaders(options: RequestInit): RequestInit {
  return {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...((options.headers as Record<string, string>) ?? {}),
    },
  };
}

/**
 * Wrapper around fetch that:
 * - Injects the Authorization header automatically (access token from sessionStorage)
 * - On 401, attempts a single reactive token refresh and retries the request once
 * - Clears auth state and fires "auth:unauthorized" only when refresh fails
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, withAuthHeaders(options));
  if (response.status !== 401) return response;

  const refreshed = await refreshOnce();
  if (!refreshed) {
    failAuth();
    return response;
  }

  const retry = await fetch(url, withAuthHeaders(options));
  if (retry.status === 401) failAuth();
  return retry;
}

type ApiErrorLike = {
  message?: string;
  response?: {
    data?: {
      error?: { message?: string };
      message?: string;
    };
  };
};

type ApiErrorBody = {
  error?: { message?: string };
  message?: string;
};

export function getErrorMessage(error: unknown, fallback: string): string {
  const typed = error as ApiErrorLike;
  const raw = typed?.response?.data?.error?.message ?? typed?.response?.data?.message ?? typed?.message;
  return translateBackendError(raw, fallback);
}

export async function getResponseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorBody;
    const raw = payload.error?.message?.trim() || payload.message?.trim();
    return translateBackendError(raw, fallback);
  } catch {
    return fallback;
  }
}

export async function readJsonOrThrow<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response, fallbackMessage));
  }

  return (await response.json()) as T;
}

// ----- Typed transport layer -----
// Single place that builds URLs, attaches auth, and maps errors. Services declare
// intent (path + params + body) and never touch fetch, headers, or query strings.

type QueryParams = Record<string, string | number | boolean | null | undefined>;

type WriteOptions = {
  params?: QueryParams;
  fallback?: string;
  /** Set false for endpoints that must run without a token and without 401 redirect (login, signup, password reset). */
  auth?: boolean;
};

const DEFAULT_FALLBACK = "Falha na requisição";

/** Encodes a params object into a query string, dropping null/undefined. Returns "" when empty. */
function buildQuery(params?: QueryParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    search.append(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

type RequestInput = {
  method: "GET" | "POST" | "DELETE";
  path: string;
  params?: QueryParams;
  body?: unknown;
  auth?: boolean;
};

async function request({ method, path, params, body, auth = true }: RequestInput): Promise<Response> {
  const url = `${BASE_URL}${path}${buildQuery(params)}`;

  const init: RequestInit = { method };
  if (body !== undefined) init.body = JSON.stringify(body);

  if (auth) return authFetch(url, init);

  // Public call: no token, and 401 must not clear auth / redirect (e.g. wrong login password).
  return fetch(url, { ...init, headers: { "Content-Type": "application/json" } });
}

export async function getJson<T>(path: string, params?: QueryParams, fallback = DEFAULT_FALLBACK): Promise<T> {
  const response = await request({ method: "GET", path, params });
  return readJsonOrThrow<T>(response, fallback);
}

export async function del(path: string, params?: QueryParams, fallback = DEFAULT_FALLBACK): Promise<void> {
  const response = await request({ method: "DELETE", path, params });
  if (!response.ok) throw new Error(await getResponseErrorMessage(response, fallback));
}

export async function postJson<T>(path: string, body?: unknown, options: WriteOptions = {}): Promise<T> {
  const response = await request({ method: "POST", path, body, params: options.params, auth: options.auth });
  return readJsonOrThrow<T>(response, options.fallback ?? DEFAULT_FALLBACK);
}

export async function postVoid(path: string, body?: unknown, options: WriteOptions = {}): Promise<void> {
  const response = await request({ method: "POST", path, body, params: options.params, auth: options.auth });
  if (!response.ok) throw new Error(await getResponseErrorMessage(response, options.fallback ?? DEFAULT_FALLBACK));
}
