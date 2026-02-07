import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      cookie,
      "x-csrf": "1",
      origin: "http://localhost:3000",
    },
  });

  const data = await res.json().catch(() => ({}));

  const nextRes = NextResponse.json(data, { status: res.status });

  // ถ้า backend rotate cookie ก็ forward กลับด้วย
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) nextRes.headers.set("set-cookie", setCookie);

  return nextRes;
}