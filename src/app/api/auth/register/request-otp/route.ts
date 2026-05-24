import { NextResponse } from "next/server";
import { backendApiUrl } from "@/server/bff/config";
import { backendJsonHeaders } from "@/server/bff/headers";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(backendApiUrl("/api/auth/register/request-otp"), {
    method: "POST",
    headers: backendJsonHeaders(req),
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
