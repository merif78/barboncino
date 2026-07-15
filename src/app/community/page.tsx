import type { Metadata } from "next";
import { MessageCircle, Users, Heart } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Community",
  description: "Unisciti alla community italiana di appassionati di barboncino: condividi esperienze e consigli.",
};

export const revalidate = 3600;

export default async function CommunityPage() {
  const articles = await prisma.article.findMany({
    take: 6,
    orderBy: { publishedAt: "desc" },
    include: { author: true, _count: { select: { comments: true, likes: true } } },
  });

  return (
    <div className="container py-12">
      <div className="mb-10 text-center">
        <Users className="mx-auto mb-3 h-10 w-10 text-pink-400" />
        <h1 className="text-4xl font-bold text-brown-600">Community Barboncino</h1>
        <p className="mt-2 text-brown-500">
          Migliaia di appassionati condividono ogni giorno consigli, foto e storie sui loro barboncini
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
            <MessageCircle className="h-8 w-8 text-blue-400" />
            <p className="text-2xl font-bold text-brown-600">2.480+</p>
            <p className="text-sm text-brown-400">discussioni attive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
            <Users className="h-8 w-8 text-pink-400" />
            <p className="text-2xl font-bold text-brown-600">15.200+</p>
            <p className="text-sm text-brown-400">membri iscritti</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
            <Heart className="h-8 w-8 text-pink-400" />
            <p className="text-2xl font-bold text-brown-600">48.000+</p>
            <p className="text-sm text-brown-400">foto condivise</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-brown-600">Ultime discussioni dal blog</h2>
        <div className="grid gap-4">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardContent className="flex items-center justify-between gap-4 pt-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={article.author.image ?? undefined} />
                    <AvatarFallback>{article.author.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-brown-600">{article.title}</p>
                    <p className="text-xs text-brown-400">
                      {article.author.name} · {formatDate(article.publishedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm text-brown-400">
                  <span>💬 {article._count.comments}</span>
                  <span>❤️ {article._count.likes}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
