"use client";

import { useEffect, useState } from "react";
import { getAccommodationsClient } from "./accommodation.client";
import { Accommodation } from "./accommodation.types";

export function useAccommodations() {
  const [items, setItems] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getAccommodationsClient({
          page: 1,
          limit: 20,
          locale: "th",
        });

        if (alive) setItems(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Load accommodations failed";
        if (alive) setError(message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { items, loading, error };
}
