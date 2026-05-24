import { AccommodationCard } from "./AccommodationCard";

const meta = {
  title: "Features/Accommodations/AccommodationCard",
  component: AccommodationCard,
};

export default meta;

export const Default = {
  args: {
    item: {
      id: "villa-1",
      name: "Moonlight Pool Villa",
      city: "Chiang Mai",
      province: "Chiang Mai",
      country: "Thailand",
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      pricePerNight: 4200,
      currency: "THB",
    },
  },
};
