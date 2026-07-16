import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { eventFormSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  const { data: event, error } = await supabaseAdmin
    .from("Event")
    .select("*, dog:Dog(id, name, photo)")
    .eq("id", id)
    .eq("userId", session.user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento dell'evento" }, { status: 500 });
  }

  if (!event) {
    return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
  }

  return NextResponse.json({ event });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = eventFormSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from("Event")
      .select("id")
      .eq("id", id)
      .eq("userId", session.user.id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
    }

    const { date, ...rest } = parsed.data;

    const { data: event, error } = await supabaseAdmin
      .from("Event")
      .update({
        ...rest,
        date: date ? new Date(date).toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ event });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante l'aggiornamento dell'evento" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  const { data: existing } = await supabaseAdmin
    .from("Event")
    .select("id")
    .eq("id", id)
    .eq("userId", session.user.id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
  }

  const { error } = await supabaseAdmin.from("Event").delete().eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante l'eliminazione dell'evento" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
