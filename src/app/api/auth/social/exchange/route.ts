import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function findCookieValue(setCookieLines: string[], name: string): string | undefined {
  for (const line of setCookieLines) {
    const idx = line.indexOf(`${name}=`);
    if (idx === -1) continue;

    const after = line.slice(idx + name.length + 1);
    const semi = after.indexOf(";");
    const comma = after.indexOf(",");

    let end = after.length;
    if (semi !== -1) end = Math.min(end, semi);
    if (comma !== -1) end = Math.min(end, comma);

    const value = after.slice(0, end);
    if (value) return value;
  }
  return undefined;
}

function safeDecodeJwt(token: string) {
  try {
    const [h, p] = token.split(".");
    if (!h || !p) return null;

    const header = JSON.parse(Buffer.from(h, "base64url").toString("utf8"));
    const payload = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));

    return {
      header: { alg: header?.alg, kid: header?.kid, typ: header?.typ },
      payload: {
        iss: payload?.iss,
        aud: payload?.aud,
        azp: payload?.azp,
        sub: payload?.sub,
        email: payload?.email,
        email_verified: payload?.email_verified,
        exp: payload?.exp,
        iat: payload?.iat,
      },
    };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const traceId = req.headers.get("x-trace-id") ?? "";
  const tokenKind = req.headers.get("x-token-kind") ?? ""; // optional

  const body = await req.json();
  const provider = body?.provider;
  const accessToken = body?.accessToken as string | undefined;

  const isJwt = typeof accessToken === "string" && accessToken.split(".").length === 3;
  const decoded = isJwt ? safeDecodeJwt(accessToken!) : null;

  console.log("[BFF exchange] traceId:", traceId);
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

  const beRes = await fetch(`${BASE_URL}/auth/social/exchange`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(traceId ? { "x-trace-id": traceId } : {}),
      ...(tokenKind ? { "x-token-kind": tokenKind } : {}),
    },
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

  console.log("[BFF exchange] error-summary:", {
    traceId,
    provider,
    status: beRes.status,
    ok: beRes.ok,
    code: data?.error?.code,
    message: data?.error?.message ?? data?.message,
  });

  const nextRes = NextResponse.json(data, { status: beRes.status });

  const setCookies: string[] =
    (beRes.headers as any).getSetCookie?.() ??
    (beRes.headers.get("set-cookie") ? [beRes.headers.get("set-cookie") as string] : []);

  const refresh = findCookieValue(setCookies, "refresh_token");

  console.log("[BFF exchange] set-cookie:", {
    traceId,
    setCookieCount: setCookies.length,
    hasRefreshToken: !!refresh,
    preview: setCookies.map((c) => c.split(";")[0]).slice(0, 3),
  });

  if (refresh) {
    nextRes.cookies.set({
      name: "refresh_token",
      value: refresh,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  return nextRes;
}
