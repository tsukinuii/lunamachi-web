import { NextResponse } from "next/server";
import { backendApiUrl } from "@/server/bff/config";
import { backendCookieJsonHeaders } from "@/server/bff/headers";
import { rewriteBackendCookies } from "@/server/bff/cookies";
import { safeDecodeJwt } from "@/server/bff/debug";

export async function POST(req: Request) {
  const traceId = req.headers.get("x-trace-id") ?? "";
  const tokenKind = req.headers.get("x-token-kind") ?? "";

  const body = await req.json();
  const provider = body?.provider;
  const accessToken = body?.accessToken as string | undefined;

  const isJwt = typeof accessToken === "string" && accessToken.split(".").length === 3;
  const decoded = isJwt ? safeDecodeJwt(accessToken) : null;

  console.log("[BFF exchange] req:", {
    traceId,
    provider,
    tokenKind,
    hasAccessToken: !!accessToken,
    tokenLen: accessToken?.length ?? 0,
    tokenIsJwt: isJwt,
    tokenHead: typeof accessToken === "string" ? accessToken.slice(0, 20) : "",
    jwt: decoded,
  });

  const beRes = await fetch(backendApiUrl("/api/auth/social/exchange"), {
    method: "POST",
    headers: backendCookieJsonHeaders(req, {
      ...(traceId ? { "x-trace-id": traceId } : {}),
      ...(tokenKind ? { "x-token-kind": tokenKind } : {}),
    }),
    body: JSON.stringify({ provider, accessToken }),
  });

  const rawText = await beRes.text();

  console.log("[BFF exchange] backend:", {
    traceId,
    ok: beRes.ok,
    status: beRes.status,
    textPreview: rawText.slice(0, 300),
  });

  let data: any = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = { message: rawText };
  }

  const nextRes = NextResponse.json(data, { status: beRes.status });
  rewriteBackendCookies(nextRes, beRes);

  return nextRes;
}
