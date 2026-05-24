import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginWithBackend } from "@/features/auth/auth.service";

export const {
  auth,
  handlers,
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

        const user = result?.data?.user ?? result?.user ?? result?.data ?? {};
        const id = user?.id ?? user?.email ?? credentials.email;

        return {
          id: String(id),
          email: user.email ?? (credentials.email as string),
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
});
