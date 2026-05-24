import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { loginWithBackend } from "@/features/auth/services/auth.client";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
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

        if (!result) return null;

        const user = result?.data?.user ?? result?.user ?? result?.data ?? {};
        const id = user?.id ?? user?.email ?? credentials.email;

        return {
          id: String(id),
          email: user.email ?? (credentials.email as string),
        } as any;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider) {
        token.provider = account.provider as any;
        if (account.access_token) token.providerAccessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      session.provider = token.provider;
      session.providerAccessToken = token.providerAccessToken;
      session.providerIdToken = token.providerIdToken;

      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/profile`;
    },
  },
};
