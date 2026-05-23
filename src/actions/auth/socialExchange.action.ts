"use client";

import { exchangeSocial } from "@/services/auth/auth.service";

function pickAccessToken(data: any) {
  return data?.accessToken ?? data?.data?.accessToken ?? data?.token ?? null;
}

export async function exchangeSocialAction(
  provider: "google" | "github",
  providerToken: string,
  tokenKind: string,
) {
  const traceId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const res = await exchangeSocial({ provider, accessToken: providerToken, traceId, tokenKind });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data?.error?.message || data?.message || "exchange failed");

  return { accessToken: pickAccessToken(data), traceId };
}
