export type Accommodation = {
  id?: string | number;
  name?: string;
  title?: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  coverImageUrl?: string;
  imageUrl?: string;
  pricePerNight?: number;
  currency?: string;
};

export type AccommodationListParams = {
  page?: number;
  limit?: number;
  locale?: string;
};

export type AccommodationListResponse = {
  data?:
    | Accommodation[]
    | {
        data?: Accommodation[];
        items?: Accommodation[];
        results?: Accommodation[];
        accommodations?: Accommodation[];
      };
  items?: Accommodation[];
  results?: Accommodation[];
  accommodations?: Accommodation[];
  total?: number;
  page?: number;
  limit?: number;
};
