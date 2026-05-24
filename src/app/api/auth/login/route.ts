import { NextResponse } from "next/server";
import { backendApiUrl } from "@/server/bff/config";
import { backendJsonHeaders } from "@/server/bff/headers";
import { rewriteBackendCookies } from "@/server/bff/cookies";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(backendApiUrl("/api/auth/login"), {
    method: "POST",
    headers: backendJsonHeaders(req),
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  const nextRes = NextResponse.json(data, { status: res.status });

  rewriteBackendCookies(nextRes, res);

  return nextRes;
}
