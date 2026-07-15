import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
  const dog = await prisma.dog.findFirst({
    where: { id, userId: session.user.id },
    include: { weightHistory: { orderBy: { date: "asc" } } },
  });

  if (!dog) {
    return NextResponse.json({ error: "Cane non trovato" }, { status: 404 });
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

    const existing = await prisma.dog.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) {
      return NextResponse.json({ error: "Cane non trovato" }, { status: 404 });
    }

    const { birthDate, ...rest } = parsed.data;

    const dog = await prisma.dog.update({
      where: { id },
      data: {
        ...rest,
        birthDate: birthDate ? new Date(birthDate) : undefined,
      },
    });

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

  const existing = await prisma.dog.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) {
    return NextResponse.json({ error: "Cane non trovato" }, { status: 404 });
  }

  await prisma.dog.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
