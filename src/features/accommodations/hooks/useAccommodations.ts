"use client";

import { useEffect, useState } from "react";
import { getAccommodations } from "../services/accommodations.client";
import { Accommodation } from "../types";

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
        const data = await getAccommodations({
          page: 1,
          limit: 20,
          locale: "th",
        });

        if (alive) setItems(data);
      } catch (e: any) {
        if (alive) setError(e?.message || "Load accommodations failed");
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
