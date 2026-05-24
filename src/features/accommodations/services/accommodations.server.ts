import { backendApiUrl } from "@/server/bff/config";
import {
  AccommodationListParams,
  AccommodationListResponse,
} from "../types";

export async function getAccommodationsServer(
  params: AccommodationListParams = {},
) {
  const search = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
    locale: params.locale ?? "th",
  });

  const res = await fetch(
    backendApiUrl(`/api/accommodations?${search}`),
    {
      next: { revalidate: 60 },
    },
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || "Load accommodations failed");
  }

  return data as AccommodationListResponse;
}
