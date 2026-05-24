import { NextResponse } from "next/server";
import { backendApiUrl } from "@/server/bff/config";
import { getIncomingCookie } from "@/server/bff/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cookie = getIncomingCookie(req);

  const res = await fetch(
    backendApiUrl(`/api/accommodations${url.search}`),
    {
      method: "GET",
      headers: {
        ...(cookie ? { cookie } : {}),
      },
      cache: "no-store",
    },
  );

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
