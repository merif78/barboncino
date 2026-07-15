import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
  const event = await prisma.event.findFirst({
    where: { id, userId: session.user.id },
    include: { dog: true },
  });

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

    const existing = await prisma.event.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) {
      return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
    }

    const { date, ...rest } = parsed.data;

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...rest,
        date: date ? new Date(date) : undefined,
      },
    });

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

  const existing = await prisma.event.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) {
    return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
  }

  await prisma.event.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
