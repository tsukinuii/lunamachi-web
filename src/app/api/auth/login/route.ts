import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function parseCookieNameValue(setCookie: string) {
  const first = setCookie.split(";")[0]; // name=value
  const idx = first.indexOf("=");
  if (idx === -1) return null;
  return { name: first.slice(0, idx), value: first.slice(idx + 1) };
}

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrf": "1",
      Origin: "http://localhost:3000",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  console.log("BFF_LOGIN_ACCESS_TOKEN_PREFIX:::", data?.data?.accessToken?.slice(0, 25));
  const nextRes = NextResponse.json(data, { status: res.status });

  // ✅ ดึง set-cookie แบบครบ (หลายตัวได้)
  const setCookies: string[] =
    (res.headers as any).getSetCookie?.() ??
    (res.headers.get("set-cookie") ? [res.headers.get("set-cookie")!] : []);

  // 🔎 debug แบบสั้นๆ ดูที่ terminal
  console.log("backend set-cookie count =", setCookies.length);

  // ✅ rewrite ทุก cookie ให้เป็นของ localhost
  for (const c of setCookies) {
    const nv = parseCookieNameValue(c);
    if (!nv) continue;

    nextRes.cookies.set(nv.name, nv.value, {
      httpOnly: true,
      secure: false,      // local
      sameSite: "lax",    // local
      path: "/",
    });
  }

  return nextRes;
}