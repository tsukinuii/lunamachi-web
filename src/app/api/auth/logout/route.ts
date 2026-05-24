import { NextResponse } from "next/server";
import { backendApiUrl } from "@/server/bff/config";
import { backendCookieJsonHeaders } from "@/server/bff/headers";
import { clearRefreshCookie, rewriteBackendCookies } from "@/server/bff/cookies";

export async function POST(req: Request) {
  const res = await fetch(backendApiUrl("/api/auth/logout"), {
    method: "POST",
    headers: backendCookieJsonHeaders(req),
  });

  const data = await res.json().catch(() => ({}));
  const nextRes = NextResponse.json(data, { status: res.status });

  rewriteBackendCookies(nextRes, res);
  clearRefreshCookie(nextRes);

  return nextRes;
}
