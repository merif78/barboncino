import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { dogFormSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { data: dogs, error } = await supabaseAdmin
    .from("Dog")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento dei cani" }, { status: 500 });
  }

  return NextResponse.json({ dogs });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = dogFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const { birthDate, ...rest } = parsed.data;

    const { data: dog, error } = await supabaseAdmin
      .from("Dog")
      .insert({
        id: crypto.randomUUID(),
        ...rest,
        birthDate: birthDate ? new Date(birthDate).toISOString() : null,
        userId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ dog }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante la creazione del cane" }, { status: 500 });
  }
}
