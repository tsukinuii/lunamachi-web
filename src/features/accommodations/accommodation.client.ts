import { apiFetch } from "@/lib/http/client";
import {
  Accommodation,
  AccommodationListParams,
  AccommodationListResponse,
} from "./accommodation.types";

function pickItems(data: AccommodationListResponse): Accommodation[] {
  const nested = data?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(nested)) return nested;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.accommodations)) return data.accommodations;
  if (nested && !Array.isArray(nested)) {
    if (Array.isArray(nested.data)) return nested.data;
    if (Array.isArray(nested.items)) return nested.items;
    if (Array.isArray(nested.results)) return nested.results;
    if (Array.isArray(nested.accommodations)) return nested.accommodations;
  }

  return [];
}

export async function getAccommodationsClient(
  params: AccommodationListParams = {},
) {
  const search = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
    locale: params.locale ?? "th",
  });

  const data = await apiFetch<AccommodationListResponse>(`/api/accommodations?${search}`);
  return pickItems(data);
}
