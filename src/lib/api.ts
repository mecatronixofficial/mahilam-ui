const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
const REQUEST_TIMEOUT_MS = 20_000;

/** Endpoints that must never trigger a token refresh (they are the refresh flow). */
const NO_REFRESH = ["/auth/login", "/auth/refresh", "/auth/logout"];

/** Fired on `window` when a signed-in user's session can no longer be renewed. */
export const SESSION_EXPIRED_EVENT = "lm:session-expired";

export type ApiErrorKind = "network" | "timeout" | "unauthorized" | "forbidden" | "not-found" | "validation" | "rate-limit" | "server" | "unknown";

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly kind: ApiErrorKind) {
    super(message);
    this.name = "ApiError";
  }
}

function kindFor(status: number): ApiErrorKind {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not-found";
  if (status === 400 || status === 409 || status === 422) return "validation";
  if (status === 429) return "rate-limit";
  if (status >= 500) return "server";
  return "unknown";
}

function messageFrom(payload: unknown, status: number) {
  const message = (payload as { message?: unknown })?.message;
  if (Array.isArray(message)) return message.join(". ");
  if (typeof message === "string" && message) return message;
  if (status === 429) return "Too many requests. Please wait a moment and try again.";
  if (status >= 500) return "The server had a problem. Please try again shortly.";
  return "Request failed";
}

let refreshing: Promise<boolean> | null = null;
/** Set by the dashboard shell once `/auth/me` succeeds, so only real sessions can "expire". */
let hadSession = false;
export function markSessionActive(active: boolean) { hadSession = active; }

async function refreshSession() {
  if (!refreshing) {
    refreshing = fetch(`${API_URL}/auth/refresh`, { method: "POST", credentials: "include", cache: "no-store" })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}

export async function api<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  const isFormData = init?.body instanceof FormData;
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      cache: path.startsWith("/auth/") ? "no-store" : init?.cache,
      signal: init?.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { ...(!isFormData && init?.body ? { "Content-Type": "application/json" } : {}), ...(init?.headers || {}) },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") throw new ApiError("The server took too long to respond.", 0, "timeout");
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    const offline = typeof navigator !== "undefined" && !navigator.onLine;
    throw new ApiError(offline ? "You appear to be offline." : "We couldn't reach the server.", 0, "network");
  }

  // `/auth/me` is included on purpose: an expired access token with a valid refresh token must not sign the user out.
  if (res.status === 401 && retry && !NO_REFRESH.some((p) => path.startsWith(p))) {
    if (await refreshSession()) return api<T>(path, init, false);
    if (hadSession && typeof window !== "undefined") {
      hadSession = false;
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }
  }

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(messageFrom(payload, res.status), res.status, kindFor(res.status));
  return payload as T;
}

/** Downloads an authenticated file (e.g. a CSV export) through the cookie session. */
export async function downloadFile(path: string, fallbackName: string) {
  const load = () => fetch(`${API_URL}${path}`, { credentials: "include", cache: "no-store" });
  let res = await load();
  if (res.status === 401 && (await refreshSession())) res = await load();
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new ApiError(messageFrom(payload, res.status), res.status, kindFor(res.status));
  }
  const name = /filename="?([^"]+)"?/.exec(res.headers.get("Content-Disposition") || "")?.[1] || fallbackName;
  const url = URL.createObjectURL(await res.blob());
  const link = Object.assign(document.createElement("a"), { href: url, download: name });
  link.click();
  URL.revokeObjectURL(url);
}

export function errorMessage(error: unknown, fallback = "Something went wrong.") {
  return error instanceof Error && error.message ? error.message : fallback;
}

export { API_URL };
