"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SearchResult {
  type: "article" | "dog";
  slug?: string;
  id?: string;
  title: string;
  subtitle?: string;
}

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results ?? []);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle className="sr-only">Cerca nel sito</DialogTitle>
        <div className="flex items-center gap-2 border-b border-beige-200 pb-3">
          <Search className="h-5 w-5 text-brown-400" />
          <Input
            autoFocus
            placeholder="Cerca articoli, guide..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-brown-400" />}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 && query && !loading && (
            <p className="py-6 text-center text-sm text-brown-400">Nessun risultato trovato.</p>
          )}
          {results.map((result, idx) => (
            <button
              key={idx}
              onClick={() => {
                onOpenChange(false);
                if (result.type === "article") router.push(`/blog/${result.slug}`);
              }}
              className="flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left hover:bg-beige-100"
            >
              <span className="font-medium text-brown-600">{result.title}</span>
              {result.subtitle && <span className="text-xs text-brown-400">{result.subtitle}</span>}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
