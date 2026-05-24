import { AccommodationGrid } from "@/features/accommodations/components/AccommodationGrid";
import { getAccommodationsServer } from "@/features/accommodations/accommodation.service";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const items = await getAccommodationsServer({
    page: 1,
    limit: 20,
    locale: "th",
  }).catch(() => []);

  return (
    <main className="mx-auto max-w-[var(--container-page)] px-6 py-8">
      <header className="mb-6">
        <h1 className="m-0 text-3xl font-semibold text-foreground">LunaMachi Stays</h1>
        <p className="mt-2 text-muted-foreground">
          Server-rendered accommodation list for SEO-friendly pages.
        </p>
        <div className="mt-4 flex gap-2">
          <Button>Explore stays</Button>
          <Button variant="secondary">View deals</Button>
        </div>
      </header>

      {items.length > 0 ? (
        <AccommodationGrid items={items} />
      ) : (
        <p className="text-muted-foreground">No accommodations available.</p>
      )}
    </main>
  );
}
