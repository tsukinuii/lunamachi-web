export const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const BFF_ORIGIN = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export function backendApiUrl(path: string) {
  if (!BACKEND_API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_API_BASE_URL}${normalizedPath}`;
}
