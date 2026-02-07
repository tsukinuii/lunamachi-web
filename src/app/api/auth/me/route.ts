import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";

  console.log("me auth:::", auth);
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      authorization: auth,
    },
  });
  console.log("me res:::", res);

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}