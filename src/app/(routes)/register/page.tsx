"use client";

import { useState } from "react";
import {
  requestRegisterOtp,
  verifyRegisterOtp,
} from "@/features/auth/services/auth.client";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("test");
  const [name, setName] = useState("test");
  const [lastname, setLastname] = useState("test");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [msg, setMsg] = useState<string>("");

  const onRequestOtp = async () => {
    setMsg("");
    try {
      await requestRegisterOtp(email);
      setStep(2);
      setMsg("ส่ง OTP แล้ว");
    } catch (e: any) {
      setMsg("request-otp ไม่ผ่าน");
    }
  };

  const onVerifyOtp = async () => {
    setMsg("");
    try {
      await verifyRegisterOtp({ email, otp, password, username, name, lastname, avatarUrl });
      setMsg("สมัครสำเร็จ กำลัง login...");
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/",
      });
    } catch (e: any) {
      setMsg("verify-otp ไม่ผ่าน");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h1>Register</h1>

      <div style={{ marginTop: 12 }}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {step === 1 && (
        <button style={{ marginTop: 12 }} onClick={onRequestOtp}>
          Request OTP
        </button>
      )}

      {step === 2 && (
        <>
          <div style={{ marginTop: 12 }}>
            <input
              placeholder="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button style={{ marginTop: 12 }} onClick={onVerifyOtp}>
            Verify OTP & Register
          </button>
        </>
      )}

      {!!msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
