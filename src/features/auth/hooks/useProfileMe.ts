"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  meService,
  logoutBackend,
} from "../services/auth.client";
import { exchangeSocialAction } from "../actions/socialExchange.client";
import { Me, SocialProvider } from "../types";

type SessionLike = {
  provider?: SocialProvider;
  providerAccessToken?: string;
  providerIdToken?: string;
};

type Picked = { token: string; kind: "access_token" | "id_token" };

function pickExchangeToken(s: SessionLike): Picked | null {
  if (s.provider === "google") {
    if (s.providerAccessToken)
      return { token: s.providerAccessToken, kind: "access_token" };
    if (s.providerIdToken)
      return { token: s.providerIdToken, kind: "id_token" };
    return null;
  }
  if (s.provider === "github") {
    if (s.providerAccessToken)
      return { token: s.providerAccessToken, kind: "access_token" };
    return null;
  }
  return null;
}

async function loadMe(session: SessionLike) {
  try {
    return await meService();
  } catch {
    if (!session.provider) throw new Error("No session available");

    const picked = pickExchangeToken(session);
    if (!picked) throw new Error("No provider token for exchange");

    const ex = await exchangeSocialAction(
      session.provider,
      picked.token,
      picked.kind,
    );

    return await meService(ex.traceId);
  }
}

export function useProfileMe() {
  const { data, status } = useSession();
  const session = (data as any as SessionLike) ?? {};

  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ranRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (ranRef.current) return;
    ranRef.current = true;

    let alive = true;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const m = await loadMe(session);
        if (alive) setMe(m);
      } catch (e: any) {
        if (alive) setError(e?.message || "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [status]);

  async function logout() {
    await logoutBackend();
    await signOut({ callbackUrl: "/login" });
  }

  return {
    status,
    me,
    loading,
    error,
    logout,
    session: data,
  };
}
