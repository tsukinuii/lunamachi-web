"use client";

import { signOut } from "next-auth/react";
import { logoutBackend } from "@/features/auth/auth.service";
import { useProfileMe } from "@/features/auth/useProfileMe";

export default function ProfilePage() {
  const { status, me, loading, error, session } = useProfileMe();

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
          background: "#f0f0f0",
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
