import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { walkFormSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dogId = searchParams.get("dogId");

  let query = supabaseAdmin
    .from("Walk")
    .select("*")
    .eq("userId", session.user.id)
    .order("date", { ascending: false });

  if (dogId) {
    query = query.eq("dogId", dogId);
  }

  const { data: walks, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento delle attività" }, { status: 500 });
  }

  return NextResponse.json({ walks });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = walkFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const { date, ...rest } = parsed.data;

    const { data: walk, error } = await supabaseAdmin
      .from("Walk")
      .insert({
        id: crypto.randomUUID(),
        ...rest,
        date: new Date(date).toISOString(),
        userId: session.user.id,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ walk }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante il salvataggio dell'attività" }, { status: 500 });
  }
}
