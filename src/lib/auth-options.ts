import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { loginWithBackend, getMe } from "@/services/auth/auth.service";

export const authOptions: NextAuthOptions = {
  debug: true,
  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // ✅ ทำให้ access_token ใช้กับ userinfo ได้ชัวร์
          scope: "openid email profile",
          prompt: "consent",
        },
      },
    }),

    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials) return null;

        const result = await loginWithBackend({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        const accessToken = result?.data?.accessToken ?? result?.accessToken;
        if (!accessToken) return null;

        const me = await getMe(accessToken);
        const u = (me as any)?.data ?? me;
        if (!u?.id) return null;

        return {
          id: String(u.id),
          email: u.email ?? (credentials.email as string),
          accessToken,
        } as any;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // credentials
      if (user && (user as any).accessToken) {
        (token as any).accessToken = (user as any).accessToken;
      }

      // social
      if (account?.provider) {
        (token as any).provider = account.provider;

        // ✅ เรา "บังคับใช้ access_token เท่านั้น"
        if (account.access_token) (token as any).providerAccessToken = account.access_token;

        // log
        console.log("[nextauth][jwt]", {
          provider: account.provider,
          hasAccessToken: !!account.access_token,
          accessTokenLen: account.access_token?.length ?? 0,
        });
      }

      return token;
    },

    async session({ session, token }) {
      (session as any).provider = (token as any).provider;
      (session as any).providerAccessToken = (token as any).providerAccessToken;
      (session as any).accessToken = (token as any).accessToken;

      console.log("[nextauth][session]", {
        provider: (session as any).provider,
        hasProviderAccessToken: !!(session as any).providerAccessToken,
        providerAccessTokenLen: ((session as any).providerAccessToken as string | undefined)?.length ?? 0,
      });

      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/profile`;
    },
  },
};