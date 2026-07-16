import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const take = Number(searchParams.get("take") ?? 20);

  let query = supabaseAdmin
    .from("Article")
    .select("*, category:Category(*), author:User(id, name, image, email)")
    .order("publishedAt", { ascending: false })
    .limit(take);

  if (category) {
    query = query.eq("category.slug", category);
  }

  const { data: articles, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento degli articoli" }, { status: 500 });
  }

  return NextResponse.json({ articles });
}
