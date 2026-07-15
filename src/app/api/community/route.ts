import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const articles = await prisma.article.findMany({
    take: 10,
    orderBy: { publishedAt: "desc" },
    include: { author: true, _count: { select: { comments: true, likes: true } } },
  });

  return NextResponse.json({ articles });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { articleId, content, userId } = body;

    if (!articleId || !content || !userId) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: { articleId, content, userId },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante l'invio del commento" }, { status: 500 });
  }
}
