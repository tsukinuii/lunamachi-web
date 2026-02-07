"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { logoutBackend } from "@/services/auth/auth.service";

type Me = { id: string; email?: string; name?: string };
type SocialProvider = "google" | "github";

type SessionLike = {
  accessToken?: string; // backend access token (credentials)
  provider?: SocialProvider;
  providerAccessToken?: string; // OAuth access_token (google+github)
  providerIdToken?: string; // OAuth id_token (google only)
  user?: { email?: string | null };
};

function pickAccessToken(payload: any): string | undefined {
  return payload?.accessToken || payload?.data?.accessToken;
}

/**
 * เลือก token สำหรับ exchange
 * - google: ถ้า BE รองรับทั้งคู่ คุณจะเลือกอันไหนก็ได้
 *   แนะนำเริ่มจาก access_token ก่อน (เหมือน github) แล้วค่อย fallback id_token
 * - github: access_token
 */
function pickTokenForExchange(session: SessionLike): { token?: string; kind: "access_token" | "id_token" | "none" } {
  if (session.provider === "google") {
    if (session.providerAccessToken) return { token: session.providerAccessToken, kind: "access_token" };
    if (session.providerIdToken) return { token: session.providerIdToken, kind: "id_token" };
    return { kind: "none" };
  }
  if (session.provider === "github") {
    if (session.providerAccessToken) return { token: session.providerAccessToken, kind: "access_token" };
    return { kind: "none" };
  }
  return { kind: "none" };
}

async function exchange(provider: SocialProvider, providerToken: string, tokenKind: string) {
  const traceId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const res = await fetch("/api/auth/social/exchange", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-trace-id": traceId,
      "x-token-kind": tokenKind, // optional: ช่วยให้ log ฝั่ง BE รู้ว่าเป็นอะไร
    },
    credentials: "include",
    body: JSON.stringify({ provider, accessToken: providerToken }),
  });

  console.log("[profile] EXCHANGE traceId:", traceId);
  console.log("[profile] EXCHANGE response:", { ok: res.ok, status: res.status });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.log("[profile] EXCHANGE error payload:", {
      traceId,
      code: data?.error?.code,
      message: data?.error?.message ?? data?.message,
    });
    throw new Error(data?.error?.message || data?.message || "exchange failed");
  }

  return { accessToken: pickAccessToken(data), traceId };
}

async function refresh(traceId?: string) {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers: {
      "x-csrf": "1",
      Origin: "http://localhost:3000",
      ...(traceId ? { "x-trace-id": traceId } : {}),
    },
  });

  console.log("[profile] REFRESH response:", { ok: res.ok, status: res.status });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || data?.message || "refresh failed");

  return { accessToken: pickAccessToken(data) };
}

async function me(accessToken: string, traceId?: string) {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`,
      ...(traceId ? { "x-trace-id": traceId } : {}),
    },
    credentials: "include",
  });

  console.log("[profile] ME response:", { ok: res.ok, status: res.status });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || data?.message || "me failed");

  return (data?.data ?? data) as Me;
}

export default function ProfilePage() {
  const { data, status } = useSession();
  const session = (data as any as SessionLike) ?? {};

  const [meData, setMeData] = useState<Me | null>(null);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  const ranRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (ranRef.current) return;
    ranRef.current = true;

    const provider = session.provider;
    const backendAccessToken = session.accessToken;
    const picked = pickTokenForExchange(session);

    console.log("[profile] AUTHENTICATED:", {
      provider,
      tokenKind: picked.kind,
      hasProviderToken: !!picked.token,
      providerTokenLen: picked.token?.length ?? 0,
      hasBackendAccessToken: !!backendAccessToken,
      email: session?.user?.email,
    });

    let alive = true;

    (async () => {
      setWorking(true);
      setError("");

      // --- Social ---
      if (provider && picked.token) {
        try {
          console.log("[profile] SOCIAL: try refresh first");
          const r = await refresh();
          if (!r.accessToken) throw new Error("refresh missing accessToken");
          const m = await me(r.accessToken);
          if (alive) setMeData(m);
          return;
        } catch (e) {
          console.log("[profile] SOCIAL: refresh failed -> exchange", e);
          const ex = await exchange(provider, picked.token, picked.kind);
          if (!ex.accessToken) throw new Error("exchange missing accessToken");
          const m = await me(ex.accessToken, ex.traceId);
          if (alive) setMeData(m);
          return;
        } finally {
          if (alive) setWorking(false);
        }
      }

      // --- Credentials ---
      if (backendAccessToken) {
        const m = await me(backendAccessToken);
        if (alive) setMeData(m);
        if (alive) setWorking(false);
        return;
      }

      if (alive) setError("No token available");
      if (alive) setWorking(false);
    })().catch((e: any) => {
      console.error("[profile] ERROR:", e);
      if (alive) setWorking(false);
      if (alive) setError(e?.message || "error");
    });

    return () => {
      alive = false;
    };
  }, [status]);

  if (status === "loading") return <div style={{ padding: 24 }}>Loading...</div>;
  if (status !== "authenticated") return <div style={{ padding: 24 }}>Not signed in</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Profile</h1>

      {working && <p>Loading...</p>}
      {error && <p style={{ color: "tomato" }}>{error}</p>}

      <pre style={{ background: "#111", padding: 12, borderRadius: 8, overflow: "auto" }}>
        {JSON.stringify({ nextAuthSession: data, meData }, null, 2)}
      </pre>

      <button
        onClick={async () => {
          await logoutBackend();
          await signOut({ callbackUrl: "/login" });
        }}
        style={{ marginTop: 12 }}
      >
        Logout
      </button>
    </div>
  );
}
