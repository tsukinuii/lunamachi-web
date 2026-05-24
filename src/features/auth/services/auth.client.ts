import { getCsrfToken } from "@/lib/http/csrf";
import { LoginPayload, RegisterPayload, Me } from "../types";

const NEXT_APP_BASE_URL = typeof window === "undefined" ? process.env.NEXTAUTH_URL : "";

function jsonHeaders(extra?: HeadersInit): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-CSRF": getCsrfToken(),
    ...(extra ?? {}),
  };
}

export async function requestRegisterOtp(email: string) {
  const res = await fetch("/api/auth/register/request-otp", {
    method: "POST",
    headers: jsonHeaders(),
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function verifyRegisterOtp(payload: RegisterPayload) {
  const res = await fetch("/api/auth/register/verify-otp", {
    method: "POST",
    headers: jsonHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function loginWithBackend(payload: LoginPayload) {
  const res = await fetch(`${NEXT_APP_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: jsonHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) return null;
  return res.json();
}

export async function meService(traceId?: string) {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    headers: {
      ...(traceId ? { "x-trace-id": traceId } : {}),
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || data?.message || "me failed");

  return (data?.data ?? data) as Me;
}

export const getMe = meService;

export async function exchangeSocial(payload: {
  provider: "google" | "github";
  accessToken: string;
  traceId: string;
  tokenKind: string;
}) {
  return fetch("/api/auth/social/exchange", {
    method: "POST",
    headers: jsonHeaders({
      "x-trace-id": payload.traceId,
      "x-token-kind": payload.tokenKind,
    }),
    credentials: "include",
    body: JSON.stringify({ provider: payload.provider, accessToken: payload.accessToken }),
  });
}

export async function logoutBackend() {
  await fetch(`${NEXT_APP_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF": getCsrfToken(),
    },
  });
}

export async function refreshService(traceId?: string) {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF": getCsrfToken(),
      ...(traceId ? { "x-trace-id": traceId } : {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || data?.message || "refresh failed");

  return { accessToken: data?.accessToken ?? data?.data?.accessToken ?? data?.token ?? null };
}
