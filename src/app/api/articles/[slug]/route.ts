import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  const { data: article, error } = await supabaseAdmin
    .from("Article")
    .select("*, category:Category(*), author:User(id, name, image, email), comments:Comment(*, user:User(id, name, image))")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento dell'articolo" }, { status: 500 });
  }

  if (!article) {
    return NextResponse.json({ error: "Articolo non trovato" }, { status: 404 });
  }

  return NextResponse.json({ article });
}
