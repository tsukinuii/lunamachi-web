import { BFF_ORIGIN } from "./config";

export function getIncomingCookie(req: Request) {
  return req.headers.get("cookie") ?? "";
}

export function getIncomingCsrf(req: Request) {
  return req.headers.get("x-csrf") ?? "1";
}

export function backendJsonHeaders(
  req: Request,
  extra?: HeadersInit,
): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-CSRF": getIncomingCsrf(req),
    Origin: BFF_ORIGIN,
    ...(extra ?? {}),
  };
}

export function backendCookieJsonHeaders(
  req: Request,
  extra?: HeadersInit,
): HeadersInit {
  const cookie = getIncomingCookie(req);

  return backendJsonHeaders(req, {
    ...(cookie ? { cookie } : {}),
    ...(extra ?? {}),
  });
}
