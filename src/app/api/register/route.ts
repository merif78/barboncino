import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";
import { hashPassword } from "@/lib/password";
import { registerFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    const { data: existing } = await supabaseAdmin.from("User").select("id").eq("email", email).maybeSingle();
    if (existing) {
      return NextResponse.json({ error: "Esiste già un account con questa email" }, { status: 409 });
    }

    const { data: user, error } = await supabaseAdmin
      .from("User")
      .insert({
        id: crypto.randomUUID(),
        name,
        email,
        password: hashPassword(password),
        role: "USER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select("id, name, email")
      .single();

    if (error) throw error;

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante la registrazione" }, { status: 500 });
  }
}
