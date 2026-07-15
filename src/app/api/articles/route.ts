import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const take = Number(searchParams.get("take") ?? 20);

  const articles = await prisma.article.findMany({
    where: category ? { category: { slug: category } } : undefined,
    orderBy: { publishedAt: "desc" },
    take,
    include: { category: true, author: true },
  });

  return NextResponse.json({ articles });
}
