import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  slug: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  readingTime: number;
  publishedAt: Date | string;
  category?: { name: string } | null;
}

export function ArticleCard({
  slug,
  title,
  subtitle,
  imageUrl,
  readingTime,
  publishedAt,
  category,
}: ArticleCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="group h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-44 w-full overflow-hidden bg-beige-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl">🐩</div>
          )}
          {category && (
            <Badge className="absolute left-3 top-3" variant="pink">
              {category.name}
            </Badge>
          )}
        </div>
        <CardContent className="pt-4">
          <h3 className="line-clamp-2 text-lg font-semibold text-brown-600">{title}</h3>
          {subtitle && <p className="mt-1 line-clamp-2 text-sm text-brown-400">{subtitle}</p>}

          <div className="mt-3 flex items-center justify-between text-xs text-brown-500">
            <span>{formatDate(publishedAt)}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {readingTime} min
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
