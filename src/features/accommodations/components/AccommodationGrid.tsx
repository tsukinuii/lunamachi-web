import { Accommodation } from "../accommodation.types";
import { AccommodationCard } from "./AccommodationCard";

type AccommodationGridProps = {
  items: Accommodation[];
};

export function AccommodationGrid({ items }: AccommodationGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
      {items.map((item, index) => (
        <AccommodationCard key={item.id ?? index} item={item} />
      ))}
    </div>
  );
}
