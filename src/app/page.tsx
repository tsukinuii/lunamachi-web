import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export default async function Home() {
  const s = await getServerSession(authOptions);
  return <pre>{JSON.stringify(s, null, 2)}</pre>;
}