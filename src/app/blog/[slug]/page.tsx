import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";

import { supabaseAdmin } from "@/lib/supabase";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/shared/article-card";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: article } = await supabaseAdmin
    .from("Article")
    .select("title, subtitle, imageUrl")
    .eq("slug", slug)
    .maybeSingle();
  if (!article) return {};
  return {
    title: article.title,
    description: article.subtitle ?? undefined,
    openGraph: { images: article.imageUrl ? [article.imageUrl] : undefined },
  };
}

export async function generateStaticParams() {
  try {
    const { data: articles } = await supabaseAdmin.from("Article").select("slug");
    return (articles ?? []).map((a: { slug: string }) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const { data: article } = await supabaseAdmin
    .from("Article")
    .select("*, author:User(id, name, image), category:Category(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (!article) notFound();

  const { data: related } = await supabaseAdmin
    .from("Article")
    .select("*, category:Category(*)")
    .eq("categoryId", article.categoryId ?? "")
    .neq("id", article.id)
    .limit(3);

  return (
    <article className="container max-w-3xl py-12">
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: article.title }]} />

      <div className="mt-6">
        {article.category && <Badge variant="pink">{article.category.name}</Badge>}
        <h1 className="mt-3 text-4xl font-bold text-brown-600">{article.title}</h1>
        {article.subtitle && <p className="mt-2 text-lg text-brown-400">{article.subtitle}</p>}

        <div className="mt-4 flex items-center gap-4 text-sm text-brown-500">
          <span>{article.author?.name}</span>
          <span>·</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {article.readingTime} min di lettura
          </span>
        </div>
      </div>

      {article.imageUrl && (
        <div className="relative mt-8 h-80 w-full overflow-hidden rounded-xl">
          <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="prose prose-brown mt-8 max-w-none whitespace-pre-line text-brown-600">
        {article.content}
      </div>

      {(related ?? []).length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-brown-600">Articoli correlati</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {(related ?? []).map((a) => (
              <ArticleCard
                key={a.id}
                slug={a.slug}
                title={a.title}
                subtitle={a.subtitle}
                imageUrl={a.imageUrl}
                readingTime={a.readingTime}
                publishedAt={a.publishedAt}
                category={a.category}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
