export function safeDecodeJwt(token: string) {
  try {
    const [headerPart, payloadPart] = token.split(".");
    if (!headerPart || !payloadPart) return null;

    const header = JSON.parse(Buffer.from(headerPart, "base64url").toString("utf8"));
    const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));

    return {
      header: { alg: header?.alg, kid: header?.kid, typ: header?.typ },
      payload: {
        iss: payload?.iss,
        aud: payload?.aud,
        azp: payload?.azp,
        sub: payload?.sub,
        email: payload?.email,
        email_verified: payload?.email_verified,
        exp: payload?.exp,
        iat: payload?.iat,
      },
    };
  } catch {
    return null;
  }
}
