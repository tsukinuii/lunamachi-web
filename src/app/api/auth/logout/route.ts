import { NextResponse } from "next/server";

function getSetCookies(res: Response): string[] {
  const anyHeaders: any = res.headers as any;
  if (typeof anyHeaders.getSetCookie === "function") return anyHeaders.getSetCookie();
  const one = res.headers.get("set-cookie");
  return one ? [one] : [];
}

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";

  const res = await fetch("https://api.lunamachi.com/auth/logout", {
    method: "POST",
    headers: { cookie },
  });

  const data = await res.json().catch(() => ({}));
  const nextRes = NextResponse.json(data, { status: res.status });

  // 1) forward set-cookie (รองรับหลายค่า)
  const setCookies = getSetCookies(res);
  for (const c of setCookies) nextRes.headers.append("set-cookie", c);

  // 2) กันพลาด: ถ้า BE ไม่ได้ลบ cookie มาให้ → ลบเองบนโดเมนปัจจุบัน
  // (ให้ชื่อ cookie ตรงกับของจริง)
  nextRes.headers.append(
    "set-cookie",
    "refresh_token=; Path=/; Max-Age=0; SameSite=Lax"
  );

  return nextRes;
}