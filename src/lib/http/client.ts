import { getCsrfToken } from "./csrf";

type ApiFetchOptions = RequestInit & { _retry?: boolean };

function withUnsafeHeaders(init: RequestInit) {
  const method = (init.method ?? "GET").toUpperCase();
  if (!["POST", "PATCH", "DELETE"].includes(method)) return init.headers;

  return {
    ...(init.body ? { "Content-Type": "application/json" } : {}),
    ...(init.headers || {}),
    "X-CSRF": getCsrfToken(),
  };
}

async function refreshSession() {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF": getCsrfToken(),
    },
  });

  if (!res.ok) return null;
  return res.json().catch(() => ({}));
}

export async function apiFetch<T>(input: string, init: ApiFetchOptions = {}): Promise<T> {
  const { _retry, ...fetchInit } = init;

  const res = await fetch(input, {
    ...fetchInit,
    headers: withUnsafeHeaders(fetchInit),
    credentials: "include",
  });

  if (res.status !== 401) {
    if (!res.ok) throw await res.json().catch(() => ({}));
    return res.json();
  }

  if (_retry) throw new Error("Unauthorized");

  const refreshed = await refreshSession();
  if (!refreshed) throw new Error("Refresh failed");

  const retryRes = await fetch(input, {
    ...fetchInit,
    credentials: "include",
    headers: withUnsafeHeaders(fetchInit),
  });

  if (!retryRes.ok) throw await retryRes.json().catch(() => ({}));
  return retryRes.json();
}
