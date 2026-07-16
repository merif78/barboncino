import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { weightFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = weightFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const { date, dogId, ...rest } = parsed.data;

    const { data: dog } = await supabaseAdmin
      .from("Dog")
      .select("id")
      .eq("id", dogId)
      .eq("userId", session.user.id)
      .maybeSingle();

    if (!dog) {
      return NextResponse.json({ error: "Cane non trovato" }, { status: 404 });
    }

    const { data: entry, error } = await supabaseAdmin
      .from("WeightHistory")
      .insert({
        id: crypto.randomUUID(),
        ...rest,
        date: new Date(date).toISOString(),
        dogId,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Aggiorna anche i valori correnti sul profilo del cane
    await supabaseAdmin
      .from("Dog")
      .update({ weight: rest.weight, height: rest.height, updatedAt: new Date().toISOString() })
      .eq("id", dogId);

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante il salvataggio della misurazione" }, { status: 500 });
  }
}
