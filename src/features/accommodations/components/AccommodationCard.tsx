import { Accommodation } from "../accommodation.types";

function getTitle(item: Accommodation) {
  return item.name ?? item.title ?? `Accommodation ${item.id ?? ""}`.trim();
}

function getLocation(item: Accommodation) {
  return [item.city, item.province, item.country].filter(Boolean).join(", ");
}

type AccommodationCardProps = {
  item: Accommodation;
};

export function AccommodationCard({ item }: AccommodationCardProps) {
  const imageUrl = item.coverImageUrl ?? item.imageUrl;

  return (
    <article
      className="overflow-hidden rounded-md border border-border bg-card text-card-foreground"
    >
      <div
        className="aspect-[4/3] overflow-hidden bg-muted"
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={getTitle(item)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      <div className="p-3">
        <h2 className="m-0 text-base font-semibold">{getTitle(item)}</h2>
        {getLocation(item) && (
          <p className="mt-1.5 text-muted-foreground">
            {getLocation(item)}
          </p>
        )}
        {typeof item.pricePerNight === "number" && (
          <p className="mt-2.5 font-semibold">
            {item.pricePerNight.toLocaleString("th-TH")} {item.currency ?? "THB"}
          </p>
        )}
      </div>
    </article>
  );
}
