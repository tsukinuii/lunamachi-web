"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { getCsrfToken } from "@/lib/http/csrf";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    // 1) ยิง BFF เพื่อให้ backend set refresh cookie ลง browser
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF": getCsrfToken(),
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      alert("login backend failed");
      return;
    }

    // 2) ค่อย signIn เพื่อให้ NextAuth มี session/jwt ของมัน
    const r = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log(r);
  };

  return (
    <div style={{ padding: 24 }}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        type="password"
      />
      <button onClick={onLogin}>Login</button>

      <button
        className="mt-4 rounded border p-2 mr-2"
        onClick={() => signIn("google")}
      >
        Login with Google
      </button>
      <button
        className="mt-4 rounded border p-2"
        onClick={() => signIn("github")}
      >
        Login with GitHub
      </button>
    </div>
  );
}
