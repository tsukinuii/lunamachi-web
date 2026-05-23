"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  meService,
  logoutBackend,
  refreshService,
} from "@/services/auth/auth.service";
import { exchangeSocialAction } from "@/actions/auth/socialExchange.action";
import { Me, SocialProvider } from "@/services/auth/types";
import { useProfileMe } from "@/hooks/useProfileMe";

type SessionLike = {
  accessToken?: string; // backend access token (credentials)
  provider?: SocialProvider;
  providerAccessToken?: string; // OAuth access_token (google+github)
  providerIdToken?: string; // OAuth id_token (google only)
  user?: { email?: string | null };
};

function pickTokenForExchange(session: SessionLike): {
  token?: string;
  kind: "access_token" | "id_token" | "none";
} {
  if (session.provider === "google") {
    if (session.providerAccessToken)
      return { token: session.providerAccessToken, kind: "access_token" };
    if (session.providerIdToken)
      return { token: session.providerIdToken, kind: "id_token" };
    return { kind: "none" };
  }
  if (session.provider === "github") {
    if (session.providerAccessToken)
      return { token: session.providerAccessToken, kind: "access_token" };
    return { kind: "none" };
  }
  return { kind: "none" };
}

export default function ProfilePage() {
  const { status, me, loading, error, logout, session } = useProfileMe();

  if (status === "loading")
    return <div style={{ padding: 24 }}>Loading...</div>;
  if (status !== "authenticated")
    return <div style={{ padding: 24 }}>Not signed in</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Profile</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "tomato" }}>{error}</p>}

      <pre
        style={{
          background: "#111",
          padding: 12,
          borderRadius: 8,
          overflow: "auto",
        }}
      >
        {JSON.stringify({ nextAuthSession: session, me }, null, 2)}
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
