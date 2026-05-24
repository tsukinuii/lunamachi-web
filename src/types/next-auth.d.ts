import NextAuth from "next-auth";
import { SocialProvider } from "@/features/auth/types";

declare module "next-auth" {
  interface Session {
    provider?: SocialProvider;
    providerAccessToken?: string;
    providerIdToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: SocialProvider;
    providerAccessToken?: string;
    providerIdToken?: string;
  }
}
