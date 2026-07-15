import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { walkFormSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dogId = searchParams.get("dogId");

  const walks = await prisma.walk.findMany({
    where: {
      userId: session.user.id,
      ...(dogId ? { dogId } : {}),
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ walks });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = walkFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const { date, ...rest } = parsed.data;

    const walk = await prisma.walk.create({
      data: {
        ...rest,
        date: new Date(date),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ walk }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante il salvataggio dell'attività" }, { status: 500 });
  }
}
