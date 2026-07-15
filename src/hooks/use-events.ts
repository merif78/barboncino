"use client";

import * as React from "react";

export function useEvents(dogId?: string) {
  const [events, setEvents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchEvents = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const url = dogId ? `/api/events?dogId=${dogId}` : "/api/events";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Errore nel caricamento degli eventi");
      const data = await res.json();
      setEvents(data.events ?? []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [dogId]);

  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, error, refresh: fetchEvents };
}
