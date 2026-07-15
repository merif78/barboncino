"use client";

import * as React from "react";

export function useDogs() {
  const [dogs, setDogs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchDogs = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dogs");
      if (!res.ok) throw new Error("Errore nel caricamento dei cani");
      const data = await res.json();
      setDogs(data.dogs ?? []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  return { dogs, isLoading, error, refresh: fetchDogs };
}
