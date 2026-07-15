import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true, author: true, comments: { include: { user: true } } },
  });

  if (!article) {
    return NextResponse.json({ error: "Articolo non trovato" }, { status: 404 });
  }

  return NextResponse.json({ article });
}
