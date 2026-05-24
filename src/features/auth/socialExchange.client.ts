"use client";

import { exchangeSocial } from "./auth.service";

type TokenResponse = {
  accessToken?: string;
  data?: { accessToken?: string };
  token?: string;
  error?: { message?: string };
  message?: string;
};

function pickAccessToken(data: TokenResponse) {
  return data?.accessToken ?? data?.data?.accessToken ?? data?.token ?? null;
}

export async function exchangeSocialAction(
  provider: "google" | "github",
  providerToken: string,
  tokenKind: string,
) {
  const traceId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const res = await exchangeSocial({ provider, accessToken: providerToken, traceId, tokenKind });
  const data = (await res.json().catch(() => ({}))) as TokenResponse;

  if (!res.ok) throw new Error(data?.error?.message || data?.message || "exchange failed");

  return { accessToken: pickAccessToken(data), traceId };
}
