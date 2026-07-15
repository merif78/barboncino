"use client";

import * as React from "react";

export function useSearch(query: string) {
  const [results, setResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    let active = true;
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (active) setResults(data.results ?? []);
      } finally {
        if (active) setIsLoading(false);
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query]);

  return { results, isLoading };
}
