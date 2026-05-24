import { NextResponse } from "next/server";

export function getSetCookies(res: Response): string[] {
  const headers = res.headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const setCookie = res.headers.get("set-cookie");
  return setCookie ? [setCookie] : [];
}

export function parseCookieNameValue(setCookie: string) {
  const first = setCookie.split(";")[0];
  const idx = first.indexOf("=");

  if (idx === -1) return null;

  return {
    name: first.slice(0, idx),
    value: first.slice(idx + 1),
  };
}

export function rewriteBackendCookies(nextRes: NextResponse, backendRes: Response) {
  for (const cookie of getSetCookies(backendRes)) {
    const parsed = parseCookieNameValue(cookie);
    if (!parsed) continue;

    nextRes.cookies.set(parsed.name, parsed.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }
}

export function clearRefreshCookie(nextRes: NextResponse) {
  nextRes.cookies.set("refresh_token", "", {
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
