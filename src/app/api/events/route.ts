import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { eventFormSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dogId = searchParams.get("dogId");

  let query = supabaseAdmin
    .from("Event")
    .select("*, dog:Dog(id, name, photo)")
    .eq("userId", session.user.id)
    .order("date", { ascending: true });

  if (dogId) {
    query = query.eq("dogId", dogId);
  }

  const { data: events, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento degli eventi" }, { status: 500 });
  }

  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = eventFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const { date, ...rest } = parsed.data;

    const { data: event, error } = await supabaseAdmin
      .from("Event")
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

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante la creazione dell'evento" }, { status: 500 });
  }
}
