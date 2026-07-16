import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, bio, image } = body;

    const { data: user, error } = await supabaseAdmin
      .from("User")
      .update({ name, bio, image, updatedAt: new Date().toISOString() })
      .eq("id", session.user.id)
      .select("id, name, email, bio, image")
      .single();

    if (error) throw error;

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante l'aggiornamento del profilo" }, { status: 500 });
  }
}
