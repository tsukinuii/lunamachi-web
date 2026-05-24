import { getAccommodationsServer } from "@/features/accommodations/services/accommodations.server";
import { Accommodation } from "@/features/accommodations/types";

function pickItems(data: any): Accommodation[] {
  const candidates = [
    data?.data,
    data?.items,
    data?.results,
    data?.data?.items,
    data?.data?.results,
    data?.data?.data,
  ];

  return candidates.find(Array.isArray) ?? [];
}

function getTitle(item: Accommodation) {
  return item.name ?? item.title ?? `Accommodation ${item.id ?? ""}`.trim();
}

function getLocation(item: Accommodation) {
  return [item.city, item.province, item.country].filter(Boolean).join(", ");
}

export default async function HomePage() {
  const data = await getAccommodationsServer({
    page: 1,
    limit: 20,
    locale: "th",
  });
  const items = pickItems(data);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, margin: 0 }}>LunaMachi Stays</h1>
        <p style={{ color: "#666", marginTop: 8 }}>
          Server-rendered accommodation list for SEO-friendly pages.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((item, index) => {
          const imageUrl = item.coverImageUrl ?? item.imageUrl;

          return (
            <article
              key={item.id ?? index}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <div
                style={{
                  aspectRatio: "4 / 3",
                  background: "#f2f2f2",
                  overflow: "hidden",
                }}
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

              <div style={{ padding: 12 }}>
                <h2 style={{ fontSize: 16, margin: 0 }}>{getTitle(item)}</h2>
                {getLocation(item) && (
                  <p style={{ color: "#666", margin: "6px 0 0" }}>
                    {getLocation(item)}
                  </p>
                )}
                {typeof item.pricePerNight === "number" && (
                  <p style={{ fontWeight: 600, margin: "10px 0 0" }}>
                    {item.pricePerNight.toLocaleString("th-TH")}{" "}
                    {item.currency ?? "THB"}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
