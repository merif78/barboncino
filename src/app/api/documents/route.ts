import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { data: documents, error } = await supabaseAdmin
    .from("Document")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento dei documenti" }, { status: 500 });
  }

  return NextResponse.json({ documents });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, url, type, dogId } = body;

    if (!name || !url || !dogId) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const { data: document, error } = await supabaseAdmin
      .from("Document")
      .insert({
        id: crypto.randomUUID(),
        name,
        url,
        type: type || "altro",
        dogId,
        userId: session.user.id,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante il salvataggio del documento" }, { status: 500 });
  }
}
