import type { Metadata } from "next";

import { supabaseAdmin } from "@/lib/supabase";
import { ArticleCard } from "@/components/shared/article-card";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guide, consigli e curiosità sul mondo del barboncino, scritti da appassionati per appassionati.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const { data: articles } = await supabaseAdmin
    .from("Article")
    .select("*, category:Category(*)")
    .order("publishedAt", { ascending: false });

  const list = articles ?? [];

  return (
    <div className="container py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-brown-600">Il nostro blog</h1>
        <p className="mt-2 text-brown-500">
          {list.length} articoli su alimentazione, salute, toelettatura e molto altro
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((article) => (
          <ArticleCard
            key={article.id}
            slug={article.slug}
            title={article.title}
            subtitle={article.subtitle}
            imageUrl={article.imageUrl}
            readingTime={article.readingTime}
            publishedAt={article.publishedAt}
            category={article.category}
          />
        ))}
      </div>

      {list.length === 0 && (
        <p className="py-16 text-center text-brown-400">
          Nessun articolo disponibile al momento. Esegui lo script SQL per popolare i contenuti.
        </p>
      )}
    </div>
  );
}
