import { LoginPayload, RegisterPayload, Me } from "./types";

const BASE_URL = typeof window === "undefined" ? process.env.NEXTAUTH_URL : "";

export async function requestRegisterOtp(email: string) {
  const res = await fetch("/api/auth/register/request-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function verifyRegisterOtp(payload: RegisterPayload) {
  const res = await fetch("/api/auth/register/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function loginWithBackend(payload: LoginPayload) {
  const url = `${BASE_URL}/api/auth/login`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    // ไม่ต้องใส่ credentials ในฝั่ง server
  });

  if (!res.ok) return null;
  return res.json();
}

export async function meService(accessToken: string, traceId?: string) {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`,
      ...(traceId ? { "x-trace-id": traceId } : {}),
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || data?.message || "me failed");

  return (data?.data ?? data) as Me;
}


export async function exchangeSocial(payload: {
  provider: "google" | "github";
  accessToken: string;
  traceId: string;
  tokenKind: string;
}) {
  return fetch("/api/auth/social/exchange", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-trace-id": payload.traceId,
      "x-token-kind": payload.tokenKind,
    },
    credentials: "include",
    body: JSON.stringify({ provider: payload.provider, accessToken: payload.accessToken }),
  });
}


export async function logoutBackend() {
  await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function refreshService(traceId?: string) {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers: {
      "x-csrf": "1",
      Origin: "http://localhost:3000",
      ...(traceId ? { "x-trace-id": traceId } : {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || data?.message || "refresh failed");

  return { accessToken: data?.accessToken ?? data?.data?.accessToken ?? data?.token ?? null };
}
