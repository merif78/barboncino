import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

    const dog = await prisma.dog.findFirst({ where: { id: dogId, userId: session.user.id } });
    if (!dog) {
      return NextResponse.json({ error: "Cane non trovato" }, { status: 404 });
    }

    const entry = await prisma.weightHistory.create({
      data: {
        ...rest,
        date: new Date(date),
        dogId,
      },
    });

    // Aggiorna anche i valori correnti sul profilo del cane
    await prisma.dog.update({
      where: { id: dogId },
      data: { weight: rest.weight, height: rest.height },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante il salvataggio della misurazione" }, { status: 500 });
  }
}
