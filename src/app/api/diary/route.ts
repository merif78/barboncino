import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { diaryFormSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dogId = searchParams.get("dogId");

  let query = supabaseAdmin
    .from("Diary")
    .select("*")
    .eq("userId", session.user.id)
    .order("date", { ascending: false });

  if (dogId) {
    query = query.eq("dogId", dogId);
  }

  const { data: entries, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento del diario" }, { status: 500 });
  }

  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = diaryFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const { date, ...rest } = parsed.data;

    const { data: entry, error } = await supabaseAdmin
      .from("Diary")
      .insert({
        id: crypto.randomUUID(),
        ...rest,
        date: new Date(date).toISOString(),
        userId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante il salvataggio della voce" }, { status: 500 });
  }
}
