import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data: articles, error } = await supabaseAdmin
    .from("Article")
    .select("*, author:User(id, name, image, email), Comment(count), Like(count)")
    .order("publishedAt", { ascending: false })
    .limit(10);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento degli articoli" }, { status: 500 });
  }

  // Normalizza i conteggi nel formato atteso dai componenti
  const normalized = (articles ?? []).map((a) => ({
    ...a,
    _count: {
      comments: (a.Comment as Array<{ count: number }>)?.[0]?.count ?? 0,
      likes: (a.Like as Array<{ count: number }>)?.[0]?.count ?? 0,
    },
    Comment: undefined,
    Like: undefined,
  }));

  return NextResponse.json({ articles: normalized });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { articleId, content, userId } = body;

    if (!articleId || !content || !userId) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const { data: comment, error } = await supabaseAdmin
      .from("Comment")
      .insert({
        id: crypto.randomUUID(),
        articleId,
        content,
        userId,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante l'invio del commento" }, { status: 500 });
  }
}
