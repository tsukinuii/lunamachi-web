type ApiFetchOptions = RequestInit & { _retry?: boolean };

async function refreshAccessToken() {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers: {
      "x-csrf": "1",
      Origin: "http://localhost:3000",
    },
  });

  if (!res.ok) return null;
  return res.json(); // { accessToken, ... }
}

export async function apiFetch<T>(input: string, init: ApiFetchOptions = {}): Promise<T> {
  const { _retry, ...fetchInit } = init;

  const res = await fetch(input, {
    ...fetchInit,
    credentials: "include",
  });

  if (res.status !== 401) {
    if (!res.ok) throw await res.json().catch(() => ({}));
    return res.json();
  }

  if (_retry) throw new Error("Unauthorized");

  const refreshed = await refreshAccessToken();
  if (!refreshed?.accessToken) throw new Error("Refresh failed");

  const retryRes = await fetch(input, {
    ...fetchInit,
    credentials: "include",
    headers: {
      ...(fetchInit.headers || {}),
      authorization: `Bearer ${refreshed.accessToken}`,
    },
  });

  if (!retryRes.ok) throw await retryRes.json().catch(() => ({}));
  return retryRes.json();
}