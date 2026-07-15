import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/shared/article-card";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guide, consigli e curiosità sul mondo del barboncino, scritti da appassionati per appassionati.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="container py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-brown-600">Il nostro blog</h1>
        <p className="mt-2 text-brown-500">
          {articles.length} articoli su alimentazione, salute, toelettatura e molto altro
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
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

      {articles.length === 0 && (
        <p className="py-16 text-center text-brown-400">
          Nessun articolo disponibile al momento. Esegui il seed del database per popolare i contenuti.
        </p>
      )}
    </div>
  );
}
