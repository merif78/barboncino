import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { dogFormSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  const { data: dog, error } = await supabaseAdmin
    .from("Dog")
    .select("*, weightHistory:WeightHistory(*)")
    .eq("id", id)
    .eq("userId", session.user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento del cane" }, { status: 500 });
  }

  if (!dog) {
    return NextResponse.json({ error: "Cane non trovato" }, { status: 404 });
  }

  // Ordina lo storico peso per data crescente
  if (dog.weightHistory) {
    dog.weightHistory.sort((a: { date: string }, b: { date: string }) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  return NextResponse.json({ dog });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = dogFormSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from("Dog")
      .select("id")
      .eq("id", id)
      .eq("userId", session.user.id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: "Cane non trovato" }, { status: 404 });
    }

    const { birthDate, ...rest } = parsed.data;

    const { data: dog, error } = await supabaseAdmin
      .from("Dog")
      .update({
        ...rest,
        birthDate: birthDate ? new Date(birthDate).toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ dog });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante l'aggiornamento del cane" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  const { data: existing } = await supabaseAdmin
    .from("Dog")
    .select("id")
    .eq("id", id)
    .eq("userId", session.user.id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Cane non trovato" }, { status: 404 });
  }

  const { error } = await supabaseAdmin.from("Dog").delete().eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante l'eliminazione del cane" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
