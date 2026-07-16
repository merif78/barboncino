import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { data: photos, error } = await supabaseAdmin
    .from("Gallery")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento delle foto" }, { status: 500 });
  }

  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url, caption, dogId } = body;

    if (!url || !dogId) {
      return NextResponse.json({ error: "URL e cane sono obbligatori" }, { status: 400 });
    }

    const { data: photo, error } = await supabaseAdmin
      .from("Gallery")
      .insert({
        id: crypto.randomUUID(),
        url,
        caption,
        dogId,
        userId: session.user.id,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante il salvataggio della foto" }, { status: 500 });
  }
}
