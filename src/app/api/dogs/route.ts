import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dogFormSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const dogs = await prisma.dog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

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

    const dog = await prisma.dog.create({
      data: {
        ...rest,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ dog }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante la creazione del cane" }, { status: 500 });
  }
}
