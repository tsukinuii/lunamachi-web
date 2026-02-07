import { apiFetch } from "@/services/_http/client";
import { MeResponse, LoginPayload, RegisterPayload } from "./types";

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

export async function getMe(accessToken: string) {
  const url = `${BASE_URL}/api/auth/me`;
  const res = await apiFetch<MeResponse>(url, {
    method: "GET",
    headers: { authorization: `Bearer ${accessToken}` },
  });
  return res;
}

export async function exchangeSocial(provider: string, accessToken: string) {
  const url = `${BASE_URL}/api/auth/social/exchange`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, accessToken }),
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function logoutBackend() {
  await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
