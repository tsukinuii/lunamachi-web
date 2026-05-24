import { Skeleton } from "./Skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
};

export default meta;

export const Card = {
  render: () => (
    <div className="w-72 rounded-md border border-border bg-card p-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="mt-4 h-4 w-2/3" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>
  ),
};
