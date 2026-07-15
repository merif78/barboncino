"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/use-search";
import { ArticleCard } from "@/components/shared/article-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function CercaPage() {
  const [query, setQuery] = React.useState("");
  const { results, isLoading } = useSearch(query);

  return (
    <div className="container max-w-3xl py-12">
      <h1 className="mb-6 text-center text-3xl font-bold text-brown-600">Cerca nel sito</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brown-400" />
        <Input
          placeholder="Cerca articoli su alimentazione, salute, toelettatura..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && <LoadingSkeleton count={3} />}

      {!isLoading && query && results.length === 0 && (
        <p className="text-center text-brown-400">Nessun risultato trovato per &quot;{query}&quot;</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((result: any) => (
          <ArticleCard
            key={result.slug ?? result.id}
            slug={result.slug}
            title={result.title}
            subtitle={result.subtitle}
            imageUrl={result.imageUrl}
            readingTime={result.readingTime ?? 5}
            publishedAt={result.publishedAt ?? new Date()}
            category={result.category}
          />
        ))}
      </div>
    </div>
  );
}
