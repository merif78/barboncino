import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const { data: articles, error } = await supabaseAdmin
    .from("Article")
    .select("*, category:Category(*)")
    .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,content.ilike.%${query}%`)
    .order("publishedAt", { ascending: false })
    .limit(10);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante la ricerca" }, { status: 500 });
  }

  return NextResponse.json({ results: articles });
}
