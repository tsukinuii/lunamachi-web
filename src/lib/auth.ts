import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginWithBackend } from "@/services/auth/auth.service";

export const {
  auth,      // ✅ ต้องมีตัวนี้
  handlers,  // ✅ สำหรับ route
} = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials) return null;

        const result = await loginWithBackend({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        if (!result) return null;

        return {
          id: result.user.id,
          email: result.user.email,
          accessToken: result.accessToken,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as any).accessToken) token.accessToken = (user as any).accessToken;
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
});